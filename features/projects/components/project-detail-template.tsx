'use client';

import React from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { ArrowLeft, ArrowRight } from '@phosphor-icons/react';
import { ProjectDetail } from '../types/project.types';
import { FadeInSlideUp } from '@/shared/components/ui/fade-in-slide-up';
import { MediaEmbed } from '@/features/news-insights/components';
import { PortableTextLink } from '@/shared/components/ui/portable-text-link';

const sectionBodyComponents = {
    block: {
        normal: ({ children }: any) => <p>{children}</p>,
    },
    marks: {
        link: PortableTextLink,
    },
    types: {
        image: ({ value }: any) => {
            const src = value?.asset?.url;
            if (!src) return null;
            return (
                <span className="block my-2">
                    <img src={src} alt={value?.alt || ''} className="w-full h-auto rounded-lg" />
                    {value?.caption && (
                        <span className="block text-xs text-[var(--color-ink-muted-48)] mt-2">{value.caption}</span>
                    )}
                </span>
            );
        },
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

                                        {/* Modular Content Widgets */}
                                        {section.contentBlocks && section.contentBlocks.length > 0 ? (
                                            <div className="flex flex-col gap-6 pt-2">
                                                {section.contentBlocks.map((block: any, bIdx: number) => {
                                                    switch (block._type) {
                                                        case 'richTextWidget':
                                                            return block.content && block.content.length > 0 ? (
                                                                <div
                                                                    key={block._key || bIdx}
                                                                    className="flex flex-col gap-4 text-sm sm:text-base text-[var(--color-ink)]/75 leading-relaxed font-normal"
                                                                >
                                                                    <PortableText value={block.content} components={sectionBodyComponents} />
                                                                </div>
                                                            ) : null;

                                                        case 'mediaEmbedWidget':
                                                            return (
                                                                <MediaEmbed
                                                                    key={block._key || bIdx}
                                                                    url={block.url}
                                                                    caption={block.caption}
                                                                    aspectRatio={block.aspectRatio}
                                                                />
                                                            );

                                                        case 'bulletsWidget':
                                                            return block.items && block.items.length > 0 ? (
                                                                <ul key={block._key || bIdx} className="flex flex-col gap-2.5 my-2 pl-2">
                                                                    {block.items.map((bullet: string, idx: number) => (
                                                                        <li key={idx} className="flex items-start gap-3 text-sm sm:text-base text-[var(--color-ink)]/75 leading-relaxed">
                                                                            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] mt-2 shrink-0" />
                                                                            <span>{bullet}</span>
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            ) : null;

                                                        case 'statWidget':
                                                            return block.value ? (
                                                                <div key={block._key || bIdx} className="flex flex-col items-start gap-1 py-4 border-y border-black/10 my-2">
                                                                    <span className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[var(--color-primary)] leading-none tracking-tight">
                                                                        {block.value}
                                                                    </span>
                                                                    {block.label && (
                                                                        <span className="text-sm uppercase tracking-widest text-[var(--color-ink-muted-48)] font-bold">
                                                                            {block.label}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            ) : null;

                                                        case 'quoteWidget':
                                                            return block.quote ? (
                                                                <blockquote key={block._key || bIdx} className="my-4 pl-5 sm:pl-6 border-l-4 border-[var(--color-primary)] bg-[var(--color-primary)]/5 py-4 px-4 rounded-r-xl">
                                                                    <p className="text-base sm:text-lg italic font-medium text-[var(--color-ink)]/90 leading-relaxed">
                                                                        "{block.quote}"
                                                                    </p>
                                                                    {(block.author || block.role) && (
                                                                        <footer className="mt-2 text-xs sm:text-sm font-semibold text-[var(--color-ink-muted-48)]">
                                                                            {block.author && <span className="text-[var(--color-ink)] font-bold">{block.author}</span>}
                                                                            {block.author && block.role && <span> — </span>}
                                                                            {block.role && <span>{block.role}</span>}
                                                                        </footer>
                                                                    )}
                                                                </blockquote>
                                                            ) : null;

                                                        case 'galleryWidget':
                                                            return block.gallery?.items && block.gallery.items.length > 0 ? (
                                                                <div key={block._key || bIdx} className="grid grid-cols-2 sm:grid-cols-3 gap-3 my-2">
                                                                    {block.gallery.items.map((item: any, gIdx: number) => (
                                                                        <div
                                                                            key={item.src || gIdx}
                                                                            className="relative h-[160px] sm:h-[200px] rounded-lg overflow-hidden bg-black/5 border border-black/5"
                                                                        >
                                                                            <div
                                                                                className="w-full h-full bg-cover bg-center transition-transform duration-500 hover:scale-105"
                                                                                style={{ backgroundImage: `url("${item.src}")` }}
                                                                                title={item.title}
                                                                            />
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            ) : null;

                                                        case 'buttonWidget':
                                                            return block.text && block.url ? (
                                                                <div key={block._key || bIdx} className="my-3">
                                                                    <a
                                                                        href={block.url}
                                                                        className={`inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 shadow-sm ${
                                                                            block.variant === 'orange'
                                                                                ? 'bg-[var(--color-accent,#f4691a)] hover:bg-[#d9550b] text-white'
                                                                                : block.variant === 'outline'
                                                                                ? 'border-2 border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)] hover:text-white'
                                                                                : 'bg-[var(--color-primary,#1470AD)] hover:bg-[#0f5482] text-white'
                                                                        }`}
                                                                    >
                                                                        <span>{block.text}</span>
                                                                        <span>→</span>
                                                                    </a>
                                                                </div>
                                                            ) : null;

                                                        case 'tableWidget':
                                                            return block.rows && block.rows.length > 0 ? (
                                                                <div key={block._key || bIdx} className="my-5 w-full">
                                                                    {block.title && (
                                                                        <h4 className="text-sm font-bold uppercase tracking-wider text-[var(--color-ink)]/70 mb-2.5">
                                                                            {block.title}
                                                                        </h4>
                                                                    )}
                                                                    <div className="overflow-x-auto rounded-xl border border-black/10 bg-white shadow-xs">
                                                                        <table className="w-full min-w-[500px] border-collapse text-left text-xs sm:text-sm">
                                                                            {block.hasHeaderRow !== false && block.rows[0]?.cells && (
                                                                                <thead>
                                                                                    <tr className="bg-[var(--color-primary)]/5 border-b border-black/10">
                                                                                        {block.rows[0].cells.map((cell: string, cIdx: number) => (
                                                                                            <th
                                                                                                key={cIdx}
                                                                                                className="px-4 py-3 font-bold text-[var(--color-primary)] tracking-wide border-r border-black/5 last:border-r-0"
                                                                                            >
                                                                                                {cell}
                                                                                            </th>
                                                                                        ))}
                                                                                    </tr>
                                                                                </thead>
                                                                            )}
                                                                            <tbody className="divide-y divide-black/5">
                                                                                {(block.hasHeaderRow !== false ? block.rows.slice(1) : block.rows).map((row: any, rIdx: number) => (
                                                                                    <tr
                                                                                        key={row._key || rIdx}
                                                                                        className={`transition-colors hover:bg-black/[0.02] ${
                                                                                            rIdx % 2 === 1 ? 'bg-black/[0.01]' : 'bg-white'
                                                                                        }`}
                                                                                    >
                                                                                        {row.cells?.map((cell: string, cIdx: number) => (
                                                                                            <td
                                                                                                key={cIdx}
                                                                                                className="px-4 py-3 text-[var(--color-ink)]/80 leading-relaxed border-r border-black/5 last:border-r-0"
                                                                                            >
                                                                                                {cell}
                                                                                            </td>
                                                                                        ))}
                                                                                    </tr>
                                                                                ))}
                                                                            </tbody>
                                                                        </table>
                                                                    </div>
                                                                </div>
                                                            ) : null;

                                                        default:
                                                            return null;
                                                    }
                                                })}
                                            </div>
                                        ) : (
                                            /* Legacy Section Rendering */
                                            <>
                                                {Array.isArray(section.body) && section.body.length > 0 && (
                                                    <div className="flex flex-col gap-4 text-sm sm:text-base text-[var(--color-ink)]/75 leading-relaxed font-normal pt-2">
                                                        <PortableText value={section.body} components={sectionBodyComponents} />

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

                                                {section.gallery?.items && section.gallery.items.length > 0 && (
                                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                                                        {section.gallery.items.map((item, gIdx) => (
                                                            <div
                                                                key={item.src || gIdx}
                                                                className="relative h-[160px] sm:h-[200px] rounded-lg overflow-hidden bg-black/5 border border-black/5"
                                                            >
                                                                <div
                                                                    className="w-full h-full bg-cover bg-center"
                                                                    style={{ backgroundImage: `url("${item.src}")` }}
                                                                    title={item.title}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </>
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
