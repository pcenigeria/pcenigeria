'use client';

import React from 'react';
import Link from 'next/link';
import { Text } from '@/shared/components/ui/text';
import { ArrowRight } from '@phosphor-icons/react';
import { FadeInSlideUp, StaggerContainer, StaggerItem } from '@/shared/components/ui/fade-in-slide-up';

interface FeaturedProjectStat {
    value: string;
    label: string;
}

interface FeaturedProjectItem {
    id: string;
    eyebrow: string;
    heading: React.ReactNode;
    subheading: string;
    body: React.ReactNode;
    image: string;
    ctaLabel: string;
    ctaHref: string;
    stats: FeaturedProjectStat[];
}

const DEFAULT_FEATURED_PROJECTS: FeaturedProjectItem[] = [
    {
        id: 'ob3',
        eyebrow: 'FEATURED PROJECTS • OB3 & AKK RIVER NIGER HDD CROSSINGS',
        heading: (
            <>Across the River Niger. <span className="text-[var(--color-accent)]">2 km beneath a critical crossing.</span></>
        ),
        subheading: 'A CRITICAL BOTTLENECK ON A 130 KM GAS PIPELINE.',
        body: (
            <><span className="font-extrabold">Completed April 2026</span>, PCE executed the River Niger HDD crossing on the OB3 Gas Pipeline between Ndoni, Rivers State, and Aboh, Delta State, through complex sand, gravel and rock strata.</>
        ),
        image: '/pictures/case-study/ob3/ob3-bento-1.jpg',
        ctaLabel: 'EXPLORE THE OB3 PROJECT',
        ctaHref: '/projects/ob3-river-niger',
        stats: [
            { value: '2 km', label: 'HDD crossing' },
            { value: '48 in', label: 'Pipeline diameter' },
        ],
    },
    {
        id: 'akk',
        eyebrow: 'AKK RIVER NIGER HDD CROSSING',
        heading: (
            <>The AKK Gas Pipeline. <span className="text-[var(--color-accent)]">1.565 km beneath the River Niger.</span></>
        ),
        subheading: 'WHEN THE CROSSING IS CRITICAL, EXECUTION MATTERS.',
        body: (
            <><span className="font-extrabold">Completed July 2025</span>, PCE completed the specialist HDD crossing for the 40-inch AKK gas pipeline beneath the River Niger through complex sand, gravel and rock strata.</>
        ),
        image: '/pictures/case-study/akk/akk-bento-1.jpg',
        ctaLabel: 'EXPLORE THE AKK PROJECT',
        ctaHref: '/projects/akk-river-niger',
        stats: [
            { value: '1.565 km', label: 'HDD crossing' },
            { value: '40 in', label: 'Pipeline diameter' },
        ],
    },
];

interface FeaturedProjectProps {
    sanityPage?: any;
}

export const FeaturedProject: React.FC<FeaturedProjectProps> = ({ sanityPage }) => {
    const section = sanityPage?.featuredSection;
    const tagline = section?.tagline || 'FEATURED PROJECTS • OB3 & AKK RIVER NIGER HDD CROSSINGS';
    const heading = section?.heading || 'Across the River Niger. 2 km beneath a critical crossing.';
    const buttonText = section?.buttonText;
    const buttonLink = section?.buttonLink;

    const projects: FeaturedProjectItem[] = React.useMemo(() => {
        const sanityProjects = sanityPage?.featuredProjects;
        if (!sanityProjects || sanityProjects.length === 0) return DEFAULT_FEATURED_PROJECTS;

        return sanityProjects.map((project: any, idx: number) => {
            const fallback = DEFAULT_FEATURED_PROJECTS[idx % DEFAULT_FEATURED_PROJECTS.length];
            return {
                id: project.slug || fallback.id,
                eyebrow: project.tagline || fallback.eyebrow,
                heading: project.title || fallback.heading,
                subheading: project.tagline || fallback.subheading,
                body: project.intro || fallback.body,
                image: project.heroImage || fallback.image,
                ctaLabel: `EXPLORE THE ${project.title || 'PROJECT'}`.toUpperCase(),
                ctaHref: project.slug ? `/projects/${project.slug}` : fallback.ctaHref,
                stats: fallback.stats,
            };
        });
    }, [sanityPage]);

    return (
        <section className="w-full min-h-screen bg-[var(--color-canvas-tint)] section flex flex-col items-start gap-12 border-t border-[var(--color-hairline)]">

            {/* Header Block */}
            <FadeInSlideUp className="w-full flex flex-col items-start">
                {/* Tagline */}
                <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 mb-6">
                    <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                    <span className="text-sm uppercase tracking-wider text-[var(--color-primary)] font-semibold">
                        {tagline}
                    </span>
                </div>

                {/* Headline */}
                <div className="max-w-[900px] flex flex-col gap-4">
                    <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight">
                        {heading}
                    </Text>
                    {buttonText && buttonLink && (
                        <Link
                            href={buttonLink}
                            className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors text-sm uppercase tracking-wider font-semibold group/link w-fit"
                        >
                            {buttonText}
                            <ArrowRight weight="bold" className="text-[var(--color-accent)] group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </div>
            </FadeInSlideUp>

            {projects.map((project, index) => (
                <React.Fragment key={project.id}>
                    {index > 0 && (
                        <>
                            <div className="w-full h-[1px] bg-[var(--color-hairline)]" />
                            <FadeInSlideUp className="w-full flex flex-col items-start gap-4">
                                <span className="text-sm uppercase tracking-wider text-[var(--color-primary)] font-semibold">
                                    {project.eyebrow}
                                </span>
                                <div className="max-w-[900px]">
                                    <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight">
                                        {project.heading}
                                    </Text>
                                </div>
                            </FadeInSlideUp>
                        </>
                    )}

                    {/* Standalone Featured Image */}
                    <FadeInSlideUp delay={0.1} className="w-full h-[300px] md:h-[500px] relative overflow-hidden rounded-xl group border border-black/5">
                        <div
                            className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-102"
                            style={{ backgroundImage: `url("${project.image}")` }}
                        />
                        <div className="absolute inset-0 bg-black/5" />
                    </FadeInSlideUp>

                    {/* Two-Column Details Layout */}
                    <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

                        {/* Left Column: Narrative */}
                        <FadeInSlideUp delay={0.05} className="lg:col-span-7 flex flex-col items-start gap-8 max-w-[600px]">
                            <div className="flex flex-col gap-4">
                                <span className="text-base uppercase tracking-wider text-[var(--color-ink-muted-48)] font-semibold">
                                    {project.subheading}
                                </span>
                                <Text variant="lead-airy" intent="default" className="!text-[24px] leading-relaxed">
                                    {project.body}
                                </Text>
                            </div>

                            {/* CTA Link */}
                            <div className="flex items-center">
                                <Link
                                    href={project.ctaHref}
                                    className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors text-sm uppercase tracking-wider font-semibold group/link"
                                >
                                    {project.ctaLabel}
                                    <ArrowRight weight="bold" className="text-[var(--color-accent)] group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </FadeInSlideUp>

                        {/* Right Column: Stacked Stats */}
                        <StaggerContainer delayStart={0.1} className="lg:col-span-5 flex flex-col gap-6 justify-center">
                            {project.stats.map((stat, statIndex) => (
                                <React.Fragment key={stat.label}>
                                    {statIndex > 0 && <div className="w-full h-[1px] bg-[var(--color-hairline)]" />}
                                    <StaggerItem className="flex flex-col items-start gap-1">
                                        <Text variant="display-md" className="font-extrabold text-[var(--color-accent)] leading-none !text-[32px] md:!text-[40px]">
                                            {stat.value}
                                        </Text>
                                        <span className="text-base text-[var(--color-ink)] opacity-70">
                                            {stat.label}
                                        </span>
                                    </StaggerItem>
                                </React.Fragment>
                            ))}
                        </StaggerContainer>

                    </div>
                </React.Fragment>
            ))}

        </section>
    );
};
