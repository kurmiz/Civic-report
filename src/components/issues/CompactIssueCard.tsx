import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MessageSquare, ThumbsUp } from 'lucide-react';
import { Issue } from '../../types';
import { CategoryBadge } from './CategoryBadge';
import { addTimestampToUrl } from '../../utils/imageUtils';

interface CompactIssueCardProps {
  issue: Issue;
}

const CompactIssueCard: React.FC<CompactIssueCardProps> = ({ issue }) => {
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
    <Link to={`/issue/${issue.id}`} className="block hover:no-underline">
      <div className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-primary-700 flex items-center justify-center">
                {issue.author?.avatar_url ? (
                  <img
                    src={addTimestampToUrl(issue.author.avatar_url)}
                    alt={issue.author.name}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-white text-sm font-medium">
                    {issue.author?.name?.charAt(0) || '?'}
                  </span>
                )}
              </div>
              <div className="ml-2">
                <div className="text-white text-sm font-medium">
                  {issue.author?.name || 'Anonymous'}
                </div>
                <div className="flex items-center">
                  <Clock size={14} className="text-gray-400 mr-1" />
                  <span className="text-gray-400 text-xs">{timeAgo(issue.created_at)}</span>
                  <span className="mx-1.5 text-gray-500">•</span>
                  <span className="text-gray-400 text-xs capitalize">{issue.status}</span>
                </div>
              </div>
            </div>
            <CategoryBadge category={issue.category} size="sm" />
          </div>

          <h3 className="text-white font-semibold mb-1">{issue.title}</h3>

          <p className="text-gray-400 text-sm line-clamp-2 mb-3">
            {issue.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-400 text-xs">
              <div className="flex items-center mr-3">
                <ThumbsUp size={14} className="mr-1" />
                <span>{issue.upvotes_count || 0}</span>
              </div>
              <div className="flex items-center">
                <MessageSquare size={14} className="mr-1" />
                <span>{issue.comments_count || 0}</span>
              </div>
            </div>
            <div className="text-xs text-gray-400">
              {issue.location}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CompactIssueCard;
