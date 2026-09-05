import { NewsPage } from '@/features/news-insights';
import { getAllNewsArticles, getNewsInsightsPage } from '@/sanity/lib/queries';

export const metadata = {
  title: 'News & Insights | PCE Nigeria',
  description: 'Stay updated with the latest news, technical articles, case studies, and engineering insights from PCE Nigeria.',
};

export default async function Page() {
  const [sanityArticles, sanityPage] = await Promise.all([
    getAllNewsArticles(),
    getNewsInsightsPage(),
  ]);

  return <NewsPage sanityArticles={sanityArticles} sanityPage={sanityPage} />;
}
