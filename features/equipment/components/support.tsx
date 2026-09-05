'use client';

import React from 'react';
import { Text } from '@/shared/components/ui/text';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { FadeInSlideUp } from '@/shared/components/ui/fade-in-slide-up';

interface SupportProps {
    sanityPage?: any;
}

export const Support: React.FC<SupportProps> = ({ sanityPage }) => {
    const images = React.useMemo(() => {
        if (sanityPage?.supportImages && sanityPage.supportImages.length > 0) {
            return sanityPage.supportImages.map((img: any) => img.src).filter(Boolean);
        }
        return [
            "/pictures/equipment/91903d3f483647597b5364f08e4e7007.jpg",
            "/pictures/equipment/e4718ab6567102f62eba9b2f0406e17f.jpg",
            "/pictures/home-page/equipment-08.jpg"
        ];
    }, [sanityPage]);

    const supportItems = [
        "Crossing proposals and technical planning",
        "Equipment configuration support",
        "HDD rigs, pumps and recycling systems",
        "Reamers, drill bits and mud motors",
        "Bentonite and specialist additives",
        "Technical execution guidance"
    ];

    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % Math.max(images.length, 1));
        }, 3000);
        return () => clearInterval(interval);
    }, [images.length]);


    return (
        <section className="w-full bg-[var(--color-canvas)] section flex flex-col items-start gap-12 border-t border-[var(--color-hairline)]">
            
            {/* Mobile-Only Header Block */}
            <FadeInSlideUp className="block lg:hidden w-full">
                {/* Tagline */}
                <div className="flex items-center gap-2 mb-6">
                    <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                    <span className="text-sm uppercase tracking-wider text-[var(--color-primary)] font-semibold">
                        TECHNICAL SUPPORT
                    </span>
                </div>

                {/* Headline */}
                <div className="max-w-[700px]">
                    <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight">
                        Equipment backed by HDD expertise.
                    </Text>
                </div>
            </FadeInSlideUp>

            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-y-10 lg:gap-y-0 gap-x-16 lg:gap-x-24 items-center">
                
                {/* Left Column: Dynamic Looping Slideshow */}
                <FadeInSlideUp className="lg:col-span-6 relative w-full h-[320px] sm:h-[400px] lg:h-[520px] rounded-xl overflow-hidden group border border-black/5 bg-black/5">
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


                {/* Right Column: Heading, Narrative, and Stats List */}
                <FadeInSlideUp delay={0.1} className="lg:col-span-6 flex flex-col justify-between h-full py-2">
                    {/* Header Group (Desktop Only) */}
                    <div className="hidden lg:flex flex-col items-start">
                        {/* Tagline */}
                        <div className="flex items-center gap-2 mb-6">
                            <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                            <span className="text-sm uppercase tracking-wider text-[var(--color-primary)] font-semibold">
                                TECHNICAL SUPPORT
                            </span>
                        </div>

                        {/* Headline */}
                        <div className="max-w-[700px] mb-8">
                            <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight">
                                Equipment backed by HDD expertise.
                            </Text>
                        </div>
                    </div>

                    {/* Narrative & Stats */}
                    <div className="flex flex-col items-start gap-8 w-full">
                        <div className="flex flex-col gap-6 max-w-[540px] w-full">
                            <p className="text-[var(--color-ink-muted-80)] text-sm md:text-base leading-relaxed">
                                The value of specialist equipment depends on how it is selected, configured and used. Support is aligned with project requirements, equipment configuration and availability.
                            </p>
                            <p className="text-[var(--color-ink-muted-80)] text-sm md:text-base font-semibold leading-relaxed">
                                PCE supports HDD requirements with:
                            </p>
                        </div>

                        {/* Key Support Items List (Mapped to avoid repetition) */}
                        <div className="w-full flex flex-col max-w-[540px]">
                            {supportItems.map((item, index) => (
                                <div 
                                    key={index}
                                    className={`py-4 !text-[20px] !font-normal text-[var(--color-ink)] ${
                                        index < supportItems.length - 1 ? 'border-b border-[var(--color-primary)]/10' : ''
                                    }`}
                                >
                                    {item}
                                </div>
                            ))}
                        </div>
                    </div>
                </FadeInSlideUp>

            </div>
        </section>
    );
};
