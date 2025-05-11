import { useState, useEffect } from 'react';
import {
  BarChart,
  CheckCircle,
  Clock,
  AlertTriangle,
  ThumbsUp,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Users,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useStats } from '../../hooks/useStats';
import Loader from '../ui/Loader';

interface StatisticsPanelProps {
  refreshInterval?: number; // in seconds
}

const StatisticsPanel: React.FC<StatisticsPanelProps> = ({
  refreshInterval = 60 // default to 60 seconds
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const { stats, loading, error, refreshStats } = useStats();

  // Update lastUpdated timestamp whenever stats are refreshed
  useEffect(() => {
    if (stats && !loading) {
      setLastUpdated(new Date());
    }
  }, [stats, loading]);

  // Manual refresh handler
  const handleRefresh = () => {
    refreshStats();
  };

  // If loading or no stats, show loading state
  if (loading || !stats) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 p-6">
        <div className="flex justify-center items-center h-40">
          <Loader size="large" />
        </div>
      </div>
    );
  }

  // If error, show error state
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 p-6">
        <div className="flex flex-col justify-center items-center h-40 text-center">
          <AlertCircle className="h-10 w-10 text-error-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to load statistics</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={refreshStats}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors flex items-center"
          >
            <RefreshCw size={16} className="mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate percentages
  const { issueStats, categoryStats } = stats;
  const resolvedPercentage = issueStats.total > 0 ? Math.round((issueStats.resolved / issueStats.total) * 100) : 0;
  const pendingPercentage = issueStats.total > 0 ? Math.round((issueStats.pending / issueStats.total) * 100) : 0;
  const inProgressPercentage = issueStats.total > 0 ? Math.round((issueStats.inProgress / issueStats.total) * 100) : 0;

  // Sort categories by count
  const sortedCategories = Object.entries(categoryStats)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCategoryValue = sortedCategories.length > 0
    ? Math.max(...Object.values(categoryStats))
    : 0;

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6 transition-all duration-300">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between cursor-pointer" onClick={toggleExpanded}>
          <div className="flex items-center">
            <BarChart className="h-5 w-5 text-primary-600 dark:text-primary-400 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Real-Time Statistics</h3>
          </div>
          <div className="flex items-center">
            <button
              onClick={(e) => {
                e.stopPropagation();
                refreshStats();
              }}
              className="mr-3 p-1.5 rounded-full text-gray-500 hover:text-primary-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              title="Refresh statistics"
            >
              <RefreshCw size={16} />
            </button>
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
              {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
            </button>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 flex items-center">
          <Clock size={12} className="mr-1" />
          Last updated: {lastUpdated.toLocaleTimeString()}
        </div>
      </div>

      <div
        className={`p-5 overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Issue Status Stats */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Issue Status</h4>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <CheckCircle size={16} className="text-success-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Resolved</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {issueStats.resolved} issues ({resolvedPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-success-600 h-2.5 rounded-full"
                    style={{ width: `${resolvedPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <Clock size={16} className="text-warning-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">In Progress</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {issueStats.inProgress} issues ({inProgressPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-warning-600 h-2.5 rounded-full"
                    style={{ width: `${inProgressPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center">
                    <AlertTriangle size={16} className="text-error-600 mr-2" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Pending</span>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {issueStats.pending} issues ({pendingPercentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div
                    className="bg-error-600 h-2.5 rounded-full"
                    style={{ width: `${pendingPercentage}%` }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <ThumbsUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Total Upvotes</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{stats.upvoteStats.total.toLocaleString()}</span>
                </div>
                <div className="flex items-center mt-2 text-xs">
                  {stats.upvoteStats.percentChange > 0 ? (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <TrendingUp size={14} className="mr-1" />
                      <span>{stats.upvoteStats.percentChange}% increase this week</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 dark:text-red-400">
                      <TrendingDown size={14} className="mr-1" />
                      <span>{Math.abs(stats.upvoteStats.percentChange)}% decrease this week</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MessageSquare className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Comments</span>
                  </div>
                  <span className="text-lg font-semibold text-gray-900 dark:text-white">{stats.commentStats.total.toLocaleString()}</span>
                </div>
                <div className="flex items-center mt-2 text-xs">
                  {stats.commentStats.percentChange > 0 ? (
                    <div className="flex items-center text-green-600 dark:text-green-400">
                      <TrendingUp size={14} className="mr-1" />
                      <span>{stats.commentStats.percentChange}% increase this week</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-red-600 dark:text-red-400">
                      <TrendingDown size={14} className="mr-1" />
                      <span>{Math.abs(stats.commentStats.percentChange)}% decrease this week</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Category Distribution */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Top Categories</h4>

            <div className="space-y-3">
              {sortedCategories.map(([category, count]) => (
                <div key={category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                      {category.replace('-', ' ')}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{count} issues</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                    <div
                      className="bg-primary-600 h-2.5 rounded-full"
                      style={{ width: `${(count / maxCategoryValue) * 100}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Active Users</span>
                </div>
                <span className="text-lg font-semibold text-gray-900 dark:text-white">{stats.userStats.active.toLocaleString()}</span>
              </div>
              <div className="flex items-center mt-2 text-xs">
                {stats.userStats.percentChange > 0 ? (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <TrendingUp size={14} className="mr-1" />
                    <span>{stats.userStats.percentChange}% increase this month</span>
                  </div>
                ) : (
                  <div className="flex items-center text-red-600 dark:text-red-400">
                    <TrendingDown size={14} className="mr-1" />
                    <span>{Math.abs(stats.userStats.percentChange)}% decrease this month</span>
                  </div>
                )}
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                Total registered users: {stats.userStats.total.toLocaleString()}
              </div>
            </div>

            <div className="mt-4 text-center">
              <button
                onClick={refreshStats}
                className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center justify-center mx-auto"
              >
                <RefreshCw size={14} className="mr-1.5" />
                Refresh statistics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsPanel;
