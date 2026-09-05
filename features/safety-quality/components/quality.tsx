'use client';

import React from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { Text } from '@/shared/components/ui/text';
import { ArrowRight } from '@phosphor-icons/react';
import { FadeInSlideUp, StaggerContainer, StaggerItem } from '@/shared/components/ui/fade-in-slide-up';

interface QualityProps {
    section?: any;
}

const DEFAULT_TAGLINE = 'QUALITY';
const DEFAULT_HEADING = 'Quality from engineering through testing and handover.';
const DEFAULT_BODY = "Pipeline integrity depends on the quality of decisions and workmanship throughout the project lifecycle. PCE's delivery scope incorporates the technical activities required to construct, test and prepare pipeline systems for operation.";
const DEFAULT_BUTTON_TEXT = 'EXPLORE PIPELINE EPC';
const DEFAULT_BUTTON_LINK = '/capabilities';
const DEFAULT_STATS = [
    {
        title: 'Engineering',
        description: 'Develop the technical basis, method and execution requirements.',
    },
    {
        title: 'Fabrication',
        description: 'Prepare pipeline components and assemblies according to project requirements.',
    },
    {
        title: 'Welding & NDT',
        description: 'Execute welding and non-destructive testing as part of pipeline construction.',
    },
    {
        title: 'Hydrotesting',
        description: 'Test completed pipeline sections as required before operation.',
    },
    {
        title: 'Coating',
        description: 'Protect pipeline surfaces and completed work according to project requirements.',
    },
    {
        title: 'Pre-Commissioning & Commissioning',
        description: 'Verify and prepare completed systems for handover and operation.',
    },
];

const HEADING_COLOR_CLASS: Record<string, string> = {
    navy: '',
    blue: '!text-[var(--color-primary)]',
    orange: '!text-[var(--color-accent)]',
};

const bodyComponents = {
    block: {
        normal: ({ children }: any) => (
            <Text variant="lead-airy" intent="default" className="!text-[24px] leading-relaxed">{children}</Text>
        ),
    },
};

export const Quality: React.FC<QualityProps> = ({ section }) => {
    const tagline = section?.tagline || DEFAULT_TAGLINE;
    const heading = section?.heading || DEFAULT_HEADING;
    const headingColorClass = HEADING_COLOR_CLASS[section?.headingColor] || '';
    const buttonText = section?.buttonText || DEFAULT_BUTTON_TEXT;
    const buttonLink = section?.buttonLink || DEFAULT_BUTTON_LINK;
    const hasBody = Array.isArray(section?.body) && section.body.length > 0;
    const stats = DEFAULT_STATS;

    return (
        <section className="w-full min-h-screen bg-[var(--color-canvas-tint)] section flex flex-col items-start gap-12 border-t border-[var(--color-hairline)]">

            {/* Header Block */}
            <FadeInSlideUp className="w-full flex flex-col items-start">
                {/* Tagline */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 mb-6">
                    <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                    <span className="text-sm uppercase tracking-wider text-[var(--color-primary)] font-semibold">
                        {tagline}
                    </span>
                </div>

                {/* Headline */}
                <div className="max-w-[900px]">
                    <Text variant="display-lg" as="h2" intent="default" className={`!font-extrabold leading-tight ${headingColorClass}`}>
                        {heading}
                    </Text>
                </div>
            </FadeInSlideUp>

            {/* 1. Standalone Featured Image */}
            <FadeInSlideUp delay={0.1} className="w-full h-[300px] md:h-[500px] relative overflow-hidden rounded-xl group border border-black/5">
                <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-102"
                    style={{ backgroundImage: 'url("/pictures/home-page/people-working.jpeg")' }}
                />
                <div className="absolute inset-0 bg-black/5" />
            </FadeInSlideUp>

            {/* 2. Two-Column Details Layout (Directly on white background) */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">

                {/* Left Column: Narrative (6/12 width on desktop) */}
                <FadeInSlideUp className="lg:col-span-6 flex flex-col items-start gap-8 max-w-[600px]">
                    <div className="flex flex-col gap-4">
                        {hasBody ? (
                            <PortableText value={section.body} components={bodyComponents} />
                        ) : (
                            <Text variant="lead-airy" intent="default" className="!text-[24px] leading-relaxed">
                                {DEFAULT_BODY}
                            </Text>
                        )}

                        {/* Bullet Points (if provided) */}
                        {section?.bullets && section.bullets.length > 0 && (
                            <ul className="flex flex-col gap-2.5 mt-2">
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
                            <div className="flex flex-col items-start gap-1 pt-6 border-t border-[var(--color-ink)]/10 mt-2">
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
                    <div className="flex items-center">
                        <Link
                            href={buttonLink}
                            className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors text-sm uppercase tracking-wider font-semibold group/link"
                        >
                            {buttonText}
                            <ArrowRight weight="bold" className="text-[var(--color-accent)] group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </FadeInSlideUp>

                {/* Right Column: 2x3 Grid Stats (6/12 width on desktop) */}
                <StaggerContainer className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8 items-start">
                    {stats.map((stat, index) => (
                        <StaggerItem key={index} className="flex flex-col items-start gap-2">
                            <span className="text-[14px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                                0{index + 1}
                            </span>
                            <h4 className="text-base font-bold text-[var(--color-ink)] leading-snug">
                                {stat.title}
                            </h4>
                            <p className="text-xs text-[var(--color-ink-muted-48)] leading-relaxed">
                                {stat.description}
                            </p>
                        </StaggerItem>
                    ))}
                </StaggerContainer>

            </div>

        </section>
    );
};
