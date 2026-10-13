import type { Metadata } from 'next';
import { ResourcesPage } from '@/features/resources';
import { getAllResourceCategories, getResourcesPage } from '@/sanity/lib/queries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

export const metadata: Metadata = {
  title: 'Technical Resources & Data Sheets',
  description: 'Download official technical data sheets (TDS), safety data sheets (SDS) for Lantic bentonite products, corporate brochures, QHSE policies, and engineering case studies from PCE Nigeria.',
  alternates: { canonical: `${siteUrl}/resources` },
  openGraph: {
    title: 'PCE Nigeria | Technical Resources & Data Sheets',
    description: 'Download TDS, SDS, and technical documentation for drilling mud products, HDD engineering specifications, and corporate case studies.',
    url: `${siteUrl}/resources`,
    type: 'website',
  },
};

export default async function Page() {
  const [sanityCategories, sanityPage] = await Promise.all([
    getAllResourceCategories(),
    getResourcesPage(),
  ]);
  return <ResourcesPage sanityCategories={sanityCategories} sanityPage={sanityPage} />;
}
