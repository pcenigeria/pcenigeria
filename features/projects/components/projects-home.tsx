'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Text } from '@/shared/components/ui/text';
import { FadeInSlideUp } from '@/shared/components/ui/fade-in-slide-up';
import { CaretLeft, CaretRight, Pause, Play } from '@phosphor-icons/react';

// Construction-only slideshow, opening on the HDD on-site drilling rig.
const PROJECTS_HERO_SLIDES = [
    { src: "/pictures/hero-slider/drilling-rig-cover-photo.jpg", alt: "HDD On-Site Drilling Rig System" },
    { src: "/pictures/hero-slider/highlight.jpg", alt: "Heavy HDD Drilling Rig Positioning on Site" },
    { src: "/pictures/hero-slider/drilling-rig-03.jpg", alt: "HDD Rig Operations & High-Pressure Mud Line" },
    { src: "/pictures/hero-slider/ob3-construction-team.jpg", alt: "OB3 River Niger Crossing Field Site" },
    { src: "/pictures/hero-slider/akk-cover-photo.jpg", alt: "AKK Pipeline Crossing Construction Site" },
    { src: "/pictures/hero-slider/pipeline-epc-cover-photo.JPG", alt: "52km Pipeline EPC Construction Site" },
    { src: "/pictures/hero-slider/team-in-suits.jpg", alt: "PCE Executive & Management Team" },
];

interface ProjectsHomeProps {
    sanityPage?: any;
}

export const ProjectsHome: React.FC<ProjectsHomeProps> = ({ sanityPage }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isHovered, setIsHovered] = useState(false);

    const handleNext = useCallback(() => {
        setCurrentSlide((prev) => (prev + 1) % PROJECTS_HERO_SLIDES.length);
    }, []);

    const handlePrev = useCallback(() => {
        setCurrentSlide((prev) => (prev - 1 + PROJECTS_HERO_SLIDES.length) % PROJECTS_HERO_SLIDES.length);
    }, []);

    useEffect(() => {
        if (!isPlaying || isHovered) return;
        const timer = setInterval(() => {
            handleNext();
        }, 5000);
        return () => clearInterval(timer);
    }, [isPlaying, isHovered, handleNext]);

    const togglePlay = () => setIsPlaying((prev) => !prev);

    const activeSlide = PROJECTS_HERO_SLIDES[currentSlide];

    return (
        <section 
            className="relative w-full min-h-screen flex items-end overflow-hidden bg-[var(--bg-tile-dark)]"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Projects Showcase Hero"
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

                {/* Gradient Overlay for Text Legibility */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-tile-dark)] via-[var(--bg-tile-dark)]/50 to-black/30 pointer-events-none" />
            </div>

            {/* Content Container */}
            <div className="relative z-[var(--z-elevate)] w-full px-[var(--section-pad-x)] pt-32 pb-24 md:pb-[12vh] lg:pb-[15vh] flex flex-col items-start">
                
                {/* Headline */}
                <FadeInSlideUp aboveFold delay={0} className="max-w-[1000px] mb-6">
                    <Text variant="hero" intent="inverse">
                        {sanityPage?.heroHeadline || (
                            <>
                                Complex Crossings.<br />
                                Delivered.
                            </>
                        )}
                    </Text>
                </FadeInSlideUp>

                {/* Sub-headline & Controls Row */}
                <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <FadeInSlideUp aboveFold delay={0.15} className="max-w-[800px]">
                        <Text variant="lead-airy" intent="inverse" className="!text-[16px] md:!text-[20px] !leading-relaxed">
                            {sanityPage?.heroSubtext || "From the River Niger to major international HDD and pipeline projects, PCE's record spans difficult geology, large-diameter pipelines and technically demanding routes. Explore selected projects and the engineering behind them."}
                        </Text>
                    </FadeInSlideUp>

                    {/* Slider Navigation & Counter Controls */}
                    <FadeInSlideUp aboveFold delay={0.3} className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-full shrink-0">
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
                            {String(currentSlide + 1).padStart(2, '0')} / {String(PROJECTS_HERO_SLIDES.length).padStart(2, '0')}
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
                    </FadeInSlideUp>
                </div>
            </div>
        </section>
    );
};

