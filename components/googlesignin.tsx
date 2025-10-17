"use client"

import { useEffect, useRef, useState } from 'react';
import { authApi } from '@/lib/api';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { GoogleAuth } from '@/lib/google-auth';
import { useTranslations } from 'next-intl';

interface GoogleSignInButtonProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function GoogleSignInButton({ onSuccess, onError }: GoogleSignInButtonProps) {
  const t = useTranslations("GoogleSignInButton");
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
        toast.error(t('initError'));
        onError?.(t('initError'));
      }
    };

    initGoogle();
  }, [onError, t]);

  useEffect(() => {
    if (isInitialized && buttonRef.current) {
      setupGoogleButton();
    }
  }, [isInitialized]);

  const handleCredentialResponse = async (response: any) => {
    if (!response?.credential) {
      toast.error(t('credentialError'));
      onError?.(t('credentialError'));
      return;
    }

    setIsLoading(true);

    try {
      const result = await authApi.googleAuth(response.credential);

      if (result.access) {
        localStorage.setItem('access_token', result.access);
      }
      if (result.refresh) {
        localStorage.setItem('refresh_token', result.refresh);
      }
      if (result.user?.id) {
        localStorage.setItem('user_id', result.user.id.toString());
      }

      queryClient.invalidateQueries({ queryKey: ['user'] });

      toast.success(t('success'));
      onSuccess?.();
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Google auth error:', error);
      const errorMessage = error.response?.data?.error || t('authError');
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
      toast.error(t('buttonSetupError'));
      onError?.(t('buttonSetupError'));
    }
  };

  return (
    <div className="relative w-full">
      {!isInitialized ? (
        <div className="w-full h-12 rounded-md flex items-center justify-center">
          <span className="text-sm text-gray-500 dark:text-gray-400">{t('loading')}</span>
        </div>
      ) : (
       <div
  ref={buttonRef}
  className="w-full h-12 rounded-sm flex items-center justify-center overflow-hidden bg-transparent"
></div>

      )}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-gray-800/80 flex items-center justify-center rounded-md">
          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}