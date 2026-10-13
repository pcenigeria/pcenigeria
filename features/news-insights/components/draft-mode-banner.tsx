'use client';

import React from 'react';
import Link from 'next/link';

interface DraftModeBannerProps {
  slug: string;
  title?: string;
}

export function DraftModeBanner({ slug, title }: DraftModeBannerProps) {
  return (
    <aside
      aria-label="Draft mode indicator"
      className="sticky top-0 z-50 w-full bg-[#001723]/95 text-white backdrop-blur-md border-b border-amber-500/40 shadow-xl transition-all"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Left: Indicator & Status */}
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
          </span>
          <span className="font-semibold tracking-wider uppercase text-amber-400 text-[11px] sm:text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
            Draft Preview
          </span>
          <span className="text-gray-300 hidden md:inline">
            Viewing unpublished changes {title ? `for "${title}"` : ''}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 ml-auto">
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white/10 hover:bg-white/20 text-gray-200 transition-colors text-xs font-medium border border-white/10"
          >
            <span>✏️ Studio</span>
          </Link>
          <a
            href={`/api/draft-mode/disable?redirect=/news-insights/${encodeURIComponent(slug)}`}
            className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-amber-500 hover:bg-amber-600 text-[#001723] transition-colors text-xs font-semibold shadow-sm"
          >
            Exit Preview ✕
          </a>
        </div>
      </div>
    </aside>
  );
}
