'use client';

import React from 'react';
import Link from 'next/link';

export interface PortableTextLinkProps {
  value?: {
    href?: string;
    color?: 'blue' | 'orange' | 'navy' | 'inherit' | string;
    openInNewTab?: boolean;
  };
  children?: React.ReactNode;
}

const COLOR_CLASSES: Record<string, string> = {
  // Brand Blue (Default)
  blue: 'text-[var(--color-primary)] hover:text-[var(--color-accent)] decoration-[var(--color-primary)]/40 hover:decoration-[var(--color-accent)]',
  // Accent Orange
  orange: 'text-[var(--color-accent)] hover:text-[var(--color-primary)] decoration-[var(--color-accent)]/40 hover:decoration-[var(--color-primary)]',
  // Deep Navy / Ink
  navy: 'text-[var(--color-ink)] hover:text-[var(--color-primary)] decoration-[var(--color-ink)]/40 hover:decoration-[var(--color-primary)]',
  // Inherit body text color
  inherit: 'text-inherit hover:text-[var(--color-primary)] decoration-current/40 hover:decoration-current',
};

export const PortableTextLink: React.FC<PortableTextLinkProps> = ({ value, children }) => {
  const href = value?.href;
  if (!href) {
    return <span>{children}</span>;
  }

  const colorKey = value?.color || 'blue';
  const colorClass = COLOR_CLASSES[colorKey] || COLOR_CLASSES.blue;
  const linkClassName = `inline font-medium underline underline-offset-4 decoration-1 hover:decoration-2 transition-colors duration-200 cursor-pointer ${colorClass}`;

  const isExternal =
    value?.openInNewTab ||
    href.startsWith('http://') ||
    href.startsWith('https://');

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClassName}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={linkClassName}>
      {children}
    </Link>
  );
};
