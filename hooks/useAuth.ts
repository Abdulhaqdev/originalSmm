import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { authApi, GoogleLoginRequest, GoogleLoginResponse, LoginRequest, RegisterRequest } from '@/lib/api';

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
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user_id', data.user_id.toString());
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Login successful!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Login failed. Please try again.';
      toast.error(errorMessage);
    },
  });

  // Google login mutation
  const googleLoginMutation = useMutation({
    mutationFn: authApi.googleLogin,
    onSuccess: (data: GoogleLoginResponse) => {
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      localStorage.setItem('user_id', data.user_id.toString());
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Google login successful!');
      router.push('/dashboard');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || 'Google login failed. Please try again.';
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
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_id');
    queryClient.clear();
    toast.success('Logged out successfully');
    router.push('/');
  };

  return {
    user,
    isLoadingUser,
    isAuthenticated: isAuthenticated(),
    login: loginMutation.mutate,
    googleLogin: googleLoginMutation.mutate,
    register: registerMutation.mutate,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isGoogleLoggingIn: googleLoginMutation.isPending,
  };
};