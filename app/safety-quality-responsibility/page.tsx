import type { Metadata } from 'next';
import { SafetyPage } from '@/features/safety-quality';
import { getSafetyQualityPage } from '@/sanity/lib/queries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

export const metadata: Metadata = {
    title: 'Safety, Quality & Responsibility (QHSE)',
    description: 'PCE Nigeria maintains an uncompromising commitment to Occupational Health, Safety, Environment (QHSE), ISO compliance, and community responsibility across all HDD and pipeline EPC operations in Nigeria.',
    alternates: { canonical: `${siteUrl}/safety-quality-responsibility` },
    openGraph: {
        title: 'PCE Nigeria | Safety, Quality & Environmental Standards',
        description: 'Our Zero Harm safety culture, ISO-certified quality frameworks, and sustainable community engagement standards for pipeline engineering projects in Nigeria.',
        url: `${siteUrl}/safety-quality-responsibility`,
        type: 'website',
    },
};

export default async function Page() {
    const sanityPage = await getSafetyQualityPage();
    return <SafetyPage sanityPage={sanityPage} />;
}
