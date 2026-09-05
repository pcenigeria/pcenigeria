'use client';

import React from 'react';
import { Text } from '@/shared/components/ui/text';

interface NewsHeroProps {
    sanityPage?: {
        heroHeadline?: string;
        heroSubtext?: string;
    };
}

const DEFAULT_HEADLINE = 'Engineering updates, case studies & Industry news.';
const DEFAULT_SUBTEXT = "Stay informed with PCE Nigeria's latest HDD operational milestones, pipeline EPC innovations, technical articles, and regulatory sector insights.";

export const NewsHero: React.FC<NewsHeroProps> = ({ sanityPage }) => {
    const headline = sanityPage?.heroHeadline || DEFAULT_HEADLINE;
    const subtext = sanityPage?.heroSubtext || DEFAULT_SUBTEXT;

    return (
        <section className="w-full section bg-[#052237] text-white pt-16 pb-20">
            {/* Tagline */}
            <div className="flex items-center gap-2 mb-6">
                <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                <span className="text-sm uppercase tracking-wider text-[var(--color-canvas-tint)] font-semibold">
                    News & Insights
                </span>
            </div>

            {/* Stacked Headline & Subtext */}
            <div className="flex flex-col gap-6 w-full max-w-6xl">
                <Text variant="display-lg" as="h1" intent="default" className="!font-extrabold leading-tight !text-white max-w-[1100px]">
                    {headline}
                </Text>
                <p className="!text-[16px] md:!text-[20px] !text-white leading-relaxed max-w-[720px]">
                    {subtext}
                </p>
            </div>
        </section>
    );
};

export default NewsHero;
