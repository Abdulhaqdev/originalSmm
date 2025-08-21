import createMiddleware from 'next-intl/middleware';
import { routing } from './app/i18n/routing';

export default createMiddleware({
  ...routing,
  localeDetection: true, // Avtomatik locale detection
  localePrefix: 'always' // Har doim URL da locale ko'rsatish
});

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