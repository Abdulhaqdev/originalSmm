"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CheckCircle, Clock, AlertCircle, XCircle } from "lucide-react";
import { Badge } from '../ui/badge'
import { Order } from '@/lib/api'



interface OrderListProps {
  orders: Order[];
}

export default function OrderList({ orders }: OrderListProps) {
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
        <CardTitle>{t("orders.allOrders") || "All Orders"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                {getStatusIcon(order.status)}
                <div>
                  <p className="font-medium">{order.service.name}</p>
                  <p className="text-sm text-gray-500">
                    {t("orders.orderId", { id: order.id }) || `Order #${order.id}`} •{" "}
                    {t("orders.quantity", { count: order.quantity.toLocaleString() }) || `Quantity: ${order.quantity.toLocaleString()}`}
                  </p>
                  <p className="text-xs text-gray-400">{order.created_at}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold">{order.price}</p>
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