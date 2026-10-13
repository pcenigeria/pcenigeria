import type { MetadataRoute } from 'next';
import { client } from '@/sanity/lib/client';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

const fallbackProjects = [
  'akk-river-niger',
  'ob3-river-niger',
  'two-major-gas-crossings',
  '52km-pipeline-epc',
  'raoyang-river-hdd',
  'bpds-pipeline-location',
  'equipment-technical-support',
];

const fallbackProducts = [
  'brsbent-sq',
  'brscmc',
  'brsmmh',
  'brsvr',
  'brsxtg',
];

const fallbackNews = [
  'ob3-river-niger-hdd-crossing-completion-report',
  'latest-progress-52km-pipeline-epc-project',
  'akk-river-niger-hdd-crossing-completion-milestone',
  'advanced-bpds-pipeline-location-technique',
];

type SanitySlugDoc = { slug: { current: string }; _updatedAt: string };

function mergeBySlug(fallbacks: string[], live: SanitySlugDoc[], fallbackDate: string): SanitySlugDoc[] {
  const map = new Map<string, SanitySlugDoc>(
    fallbacks.map(s => [s, { slug: { current: s }, _updatedAt: fallbackDate }])
  );
  // Live data overwrites fallbacks (gets real timestamp)
  for (const doc of live) {
    map.set(doc.slug.current, doc);
  }
  return Array.from(map.values());
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();
  const fallbackIso = currentDate.toISOString();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: currentDate, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/our-company`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/capabilities`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${baseUrl}/projects`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/products`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/equipment-technology`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/news-insights`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/safety-quality-responsibility`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/resources`, lastModified: currentDate, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified: currentDate, changeFrequency: 'monthly', priority: 0.8 },
  ];

  let projectDocs: SanitySlugDoc[] = fallbackProjects.map(s => ({ slug: { current: s }, _updatedAt: fallbackIso }));
  let productDocs: SanitySlugDoc[] = fallbackProducts.map(s => ({ slug: { current: s }, _updatedAt: fallbackIso }));
  let newsDocs: SanitySlugDoc[] = fallbackNews.map(s => ({ slug: { current: s }, _updatedAt: fallbackIso }));

  try {
    const [fetchedProjects, fetchedProducts, fetchedNews] = await Promise.all([
      client.fetch<SanitySlugDoc[]>(`*[_type == "project" && defined(slug.current)]{ slug, _updatedAt }`),
      client.fetch<SanitySlugDoc[]>(`*[_type == "product" && defined(slug.current)]{ slug, _updatedAt }`),
      client.fetch<SanitySlugDoc[]>(`*[_type == "newsArticle" && defined(slug.current)]{ slug, _updatedAt }`),
    ]);

    if (fetchedProjects?.length) projectDocs = mergeBySlug(fallbackProjects, fetchedProjects, fallbackIso);
    if (fetchedProducts?.length) productDocs = mergeBySlug(fallbackProducts, fetchedProducts, fallbackIso);
    if (fetchedNews?.length) newsDocs = mergeBySlug(fallbackNews, fetchedNews, fallbackIso);
  } catch (error) {
    console.warn('Sitemap Sanity fetch fallback used:', error);
  }

  const projectRoutes: MetadataRoute.Sitemap = projectDocs.map(doc => ({
    url: `${baseUrl}/projects/${doc.slug.current}`,
    lastModified: new Date(doc._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = productDocs.map(doc => ({
    url: `${baseUrl}/products/${doc.slug.current}`,
    lastModified: new Date(doc._updatedAt),
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const newsRoutes: MetadataRoute.Sitemap = newsDocs.map(doc => ({
    url: `${baseUrl}/news-insights/${doc.slug.current}`,
    lastModified: new Date(doc._updatedAt),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...productRoutes, ...newsRoutes];
}
