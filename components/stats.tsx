// Stats.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, Zap, Star, TrendingUp } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { mockStats } from '@/lib/mock-data';

export default function Stats() {
  const t = useTranslations('stats');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 },
    );

    const element = document.getElementById('stats-section');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  const stats = [
    {
      icon: Users,
      label: t('happyCustomers'),
      value: mockStats.totalUsers,
      suffix: '+',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20',
    },
    {
      icon: Zap,
      label: t('ordersCompleted'),
      value: mockStats.ordersCompleted,
      suffix: '+',
      color: 'text-primary',
      bgColor: 'bg-green-100 dark:bg-green-900/20',
    },
    {
      icon: TrendingUp,
      label: t('servicesAvailable'),
      value: mockStats.servicesAvailable,
      suffix: '+',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20',
    },
    {
      icon: Star,
      label: t('satisfactionRate'),
      value: mockStats.satisfactionRate,
      suffix: '%',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20',
    },
  ];

  return (
    <section id="stats-section" className="py-20 bg-gray-50 dark:bg-gray-900/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('title').split(' ').map((word, index) => (
              index === 1 ? (
                <span key={index} className="gradient-text">{word}</span>
              ) : (
                <span key={index}>{word} </span>
              )
            ))}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card
                key={index}
                className={`hover-lift transition-all duration-300 ${isVisible ? 'animate-fade-in' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-6 text-center">
                  <div
                    className={`w-16 h-16 ${stat.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}
                  >
                    <Icon className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="text-3xl font-bold mb-2">
                    <CountUp end={stat.value} duration={2} suffix={stat.suffix} isVisible={isVisible} />
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CountUp({
  end,
  duration,
  suffix = '',
  isVisible,
}: { end: number; duration: number; suffix?: string; isVisible: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, isVisible]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}