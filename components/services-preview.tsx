// ServicesPreview.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Clock, Star } from 'lucide-react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { mockServices, mockPlatforms } from '@/lib/mock-data';
import { useUser } from '@/hooks/useUser'
import { usePathname } from 'next/navigation'

export default function ServicesPreview() {
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "en";
  const { getServices,} = useUser();
  const t = useTranslations('services-home');
  const t2 = useTranslations("services");

  const [selectedPlatform, setSelectedPlatform] = useState('all');
  const { data: servicesData, error: servicesError, isLoading: servicesLoading } = getServices(6, 0, locale);

  // Map platform names to lowercase for filtering, keeping original for display
  const platforms = servicesData?.results
  console.log("servicesData", servicesData);
  console.log("platforms", platforms);

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

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {/* {filteredServices.map((service) => (
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
                    <div className="text-sm text-gray-500">{t('per1000')}</div>
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{service.description}</p>

                <div className="space-y-2 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('minOrder')}:</span>
                    <span className="font-medium">{service.minOrder.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{t('maxOrder')}:</span>
                    <span className="font-medium">{service.maxOrder.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {t('delivery')}:
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
                    {t('orderNow')}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))} */}
        </div>
 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {platforms && platforms.map((service) => (
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
      </div>
    </section>
  );
}