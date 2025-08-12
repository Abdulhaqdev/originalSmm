import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


import { useTranslations } from "next-intl";

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
};

export const getTimeColor = (duration: number): string => {
  if (duration <= 60) return "text-blue-500";
  if (duration <= 1440) return "text-emerald-500";
  return "text-yellow-500";
};

export const formatDuration = (seconds: number, t: ReturnType<typeof useTranslations>): string => {
  if (seconds <= 60) return t("newOrder.timeSoon") || "Tez orada";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;
  const parts = [];
  if (hours > 0) parts.push(`${hours} soat`);
  if (minutes > 0) parts.push(`${minutes} daqiqa`);
  if (remainingSeconds > 0 || parts.length === 0) parts.push(`${remainingSeconds} soniya`);
  return parts.join(" ");
};