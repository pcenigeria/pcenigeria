'use client';

import React from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { ProjectDetail } from '../types/project.types';
import { FadeInSlideUp } from '@/shared/components/ui/fade-in-slide-up';

const sectionBodyComponents = {
    block: {
        normal: ({ children }: any) => <p>{children}</p>,
    },
};

interface ProjectSummary {
    title: string;
    slug: string;
}

interface ProjectDetailTemplateProps {
    project: ProjectDetail;
    allProjects?: ProjectSummary[];
}

export const ProjectDetailTemplate: React.FC<ProjectDetailTemplateProps> = ({ project, allProjects = [] }) => {
    // Calculate Next Project for seamless footer navigation
    const currentIndex = project.slug ? allProjects.findIndex((p) => p.slug === project.slug) : -1;
    const nextProject = allProjects.length > 0
        ? allProjects[(currentIndex + 1) % allProjects.length]
        : undefined;

    return (
        <article className="w-full bg-[var(--color-canvas)] text-[var(--color-ink)] min-h-screen pb-24">
            
            {/* 1. Full-Bleed Top Header Image (Full Color) */}
            {project.heroImage && (
                <div className="w-full h-[360px] sm:h-[500px] lg:h-[620px] relative overflow-hidden bg-black/5">
                    <div 
                        className="w-full h-full bg-cover bg-center transition-transform duration-1000 hover:scale-102"
                        style={{ backgroundImage: `url("${project.heroImage}")` }}
                    />
                </div>
            )}

            {/* 2. Main Article Body Container */}
            <main className="w-full max-w-[800px] mx-auto px-6 sm:px-10 pt-12 sm:pt-16 flex flex-col gap-10">
                
                {/* Title & Metadata Header */}
                <FadeInSlideUp aboveFold className="flex flex-col items-start gap-3">
                    {/* 1. Distance / Tagline on top (in primary blue uppercase) */}
                    {project.tagline && (
                        <span className="text-[14px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                            {project.tagline}
                        </span>
                    )}

                    {/* 2. Main Headline (60px) */}
                    <h1 className="!text-[36px] sm:!text-[60px] text-[var(--color-ink)] !font-extrabold !leading-[1.10] tracking-tight">
                        {project.title}
                    </h1>

                    {/* 3. Metadata: Date (Optional) */}
                    {project.date && (
                        <div className="text-xs uppercase tracking-[0.25em] text-[var(--color-ink-muted-48)] font-bold pt-1">
                            <span>{project.date}</span>
                        </div>
                    )}
                </FadeInSlideUp>

                {/* Lead Intro Paragraph (Optional) */}
                {project.intro && (
                    <FadeInSlideUp delay={0.1} className="text-base sm:text-lg text-[var(--color-ink)]/80 leading-relaxed font-normal">
                        <p>{project.intro}</p>
                    </FadeInSlideUp>
                )}

                {/* Key Project Specs (Optional) */}
                {project.specs && project.specs.length > 0 && (
                    <FadeInSlideUp delay={0.15} className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 my-2 bg-black/[0.02] p-5 rounded-lg">
                        {project.specs.map((spec) => (
                            <div key={spec.label} className="flex flex-col gap-1">
                                <span className="text-[11px] uppercase tracking-wider text-[var(--color-ink-muted-48)] font-bold">
                                    {spec.label}
                                </span>
                                <span className="text-sm sm:text-base font-semibold text-[var(--color-ink)]">
                                    {spec.value}
                                </span>
                            </div>
                        ))}
                    </FadeInSlideUp>
                )}

                {/* Dynamic Content Sections (Optional) */}
                {project.sections && project.sections.length > 0 && (
                    <div className="flex flex-col gap-12 pt-4">
                        {project.sections.map((section, sIdx) => {
                            const isEngineeringResponse = section.tagline === "THE ENGINEERING RESPONSE" || sIdx === 1;

                            return (
                                <React.Fragment key={section.heading || sIdx}>
                                    <section className="flex flex-col gap-3">
                                        {/* Section Tagline (if present) */}
                                        {section.tagline && (
                                            <span className="text-[14px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                                                {section.tagline}
                                            </span>
                                        )}

                                        {/* Section Subheading */}
                                        {section.heading && (
                                            <h2 className={`!text-[28px] sm:!text-[48px] !font-normal !leading-tight tracking-tight ${section.headingColor || 'text-[var(--color-ink)]'}`}>
                                                {section.heading}
                                            </h2>
                                        )}

                                        {/* Section Paragraphs (if present) */}
                                        {Array.isArray(section.body) && section.body.length > 0 && (
                                            <div className="flex flex-col gap-4 text-sm sm:text-base text-[var(--color-ink)]/75 leading-relaxed font-normal pt-2">
                                                <PortableText value={section.body} components={sectionBodyComponents} />

                                                {/* Section Bullets (if present) */}
                                                {section.bullets && section.bullets.length > 0 && (
                                                    <ul className="flex flex-col gap-2.5 my-2 pl-2">
                                                        {section.bullets.map((bullet, bIdx) => (
                                                            <li key={bIdx} className="flex items-start gap-3">
                                                                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 shrink-0" />
                                                                <span>{bullet}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {/* Section Stat Highlight (if present) */}
                                                {section.highlightStat && (
                                                    <div className="flex flex-col items-start gap-1 pt-6 border-t border-black/10 mt-4">
                                                        <span className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[var(--color-primary)] leading-none tracking-tight">
                                                            {section.highlightStat.value}
                                                        </span>
                                                        <span className="text-sm uppercase tracking-widest text-[var(--color-ink-muted-48)] font-bold">
                                                            {section.highlightStat.label}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </section>

                                    {/* Bento Grid rendered immediately AFTER The Engineering Response section */}
                                    {isEngineeringResponse && project.bentoImages && project.bentoImages.length > 0 && (
                                        <div className="w-full my-4 flex flex-col gap-4">
                                            <div className="grid grid-cols-12 gap-4 w-full">
                                                {/* Large Featured Image 1 */}
                                                {project.bentoImages[0] && (
                                                    <div className="col-span-12 md:col-span-8 h-[280px] sm:h-[380px] relative rounded-xl overflow-hidden bg-black/5 group border border-black/5">
                                                        <div
                                                            className="w-full h-full bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-103"
                                                            style={{ backgroundImage: `url("${project.bentoImages[0]}")` }}
                                                        />
                                                    </div>
                                                )}

                                                {/* Side Tall Image 2 */}
                                                {project.bentoImages[1] && (
                                                    <div className="col-span-12 md:col-span-4 h-[280px] sm:h-[380px] relative rounded-xl overflow-hidden bg-black/5 group border border-black/5">
                                                        <div
                                                            className="w-full h-full bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-103"
                                                            style={{ backgroundImage: `url("${project.bentoImages[1]}")` }}
                                                        />
                                                    </div>
                                                )}

                                                {/* Bottom Trio: Images 3, 4, 5 */}
                                                {project.bentoImages.slice(2, 5).map((imgUrl, iIdx) => (
                                                    <div
                                                        key={iIdx}
                                                        className="col-span-12 sm:col-span-4 h-[220px] sm:h-[260px] relative rounded-xl overflow-hidden bg-black/5 group border border-black/5"
                                                    >
                                                        <div
                                                            className="w-full h-full bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-103"
                                                            style={{ backgroundImage: `url("${imgUrl}")` }}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}

                {/* Bottom Footer Back Link & Next Project Link with Top Border */}
                <div className="pt-10 mt-16 border-t border-black/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <Link 
                        href="/projects" 
                        className="inline-flex items-center gap-2 text-sm uppercase tracking-wider font-semibold text-[var(--color-ink-muted-48)] hover:text-[var(--color-ink)] transition-colors no-underline"
                    >
                        <ArrowLeft size={18} weight="bold" />
                        Back to All Projects
                    </Link>

                    {nextProject && (
                        <Link 
                            href={`/projects/${nextProject.slug}`} 
                            className="inline-flex items-center gap-2 text-sm uppercase tracking-wider font-semibold text-[var(--color-accent)] hover:underline no-underline text-left sm:text-right"
                        >
                            <span>Next Project: {nextProject.title}</span>
                            <ArrowRight size={18} weight="bold" />
                        </Link>
                    )}
                </div>

            </main>

        </article>
    );
};
