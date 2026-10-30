"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import {
  amountToUzs,
  DEFAULT_CURRENCY,
  formatMoneyValue,
  getStoredCurrency,
  loadCurrencyCatalog,
  setStoredCurrency,
  type CurrencyRate,
} from "@/lib/currency";

const FALLBACK_CURRENCIES: CurrencyRate[] = [
  { code: "UZS", symbol: "so'm", rate: "1", is_base: true },
];

type CurrencyContextValue = {
  currency: string;
  currencies: CurrencyRate[];
  isReady: boolean;
  isLoading: boolean;
  setCurrency: (code: string) => void;
  formatMoney: (value: string | number | null | undefined, responseCurrency?: string) => string;
  toUzs: (amount: number, code?: string) => number;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [currency, setCurrencyState] = useState(DEFAULT_CURRENCY);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setCurrencyState(getStoredCurrency());
    setIsReady(true);
  }, []);

  const { data, isLoading } = useQuery({
    queryKey: ["currencies"],
    queryFn: () => loadCurrencyCatalog((url) => api.get(url)),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  const currencies = data?.currencies?.length ? data.currencies : FALLBACK_CURRENCIES;

  useEffect(() => {
    if (!isReady || !data?.currencies?.length) return;
    const known = data.currencies.some((item) => item.code === currency);
    if (!known) {
      const fallback = data.base || DEFAULT_CURRENCY;
      setStoredCurrency(fallback);
      setCurrencyState(fallback);
    }
  }, [data, currency, isReady]);

  const setCurrency = useCallback(
    (code: string) => {
      setStoredCurrency(code);
      setCurrencyState(code);
      queryClient.invalidateQueries({ queryKey: ["user"] });
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
    [queryClient],
  );

  const formatMoney = useCallback(
    (value: string | number | null | undefined, responseCurrency?: string) =>
      formatMoneyValue(value, responseCurrency, currencies, currency),
    [currencies, currency],
  );

  const toUzs = useCallback(
    (amount: number, code?: string) => {
      const target = code || currency;
      const rate = currencies.find((item) => item.code === target)?.rate ?? "1";
      return amountToUzs(amount, rate);
    },
    [currency, currencies],
  );

  const value = useMemo(
    () => ({
      currency,
      currencies,
      isReady,
      isLoading,
      setCurrency,
      formatMoney,
      toUzs,
    }),
    [currency, currencies, isReady, isLoading, setCurrency, formatMoney, toUzs],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return context;
}

export function Money({
  value,
  currency,
}: {
  value: string | number | null | undefined;
  currency?: string;
}) {
  const { formatMoney } = useCurrency();
  return <>{formatMoney(value, currency)}</>;
}
