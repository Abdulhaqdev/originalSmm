// app/privacy/page.tsx
'use client';

import Navbar from '@/components/navbar'
import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('privacy');

  return (
		<>
		<Navbar />
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">{t('title')}</h1>
      <div className="prose prose-invert mx-auto">
        <p className="text-gray-300 mb-6">{t('introduction')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.informationWeCollect.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.informationWeCollect.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.howWeUseInformation.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.howWeUseInformation.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.sharingInformation.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.sharingInformation.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.security.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.security.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.yourRights.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.yourRights.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.childrenPrivacy.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.childrenPrivacy.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.internationalTransfers.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.internationalTransfers.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.changes.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.changes.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.contact.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.contact.content')}</p>
      </div>
    </div>
		</>
  );
}