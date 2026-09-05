import React from 'react';
import { Text } from '@/shared/components/ui/text';
import { FadeInSlideUp, StaggerContainer, StaggerItem } from '@/shared/components/ui/fade-in-slide-up';

interface WhatWorksProps {
    sanityPage?: any;
}

export const WhatWorks: React.FC<WhatWorksProps> = ({ sanityPage }) => {
    const tagline = sanityPage?.gridSection?.tagline || 'WHAT CONNECTS THE WORK';
    const heading = sanityPage?.gridSection?.heading || 'Different routes. The same engineering discipline.';

    const stats = [
        {
            title: "Specialist Engineering",
            label: "Crossing methods shaped around pipeline requirements, geology and route constraints.",
            image: "/pictures/company/specialist-enginering.jpg"
        },
        {
            title: "Appropriate Equipment",
            label: "Rig, guidance, drilling-fluid and support systems configured around the technical demands of the work.",
            image: "/pictures/equipment/main-equipments-cover-photo.jpg"
        },
        {
            title: "Coordinated Execution",
            label: "Engineering, equipment, field operations, safety and quality brought together around the crossing.",
            image: "/pictures/hero-slider/ob3-construction-team.jpg"
        },
        {
            title: "Experience Carried Forward",
            label: "Lessons from complex projects informing engineering and execution decisions on the next route.",
            image: "/pictures/capabilities/handover.jpg"
        }
    ];

    return (
        <section className="w-full bg-[var(--color-surface-tile-1)] section border-t border-[var(--color-surface-tile-3)]">
            <div className="w-full flex flex-col items-start gap-20">
                
                {/* Heading Block */}
                <FadeInSlideUp className="flex flex-col items-start">
                    {/* Tagline */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 mb-6">
                        <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                        <span className="text-sm uppercase tracking-wider text-canvas-tint font-semibold">
                            {tagline}
                        </span>
                    </div>

                    {/* Headline */}
                    <div className="max-w-[1000px]">
                        <Text variant="display-lg" as="h2" intent="inverse" className="!font-extrabold leading-tight">
                            {heading}
                        </Text>
                    </div>
                </FadeInSlideUp>

                {/* Stats Cards Grid */}
                <StaggerContainer className="w-full grid grid-cols-1 md:grid-cols-4 gap-6">
                    {stats.map((stat, index) => (
                        <StaggerItem
                            key={index}
                            className="relative overflow-hidden rounded-lg min-h-[400px] flex flex-col justify-end p-8 group cursor-default"
                        >
                            {/* Background Image */}
                            <div 
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                style={{ backgroundImage: `url("${stat.image}")` }}
                            />
                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/45 to-black/10" />
                            
                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-start">
                                <h3 className="!text-[24px] font-extrabold mb-3 leading-tight text-canvas-tint">
                                    {stat.title}
                                </h3>
                                <Text variant="body" intent="muted-dark" className="leading-relaxed text-sm">
                                    {stat.label}
                                </Text>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>

            </div>
        </section>
    );
};
