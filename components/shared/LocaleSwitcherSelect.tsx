'use client';

import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { routing } from '@/app/i18n/routing';

const localeMetadata = {
  en: { name: 'English', flag: '🇺🇸' },
  uz: { name: "O'zbek", flag: '🇺🇿' },
  ru: { name: 'Русский', flag: '🇷🇺' },
};

type Props = {
  defaultValue: string;
  label: string;
};

export default function LocaleSwitcherSelect({ defaultValue, label }: Props) {
  const pathname = usePathname();
  const t = useTranslations('locale');
  const [isPending, startTransition] = useTransition();

  const currentLocale = localeMetadata[defaultValue as keyof typeof localeMetadata];

  const handleLocaleChange = (newLocale: string) => {
    startTransition(() => {
      // Extract current locale from pathname
      const currentPath = pathname;
      
      // Remove current locale from path if it exists
      const pathWithoutLocale = currentPath.replace(/^\/(uz|en|ru)/, '') || '/';
      
      // Create new URL with selected locale
      const newUrl = `/${newLocale}${pathWithoutLocale}`;
      
      // Force page reload with new locale
      window.location.href = newUrl;
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-700 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors duration-200 gap-2"
          disabled={isPending}
          aria-label={label}
        >
          <Globe className="w-4 h-4" />
          <span className="text-sm font-medium hidden md:inline">{currentLocale?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36">
        <div className="px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700">
          {t('selectLanguage')}
        </div>
        {routing.locales.map((loc) => (
          <DropdownMenuItem
            key={loc}
            onClick={() => handleLocaleChange(loc)}
            className={cn(
              'flex items-center justify-between cursor-pointer',
              defaultValue === loc && 'bg-primary/10 text-primary',
            )}
            disabled={isPending}
          >
            <div className="flex items-center gap-3">
              <span className="font-medium">{localeMetadata[loc as keyof typeof localeMetadata]?.name}</span>
            </div>
            {defaultValue === loc && <Check className="w-4 h-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}