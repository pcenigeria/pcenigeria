'use client';

import React from 'react';
import { Text } from '@/shared/components/ui/text';
import Link from 'next/link';
import { ArrowRight } from '@phosphor-icons/react';
import { FadeInSlideUp, StaggerContainer, StaggerItem } from '@/shared/components/ui/fade-in-slide-up';

export const OverviewCapabilities = () => {
    return (
        <section className="w-full min-h-screen bg-[var(--color-canvas-tint)] section flex flex-col items-start gap-12 border-t border-[var(--color-hairline)]">
            
            {/* Header Block */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-end">
                {/* Left Column: Heading */}
                <FadeInSlideUp className="lg:col-span-7 flex flex-col items-start">
                    <div className="max-w-[700px]">
                        <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight !text-[var(--color-ink)]">
                            Local delivery capability. Specialist international experience.
                        </Text>
                    </div>
                </FadeInSlideUp>

                {/* Right Column: Narrative & Button */}
                <FadeInSlideUp delay={0.1} className="lg:col-span-5 flex flex-col items-start gap-6">
                    <Text variant="body" intent="default" className="text-[var(--color-ink-muted-48)] leading-relaxed lg:max-w-[460px] text-base md:text-lg">
                        PCE Nigeria works in consortium with Lantic on specialist HDD and pipeline delivery, bringing together local operating knowledge, engineering expertise, equipment resources and international project experience.
                    </Text>
                    <Link 
                        href="/capabilities" 
                        className="inline-flex items-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-focus)] text-white text-xs uppercase tracking-wider font-semibold py-3 px-6 rounded-md transition-colors no-underline"
                    >
                        See How We Work
                        <ArrowRight weight="bold" />
                    </Link>
                </FadeInSlideUp>
            </div>

            {/* Bento Grid of Cards */}
            <StaggerContainer className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
                
                {/* Card 1: Wide */}
                <StaggerItem className="lg:col-span-7 relative h-[320px] sm:h-[400px] rounded-xl overflow-hidden group border border-black/5 cursor-pointer">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: 'url("/pictures/company/ob3-wilding-main-pipeline.jpg")' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col gap-2 text-white">
                        <h3 className="!text-[28px] font-bold leading-tight !text-white">
                            Local Operating Knowledge
                        </h3>
                        <p className="text-sm !text-white/80 leading-relaxed max-w-[500px]">
                            Project experience and field resources supporting execution in Nigeria.
                        </p>
                    </div>
                </StaggerItem>

                {/* Card 2: Narrow */}
                <StaggerItem className="lg:col-span-5 relative h-[320px] sm:h-[400px] rounded-xl overflow-hidden group border border-black/5 cursor-pointer">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: 'url("/pictures/company/specialist-enginering.jpg")' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col gap-2 text-white">
                        <h3 className="!text-[28px] font-bold leading-tight !text-white">
                            Specialist HDD Engineering
                        </h3>
                        <p className="text-sm !text-white/80 leading-relaxed">
                            Precision directional drilling for complex riverbed, roadway, and shoreline crossings.
                        </p>
                    </div>
                </StaggerItem>

                {/* Card 3: Narrow */}
                <StaggerItem className="lg:col-span-5 relative h-[320px] sm:h-[400px] rounded-xl overflow-hidden group border border-black/5 cursor-pointer">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: 'url("/pictures/company/integrated-pipeline-epc.jpg")' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col gap-2 text-white">
                        <h3 className="!text-[28px] font-bold leading-tight !text-white">
                            Integrated Pipeline EPC
                        </h3>
                        <p className="text-sm !text-white/80 leading-relaxed">
                            End-to-end execution covering engineering, pipeline fabrication, pre-commissioning, and testing.
                        </p>
                    </div>
                </StaggerItem>

                {/* Card 4: Wide */}
                <StaggerItem className="lg:col-span-7 relative h-[320px] sm:h-[400px] rounded-xl overflow-hidden group border border-black/5 cursor-pointer">
                    <div 
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundImage: 'url("/pictures/company/global-resources.jpg")' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8 z-10 flex flex-col gap-2 text-white">
                        <h3 className="!text-[28px] font-bold leading-tight !text-white">
                            Global Consortium Resources
                        </h3>
                        <p className="text-sm !text-white/80 leading-relaxed max-w-[500px]">
                            Combined equipment fleets, materials logistics, and international project support through the Lantic partnership.
                        </p>
                    </div>
                </StaggerItem>

            </StaggerContainer>

        </section>
    );
};
