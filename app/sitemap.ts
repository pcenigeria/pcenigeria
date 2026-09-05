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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/our-company`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/capabilities`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/projects`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/equipment-technology`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/news-insights`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/safety-quality-responsibility`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  let projectSlugs = fallbackProjects;
  let productSlugs = fallbackProducts;
  let newsSlugs = fallbackNews;

  try {
    const [fetchedProjects, fetchedProducts, fetchedNews] = await Promise.all([
      client.fetch<Array<{ slug: { current: string } }>>(`*[_type == "project" && defined(slug.current)]{ slug }`),
      client.fetch<Array<{ slug: { current: string } }>>(`*[_type == "product" && defined(slug.current)]{ slug }`),
      client.fetch<Array<{ slug: { current: string } }>>(`*[_type == "newsArticle" && defined(slug.current)]{ slug }`),
    ]);

    if (fetchedProjects?.length) projectSlugs = Array.from(new Set([...fallbackProjects, ...fetchedProjects.map(p => p.slug.current)]));
    if (fetchedProducts?.length) productSlugs = Array.from(new Set([...fallbackProducts, ...fetchedProducts.map(p => p.slug.current)]));
    if (fetchedNews?.length) newsSlugs = Array.from(new Set([...fallbackNews, ...fetchedNews.map(n => n.slug.current)]));
  } catch (error) {
    console.warn('Sitemap Sanity fetch fallback used:', error);
  }

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map(slug => ({
    url: `${baseUrl}/projects/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const productRoutes: MetadataRoute.Sitemap = productSlugs.map(slug => ({
    url: `${baseUrl}/products/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const newsRoutes: MetadataRoute.Sitemap = newsSlugs.map(slug => ({
    url: `${baseUrl}/news-insights/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...productRoutes, ...newsRoutes];
}
