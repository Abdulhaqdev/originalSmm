// app/[locale]/services/page.tsx
"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, Star, Search, Filter } from "lucide-react";
import { useTranslations } from "next-intl";
import { mockServices, mockPlatforms } from "@/lib/mock-data";

export default function ServicesPage() {
  const t = useTranslations("services");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");

  const translatedServices = (t.raw("mockServices") as Array<{
    id: number;
    name: string;
    description: string;
    deliveryTime: string;
    quality: string;
  }>).map((translatedService) => {
    const service = mockServices.find((s) => s.id === translatedService.id);
    return {
      ...service,
      name: translatedService.name,
      description: translatedService.description,
      deliveryTime: translatedService.deliveryTime,
      quality: translatedService.quality,
    };
  });

  const translatedPlatforms = (t.raw("mockPlatforms") as Array<{ name: string }>).map((translatedPlatform) => {
    const platform = mockPlatforms.find((p) => p.name.toLowerCase() === translatedPlatform.name.toLowerCase());
    return { ...platform, name: translatedPlatform.name };
  });

  const categories = t.raw("categories") as Array<{ value: string; label: string }>;

  const filteredServices = translatedServices
    .filter((service) => {
      const matchesPlatform = selectedPlatform === "all" || service.platform === selectedPlatform;
      const matchesCategory = selectedCategory === "all" || service.category === selectedCategory;
      const matchesSearch =
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesPlatform && matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price":
          return (a.price ?? 0) - (b.price ?? 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

                {/* Platform Filter */}
                <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filters.platformLabel")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("filters.allPlatforms")}</SelectItem>
                    {translatedPlatforms.map((platform) => (
                      <SelectItem key={platform.name} value={platform.name.toLowerCase()}>
                        {platform.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Category Filter */}
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filters.categoryLabel")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

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
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-500">
                {selectedPlatform !== "all" && `${selectedPlatform} • `}
                {selectedCategory !== "all" && `${selectedCategory} • `}
                {searchTerm && `"${searchTerm}" • `}
                {t("filters.filterSummary.sortedBy", {
                  sortBy: t(`filters.sortOptions.${sortBy}`),
                })}
              </span>
            </div>
          </div>

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
                      <Badge variant="secondary" className="capitalize">
                        {service.platform}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">${service.price}</div>
                      <div className="text-sm text-gray-500">{t("serviceDetails.per1000")}</div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{service.description}</p>

                  <div className="space-y-2 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{t("serviceDetails.minOrder")}:</span>
                      <span className="font-medium">{service.minOrder}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">{t("serviceDetails.maxOrder")}:</span>
                      <span className="font-medium">{service.maxOrder}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {t("serviceDetails.delivery")}:
                      </span>
                      <span className="font-medium">{service.deliveryTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{service.quality}</span>
                    </div>
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
        </div>
      </section>

      <Footer />
    </div>
  );
}