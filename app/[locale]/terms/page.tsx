// app/terms/page.tsx
'use client';

import Navbar from '@/components/navbar'
import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations('terms');

  return (
		<>
			<Navbar />
    <div className="container mx-auto px-4 py-20 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-center">{t('title')}</h1>
      <div className="prose prose-invert mx-auto">
        <p className="text-gray-300 mb-6">{t('introduction')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.acceptance.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.acceptance.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.services.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.services.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.userObligations.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.userObligations.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.payments.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.payments.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.refunds.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.refunds.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.intellectualProperty.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.intellectualProperty.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.disclaimer.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.disclaimer.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.limitationOfLiability.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.limitationOfLiability.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.termination.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.termination.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.governingLaw.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.governingLaw.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.changes.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.changes.content')}</p>
        
        <h2 className="text-2xl font-semibold mb-4">{t('sections.contact.title')}</h2>
        <p className="text-gray-300 mb-6">{t('sections.contact.content')}</p>
      </div>
    </div>
		</>

  );
}