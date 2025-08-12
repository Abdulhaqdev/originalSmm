"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Search } from "lucide-react";
import { useUser } from "@/hooks/useUser";

export default function ServicesPage() {
  const t = useTranslations("services");
  const locale = useLocale();
  const router = useRouter();
  const { getServices } = useUser();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const limit = 10;

  type Service = {
    id: string;
    name: string;
    description: string;
    price: string;
    min: number;
    max: number;
    duration: number;
  };

  type ServicesData = {
    results: Service[];
    count: number;
    next?: string | null;
    previous?: string | null;
  };

  const { data: servicesData, isLoading: isLoadingServices } = getServices(limit, (page - 1) * limit, locale) as { data: ServicesData | undefined, isLoading: boolean };

  // Til o‘zgarganda sahifani yangilash
  useEffect(() => {
    setPage(1); // Sahifani 1 ga qaytarish
    router.refresh(); // Sahifani qayta yuklash
  }, [locale, router]);

  const services = servicesData?.results || [];

  const filteredServices = services
    .filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return parseFloat(a.price) - parseFloat(b.price);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const totalPages = servicesData ? Math.ceil(servicesData.count / limit) : 1;

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

          {/* Filters (faqat Search va Sort By) */}
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
                </div>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filters.sortLabel")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">{t("filters.sortOptions.name")}</SelectItem>
                    <SelectItem value="price">{t("filters.sortOptions.price")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <p className="text-gray-600 dark:text-gray-300">
              {t("filters.showingServices", { count: filteredServices.length })}
            </p>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-500">
                {searchTerm && `"${searchTerm}" • `}
                {t("filters.filterSummary.sortedBy", {
                  sortBy: t(`filters.sortOptions.${sortBy}`),
                })}
              </span>
            </div>
          </div>

          {isLoadingServices ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 text-lg">{t("filters.loadingServices")}</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service) => (
                  <Card
                    key={service.id}
                    className="hover-lift group transition-all duration-300 border-0 shadow-lg hover:shadow-2xl"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors duration-300">
                            {service.name}
                          </h3>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">${parseFloat(service.price).toFixed(2)}</div>
                          <div className="text-sm text-gray-500">{t("serviceDetails.per1000")}</div>
                        </div>
                      </div>

                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{service.description}</p>

                      <div className="space-y-2 mb-6">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{t("serviceDetails.minOrder")}:</span>
                          <span className="font-medium">{service.min}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500">{t("serviceDetails.maxOrder")}:</span>
                          <span className="font-medium">{service.max}</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-500 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {t("serviceDetails.delivery")}:
                          </span>
                          <span className="font-medium">{Math.ceil(service.duration / 3600)} {t("serviceDetails.hours")}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-end">
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                          {t("serviceDetails.orderNow")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredServices.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">{t("filters.filterSummary.noServices")}</p>
                </div>
              )}

              {/* Pagination */}
              <div className="mt-8 flex justify-center space-x-2">
                <Button
                  variant="outline"
                  disabled={page === 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  {t("pagination.previous")}
                </Button>
                <span className="text-sm text-gray-600 dark:text-gray-300 py-2">
                  {t("pagination.page", { current: page, total: totalPages })}
                </span>
                <Button
                  variant="outline"
                  disabled={page === totalPages || !servicesData?.next}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  {t("pagination.next")}
                </Button>
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}