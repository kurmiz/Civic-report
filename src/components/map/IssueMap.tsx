import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Layers, ZoomIn, ZoomOut } from 'lucide-react';
import { Issue } from '../../types';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

// Ensure Leaflet is properly loaded
if (typeof window !== 'undefined') {
  // Dynamically import Leaflet to ensure it's loaded
  // Note: We're using ES modules with Vite, so we don't use require()
  import('leaflet').then(L => {
    // Make sure Leaflet is properly initialized
    console.log('Leaflet loaded successfully:', L.version);
  }).catch(err => {
    console.error('Error loading Leaflet:', err);
  });
}

// Fix for Leaflet marker icons
import 'leaflet/dist/leaflet.css';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Fix Leaflet default icon
// Create the icon once when the module loads
let defaultIcon: L.Icon;

// Initialize the default icon in a browser-safe way
if (typeof window !== 'undefined') {
  defaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  // Set the default icon for all markers
  // This needs to be done before any markers are created
  try {
    L.Marker.prototype.options.icon = defaultIcon;
  } catch (e) {
    console.error('Error setting default marker icon:', e);
  }
}

// Custom marker icons for different statuses
const createCustomIcon = (status: string) => {
  const colors: Record<string, string> = {
    'pending': '#ef4444', // Red
    'in-progress': '#f59e0b', // Amber
    'resolved': '#10b981', // Green
    'default': '#3b82f6' // Blue
  };

  const color = colors[status] || colors.default;

  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div style="
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: ${color};
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
      </div>
    `,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
  });
};

// Component to recenter map
const RecenterControl = ({ position }: { position: [number, number] }) => {
  const map = useMap();

  const handleRecenter = () => {
    map.setView(position, 13);
  };

  return (
    <div className="leaflet-top leaflet-right">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleRecenter}
          className="flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title="Recenter map"
        >
          <Navigation size={16} />
        </button>
      </div>
    </div>
  );
};

// Layer control component
const LayerControl = () => {
  const map = useMap();
  const [activeLayer, setActiveLayer] = useState<'standard' | 'satellite'>('standard');

  const handleLayerChange = () => {
    if (activeLayer === 'standard') {
      // Remove standard layer
      map.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      // Add satellite layer
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }).addTo(map);

      setActiveLayer('satellite');
    } else {
      // Remove satellite layer
      map.eachLayer(layer => {
        if (layer instanceof L.TileLayer) {
          map.removeLayer(layer);
        }
      });

      // Add standard layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      setActiveLayer('standard');
    }
  };

  return (
    <div className="leaflet-bottom leaflet-right mb-10">
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleLayerChange}
          className="flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          title={activeLayer === 'standard' ? 'Switch to satellite view' : 'Switch to standard view'}
        >
          <Layers size={16} />
        </button>
      </div>
    </div>
  );
};

interface IssueMapProps {
  issues: Issue[];
  height?: string;
  initialPosition?: [number, number];
  initialZoom?: number;
}

const IssueMap: React.FC<IssueMapProps> = ({
  issues,
  height = '500px',
  initialPosition = [40.7128, -74.0060], // New York City
  initialZoom = 13
}) => {
  const [userPosition, setUserPosition] = useState<[number, number] | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [mapKey, setMapKey] = useState(Date.now()); // Add a key to force re-render
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  // Ensure Leaflet is available in the browser environment
  useEffect(() => {
    // Make sure we're in a browser environment with window object
    if (typeof window !== 'undefined') {
      // Set map as ready after a short delay to ensure DOM is fully rendered
      const timer = setTimeout(() => {
        setMapReady(true);
        // Force re-render of the map component
        setMapKey(Date.now());
      }, 300);

      return () => clearTimeout(timer);
    }
  }, []);

  // Function to get user's current location
  const getUserLocation = () => {
    setIsLoadingLocation(true);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userCoords = [position.coords.latitude, position.coords.longitude] as [number, number];
          setUserPosition(userCoords);

          // If we have a map reference, center it on the user's location
          if (window.leafletMap) {
            window.leafletMap.setView(userCoords, initialZoom);
            console.log('Centered map on user location:', userCoords);
          }

          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting user location:', error);
          setIsLoadingLocation(false);
        },
        { timeout: 10000, enableHighAccuracy: true, maximumAge: 0 }
      );
    } else {
      console.error('Geolocation is not supported by this browser');
      setIsLoadingLocation(false);
    }
  };

  // Get user's location when map is ready
  useEffect(() => {
    if (mapReady) {
      getUserLocation();
    }
  }, [mapReady, initialZoom]);

  return (
    <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 dark:border-gray-700" style={{ height }}>
      {!mapReady ? (
        <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
          <div className="animate-pulse-subtle text-center">
            <MapPin size={32} className="mx-auto mb-2 text-primary-500" />
            <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
          </div>
        </div>
      ) : (
        <MapContainer
          key={`map-container-${mapKey}`}
          center={userPosition || initialPosition}
          zoom={initialZoom}
          style={{ height: '100%', width: '100%' }}
          zoomControl={false}
          whenCreated={(map) => {
            console.log('Map created successfully');
            // Store map reference globally
            window.leafletMap = map;
            // Force a resize event to ensure the map renders correctly
            setTimeout(() => {
              map.invalidateSize();
            }, 100);
          }}
        >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          eventHandlers={{
            add: () => {
              console.log('TileLayer added to map');
            },
            loading: () => {
              console.log('Tiles are loading');
            },
            load: () => {
              console.log('Tiles loaded successfully');
            },
            error: (e) => {
              console.error('Error loading tiles:', e);
            }
          }}
        />

        {/* Add custom controls */}
        <div className="leaflet-top leaflet-left">
          <div className="leaflet-control leaflet-bar">
            <button
              onClick={() => document.querySelector('.leaflet-control-zoom-in')?.dispatchEvent(new Event('click'))}
              className="flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Zoom in"
            >
              <ZoomIn size={16} />
            </button>
            <button
              onClick={() => document.querySelector('.leaflet-control-zoom-out')?.dispatchEvent(new Event('click'))}
              className="flex items-center justify-center w-8 h-8 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border-t border-gray-200 dark:border-gray-700"
              title="Zoom out"
            >
              <ZoomOut size={16} />
            </button>
          </div>
        </div>

        {/* My location control */}
        <div className="leaflet-bottom leaflet-right mb-10 mr-2">
          <div className="leaflet-control">
            <button
              onClick={getUserLocation}
              className="flex items-center justify-center w-10 h-10 bg-primary-600 dark:bg-primary-700 text-white rounded-full shadow-lg hover:bg-primary-700 dark:hover:bg-primary-800 transition-colors"
              title="Go to my location"
              disabled={isLoadingLocation}
            >
              {isLoadingLocation ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Navigation size={18} />
              )}
            </button>
          </div>
        </div>

        {userPosition && <RecenterControl position={userPosition} />}
        <LayerControl />

        {/* User location marker */}
        {userPosition && (
          <Marker
            position={userPosition}
            icon={L.divIcon({
              className: 'user-location-marker',
              html: `
                <div style="
                  width: 24px;
                  height: 24px;
                  border-radius: 50%;
                  background-color: #3b82f6;
                  border: 3px solid white;
                  box-shadow: 0 0 0 2px #3b82f6, 0 0 10px rgba(59, 130, 246, 0.5);
                  animation: pulse 1.5s infinite;
                "></div>
                <style>
                  @keyframes pulse {
                    0% { transform: scale(1); opacity: 1; }
                    50% { transform: scale(1.3); opacity: 0.7; }
                    100% { transform: scale(1); opacity: 1; }
                  }
                </style>
              `,
              iconSize: [24, 24],
              iconAnchor: [12, 12]
            })}
          >
            <Popup>
              <div className="text-center">
                <strong>Your location</strong>
                <p className="text-xs text-gray-500 mt-1">
                  Lat: {userPosition[0].toFixed(6)}<br />
                  Lng: {userPosition[1].toFixed(6)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Issue markers */}
        {issues.map(issue => (
          <Marker
            key={issue.id}
            position={[issue.lat, issue.lng]}
            icon={createCustomIcon(issue.status)}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                <p className="text-sm text-gray-600 mt-1 mb-2">{issue.location}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full capitalize ${
                    issue.status === 'resolved'
                      ? 'bg-green-100 text-green-800'
                      : issue.status === 'in-progress'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {issue.status.replace('-', ' ')}
                  </span>
                  <Link to={`/issue/${issue.id}`}>
                    <Button variant="primary" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        </MapContainer>
      )}
    </div>
  );
};

export default IssueMap;
