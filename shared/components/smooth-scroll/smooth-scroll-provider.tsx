'use client';

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { ReactLenis, useLenis } from 'lenis/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

/**
 * Keeps GSAP ScrollTrigger synchronized with Lenis scroll updates
 * and drives Lenis from the GSAP animation frame ticker.
 */
function GsapTickerSync() {
    const lenis = useLenis();

    useEffect(() => {
        if (!lenis) return;

        // 1. Keep ScrollTrigger in phase with Lenis scroll events
        lenis.on('scroll', ScrollTrigger.update);

        // 2. Drive Lenis RAF loop via GSAP Ticker
        const raf = (time: number) => {
            lenis.raf(time * 1000); // Convert GSAP seconds to Lenis milliseconds
        };

        gsap.ticker.add(raf);
        gsap.ticker.lagSmoothing(0); // Prevent lag jumps during heavy render frames

        return () => {
            lenis.off('scroll', ScrollTrigger.update);
            gsap.ticker.remove(raf);
        };
    }, [lenis]);

    return null;
}

/**
 * Root Smooth Scroll Provider Component
 */
export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isStudio = pathname?.startsWith('/studio');

    if (isStudio) {
        return <>{children}</>;
    }

    return (
        <ReactLenis
            root
            autoRaf={false} // Handled by GsapTickerSync to prevent duplicate RAF loops
            options={{
                syncTouch: true, // Prevents mobile touch scroll jitter on pinned elements
            }}
        >
            <GsapTickerSync />
            {children}
        </ReactLenis>
    );
}

export const useSmoothScroll = useLenis;
