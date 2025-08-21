"use client"

import { useEffect, useRef, useState } from 'react';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { GoogleAuth } from '@/lib/google-auth'

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  useEffect(() => {
    const initGoogle = async () => {
      try {
        await GoogleAuth.initializeGoogleAuth();
        setIsInitialized(true);
      } catch (error) {
        console.error('Google Auth initialization failed:', error);
        onError?.('Google Auth yuklanmadi');
      }
    };

    initGoogle();
  }, [onError]);

  useEffect(() => {
    if (isInitialized && buttonRef.current) {
      setupGoogleButton();
    }
  }, [isInitialized]);

  const handleCredentialResponse = async (response: any) => {
    if (!response?.credential) {
      onError?.('Google credential olinmadi');
      return;
    }

    setIsLoading(true);
    
    try {
      // Google tokenni backendga yuborish
      const result = await authApi.googleAuth(response.credential);
      
      // Tokenlarni saqlash
      if (result.access) {
        localStorage.setItem('access_token', result.access);
      }
      if (result.refresh) {
        localStorage.setItem('refresh_token', result.refresh);
      }
      if (result.user?.id) {
        localStorage.setItem('user_id', result.user.id.toString());
      }

      // Query cache yangilash
      queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast.success('Google orqali muvaffaqiyatli kirildi!');
      onSuccess?.();
      router.push('/dashboard');
      
    } catch (error: any) {
      console.error('Google auth error:', error);
      const errorMessage = error.response?.data?.error || 'Google orqali kirishda xatolik yuz berdi';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const setupGoogleButton = async () => {
    if (!buttonRef.current || !isInitialized) return;
    
    try {
      await GoogleAuth.setupGoogleButton(buttonRef.current, handleCredentialResponse);
    } catch (error) {
      console.error('Google button setup failed:', error);
      onError?.('Google tugmasi sozlanmadi');
    }
  };

  if (!isInitialized) {
    return (
      <div className="w-full h-10 bg-gray-100 animate-pulse rounded-md flex items-center justify-center">
        <span className="text-sm text-gray-500">Google Auth yuklanmoqda...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={buttonRef} className="w-full" />
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-md">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}