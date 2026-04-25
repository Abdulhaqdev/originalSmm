"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useUser } from "@/hooks/useUser";
import { toast } from "sonner";
import { CreditCard, DollarSign } from 'lucide-react';
import { User } from '@/lib/api'
import Link from "next/link";

interface ApiErrorPayload {
  detail?: string;
  [key: string]: unknown;
}

interface ApiLikeError {
  response?: {
    data?: ApiErrorPayload;
  };
}

interface AccountInfoProps {
  user: User | undefined;
}

export default function AccountInfo({ user }: AccountInfoProps) {
  const t = useTranslations("dashboard");
  const { updateProfile, isUpdatingProfile } = useUser();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    username: user?.username || "",
    email: user?.email || "",
    phone_number: user?.phone_number || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.first_name || !formData.username || !formData.email || !formData.phone_number) {
      toast.error(t("account.validationError") || "Barcha maydonlar to'ldirilishi kerak");
      return;
    }

    try {
      await updateProfile(formData);
      setIsDialogOpen(false);
      toast.success(t("account.updateSuccess") || "Profil muvaffaqiyatli yangilandi");
    } catch (error: unknown) {
      const apiError = error as ApiLikeError;
      const errorData = apiError.response?.data;
      const errorMessage =
        errorData?.detail ||
        Object.entries(errorData || {})
          .map(([key, value]) => `${key}: ${Array.isArray(value) ? value[0] : value}`)
          .join(", ") ||
        t("account.updateFailed") || "Profilni yangilash muvaffaqiyatsiz yakunlandi";
      toast.error(errorMessage);
    }
  };

  return (
    <Card id='account' className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-xl md:text-2xl">{t("account.info") || "Hisob ma'lumotlari"}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t("account.name") || "To'liq ism"}
            </Label>
            <p className="text-sm md:text-base font-semibold">{user?.first_name} {user?.last_name}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t("account.username") || "Foydalanuvchi nomi"}
            </Label>
            <p className="text-sm md:text-base font-semibold">{user?.username}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t("account.email") || "Elektron pochta"}
            </Label>
            <p className="text-sm md:text-base font-semibold">{user?.email}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t("account.phoneNumber") || "Telefon raqami"}
            </Label>
            <p className="text-sm md:text-base font-semibold">{user?.phone_number}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t("account.memberSince") || "A'zo bo'lgan sana"}
            </Label>
            <p className="text-sm md:text-base font-semibold">{user?.created_at}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t("account.userId") || "Foydalanuvchi ID"}
            </Label>
            <p className="text-sm md:text-base font-semibold">{user?.id}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t("account.currentBalance") || "Joriy balans"}
            </Label>
            <p className="text-sm md:text-base font-bold text-primary flex items-center">
              {user?.balance || "0.00"}
            </p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-600 dark:text-gray-300">
              {t("account.apiKey") || "API kaliti"}
            </Label>
            <p className="text-sm md:text-base font-semibold break-all">{user?.api_key || "N/A"}</p>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <Button className="w-full bg-primary hover:bg-primary/90 text-white text-sm md:text-base py-2.5">
            <DollarSign className="w-4 h-4 mr-2" />
            <Link href="/add-funds" className="flex items-center">
                        <CreditCard className="mr-2 h-4 w-4" />
            {t("actions.addFunds") || "Pul qo'shish"}
                      </Link>
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full bg-transparent text-sm md:text-base py-2.5">
                {t("account.editProfile") || "Profilni tahrirlash"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[90vw] sm:max-w-[500px] rounded-lg">
              <DialogHeader>
                <DialogTitle className="text-lg md:text-xl">{t("account.editProfile") || "Profilni tahrirlash"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="first_name" className="text-sm">{t("account.firstName") || "Ism"}</Label>
                  <Input
                    id="first_name"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    required
                    className="text-sm md:text-base py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="last_name" className="text-sm">{t("account.lastName") || "Familiya"}</Label>
                  <Input
                    id="last_name"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="text-sm md:text-base py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm">{t("account.username") || "Foydalanuvchi nomi"}</Label>
                  <Input
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="text-sm md:text-base py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm">{t("account.email") || "Elektron pochta"}</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="text-sm md:text-base py-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone_number" className="text-sm">{t("account.phoneNumber") || "Telefon raqami"}</Label>
                  <Input
                    id="phone_number"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    required
                    className="text-sm md:text-base py-2"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white text-sm md:text-base py-2.5"
                  disabled={isUpdatingProfile}
                >
                  {isUpdatingProfile ? t("account.updating") || "Yangilanmoqda..." : t("account.saveChanges") || "O'zgarishlarni saqlash"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}