import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authApi, LoginRequest, RegisterRequest } from '@/lib/api';

// Utility functions for handling tokens in both localStorage and cookies
const setAuthTokens = (access: string, refresh: string, userId?: string) => {
  // Store in localStorage
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  if (userId) {
    localStorage.setItem('user_id', userId);
  }

  // Store in cookies for middleware access
  const cookieOptions = 'path=/; secure; samesite=strict';
  document.cookie = `access_token=${access}; ${cookieOptions}`;
  document.cookie = `refresh_token=${refresh}; ${cookieOptions}`;
  if (userId) {
    document.cookie = `user_id=${userId}; ${cookieOptions}`;
  }
};

const removeAuthTokens = () => {
  // Remove from localStorage
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user_id');

  // Remove from cookies
  const expiredCookie = 'path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  document.cookie = `access_token=; ${expiredCookie}`;
  document.cookie = `refresh_token=; ${expiredCookie}`;
  document.cookie = `user_id=; ${expiredCookie}`;
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Check if user is authenticated
  const isAuthenticated = () => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      return !!token;
    }
    return false;
  };

  // Get current user
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated(),
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuthTokens(data.access, data.refresh, data.user_id.toString());
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Login successful!');
      
      // Check for return URL
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');
      router.push(returnUrl || '/dashboard');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Login failed. Please try again.';
      toast.error(errorMessage);
    },
  });

  // Google Auth mutation
  const googleAuthMutation = useMutation({
    mutationFn: authApi.googleAuth,
    onSuccess: (data) => {
      const userId = data.user?.id?.toString();
      setAuthTokens(data.access, data.refresh, userId);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Google orqali muvaffaqiyatli kirildi!');
      
      // Check for return URL
      const urlParams = new URLSearchParams(window.location.search);
      const returnUrl = urlParams.get('returnUrl');
      router.push(returnUrl || '/dashboard');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.error || 'Google orqali kirishda xatolik yuz berdi';
      toast.error(errorMessage);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Registration successful! Please login with your credentials.');
      router.push('/login');
    },
    onError: (error: any) => {
      const errorData = error.response?.data;
      if (errorData) {
        const errors = [];
        if (errorData.username) errors.push(`Username: ${errorData.username[0]}`);
        if (errorData.email) errors.push(`Email: ${errorData.email[0]}`);
        if (errorData.phone_number) errors.push(`Phone: ${errorData.phone_number[0]}`);
        const errorMessage = errors.length > 0 ? errors.join(', ') : 'Registration failed. Please try again.';
        toast.error(errorMessage);
      } else {
        toast.error('Registration failed. Please try again.');
      }
    },
  });

  // Logout function
  const logout = () => {
    removeAuthTokens();
    queryClient.clear();
    
    // Google Sign-Out
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    toast.success('Logged out successfully');
    router.push('/');
  };

  return {
    user,
    isLoadingUser,
    isAuthenticated: isAuthenticated(),
    login: loginMutation.mutate,
    googleAuth: googleAuthMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isGoogleAuthenticating: googleAuthMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};