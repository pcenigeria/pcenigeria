'use client';

import React from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { ArrowLeft, ArrowRight, Clock, User, Calendar } from '@phosphor-icons/react';
import { SanityNewsArticleDetail, NewsArticleSummary } from '../types/news.types';

interface NewsDetailTemplateProps {
    article: SanityNewsArticleDetail;
    allArticles?: NewsArticleSummary[];
}

const HEADING_COLOR_CLASSES: Record<string, string> = {
    navy: 'text-[var(--color-ink)]',
    blue: 'text-[var(--color-primary)]',
    orange: 'text-[var(--color-accent)]',
};

const sectionBodyComponents = {
    block: {
        normal: ({ children }: any) => <p>{children}</p>,
    },
};

export const NewsDetailTemplate: React.FC<NewsDetailTemplateProps> = ({ article, allArticles }) => {
    // Calculate Next Article for footer navigation
    const currentIndex = allArticles?.findIndex((a) => a.slug === article.slug) ?? -1;
    const nextArticle = allArticles && allArticles.length > 0 && currentIndex !== -1
        ? allArticles[(currentIndex + 1) % allArticles.length]
        : undefined;

    return (
        <article className="w-full bg-[var(--color-canvas)] text-[var(--color-ink)] min-h-screen pb-24">
            
            {/* 1. Full-Bleed Top Header Image */}
            {article.heroImage && (
                <div className="w-full h-[360px] sm:h-[500px] lg:h-[620px] relative overflow-hidden bg-black/5">
                    <div 
                        className="w-full h-full bg-cover bg-center transition-transform duration-1000 hover:scale-102"
                        style={{ backgroundImage: `url("${article.heroImage}")` }}
                    />
                </div>
            )}

            {/* 2. Main Article Body Container */}
            <main className="w-full max-w-[800px] mx-auto px-6 sm:px-10 pt-12 sm:pt-16 flex flex-col gap-10">
                
                {/* Title & Metadata Header */}
                <header className="flex flex-col items-start gap-4">
                    {/* Category Badge */}
                    <span className="px-3 py-1 rounded-full bg-[var(--color-primary)] text-white text-[11px] font-bold uppercase tracking-wider shadow-sm">
                        {article.category}
                    </span>

                    {/* Main Headline */}
                    <h1 className="!text-[36px] sm:!text-[56px] text-[var(--color-ink)] !font-extrabold !leading-[1.12] tracking-tight">
                        {article.title}
                    </h1>

                    {/* Metadata Row: Date, Author, Read Time */}
                    <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-wider text-[var(--color-ink-muted-48)] font-bold pt-2 border-b border-black/10 pb-6 w-full">
                        {article.date && (
                            <div className="flex items-center gap-1.5">
                                <Calendar size={15} weight="bold" className="text-[var(--color-accent)]" />
                                <span>{article.date}</span>
                            </div>
                        )}
                        {article.readTime && (
                            <>
                                <span className="text-black/20">•</span>
                                <div className="flex items-center gap-1.5">
                                    <Clock size={15} weight="bold" className="text-[var(--color-accent)]" />
                                    <span>{article.readTime}</span>
                                </div>
                            </>
                        )}
                        {article.author && (
                            <>
                                <span className="text-black/20">•</span>
                                <div className="flex items-center gap-1.5">
                                    <User size={15} weight="bold" className="text-[var(--color-accent)]" />
                                    <span>{article.author}</span>
                                </div>
                            </>
                        )}
                    </div>
                </header>

                {/* Lead Intro Paragraph */}
                {article.intro && (
                    <div className="text-lg sm:text-xl text-[var(--color-ink)]/90 leading-relaxed font-medium">
                        <p>{article.intro}</p>
                    </div>
                )}

                {/* Dynamic Content Sections */}
                {article.sections && article.sections.length > 0 && (
                    <div className="flex flex-col gap-12 pt-4">
                        {article.sections.map((section, sIdx) => {
                            return (
                                <React.Fragment key={section.heading || sIdx}>
                                    <section className="flex flex-col gap-3">
                                        {/* Section Tagline */}
                                        {section.tagline && (
                                            <span className="text-[14px] font-bold uppercase tracking-[0.2em] text-[var(--color-primary)]">
                                                {section.tagline}
                                            </span>
                                        )}

                                        {/* Section Subheading */}
                                        {section.heading && (
                                            <h2 className={`!text-[26px] sm:!text-[40px] !font-bold !leading-tight tracking-tight ${HEADING_COLOR_CLASSES[section.headingColor || ''] || 'text-[var(--color-ink)]'}`}>
                                                {section.heading}
                                            </h2>
                                        )}

                                        {/* Section Paragraphs */}
                                        {section.body && section.body.length > 0 && (
                                            <div className="flex flex-col gap-4 text-sm sm:text-base text-[var(--color-ink)]/75 leading-relaxed font-normal pt-2">
                                                <PortableText value={section.body} components={sectionBodyComponents} />

                                                {/* Section Bullets */}
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

                                                {/* Section Stat Highlight */}
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
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}

                {/* Optional Bento Image Gallery */}
                {article.bentoImages && article.bentoImages.length > 0 && (
                    <div className="w-full my-4 flex flex-col gap-4">
                        <div className="grid grid-cols-12 gap-4 w-full">
                            {article.bentoImages[0] && (
                                <div className="col-span-12 md:col-span-8 h-[280px] sm:h-[360px] relative rounded-xl overflow-hidden bg-black/5 group border border-black/5">
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-103"
                                        style={{ backgroundImage: `url("${article.bentoImages[0].src}")` }}
                                    />
                                </div>
                            )}

                            {article.bentoImages[1] && (
                                <div className="col-span-12 md:col-span-4 h-[280px] sm:h-[360px] relative rounded-xl overflow-hidden bg-black/5 group border border-black/5">
                                    <div
                                        className="w-full h-full bg-cover bg-center transition-all duration-700 ease-out group-hover:scale-103"
                                        style={{ backgroundImage: `url("${article.bentoImages[1].src}")` }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Bottom Footer Navigation */}
                <div className="pt-10 mt-16 border-t border-black/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <Link 
                        href="/news-insights" 
                        className="inline-flex items-center gap-2 text-sm uppercase tracking-wider font-semibold text-[var(--color-ink-muted-48)] hover:text-[var(--color-ink)] transition-colors no-underline"
                    >
                        <ArrowLeft size={18} weight="bold" />
                        Back to News & Insights
                    </Link>

                    {nextArticle && (
                        <Link 
                            href={`/news-insights/${nextArticle.slug}`} 
                            className="inline-flex items-center gap-2 text-sm uppercase tracking-wider font-semibold text-[var(--color-accent)] hover:underline no-underline text-left sm:text-right"
                        >
                            <span>Next Article: {nextArticle.title}</span>
                            <ArrowRight size={18} weight="bold" />
                        </Link>
                    )}
                </div>

            </main>

        </article>
    );
};
