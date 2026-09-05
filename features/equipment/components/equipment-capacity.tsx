'use client';

import React from 'react';
import { PortableText } from '@portabletext/react';
import { Text } from '@/shared/components/ui/text';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { FadeInSlideUp } from '@/shared/components/ui/fade-in-slide-up';

const DEFAULT_IMAGES = [
    "/pictures/equipment/009061ab6e7649c67058fc722baea717.jpg",
    "/pictures/equipment/gd-5000.jpg",
    "/pictures/equipment/xcmg-500.jpg"
];

const DEFAULT_STATS = [
    { label: '500t', description: 'HDD rig capacity' },
    { label: '500t', description: 'Pipe-handling capacity' },
    { label: '3', description: 'ParaTrack 2 systems' },
    { label: '3', description: 'F5 walkover systems' },
];

const DEFAULT_HEADING = 'Scale matters. Control matters more.';
const DEFAULT_BODY = 'Large equipment creates capacity. Disciplined engineering, guidance, drilling-fluid management and field coordination turn that capacity into a successful crossing.';

const bodyComponents = {
    block: {
        normal: ({ children }: any) => (
            <p className="text-[var(--color-ink-muted-80)] text-sm md:text-base leading-relaxed">{children}</p>
        ),
    },
};

interface EquipmentCapacityProps {
    sanityPage?: any;
}

export const OurCapabilities: React.FC<EquipmentCapacityProps> = ({ sanityPage }) => {
    const section = sanityPage?.capacitySection;
    const heading = section?.heading || DEFAULT_HEADING;
    const buttonText = section?.buttonText || 'Explore Our HDD Capability';
    const buttonLink = section?.buttonLink || '/capabilities';
    const hasBody = Array.isArray(section?.body) && section.body.length > 0;

    const stats = React.useMemo(() => {
        if (sanityPage?.capacityKeyStats && sanityPage.capacityKeyStats.length > 0) {
            return sanityPage.capacityKeyStats;
        }
        return DEFAULT_STATS;
    }, [sanityPage]);

    const images = React.useMemo(() => {
        if (sanityPage?.capacityImages && sanityPage.capacityImages.length > 0) {
            const urls = sanityPage.capacityImages.map((img: any) => img?.src).filter(Boolean);
            if (urls.length > 0) return urls;
        }
        return DEFAULT_IMAGES;
    }, [sanityPage]);

    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % Math.max(images.length, 1));
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <section className="w-full bg-[var(--color-canvas-tint)] section flex flex-col items-start gap-12 border-t border-[var(--color-hairline)]">
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 gap-x-16 lg:gap-x-24 items-center">
                
                {/* Left Column: Heading, Narrative, and CTA */}
                <FadeInSlideUp className="lg:col-span-6 flex flex-col justify-between h-full py-2">
                    {/* Header Group */}
                    <div className="flex flex-col items-start">
                        {/* Tagline */}
                        {section?.tagline && (
                            <div className="flex items-center gap-2 mb-6">
                                <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                                <span className="text-sm uppercase tracking-wider text-[var(--color-primary)] font-semibold">
                                    {section.tagline}
                                </span>
                            </div>
                        )}
                        {/* Headline */}
                        <div className="max-w-[700px] mb-8">
                            <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight">
                                {heading}
                            </Text>
                        </div>
                    </div>

                    {/* Narrative & CTA */}
                    <div className="flex flex-col items-start gap-8 w-full">
                        <div className="flex flex-col gap-6 max-w-[540px] w-full">
                            {hasBody ? (
                                <PortableText value={section.body} components={bodyComponents} />
                            ) : (
                                <p className="text-[var(--color-ink-muted-80)] text-sm md:text-base leading-relaxed">
                                    {DEFAULT_BODY}
                                </p>
                            )}
                        </div>

                        {/* Mobile-Only Looping Slideshow (Placed inline between narrative and stats) */}
                        <div className="block lg:hidden relative w-full h-[320px] sm:h-[400px] rounded-xl overflow-hidden group border border-black/5 bg-black/5 w-full">
                            {images.map((imgUrl: string, index: number) => (
                                <div 
                                    key={imgUrl}
                                    className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${
                                        index === currentImageIndex 
                                            ? 'opacity-100 scale-100 z-10' 
                                             : 'opacity-0 scale-105 z-0'
                                    }`}
                                    style={{ backgroundImage: `url("${imgUrl}")` }}
                                />
                            ))}
                        </div>

                        {/* Key Stats Block (Lines between them) */}
                        <div className="w-full flex flex-col max-w-[540px]">
                            {stats.map((stat: any, index: number) => (
                                <div 
                                    key={index} 
                                    className={`py-4 flex justify-between items-baseline gap-4 ${
                                        index < stats.length - 1 ? 'border-b border-[var(--color-primary)]/10' : ''
                                    }`}
                                >
                                    <span className="text-2xl font-extrabold text-[var(--color-primary)]">{stat.label}</span>
                                    <span className="text-sm text-[var(--color-ink-muted-80)] font-semibold uppercase tracking-wider">
                                        {stat.description}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* CTA Link */}
                        <Link 
                            href={buttonLink} 
                            className="group inline-flex items-center gap-2 text-xs uppercase tracking-wider text-[var(--color-primary)] font-extrabold hover:text-[var(--color-accent)] transition-colors duration-300 mt-2"
                        >
                            {buttonText}
                            <ArrowRight size={14} className="text-[var(--color-accent)] transition-transform duration-300 group-hover:translate-x-1" />
                        </Link>
                    </div>
                </FadeInSlideUp>

                {/* Right Column: Dynamic Looping Slideshow (Desktop Only) */}
                <FadeInSlideUp delay={0.1} className="hidden lg:block lg:col-span-6 relative w-full h-[320px] sm:h-[400px] lg:h-[520px] rounded-xl overflow-hidden group border border-black/5 bg-black/5">
                    {images.map((imgUrl: string, index: number) => (
                        <div 
                            key={imgUrl}
                            className={`absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out ${
                                index === currentImageIndex 
                                    ? 'opacity-100 scale-100 z-10' 
                                    : 'opacity-0 scale-105 z-0'
                            }`}
                            style={{ backgroundImage: `url("${imgUrl}")` }}
                        />
                    ))}
                </FadeInSlideUp>

            </div>
        </section>
    );
};

export const EquipmentCapacity = OurCapabilities;

