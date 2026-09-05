import React from 'react';
import { notFound } from 'next/navigation';
import { NewsDetailTemplate } from '@/features/news-insights/components/news-detail-template';
import { getNewsArticleBySlug, getAllNewsArticles } from '@/sanity/lib/queries';

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

export async function generateMetadata({ params }: PageProps) {
    const slug = await resolveSlug(params);
    const article = await getNewsArticleBySlug(slug);

    if (!article) return {};

    return {
        title: `${article.title} | PCE Nigeria News & Insights`,
        description: article.intro,
    };
}

export default async function Page({ params }: PageProps) {
    const slug = await resolveSlug(params);
    const [article, allArticles] = await Promise.all([
        getNewsArticleBySlug(slug),
        getAllNewsArticles(),
    ]);

    if (!article) {
        notFound();
    }

    return <NewsDetailTemplate article={article} allArticles={allArticles} />;
}
