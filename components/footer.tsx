'use client';

import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image'

export default function Footer() {
  const t = useTranslations('footer');

  const socialIcons = { Facebook, Twitter, Instagram, Youtube };

  // Split footer links into two groups for mobile
  const footerLinks = Object.entries(t.raw('links') as Record<string, { title: string; items: Array<{ name: string; href: string }> }>);

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 group">
    <Image
              src="/logof.png"
              alt="Light theme logo"
              width={200}
              height={30}
              priority // Preload the image
              className=" object-contain  "
            />
           
            </Link>
            <p className="text-gray-300 mb-6 leading-relaxed">{t('description')}</p>

            {/* Contact Info */}
            <div className="space-y-2 text-sm text-gray-300">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{t('contact.email')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>{t('contact.phone')}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>{t('contact.address')}</span>
              </div>
            </div>
          </div>

          {/* Footer Links - Mobile Two Columns */}
          {/* Footer Links - Mobile Three Columns */}
<div className="grid grid-cols-3 gap-4 md:grid-cols-1 lg:grid-cols-3 lg:col-span-3">
  {/* First Column */}
  <div className="space-y-8">
    {footerLinks.slice(0, Math.ceil(footerLinks.length / 3)).map(([category, { title, items }]) => (
      <div key={category}>
        <h4 className="font-semibold mb-4">{title}</h4>
        <ul className="space-y-2">
          {items.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="text-gray-300 hover:text-primary transition-colors duration-200">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>

  {/* Second Column */}
  <div className="space-y-8">
    {footerLinks.slice(Math.ceil(footerLinks.length / 3), Math.ceil(2 * footerLinks.length / 3)).map(([category, { title, items }]) => (
      <div key={category}>
        <h4 className="font-semibold mb-4">{title}</h4>
        <ul className="space-y-2">
          {items.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="text-gray-300 hover:text-primary transition-colors duration-200">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>

  {/* Third Column */}
  <div className="space-y-8">
    {footerLinks.slice(Math.ceil(2 * footerLinks.length / 3)).map(([category, { title, items }]) => (
      <div key={category}>
        <h4 className="font-semibold mb-4">{title}</h4>
        <ul className="space-y-2">
          {items.map((link) => (
            <li key={link.name}>
              <Link href={link.href} className="text-gray-300 hover:text-primary transition-colors duration-200">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
</div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="text-gray-300 text-sm mb-6 md:mb-0">{t('copyright')}</div>

          {/* Social Links */}
          <div className="flex items-center space-x-4">
            {(t.raw('socialLinks') as Array<{ label: string; href: string }>).map((social) => {
              const Icon = socialIcons[social.label as keyof typeof socialIcons];
              return (
                <Link
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary transition-colors duration-200"
                  aria-label={social.label}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}