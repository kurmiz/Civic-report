import { useState, useEffect, useCallback } from 'react';
import { statsAPI } from '../services/api';
import toast from 'react-hot-toast';

export interface IssueStats {
  total: number;
  resolved: number;
  pending: number;
  inProgress: number;
}

export interface UpvoteStats {
  total: number;
  lastWeek: number;
  percentChange: number;
}

export interface CommentStats {
  total: number;
  lastWeek: number;
  percentChange: number;
}

export interface UserStats {
  total: number;
  active: number;
  percentChange: number;
}

export interface Stats {
  issueStats: IssueStats;
  categoryStats: Record<string, number>;
  upvoteStats: UpvoteStats;
  commentStats: CommentStats;
  userStats: UserStats;
}

export const useStats = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await statsAPI.getStats();
      setStats(response.data);
    } catch (err: any) {
      console.error('Error fetching statistics:', err);
      setError(err.message || 'Failed to load statistics');
      toast.error('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    
    // Set up polling to refresh stats every 60 seconds
    const intervalId = setInterval(() => {
      fetchStats();
    }, 60000);
    
    return () => clearInterval(intervalId);
  }, [fetchStats]);

  return {
    stats,
    loading,
    error,
    refreshStats: fetchStats
  };
};
