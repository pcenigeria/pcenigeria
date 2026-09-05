'use client';

import React from 'react';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight } from '@phosphor-icons/react';

interface CapabilitiesHeroProps {
    sanityPage?: any;
}

export const CapabilitiesHero: React.FC<CapabilitiesHeroProps> = ({ sanityPage }) => {
    const bgImage = sanityPage?.heroImage || '/pictures/capabilities/hero-image.jpg';
    const headline = sanityPage?.heroHeadline || 'Integrated capability for complex pipeline delivery.';
    const subtext = sanityPage?.heroSubtext || 'PCE combines specialist HDD, pipeline EPC, deep-pipeline location technology and technical resources around demanding pipeline projects.';
    const subtext2 = sanityPage?.heroSubtext2 || 'From early assessment and engineering through construction, testing and commissioning, our capabilities are built around the requirements of the route, the crossing and the line.';
    const bullets: string[] = sanityPage?.heroBullets?.length ? sanityPage.heroBullets : [];

    return (
        <section className="relative w-full min-h-screen flex items-end overflow-hidden bg-[var(--bg-tile-dark)]">
            {/* Background Image / Video Placeholder */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60"
                    style={{ backgroundImage: `url("${bgImage}")` }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-tile-dark)] via-[var(--bg-tile-dark)]/40 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-[var(--z-elevate)] w-full px-[var(--section-pad-x)] pt-32 pb-24 md:pb-[12vh] lg:pb-[15vh] flex flex-col items-start">

                {/* Headline */}
                <div className="max-w-[1000px] mb-6">
                    <Text variant="hero" intent="inverse">
                        {headline}
                    </Text>
                </div>

                {/* Sub-headline */}
                <div className="max-w-[800px] mb-10 flex flex-col gap-4">
                    <Text variant="lead-airy" intent="inverse" className="!text-[16px] md:!text-[20px] !leading-relaxed !text-white">
                        {subtext}
                    </Text>
                    <Text variant="lead-airy" intent="inverse" className="!text-[16px] md:!text-[20px] !leading-relaxed !text-white">
                        {subtext2}
                    </Text>
                </div>

                {/* Bullets */}
                {bullets.length > 0 && (
                    <ul className="max-w-[800px] mb-2 flex flex-col gap-2.5 !list-none !pl-0 !m-0">
                        {bullets.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                                <Text variant="lead-airy" intent="inverse" className="!text-[16px] md:!text-[20px] !leading-relaxed !text-white">
                                    {item}
                                </Text>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
};
