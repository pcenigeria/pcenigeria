'use client';

import React, { useState } from 'react';
import { PortableText } from '@portabletext/react';
import { Text } from '@/shared/components/ui/text';
import { FadeInSlideUp } from '@/shared/components/ui/fade-in-slide-up';

import Link from 'next/link';
import { ProjectListItem } from '../types/project.types';

interface ProjectItem {
    id: string;
    slug: string;
    tagline: string;
    title: string;
    description: string;
    image: string;
    scopes: ('nigeria' | 'thailand' | 'china' | 'bpds')[];
}

const DEFAULT_PROJECTS: ProjectItem[] = [
    {
        id: "niger-river",
        slug: "akk-river-niger",
        tagline: "1.565 KM BENEATH THE RIVER NIGER",
        title: "AKK River Niger Crossing.",
        description: "PCE completed the specialist HDD crossing for the 40-inch AKK gas pipeline beneath the River Niger through mixed sand, gravel and rock strata.",
        image: "/pictures/case-study/akk/akk-bento-1.jpg",
        scopes: ["nigeria"]
    },
    {
        id: "escravos-crossing",
        slug: "ob3-river-niger",
        tagline: "2 KM BENEATH THE RIVER NIGER",
        title: "OB3 River Niger Crossing.",
        description: "PCE executed the River Niger HDD crossing on the OB3 Gas Pipeline between Ndoni in Rivers State and Aboh in Delta State. The crossing combined a 48-inch pipeline, approximately 2 km of HDD and complex sand, gravel and rock strata.",
        image: "/pictures/case-study/ob3/ob3-bento-1.jpg",
        scopes: ["nigeria"]
    },
    {
        id: "chao-phraya",
        slug: "two-major-gas-crossings",
        tagline: "THAILAND · BANG PAKONG",
        title: "Two major gas crossings.",
        description: "Two steel gas-pipeline crossings through clay and sand.",
        image: "/pictures/home-page/pipeline-new.jpg",
        scopes: ["thailand"]
    },
    {
        id: "imiringi-creek",
        slug: "five-parallel-crossings",
        tagline: "GUANGDONG, CHINA",
        title: "Five parallel offshore crossings.",
        description: "Five parallel HDD crossings for steel gas pipelines through clay, sand and rock.",
        image: "/pictures/case-study/zhanjiang-offshore/cover-photo.jpg",
        scopes: ["china"]
    },
    {
        id: "yangtze-river",
        slug: "raoyang-river-crossing",
        tagline: "RAOYANG RIVER, CHINA",
        title: "2,293 metres across the river.",
        description: "A large-diameter gas-pipeline crossing through sand and gravel strata.",
        image: "/pictures/case-study/raoyang-river/cover-photo.jpg",
        scopes: ["china"]
    },
    {
        id: "ajaokuta-crossing",
        slug: "zhanjiang-crossing",
        tagline: "ZHANJIANG, CHINA",
        title: "4,060 metres through gravel and sand.",
        description: "A long-distance intersecting HDD crossing executed using 600-ton and 500-ton rigs.",
        image: "/pictures/case-study/guangong-china/cover-photo.jpg",
        scopes: ["china"]
    },
    {
        id: "bonny-island",
        slug: "pipeline-epc-thailand",
        tagline: "THAILAND · SRB–NBPT LINK LINE",
        title: "52 km of pipeline EPC.",
        description: "Pipeline EPC from Saraburi to Ang Thong Province, including extensive continuous HDD.",
        image: "/pictures/company/company-hero.jpg",
        scopes: ["thailand"]
    }
];

const DEFAULT_TAGLINE = 'FEATURED PROJECTS';
const DEFAULT_HEADING = 'Difficult Routes Demand More Than Standard Execution.';
const DEFAULT_NARRATIVE = 'Our project record combines specialist engineering, high-capacity equipment, field experience and technical methods shaped around the conditions of each crossing.';

const narrativeBodyComponents = {
    block: {
        normal: ({ children }: any) => <p>{children}</p>,
    },
};

interface FeaturedProjectsProps {
    sanityProjects?: ProjectListItem[];
    sanityPage?: any;
}

export const FeaturedProjects: React.FC<FeaturedProjectsProps> = ({ sanityProjects, sanityPage }) => {
    const allProjects: ProjectItem[] = React.useMemo(() => {
        if (!sanityProjects || sanityProjects.length === 0) return DEFAULT_PROJECTS;

        return sanityProjects.map((project) => {
            const scopes: ProjectItem['scopes'] = [];
            const countryScope = project.country?.toLowerCase();
            if (countryScope === 'nigeria' || countryScope === 'thailand' || countryScope === 'china') {
                scopes.push(countryScope);
            }
            if (project.isBpds) {
                scopes.push('bpds');
            }

            return {
                id: project._id,
                slug: project.slug,
                tagline: project.tagline || '',
                title: project.title,
                description: project.intro || '',
                image: project.heroImage || '',
                scopes,
            };
        });
    }, [sanityProjects]);

    const featuredSection = sanityPage?.featuredSection;
    const tagline = featuredSection?.tagline || DEFAULT_TAGLINE;
    const heading = featuredSection?.heading || DEFAULT_HEADING;
    const hasNarrative = Array.isArray(featuredSection?.body) && featuredSection.body.length > 0;

    interface TabItem {
        id: string;
        name: string;
        description?: string;
        subtext?: string;
    }

    const tabs: TabItem[] = [
        { id: "all", name: "All" },
        {
            id: "nigeria",
            name: "Nigeria",
            description: "Serving Nigeria's national gas masterplan and swamp production grids.",
            subtext: "Delivering critical river crossings and shoreline pipeline installations under difficult tropical delta geology."
        },
        {
            id: "thailand",
            name: "Thailand",
            description: "Major gas crossings and pipeline EPC in Thailand.",
            subtext: "Delivering long-distance HDD crossings and comprehensive pipeline construction across complex regional terrain."
        },
        {
            id: "china",
            name: "China",
            description: "Major river crossings and complex geological drilling in China.",
            subtext: "PCE's extensive track record includes large-diameter river crossings across challenging rock, gravel and silt strata."
        },
        {
            id: "bpds",
            name: "BPDS Construction Work",
            description: "Deeply Buried Pipeline Detection & Construction Support.",
            subtext: "Case studies and project records for BPDS pipeline location and specialized construction work are currently being prepared."
        }
    ];

    const [activeTab, setActiveTab] = useState<string>("all");

    const handleTabChange = (tabId: string) => {
        setActiveTab(tabId);
    };

    const activeTabInfo = tabs.find(t => t.id === activeTab);

    const filteredProjects = allProjects.filter((project) => {
        if (activeTab === "all") return true;
        return project.scopes.includes(activeTab as ProjectItem['scopes'][number]);
    });

    return (
        <section className="w-full bg-[var(--color-canvas)] section flex flex-col items-start gap-12 !px-0 md:!px-[var(--section-pad-x)]">

            {/* Header Block */}
            <div className="w-full px-5 md:px-0 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-end">
                {/* Left Column: Heading */}
                <div className="lg:col-span-7 flex flex-col items-start">
                    {/* Tagline */}
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-2 md:gap-3 mb-6">
                        <span className="w-6 h-[3px] bg-[var(--color-accent)] inline-block" />
                        <span className="text-sm uppercase tracking-wider text-[var(--color-primary)] font-semibold">
                            {tagline}
                        </span>
                    </div>

                    {/* Headline */}
                    <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight">
                        {heading}
                    </Text>
                </div>

                {/* Right Column: Narrative */}
                <div className="lg:col-span-5 flex justify-start lg:justify-end">
                    <div className="lg:max-w-[460px] w-full flex flex-col gap-4">
                        <div className="text-[var(--color-ink-muted-48)] leading-relaxed text-base md:text-lg">
                            {hasNarrative ? (
                                <PortableText value={featuredSection.body} components={narrativeBodyComponents} />
                            ) : (
                                <Text variant="body" intent="default" className="text-[var(--color-ink-muted-48)] leading-relaxed text-base md:text-lg">
                                    {DEFAULT_NARRATIVE}
                                </Text>
                            )}
                        </div>

                        <div className="flex items-center gap-4 text-xs font-bold tracking-wider uppercase text-[var(--color-primary)] mt-1">
                            <span>Nigeria</span>
                            <span className="h-4 w-[1px] bg-[var(--color-primary)]/20 inline-block" />
                            <span>Thailand</span>
                            <span className="h-4 w-[1px] bg-[var(--color-primary)]/20 inline-block" />
                            <span>China</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tab Bar */}
            <div className="w-full flex flex-row flex-nowrap overflow-x-auto gap-3 pb-3 px-5 md:px-0 md:flex-wrap md:overflow-visible [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={`px-6 py-3 rounded-lg text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                            activeTab === tab.id
                                ? 'bg-[var(--color-primary)] text-white shadow-sm'
                                : 'border border-[var(--color-primary)]/20 text-[var(--color-primary)] hover:bg-[var(--color-primary)]/5'
                        }`}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            {/* Conditional Category Heading & Subtext Group */}
            {(activeTabInfo?.description || activeTabInfo?.subtext) && (
                <div className="flex flex-col gap-4 px-5 md:px-0 mt-4">
                    {activeTabInfo.description && (
                        <h3 className="!text-[28px] !font-normal text-[var(--color-ink-muted-48)] leading-tight max-w-[600px]">
                            {activeTabInfo.description}
                        </h3>
                    )}
                    {activeTabInfo.subtext && (
                        <p className="text-base text-[var(--color-ink-muted-48)] leading-relaxed max-w-[600px]">
                            {activeTabInfo.subtext}
                        </p>
                    )}
                </div>
            )}

            {/* Content Area: Grid of All Projects or Empty State */}
            {filteredProjects.length === 0 ? (
                <div className="w-full px-5 md:px-0 mt-8">
                    <div className="w-full py-16 px-8 md:px-12 flex flex-col items-start gap-4 rounded-2xl bg-black/[0.02] border border-black/5">
                        <span className="text-xs font-bold uppercase tracking-wider text-[var(--color-accent)]">
                            Project Documentation in Progress
                        </span>
                        <h4 className="text-xl md:text-2xl font-bold text-[var(--color-primary)]">
                            BPDS Project Case Studies
                        </h4>
                        <p className="text-sm md:text-base text-[var(--color-ink-muted-48)] max-w-[600px] leading-relaxed">
                            Detailed project records, depth profiles, and 3D positioning execution reports for our BPDS (Buried Pipeline Detection System) operations are being compiled and will be available shortly.
                        </p>
                        <Link
                            href="/capabilities#bpds"
                            className="inline-flex items-center gap-2 text-sm font-bold text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors mt-2"
                        >
                            Explore BPDS Capability Overview →
                        </Link>
                    </div>
                </div>
            ) : (
                /* Balanced 2-Column Grid Layout Showing All Projects */
                <div className="w-full px-5 md:px-0 mt-8">
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-10 gap-y-16 items-start">
                        {filteredProjects.map((item) => (
                            <FadeInSlideUp key={item.id} className="w-full">
                                <Link
                                    href={`/projects/${item.slug}`}
                                    className="w-full flex flex-col items-start gap-5 no-underline group"
                                >
                                    {/* Image Frame */}
                                    <div className="w-full aspect-[16/10] relative rounded-xl overflow-hidden bg-black/5 cursor-pointer border border-black/5">
                                        <div
                                            className="absolute inset-0 bg-cover bg-center transition-all duration-[800ms] ease-out group-hover:scale-105 filter grayscale group-hover:grayscale-0"
                                            style={{ backgroundImage: `url("${item.image}")` }}
                                        />
                                    </div>

                                    {/* Info block underneath */}
                                    <div className="flex flex-col items-start gap-2 text-left w-full">
                                        <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)] group-hover:text-[var(--color-accent)] transition-colors">
                                            {item.tagline}
                                        </span>
                                        <h4 className="text-xl sm:text-2xl font-semibold text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                                            {item.title}
                                        </h4>
                                        <p className="text-sm text-[var(--color-ink-muted-48)] leading-relaxed line-clamp-3">
                                            {item.description}
                                        </p>
                                    </div>
                                </Link>
                            </FadeInSlideUp>
                        ))}
                    </div>
                </div>
            )}

        </section>
    );
};
