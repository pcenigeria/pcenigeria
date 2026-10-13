import type { Metadata } from 'next';
import { NewsPage } from '@/features/news-insights';
import { getAllNewsArticles, getNewsInsightsPage } from '@/sanity/lib/queries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

export const metadata: Metadata = {
  title: 'News & Insights',
  description: 'Latest news, technical case studies, and engineering insights from PCE Nigeria — covering HDD river crossings, pipeline EPC projects, drilling fluid innovations, and oil & gas infrastructure developments in Nigeria.',
  alternates: {
    canonical: `${siteUrl}/news-insights`,
    types: { 'application/rss+xml': `${siteUrl}/feed.xml` },
  },
  openGraph: {
    title: 'PCE Nigeria | News & Insights',
    description: 'HDD project reports, pipeline EPC updates, and drilling fluid technical guides from Nigeria\'s leading trenchless engineering contractor.',
    url: `${siteUrl}/news-insights`,
    type: 'website',
  },
};

export default async function Page() {
  const [sanityArticles, sanityPage] = await Promise.all([
    getAllNewsArticles(),
    getNewsInsightsPage(),
  ]);

  return <NewsPage sanityArticles={sanityArticles} sanityPage={sanityPage} />;
}
