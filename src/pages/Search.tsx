import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, AlertCircle, Filter } from 'lucide-react';
import IssueCard from '../components/issues/IssueCard';
import CompactIssueCard from '../components/issues/CompactIssueCard';
import Button from '../components/ui/Button';
import Loader from '../components/ui/Loader';
import { Issue } from '../types';
import { issueAPI } from '../services/api';
import FilterPanel, { FilterOptions } from '../components/issues/FilterPanel';
import { useIssues } from '../hooks/useIssues';
import Chatbot from '../components/chatbot/Chatbot';
import { homeFAQs } from '../data/chatbotFAQs';

const Search = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const { upvoteIssue } = useIssues();
  const [sortBy, setSortBy] = useState<string>('latest');
  const [filterBy, setFilterBy] = useState<string>('all');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery) {
        setIssues([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await issueAPI.searchIssues(searchQuery);
        setIssues(response.data);
      } catch (err) {
        console.error('Error searching issues:', err);
        setError('Failed to fetch search results. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  const handleFilterChange = (filters: FilterOptions) => {
    // Apply status filters
    if (filters.status.length > 0) {
      setFilterBy(filters.status[0]);
    } else if (filters.category.length > 0) {
      setFilterBy(filters.category[0]);
    } else {
      setFilterBy('all');
    }

    // Apply sort
    setSortBy(filters.sortBy as any);
  };

  // Filter and sort issues
  const filteredIssues = issues.filter(issue => {
    if (filterBy === 'all') return true;
    if (filterBy === 'pending' || filterBy === 'in-progress' || filterBy === 'resolved') {
      return issue.status === filterBy;
    }
    return issue.category === filterBy;
  });

  const sortedIssues = [...filteredIssues].sort((a, b) => {
    switch (sortBy) {
      case 'latest':
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      case 'oldest':
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      case 'most-upvotes':
        return (b.upvotes_count || 0) - (a.upvotes_count || 0);
      case 'least-upvotes':
        return (a.upvotes_count || 0) - (b.upvotes_count || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Search Results
        </h1>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <SearchIcon size={18} className="mr-2" />
          <p>
            {loading ? (
              'Searching...'
            ) : (
              <>
                {issues.length} {issues.length === 1 ? 'result' : 'results'} for <span className="font-medium text-primary-600 dark:text-primary-400">"{searchQuery}"</span>
              </>
            )}
          </p>
        </div>
      </div>

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

      {/* View Mode Toggle */}
      <div className="flex justify-end mb-4">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 flex">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium flex items-center ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 shadow-sm'
                : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            <span className="grid grid-cols-2 gap-0.5 mr-1.5">
              <span className="w-1.5 h-1.5 bg-current rounded-sm"></span>
              <span className="w-1.5 h-1.5 bg-current rounded-sm"></span>
              <span className="w-1.5 h-1.5 bg-current rounded-sm"></span>
              <span className="w-1.5 h-1.5 bg-current rounded-sm"></span>
            </span>
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
            <span className="flex flex-col gap-0.5 mr-1.5">
              <span className="w-4 h-1 bg-current rounded-sm"></span>
              <span className="w-4 h-1 bg-current rounded-sm"></span>
              <span className="w-4 h-1 bg-current rounded-sm"></span>
            </span>
            List
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader size="large" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">Searching for issues...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
          <div className="flex">
            <AlertCircle className="h-5 w-5 text-red-500 dark:text-red-400 mr-3" />
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && sortedIssues.length === 0 && (
        <div className="flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 h-64">
          <SearchIcon size={48} className="text-gray-400 dark:text-gray-500 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No results found</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
            We couldn't find any issues matching "{searchQuery}". Try using different keywords or check your spelling.
          </p>
          <Link to="/">
            <Button variant="outline" className="mt-6">
              Back to Home
            </Button>
          </Link>
        </div>
      )}

      {/* Results - Grid View */}
      {!loading && !error && sortedIssues.length > 0 && viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedIssues.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onUpvote={upvoteIssue}
            />
          ))}
        </div>
      )}

      {/* Results - Compact View */}
      {!loading && !error && sortedIssues.length > 0 && viewMode === 'compact' && (
        <div className="space-y-4">
          {sortedIssues.map(issue => (
            <CompactIssueCard
              key={issue.id}
              issue={issue}
            />
          ))}
        </div>
      )}

      {/* Chatbot */}
      <Chatbot
        title="Search Assistant"
        faqs={homeFAQs}
        position="bottom-right"
      />
    </div>
  );
};

export default Search;
