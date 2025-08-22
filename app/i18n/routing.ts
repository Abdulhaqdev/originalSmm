import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'uz', 'ru'],
  defaultLocale: 'uz',
  localePrefix: 'always', 
  pathnames: {
    '/': '/',
    '/services': {
      en: '/services',
      uz: '/xizmatlar',
      ru: '/услуги'
    },
    '/about': {
      en: '/about',
      uz: '/haqida',
      ru: '/о-нас'
    },
    '/dashboard': '/dashboard',
    '/login': '/login',
    '/add-funds': '/add-funds'
  }
});

export type Pathnames = keyof typeof routing.pathnames;
export type Locale = (typeof routing.locales)[number];