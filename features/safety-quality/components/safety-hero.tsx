'use client';

import React from 'react';
import { Text } from '@/shared/components/ui/text';
import { FadeInSlideUp } from '@/shared/components/ui/fade-in-slide-up';

interface SafetyHeroProps {
    sanityPage?: any;
}

const DEFAULT_HERO_HEADLINE = 'Dependable execution begins with clear standards.';
const DEFAULT_HERO_SUBTEXT = 'Safety, quality, efficiency and integrity guide PCE from early assessment through construction, testing and commissioning. Responsible delivery means protecting people, maintaining technical standards and considering the environments and communities around the work.';

export const SafetyHero: React.FC<SafetyHeroProps> = ({ sanityPage }) => {
    const headline = sanityPage?.heroHeadline || DEFAULT_HERO_HEADLINE;
    const subtext = sanityPage?.heroSubtext || DEFAULT_HERO_SUBTEXT;
    const bgImage = sanityPage?.heroImage || '/pictures/safety/safety-hero.jpg';

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
                <FadeInSlideUp aboveFold delay={0} className="max-w-[1000px] mb-6">
                    <Text variant="hero" intent="inverse">
                        {headline}
                    </Text>
                </FadeInSlideUp>

                {/* Sub-headline */}
                <FadeInSlideUp aboveFold delay={0.15} className="max-w-[800px] mb-10">
                    <Text variant="lead-airy" intent="inverse" className="!text-[16px] md:!text-[20px] !leading-relaxed">
                        {subtext}
                    </Text>
                </FadeInSlideUp>
            </div>
        </section>
    );
};
