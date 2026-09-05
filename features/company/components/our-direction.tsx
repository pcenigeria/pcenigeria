'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Text } from '@/shared/components/ui/text';

const LINE_HEIGHT = 600;

const DEFAULT_TAGLINE = 'Our Direction';
const DEFAULT_HEADING = 'Engineering excellence with a clear ambition.';
const DEFAULT_VISION_TEXT = 'To become a globally recognised leader in HDD and pipeline EPC, known for engineering excellence, safe delivery and sustainable practice.';
const DEFAULT_MISSION_TEXT = 'To provide dependable engineering and construction solutions that exceed client expectations through innovation, efficiency and integrity.';

interface OurDirectionProps {
    section?: any;
}

export const OurDirection: React.FC<OurDirectionProps> = ({ section }) => {
    const timelineRef = useRef<HTMLDivElement>(null);
    const [fillHeight, setFillHeight] = useState(0);

    const tagline = section?.tagline || DEFAULT_TAGLINE;
    const heading = section?.heading || DEFAULT_HEADING;
    const visionText = section?.bullets?.[0] || DEFAULT_VISION_TEXT;
    const missionText = section?.bullets?.[1] || DEFAULT_MISSION_TEXT;

    useEffect(() => {
        const handleScroll = () => {
            if (!timelineRef.current) return;
            const rect = timelineRef.current.getBoundingClientRect();
            const windowHeight = window.innerHeight;

            // Section starts animating when top hits the bottom of viewport
            // Section ends animating when bottom hits the bottom of viewport
            const start = rect.top - windowHeight;
            const end = rect.bottom - windowHeight;
            const total = end - start;

            const progress = Math.min(Math.max(-start / total, 0), 1);
            setFillHeight(progress * LINE_HEIGHT);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // run once on mount
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <section className="w-full bg-[#052237] section flex flex-col items-center gap-12 border-t border-[var(--color-primary-dark)]">
            
            {/* Centered Heading Block */}
            <div className="w-full flex flex-col items-center">
                {/* Tagline */}
                <div className="flex items-center justify-center gap-2 mb-6">
                    <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                    <span className="text-sm uppercase tracking-wider text-white/80 font-semibold">
                        {tagline}
                    </span>
                </div>

                {/* Headline */}
                <div className="max-w-[800px] text-center mx-auto">
                    <Text variant="display-lg" as="h2" intent="inverse" className="!font-extrabold leading-tight text-center">
                        {heading}
                    </Text>
                </div>
            </div>

            {/* Timeline Area */}
            <div ref={timelineRef} className="w-full relative max-w-[1200px] mt-10 px-4 lg:px-0 pt-16 pb-24">
                {/* Dashed Track Line (background) */}
                <div className="absolute left-4 lg:left-1/2 top-10 h-[600px] w-[2px] border-l-2 border-dashed border-white/20 -translate-x-1/2 z-0" />

                {/* Solid Fill Line (scroll-driven, foreground) */}
                <div
                    className="absolute left-4 lg:left-1/2 top-10 w-[2px] -translate-x-1/2 z-1 transition-none"
                    style={{
                        height: `${fillHeight}px`,
                        background: 'var(--color-accent)',
                        maxHeight: `${LINE_HEIGHT}px`,
                    }}
                />

                <div className="flex flex-col lg:gap-[360px] gap-28 relative z-10">
                    
                    {/* Vision Row (Content Left on Desktop, Right of Line on Mobile) */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
                        {/* Mobile left-line spacer / Desktop dot container */}
                        <div className="absolute left-4 lg:left-1/2 top-3 -translate-x-1/2 z-20 flex items-center justify-center w-4 h-4">
                            <span className="w-4 h-4 rounded-full bg-[var(--color-accent)] relative flex items-center justify-center">
                                <span className="absolute inset-0 rounded-full bg-[var(--color-accent)] animate-ping opacity-75" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] z-10" />
                            </span>
                        </div>

                        {/* Vision Content Card */}
                        <div className="pl-12 lg:pl-0 lg:col-span-5 lg:text-right flex flex-col items-start lg:items-end gap-3">
                            {/* Tagline */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs uppercase tracking-wider text-[var(--color-accent)] font-extrabold">
                                    Our Vision
                                </span>
                            </div>
                            
                            {/* Headline (24px) */}
                            <Text variant="lead-airy" intent="inverse" className="!text-[24px] !font-normal leading-relaxed lg:text-right text-left max-w-[500px]">
                                {visionText}
                            </Text>
                        </div>

                        {/* Right column empty on Desktop */}
                        <div className="hidden lg:block lg:col-span-7" />
                    </div>

                    {/* Mission Row (Content Right on Desktop, Right of Line on Mobile) */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative">
                        {/* Mobile left-line spacer / Desktop dot container */}
                        <div className="absolute left-4 lg:left-1/2 top-3 -translate-x-1/2 z-20 flex items-center justify-center w-4 h-4">
                            <span className="w-4 h-4 rounded-full bg-[var(--color-accent)] relative flex items-center justify-center">
                                <span className="absolute inset-0 rounded-full bg-[var(--color-accent)] animate-ping opacity-75" />
                                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-accent)] z-10" />
                            </span>
                        </div>

                        {/* Left column empty on Desktop */}
                        <div className="hidden lg:block lg:col-span-7" />

                        {/* Mission Content Card */}
                        <div className="pl-12 lg:pl-0 lg:col-span-5 flex flex-col items-start gap-3">
                            {/* Tagline */}
                            <div className="flex items-center gap-3">
                                <span className="text-xs uppercase tracking-wider text-[var(--color-accent)] font-extrabold">
                                    Our Mission
                                </span>
                            </div>
                            
                            {/* Headline (24px) */}
                            <Text variant="lead-airy" intent="inverse" className="!text-[24px] !font-normal leading-relaxed text-left max-w-[500px]">
                                {missionText}
                            </Text>
                        </div>
                    </div>

                </div>
            </div>

        </section>
    );
};
