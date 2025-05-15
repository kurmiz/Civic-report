import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (name: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (profileData: Partial<User>) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        // Only check if we have a token
        const token = localStorage.getItem('token');
        if (!token) {
          setUser(null);
          setIsLoading(false);
          return;
        }

        setIsLoading(true);
        const response = await authAPI.getCurrentUser();

        // Add timestamp to avatar_url to prevent caching
        if (response.data && response.data.avatar_url) {
          const timestamp = new Date().getTime();
          response.data.avatar_url = response.data.avatar_url.includes('?')
            ? `${response.data.avatar_url}&t=${timestamp}`
            : `${response.data.avatar_url}?t=${timestamp}`;
        }

        setUser(response.data);
      } catch (error) {
        console.error('Error checking auth:', error);
        // Clear token if invalid
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);

      // Call the real API
      const response = await authAPI.login(email, password);

      // Save token to localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      // Add timestamp to avatar_url to prevent caching
      if (response.data && response.data.avatar_url) {
        const timestamp = new Date().getTime();
        response.data.avatar_url = response.data.avatar_url.includes('?')
          ? `${response.data.avatar_url}&t=${timestamp}`
          : `${response.data.avatar_url}?t=${timestamp}`;
      }

      // Set user data
      setUser(response.data);

      return response;
    } catch (error) {
      console.error('Login error:', error);
      // Show a user-friendly error message using toast
      if (error instanceof Error) {
        toast.error(`Login failed: ${error.message}`);
      } else {
        toast.error('Login failed. Please check your connection and try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      setIsLoading(true);

      // Call the real API
      const response = await authAPI.register(name, email, password);

      // Save token to localStorage
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      // Add timestamp to avatar_url to prevent caching
      if (response.data && response.data.avatar_url) {
        const timestamp = new Date().getTime();
        response.data.avatar_url = response.data.avatar_url.includes('?')
          ? `${response.data.avatar_url}&t=${timestamp}`
          : `${response.data.avatar_url}?t=${timestamp}`;
      }

      // Set user data
      setUser(response.data);

      return response;
    } catch (error) {
      console.error('Signup error:', error);
      // Show a user-friendly error message using toast
      if (error instanceof Error) {
        toast.error(`Signup failed: ${error.message}`);
      } else {
        toast.error('Signup failed. Please check your connection and try again.');
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);

      // Call the real API
      await authAPI.logout();

      // Clear user state
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Still clear user state even if API call fails
      localStorage.removeItem('token');
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      setIsLoading(true);

      // Call the real API
      const response = await authAPI.updateProfile(profileData);

      // Add timestamp to avatar_url to prevent caching
      if (response.data && response.data.avatar_url) {
        const timestamp = new Date().getTime();
        response.data.avatar_url = response.data.avatar_url.includes('?')
          ? `${response.data.avatar_url}&t=${timestamp}`
          : `${response.data.avatar_url}?t=${timestamp}`;
      }

      // Update user state with the returned data
      setUser(response.data);

      return response;
    } catch (error) {
      console.error('Profile update error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}