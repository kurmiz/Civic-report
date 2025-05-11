import { MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-[calc(100vh-16rem)] flex flex-col items-center justify-center px-4 text-center">
      <MapPin className="h-20 w-20 text-gray-400 dark:text-gray-600 mb-6" />
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">404</h1>
      <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-4">Page Not Found</h2>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mb-8">
        We couldn't find the page you're looking for. It might have been removed, renamed, or never existed in the first place.
      </p>
      <div className="flex space-x-4">
        <Button 
          variant="primary" 
          onClick={() => window.history.back()}
        >
          Go Back
        </Button>
        <Link to="/">
          <Button variant="outline">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;