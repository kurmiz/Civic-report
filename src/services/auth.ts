import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  bio?: string;
  location?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/login', { email, password });
    this.setAuthData(response.data);
    return response.data;
  },

  async signup(name: string, email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/signup', { name, email, password });
    this.setAuthData(response.data);
    return response.data;
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get('/me');
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  setAuthData(data: AuthResponse): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
