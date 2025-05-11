import axios from 'axios';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Add request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API service
export const api = {
  // Auth endpoints
  auth: {
    login: (email, password) =>
      axiosInstance.post('/adminlogin', { email, password }),

    logout: () =>
      axiosInstance.get('/auth/logout'),

    getCurrentUser: () =>
      axiosInstance.get('/auth/me'),

    changePassword: (currentPassword, newPassword) =>
      axiosInstance.put('/auth/changepassword', { currentPassword, newPassword })
  },

  // Admin dashboard endpoints
  admin: {
    getStats: () =>
      axiosInstance.get('/admin/stats'),

    getIssues: (params) =>
      axiosInstance.get('/admin/issues', { params }),

    getIssue: (id) =>
      axiosInstance.get(`/issues/${id}`),

    updateIssueStatus: (id, data) =>
      axiosInstance.put(`/admin/issues/${id}/status`, data),

    getUsers: (params) =>
      axiosInstance.get('/admin/users', { params }),

    updateUserRole: (id, role) =>
      axiosInstance.put(`/admin/users/${id}/role`, { role }),

    deleteUser: (id) =>
      axiosInstance.delete(`/admin/users/${id}`),

    getComments: (issueId) =>
      axiosInstance.get(`/issues/${issueId}/comments`)
  }
};
