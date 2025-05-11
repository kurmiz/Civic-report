import { useState, useEffect } from 'react';
import { User, Save, X, Upload } from 'lucide-react';
import Button from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';

interface ProfileEditFormProps {
  onCancel: () => void;
  onSave: () => void;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ onCancel, onSave }) => {
  const { user, updateProfile } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    avatar_url: user?.avatar_url || ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    // Set preview URL to current avatar if it exists
    if (user?.avatar_url) {
      // Add a timestamp to prevent caching
      const timestamp = new Date().getTime();
      const avatarUrl = user.avatar_url.includes('?')
        ? `${user.avatar_url}&t=${timestamp}`
        : `${user.avatar_url}?t=${timestamp}`;
      setPreviewUrl(avatarUrl);
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, avatar: 'Please upload an image file' }));
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'Image must be less than 2MB' }));
      return;
    }

    // Create a preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    // In a real app, you would upload the file to a server here
    // For now, we'll use a data URL for the avatar
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setFormData(prev => ({
        ...prev,
        avatar_url: dataUrl
      }));
    };
    reader.readAsDataURL(file);

    // Clear any avatar errors
    if (errors.avatar) {
      setErrors(prev => ({ ...prev, avatar: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsLoading(true);

      // Call the updateProfile function from AuthContext
      await updateProfile({
        name: formData.name,
        email: formData.email,
        bio: formData.bio,
        location: formData.location,
        avatar_url: formData.avatar_url
      });

      toast.success('Profile updated successfully');
      onSave();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <div className="h-24 w-24 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 mb-4">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <User size={40} className="text-gray-400" />
              </div>
            )}
          </div>

          <label htmlFor="avatar-upload" className="absolute bottom-0 right-0 bg-primary-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
            <Upload size={16} />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </label>
        </div>

        {errors.avatar && (
          <p className="text-error-600 text-sm mt-1">{errors.avatar}</p>
        )}

        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Click the icon to upload a new profile picture
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className={`input w-full ${errors.name ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
            placeholder="Your name"
          />
          {errors.name && (
            <p className="text-error-600 text-sm mt-1">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={`input w-full ${errors.email ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
            placeholder="Your email"
          />
          {errors.email && (
            <p className="text-error-600 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <input
            id="location"
            name="location"
            type="text"
            value={formData.location}
            onChange={handleChange}
            className="input w-full"
            placeholder="Your location (optional)"
          />
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={3}
            className="input w-full"
            placeholder="Tell us about yourself (optional)"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          leftIcon={<X size={16} />}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          leftIcon={<Save size={16} />}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
