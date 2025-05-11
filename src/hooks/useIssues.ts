import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Issue } from '../types';
import { issueAPI, commentAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

type SortOption = 'latest' | 'oldest' | 'most-upvotes' | 'least-upvotes';
type FilterOption = 'all' | 'resolved' | 'pending' | 'in-progress' | string;

export const useIssues = () => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [upvotedIssues, setUpvotedIssues] = useState<Issue[]>([]);
  const [userIssues, setUserIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('latest');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const { isAuthenticated, user } = useAuth();

  // Function to load upvoted issues
  const loadUpvotedIssues = async () => {
    if (!isAuthenticated) return;

    try {
      const response = await issueAPI.getUpvotedIssues();
      setUpvotedIssues(response.data);
    } catch (err) {
      console.error('Error loading upvoted issues:', err);
    }
  };

  // Function to load user's own issues
  const loadUserIssues = async () => {
    if (!isAuthenticated || !user) {
      console.log('User not authenticated, skipping loadUserIssues');
      return;
    }

    try {
      console.log('Loading user issues for user:', user.id);
      const response = await issueAPI.getUserIssues();
      setUserIssues(response.data);
      console.log('User issues loaded successfully:', response.data.length);
    } catch (err) {
      console.error('Error loading user issues:', err);
      // Don't show error toast for this as it's not critical
      setUserIssues([]);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const loadIssues = async () => {
      try {
        // Only show loading state on initial load, not on filter/sort changes
        // This prevents the content from disappearing during filtering/sorting
        if (issues.length === 0) {
          setLoading(true);
        }

        // Create filters object
        const filters: Record<string, string> = {};

        // Add filter by status if not 'all'
        if (filterBy !== 'all') {
          filters.status = filterBy;
        }

        // Fetch issues from API
        const response = await issueAPI.getIssues(filters);

        // Sort the issues based on sortBy
        let sortedIssues = [...response.data];

        switch (sortBy) {
          case 'latest':
            sortedIssues.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            break;
          case 'oldest':
            sortedIssues.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            break;
          case 'most-upvotes':
            sortedIssues.sort((a, b) => (b.upvotes_count || 0) - (a.upvotes_count || 0));
            break;
          case 'least-upvotes':
            sortedIssues.sort((a, b) => (a.upvotes_count || 0) - (b.upvotes_count || 0));
            break;
        }

        // Only update state if component is still mounted
        if (isMounted) {
          setIssues(sortedIssues);
          setError(null);
          setLoading(false);
        }

        // Load upvoted issues and user issues if user is authenticated
        if (isAuthenticated) {
          loadUpvotedIssues();
          loadUserIssues();
        }
      } catch (err) {
        console.error('Error loading issues:', err);

        if (isMounted) {
          setError('Failed to load issues. Please try again later.');
          setLoading(false);
        }
      }
    };

    loadIssues();

    // Cleanup function to prevent state updates after unmount
    return () => {
      isMounted = false;
    };
  }, [sortBy, filterBy, isAuthenticated]);

  const upvoteIssue = async (id: string) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please log in to upvote issues');
        return;
      }

      // First check if the user has already upvoted this issue
      const checkResponse = await issueAPI.checkUpvoted(id);
      const hasUpvoted = checkResponse.data.upvoted;

      // Update local state immediately for better UX
      setIssues(prevIssues =>
        prevIssues.map(issue => {
          if (issue.id === id) {
            const newUpvoteCount = hasUpvoted
              ? Math.max(0, (issue.upvotes_count || 0) - 1)
              : (issue.upvotes_count || 0) + 1;

            return {
              ...issue,
              upvotes_count: newUpvoteCount,
              has_upvoted: !hasUpvoted
            };
          }
          return issue;
        })
      );

      // Send upvote request to API
      const response = await issueAPI.upvoteIssue(id);

      if (response.data.upvoted) {
        toast.success('Issue upvoted');
      } else {
        toast.success('Upvote removed');
      }
    } catch (error) {
      console.error('Error upvoting issue:', error);
      toast.error('Failed to update upvote');

      // Reload issues to reset the state
      loadIssues();
    }
  };

  const addComment = async (issueId: string, text: string) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please log in to add comments');
        return;
      }

      // Update local state immediately for better UX
      setIssues(prevIssues =>
        prevIssues.map(issue => {
          if (issue.id === issueId) {
            return {
              ...issue,
              comments_count: (issue.comments_count || 0) + 1
            };
          }
          return issue;
        })
      );

      // Send comment to API
      await commentAPI.addComment(issueId, text);

      toast.success('Comment added successfully');
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error('Failed to add comment');

      // Reload issues to reset the state
      loadIssues();
    }
  };

  const deleteIssue = async (id: string) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please log in to delete issues');
        return;
      }

      // Update local state immediately for better UX
      setIssues(prevIssues => prevIssues.filter(issue => issue.id !== id));

      // Send delete request to API
      await issueAPI.deleteIssue(id);

      toast.success('Issue deleted successfully');
    } catch (error) {
      console.error('Error deleting issue:', error);
      toast.error('Failed to delete issue');

      // Reload issues to reset the state
      loadIssues();
    }
  };

  const updateIssue = async (id: string, updates: Partial<Issue>) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please log in to update issues');
        return;
      }

      // Update local state immediately for better UX
      setIssues(prevIssues =>
        prevIssues.map(issue => {
          if (issue.id === id) {
            return { ...issue, ...updates };
          }
          return issue;
        })
      );

      // Send update request to API
      await issueAPI.updateIssue(id, updates);

      toast.success('Issue updated successfully');
    } catch (error) {
      console.error('Error updating issue:', error);
      toast.error('Failed to update issue');

      // Reload issues to reset the state
      loadIssues();
    }
  };

  const getIssueById = async (id: string) => {
    try {
      // First check if the issue is already in the local state
      const localIssue = issues.find(issue => issue.id === id);
      if (localIssue) {
        return localIssue;
      }

      // If not found locally, fetch from API
      const response = await issueAPI.getIssue(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching issue:', error);
      toast.error('Failed to fetch issue details');
      return null;
    }
  };

  const createIssue = async (issueData: Partial<Issue>) => {
    try {
      if (!isAuthenticated) {
        toast.error('Please log in to create issues');
        return null;
      }

      // Send create request to API
      const response = await issueAPI.createIssue(issueData);

      // Add the new issue to the local state
      setIssues(prevIssues => [response.data, ...prevIssues]);

      toast.success('Issue created successfully');
      return response.data;
    } catch (error) {
      console.error('Error creating issue:', error);
      toast.error('Failed to create issue');
      return null;
    }
  };

  return {
    issues,
    upvotedIssues,
    userIssues,
    loading,
    error,
    sortBy,
    filterBy,
    setSortBy,
    setFilterBy,
    upvoteIssue,
    addComment,
    deleteIssue,
    updateIssue,
    getIssueById,
    createIssue,
    loadUpvotedIssues,
    loadUserIssues
  };
};