// lib/google-auth.ts
export interface GoogleAuthResponse {
  access: string;
  refresh: string;
  user: {
    id: number;
    email?: string;
    [key: string]: unknown;
  };
}

interface GoogleCredentialResponse {
  credential?: string;
}

interface GoogleButtonConfig {
  theme: "outline" | "filled_blue" | "filled_black";
  size: "large" | "medium" | "small";
  text: "signin_with" | "signup_with" | "continue_with" | "signin";
  width: string;
}

interface GoogleInitConfig {
  client_id: string;
  callback: (response: GoogleCredentialResponse) => void;
}

export class GoogleAuth {
  private static get clientId(): string {
    const id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!id) {
      throw new Error('NEXT_PUBLIC_GOOGLE_CLIENT_ID is not set');
    }
    return id;
  }

  static async initializeGoogleAuth(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined') return reject('Not in browser environment');
      
      if (window.google?.accounts?.id) {
        resolve();
        return;
      }

      // Load Google Identity Services script
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        const checkGoogle = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(checkGoogle);
            resolve();
          }
        }, 100);
        
        // Timeout after 10 seconds
        setTimeout(() => {
          clearInterval(checkGoogle);
          reject('Google Auth library failed to load');
        }, 10000);
      };
      
      script.onerror = () => reject('Failed to load Google Auth script');
      document.head.appendChild(script);
    });
  }

  static async setupGoogleButton(
    buttonElement: HTMLElement,
    onCredentialResponse: (response: GoogleCredentialResponse) => void
  ): Promise<void> {
    if (!window.google?.accounts?.id) {
      throw new Error('Google Auth not initialized');
    }

    window.google.accounts.id.initialize({
      client_id: this.clientId,
      callback: onCredentialResponse,
    });

    window.google.accounts.id.renderButton(buttonElement, {
      theme: 'outline',
      size: 'large',
      text: 'signin_with',
      width: '100%'
    });
  }

  static parseJwt(token: string): Record<string, unknown> | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }
}

// Extend window interface for TypeScript
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: GoogleInitConfig) => void;
          renderButton: (element: HTMLElement, config: GoogleButtonConfig) => void;
          prompt: () => void;
          disableAutoSelect: () => void;
        };
      };
    };
  }
}