import React from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { NewsDetailTemplate, DraftModeBanner } from '@/features/news-insights/components';
import { getNewsArticleBySlug, getAllNewsArticles } from '@/sanity/lib/queries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

type PageProps = {
    params: Promise<{ slug: string }> | { slug: string };
};

export async function generateStaticParams() {
    const articles = await getAllNewsArticles();
    return articles.map((article: { slug: string }) => ({
        slug: article.slug,
    }));
}

async function resolveSlug(params: PageProps['params']): Promise<string> {
    if (params && typeof (params as any).then === 'function') {
        const resolved = await params;
        return resolved.slug;
    }
    return (params as { slug: string }).slug;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const slug = await resolveSlug(params);
    const draft = await draftMode();
    const isDraftMode = draft.isEnabled;
    const article = await getNewsArticleBySlug(slug, isDraftMode);

    if (!article) return {};

    const canonicalUrl = article.seo?.canonicalUrl || `${siteUrl}/news-insights/${slug}`;

    // Prefer CMS SEO overrides, fall back to article fields
    const title = article.seo?.metaTitle || `${article.title} | PCE Nigeria`;
    const description = article.seo?.metaDescription || article.intro || '';
    const keywords = article.seo?.keywords;

    // OG image: prefer dedicated SEO image, then hero image, then site default
    const ogImageUrl =
        article.seo?.ogImage ||
        article.heroImage ||
        `${siteUrl}/pictures/hero-slider/drilling-rig-cover-photo.jpg`;

    return {
        title,
        description,
        ...(keywords && { keywords: keywords.split(',').map((k: string) => k.trim()) }),
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title,
            description,
            url: canonicalUrl,
            siteName: 'PCE Nigeria Limited',
            type: 'article',
            publishedTime: article.date,
            modifiedTime: article._updatedAt,
            authors: article.author ? [article.author] : ['PCE Nigeria Limited'],
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description,
            images: [ogImageUrl],
        },
        ...(isDraftMode && {
            robots: {
                index: false,
                follow: false,
            },
        }),
    };
}

export default async function Page({ params }: PageProps) {
    const slug = await resolveSlug(params);
    const draft = await draftMode();
    const isDraftMode = draft.isEnabled;

    const [article, allArticles] = await Promise.all([
        getNewsArticleBySlug(slug, isDraftMode),
        getAllNewsArticles(),
    ]);

    if (!article) {
        notFound();
    }

    const canonicalUrl = article.seo?.canonicalUrl || `${siteUrl}/news-insights/${slug}`;
    const ogImageUrl =
        article.seo?.ogImage ||
        article.heroImage ||
        `${siteUrl}/pictures/hero-slider/drilling-rig-cover-photo.jpg`;

    // BlogPosting structured data for Google, Bing AI, and LLM citation
    const blogPostingJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'BlogPosting',
                '@id': `${canonicalUrl}#article`,
                'headline': article.title,
                'description': article.intro || '',
                'datePublished': article.date,
                'dateModified': article._updatedAt || article.date,
                'author': {
                    '@type': 'Organization',
                    'name': article.author || 'PCE Nigeria Limited',
                    'url': siteUrl,
                },
                'publisher': {
                    '@type': 'Organization',
                    '@id': `${siteUrl}/#organization`,
                    'name': 'PCE Nigeria Limited',
                    'logo': {
                        '@type': 'ImageObject',
                        'url': `${siteUrl}/logo/PCE Logo Icon.svg`,
                    },
                },
                'image': {
                    '@type': 'ImageObject',
                    'url': ogImageUrl,
                    'width': 1200,
                    'height': 630,
                },
                'url': canonicalUrl,
                'mainEntityOfPage': {
                    '@type': 'WebPage',
                    '@id': canonicalUrl,
                },
                'isPartOf': {
                    '@type': 'Blog',
                    '@id': `${siteUrl}/news-insights/#blog`,
                    'name': 'PCE Nigeria News & Insights',
                    'url': `${siteUrl}/news-insights`,
                },
                ...(article.seo?.keywords && {
                    'keywords': article.seo.keywords,
                }),
                ...(article.category && {
                    'articleSection': article.category,
                }),
            },
            {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': 'Home',
                        'item': siteUrl,
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'name': 'News & Insights',
                        'item': `${siteUrl}/news-insights`,
                    },
                    {
                        '@type': 'ListItem',
                        'position': 3,
                        'name': article.title,
                        'item': canonicalUrl,
                    },
                ],
            },
        ],
    };

    return (
        <>
            {isDraftMode && <DraftModeBanner slug={slug} title={article.title} />}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingJsonLd) }}
            />
            <NewsDetailTemplate article={article} allArticles={allArticles} />
        </>
    );
}

