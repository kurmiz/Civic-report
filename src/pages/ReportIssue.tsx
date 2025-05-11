import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { MapPin, Upload, AlertCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { CategoryBadge } from '../components/issues/CategoryBadge';
import { useIssues } from '../hooks/useIssues';
import { toast } from 'react-hot-toast';
import Chatbot from '../components/chatbot/Chatbot';
import { reportIssueFAQs } from '../data/chatbotFAQs';
import DepartmentSelector from '../components/issues/DepartmentSelector';

interface ReportFormData {
  title: string;
  category: string;
  department: string;
  description: string;
  location: string;
}

interface LocationPickerProps {
  position: [number, number];
  setPosition: (position: [number, number]) => void;
}

const LocationPicker: React.FC<LocationPickerProps> = ({ position, setPosition }) => {
  useMapEvents({
    click: (e) => {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });

  return <Marker position={position} />;
};

const ReportIssue = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { createIssue } = useIssues();

  const [position, setPosition] = useState<[number, number]>([40.7128, -74.0060]); // Default to NYC
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  // Get user's current location when component mounts
  useEffect(() => {
    getUserLocation();
  }, []);

  // Function to get user's current location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setPosition([latitude, longitude]);
          setIsLoadingLocation(false);

          // Try to get address from coordinates using reverse geocoding
          reverseGeocode(latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Please allow location access or manually select a location on the map.');
          setIsLoadingLocation(false);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser');
      setIsLoadingLocation(false);
    }
  };

  // Function to get address from coordinates using reverse geocoding
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      // Using OpenStreetMap's Nominatim service for reverse geocoding
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
      const data = await response.json();

      if (data && data.display_name) {
        // Set the location field value
        setValue('location', data.display_name, { shouldValidate: true });
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      // Don't set an error - the user can still manually enter the location
    }
  };

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<ReportFormData>({
    mode: 'onChange',
    defaultValues: {
      category: 'pothole'
    }
  });

  // Watch the category field to pass to the DepartmentSelector
  const selectedCategory = watch('category');

  if (!isAuthenticated) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center px-4">
        <AlertCircle className="h-12 w-12 text-warning-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Authentication Required</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-6 max-w-md">
          You need to be logged in to report an issue. Please sign in or create an account to continue.
        </p>
        <div className="flex space-x-4">
          <Button variant="primary" onClick={() => navigate('/login')}>Sign In</Button>
          <Button variant="outline" onClick={() => navigate('/signup')}>Create Account</Button>
        </div>
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: ReportFormData) => {
    try {
      setIsSubmitting(true);

      // Prepare the issue data
      const issueData = {
        title: data.title,
        description: data.description,
        category: data.category,
        department: data.department,
        location: data.location,
        lat: position[0],
        lng: position[1],
        image_url: selectedImage || undefined
      };

      // Create the issue using our API
      const result = await createIssue(issueData);

      if (result) {
        toast.success('Issue reported successfully!');
        // Redirect to the home page
        navigate('/');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = [
    { value: 'pothole', label: 'Pothole' },
    { value: 'street-light', label: 'Street Light' },
    { value: 'water-leak', label: 'Water Leak' },
    { value: 'garbage', label: 'Garbage' },
    { value: 'sidewalk', label: 'Sidewalk' },
    { value: 'park', label: 'Park' },
    { value: 'safety', label: 'Safety' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Report an Issue</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Help improve your community by reporting civic issues
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="form-label">
                Issue Title *
              </label>
              <input
                id="title"
                type="text"
                className="input"
                placeholder="E.g., Pothole on Main Street"
                {...register('title', {
                  required: 'Title is required',
                  minLength: {
                    value: 5,
                    message: 'Title must be at least 5 characters'
                  }
                })}
              />
              {errors.title && (
                <p className="form-error">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">Category *</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Controller
                  control={control}
                  name="category"
                  rules={{ required: 'Please select a category' }}
                  render={({ field }) => (
                    <>
                      {categories.map((category) => (
                        <button
                          key={category.value}
                          type="button"
                          onClick={() => field.onChange(category.value)}
                          className={`p-3 rounded-lg border text-sm flex flex-col items-center justify-center transition-colors ${
                            field.value === category.value
                              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/30 dark:border-primary-400'
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                          }`}
                        >
                          <CategoryBadge category={category.value as any} />
                        </button>
                      ))}
                    </>
                  )}
                />
              </div>
              {errors.category && (
                <p className="form-error">{errors.category.message}</p>
              )}
            </div>

            {/* Department Selector */}
            <Controller
              control={control}
              name="department"
              rules={{ required: 'Please select a government department' }}
              render={({ field }) => (
                <DepartmentSelector
                  selectedCategory={selectedCategory}
                  value={field.value}
                  onChange={field.onChange}
                  isRequired={true}
                />
              )}
            />

            <div>
              <label htmlFor="description" className="form-label">
                Description *
              </label>
              <textarea
                id="description"
                rows={4}
                className="input"
                placeholder="Please provide details about the issue..."
                {...register('description', {
                  required: 'Description is required',
                  minLength: {
                    value: 20,
                    message: 'Description must be at least 20 characters'
                  }
                })}
              ></textarea>
              {errors.description && (
                <p className="form-error">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="location" className="form-label">
                Address / Location *
              </label>
              <div className="flex">
                <input
                  id="location"
                  type="text"
                  className="input flex-grow"
                  placeholder="E.g., 123 Main St, or intersection of Main and Oak"
                  {...register('location', {
                    required: 'Location address is required'
                  })}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="ml-2 whitespace-nowrap"
                  onClick={getUserLocation}
                  isLoading={isLoadingLocation}
                  leftIcon={<MapPin size={16} />}
                >
                  Use My Location
                </Button>
              </div>
              {locationError && (
                <p className="text-warning-600 dark:text-warning-400 text-sm mt-1 flex items-center">
                  <AlertCircle size={14} className="mr-1" />
                  {locationError}
                </p>
              )}
              {errors.location && (
                <p className="form-error">{errors.location.message}</p>
              )}
            </div>

            <div>
              <label className="form-label">
                Pin Location on Map *
              </label>
              <div className="relative h-64 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <MapContainer
                  center={position}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  key={`report-map-${Date.now()}`}
                  whenCreated={(map) => {
                    console.log('Report map created successfully');
                    // Force a resize event to ensure the map renders correctly
                    setTimeout(() => {
                      map.invalidateSize();
                    }, 100);
                  }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker position={position} setPosition={setPosition} />
                </MapContainer>

                {/* Map controls overlay */}
                <div className="absolute top-2 right-2 z-[1000]">
                  <Button
                    type="button"
                    variant="primary"
                    size="sm"
                    onClick={getUserLocation}
                    isLoading={isLoadingLocation}
                    className="shadow-md"
                    leftIcon={<MapPin size={16} />}
                  >
                    My Location
                  </Button>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Click on the map to select the exact location of the issue
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  Lat: {position[0].toFixed(6)}, Lng: {position[1].toFixed(6)}
                </p>
              </div>
            </div>

            <div>
              <label className="form-label">
                Upload Image (Optional)
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-700 border-dashed rounded-lg">
                <div className="space-y-1 text-center">
                  {selectedImage ? (
                    <div>
                      <img
                        src={selectedImage}
                        alt="Selected"
                        className="mx-auto h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => setSelectedImage(null)}
                        className="mt-2 text-sm text-red-600 hover:text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600 dark:text-gray-400">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer rounded-md font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300 focus-within:outline-none"
                        >
                          <span>Upload a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            accept="image/*"
                            className="sr-only"
                            onChange={handleImageChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end border-t border-gray-200 dark:border-gray-700">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/')}
              className="mr-3"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={!isValid}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </div>

      {/* Chatbot */}
      <Chatbot
        title="Report Issue Assistant"
        faqs={reportIssueFAQs}
        position="bottom-right"
      />
    </div>
  );
};

export default ReportIssue;