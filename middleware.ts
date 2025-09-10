import createMiddleware from 'next-intl/middleware';
import { routing } from './app/i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

// Create the internationalization middleware
const intlMiddleware = createMiddleware({
  ...routing,
  localeDetection: true,
  localePrefix: 'always'
});

// Protected routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/profile',
  '/orders',
  '/settings',
  '/add-funds',
  // Add other protected routes here
];

// Public routes that don't require authentication
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
];

function isAuthenticated(request: NextRequest): boolean {
  // Check for access token in cookies
  const accessToken = request.cookies.get('access_token')?.value;
  
  // Also check the authorization header as fallback
  const authHeader = request.headers.get('authorization');
  const tokenFromHeader = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;
  
  // Token mavjudligi va bo'sh emasligini tekshirish
  return !!(accessToken && accessToken.trim() !== '') || !!(tokenFromHeader && tokenFromHeader.trim() !== '');
}

function getLocaleFromPath(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  // Check if first segment is a valid locale
  if (routing.locales.includes(firstSegment as any)) {
    return firstSegment;
  }
  
  return routing.defaultLocale;
}

function getPathWithoutLocale(pathname: string): string {
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  
  // If first segment is a locale, remove it
  if (routing.locales.includes(firstSegment as any)) {
    return '/' + segments.slice(1).join('/');
  }
  
  return pathname;
}

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for API routes, static files, and other special paths
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/_vercel/') ||
    pathname.includes('.') ||
    pathname.startsWith('/trpc/')
  ) {
    return NextResponse.next();
  }

  const locale = getLocaleFromPath(pathname);
  const pathWithoutLocale = getPathWithoutLocale(pathname);
  const userIsAuthenticated = isAuthenticated(request);

  console.log('Middleware Debug:', {
    pathname,
    locale,
    pathWithoutLocale,
    userIsAuthenticated,
    accessToken: request.cookies.get('access_token')?.value ? 'exists' : 'missing'
  });

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathWithoutLocale === route || pathWithoutLocale.startsWith(route + '/')
  );

  // Handle protected routes - redirect to login if not authenticated
  if (isProtectedRoute && !userIsAuthenticated) {
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    console.log('Redirecting to login:', loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  // Handle auth routes - redirect to dashboard if already authenticated
  if (isAuthRoute && userIsAuthenticated) {
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    console.log('Redirecting to dashboard:', dashboardUrl.toString());
    return NextResponse.redirect(dashboardUrl);
  }

  // Handle root path - redirect based on authentication status
  if (pathWithoutLocale === '' || pathWithoutLocale === '/') {
    if (userIsAuthenticated) {
      const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
      console.log('Redirecting root to dashboard:', dashboardUrl.toString());
      return NextResponse.redirect(dashboardUrl);
    }
    // If not authenticated, let the home page load normally
  }

  // Apply internationalization middleware for all other requests
  const response = intlMiddleware(request);
  
  // Add security headers
  if (response) {
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  }
  
  return response;
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(uz|en|ru)/:path*',
    
    // Enable redirects that add missing locales
    // Skip API routes, static files, and other special paths
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ]
};