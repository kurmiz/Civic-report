import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import {
  ArrowLeft,
  MessageSquare,
  ThumbsUp,
  Share2,
  Clock,
  MapPin,
  AlertCircle,
  SendHorizontal
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { CategoryBadge } from '../components/issues/CategoryBadge';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { useIssues } from '../hooks/useIssues';
import { issueAPI, commentAPI } from '../services/api';
import { Issue, Comment } from '../types';
import Chatbot from '../components/chatbot/Chatbot';
import { issueDetailsFAQs } from '../data/chatbotFAQs';
import { addTimestampToUrl } from '../utils/imageUtils';

const IssueDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { getIssueById, upvoteIssue, addComment } = useIssues();

  const [issue, setIssue] = useState<Issue | undefined>(undefined);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [showShareTooltip, setShowShareTooltip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Debounced function to fetch comments
  const fetchComments = useCallback(async (issueId: string) => {
    if (!issueId) return;

    try {
      const commentsResponse = await commentAPI.getComments(issueId);
      setComments(commentsResponse.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    let commentsTimer: NodeJS.Timeout;

    const loadData = async () => {
      try {
        if (!id) return;

        // Only show loading on initial load
        if (!issue) {
          setLoading(true);
        }

        // First try to get the issue from the local state
        let issueData;
        try {
          issueData = await getIssueById(id);
        } catch (error) {
          console.error('Error getting issue from local state:', error);
        }

        // If not found in local state, fetch it directly from API
        if (!issueData) {
          try {
            const response = await issueAPI.getIssue(id);
            issueData = response.data;
            if (!issueData) {
              navigate('/not-found');
              return;
            }
          } catch (error) {
            console.error('Error fetching issue from API:', error);
            navigate('/not-found');
            return;
          }
        }

        // Only update state if component is still mounted
        if (isMounted) {
          setIssue(issueData);
          setLoading(false);

          // Fetch comments with a slight delay to avoid rate limiting
          commentsTimer = setTimeout(() => {
            if (isMounted) {
              fetchComments(id);
            }
          }, 500);
        }
      } catch (error) {
        console.error('Error loading issue details:', error);
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadData();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
      if (commentsTimer) {
        clearTimeout(commentsTimer);
      }
    };
  }, [id, navigate, getIssueById, fetchComments]);

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    setShowShareTooltip(true);
    setTimeout(() => setShowShareTooltip(false), 2000);
  };

  const handleUpvote = () => {
    if (isAuthenticated && issue) {
      upvoteIssue(issue.id);
      // Update local state to reflect the change immediately
      setIssue(prev => {
        if (!prev) return prev;
        const hasUpvoted = !prev.has_upvoted;
        return {
          ...prev,
          upvotes_count: hasUpvoted ? (prev.upvotes_count || 0) + 1 : Math.max(0, (prev.upvotes_count || 0) - 1),
          has_upvoted: hasUpvoted
        };
      });
    }
  };

  const handleSubmitComment = async () => {
    if (!isAuthenticated || !issue || !commentText.trim()) return;

    try {
      setIsSubmitting(true);

      // Call the API to add a comment
      await commentAPI.addComment(issue.id, commentText);

      // Also call the addComment function from useIssues to update the issue's comment count
      addComment(issue.id, commentText);

      // Clear the comment text
      setCommentText('');

      // Update issue comment count
      setIssue(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          comments_count: (prev.comments_count || 0) + 1
        };
      });

      // Fetch updated comments after a short delay
      setTimeout(() => {
        if (id) {
          fetchComments(id);
        }
      }, 500);
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only show loader on initial load, not during updates
  if (loading && !issue) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader size="large" />
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="flex flex-col items-center justify-center h-96 px-4">
        <AlertCircle size={48} className="text-error-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Issue not found</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">
          The issue you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate('/')}>Return to Home</Button>
      </div>
    );
  }

  const timeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diff = now.getTime() - past.getTime();

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Issue Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div className="flex items-center">
              {issue.author?.avatar_url ? (
                <img
                  src={addTimestampToUrl(issue.author.avatar_url)}
                  alt={issue.author.name || 'User'}
                  className="h-10 w-10 rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
              )}
              <div className="ml-3">
                <p className="font-medium text-gray-900 dark:text-white">{issue.author?.name || 'Anonymous'}</p>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Clock size={14} className="mr-1" />
                  <span>{timeAgo(issue.created_at)}</span>
                </div>
              </div>
            </div>
            <CategoryBadge category={issue.category} size="md" />
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">
            {issue.title}
          </h1>

          <div className="flex items-center mt-2 text-sm text-gray-600 dark:text-gray-400">
            <MapPin size={16} className="mr-1" />
            {issue.location}
          </div>

          {issue.status === 'resolved' && (
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800 dark:bg-success-800 dark:text-success-200">
                Resolved
              </span>
            </div>
          )}

          {issue.status === 'in-progress' && (
            <div className="mt-3">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800 dark:bg-warning-800 dark:text-warning-200">
                In Progress
              </span>
            </div>
          )}
        </div>

        {/* Issue Content */}
        <div className="p-6">
          {/* Description */}
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
              {issue.description}
            </p>
          </div>

          {/* Image */}
          {issue.image_url && (
            <div className="mt-6">
              <img
                src={issue.image_url}
                alt={issue.title}
                className="w-full h-auto rounded-lg object-cover max-h-96"
              />
            </div>
          )}

          {/* Map */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              Location
            </h2>
            <div className="h-64 rounded-lg overflow-hidden">
              {/* Key prop forces re-render when issue changes */}
              <MapContainer
                key={`map-${issue.id}-${Date.now()}`}
                center={[issue.lat, issue.lng]}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                zoomControl={false}
                fadeAnimation={true}
                markerZoomAnimation={true}
                whenCreated={(map) => {
                  console.log('Map created successfully');
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
                <Marker position={[issue.lat, issue.lng]} />
              </MapContainer>
            </div>
          </div>

          {/* Actions */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex space-x-2">
              <Button
                variant={issue.has_upvoted ? "primary" : "outline"}
                size="md"
                onClick={handleUpvote}
                leftIcon={<ThumbsUp size={18} />}
                disabled={!isAuthenticated}
              >
                <span>{issue.upvotes_count || 0}</span>
              </Button>

              <Button
                variant="outline"
                size="md"
                leftIcon={<MessageSquare size={18} />}
                onClick={() => document.getElementById('comment-box')?.focus()}
              >
                <span>{comments.length}</span>
              </Button>

              <div className="relative">
                <Button
                  variant="outline"
                  size="md"
                  leftIcon={<Share2 size={18} />}
                  onClick={handleShare}
                >
                  Share
                </Button>

                <div className={`absolute bottom-full left-0 mb-2 px-2 py-1 text-xs bg-gray-800 text-white rounded whitespace-nowrap transition-opacity duration-300 ${
                  showShareTooltip ? 'opacity-100' : 'opacity-0 pointer-events-none'
                }`}>
                  Link copied to clipboard!
                </div>
              </div>
            </div>
          </div>

          <hr className="my-6 border-gray-200 dark:border-gray-700" />

          {/* Comments */}
          <div className="mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Comments ({comments.length})
            </h2>

            {isAuthenticated ? (
              <div className="mb-6">
                <div className="flex items-start space-x-3">
                  {user?.avatar_url ? (
                    <img
                      src={addTimestampToUrl(user.avatar_url)}
                      alt={user.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                  <div className="flex-1">
                    <textarea
                      id="comment-box"
                      className="input min-h-[100px]"
                      placeholder="Add a comment..."
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    ></textarea>
                    <div className="mt-2 flex justify-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleSubmitComment}
                        disabled={!commentText.trim() || isSubmitting}
                        isLoading={isSubmitting}
                        rightIcon={<SendHorizontal size={16} />}
                      >
                        Post Comment
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg mb-6">
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                  <Link to="/login" className="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
                    Sign in
                  </Link> to join the conversation.
                </p>
              </div>
            )}

            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map(comment => (
                  <div key={comment.id} className="flex items-start space-x-3">
                    {comment.author?.avatar_url ? (
                      <img
                        src={addTimestampToUrl(comment.author.avatar_url)}
                        alt={comment.author.name || 'User'}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                        <div className="flex justify-between items-start">
                          <span className="font-medium text-gray-900 dark:text-white text-sm">
                            {comment.author?.name || 'Anonymous'}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            {timeAgo(comment.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 text-sm mt-1">
                          {comment.text}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="mx-auto h-8 w-8 text-gray-400 dark:text-gray-600" />
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  No comments yet. Be the first to share your thoughts!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot
        title="Issue Details Assistant"
        faqs={issueDetailsFAQs}
        position="bottom-right"
      />
    </div>
  );
};

export default IssueDetails;