'use client';

import React, { useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CaretLeft, CaretRight } from '@phosphor-icons/react';

export interface GalleryItem {
    src: string;
    title: string;
    description?: string;
}

export interface GalleryCategory {
    id: string;
    categoryTitle: string;
    items: GalleryItem[];
}

interface OverviewLightboxModalProps {
    isOpen: boolean;
    onClose: () => void;
    gallery: GalleryCategory | null;
    initialIndex?: number;
}

export const OverviewLightboxModal: React.FC<OverviewLightboxModalProps> = ({
    isOpen,
    onClose,
    gallery,
    initialIndex = 0,
}) => {
    const [currentIndex, setCurrentIndex] = React.useState(initialIndex);

    useEffect(() => {
        if (isOpen) {
            setCurrentIndex(initialIndex);
        }
    }, [isOpen, initialIndex]);

    const items = gallery?.items || [];
    const hasValidItems = items.length > 0;
    const safeIndex = hasValidItems ? Math.min(Math.max(0, currentIndex), items.length - 1) : 0;
    const currentItem = hasValidItems ? items[safeIndex] : null;

    const handleNext = useCallback(() => {
        if (!items.length) return;
        setCurrentIndex((prev) => (prev + 1) % items.length);
    }, [items.length]);

    const handlePrev = useCallback(() => {
        if (!items.length) return;
        setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
    }, [items.length]);

    // Keyboard handlers
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            } else if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, onClose, handleNext, handlePrev]);

    return (
        <AnimatePresence>
            {isOpen && gallery && currentItem && currentItem.src && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="fixed inset-0 z-[var(--z-modal)] flex flex-col justify-between bg-black/90 backdrop-blur-xl select-none"
                    onClick={onClose}
                >
                    {/* Header Bar */}
                    <div 
                        className="relative z-20 w-full px-6 py-4 flex items-center justify-between border-b border-white/10 bg-black/40"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col">
                            <span className="text-xs uppercase tracking-widest text-[var(--color-accent)] font-semibold mb-0.5">
                                PCE Photo Gallery
                            </span>
                            <h3 className="text-lg md:text-xl font-bold text-white">
                                {gallery.categoryTitle}
                            </h3>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-xs font-mono text-white/70 bg-white/10 px-3 py-1 rounded-full">
                                {String(safeIndex + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                            </span>

                            <button
                                onClick={onClose}
                                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                aria-label="Close Lightbox"
                            >
                                <X size={24} weight="bold" />
                            </button>
                        </div>
                    </div>

                    {/* Main Content Area */}
                    <div 
                        className="relative flex-1 w-full flex items-center justify-center p-4 md:p-8 overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Navigation Buttons */}
                        {items.length > 1 && (
                            <>
                                <button
                                    onClick={handlePrev}
                                    className="absolute left-4 md:left-8 z-30 p-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 border border-white/10 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    aria-label="Previous Image"
                                >
                                    <CaretLeft size={24} weight="bold" />
                                </button>

                                <button
                                    onClick={handleNext}
                                    className="absolute right-4 md:right-8 z-30 p-3 text-white/80 hover:text-white bg-black/50 hover:bg-black/80 border border-white/10 rounded-full transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
                                    aria-label="Next Image"
                                >
                                    <CaretRight size={24} weight="bold" />
                                </button>
                            </>
                        )}

                        {/* Animated Image Frame */}
                        <div className="relative max-w-5xl max-h-[70vh] w-full h-full flex flex-col items-center justify-center">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={safeIndex}
                                    initial={{ opacity: 0, scale: 0.96 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.96 }}
                                    transition={{ duration: 0.3, ease: 'easeOut' }}
                                    className="relative w-full h-full flex items-center justify-center"
                                >
                                    <Image
                                        src={currentItem.src}
                                        alt={currentItem.title || 'Gallery image'}
                                        fill
                                        quality={90}
                                        sizes="(max-width: 1280px) 100vw, 1280px"
                                        className="object-contain pointer-events-none rounded-lg"
                                    />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Footer Bar: Caption & Thumbnails */}
                    <div 
                        className="relative z-20 w-full px-6 py-4 flex flex-col items-center gap-3 border-t border-white/10 bg-black/60"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {currentItem.title && (
                            <p className="text-sm md:text-base font-medium text-white/90 text-center max-w-3xl">
                                {currentItem.title}
                            </p>
                        )}

                        {/* Thumbnail Strip */}
                        {items.length > 1 && (
                            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 pt-1 scrollbar-none">
                                {items.map((item, idx) => (
                                    item?.src ? (
                                        <button
                                            key={idx}
                                            onClick={() => setCurrentIndex(idx)}
                                            className={`relative w-14 h-10 rounded overflow-hidden transition-all shrink-0 border-2 ${
                                                idx === safeIndex 
                                                    ? 'border-[var(--color-accent)] scale-105 opacity-100 ring-2 ring-[var(--color-accent)]/50' 
                                                    : 'border-transparent opacity-50 hover:opacity-80'
                                            }`}
                                            aria-label={`Go to slide ${idx + 1}`}
                                        >
                                            <Image
                                                src={item.src}
                                                alt={item.title || `Thumbnail ${idx + 1}`}
                                                fill
                                                sizes="60px"
                                                className="object-cover"
                                            />
                                        </button>
                                    ) : null
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
