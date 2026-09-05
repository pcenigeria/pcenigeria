'use client';

import React from 'react';
import { NewsHero, NewsCards } from '../components';
import { NewsArticleSummary } from '../types/news.types';

interface NewsPageProps {
  sanityArticles?: NewsArticleSummary[];
  sanityPage?: {
    heroHeadline?: string;
    heroSubtext?: string;
    articlesSection?: any;
  };
}

export const NewsPage: React.FC<NewsPageProps> = ({ sanityArticles, sanityPage }) => {
  return (
    <div className="flex flex-col w-full bg-[var(--color-canvas-tint)] min-h-screen">
      <NewsHero sanityPage={sanityPage} />
      <NewsCards sanityArticles={sanityArticles} articlesSection={sanityPage?.articlesSection} />
    </div>
  );
};

export default NewsPage;
