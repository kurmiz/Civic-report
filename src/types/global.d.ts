import L from 'leaflet';

declare global {
  interface Window {
    leafletMap?: L.Map;
  }
}

export {};
