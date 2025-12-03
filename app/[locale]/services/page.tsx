"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "@/app/i18n/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Search, Eye, ShoppingCart } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MobileServiceCard } from "@/components/dashboard/ServicesCrad";
import SocialIcon from "@/components/shared/SocialIcon";

export default function ServicesPage() {
  const t = useTranslations("services");
  const locale = useLocale();
  const router = useRouter();
  const { getServices, getCategories } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  type Service = {
    id: number;
    name: string;
    name_uz: string;
    name_ru: string;
    name_en: string;
    description: string;
    description_uz: string;
    description_ru: string;
    description_en: string;
    price: string;
    min: number;
    max: number;
    duration: number;
    category: number;
    api: number;
    site_id: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
  };

  type Category = {
    id: number;
    name: string;
    name_uz: string;
    name_ru: string;
    name_en: string;
    icon: string;
    is_active: boolean;
  };

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API orqali filter qilish
  const { data: servicesData, isLoading: isLoadingServices } = getServices(
    1000, // Barcha servicelarni olish
    0,
    locale,
    selectedCategory !== 'all' ? selectedCategory : undefined,
    true,
    debouncedSearch || undefined
  ) as { data: Service[] | undefined, isLoading: boolean };

  // Faqat active kategoriyalarni olish
  const { data: categoriesData, isLoading: categoriesLoading } = getCategories(
    locale,
    true
  ) as { data: Category[] | undefined, isLoading: boolean };

  const services = servicesData || [];
  const categories = categoriesData || [];

  const getCategoryIcon = (categoryId: number | string): string | undefined => {
    const numericId = typeof categoryId === 'string' ? parseInt(categoryId, 10) : categoryId;
    const category = categories.find(cat => cat.id === numericId);
    return category?.icon;
  };

  const getServiceName = (service: Service) => {
    switch (locale) {
      case 'uz':
        return service.name_uz || service.name;
      case 'ru':
        return service.name_ru || service.name;
      case 'en':
        return service.name_en || service.name;
      default:
        return service.name;
    }
  };

  const getServiceDescription = (service: Service) => {
    switch (locale) {
      case 'uz':
        return service.description_uz || service.description;
      case 'ru':
        return service.description_ru || service.description;
      case 'en':
        return service.description_en || service.description;
      default:
        return service.description;
    }
  };

  const getCategoryName = (category: Category) => {
    switch (locale) {
      case 'uz':
        return category.name_uz || category.name;
      case 'ru':
        return category.name_ru || category.name;
      case 'en':
        return category.name_en || category.name;
      default:
        return category.name;
    }
  };

  const getSelectedCategoryName = () => {
    if (selectedCategory === "all") return t("filters.allCategories");
    const category = categories.find(cat => cat.id.toString() === selectedCategory);
    return category ? getCategoryName(category) : "";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {t("hero.title")
                .split(" ")
                .map((word, index) =>
                  index >= t("hero.title").split(" ").length - 2 ? (
                    <span key={index} className="gradient-text">
                      {word}{" "}
                    </span>
                  ) : (
                    <span key={index}>{word} </span>
                  )
                )}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{t("hero.description")}</p>
          </div>

          {/* Filters */}
          <div className="max-w-6xl mx-auto">
            <Card className="p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder={t("filters.searchPlaceholder")}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                  {isLoadingServices && debouncedSearch && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filters.categoryLabel")} />
                  </SelectTrigger>
                  <SelectContent className="max-w-[calc(100vw-2rem)]">
                    <SelectItem value="all">{t("filters.allCategories")}</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center gap-2">
                          <SocialIcon iconName={category.icon} className="h-5 w-5 flex-shrink-0" />
                          <span className="break-words">{getCategoryName(category)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Table */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-300">
              {t("filters.showingServices", { count: services.length })}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {debouncedSearch && `"${debouncedSearch}" • `}
                {selectedCategory !== "all" && `${getSelectedCategoryName()}`}
              </span>
            </div>
          </div>

          {isLoadingServices ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-gray-500 dark:text-gray-400 text-lg">{t("filters.loadingServices")}</p>
            </div>
          ) : (
            <>
              <Card className="overflow-hidden hidden sm:block">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[60px]">ID</TableHead>
                        <TableHead className="min-w-[300px]">{t("table.service") || "Xizmat"}</TableHead>
                        <TableHead className="text-center">{t("table.price") || "Narx"}</TableHead>
                        <TableHead className="text-center">{t("serviceDetails.minOrder")}</TableHead>
                        <TableHead className="text-center">{t("serviceDetails.maxOrder")}</TableHead>
                        <TableHead className="text-center">{t("serviceDetails.delivery")}</TableHead>
                        <TableHead className="text-right">{t("table.actions") || "Amallar"}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {services.map((service) => (
                        <TableRow key={service.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                          <TableCell className="font-medium text-gray-500">{service.id}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <SocialIcon
                                  iconName={getCategoryIcon(service.category) || ''}
                                  className="h-5 w-5 flex-shrink-0"
                                />
                                <span className="font-medium">{getServiceName(service)}</span>
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-1">
                                {getServiceDescription(service).split('\n')[0]}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="font-bold text-primary">{service.price}</div>
                            <div className="text-xs text-gray-500">{t("serviceDetails.per1000")}</div>
                          </TableCell>
                          <TableCell className="text-center">{service.min}</TableCell>
                          <TableCell className="text-center">{service.max}</TableCell>
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span className="text-sm">{Math.ceil(service.duration / 3600)}h</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="outline" size="sm">
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                                  <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                                      <SocialIcon
                                        iconName={getCategoryIcon(service.category) || ''}
                                        className="h-6 w-6 flex-shrink-0"
                                      />
                                      {getServiceName(service)}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                                      <div>
                                        <div className="text-2xl font-bold text-primary">
                                          {service.price}
                                        </div>
                                        <div className="text-sm text-gray-500">{t("serviceDetails.per1000")}</div>
                                      </div>
                                      <div className="text-right space-y-1">
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                          ID: {service.id}
                                        </div>
                                        <div className="text-sm">
                                          Min: {service.min} • Max: {service.max}
                                        </div>
                                        <div className="text-sm flex items-center justify-end">
                                          <Clock className="w-3 h-3 mr-1" />
                                          {Math.ceil(service.duration / 3600)} {t("serviceDetails.hours")}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="prose dark:prose-invert max-w-none">
                                      <div className="text-gray-700 dark:text-gray-300 whitespace-pre-line">
                                        {getServiceDescription(service)}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                size="sm"
                                className="bg-primary hover:bg-primary/90 text-white"
                                onClick={() =>
                                  router.push({
                                    pathname: "/dashboard",
                                    query: {
                                      tab: "new-orders",
                                      service: service.id,
                                      category: service.category,
                                    },
                                  })
                                }
                              >
                                <ShoppingCart className="w-4 h-4 mr-1" />
                                {t("serviceDetails.orderNow")}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </Card>
              <div className="sm:hidden space-y-4">
                {services.map((service) => (
                  <MobileServiceCard
                    key={service.id}
                    service={service}
                    locale={locale}
                    getServiceName={getServiceName}
                    getServiceDescription={getServiceDescription}
                    getCategoryIcon={getCategoryIcon}
                    t={t}
                  />
                ))}
              </div>
              {services.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">{t("filters.filterSummary.noServices")}</p>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}