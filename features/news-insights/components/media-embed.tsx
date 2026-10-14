'use client';

import React from 'react';

interface MediaEmbedProps {
  url?: string;
  caption?: string;
  aspectRatio?: '16:9' | '4:3' | '1:1' | '9:16';
}

const RATIO_CLASSES: Record<string, string> = {
  '16:9': 'aspect-video w-full',
  '4:3': 'aspect-[4/3] w-full',
  '1:1': 'aspect-square max-w-xl mx-auto',
  '9:16': 'aspect-[9/16] max-w-[380px] mx-auto',
};

function getYouTubeId(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  return match ? match[1] : null;
}

function getVimeoId(url: string): string | null {
  const match = url.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^\/]*\/videos\/|album\/\d+\/video\/|video\/|)(\d+)/);
  return match ? match[1] : null;
}

function isDirectVideo(url: string): boolean {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(url);
}

export function MediaEmbed({ url, caption, aspectRatio = '16:9' }: MediaEmbedProps) {
  if (!url) return null;

  const trimmedUrl = url.trim();
  const ratioClass = RATIO_CLASSES[aspectRatio] || RATIO_CLASSES['16:9'];
  const youtubeId = getYouTubeId(trimmedUrl);
  const vimeoId = getVimeoId(trimmedUrl);
  const directVideo = isDirectVideo(trimmedUrl);

  return (
    <figure className="my-6 w-full flex flex-col items-center">
      <div className={`relative overflow-hidden rounded-xl sm:rounded-2xl bg-black/5 shadow-md border border-black/10 ${ratioClass}`}>
        {youtubeId ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
            title={caption || 'Embedded YouTube Video'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="w-full h-full border-0 absolute inset-0"
          />
        ) : vimeoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}?dnt=1`}
            title={caption || 'Embedded Vimeo Video'}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="w-full h-full border-0 absolute inset-0"
          />
        ) : directVideo ? (
          <video
            src={trimmedUrl}
            controls
            playsInline
            preload="metadata"
            className="w-full h-full object-cover bg-black absolute inset-0"
          >
            Your browser does not support the video tag.
          </video>
        ) : (
          /* General social media or external embed fallback */
          <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#001723] to-[#0b2838] text-white">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-2xl mb-3 border border-white/20">
              🔗
            </div>
            <h4 className="text-base sm:text-lg font-semibold mb-1 text-white">
              {caption || 'External Media Content'}
            </h4>
            <p className="text-xs sm:text-sm text-gray-300 max-w-md mb-4 truncate w-full px-4">
              {trimmedUrl}
            </p>
            <a
              href={trimmedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary,#1470AD)] hover:bg-[#1885cc] text-white text-xs sm:text-sm font-medium transition-colors shadow-sm"
            >
              <span>View Original Content</span>
              <span>↗</span>
            </a>
          </div>
        )}
      </div>

      {caption && (
        <figcaption className="text-xs sm:text-sm text-center text-black/60 mt-2.5 font-medium max-w-2xl px-2">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
