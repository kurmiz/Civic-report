import { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // Only check if we have a token
        const token = localStorage.getItem('admin_token');
        if (!token) {
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        const response = await api.auth.getCurrentUser();

        // Check if user is an admin
        if (response.data.role !== 'admin') {
          localStorage.removeItem('admin_token');
          setUser(null);
          setIsAuthenticated(false);
          setIsLoading(false);
          return;
        }

        setUser(response.data);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error checking auth:', error);
        // Clear token if invalid
        localStorage.removeItem('admin_token');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setIsLoading(true);
      const response = await api.auth.login(email, password);

      // Check if user is an admin
      if (response.data && response.data.role !== 'admin') {
        throw new Error('Access denied: Admin privileges required');
      }

      // Save token to localStorage
      if (response.token) {
        localStorage.setItem('admin_token', response.token);
      }

      // Set user data
      setUser(response.data);
      setIsAuthenticated(true);

      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await api.auth.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token and user data
      localStorage.removeItem('admin_token');
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
