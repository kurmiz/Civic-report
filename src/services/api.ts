// API base URL
const API_URL = 'http://localhost:5002/api';

// Default headers
const headers = {
  'Content-Type': 'application/json',
  'Accept': 'application/json'
};

// Default fetch options
const defaultOptions = {
  mode: 'cors' as RequestMode,
  credentials: 'include' as RequestCredentials,
  cache: 'no-cache' as RequestCache
};

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  try {
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('Network error. Please check your connection and try again.');
  }
};

// Add authorization header if token exists
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    console.warn('No authentication token found');
    return headers;
  }
  return {
    ...headers,
    'Authorization': `Bearer ${token}`
  };
};

// Authentication API
export const authAPI = {
  // Register a new user
  register: async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ name, email, password }),
        ...defaultOptions
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Registration fetch error:', error);
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  // Login user
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ email, password }),
        ...defaultOptions
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Login fetch error:', error);
      throw new Error('Network error. Please check your connection and try again.');
    }
  },

  // Get current user
  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Update user profile
  updateProfile: async (profileData: any) => {
    const response = await fetch(`${API_URL}/auth/updateprofile`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(profileData),
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Change password
  changePassword: async (currentPassword: string, newPassword: string) => {
    const response = await fetch(`${API_URL}/auth/changepassword`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Logout user
  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: 'GET',
      headers: getAuthHeaders(),
      ...defaultOptions
    });

    // Remove token from localStorage
    localStorage.removeItem('token');

    return handleResponse(response);
  }
};

// Issues API
export const issueAPI = {
  // Get all issues with optional filters
  getIssues: async (filters = {}) => {
    // Convert filters object to query string
    const queryString = new URLSearchParams(filters as Record<string, string>).toString();
    const url = `${API_URL}/issues${queryString ? `?${queryString}` : ''}`;

    const response = await fetch(url, {
      method: 'GET',
      headers,
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Get a single issue by ID
  getIssue: async (id: string) => {
    const response = await fetch(`${API_URL}/issues/${id}`, {
      method: 'GET',
      headers,
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Create a new issue
  createIssue: async (issueData: any) => {
    const response = await fetch(`${API_URL}/issues`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(issueData),
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Update an issue
  updateIssue: async (id: string, issueData: any) => {
    const response = await fetch(`${API_URL}/issues/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(issueData),
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Delete an issue
  deleteIssue: async (id: string) => {
    const response = await fetch(`${API_URL}/issues/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Upvote an issue
  upvoteIssue: async (id: string) => {
    const response = await fetch(`${API_URL}/issues/${id}/upvote`, {
      method: 'POST',
      headers: getAuthHeaders(),
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Check if user has upvoted an issue
  checkUpvoted: async (id: string) => {
    const response = await fetch(`${API_URL}/issues/${id}/upvoted`, {
      method: 'GET',
      headers: getAuthHeaders(),
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Get issues by location (within radius)
  getIssuesByRadius: async (lat: number, lng: number, distance: number) => {
    const response = await fetch(`${API_URL}/issues/radius/${lat}/${lng}/${distance}`, {
      method: 'GET',
      headers,
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Get user's upvoted issues
  getUpvotedIssues: async () => {
    const response = await fetch(`${API_URL}/issues/upvoted`, {
      method: 'GET',
      headers: getAuthHeaders(),
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Get user's own issues
  getUserIssues: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No token available for getUserIssues');
        throw new Error('Authentication required');
      }

      const response = await fetch(`${API_URL}/issues?user=current`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        mode: 'cors',
        credentials: 'include',
        cache: 'no-cache'
      });

      return handleResponse(response);
    } catch (error) {
      console.error('Error in getUserIssues:', error);
      throw error;
    }
  },

  // Search issues
  searchIssues: async (query: string) => {
    const response = await fetch(`${API_URL}/issues?search=${encodeURIComponent(query)}`, {
      method: 'GET',
      headers,
      ...defaultOptions
    });

    return handleResponse(response);
  }
};

// Statistics API
export const statsAPI = {
  // Get dashboard statistics
  getStats: async () => {
    const response = await fetch(`${API_URL}/stats`, {
      method: 'GET',
      headers,
      ...defaultOptions
    });

    return handleResponse(response);
  }
};

// Comments API
export const commentAPI = {
  // Get comments for an issue
  getComments: async (issueId: string) => {
    const response = await fetch(`${API_URL}/issues/${issueId}/comments`, {
      method: 'GET',
      headers,
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Add a comment to an issue
  addComment: async (issueId: string, text: string) => {
    const response = await fetch(`${API_URL}/issues/${issueId}/comments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Update a comment
  updateComment: async (commentId: string, text: string) => {
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
      ...defaultOptions
    });

    return handleResponse(response);
  },

  // Delete a comment
  deleteComment: async (commentId: string) => {
    const response = await fetch(`${API_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
      ...defaultOptions
    });

    return handleResponse(response);
  }
};
