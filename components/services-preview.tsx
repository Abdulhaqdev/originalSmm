'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { useUser } from '@/hooks/useUser'
import { usePathname } from 'next/navigation'

interface Service {
  id: number;
  name: string;
  description: string;
  duration: number;
  min: number;
  max: number;
  price: string;
  site_id: number;
  category: number;
  api: number;
  created_at: string;
  updated_at: string;
  is_active: boolean;
}

export default function ServicesPreview() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const { getServices } = useUser();
  const t = useTranslations('services-home');
  const t2 = useTranslations("services");

  const { data: servicesData, isLoading: servicesLoading } = getServices(6, 0, locale) as {
    data: Service[] | undefined;
    isLoading: boolean;
  };

  const services = servicesData || [];

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('title').split(' ').map((word, index) => (
              index === 1 ? (
                <span key={index} className="gradient-text pr-2">{word}</span>
              ) : (
                <span key={index}>{word} </span>
              )
            ))}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </div>

        {servicesLoading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Xizmatlar yuklanmoqda...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {services.map((service: Service) => (
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
                        <div className="text-2xl font-bold text-primary">{service.price}</div>
                        <div className="text-sm text-gray-500">{t2("serviceDetails.per1000")}</div>
                      </div>
                    </div>

                    <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{service.description}</p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{t2("serviceDetails.minOrder")}:</span>
                        <span className="font-medium">{service.min}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">{t2("serviceDetails.maxOrder")}:</span>
                        <span className="font-medium">{service.max}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500 flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {t2("serviceDetails.delivery")}:
                        </span>
                        <span className="font-medium">{Math.ceil(service.duration / 3600)} {t2("serviceDetails.hours")}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-end">
                      <Button size="sm" className="bg-primary hover:bg-primary/90 text-white">
                        {t2("serviceDetails.orderNow")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* View All Services Button */}
            <div className="text-center">
              <Link href="/services">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white group">
                  {t('viewAllServices')}
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}