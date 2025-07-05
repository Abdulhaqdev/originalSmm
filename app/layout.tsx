import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"

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
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
