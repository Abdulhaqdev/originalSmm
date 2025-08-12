'use server';

import { cookies } from 'next/headers';

export async function setAuthTokens({ access, refresh }: { access: string; refresh: string }) {
  const cookieStore = await cookies();
  cookieStore.set('access_token', access, { httpOnly: true, secure: true, sameSite: 'strict' });
  cookieStore.set('refresh_token', refresh, { httpOnly: true, secure: true, sameSite: 'strict' });
}

export async function getAccessToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('access_token')?.value || null;
}

export async function getRefreshToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('refresh_token')?.value || null;
}

export async function clearAuthTokens() {
  const cookieStore = await cookies();
  cookieStore.delete('access_token');
  cookieStore.delete('refresh_token');
}

export async function isAuthenticated(): Promise<boolean> {
  const accessToken = await getAccessToken();
  return !!accessToken;
}

// export function isAuthenticatedClient(): boolean {
//   if (typeof window === 'undefined') return false;
//   return document.cookie.includes('access_token=');
// }