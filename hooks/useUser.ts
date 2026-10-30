import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
import { authApi, Category, Order, HeleketPaymentRequest, HeleketPaymentResponse } from '@/lib/api'
import { useCurrency } from '@/components/provider/currency-provider'

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  min: number;
  max: number;
  price: string;
  currency?: string;
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
  const { currency, isReady } = useCurrency();

     const getServices = (
    limit: number, 
    offset: number, 
    locale: string, 
    category?: string, 
    is_active?: boolean,
    search?: string
  ) =>
    {
      const query = useQuery<Service, AxiosError<{ detail?: string }>>({
        queryKey: ['services', limit, offset, locale, category, is_active, search, currency],
        queryFn: () => authApi.getServices( locale, category, is_active, search),
        enabled: isReady,
        retry: false,
        staleTime: 0,
      });
      return { ...query, isLoading: !isReady || query.isPending };
    };

  // Fetch categories with locale and is_active filter
  const getCategories = (locale: string, is_active?: boolean) =>
    useQuery<Category[], AxiosError<{ detail?: string }>>({
      queryKey: ['categories', locale, is_active],
      queryFn: () => authApi.getCategories(locale, is_active),
      retry: false,
      staleTime: 0,
    });

  const getOrders = ( locale: string) =>
    {
      const query = useQuery<Order[], AxiosError<{ detail?: string }>>({
        queryKey: ['orders',  locale, currency],
        queryFn: () => authApi.getOrders( locale),
        enabled: isReady,
        retry: false,
        staleTime: 0,
      });
      return { ...query, isLoading: !isReady || query.isPending };
    };

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
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('Buyurtma muvaffaqiyatli yaratildi');
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.detail || 'Buyurtma yaratishda xato yuz berdi.';
      toast.error(errorMessage);
    },
  });

  // Heleket payment mutation
  const heleketPaymentMutation = useMutation<HeleketPaymentResponse, AxiosError<{ error?: string; detail?: string }>, HeleketPaymentRequest>({
    mutationFn: (data) => authApi.createHeleketPayment(data),
    onSuccess: (response) => {
      window.location.href = response.payment_url;
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.error || error.response?.data?.detail || 'To\'lovni boshlashda xato yuz berdi.';
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
    createHeleketPayment: (data: HeleketPaymentRequest) => heleketPaymentMutation.mutate(data),
    isCreatingHeleketPayment: heleketPaymentMutation.isPending,
  };
};