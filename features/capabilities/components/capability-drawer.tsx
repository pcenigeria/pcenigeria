'use client';

import React from 'react';
import { X } from '@phosphor-icons/react';
import { CAPABILITIES_DETAILS as DEFAULT_CAPABILITIES_DETAILS } from '../data/capabilities-data';
import { CapabilityDetail } from '../types/capability.types';

interface CapabilityDrawerProps {
    capabilityId: string | null;
    isVisible: boolean;
    onClose: () => void;
    capabilities?: any[];
}

export const CapabilityDrawer: React.FC<CapabilityDrawerProps> = ({
    capabilityId,
    isVisible,
    onClose,
    capabilities
}) => {
    if (!capabilityId) return null;

    const sanityDetail = capabilities?.find((cap) => cap.id === capabilityId);
    const detail: CapabilityDetail | undefined = sanityDetail
        ? {
              id: sanityDetail.id,
              number: sanityDetail.number,
              title: sanityDetail.title,
              image: sanityDetail.image,
              headline: sanityDetail.headline,
              subtext: sanityDetail.subtext,
              steps: sanityDetail.steps,
          }
        : DEFAULT_CAPABILITIES_DETAILS[capabilityId];
    if (!detail) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end overflow-hidden">
            {/* Backdrop Overlay */}
            <div 
                onClick={onClose}
                className={`fixed inset-0 bg-black/65 backdrop-blur-sm transition-opacity duration-400 ease-in-out ${
                    isVisible ? 'opacity-100' : 'opacity-0'
                }`}
            />

            {/* Right Slide-Over Panel */}
            <div 
                className={`relative w-full max-w-[520px] h-full bg-[var(--color-canvas-tint)] text-[var(--color-ink)] z-10 flex flex-col overflow-y-auto shadow-2xl transition-transform duration-400 ease-out ${
                    isVisible ? 'translate-x-0' : 'translate-x-full'
                }`}
            >
                {/* Full-Bleed Image Header with Floating Close Button */}
                <div className="w-full h-[220px] sm:h-[400px] relative overflow-hidden shrink-0">
                    <div 
                        className="w-full h-full bg-cover bg-center"
                        style={{ backgroundImage: `url("${detail.image}")` }}
                    />
                    {/* Floating Close Button over Image */}
                    <button 
                        onClick={onClose}
                        className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors cursor-pointer"
                        aria-label="Close details"
                    >
                        <X size={18} weight="bold" />
                    </button>
                </div>

                {/* Drawer Body Content */}
                <div className="p-5 sm:p-8 flex flex-col gap-6">
                    {/* Headline */}
                    <h2 className="!text-[22px] sm:!text-[28px] font-extrabold leading-tight text-[var(--color-ink)]">
                        {detail.headline}
                    </h2>

                    {/* Subtext */}
                    <p className="text-sm sm:text-base text-[var(--color-ink)]/80 leading-relaxed">
                        {detail.subtext}
                    </p>

                    {/* Process Steps */}
                    <div className="flex flex-col gap-4 mt-6 sm:mt-9">
                        <span className="text-xs uppercase tracking-wider text-[var(--color-ink)]/60 font-bold">
                            Process & Delivery Scope
                        </span>

                        <div className="flex flex-col border-t border-black/15">
                            {detail.steps.map((step) => (
                                <div 
                                    key={step.title} 
                                    className="py-4 sm:py-5 border-b border-black/15 flex flex-col gap-2 last:border-b-0"
                                >
                                    <h3 className="!text-[20px] sm:!text-[24px] font-bold text-[var(--color-accent)] leading-tight">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm sm:text-base text-[var(--color-ink)]/80 leading-relaxed">
                                        {step.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
