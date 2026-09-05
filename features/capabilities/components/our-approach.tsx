'use client';

import React from 'react';
import { Text } from '@/shared/components/ui/text';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { FadeInSlideUp } from '@/shared/components/ui/fade-in-slide-up';

interface OurApproachProps {
    sanityPage?: any;
}

export const OurApproach: React.FC<OurApproachProps> = ({ sanityPage }) => {
    const section = sanityPage?.approachSection;
    const tagline = section?.tagline || 'Our Approach';
    const heading = section?.heading || 'The route, the crossing and the line considered together.';
    const body = section?.body || "Complex pipeline projects rarely depend on one discipline. Ground conditions affect engineering. Engineering determines equipment. Equipment affects execution. And every stage must work within the project's safety, quality and programme requirements. PCE brings these considerations together from assessment through delivery.";
    const buttonText = section?.buttonText || 'Explore Our Projects';
    const buttonLink = section?.buttonLink || '/projects';
    const image = section?.gallery?.items?.[0]?.src || '/pictures/company/pipeline.jpg';

    return (
        <section className="w-full bg-[var(--color-surface-tile-1)] section flex flex-col items-start gap-12 border-t border-[var(--color-surface-tile-3)]">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 gap-x-12 lg:gap-x-20 items-center">

                {/* Left Column: Tagline, Headline, Body & CTA */}
                <FadeInSlideUp className="lg:col-span-6 flex flex-col items-start gap-6">
                    {/* Tagline */}
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                        <span className="text-sm uppercase tracking-wider text-white/80 font-semibold">
                            {tagline}
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="max-w-[700px]">
                        <Text variant="display-lg" as="h2" intent="inverse" className="!font-extrabold leading-tight">
                            {heading}
                        </Text>
                    </div>

                    {/* Body Paragraph */}
                    <p className="!text-white/80 text-sm md:text-base leading-relaxed max-w-[540px]">
                        {body}
                    </p>

                    {/* CTA Link */}
                    <div className="pt-2">
                        <Link
                            href={buttonLink}
                            className="group inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-accent)] font-extrabold hover:text-white transition-colors duration-300"
                        >
                            {buttonText}
                            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </FadeInSlideUp>

                {/* Right Column: Image */}
                <FadeInSlideUp delay={0.15} className="lg:col-span-6 relative w-full h-[320px] sm:h-[400px] lg:h-[480px] rounded-xl overflow-hidden group">
                    <div
                        className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: `url("${image}")` }}
                    />
                </FadeInSlideUp>

            </div>
        </section>
    );
};
