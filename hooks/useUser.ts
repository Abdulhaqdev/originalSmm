import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { authApi, Category, Order } from '@/lib/api'

interface Service {
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

interface ServicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
}

interface UpdateProfileRequest {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  phone_number: string;
}

interface NewOrderRequest {
  service_id: number;
  url: string;
  status: 'pending';
  quantity: number;
}


export const useUser = () => {
  const queryClient = useQueryClient();

  // Fetch services with pagination and locale
  const getServices = (limit: number, offset: number, locale: string) =>
    useQuery<ServicesResponse, AxiosError<{ detail?: string }>>({
      queryKey: ['services', limit, offset, locale],
      queryFn: () => authApi.getServices(limit, offset, locale),
      retry: false,
      staleTime: 0, // Disable cache
    });

  // Fetch categories with pagination and locale
  const getCategories = ( locale: string) =>
    useQuery<Category[], AxiosError<{ detail?: string }>>({
      queryKey: ['categories',  locale],
      queryFn: () => authApi.getCategories( locale),
      retry: false,
      staleTime: 0, // Disable cache
    });
	const getOrders = ( locale: string) =>
    useQuery<Order[], AxiosError<{ detail?: string }>>({
      queryKey: ['orders',  locale],
      queryFn: () => authApi.getOrders( locale),
      retry: false,
      staleTime: 0, // Disable cache
    });
  // Update profile mutation
  const updateProfileMutation = useMutation<void, AxiosError<{ detail?: string }>, UpdateProfileRequest>({
    mutationFn: (data) => authApi.updateProfile(data).then(() => {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Profil muvaffaqiyatli yangilandi');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Profilni yangilashda xato yuz berdi.';
      toast.error(errorMessage);
    },
  });

  // Create new order mutation
  const createOrderMutation = useMutation<void, AxiosError<{ detail?: string }>, NewOrderRequest>({
    mutationFn: (data) => authApi.createOrder(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Buyurtma muvaffaqiyatli yaratildi');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Buyurtma yaratishda xato yuz berdi.';
      toast.error(errorMessage);
    },
  });

  return {
    getServices,
    getCategories,
		getOrders,
    updateProfile: (data: UpdateProfileRequest) => updateProfileMutation.mutate(data),
    isUpdatingProfile: updateProfileMutation.isPending,
    createOrder: (data: NewOrderRequest) => createOrderMutation.mutate(data),
    isCreatingOrder: createOrderMutation.isPending,
  };
};