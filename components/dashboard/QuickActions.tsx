"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, DollarSign, Users } from "lucide-react";

export default function QuickActions() {
  const t = useTranslations("dashboard");

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="hover-lift group cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
            <Plus className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("actions.placeNewOrder") || "Place New Order"}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {t("actions.placeNewOrderDesc") || "Browse our services and place a new order"}
          </p>
        </CardContent>
      </Card>
      <Card className="hover-lift group cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/30 transition-colors">
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("actions.addFunds") || "Add Funds"}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {t("actions.addFundsDesc") || "Top up your account balance"}
          </p>
        </CardContent>
      </Card>
      <Card className="hover-lift group cursor-pointer">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 dark:group-hover:bg-purple-900/30 transition-colors">
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{t("actions.getSupport") || "Get Support"}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {t("actions.getSupportDesc") || "Contact our 24/7 support team"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}