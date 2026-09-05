'use client';

import React from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { Text } from '@/shared/components/ui/text';
import { ArrowRight } from '@phosphor-icons/react';
import { FadeInSlideUp, StaggerContainer, StaggerItem } from '@/shared/components/ui/fade-in-slide-up';

interface SafetyProps {
    section?: any;
}

const DEFAULT_TAGLINE = 'Safety';
const DEFAULT_HEADING = 'Protecting people through every stage of delivery.';
const DEFAULT_BODY_PARAGRAPHS = [
    "Complex pipeline work brings people, heavy equipment, technical interfaces and changing field conditions together. PCE places safety across the project lifecycle—from assessment and engineering through mobilisation, construction, testing and commissioning.",
    'Safety is treated as part of how the work is planned and delivered—not as a separate activity at the end.',
];
const DEFAULT_STATS = [
    {
        title: 'Understand the Work',
        description: 'Consider project conditions, technical requirements and potential field risks before execution.',
    },
    {
        title: 'Prepare for Execution',
        description: 'Align personnel, equipment and site requirements with the planned work.',
    },
    {
        title: 'Maintain Field Awareness',
        description: 'Respond to changing site conditions and information as execution progresses.',
    },
    {
        title: 'Complete with Control',
        description: 'Carry safety and technical requirements through testing, completion and handover.',
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
            <p className="!text-[var(--color-ink)] text-sm md:text-base leading-relaxed">{children}</p>
        ),
    },
};

export const Safety: React.FC<SafetyProps> = ({ section }) => {
    const tagline = section?.tagline || DEFAULT_TAGLINE;
    const heading = section?.heading || DEFAULT_HEADING;
    const headingColorClass = HEADING_COLOR_CLASS[section?.headingColor] || '';
    const hasBody = Array.isArray(section?.body) && section.body.length > 0;
    const stats = DEFAULT_STATS;

    return (
        <section className="w-full bg-[var(--color-canvas)] section flex flex-col items-start gap-12">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 gap-x-16 lg:gap-x-24 items-center">

                {/* 1. Heading Block (Top Left on Desktop, First on Mobile) */}
                <FadeInSlideUp className="lg:col-span-6 lg:col-start-1 lg:row-start-1 order-1 flex flex-col items-start">
                    {/* Tagline */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 mb-6">
                        <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                        <span className="text-sm uppercase tracking-wider text-[var(--color-primary)] font-semibold">
                            {tagline}
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="max-w-[700px]">
                        <Text variant="display-lg" as="h2" intent="default" className={`!font-extrabold leading-tight ${headingColorClass}`}>
                            {heading}
                        </Text>
                    </div>
                </FadeInSlideUp>

                {/* 2. Image Column (Right Column on Desktop, Second on Mobile) */}
                <FadeInSlideUp delay={0.1} className="lg:col-span-6 lg:col-start-7 lg:row-start-1 lg:row-span-2 order-2 lg:order-none relative w-full h-[280px] sm:h-[380px] lg:h-[600px]">
                    {/* Bottom-Left Image (Group photo scene - Main photo on mobile) */}
                    <div className="relative lg:absolute lg:left-0 lg:bottom-0 w-full h-full lg:w-[70%] lg:h-[72%] rounded-xl overflow-hidden border border-black/5 shadow-sm">
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: 'url("/pictures/safety/projection-one.jpg")' }}
                        />
                    </div>

                    {/* Top-Right Image (Pipeline lifting scene - Hidden on mobile) */}
                    <div
                        className="hidden lg:block absolute lg:right-0 lg:top-0 lg:w-[58%] lg:h-[68%] rounded-xl overflow-hidden border border-black/5 z-10 shadow-md"
                    >
                        <div
                            className="w-full h-full bg-cover bg-center"
                            style={{ backgroundImage: 'url("/pictures/safety/protection-two.jpg")' }}
                        />
                    </div>
                </FadeInSlideUp>

                {/* 3. Description & CTA Block (Bottom Left on Desktop, Third on Mobile) */}
                <FadeInSlideUp delay={0.15} className="lg:col-span-6 lg:col-start-1 lg:row-start-2 order-3 lg:order-none flex flex-col items-start gap-6 lg:-mt-16">
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

                    {/* CTA Link (if provided) */}
                    {section?.buttonText && section?.buttonLink && (
                        <Link
                            href={section.buttonLink}
                            className="group inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-accent)] font-extrabold hover:text-[var(--color-primary-dark)] transition-colors duration-300"
                        >
                            {section.buttonText}
                            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    )}
                </FadeInSlideUp>
            </div>

            {/* 4. Stats / Principles Block with Hairline Dividers */}
            <StaggerContainer className="w-full pt-16 mt-8 border-t border-[var(--color-ink)]/10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-0 lg:divide-x lg:divide-[var(--color-ink)]/15">
                {stats.map((stat, index) => (
                    <StaggerItem key={index} className="flex flex-col items-start gap-3 lg:px-8 first:lg:pl-0 last:lg:pr-0">
                        <span className="text-[14px] font-bold uppercase tracking-widest text-[var(--color-accent)]">
                            0{index + 1}
                        </span>
                        <h4 className="text-lg font-bold text-[var(--color-ink)] leading-snug">
                            {stat.title}
                        </h4>
                        <p className="text-sm text-[var(--color-ink-muted-48)] leading-relaxed">
                            {stat.description}
                        </p>
                    </StaggerItem>
                ))}
            </StaggerContainer>
        </section>
    );
};
