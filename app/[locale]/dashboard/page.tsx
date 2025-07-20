// app/[locale]/dashboard/page.tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Users, Clock, DollarSign, ShoppingCart, Plus, Eye, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { mockUser, mockOrders } from "@/lib/mock-data";

export default function DashboardPage() {
  const t = useTranslations("dashboard");
  const [activeTab, setActiveTab] = useState("overview");

  const translatedUser = {
    ...mockUser,
    name: "John Doe",
    email: t("mockUser.email") || mockUser.email || "john@example.com",
  };

  type Order = {
    id: number;
    service: string;
    status: string;
    quantity: number;
    price: number;
    createdAt: string;
  };

  const translatedOrders = (t.raw("mockOrders") as Array<Order>)?.map((order) => {
    const baseOrder = mockOrders.find((o: Order) => o.id === order.id) || order;
    return { ...baseOrder, service: order.service };
  }) || (mockOrders as Array<Order>);

  const dashboardStats = [
    {
      title: t("stats.accountBalance") || "Account Balance",
      value: `$${mockUser.balance}`,
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: t("stats.totalOrders") || "Total Orders",
      value: mockUser.totalOrders,
      icon: ShoppingCart,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: t("stats.completedOrders") || "Completed Orders",
      value: translatedOrders.filter((order) => order.status === "completed").length,
      icon: CheckCircle,
      color: "text-primary",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: t("stats.activeOrders") || "Active Orders",
      value: translatedOrders.filter((order) => order.status === "processing").length,
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
  ];

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
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <section className="pt-24 pb-8 bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                {t("welcome")}
                <span className="gradient-text">{translatedUser.name}</span>
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                {t("description") || "Manage your orders, track progress, and grow your social media presence."}
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-4">
              <Link href="/services">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  {t("actions.newOrder") || "New Order"}
                </Button>
              </Link>
              <Button variant="outline">
                <DollarSign className="w-4 h-4 mr-2" />
                {t("actions.addFunds") || "Add Funds"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:grid-cols-3">
              <TabsTrigger value="overview">{t("tabs.overview") || "Overview"}</TabsTrigger>
              <TabsTrigger value="orders">{t("tabs.orders") || "Orders"}</TabsTrigger>
              <TabsTrigger value="account">{t("tabs.account") || "Account"}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Stats Cards */}
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

              {/* Recent Orders */}
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
                    {translatedOrders.slice(0, 3).map((order) => (
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

              {/* Quick Actions */}
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
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("orders.allOrders") || "All Orders"}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {translatedOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                      >
                        <div className="flex items-center space-x-4">
                          {getStatusIcon(order.status)}
                          <div>
                            <p className="font-medium">{order.service}</p>
                            <p className="text-sm text-gray-500">
                              {t("orders.orderId", { id: order.id }) || `Order #${order.id}`} •{" "}
                              {t("orders.quantity", { count: order.quantity.toLocaleString() }) || `Quantity: ${order.quantity.toLocaleString()}`}
                            </p>
                            <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">${order.price.toFixed(2)}</p>
                          <Badge className={getStatusColor(order.status)}>
                            {t(`orders.status.${order.status}`) || order.status}
                          </Badge>
                          {/* {order.status === "processing" && (
                            <div className="mt-2">
                              <Progress value={65} className="w-20" />
                              <p className="text-xs text-gray-500 mt-1">
                                {t("orders.progress", { percent: 65 }) || "65% complete"}
                              </p>
                            </div>
                          )} */}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>{t("account.info") || "Account Information"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {t("account.name") || "Name"}
                      </label>
                      <p className="text-lg font-semibold">{translatedUser.name}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {t("account.email") || "Email"}
                      </label>
                      <p className="text-lg font-semibold">{translatedUser.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
                        {t("account.memberSince") || "Member Since"}
                      </label>
                      <p className="text-lg font-semibold">{new Date(mockUser.joinedAt).toLocaleDateString()}</p>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      {t("account.editProfile") || "Edit Profile"}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>{t("account.stats") || "Account Statistics"}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">{t("account.currentBalance") || "Current Balance"}</span>
                      <span className="text-2xl font-bold text-primary">${mockUser.balance}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">{t("account.totalOrders") || "Total Orders"}</span>
                      <span className="text-xl font-semibold">{mockUser.totalOrders}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-300">{t("account.successRate") || "Success Rate"}</span>
                      <span className="text-xl font-semibold text-green-600">98.5%</span>
                    </div>
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      <DollarSign className="w-4 h-4 mr-2" />
                      {t("actions.addFunds") || "Add Funds"}
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}