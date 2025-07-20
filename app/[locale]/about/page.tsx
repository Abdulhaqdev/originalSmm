// app/[locale]/about/page.tsx
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Award, Clock, Shield, Target, Zap, TrendingUp, Globe } from "lucide-react";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('about');

  const achievementIcons = [
    { icon: Users, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/20" },
    { icon: Award, color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/20" },
    { icon: Clock, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/20" },
    { icon: Shield, color: "text-purple-600", bgColor: "bg-purple-100 dark:bg-purple-900/20" },
  ];

  const valueIcons = [
    { icon: Target },
    { icon: Zap },
    { icon: TrendingUp },
    { icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-primary/10 text-primary border-primary/20">{t('hero.badge')}</Badge>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              {t('hero.title').split(' ').map((word, index) => (
                index >= t('hero.title').split(' ').length - 3 ? (
                  <span key={index} className="gradient-text">{word} </span>
                ) : (
                  <span key={index}>{word} </span>
                )
              ))}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
              {t('hero.description')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/services">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                  {t('hero.exploreServices')}
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline">
                  {t('hero.getStarted')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {(t.raw('achievements.items') as Array<{ title: string; description: string }>).map((achievement, index) => {
              const { icon: Icon, color, bgColor } = achievementIcons[index] || {};
              return (
                <Card key={index} className="text-center hover-lift">
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 ${bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                      {Icon && <Icon className={`w-8 h-8 ${color}`} />}
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{achievement.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{achievement.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {t('story.title').split(' ').map((word, index) => (
                  index === 1 ? (
                    <span key={index} className="gradient-text">{word} </span>
                  ) : (
                    <span key={index}>{word} </span>
                  )
                ))}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">{t('story.subtitle')}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">{t('story.heading')}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('story.description1')}</p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('story.description2')}</p>
                <div className="flex items-center space-x-4 pt-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{t('story.metrics.founded')}</div>
                    <div className="text-sm text-gray-500">{t('story.metrics.foundedLabel')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{t('story.metrics.customers')}</div>
                    <div className="text-sm text-gray-500">{t('story.metrics.customersLabel')}</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{t('story.metrics.orders')}</div>
                    <div className="text-sm text-gray-500">{t('story.metrics.ordersLabel')}</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <Card className="glass">
                  <CardContent className="p-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{t('story.metrics.satisfaction')}</span>
                        <span className="text-2xl font-bold text-primary">{t('story.metrics.satisfactionValue')}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "99.8%" }}></div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">{t('story.metrics.successRate')}</span>
                        <span className="text-2xl font-bold text-primary">{t('story.metrics.successRateValue')}</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: "99.9%" }}></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              {t('values.title').split(' ').map((word, index) => (
                index === 1 ? (
                  <span key={index} className="gradient-text">{word} </span>
                ) : (
                  <span key={index}>{word} </span>
                )
              ))}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">{t('values.description')}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {(t.raw('values.items') as Array<{ title: string; description: string }>).map((value, index) => {
              const { icon: Icon } = valueIcons[index] || {};
              return (
                <Card key={index} className="hover-lift group">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-300">
                        {Icon && <Icon className="w-6 h-6 text-primary" />}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">
                          {value.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{value.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-green-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t('cta.title')}</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">{t('cta.description')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/services">
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                {t('cta.browseServices')}
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-primary bg-transparent"
              >
                {t('cta.getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}