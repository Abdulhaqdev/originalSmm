"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Wallet, Plus, Minus, ArrowRight } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useTranslations } from "use-intl";
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/hooks/useAuth'
import { useUser } from '@/hooks/useUser'

interface Transaction {
  id: number;
  price: string;
  payment_type: {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    is_active: boolean;
  };
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export default function AddFundsPage() {
  const pathname = usePathname();
  const t = useTranslations("addFunds");
  const { user } = useAuth();
  const { createPayeerPayment, isCreatingPayeerPayment } = useUser();

  const [amount, setAmount] = useState<string>("10000");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  const [payHistory, setPayHistory] = useState<Transaction[]>([]);

  const predefinedAmounts = [10000, 50000, 100000];
  const paymentMethods = [
    { id: "click", name: "Click", icon: "/click.png", isUnderMaintenance: false}, // Click yoqildi
    { id: "payme", name: "Payme", icon: "/payme.png", isUnderMaintenance: true},
    { id: "payeer", name: "Payeer", icon: "/payeer.png", isUnderMaintenance: false },
  ];

  const handleAmountChange = (value: string) => {
    const regex = /^[0-9]*/;
    if (value === "" || regex.test(value)) {
      setAmount(value);
    }
  };

  const handlePredefinedAmount = (value: number) => {
    setAmount(value.toString());
  };

  const handleIncrement = () => {
    const currentAmount = Number.parseInt(amount) || 0;
    setAmount((currentAmount + 5000).toString());
  };

  const handleDecrement = () => {
    const currentAmount = Number.parseInt(amount) || 0;
    if (currentAmount >= 5000) {
      setAmount((currentAmount - 5000).toString());
    }
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    if (paymentMethods.find((m) => m.id === methodId)?.isUnderMaintenance) {
      return;
    }
    setSelectedPaymentMethod(methodId);
  };

  // Click to'lovi uchun URL yaratish funksiyasi
  const generateClickPaymentUrl = (amount: string, userId: string) => {
    const baseUrl = "https://my.click.uz/services/pay";
    const params = new URLSearchParams({
      service_id: "82883",
      merchant_id: "46110",
      amount: amount,
      transaction_param: userId,
      return_url: `https://www.originalsmm.uz/dashboard`, // To'lovdan keyingi qaytish URL manzili
    })
    return `${baseUrl}?${params.toString()}`;
  };
  console.log(generateClickPaymentUrl("10000", "1")); // Test uchun

  const handleAddFunds = () => {
    if (!amount || !selectedPaymentMethod || !user) {
      return;
    }

    const amountNum = Number.parseInt(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return;
    }

    if (selectedPaymentMethod === "click") {
      // Click to'lovi uchun URL yaratish va sahifaga o'tish
      const clickUrl = generateClickPaymentUrl(amount, user.id.toString());
      window.open(clickUrl, '_blank');
      
      // Yoki hozirgi sahifada ochish uchun:
      // window.location.href = clickUrl;
      
    } else if (selectedPaymentMethod === "payeer") {
      createPayeerPayment({
        amount: amount,
        user_id: user.id.toString(),
        currency: "USD",
        description: "Balans to'ldirish"
      });
    }
    // Payme uchun ham shunga o'xshash qo'shish mumkin
  };

  return (
    <div className="pt-16 pb-8 bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-4 max-w-2xl">
        <div className="space-y-4">
          {/* Balance Section */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="h-5 w-5 text-primary" />
                <span className="font-semibold">{t("currentBalance")}</span>
              </div>
              <Badge variant="secondary" className="text-sm md:text-base font-bold text-primary">
                {user?.balance || 0} UZS
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {t("currentBalanceDescription")}
            </p>
          </div>

          {/* Add Funds Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="amount" className="text-sm font-medium">
                {t("amountLabel")}
              </Label>
              <div className="flex items-center gap-2 bg-muted/50 rounded-xl p-1">
                <Button variant="ghost" size="icon" onClick={handleDecrement} className="hover:bg-muted">
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="amount"
                  placeholder={t("amountPlaceholder")}
                  className="border-0 bg-transparent text-center flex-1"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                />
                <Button variant="ghost" size="icon" onClick={handleIncrement} className="hover:bg-muted">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {t("amountEstimate", { amount: (Number(amount) || 0) })}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 justify-center">
              {predefinedAmounts.map((value) => (
                <Button
                  key={value}
                  variant="outline"
                  size="sm"
                  className={`rounded-full ${amount === value.toString() ? "bg-primary hover:bg-primary/90 text-white text-sm md:text-base py-2.5" : ""}`}
                  onClick={() => handlePredefinedAmount(value)}
                >
                  {value}
                </Button>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("paymentMethodLabel")}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {paymentMethods.map((method) => (
                  <div
                    key={method.id}
                    className={`border rounded-xl p-3 cursor-pointer transition-all ${
                      selectedPaymentMethod === method.id 
                        ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-900/50" 
                        : "hover:border-indigo-300"
                    } ${method.isUnderMaintenance ? "opacity-50 cursor-not-allowed" : ""}`}
                    onClick={() => !method.isUnderMaintenance && handlePaymentMethodSelect(method.id)}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-28 h-28 relative">
                        <Image src={method.icon} alt={method.name} fill className="object-contain rounded-md" />
                      </div>
                      <span className="text-sm font-medium">{method.name}</span>
                      {method.isUnderMaintenance && (
                        <Badge variant="destructive" className="text-xs">
                          {t("maintenance")}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              className="w-full rounded-full bg-primary hover:bg-primary/90 text-white text-sm md:text-base py-2.5"
              onClick={handleAddFunds}
              disabled={isCreatingPayeerPayment || !amount || !selectedPaymentMethod}
            >
              {isCreatingPayeerPayment ? t("submitProcessing") : t("submitButton")}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* Transaction History */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="font-semibold">{t("transactionHistory")}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {t("transactionHistoryDescription")}
            </p>
            <div className="text-center py-4 text-muted-foreground">
              {t("noTransactions")}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}