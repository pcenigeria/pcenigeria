'use client';

import React from 'react';
import Link from 'next/link';
import { Text } from '@/shared/components/ui/text';
import { ArrowRight } from '@phosphor-icons/react';
import { FadeInSlideUp, StaggerContainer, StaggerItem } from '@/shared/components/ui/fade-in-slide-up';

interface OurFutureProps {
    section?: any;
}

const DEFAULT_HEADING = 'Sustainable Impact Beyond the Project';
const DEFAULT_CARDS = [
    {
        eyebrow: 'Responsibility',
        title: 'Protecting more than the project.',
        body: "PCE's approach to responsible delivery extends beyond technical completion. We recognise the importance of protecting people, respecting communities and considering the environments in which our projects are executed. Safety, environmental care and social responsibility remain part of the standards we seek to uphold across our work.",
    },
    {
        eyebrow: 'Future Direction',
        title: 'Growing with sustainable impact.',
        body: "PCE's future direction includes reducing its carbon footprint and developing more environmentally considerate storage solutions. As the company expands into new regions and broadens its capabilities, that growth should strengthen technical performance while continuing to consider people, communities and the environment.",
    },
];

const HEADING_COLOR_CLASS: Record<string, string> = {
    navy: '',
    blue: '!text-[var(--color-primary)]',
    orange: '!text-[var(--color-accent)]',
};

export const OurFuture: React.FC<OurFutureProps> = ({ section }) => {
    const tagline = section?.tagline;
    const heading = section?.heading || DEFAULT_HEADING;
    const headingColorClass = HEADING_COLOR_CLASS[section?.headingColor] || '';

    return (
        <section className="w-full bg-[#052237] section flex flex-col items-center gap-12 border-t border-[var(--color-primary-dark)]">

            {/* Centered Heading Block */}
            <FadeInSlideUp className="w-full flex flex-col items-center">
                {/* Tagline (if provided) */}
                {tagline && (
                    <div className="flex items-center gap-2 mb-6">
                        <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                        <span className="text-sm uppercase tracking-wider text-[var(--color-accent)] font-semibold">
                            {tagline}
                        </span>
                    </div>
                )}

                {/* Headline */}
                <div className="max-w-[800px] text-center mx-auto">
                    <Text variant="display-lg" as="h2" intent="inverse" className={`!font-extrabold leading-tight text-center ${headingColorClass}`}>
                        {heading}
                    </Text>
                </div>
            </FadeInSlideUp>

            {/* Cards Grid */}
            <StaggerContainer className="w-full max-w-[1200px] mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                {DEFAULT_CARDS.map((card) => (
                    <StaggerItem key={card.eyebrow} className="flex flex-col items-start gap-4 p-8 rounded-xl bg-white/[0.03] border border-white/10">
                        <span className="text-[14px] uppercase tracking-wider text-[var(--color-accent)] font-extrabold">
                            {card.eyebrow}
                        </span>
                        <h3 className="!text-[28px] font-bold !text-white leading-snug">
                            {card.title}
                        </h3>
                        <p className="text-sm md:text-base !text-white leading-relaxed">
                            {card.body}
                        </p>
                    </StaggerItem>
                ))}
            </StaggerContainer>

            {/* Bullet Points (if provided) */}
            {section?.bullets && section.bullets.length > 0 && (
                <ul className="w-full max-w-[1200px] flex flex-col gap-2.5">
                    {section.bullets.map((bullet: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3 text-sm md:text-base !text-white leading-relaxed">
                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] mt-2 shrink-0" />
                            <span>{bullet}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* Highlight Stat (if provided) */}
            {section?.highlightStat?.value && (
                <div className="flex flex-col items-center gap-1 pt-6 border-t border-white/10">
                    <span className="text-4xl sm:text-5xl font-extrabold !text-white leading-none tracking-tight">
                        {section.highlightStat.value}
                    </span>
                    {section.highlightStat.label && (
                        <span className="text-sm uppercase tracking-widest text-white/60 font-bold">
                            {section.highlightStat.label}
                        </span>
                    )}
                </div>
            )}

            {/* CTA Link (if provided) */}
            {section?.buttonText && section?.buttonLink && (
                <Link
                    href={section.buttonLink}
                    className="group inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-accent)] font-extrabold hover:text-white transition-colors duration-300"
                >
                    {section.buttonText}
                    <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
            )}
        </section>
    );
};
