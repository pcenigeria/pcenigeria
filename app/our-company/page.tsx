import type { Metadata } from 'next';
import { CompanyPage } from '@/features/company';
import { getCompanyPage } from '@/sanity/lib/queries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

export const metadata: Metadata = {
    title: 'Our Company',
    description: "PCE Nigeria Limited — West Africa's foremost specialist engineering contractor for Horizontal Directional Drilling (HDD), Pipeline EPC, and drilling fluid solutions. Partnered with Lantic, with a proven track record on the AKK and OB3 River Niger pipeline crossings.",
    alternates: { canonical: `${siteUrl}/our-company` },
    openGraph: {
        title: 'About PCE Nigeria Limited',
        description: "Learn about PCE Nigeria's engineering history, leadership team, international Lantic partnership, and specialist capabilities in HDD and pipeline EPC across Nigeria.",
        url: `${siteUrl}/our-company`,
        type: 'website',
    },
};

export default async function Page() {
    const sanityPage = await getCompanyPage();
    return <CompanyPage sanityPage={sanityPage} />;
}
