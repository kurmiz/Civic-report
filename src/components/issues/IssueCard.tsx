import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  MessageSquare, ThumbsUp, Share2, Clock, MapPin,
  AlertTriangle, CheckCircle, Loader2, Eye, ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { CategoryBadge } from './CategoryBadge';
import { Issue } from '../../types';
import Button from '../ui/Button';
import { addTimestampToUrl } from '../../utils/imageUtils';

interface IssueCardProps {
  issue: Issue;
  onUpvote: (id: string) => void;
}

const IssueCard: React.FC<IssueCardProps> = ({ issue, onUpvote }) => {
  const { isAuthenticated } = useAuth();
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Add hover animation effect with a more reliable approach
  useEffect(() => {
    let isMounted = true;
    let observer: IntersectionObserver | null = null;

    // Make sure the card is visible initially
    if (cardRef.current) {
      cardRef.current.style.opacity = '1';
    }

    // Use requestAnimationFrame to ensure DOM is ready
    const animationFrame = requestAnimationFrame(() => {
      if (!isMounted || !cardRef.current) return;

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting && cardRef.current) {
              // Add animation class with a slight delay to ensure stability
              setTimeout(() => {
                if (cardRef.current) {
                  cardRef.current.classList.add('animate-slide-up-stable');
                }
              }, 50);

              if (observer) {
                observer.unobserve(entry.target);
              }
            }
          });
        },
        { threshold: 0.1, rootMargin: '20px' }
      );

      if (cardRef.current) {
        observer.observe(cardRef.current);
      }
    });

    return () => {
      isMounted = false;
      cancelAnimationFrame(animationFrame);

      if (observer) {
        observer.disconnect();
      }
    };
  }, []);

  const timeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 30) {
      const months = Math.floor(days / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  const handleShare = () => {
    const url = `${window.location.origin}/issue/${issue.id}`;
    navigator.clipboard.writeText(url);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  const handleUpvote = () => {
    if (isAuthenticated) {
      onUpvote(issue.id);
    }
  };

  const getStatusIcon = () => {
    switch (issue.status) {
      case 'resolved':
        return <CheckCircle size={14} className="mr-1 text-success-600" />;
      case 'in-progress':
        return <Loader2 size={14} className="mr-1 text-warning-600 animate-spin" />;
      case 'pending':
        return <AlertTriangle size={14} className="mr-1 text-gray-500" />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={cardRef}
      className="card card-hover transition-all duration-300 opacity-100"
      style={{ opacity: 1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center">
            {issue.author?.avatar_url ? (
              <img
                src={addTimestampToUrl(issue.author.avatar_url)}
                alt={issue.author.name || 'User'}
                className="h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800 shadow-sm"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center ring-2 ring-white dark:ring-gray-800 shadow-sm">
                <MapPin className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              </div>
            )}
            <div className="ml-3">
              <p className="font-medium text-gray-900 dark:text-white">{issue.author?.name || 'Anonymous'}</p>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock size={14} className="mr-1" />
                <span>{timeAgo(issue.created_at)}</span>
                <span className="mx-1.5">•</span>
                <div className="flex items-center">
                  {getStatusIcon()}
                  <span className="capitalize">{issue.status}</span>
                </div>
              </div>
            </div>
          </div>
          <CategoryBadge category={issue.category} />
        </div>

        <Link to={`/issue/${issue.id}`} className="block hover:no-underline group">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {issue.title}
          </h3>
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-2">
            {issue.description}
          </p>
        </Link>

        <div className="relative h-52 mb-4 rounded-lg overflow-hidden shadow-sm group">
          <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700">
            {issue.image_url ? (
              <>
                {!isImageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
                  </div>
                )}
                <img
                  src={issue.image_url}
                  alt={issue.title}
                  className={`h-full w-full object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
                  onLoad={() => setIsImageLoaded(true)}
                />
              </>
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <MapPin className="h-10 w-10 text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>

          {/* Location badge */}
          <div className="absolute bottom-2 left-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm py-1 px-2 rounded-md text-xs flex items-center text-gray-700 dark:text-gray-300 shadow-sm">
            <MapPin size={12} className="mr-1 text-primary-600" />
            {issue.location}
          </div>

          {/* View details overlay on hover */}
          <div className={`absolute inset-0 bg-black/50 flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-full p-2 shadow-lg transform transition-transform duration-300 hover:scale-110">
              <Eye className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button
              variant={issue.has_upvoted ? "primary" : "outline"}
              size="sm"
              onClick={handleUpvote}
              leftIcon={<ThumbsUp size={16} className={issue.has_upvoted ? "text-white" : ""} />}
              disabled={!isAuthenticated}
              className="group transition-all duration-200"
            >
              <span>{issue.upvotes_count || 0}</span>
            </Button>

            <Link to={`/issue/${issue.id}`} className="no-underline">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<MessageSquare size={16} />}
                className="transition-all duration-200"
              >
                <span>{issue.comments_count || 0}</span>
              </Button>
            </Link>

            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Share2 size={16} />}
                onClick={handleShare}
                className="transition-all duration-200"
              >
                Share
              </Button>

              {showShareTooltip && (
                <div className="absolute bottom-full left-0 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap animate-fade-in shadow-lg">
                  Link copied to clipboard!
                </div>
              )}
            </div>
          </div>

          <Link to={`/issue/${issue.id}`} className="no-underline">
            <Button
              variant="outline"
              size="sm"
              className="transition-all duration-200 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <span className="flex items-center">
                Details
                <ArrowUpRight size={14} className="ml-1" />
              </span>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default IssueCard;