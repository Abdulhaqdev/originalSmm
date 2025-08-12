import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import {NextIntlClientProvider, hasLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import { routing } from '../i18n/routing'
import QueryProvider from '@/components/provider/queryprovider'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "OriginalSMM | Premium Social Media Marketing Services",
    template: "%s | OriginalSMM",
  },
  description:
    "Boost your social media presence with OriginalSMM's premium services. Get real followers, likes, views, and engagement across all major platforms.",
  keywords: [
    "SMM",
    "social media marketing",
    "Instagram followers",
    "YouTube views",
    "TikTok likes",
    "Facebook likes",
    "Twitter followers",
    "social media growth",
  ],
  icons: {
    icon: "/favicon.png",
  },
 
}

export default async  function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{locale: string}>;
}) {
  // Ensure that the incoming `locale` is valid
  const {locale} = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
      <QueryProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
          <Toaster />
        </ThemeProvider>
      </QueryProvider>
      </body>
    </html>
  )
}
