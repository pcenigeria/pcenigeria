'use client';

import React from 'react';
import { PortableText } from '@portabletext/react';
import { Text } from '@/shared/components/ui/text';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { FadeInSlideUp, StaggerContainer, StaggerItem } from '@/shared/components/ui/fade-in-slide-up';

const DEFAULT_HEADING = 'Local delivery capability. Specialist international experience.';
const DEFAULT_BODY_TEXT = 'PCE Nigeria works in consortium with Lantic on specialist HDD and pipeline delivery, bringing together local operating knowledge, engineering expertise, equipment resources and international project experience.';
const DEFAULT_BUTTON_TEXT = 'See How We Work';
const DEFAULT_BUTTON_LINK = '/capabilities';

const DEFAULT_CARDS = [
    {
        title: 'Local Operating Knowledge',
        description: 'Project experience and field resources supporting execution in Nigeria.',
        image: '/pictures/company/ob3-wilding-main-pipeline.jpg',
        span: 'lg:col-span-7',
    },
    {
        title: 'Specialist HDD Engineering',
        description: 'Precision directional drilling for complex riverbed, roadway, and shoreline crossings.',
        image: '/pictures/company/specialist-enginering.jpg',
        span: 'lg:col-span-5',
    },
    {
        title: 'Integrated Pipeline EPC',
        description: 'End-to-end execution covering engineering, pipeline fabrication, pre-commissioning, and testing.',
        image: '/pictures/company/integrated-pipeline-epc.jpg',
        span: 'lg:col-span-5',
    },
    {
        title: 'Global Consortium Resources',
        description: 'Combined equipment fleets, materials logistics, and international project support through the Lantic partnership.',
        image: '/pictures/company/global-resources.jpg',
        span: 'lg:col-span-7',
    },
];

const bodyComponents = {
    block: {
        normal: ({ children }: any) => (
            <Text variant="body" intent="default" as="p" className="text-[var(--color-ink-muted-48)] leading-relaxed lg:max-w-[460px] text-base md:text-lg">
                {children}
            </Text>
        ),
    },
    types: {
        image: ({ value }: any) => {
            const src = value?.asset?.url;
            if (!src) return null;
            return (
                <span className="block my-4">
                    <img src={src} alt={value?.alt || ''} className="w-full h-auto rounded-lg" />
                    {value?.caption && (
                        <span className="block text-xs opacity-60 mt-2">{value.caption}</span>
                    )}
                </span>
            );
        },
    },
};

interface OverviewCapabilitiesProps {
    section?: any;
    cards?: { title?: string; description?: string; image?: string }[];
}

export const OverviewCapabilities: React.FC<OverviewCapabilitiesProps> = ({ section, cards }) => {
    const heading = section?.heading || DEFAULT_HEADING;
    const buttonText = section?.buttonText || DEFAULT_BUTTON_TEXT;
    const buttonLink = section?.buttonLink || DEFAULT_BUTTON_LINK;
    const hasBody = Array.isArray(section?.body) && section.body.length > 0;

    const resolvedCards = DEFAULT_CARDS.map((defaultCard, index) => ({
        title: cards?.[index]?.title || defaultCard.title,
        description: cards?.[index]?.description || defaultCard.description,
        image: cards?.[index]?.image || defaultCard.image,
        span: defaultCard.span,
    }));

    return (
        <section className="w-full min-h-screen bg-[var(--color-canvas-tint)] section flex flex-col items-start gap-12 border-t border-[var(--color-hairline)]">

            {/* Header Block */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-end">
                {/* Left Column: Heading */}
                <FadeInSlideUp className="lg:col-span-7 flex flex-col items-start">
                    <div className="max-w-[700px]">
                        <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight !text-[var(--color-ink)]">
                            {heading}
                        </Text>
                    </div>
                </FadeInSlideUp>

                {/* Right Column: Narrative & Button */}
                <FadeInSlideUp delay={0.1} className="lg:col-span-5 flex flex-col items-start gap-6">
                    {hasBody ? (
                        <PortableText value={section.body} components={bodyComponents} />
                    ) : (
                        <Text variant="body" intent="default" className="text-[var(--color-ink-muted-48)] leading-relaxed lg:max-w-[460px] text-base md:text-lg">
                            {DEFAULT_BODY_TEXT}
                        </Text>
                    )}

                    {/* Section Photo Gallery (if present) */}
                    {section?.gallery?.items && section.gallery.items.length > 0 && (
                        <div className="grid grid-cols-3 gap-2 w-full lg:max-w-[460px]">
                            {section.gallery.items.map((item: any, gIdx: number) => (
                                <div
                                    key={item.src || gIdx}
                                    className="relative h-[90px] rounded-lg overflow-hidden bg-black/5 border border-black/10"
                                >
                                    <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{ backgroundImage: `url("${item.src}")` }}
                                        title={item.title}
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <Link
                        href={buttonLink}
                        className="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-focus)] text-white text-xs uppercase tracking-wider font-semibold py-3 px-6 rounded-md transition-colors no-underline"
                    >
                        {buttonText}
                        <ArrowRight weight="bold" />
                    </Link>
                </FadeInSlideUp>
            </div>

            {/* Bento Grid of Cards */}
            <StaggerContainer className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                {resolvedCards.map((card) => (
                    <StaggerItem key={card.title} className={`${card.span} relative h-[320px] sm:h-[400px] rounded-xl overflow-hidden group border border-black/5 cursor-pointer`}>
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                            style={{ backgroundImage: `url("${card.image}")` }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                        <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col gap-2 text-white">
                            <h3 className="!text-[28px] font-bold leading-tight !text-white">
                                {card.title}
                            </h3>
                            <p className="text-sm !text-white/80 leading-relaxed max-w-[500px]">
                                {card.description}
                            </p>
                        </div>
                    </StaggerItem>
                ))}
            </StaggerContainer>

        </section>
    );
};
