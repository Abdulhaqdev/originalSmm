"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

// Define TypeScript interface for translations
interface HeroTestimonialsTranslations {
  title: string;
  description: string;
  testimonials: {
    [key: string]: {
      name: string;
      title: string;
      quote: string;
    };
  };
  cta: {
    title: string;
    description: string;
    button: string;
  };
}

// Type for the translation function
type TranslationFunction = (key: keyof HeroTestimonialsTranslations | `testimonials.${number}.${'name' | 'title' | 'quote'}` | `cta.${'title' | 'description' | 'button'}`) => string;

export default function HeroTestimonials() {
  const t = useTranslations('heroTestimonials') as TranslationFunction;

  // Define the number of testimonials (fixed at 3 for now)
  const testimonialCount = 3;
  const testimonials = Array.from({ length: testimonialCount }, (_, index) => ({
    name: t(`testimonials.${index}.name`),
    title: t(`testimonials.${index}.title`),
    quote: t(`testimonials.${index}.quote`),
  }));

  return (
    <div className="container py-20 max-w-screen-xl mx-auto">
      <div className="flex flex-col flex-wrap items-center justify-center space-y-4 text-center mb-10">
        <h2 className="text-3xl font-bold tracking-tighter text-black dark:text-white sm:text-4xl md:text-5xl">
          {t('title')}
        </h2>
        <p className="mx-auto max-w-[700px] text-gray-400 md:text-lg">
          {t('description')}
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <Card
            key={index}
            className="relative dark:border-2 rounded-xl shadow-sm border-[#27272d] dark:bg-[#101013] bg-white"
          >
            <CardContent className="py-4">
              <div className="relative z-10">
                <div className="mb-4 dark:border-b-2 border-[#27272d]">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-semibold dark:text-white text-black">
                      {testimonial.name}
                    </h3>
                    <svg
                      className="h-12 w-12 text-slate-400"
                      fill="currentColor"
                      viewBox="0 0 32 32"
                      aria-hidden="true"
                    >
                      <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                    </svg>
                  </div>
                  <p className="text-slate-400/80 text-sm mb-2">
                    {testimonial.title}
                  </p>
                </div>
                <blockquote className="text-sm leading-6 dark:text-white text-black">
                  {testimonial.quote}
                </blockquote>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <section className="relative min-h-[400px] mt-10 sm:min-h-[500px] md:min-h-[500px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/cover.svg')`,
          }}
        ></div>

        <div className="container relative px-4 mx-auto">
          <div className="px-4 sm:px-6 md:px-8 max-w-4xl text-center sm:text-start">
            <h1 className="mb-4 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl lg:text-5xl">
              {t('cta.title')}
            </h1>
            <p className="mb-8 text-base text-gray-300 sm:text-lg md:text-xl lg:text-2xl">
              {t('cta.description')}
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 sm:px-8 py-3 sm:py-6 text-base sm:text-lg rounded-xl">
              {t('cta.button')}
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
