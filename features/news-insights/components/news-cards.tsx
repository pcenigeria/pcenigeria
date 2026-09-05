'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight } from '@phosphor-icons/react';
import { FadeInSlideUp, StaggerContainer, StaggerItem } from '@/shared/components/ui/fade-in-slide-up';
import { NewsArticleSummary } from '../types/news.types';

interface NewsCardItem {
    id: string;
    slug: string;
    category: 'News' | 'Insights';
    date: string;
    title: string;
    description: string;
    image: string;
}

const DEFAULT_NEWS_ITEMS: NewsCardItem[] = [
    {
        id: '1',
        slug: 'ob3-river-niger-hdd-crossing-completion-report',
        category: 'News',
        date: 'APRIL 28, 2026',
        title: 'Completion Report: PCE Successfully Installs 2km OB3 River Niger HDD Crossing',
        description: 'PCE executed the River Niger HDD crossing on the OB3 Gas Pipeline between Ndoni in Rivers State and Aboh in Delta State.',
        image: '/pictures/case-study/ob3/ob3-bento-1.jpg',
    },
    {
        id: '2',
        slug: 'latest-progress-52km-pipeline-epc-project',
        category: 'News',
        date: 'MAY 2026',
        title: 'Latest Progress: 52km Pipeline EPC Project Operations & Construction',
        description: "An operational update on PCE's comprehensive 52km Pipeline EPC project combining continuous HDD, trenching, welding, and hydrotesting.",
        image: '/pictures/hero-slider/pipeline-epc-cover-photo.JPG',
    },
    {
        id: '3',
        slug: 'akk-river-niger-hdd-crossing-completion-milestone',
        category: 'Insights',
        date: 'JULY 26, 2025',
        title: 'AKK River Niger Crossing: Specialist HDD Execution Beneath Mixed Strata',
        description: 'PCE completed the specialist HDD crossing for the 40-inch AKK gas pipeline beneath the River Niger through complex geology.',
        image: '/pictures/case-study/akk/akk-bento-1.jpg',
    },
    {
        id: '4',
        slug: 'advanced-bpds-pipeline-location-technique',
        category: 'Insights',
        date: '2026',
        title: 'New Pipeline Location Survey Technique: BPDS 3D Subsurface Mapping',
        description: 'Three-dimensional location and depth measurement technique for deeply buried steel pipelines beneath river crossings.',
        image: '/pictures/hero-slider/bpds-cover-photo.png',
    },
];

interface NewsCardsProps {
    sanityArticles?: NewsArticleSummary[];
    articlesSection?: {
        tagline?: string;
        heading?: string;
    };
}

export const NewsCards: React.FC<NewsCardsProps> = ({ sanityArticles, articlesSection }) => {
    const [activeTab, setActiveTab] = useState<string>('all');

    const newsItems: NewsCardItem[] = React.useMemo(() => {
        if (!sanityArticles || sanityArticles.length === 0) {
            return DEFAULT_NEWS_ITEMS;
        }

        return sanityArticles.map((article, idx) => ({
            id: article._id,
            slug: article.slug,
            category: article.category,
            date: article.date || '',
            title: article.title,
            description: article.intro || '',
            image: article.heroImage || DEFAULT_NEWS_ITEMS[idx % DEFAULT_NEWS_ITEMS.length].image,
        }));
    }, [sanityArticles]);

    const tabs = [
        { id: 'all', label: 'All' },
        { id: 'news', label: 'News' },
        { id: 'insights', label: 'Insights' },
    ];

    const filteredItems = activeTab === 'all'
        ? newsItems
        : newsItems.filter(item => item.category.toLowerCase() === activeTab);

    return (
        <section className="w-full bg-[var(--color-canvas-tint)] section flex flex-col items-start gap-8 py-16 lg:py-24">

            {/* Section Heading */}
            {(articlesSection?.tagline || articlesSection?.heading) && (
                <FadeInSlideUp className="flex flex-col gap-2">
                    {articlesSection?.tagline && (
                        <span className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                            {articlesSection.tagline}
                        </span>
                    )}
                    {articlesSection?.heading && (
                        <h2 className="!text-[28px] lg:!text-[36px] font-extrabold text-[var(--color-primary)] leading-tight">
                            {articlesSection.heading}
                        </h2>
                    )}
                </FadeInSlideUp>
            )}

            {/* Tab Bar */}
            <FadeInSlideUp className="w-full flex flex-row flex-nowrap overflow-x-auto gap-3 pb-3 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`px-6 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                            activeTab === tab.id
                                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                                : 'border border-[var(--color-primary)]/20 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </FadeInSlideUp>

            {/* Cards Grid */}
            <StaggerContainer className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                    <StaggerItem key={item.id}>
                        <Link href={`/news-insights/${item.slug}`} className="no-underline block h-full">
                            <article
                                className="bg-white rounded-2xl border border-black/5 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300 h-full"
                            >
                                {/* Image */}
                                <div className="relative h-[240px] w-full bg-[#052237] overflow-hidden">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <div className="absolute top-4 left-4 z-10">
                                        <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                                            {item.category}
                                        </span>
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-6 flex flex-col gap-3 flex-1 justify-between">
                                    <div className="flex flex-col gap-2">
                                        <span className="text-xs font-semibold text-[var(--color-accent)] tracking-wider uppercase">
                                            {item.date}
                                        </span>
                                        <h3 className="!text-[20px] lg:!text-[24px] font-extrabold text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                                            {item.title}
                                        </h3>
                                        <p className="text-sm text-[var(--color-ink-muted-48)] leading-relaxed">
                                            {item.description}
                                        </p>
                                    </div>

                                    <div className="pt-4 border-t border-[var(--color-hairline)] flex items-center justify-between text-sm font-bold text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                                        <span>Read More</span>
                                        <ArrowUpRight weight="bold" size={18} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                    </div>
                                </div>
                            </article>
                        </Link>
                    </StaggerItem>
                ))}
            </StaggerContainer>

        </section>
    );
};

export default NewsCards;
