export const CURRENCY_STORAGE_KEY = "display_currency";
export const DEFAULT_CURRENCY = "UZS";

export interface CurrencyRate {
  code: string;
  symbol: string;
  rate: string;
  is_base: boolean;
}

const MONEY_ENDPOINT =
  /(?:^|\/)api\/(?:services|all-services|service\/[^/?]+|orders|order\/[^/?]+|payments(?:\/[^/?]+)?|me|users(?:\/[^/?]+)?|dashboard\/(?:full|admin))\/?(?:\?|$)/;

export function getStoredCurrency(): string {
  if (typeof window === "undefined") return DEFAULT_CURRENCY;
  return localStorage.getItem(CURRENCY_STORAGE_KEY) || DEFAULT_CURRENCY;
}

export function setStoredCurrency(code: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENCY_STORAGE_KEY, code);
}

export function isMoneyEndpoint(url: string): boolean {
  const path = url.replace(/^https?:\/\/[^/]+/, "");
  return MONEY_ENDPOINT.test(path);
}

type CurrencyRequestConfig = {
  method?: string;
  url?: string;
  params?: Record<string, unknown> | URLSearchParams;
};

export function attachDisplayCurrency<T extends CurrencyRequestConfig>(config: T): T {
  const method = (config.method || "get").toLowerCase();
  if (method !== "get") return config;
  const url = config.url || "";
  if (!isMoneyEndpoint(url)) return config;
  if (typeof window === "undefined") return config;
  if (/[?&]currency=/.test(url)) return config;

  const currency = getStoredCurrency();
  if (config.params instanceof URLSearchParams) {
    if (!config.params.has("currency")) {
      config.params.set("currency", currency);
    }
    return config;
  }

  const params = config.params ?? {};
  if (params.currency == null || params.currency === "") {
    config.params = { ...params, currency };
  }
  return config;
}

export function parseMoney(value: string | number | null | undefined): {
  amount: number;
  code?: string;
} {
  if (typeof value === "number") return { amount: value };
  if (value == null || value === "") return { amount: Number.NaN };

  const parts = value.trim().split(/\s+/);
  const amount = Number(parts[0]?.replace(/,/g, ""));
  const code = parts[1] && /^[A-Za-z]{3}$/.test(parts[1]) ? parts[1].toUpperCase() : undefined;
  return { amount, code };
}

export function moneyNumber(value: string | number | null | undefined): number {
  const amount = parseMoney(value).amount;
  return Number.isFinite(amount) ? amount : 0;
}

export function formatMoneyValue(
  value: string | number | null | undefined,
  responseCurrency: string | undefined,
  currencies: CurrencyRate[],
  requestedCurrency?: string,
): string {
  const parsed = parseMoney(value);
  if (!Number.isFinite(parsed.amount)) {
    return value == null || value === "" ? "—" : String(value);
  }

  const code = (responseCurrency || parsed.code || requestedCurrency || DEFAULT_CURRENCY).toUpperCase();
  const symbol = currencies.find((item) => item.code === code)?.symbol ?? code;
  const hasFraction = Math.abs(parsed.amount % 1) > 0.001;
  const formatted =
    code === DEFAULT_CURRENCY
      ? new Intl.NumberFormat("ru-RU", {
          minimumFractionDigits: hasFraction ? 2 : 0,
          maximumFractionDigits: hasFraction ? 2 : 0,
        }).format(parsed.amount)
      : new Intl.NumberFormat("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(parsed.amount);

  if (symbol === "$" || symbol === "€") return `${symbol}${formatted}`;
  return `${formatted} ${symbol}`;
}

export function lineTotal(unitPrice: number, quantity: number, currencyCode: string): number {
  const raw = (unitPrice * quantity) / 1000;
  if (!Number.isFinite(raw)) return 0;
  if (currencyCode === DEFAULT_CURRENCY) return Math.round(raw);
  return Math.round(raw * 100) / 100;
}

const FALLBACK_CANDIDATES = ["USD", "RUB", "EUR", "KZT"] as const;

const FALLBACK_SYMBOLS: Record<string, string> = {
  UZS: "so'm",
  USD: "$",
  RUB: "₽",
  EUR: "€",
  KZT: "₸",
};

type CurrencyGetter = (url: string) => Promise<{ data: unknown }>;

function firstService(data: unknown): { price?: string | number } | undefined {
  if (Array.isArray(data)) return data[0] as { price?: string | number };
  if (data && typeof data === "object" && Array.isArray((data as { results?: unknown[] }).results)) {
    return (data as { results: { price?: string | number }[] }).results[0];
  }
  if (data && typeof data === "object" && "price" in data) {
    return data as { price?: string | number };
  }
  return undefined;
}

function isCurrencyCatalog(data: unknown): data is { base?: string; currencies: CurrencyRate[] } {
  return Boolean(
    data &&
      typeof data === "object" &&
      Array.isArray((data as { currencies?: unknown }).currencies) &&
      (data as { currencies: unknown[] }).currencies.length > 0,
  );
}

export async function loadCurrencyCatalog(get: CurrencyGetter): Promise<{
  base: string;
  currencies: CurrencyRate[];
}> {
  try {
    const response = await get("/api/currencies/");
    if (isCurrencyCatalog(response.data)) {
      return {
        base: response.data.base || DEFAULT_CURRENCY,
        currencies: response.data.currencies,
      };
    }
  } catch {
    // The list endpoint is not on this server yet. Detect rates from service prices.
  }

  const baseResponse = await get("/api/services/?limit=1&currency=UZS");
  const basePrice = moneyNumber(firstService(baseResponse.data)?.price);
  const currencies: CurrencyRate[] = [
    { code: DEFAULT_CURRENCY, symbol: FALLBACK_SYMBOLS.UZS, rate: "1", is_base: true },
  ];

  if (basePrice <= 0) {
    return { base: DEFAULT_CURRENCY, currencies };
  }

  const detected = await Promise.all(
    FALLBACK_CANDIDATES.map(async (code) => {
      try {
        const response = await get(`/api/services/?limit=1&currency=${code}`);
        const price = firstService(response.data)?.price;
        if (typeof price === "string" && /no rate/i.test(price)) return null;
        const parsed = parseMoney(price);
        if (!Number.isFinite(parsed.amount) || parsed.amount <= 0) return null;
        if (parsed.code && parsed.code !== code) return null;
        const rate = basePrice / parsed.amount;
        if (!Number.isFinite(rate) || rate <= 0) return null;
        return {
          code,
          symbol: FALLBACK_SYMBOLS[code] ?? code,
          rate: String(Math.round(rate * 100) / 100),
          is_base: false,
        } satisfies CurrencyRate;
      } catch {
        return null;
      }
    }),
  );

  for (const item of detected) {
    if (item) currencies.push(item);
  }

  return { base: DEFAULT_CURRENCY, currencies };
}

export function amountToUzs(amount: number, rate: string | number): number {
  const parsed = typeof rate === "number" ? rate : Number(rate);
  const safeRate = Number.isFinite(parsed) && parsed > 0 ? parsed : 1;
  return Math.round(amount * safeRate);
}
