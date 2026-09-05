'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Text } from '@/shared/components/ui/text';
import { Button } from '@/shared/components/ui/button';
import { FadeInSlideUp } from '@/shared/components/ui/fade-in-slide-up';
import { ArrowRight, CaretLeft, CaretRight, Pause, Play } from '@phosphor-icons/react';

interface HeroSlide {
    src: string;
    alt: string;
}

interface HomeHeroProps {
    sanityPage?: any;
}

const DEFAULT_HERO_SLIDES: HeroSlide[] = [
    { src: "/pictures/hero-slider/ob3-construction-team.jpg", alt: "OB3 River Niger HDD Crossing Completion Team" },
    { src: "/pictures/hero-slider/akk-cover-photo.jpg", alt: "AKK Pipeline Crossing Project" },
    { src: "/pictures/hero-slider/drilling-rig-cover-photo.jpg", alt: "Heavy HDD Rig Land-to-Sea Crossing" },
    { src: "/pictures/hero-slider/drilling-rig-03.jpg", alt: "HDD Drilling Rig Operations & High-Pressure Mud Line" },
    { src: "/pictures/hero-slider/offshore-hdd-project.jpg", alt: "Offshore HDD Project Operations" },
    { src: "/pictures/hero-slider/highlight.jpg", alt: "HDD Site Setup & Fluid Equipment Inventory" },
    { src: "/pictures/hero-slider/pipeline-epc-cover-photo.JPG", alt: "52km Pipeline EPC Construction Site" },
    { src: "/pictures/hero-slider/ob3-cover-photo.jpg", alt: "OB3 River Niger Crossing Site" },
    { src: "/pictures/hero-slider/on-river.jpg", alt: "Trenchless HDD River Crossing" },
    { src: "/pictures/hero-slider/warehouse-story-yard.jpg", alt: "PCE Warehouse & Materials Yard" },
];

const DEFAULT_BULLETS = [
    "Excellent HDD construction capability",
    "Professional HDD drilling fluid scheme design and product supply capability",
    "Comprehensive pipeline EPC construction capability",
    "Deep buried pipeline detection capability",
];

export const HomeHero: React.FC<HomeHeroProps> = ({ sanityPage }) => {
    const heroSlides: HeroSlide[] = React.useMemo(() => {
        const items = sanityPage?.heroSlides?.items;
        if (!items || items.length === 0) return DEFAULT_HERO_SLIDES;
        return items.map((item: any) => ({
            src: item.src || DEFAULT_HERO_SLIDES[0].src,
            alt: item.title || item.description || 'PCE Nigeria HDD Project',
        }));
    }, [sanityPage]);

    const bullets: string[] = sanityPage?.heroBullets?.length ? sanityPage.heroBullets : DEFAULT_BULLETS;
    const primaryBtnText = sanityPage?.heroPrimaryBtnText || 'Explore Our Capabilities';
    const primaryBtnLink = sanityPage?.heroPrimaryBtnLink || '/capabilities';
    const secondaryBtnText = sanityPage?.heroSecondaryBtnText || 'Start a Project';
    const secondaryBtnLink = sanityPage?.heroSecondaryBtnLink || '/contact';

    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const handleNext = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, [heroSlides.length]);

    const handlePrev = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    }, [heroSlides.length]);

    useEffect(() => {
        if (!isPlaying || isHovered) return;
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [isPlaying, isHovered, handleNext]);

    const togglePlay = () => setIsPlaying((prev) => !prev);

    const activeSlide = heroSlides[currentSlide] || heroSlides[0];

    return (
        <section 
            className="relative w-full min-h-screen flex items-end overflow-hidden bg-[var(--bg-tile-dark)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Home Hero Showcase"
        >
            {/* Background Image Slider */}
            <div className="absolute inset-0 z-0 overflow-hidden bg-[var(--bg-tile-dark)]">
                <AnimatePresence mode="popLayout">
                    <motion.div
                        key={currentSlide}
                        initial={{ opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 0.65, scale: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: [0.25, 1, 0.5, 1] }}
                        className="absolute inset-0 w-full h-full"
                    >
                        <Image
                            src={activeSlide.src}
                            alt={activeSlide.alt}
                            fill
                            priority={currentSlide === 0}
                            quality={85}
                            sizes="100vw"
                            className="object-cover object-center pointer-events-none"
                        />
                    </motion.div>
                </AnimatePresence>

                {/* Gradient Overlay for Optimal Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-tile-dark)] via-[var(--bg-tile-dark)]/50 to-black/30 pointer-events-none" />
            </div>

            {/* Content Container */}
            <div className="relative z-[var(--z-elevate)] w-full px-[var(--section-pad-x)] pt-32 pb-24 md:pb-[12vh] lg:pb-[15vh] flex flex-col items-start">
                
                {/* Headline */}
                <FadeInSlideUp aboveFold delay={0} className="max-w-[1000px] mb-6">
                    <Text variant="hero" intent="inverse">
                        {sanityPage?.heroHeadline || (
                            <>
                                <span className="text-[var(--color-accent)]">HDD</span> Crossing.<br />
                                EPC for Pipeline.
                            </>
                        )}
                    </Text>
                </FadeInSlideUp>

                {/* Sub-headline: Capability list */}
                <FadeInSlideUp aboveFold delay={0.15} className="max-w-[800px] mb-10">
                    <ul className="flex flex-col gap-2.5 !list-none !pl-0 !m-0">
                        {bullets.map((item) => (
                            <li key={item} className="flex items-start gap-3">
                                <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                                <Text variant="lead-airy" intent="inverse" className="!text-[16px] md:!text-[20px] !leading-relaxed">
                                    {item}
                                </Text>
                            </li>
                        ))}
                    </ul>
                </FadeInSlideUp>

                {/* Buttons Row & Slider Controls Bar */}
                <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <FadeInSlideUp aboveFold delay={0.3} className="flex flex-wrap gap-4">
                        <Button variant="primary" href={primaryBtnLink} rightIcon={<ArrowRight weight="bold" aria-hidden="true" />}>
                            {primaryBtnText}
                        </Button>

                        <Button variant="tertiary" href={secondaryBtnLink} rightIcon={<ArrowRight weight="bold" aria-hidden="true" />}>
                            {secondaryBtnText}
                        </Button>
                    </FadeInSlideUp>

                    {/* Slider Navigation & Counter Controls */}
                    <FadeInSlideUp aboveFold delay={0.4} className="flex flex-col items-start md:items-end gap-2">
                        <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full">
                            <button
                                onClick={togglePlay}
                                className="p-1.5 text-white/70 hover:text-white transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                title={isPlaying ? "Pause auto-slide" : "Play auto-slide"}
                                aria-label={isPlaying ? "Pause auto-slide" : "Play auto-slide"}
                            >
                                {isPlaying ? <Pause size={16} weight="bold" /> : <Play size={16} weight="bold" />}
                            </button>

                            <div className="h-3 w-[1px] bg-white/20" />

                            <span className="text-xs font-mono text-white/90 tracking-wider min-w-[50px] text-center">
                                {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
                            </span>

                            <div className="h-3 w-[1px] bg-white/20" />

                            <div className="flex items-center gap-1">
                                <button
                                    onClick={handlePrev}
                                    className="p-1.5 text-white/70 hover:text-white transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    title="Previous Slide"
                                    aria-label="Previous Slide"
                                >
                                    <CaretLeft size={18} weight="bold" />
                                </button>

                                <button
                                    onClick={handleNext}
                                    className="p-1.5 text-white/70 hover:text-white transition-colors rounded-full focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    title="Next Slide"
                                    aria-label="Next Slide"
                                >
                                    <CaretRight size={18} weight="bold" />
                                </button>
                            </div>
                        </div>
                    </FadeInSlideUp>
                </div>
            </div>
        </section>
    );
};



