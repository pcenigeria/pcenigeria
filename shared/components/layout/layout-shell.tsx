'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { SiteHeader } from './site-header';
import { SiteFooter } from './site-footer';

export function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith('/studio');

  if (isStudio) {
    return <div className="w-full min-h-screen bg-white text-black">{children}</div>;
  }

  return (
    <>
      <SiteHeader />
      <main className="flex-1 flex flex-col">{children}</main>
      <SiteFooter />
    </>
  );
}
