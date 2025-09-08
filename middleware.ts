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
  // Add other protected routes here
];

// Public routes that don't require authentication
const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
];

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get the locale from the pathname
  const pathnameIsMissingLocale = routing.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // Extract the path without locale
  let pathWithoutLocale = pathname;
  if (!pathnameIsMissingLocale) {
    const segments = pathname.split('/');
    pathWithoutLocale = '/' + segments.slice(2).join('/');
  }

  // Check if the route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );

  // Check if the route is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathWithoutLocale.startsWith(route)
  );

  // Get auth token from cookies or check if it exists
  const accessToken = request.cookies.get('access_token')?.value;
  
  // Alternative: Check localStorage token (this won't work in middleware, so we'll use cookies)
  // You'll need to modify your auth to also store tokens in cookies for middleware access
  
  const isAuthenticated = !!accessToken;

  // Handle protected routes
  if (isProtectedRoute && !isAuthenticated) {
    // Get the current locale or default to 'uz'
    const locale = !pathnameIsMissingLocale 
      ? pathname.split('/')[1] 
      : routing.defaultLocale;
    
    // Redirect to login page with return url
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set('returnUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Handle auth routes - redirect to dashboard if already authenticated
  if (isAuthRoute && isAuthenticated) {
    const locale = !pathnameIsMissingLocale 
      ? pathname.split('/')[1] 
      : routing.defaultLocale;
    
    const dashboardUrl = new URL(`/${locale}/dashboard`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Apply internationalization middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',
    
    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    '/(uz|en|ru)/:path*',
    
    // Enable redirects that add missing locales
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
  ]
};