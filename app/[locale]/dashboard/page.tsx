"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import OrderList from "@/components/dashboard/OrderList";
import AccountInfo from "@/components/dashboard/AccountInfo";
import NewOrderForm, { type Service } from "@/components/dashboard/NewOrderForm";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const { user, isAuthenticated, isLoadingUser, isAuthReady } = useAuth();
  const { getServices, getCategories, getOrders} = useUser();
  const [activeTab, setActiveTab] = useState("new-orders");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Extract locale from pathname (e.g., /en/dashboard -> en)
  const locale = pathname.split("/")[1] || "en";

  // URL parametrlarini olish
  const tabFromUrl = searchParams.get('tab');
  const serviceIdFromUrl = searchParams.get('service');
  const categoryIdFromUrl = searchParams.get('category');

  // Fetch categories and services
  const { data: categoriesData, error: categoriesError, isLoading: categoriesLoading } = getCategories( locale);
  const { data: servicesData, error: servicesError, isLoading: servicesLoading } = getServices(100, 0, locale);
  const { data: ordersData, error: ordersError, isLoading: ordersLoading } = getOrders(locale);

  console.log("ordersData" , ordersData);
  console.log("categoriesData", categoriesData);

  // Tab'ni URL parametriga qarab o'rnatish
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [tabFromUrl]);

  // Handle fetch errors
  useEffect(() => {
    if (categoriesError || servicesError || ordersError) {
      toast.error(t("newOrder.dataFetchError") || "Ma'lumotlarni olishda xato yuz berdi");
    }
  }, [categoriesError, servicesError, ordersError, t]);

  // Redirect unauthenticated users (only after auth state is checked)
  useEffect(() => {
    if (!isAuthReady) return;

    if (!isAuthenticated) {
      toast.error("Boshqaruv paneliga kirish uchun tizimga kirishingiz kerak");
      router.push(`/${locale}/login?redirect=${encodeURIComponent(pathname)}`);
    }
  }, [isAuthenticated, isAuthReady, router, locale, pathname]);

  if (!isAuthReady || isLoadingUser || categoriesLoading || servicesLoading || ordersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {"Yuklanmoqda..."}
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Prevent rendering until redirect
  }

  const categories = Array.isArray(categoriesData) ? categoriesData.filter((cat) => cat.is_active !== false) : [];
  const orders = ordersData || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-24 pb-8 bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {t("welcome")} <span className="gradient-text">{user?.first_name}</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t("description") || "Buyurtmalaringizni boshqaring, yangi buyurtmalar yarating va ijtimoiy tarmoqlardagi faolligingizni oshiring."}
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
              <TabsTrigger value="new-orders">{t("tabs.newOrders") || "Yangi buyurtmalar"}</TabsTrigger>
              <TabsTrigger value="orders">{t("tabs.orders") || "Buyurtmalar"}</TabsTrigger>
              <TabsTrigger value="account">{t("tabs.account") || "Hisob"}</TabsTrigger>
            </TabsList>
            <TabsContent value="new-orders" className="space-y-6">
              <NewOrderForm 
                locale={locale} 
                categories={categories} 
                services={(servicesData ?? []) as Service[]} 
                user={user ?? null}
                initialServiceId={serviceIdFromUrl}
                initialCategoryId={categoryIdFromUrl}
              />
            </TabsContent>
            <TabsContent value="orders" className="space-y-6">
              <OrderList orders={orders} />
            </TabsContent>
            <TabsContent value="account" className="space-y-6">
              <AccountInfo user={user} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
      <Footer />
    </div>
  );
}