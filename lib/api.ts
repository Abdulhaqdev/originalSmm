import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.originalsmm.uz';

// Utility function to update tokens in both localStorage and cookies
const updateAuthTokens = (access: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', access);
    const cookieOptions = 'path=/; secure; samesite=strict';
    document.cookie = `access_token=${access}; ${cookieOptions}`;
  }
};

// Utility function to clear tokens from both localStorage and cookies
const clearAuthTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    
    const expiredCookie = 'path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    document.cookie = `access_token=; ${expiredCookie}`;
    document.cookie = `refresh_token=; ${expiredCookie}`;
    document.cookie = `user_id=; ${expiredCookie}`;
  }
};

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token and Accept-Language
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      // /all-services/ uchun token qo'shmaymiz
      if (token && !config.url?.includes('/all-services/')) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    // Add Accept-Language from config or default to 'uz'
    config.headers['Accept-Language'] = config.headers['Accept-Language'] || 'uz';
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/all-services/')) {
      originalRequest._retry = true;

      try {
        if (typeof window !== 'undefined') {
          const refreshToken = localStorage.getItem('refresh_token');
          if (refreshToken) {
            const response = await axios.post(`${API_BASE_URL}/api/token/refresh/`, {
              refresh: refreshToken,
            });

            const { access } = response.data;
            updateAuthTokens(access); // Update both localStorage and cookies

            // Retry the original request with new token
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        clearAuthTokens();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Rest of your interfaces and API functions remain the same...
// [Keep all your existing interfaces and authApi object exactly as they were]

// Auth API interfaces
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  refresh: string;
  access: string;
  user_id: number;
  admin: boolean;
}

export interface GoogleAuthResponse {
  access: string;
  refresh: string;
  user: any;
}

export interface RegisterRequest {
  first_name: string;
  last_name: string;
  password: string;
  username: string;
  email: string;
  phone_number: string;
}

export interface RegisterResponse {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
}

export interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
}

export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  balance?: string;
  api_key: string;
}

export interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  min: number;
  max: number;
  price: string;
  site_id: number;
  category: number;
  api: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export interface ServicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
}

export interface NewOrderRequest {
  service_id: number;
  url: string;
  status: 'pending';
  quantity: number;
}

export interface Order {
  id: number;
  service: Service;
  price: string;
  url: string;
  status: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  user: number;
  external_order_id: string;
}

const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post('/api/token/', data);
    return response.data;
  },

  googleAuth: async (token: string): Promise<GoogleAuthResponse> => {
    const response = await api.post('/api/auth/google/', { token });
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await api.post('/api/users/', data);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/api/me/');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest): Promise<User> => {
    const response = await api.put(`/api/users/${userId}/`, data);
    return response.data;
  },

  refreshToken: async (refreshToken: string): Promise<{ access: string }> => {
    const response = await api.post('/api/token/refresh/', { refresh: refreshToken });
    return response.data;
  },

  getServices: async (limit: number, offset: number, locale: string): Promise<ServicesResponse> => {
    const response = await api.get(`api/all-services/?limit=${limit}&offset=${offset}`, {
      headers: { 'Accept-Language': locale },
    });
    return response.data;
  },

  getCategories: async (locale: string): Promise<Category[]> => {
    const response = await api.get(`api/categories/`, {
      headers: { 'Accept-Language': locale },
    });
    return response.data;
  },

  getOrders: async (locale: string): Promise<Order[]> => {
    const response = await api.get(`/api/orders?type=user`, {
      headers: { 'Accept-Language': locale },
    });
    return response.data;
  },

  createOrder: async (data: NewOrderRequest) => {
    const response = await api.post('/api/orders/', data);
    return response.data;
  },
};