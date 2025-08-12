"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingCart, CheckCircle, Clock } from "lucide-react";
import { User } from '@/lib/api'

type Order = {
  id: number;
  service: string;
  status: string;
  quantity: number;
  price: number;
  createdAt: string;
};

interface StatsCardProps {
  user: User | undefined;
  orders: Order[];
}

export default function StatsCard({ user, orders }: StatsCardProps) {
  const t = useTranslations("dashboard");

  const dashboardStats = [
    {
      title: t("stats.accountBalance") || "Account Balance",
      value: `$${user?.balance || 0}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: t("stats.totalOrders") || "Total Orders",
      value: orders.length,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: t("stats.completedOrders") || "Completed Orders",
      value: orders.filter((order) => order.status === "completed").length,
      icon: CheckCircle,
      color: "text-primary",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: t("stats.activeOrders") || "Active Orders",
      value: orders.filter((order) => order.status === "processing").length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {dashboardStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover-lift">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}