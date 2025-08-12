"use client";

import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign,  } from "lucide-react";
import { User } from '@/lib/api'

interface AccountStatsProps {
  user: User | undefined;
}

export default function AccountStats({ user }: AccountStatsProps) {
  const t = useTranslations("dashboard");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("account.stats") || "Account Statistics"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">{t("account.currentBalance") || "Current Balance"}</span>
          <span className="text-2xl font-bold text-primary">${user?.balance || "0.00"}</span>
        </div>
        <div>
          <span className="text-gray-600 dark:text-gray-300">{t("account.apiKey") || "API Key"}</span>
          <p className="text-lg font-semibold break-all">{user?.api_key || "N/A"}</p>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">{t("account.totalOrders") || "Total Orders"}</span>
          <span className="text-xl font-semibold">{user?.id ? "0" : "0"}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-300">{t("account.successRate") || "Success Rate"}</span>
          <span className="text-xl font-semibold text-green-600">{user?.id ? "0" : "0"}</span>
        </div>
        <Button className="w-full bg-primary hover:bg-primary/90 text-white">
          <DollarSign className="w-4 h-4 mr-2" />
          {t("actions.addFunds") || "Add Funds"}
        </Button>
      </CardContent>
    </Card>
  );
}