import { useState, useEffect } from 'react';
import { AlertCircle, Filter, MapPin, TrendingUp, Clock, ArrowUp, ArrowDown, Map, List, LayoutGrid, LayoutList } from 'lucide-react';
import IssueCard from '../components/issues/IssueCard';
import CompactIssueCard from '../components/issues/CompactIssueCard';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { useIssues } from '../hooks/useIssues';
import { CategoryBadge } from '../components/issues/CategoryBadge';
import FilterPanel, { FilterOptions } from '../components/issues/FilterPanel';
import StatisticsPanel from '../components/dashboard/StatisticsPanel';
import IssueMap from '../components/map/IssueMap';
import Chatbot from '../components/chatbot/Chatbot';
import { homeFAQs } from '../data/chatbotFAQs';

const Home = () => {
  const {
    issues,
    loading,
    error,
    sortBy,
    filterBy,
    setSortBy,
    setFilterBy,
    upvoteIssue
  } = useIssues();

  const [viewMode, setViewMode] = useState<'list' | 'compact' | 'map'>('list');
  const [mapInitialized, setMapInitialized] = useState(false);
  const [showStats, setShowStats] = useState(true);

  // Effect to handle map initialization when view mode changes
  useEffect(() => {
    if (viewMode === 'map') {
      // Reset map initialization state when switching to map view
      setMapInitialized(true);
    }
  }, [viewMode]);

  const handleFilterChange = (filters: FilterOptions) => {
    // Apply status filters
    if (filters.status.length === 1) {
      setFilterBy(filters.status[0]);
    } else if (filters.status.length > 1) {
      // If multiple statuses, we'd need more complex filtering
      // For now, just use the first one
      setFilterBy(filters.status[0]);
    } else if (filters.category.length === 1) {
      setFilterBy(filters.category[0]);
    } else if (filters.category.length > 1) {
      // If multiple categories, we'd need more complex filtering
      // For now, just use the first one
      setFilterBy(filters.category[0]);
    } else {
      setFilterBy('all');
    }

    // Apply sort
    setSortBy(filters.sortBy as any);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96 px-4">
        <AlertCircle size={48} className="text-error-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to load issues</h2>
        <p className="text-gray-600 dark:text-gray-400 text-center mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Community Issues
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Browse and engage with civic issues in your community
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex space-x-2">
          {/* View toggle buttons */}
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
                viewMode === 'list'
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LayoutGrid size={16} className="mr-1.5" />
              Grid
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
                viewMode === 'compact'
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <LayoutList size={16} className="mr-1.5" />
              List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
                viewMode === 'map'
                  ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Map size={16} className="mr-1.5" />
              Map
            </button>
          </div>

          {/* Stats toggle button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowStats(!showStats)}
            leftIcon={<TrendingUp size={16} />}
            className={showStats ? 'border-primary-500 text-primary-600 dark:text-primary-400' : ''}
          >
            Statistics
          </Button>
        </div>
      </div>

      {/* Statistics Panel - Real-time data */}
      {showStats && <StatisticsPanel refreshInterval={30} />}

      {/* Filter Panel */}
      <FilterPanel
        onFilterChange={handleFilterChange}
        initialFilters={{
          status: filterBy !== 'all' && (filterBy === 'pending' || filterBy === 'resolved' || filterBy === 'in-progress')
            ? [filterBy]
            : [],
          category: filterBy !== 'all' && !(filterBy === 'pending' || filterBy === 'resolved' || filterBy === 'in-progress')
            ? [filterBy]
            : [],
          dateRange: 'all',
          sortBy: sortBy
        }}
      />

      {/* Views Container - Using CSS for transitions instead of conditional rendering */}
      <div className="relative">
        {/* Map View */}
        <div className={`mb-6 transition-all duration-300 ${
          viewMode === 'map'
            ? 'opacity-100 visible h-auto'
            : 'opacity-0 invisible h-0 absolute'
        }`}>
          {viewMode === 'map' && mapInitialized && (
            <IssueMap
              issues={issues}
              height="600px"
              key={`issue-map-${Date.now()}`}
            />
          )}
          {viewMode === 'map' && !mapInitialized && (
            <div className="h-[600px] flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <Loader size="large" />
                <p className="mt-4 text-gray-600 dark:text-gray-400">Loading map...</p>
              </div>
            </div>
          )}
        </div>

        {/* Grid View */}
        <div className={`transition-all duration-300 ${
          viewMode === 'list'
            ? 'opacity-100 visible'
            : 'opacity-0 invisible h-0 absolute'
        }`}>
          {issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 h-64">
              <MapPin size={48} className="text-gray-400 dark:text-gray-500 mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No issues found</h2>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                {filterBy !== 'all'
                  ? `There are no issues matching your current filter.`
                  : `There are no reported issues yet. Be the first to report an issue!`
                }
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {issues.map(issue => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onUpvote={upvoteIssue}
                />
              ))}
            </div>
          )}
        </div>

        {/* Compact List View */}
        <div className={`transition-all duration-300 ${
          viewMode === 'compact'
            ? 'opacity-100 visible'
            : 'opacity-0 invisible h-0 absolute'
        }`}>
          {issues.length === 0 ? (
            <div className="flex flex-col items-center justify-center bg-gray-800 rounded-lg shadow-sm p-8 h-64">
              <MapPin size={48} className="text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">No issues found</h2>
              <p className="text-gray-400 text-center">
                {filterBy !== 'all'
                  ? `There are no issues matching your current filter.`
                  : `There are no reported issues yet. Be the first to report an issue!`
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map(issue => (
                <CompactIssueCard
                  key={issue.id}
                  issue={issue}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot
        title="Community Issues Assistant"
        faqs={homeFAQs}
        position="bottom-right"
      />
    </div>
  );
};

export default Home;