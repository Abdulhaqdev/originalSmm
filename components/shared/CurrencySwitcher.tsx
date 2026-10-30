"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/components/provider/currency-provider";

export default function CurrencySwitcher() {
  const t = useTranslations("navbar");
  const { currencies, currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const close = () => setIsOpen(false);
    window.addEventListener("scroll", close, { capture: true });
    return () => window.removeEventListener("scroll", close, { capture: true });
  }, []);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn(
            "h-9 px-2 text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary",
            isOpen && "text-primary dark:text-primary bg-gray-100 dark:bg-gray-800",
          )}
          aria-label={t("currency")}
        >
          <span className="text-sm font-semibold">{currency}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
          {t("currency")}
        </div>
        {currencies.map((item) => (
          <DropdownMenuItem
            key={item.code}
            onClick={() => {
              setCurrency(item.code);
              setIsOpen(false);
            }}
            className={cn(
              "flex items-center justify-between cursor-pointer",
              currency === item.code && "bg-primary/10 text-primary",
            )}
          >
            <span className="font-medium">
              {item.code}
              <span className="ml-2 text-muted-foreground">{item.symbol}</span>
            </span>
            {currency === item.code && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
