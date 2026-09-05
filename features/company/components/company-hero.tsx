'use client';

import React from 'react';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { ArrowRight } from '@phosphor-icons/react';

const DEFAULT_HEADLINE = 'Built for complex pipeline delivery.';
const DEFAULT_SUBTEXT = 'PCE Nigeria provides integrated pipeline construction and EPC services, with specialist capability in Horizontal Directional Drilling.';
const DEFAULT_SUBTEXT2 = 'From early assessment and engineering through construction, pre-commissioning and commissioning, we bring technical expertise and field resources together around demanding pipeline projects.';
const DEFAULT_BTN_TEXT = 'Explore Capabilities';
const DEFAULT_BTN_LINK = '/capabilities';

interface CompanyHeroProps {
    heroHeadline?: string;
    heroSubtext?: string;
    heroSubtext2?: string;
    heroPrimaryBtnText?: string;
    heroPrimaryBtnLink?: string;
}

export const CompanyHero: React.FC<CompanyHeroProps> = ({
    heroHeadline,
    heroSubtext,
    heroSubtext2,
    heroPrimaryBtnText,
    heroPrimaryBtnLink,
}) => {
    return (
        <section className="relative w-full min-h-screen flex items-end overflow-hidden bg-[var(--bg-tile-dark)]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <div
                    className="absolute inset-0 w-full h-full bg-cover bg-center opacity-60"
                    style={{ backgroundImage: 'url("/pictures/company/company-hero.jpg")' }}
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-tile-dark)] via-[var(--bg-tile-dark)]/40 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-[var(--z-elevate)] w-full px-[var(--section-pad-x)] pt-32 pb-24 md:pb-[12vh] lg:pb-[15vh] flex flex-col items-start">

                {/* Headline */}
                <div className="max-w-[1000px] mb-6">
                    <Text variant="hero" intent="inverse">
                        {heroHeadline || DEFAULT_HEADLINE}
                    </Text>
                </div>

                {/* Sub-headline */}
                <div className="max-w-[800px] mb-10 flex flex-col gap-6">
                    <Text variant="lead-airy" intent="inverse" className="!text-[16px] md:!text-[20px] !leading-relaxed">
                        {heroSubtext || DEFAULT_SUBTEXT}
                    </Text>
                    <Text variant="lead-airy" intent="inverse" className="!text-[16px] md:!text-[20px] !leading-relaxed">
                        {heroSubtext2 || DEFAULT_SUBTEXT2}
                    </Text>
                </div>

                {/* Buttons Row */}
                <div className="flex flex-wrap gap-4">
                    <Button variant="primary" href={heroPrimaryBtnLink || DEFAULT_BTN_LINK} rightIcon={<ArrowRight weight="bold" aria-hidden="true" />}>
                        {heroPrimaryBtnText || DEFAULT_BTN_TEXT}
                    </Button>
                </div>
            </div>
        </section>
    );
};
