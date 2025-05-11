import { useState } from 'react';
import { Filter, X, ChevronDown, Check, MapPin, Calendar, Tag } from 'lucide-react';
import Button from '../ui/Button';

interface FilterPanelProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters?: FilterOptions;
}

export interface FilterOptions {
  status: string[];
  category: string[];
  dateRange: string;
  sortBy: string;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onFilterChange,
  initialFilters = { status: [], category: [], dateRange: 'all', sortBy: 'latest' }
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>(initialFilters);

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' }
  ];

  const categoryOptions = [
    { value: 'pothole', label: 'Pothole' },
    { value: 'street-light', label: 'Street Light' },
    { value: 'garbage', label: 'Garbage' },
    { value: 'water-leak', label: 'Water Leak' },
    { value: 'sidewalk', label: 'Sidewalk' },
    { value: 'park', label: 'Park' },
    { value: 'safety', label: 'Safety' }
  ];

  const dateRangeOptions = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' }
  ];

  const sortOptions = [
    { value: 'latest', label: 'Latest' },
    { value: 'oldest', label: 'Oldest' },
    { value: 'most-upvotes', label: 'Most Upvotes' },
    { value: 'least-upvotes', label: 'Least Upvotes' }
  ];

  const toggleFilter = () => {
    setIsOpen(!isOpen);
  };

  const toggleStatusFilter = (status: string) => {
    setFilters(prev => {
      const newStatus = prev.status.includes(status)
        ? prev.status.filter(s => s !== status)
        : [...prev.status, status];

      return { ...prev, status: newStatus };
    });
  };

  const toggleCategoryFilter = (category: string) => {
    setFilters(prev => {
      const newCategory = prev.category.includes(category)
        ? prev.category.filter(c => c !== category)
        : [...prev.category, category];

      return { ...prev, category: newCategory };
    });
  };

  const setDateRange = (dateRange: string) => {
    setFilters(prev => ({ ...prev, dateRange }));
  };

  const setSortBy = (sortBy: string) => {
    setFilters(prev => ({ ...prev, sortBy }));
  };

  const applyFilters = () => {
    onFilterChange(filters);
    setIsOpen(false);
  };

  const resetFilters = () => {
    const defaultFilters = { status: [], category: [], dateRange: 'all', sortBy: 'latest' };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = filters.status.length > 0 ||
                          filters.category.length > 0 ||
                          filters.dateRange !== 'all';

  return (
    <div className="relative mb-6">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleFilter}
          leftIcon={<Filter size={16} />}
          className={`${hasActiveFilters ? 'border-primary-500 text-primary-600 dark:text-primary-400' : ''}`}
        >
          <span className="flex items-center">
            Filters
            {hasActiveFilters && (
              <span className="ml-1.5 bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-300 text-xs font-medium px-1.5 py-0.5 rounded-full">
                {filters.status.length + filters.category.length + (filters.dateRange !== 'all' ? 1 : 0)}
              </span>
            )}
            <ChevronDown size={14} className="ml-1.5" />
          </span>
        </Button>

        <div className="text-sm text-gray-500 dark:text-gray-400">
          Sorting by: <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">
            {filters.sortBy.replace('-', ' ')}
          </span>
        </div>
      </div>

      <div className={`absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 transition-all duration-300 ${
        isOpen ? 'opacity-100 visible transform translate-y-0' : 'opacity-0 invisible transform -translate-y-4'
      }`}>
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
              <button
                onClick={toggleFilter}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Status filters */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Tag size={16} className="mr-1.5 text-primary-500" />
                  Status
                </h4>
                <div className="space-y-2">
                  {statusOptions.map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        checked={filters.status.includes(option.value)}
                        onChange={() => toggleStatusFilter(option.value)}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Category filters */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Tag size={16} className="mr-1.5 text-primary-500" />
                  Category
                </h4>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {categoryOptions.map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        checked={filters.category.includes(option.value)}
                        onChange={() => toggleCategoryFilter(option.value)}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Date range filters */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Calendar size={16} className="mr-1.5 text-primary-500" />
                  Date Range
                </h4>
                <div className="space-y-2">
                  {dateRangeOptions.map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        checked={filters.dateRange === option.value}
                        onChange={() => setDateRange(option.value)}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sort options */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                  <Filter size={16} className="mr-1.5 text-primary-500" />
                  Sort By
                </h4>
                <div className="space-y-2">
                  {sortOptions.map(option => (
                    <label key={option.value} className="flex items-center">
                      <input
                        type="radio"
                        className="form-radio h-4 w-4 text-primary-600 border-gray-300 focus:ring-primary-500"
                        checked={filters.sortBy === option.value}
                        onChange={() => setSortBy(option.value)}
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                size="sm"
                onClick={resetFilters}
                disabled={!hasActiveFilters}
              >
                Reset Filters
              </Button>

              <Button
                variant="primary"
                size="sm"
                onClick={applyFilters}
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>

      {/* Active filters display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.status.map(status => (
            <div
              key={`status-${status}`}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
            >
              <span className="capitalize">{status.replace('-', ' ')}</span>
              <button
                onClick={() => toggleStatusFilter(status)}
                className="ml-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {filters.category.map(category => (
            <div
              key={`category-${category}`}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
            >
              <span className="capitalize">{category.replace('-', ' ')}</span>
              <button
                onClick={() => toggleCategoryFilter(category)}
                className="ml-1.5 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                <X size={12} />
              </button>
            </div>
          ))}

          {filters.dateRange !== 'all' && (
            <div
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
            >
              <span>
                {dateRangeOptions.find(o => o.value === filters.dateRange)?.label || filters.dateRange}
              </span>
              <button
                onClick={() => setDateRange('all')}
                className="ml-1.5 text-purple-600 dark:text-purple-400 hover:text-purple-800 dark:hover:text-purple-200"
              >
                <X size={12} />
              </button>
            </div>
          )}

          <button
            onClick={resetFilters}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
