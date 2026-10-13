import { client } from '@/sanity/lib/client';
import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

interface NewsArticle {
  slug: string;
  title: string;
  intro?: string;
  date?: string;
  _updatedAt: string;
  heroImage?: string;
  author?: string;
  category?: string;
}

export async function GET() {
  let articles: NewsArticle[] = [];

  try {
    articles = await client.fetch<NewsArticle[]>(
      `*[_type == "newsArticle" && !(_id in path("drafts.**"))] | order(date desc)[0...50] {
        "slug": slug.current,
        title,
        intro,
        date,
        _updatedAt,
        "heroImage": heroImage.asset->url,
        author,
        category
      }`
    );
  } catch (err) {
    console.warn('RSS feed Sanity fetch error:', err);
  }

  const buildDate = new Date().toUTCString();

  const items = articles
    .map(article => {
      const articleUrl = `${siteUrl}/news-insights/${article.slug}`;
      const pubDate = article.date
        ? new Date(article.date).toUTCString()
        : new Date(article._updatedAt).toUTCString();
      const description = article.intro
        ? article.intro.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        : '';
      const title = article.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

      return `
    <item>
      <title>${title}</title>
      <link>${articleUrl}</link>
      <guid isPermaLink="true">${articleUrl}</guid>
      <description>${description}</description>
      <pubDate>${pubDate}</pubDate>
      ${article.author ? `<author>info@pcenigeria.com (${article.author})</author>` : '<author>info@pcenigeria.com (PCE Nigeria Limited)</author>'}
      ${article.category ? `<category>${article.category}</category>` : ''}
      ${article.heroImage ? `<enclosure url="${article.heroImage}" type="image/jpeg" length="0" />` : ''}
    </item>`;
    })
    .join('');

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
  xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>PCE Nigeria News &amp; Insights</title>
    <link>${siteUrl}/news-insights</link>
    <description>Technical articles, case studies, and engineering insights on HDD, Pipeline EPC, Lantic drilling fluid products, and Nigeria's oil &amp; gas sector.</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}/logo/PCE Logo Icon.svg</url>
      <title>PCE Nigeria</title>
      <link>${siteUrl}</link>
    </image>
    <copyright>Copyright ${new Date().getFullYear()}, PCE Nigeria Limited</copyright>
    <managingEditor>info@pcenigeria.com (PCE Nigeria Limited)</managingEditor>
    <webMaster>info@pcenigeria.com (PCE Nigeria Limited)</webMaster>
    <ttl>720</ttl>${items}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  });
}
