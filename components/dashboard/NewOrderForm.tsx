"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useUser } from "@/hooks/useUser";
import SocialIcon from "@/components/shared/SocialIcon";
import { formatCurrency, getTimeColor, formatDuration } from "@/lib/utils";
import { Category, User } from '@/lib/api'

// Extend Service type to include localized fields
export interface Service {
  id: number | string;
  category: number | string;
  name: string;
  description: string;
  price: number;
  min: number;
  max: number;
  duration: number;
  name_uz?: string;
  name_ru?: string;
  name_en?: string;
  description_uz?: string;
  description_ru?: string;
  description_en?: string;
  [key: string]: any;
}

interface NewOrderFormProps {
  locale: string;
  categories: Category[];
  services: Service[];
  user: User| null;
  initialServiceId?: string | null;
  initialCategoryId?: string | null;
}

export default function NewOrderForm({ 
  locale, 
  categories, 
  services, 
  user,
  initialServiceId,
  initialCategoryId 
}: NewOrderFormProps) {
  const t = useTranslations("dashboard");
  const { createOrder, isCreatingOrder } = useUser();
  const router = useRouter();
  const [categoryId, setCategoryId] = useState<string>("");
  const [serviceId, setServiceId] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [quantity, setQuantity] = useState<string>("0");
  const [quantityError, setQuantityError] = useState<string | null>(null);
  const [linkError, setLinkError] = useState<string | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  const socialPlatforms = [
    "Instagram",
    "Facebook", 
    "Twitter",
    "Spotify",
    "TikTok",
    "LinkedIn",
    "Google",
    "Telegram",
    "Discord",
    "Snapchat",
    "Twitch",
    "Youtube",
  ];

  console.log(categories);

  // Map social icons to categories
  const enrichedCategories = categories.map((category) => {
    const normalizedCategoryName = category.name.toLowerCase();
    const matchingPlatform = socialPlatforms.find((platform) =>
      normalizedCategoryName.includes(platform.toLowerCase())
    );
    return {
      ...category,
      icon: matchingPlatform ? matchingPlatform.toLowerCase() : undefined,
    };
  });

  // Get category name based on locale
  interface LocalizedCategory {
    id: number | string;
    name: string;
    name_uz?: string;
    name_ru?: string;
    name_en?: string;
    icon?: string;
    [key: string]: any;
  }

  const getCategoryName = (category: LocalizedCategory): string => {
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

  // Get service name and description based on locale
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

  // Filter services by category
  const filteredServices = services.filter((srv) => String(srv.category) === categoryId);

  // Initial qiymatlarni o'rnatish
  useEffect(() => {
    if (initialCategoryId && categories.length > 0) {
      setCategoryId(initialCategoryId);
    }
    if (initialServiceId && services.length > 0) {
      const service = services.find(s => String(s.id) === initialServiceId);
      if (service) {
        setServiceId(initialServiceId);
        setSelectedService(service);
        // Quantity ni service min qiymatiga o'rnatish
        setQuantity(service.min.toString());
      }
    }
  }, [initialCategoryId, initialServiceId, categories, services]);

  // Set selected service and validate quantity
  const handleServiceChange = (value: string) => {
    setServiceId(value);
    const service = services.find((srv) => String(srv.id) === value);
    setSelectedService(service || null);
    
    if (service) {
      // Service tanlanganda minimum quantity ni o'rnatish
      setQuantity(service.min.toString());
      setQuantityError(null);
    } else {
      setQuantity("0");
    }
    
    calculateTotalPrice(service, service ? service.min.toString() : "0");
  };

  // Calculate total price
  const calculateTotalPrice = (service: Service | null = selectedService, currentQuantity: string = quantity) => {
    if (service && currentQuantity) {
      const quantityNum = Number.parseInt(currentQuantity);
      if (!isNaN(quantityNum) && quantityNum > 0) {
        const price = Math.round((Number(service.price) * quantityNum) / 1000);
        setTotalPrice(price);
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  };

  // Validation functions
  const validateQuantity = (currentServiceId: string = serviceId): boolean => {
    setQuantityError(null);
    if (!quantity.trim()) {
      setQuantityError(t("newOrder.quantityRequired"));
      return false;
    }
    const quantityNum = Number.parseInt(quantity);
    if (isNaN(quantityNum)) {
      setQuantityError(t("newOrder.quantityInvalid"));
      return false;
    }
    const service = services.find((srv) => String(srv.id) === currentServiceId);
    if (!service) {
      setQuantityError(t("newOrder.serviceNotSelected"));
      return false;
    }
    if (quantityNum < service.min) {
      setQuantityError(t("newOrder.quantityMin", { min: service.min }));
      return false;
    }
    if (quantityNum > service.max) {
      setQuantityError(t("newOrder.quantityMax", { max: service.max }));
      return false;
    }
    return true;
  };

  const validateLink = (): boolean => {
    setLinkError(null);
    if (!link.trim()) {
      setLinkError(t("newOrder.linkRequired"));
      return false;
    }
    try {
      new URL(link);
      return true;
    } catch (e) {
      setLinkError(t("newOrder.invalidLink"));
      return false;
    }
  };

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    if (selectedService) {
      validateQuantity();
    } else if (value) {
      setQuantityError(t("newOrder.selectServiceFirst"));
    } else {
      setQuantityError(null);
    }
    calculateTotalPrice(selectedService, value);
  };

  const handleSubmit = async () => {
    setFormSubmitted(true);

    const isLinkValid = validateLink();
    const isQuantityValid = validateQuantity();

    if (!isLinkValid || !isQuantityValid) {
      return;
    }

    if (!user) {
      toast.error(t("newOrder.noUserData"));
      return;
    }

    const quantityNum = Number.parseInt(quantity);

    if (Number(user.balance) < totalPrice) {
      toast.error(
        t("newOrder.insufficientBalance", { balance: user.balance ?? 0, totalPrice: totalPrice ?? 0 })
      );
      router.push(`/${locale.split("-")[0]}/dashboard/add-funds`);
      return;
    }

    createOrder({
      service_id: Number(serviceId),
      url: link,
      status: "pending",
      quantity: quantityNum,
    });

    // Formani tozalash
    setCategoryId("");
    setServiceId("");
    setLink("");
    setQuantity("0");
    setSelectedService(null);
    setTotalPrice(0);
    setFormSubmitted(false);
    
    // URL parametrlarini tozalash
    router.replace(`/${locale}/dashboard?tab=new-orders`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("newOrder.title") || "Yangi buyurtma"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="categoryId">{t("newOrder.categories") || "Kategoriyalar"}</Label>
          <Select
            value={categoryId}
            onValueChange={(value) => {
              setCategoryId(value);
              setServiceId("");
              setQuantity("0");
              setSelectedService(null);
              setTotalPrice(0);
            }}
            disabled={isCreatingOrder}
          >
            <SelectTrigger>
              <SelectValue placeholder={t("newOrder.selectCategory") || "Kategoriya tanlang"} />
            </SelectTrigger>
            <SelectContent>
              {enrichedCategories.map((category) => (
                <SelectItem key={category.id} value={String(category.id)}>
                  <div className="flex items-center gap-2">
                    {category.icon && <SocialIcon iconName={category.icon} className="h-5 w-5" />}
                    <span className="text-wrap">{getCategoryName(category)}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="serviceId">{t("newOrder.services") || "Xizmatlar"}</Label>
          <Select
            value={serviceId}
            onValueChange={handleServiceChange}
            disabled={!categoryId || filteredServices.length === 0 || isCreatingOrder}
          >
            <SelectTrigger className="w-full text-wrap">
              <SelectValue
                placeholder={
                  !categoryId
                    ? t("newOrder.selectCategoryFirst")
                    : filteredServices.length === 0
                    ? t("newOrder.noServicesAvailable")
                    : t("newOrder.selectService")
                }
              />
            </SelectTrigger>
            <SelectContent>
              {filteredServices.map((service) => (
                <SelectItem key={service.id} value={String(service.id)}>
                  <div className="flex flex-col">
                    <span className="text-start">{getServiceName(service)}</span>
                    <span className="text-xs text-muted-foreground">
                      {service.price} / 1000 • Min: {service.min} • Max: {service.max}
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="link">{t("newOrder.link") || "Havola"}</Label>
          <Input
            id="link"
            placeholder={t("newOrder.enterLink") || "Havolani kiriting"}
            value={link}
            onChange={(e) => {
              setLink(e.target.value);
              if (formSubmitted) setLinkError(null);
            }}
            disabled={!serviceId || isCreatingOrder}
            className={linkError ? "border-destructive" : ""}
          />
          {linkError && <p className="text-destructive text-sm mt-1">{linkError}</p>}
        </div>
        <div>
          <Label htmlFor="quantity">{t("newOrder.quantity") || "Miqdor"}</Label>
          <Input
            id="quantity"
            type="number"
            placeholder={t("newOrder.enterQuantity") || "Miqdorni kiriting"}
            value={quantity}
            onChange={(e) => handleQuantityChange(e.target.value)}
            disabled={!serviceId || isCreatingOrder}
            className={quantityError ? "border-destructive" : ""}
          />
          {quantityError && <p className="text-destructive text-sm mt-1">{quantityError}</p>}
          {selectedService && (
            <p className="mt-1 text-sm text-muted-foreground">
              Min: {selectedService.min} - Max: {selectedService.max}
            </p>
          )}
        </div>
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("newOrder.orderSummary") || "Buyurtma xulosasi"}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedService ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <span className="text-muted-foreground">{t("newOrder.category")}:</span>
                    <div className="flex items-center gap-2">
                      {categoryId &&
                        enrichedCategories.find((cat) => String(cat.id) === categoryId)?.icon && (
                          <SocialIcon
                            iconName={enrichedCategories.find((cat) => String(cat.id) === categoryId)!.icon!}
                            className="h-5 w-5"
                          />
                        )}
                      <span>
                        {enrichedCategories.find((cat) => String(cat.id) === categoryId)?.name || ""}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <span className="text-muted-foreground">{t("newOrder.service")}:</span>
                    <span>{getServiceName(selectedService)}</span>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
                    <span className="text-muted-foreground">{t("newOrder.description")}:</span>
                    <span>{getServiceDescription(selectedService)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">{t("newOrder.quantity")}:</span>
                    <span>{quantity}</span>
                  </div>
                  {link && (
                    <div className="grid grid-cols-2 gap-2">
                      <span className="text-muted-foreground">{t("newOrder.link")}:</span>
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary dark:text-blue-400 hover:underline text-sm"
                      >
                        {link.slice(0, 30)}...
                      </a>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">{t("newOrder.time")}:</span>
                    <span className={getTimeColor(selectedService.duration)}>
                      {formatDuration(selectedService.duration, t)}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-muted-foreground">{t("newOrder.price")}:</span>
                    <span>{selectedService.price} UZS / 1000</span>
                  </div>
                  <div className="border-t pt-4 flex items-center justify-between">
                    <span className="text-muted-foreground font-medium">{t("newOrder.totalPrice")}</span>
                    <span className="text-xl font-bold">{totalPrice} UZS</span>
                  </div>
                </div>
              ) : (
                <p className="text-muted-foreground">{t("newOrder.selectServiceForSummary")}</p>
              )}
            </CardContent>
            <CardFooter>
              <Button
                className="w-full"
                size="lg"
                onClick={handleSubmit}
                disabled={!categoryId || !serviceId || !link || !quantity || isCreatingOrder || quantityError !== null}
              >
                {isCreatingOrder
                  ? t("newOrder.submitting") || "Yuborilmoqda..."
                  : t("newOrder.submit") || "Buyurtma berish"}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
}