"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Eye, CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

type Order = {
  id: number;
  service: string;
  status: string;
  quantity: number;
  price: number;
  createdAt: string;
};

interface RecentOrdersProps {
  orders: Order[];
  setActiveTab: (tab: string) => void;
}

export default function RecentOrders({ orders, setActiveTab }: RecentOrdersProps) {
  const t = useTranslations("dashboard");

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-600" />;
      case "pending":
        return <AlertCircle className="w-4 h-4 text-blue-600" />;
      case "canceled":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "processing":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "pending":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "canceled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {t("orders.recentOrders") || "Recent Orders"}
          <Link href="#" onClick={() => setActiveTab("orders")}>
            <Button variant="ghost" size="sm">
              {t("orders.viewAll") || "View All"}
              <Eye className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.slice(0, 3).map((order) => (
            <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                {getStatusIcon(order.status)}
                <div>
                  <p className="font-medium">{order.service}</p>
                  <p className="text-sm text-gray-500">
                    {t("orders.quantity", { count: order.quantity.toLocaleString() }) || `Quantity: ${order.quantity.toLocaleString()}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">${order.price.toFixed(2)}</p>
                <Badge className={getStatusColor(order.status)}>
                  {t(`orders.status.${order.status}`) || order.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}