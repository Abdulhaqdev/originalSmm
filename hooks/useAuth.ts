import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter, usePathname } from 'next/navigation';
import { authApi, LoginRequest, RegisterRequest } from '@/lib/api';

// Utility functions for handling tokens in both localStorage and cookies
const setAuthTokens = (access: string, refresh: string, userId?: string) => {
  console.log('Setting auth tokens:', { access: access?.substring(0, 10) + '...', userId }); // Debug
  
  // Store in localStorage
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
  if (userId) {
    localStorage.setItem('user_id', userId);
  }

  // Store in cookies for middleware access with longer expiry
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 7); // 7 kunlik cookie
  
  // Check if running on HTTPS or localhost
  const isSecure = window.location.protocol === 'https:' || window.location.hostname === 'localhost';
  const cookieOptions = `path=/; ${isSecure ? 'secure;' : ''} samesite=strict; expires=${expiryDate.toUTCString()}`;
  
  document.cookie = `access_token=${access}; ${cookieOptions}`;
  document.cookie = `refresh_token=${refresh}; ${cookieOptions}`;
  if (userId) {
    document.cookie = `user_id=${userId}; ${cookieOptions}`;
  }
  
  console.log('Cookies set with options:', cookieOptions); // Debug
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

// Get current locale from pathname
const getCurrentLocale = (pathname: string): string => {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const supportedLocales = ['uz', 'en', 'ru'];
  
  if (supportedLocales.includes(firstSegment)) {
    return firstSegment;
  }
  
  return 'uz'; // default locale
};

export const useAuth = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('access_token'));
  }, []);

  // Get current user
  const { data: user, isLoading: isLoadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: authApi.getProfile,
    enabled: isAuthenticated,
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuthTokens(data.access, data.refresh, data.user_id.toString());
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Login successful!');
      
      // Get current locale and redirect with locale
      const currentLocale = getCurrentLocale(pathname);
      
      // Cookie o'rnatilishini kutish uchun kechikish
      setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('returnUrl');
        
        // Locale bilan dashboard URL yaratish
        const dashboardUrl = returnUrl || `/${currentLocale}/dashboard`;
        
        // Hard reload qilish middleware uchun
        window.location.href = dashboardUrl;
      }, 200);
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
      console.log('Google Auth Success Data:', data); // Debug uchun
      
      const userId = data.user?.id?.toString();
      setAuthTokens(data.access, data.refresh, userId);
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Google orqali muvaffaqiyatli kirildi!');
      
      // Get current locale and redirect with locale
      const currentLocale = getCurrentLocale(pathname);
      
      // Cookie o'rnatilishini kutish uchun uzunroq kechikish
      setTimeout(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const returnUrl = urlParams.get('returnUrl');
        
        // Locale bilan dashboard URL yaratish
        const dashboardUrl = returnUrl || `/${currentLocale}/dashboard`;
        
        console.log('Redirecting to:', dashboardUrl); // Debug uchun
        
        // Hard reload qilish middleware uchun
        window.location.href = dashboardUrl;
      }, 300);
    },
    onError: (error: any) => {
      console.error('Google Auth Error:', error); // Debug uchun
      const errorMessage = error.response?.data?.error || 'Google orqali kirishda xatolik yuz berdi';
      toast.error(errorMessage);
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      toast.success('Registration successful! Please login with your credentials.');
      const currentLocale = getCurrentLocale(pathname);
      router.push(`/${currentLocale}/login`);
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
    setIsAuthenticated(false);
    queryClient.clear();
    
    // Google Sign-Out
    if (typeof window !== 'undefined' && window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect();
    }
    
    toast.success('Logged out successfully');
    const currentLocale = getCurrentLocale(pathname);
    router.push(`/${currentLocale}/`);
  };

  return {
    user,
    isLoadingUser,
    isAuthenticated,
    login: loginMutation.mutate,
    googleAuth: googleAuthMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isGoogleAuthenticating: googleAuthMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
};