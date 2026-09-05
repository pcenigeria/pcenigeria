'use client';

import React from 'react';
import { PortableText } from '@portabletext/react';
import { Text } from '@/shared/components/ui/text';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { FadeInSlideUp } from '@/shared/components/ui/fade-in-slide-up';

interface EnvironmentalCareProps {
    section?: any;
}

const DEFAULT_TAGLINE = 'Environmental Care';
const DEFAULT_HEADING = 'Progress beneath the surface. Less disturbance above it.';
const DEFAULT_BODY_PARAGRAPHS = [
    'Horizontal Directional Drilling allows pipelines to cross beneath rivers, roads and other obstacles without continuous open-cut excavation across the crossing route. For suitable projects, this can reduce direct surface disturbance while enabling the required pipeline connection',
    "Environmental considerations form part of PCE's wider commitment to responsible project delivery.",
];
const DEFAULT_BUTTON_TEXT = 'Explore HDD Capability';
const DEFAULT_BUTTON_LINK = '/capabilities';

const HEADING_COLOR_CLASS: Record<string, string> = {
    navy: '',
    blue: '!text-[var(--color-primary)]',
    orange: '!text-[var(--color-accent)]',
};

const bodyComponents = {
    block: {
        normal: ({ children }: any) => (
            <p className="!text-[var(--color-ink)] text-sm md:text-base leading-relaxed">{children}</p>
        ),
    },
};

export const EnvironmentalCare: React.FC<EnvironmentalCareProps> = ({ section }) => {
    const tagline = section?.tagline || DEFAULT_TAGLINE;
    const heading = section?.heading || DEFAULT_HEADING;
    const headingColorClass = HEADING_COLOR_CLASS[section?.headingColor] || '';
    const buttonText = section?.buttonText || DEFAULT_BUTTON_TEXT;
    const buttonLink = section?.buttonLink || DEFAULT_BUTTON_LINK;
    const hasBody = Array.isArray(section?.body) && section.body.length > 0;

    return (
        <section className="w-full bg-white section flex flex-col items-start gap-12">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 gap-x-16 lg:gap-x-24 items-center">

                {/* 1. Heading Block */}
                <FadeInSlideUp className="lg:col-span-6 lg:col-start-1 lg:row-start-1 order-1 flex flex-col items-start">
                    {/* Tagline */}
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                        <span className="text-sm uppercase tracking-wider text-[var(--color-primary)] font-semibold">
                            {tagline}
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="max-w-[700px]">
                        <Text variant="display-lg" as="h2" intent="default" className={`!font-extrabold leading-tight !text-[var(--color-ink)] ${headingColorClass}`}>
                            {heading}
                        </Text>
                    </div>
                </FadeInSlideUp>

                {/* 2. Image Column */}
                <FadeInSlideUp delay={0.1} className="lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:row-span-2 order-2 lg:order-none relative w-full h-[320px] sm:h-[400px] lg:h-[520px] rounded-xl overflow-hidden group">
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: 'url("/pictures/safety/environmental-care.jpg")' }}
                    />
                </FadeInSlideUp>

                {/* 3. Description & CTA Block */}
                <FadeInSlideUp delay={0.15} className="lg:col-span-6 lg:col-start-1 lg:row-start-2 order-3 lg:order-none flex flex-col items-start gap-8 lg:mt-8">
                    {/* Body Paragraphs */}
                    <div className="flex flex-col gap-6 max-w-[540px]">
                        {hasBody ? (
                            <PortableText value={section.body} components={bodyComponents} />
                        ) : (
                            DEFAULT_BODY_PARAGRAPHS.map((paragraph) => (
                                <p key={paragraph} className="!text-[var(--color-ink)] text-sm md:text-base leading-relaxed">
                                    {paragraph}
                                </p>
                            ))
                        )}

                        {/* Bullet Points (if provided) */}
                        {section?.bullets && section.bullets.length > 0 && (
                            <ul className="flex flex-col gap-2.5">
                                {section.bullets.map((bullet: string, idx: number) => (
                                    <li key={idx} className="flex items-start gap-3 text-sm md:text-base text-[var(--color-ink)] leading-relaxed">
                                        <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                                        <span>{bullet}</span>
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Highlight Stat (if provided) */}
                        {section?.highlightStat?.value && (
                            <div className="flex flex-col items-start gap-1 pt-6 border-t border-[var(--color-ink)]/10">
                                <span className="text-4xl sm:text-5xl font-extrabold text-[var(--color-primary)] leading-none tracking-tight">
                                    {section.highlightStat.value}
                                </span>
                                {section.highlightStat.label && (
                                    <span className="text-sm uppercase tracking-widest text-[var(--color-ink-muted-48)] font-bold">
                                        {section.highlightStat.label}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>

                    {/* CTA Link */}
                    <Link
                        href={buttonLink}
                        className="group inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-accent)] font-extrabold hover:text-[var(--color-primary-dark)] transition-colors duration-300"
                    >
                        {buttonText}
                        <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                </FadeInSlideUp>

            </div>
        </section>
    );
};
