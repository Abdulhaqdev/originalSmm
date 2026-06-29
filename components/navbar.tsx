"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/app/i18n/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {  LogOut, CreditCard, Briefcase, LayoutDashboard, Sun, Moon, Home, Users, Code2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import LocaleSwitcher from "./shared/LanguageSwitcher";
import Image from 'next/image'
import type { ComponentType } from "react";

type NavHref = "/" | "/services" | "/dashboard" | "/add-funds" | "/about" | "/api";

type NavItem = {
  name: string;
  href: NavHref;
  icon: ComponentType<{ className?: string }>;
};

export default function Navbar() {
  const t = useTranslations("navbar");
  const [mounted, setMounted] = useState(false);
  const { user, isAuthenticated, logout, isLoadingUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Navigatsiya elementlari: faqat login qilinganda Dashboard, Services, Add Funds ko'rinadi
  const navItems: NavItem[] = mounted && isAuthenticated
    ? [
      { name: t("services"), href: "/services", icon: Briefcase },
      { name: t("dashboard"), href: "/dashboard", icon: LayoutDashboard },
      { name: t("addFunds"), href: "/add-funds", icon: CreditCard },
      { name: t("api"), href: "/api", icon: Code2 },
    ]
    : [
      { name: t("home"), href: "/", icon: Home },
      { name: t("services"), href: "/services", icon: Briefcase },
      { name: t("about"), href: "/about", icon: Users },
      { name: t("api"), href: "/api", icon: Code2 },
    ];

  const getUserInitials = (user: { first_name?: string; last_name?: string; username?: string; email?: string }) => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="container flex items-center justify-between mx-auto px-4">
          <div className="flex items-center w-full justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <Image
                src="/logolight.png"
                alt="Light theme logo"
                width={180}
                height={40}
                priority // Preload the image
                className="dark:hidden object-contain mt-1"
              />
              <Image
                src="/logo.png"
                alt="Dark theme logo"
                width={180}
                height={40}
                priority // Preload the image
                className="hidden dark:block object-contain mb-2"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-200 relative group",
                    pathname === item.href && "text-primary dark:text-primary"
                  )}
                >
                  {item.name}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-200",
                      pathname === item.href ? "w-full" : "w-0 group-hover:w-full"
                    )}
                  ></span>
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="flex items-center space-x-2">
              <LocaleSwitcher />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-gray-600 dark:text-gray-300 dark:hover:text-primary h-9 w-9"
                aria-label={t("themeToggle")}
              >
                {mounted ? (
                  <>
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </>
                ) : (
                  <span className="h-4 w-4" aria-hidden />
                )}
              </Button>
              {isLoadingUser ? (
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
              ) : mounted && isAuthenticated && user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary text-white text-sm">
                          {getUserInitials(user)}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user.first_name} {user.last_name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="flex items-center">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        {t("dashboard")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/add-funds" className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
                        {t("addFunds")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={logout}
                      className="text-red-600 dark:text-red-400"
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center space-x-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">{t("login")}</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-md border-t border-gray-700/50 dark:bg-gray-900/95 dark:border-gray-700/50">
        <div className="flex items-center justify-around py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-[60px]",
                  isActive
                    ? "text-primary bg-primary/10"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                )}
              >
                <Icon className={cn("w-5 h-5 mb-1", isActive && "text-primary")} />
                <span className={cn("text-xs font-medium", isActive && "text-primary")}>
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}