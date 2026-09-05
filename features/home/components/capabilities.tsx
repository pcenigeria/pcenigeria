'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Text } from '@/shared/components/ui/text';
import { ArrowRight, ArrowsOut } from '@phosphor-icons/react';
import { FadeInSlideUp, StaggerContainer, StaggerItem } from '@/shared/components/ui/fade-in-slide-up';
import { OverviewLightboxModal, GalleryCategory } from './overview-lightbox-modal';

interface CapabilityCard {
    id: string;
    number: string;
    title: string;
    description: string;
    image: string;
    link: string;
    gallery: GalleryCategory;
}

interface CapabilitiesProps {
    sanityPage?: any;
}

const DEFAULT_CAPABILITIES_LIST: CapabilityCard[] = [
    {
        id: "hdd",
        number: "01",
        title: "Horizontal Directional Drilling",
        description: "Specialist HDD engineering and construction for complex river, road, coastal and hard-ground crossings.",
        image: "/pictures/hero-slider/drilling-rig-cover-photo.jpg",
        link: "/capabilities#hdd",
        gallery: {
            id: "hdd",
            categoryTitle: "Horizontal Directional Drilling (HDD) Capability",
            items: [
                { src: "/pictures/hero-slider/drilling-rig-cover-photo.jpg", title: "1200t / 500t Heavy HDD Drilling Rig System" },
                { src: "/pictures/home-page/ob3-cover-photo.jpg", title: "OB3 River Niger HDD Crossing Project" },
                { src: "/pictures/hero-slider/hdd-02.jpg", title: "River Niger HDD Crossing Site" },
                { src: "/pictures/hero-slider/offshore-hdd-project.jpg", title: "Offshore HDD Project Site Infrastructure" },
                { src: "/pictures/home-page/akk-02.jpg", title: "AKK River Niger HDD Crossing Project" },
                { src: "/pictures/home-page/raoyang-river-hdd.jpg", title: "Raoyang River 2,293m HDD Crossing" }
            ]
        }
    },
    {
        id: "epc",
        number: "02",
        title: "Pipeline EPC",
        description: "Engineering, procurement and construction for pipeline projects, including construction, testing, pre-commissioning and commissioning support.",
        image: "/pictures/hero-slider/pipeline-epc-cover-photo.JPG",
        link: "/capabilities#epc",
        gallery: {
            id: "epc",
            categoryTitle: "52km Pipeline EPC Construction",
            items: [
                { src: "/pictures/hero-slider/pipeline-epc-cover-photo.JPG", title: "52km Pipeline EPC Construction Site" },
                { src: "/pictures/home-page/epc-work-02.jpg", title: "52km Pipeline EPC Operations & Pipe Bending" },
                { src: "/pictures/home-page/epc-work-03.jpg", title: "Pipeline Trenching, Alignment & Stringing" },
                { src: "/pictures/home-page/epc-work-04.jpg", title: "Pipeline Field Operations & Welding" }
            ]
        }
    },
    {
        id: "bpds",
        number: "03",
        title: "BPDS Pipeline Location",
        description: "Three-dimensional location and depth measurement for deeply buried steel pipelines in complex environments.",
        image: "/pictures/hero-slider/bpds-cover-photo.png",
        link: "/capabilities#bpds",
        gallery: {
            id: "bpds",
            categoryTitle: "New Pipeline Location Survey Technique - BPDS",
            items: [
                { src: "/pictures/hero-slider/bpds-cover-photo.png", title: "BPDS 3D Pipeline Location & Depth Survey" },
                { src: "/pictures/hero-slider/bpds-03.png", title: "BPDS Signal Transmitter & Cable Connection" },
                { src: "/pictures/hero-slider/bpds-04.png", title: "Buried Pipeline Sensor Receiver System" },
                { src: "/pictures/hero-slider/bpds-05.png", title: "3D Coordinate & Magnetic Data Processing" },
                { src: "/pictures/hero-slider/bpds-06.png", title: "River Crossing Pipeline Burial Depth Mapping" }
            ]
        }
    },
    {
        id: "support",
        number: "04",
        title: "Equipment & Technical Support",
        description: "HDD rigs, drilling systems, specialist tools, materials and technical field support aligned to project requirements.",
        image: "/pictures/equipment/main-equipments-cover-photo.jpg",
        link: "/capabilities#support",
        gallery: {
            id: "support",
            categoryTitle: "PCE Equipment Yard & Technical Fleet",
            items: [
                { src: "/pictures/equipment/main-equipments-cover-photo.jpg", title: "PCE Main Equipment Yard (Aerial View)" },
                { src: "/pictures/home-page/equipment-02.jpg", title: "Heavy HDD Rigs & Fleet Inventory" },
                { src: "/pictures/home-page/equipment-03.jpg", title: "High-Pressure Mud Pumps & Circulation Units" },
                { src: "/pictures/home-page/equipment-04.jpg", title: "Mud Recycling Systems & Solids Control" },
                { src: "/pictures/home-page/equipment-05.jpg", title: "Specialist HDD Drilling Tools & Reamers" },
                { src: "/pictures/home-page/equipment-06.jpg", title: "Field Excavators & Support Machinery" },
                { src: "/pictures/home-page/equipment-07.jpg", title: "Continuous Electronic Tracking & Guidance Systems" },
                { src: "/pictures/home-page/equipment-08.jpg", title: "PCE Heavy Equipment Maintenance & Logistics Yard" }
            ]
        }
    }
];

export const Capabilities: React.FC<CapabilitiesProps> = ({ sanityPage }) => {
    const [selectedGallery, setSelectedGallery] = useState<GalleryCategory | null>(null);

    const section = sanityPage?.capabilitiesSection;
    const tagline = section?.tagline || 'OUR CAPABILITIES';
    const heading = section?.heading || 'Connected capability across the pipeline crossing lifecycle.';
    const buttonText = section?.buttonText;
    const buttonLink = section?.buttonLink;

    return (
        <section className="w-full bg-[var(--color-canvas)] section flex flex-col items-start gap-20">

            {/* Header Block */}
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-20 items-end">
                {/* Left Column: Heading */}
                <FadeInSlideUp className="lg:col-span-7 flex flex-col items-start">
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
                </FadeInSlideUp>

                {/* Right Column: Narrative */}
                <FadeInSlideUp delay={0.1} className="lg:col-span-5 flex flex-col items-start lg:items-end gap-4 justify-start lg:justify-end">
                    <Text variant="body" intent="default" className="text-[var(--color-ink-muted-48)] leading-relaxed lg:max-w-[420px] text-base md:text-lg">
                        From understanding the route to engineering the crossing and delivering the line, PCE combines four specialist capabilities around complex pipeline projects.
                    </Text>
                    {buttonText && buttonLink && (
                        <Link
                            href={buttonLink}
                            className="inline-flex items-center gap-2 text-[var(--color-primary)] hover:text-[var(--color-accent)] transition-colors text-sm uppercase tracking-wider font-semibold group/link"
                        >
                            {buttonText}
                            <ArrowRight weight="bold" className="text-[var(--color-accent)] group-hover/link:translate-x-1 transition-transform" />
                        </Link>
                    )}
                </FadeInSlideUp>
            </div>

            {/* Bento Grid of Cards */}
            <StaggerContainer className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6">
                {DEFAULT_CAPABILITIES_LIST.map((cap, index) => {
                    const colSpan = (index === 0 || index === 3) 
                        ? 'lg:col-span-7' 
                        : 'lg:col-span-5';

                    return (
                        <StaggerItem key={cap.id} className={`col-span-1 ${colSpan} w-full`}>
                            <div 
                                onClick={() => setSelectedGallery(cap.gallery)}
                                className="relative w-full h-[320px] sm:h-[380px] lg:h-[420px] overflow-hidden rounded-2xl border border-black/10 shadow-sm group cursor-pointer flex flex-col justify-end p-6 sm:p-8 md:p-10 select-none"
                                role="button"
                                tabIndex={0}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        e.preventDefault();
                                        setSelectedGallery(cap.gallery);
                                    }
                                }}
                                aria-label={`View photo gallery for ${cap.title}`}
                            >
                                {/* Background Image */}
                                <div 
                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105"
                                    style={{ backgroundImage: `url("${cap.image}")` }}
                                />
                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10 group-hover:from-black/95 transition-colors duration-500" />
                                
                                {/* Expand Gallery Badge */}
                                <div className="absolute top-5 right-5 z-10 flex items-center gap-1.5 bg-black/50 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full text-xs font-medium text-white/80 group-hover:text-white group-hover:bg-[var(--color-accent)] group-hover:text-black group-hover:border-transparent transition-all duration-300">
                                    <span>View Gallery ({cap.gallery.items.length})</span>
                                    <ArrowsOut size={14} weight="bold" />
                                </div>

                                {/* Content Overlay (Title + Number + Icon) */}
                                <div className="relative z-10 flex flex-col items-start gap-3 w-full">
                                    <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-accent)]">
                                        {cap.number}
                                    </span>
                                    <div className="flex items-end justify-between w-full gap-4">
                                        <h3 className="!text-[22px] sm:!text-[28px] lg:!text-[32px] font-extrabold text-white leading-tight group-hover:text-[var(--color-accent)] transition-colors max-w-[480px]">
                                            {cap.title}
                                        </h3>
                                        <Link 
                                            href={cap.link} 
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shrink-0 group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)] group-hover:translate-x-0.5 transition-all duration-300"
                                            title={`Explore ${cap.title}`}
                                        >
                                            <ArrowRight size={20} weight="bold" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </StaggerItem>
                    );
                })}
            </StaggerContainer>

            {/* Lightbox Modal */}
            <OverviewLightboxModal
                isOpen={selectedGallery !== null}
                onClose={() => setSelectedGallery(null)}
                gallery={selectedGallery}
            />

        </section>
    );
};
