'use client';

import React from 'react';
import { PortableText } from '@portabletext/react';
import { Text } from '@/shared/components/ui/text';

interface StockLogisticsProps {
    section?: any;
}

const DEFAULT_HEADING = 'Ample Standing Stock in Nigeria';
const DEFAULT_BODY = 'Brighter Star maintains a large standing inventory of drilling fluid materials inside Nigeria. Whatever your programme — bentonite, CMC, MMH, clay viscosity reducer or xanthan gum — the products you need are already in-country, palletised and ready for immediate dispatch.';

const bodyComponents = {
    block: {
        normal: ({ children }: any) => (
            <p className="text-base text-[#052237]/80 leading-relaxed font-medium">{children}</p>
        ),
    },
};

export const StockLogistics: React.FC<StockLogisticsProps> = ({ section }) => {
    const heading = section?.heading || DEFAULT_HEADING;
    const hasBody = Array.isArray(section?.body) && section.body.length > 0;

    const BENTO_STORE_ITEMS = [
        {
            title: 'BRSBENT SQ',
            subtitle: 'Activated Bentonite · Standing Stock',
            image: '/pictures/store/brs-bent.png',
            gridSpan: 'lg:col-span-8 h-[340px] sm:h-[400px]',
        },
        {
            title: 'BRSCMC',
            subtitle: 'Carboxymethyl Cellulose',
            image: '/pictures/store/brscmc.jpg',
            gridSpan: 'lg:col-span-4 h-[340px] sm:h-[400px]',
        },
        {
            title: 'BRSMMH',
            subtitle: 'Mixed Metal Hydroxide',
            image: '/pictures/store/brsmmh.png',
            gridSpan: 'lg:col-span-4 h-[260px] sm:h-[280px]',
        },
        {
            title: 'BRSVR',
            subtitle: 'Clay Viscosity Reducer',
            image: '/pictures/store/brsvr.jpg',
            gridSpan: 'lg:col-span-4 h-[260px] sm:h-[280px]',
        },
        {
            title: 'BRSXTG',
            subtitle: 'Xanthan Gum',
            image: '/pictures/store/brsxtg.jpg',
            gridSpan: 'lg:col-span-4 h-[260px] sm:h-[280px]',
        },
    ];

    return (
        <section className="w-full section bg-white">
            <div className="flex flex-col gap-16">
                {/* 1. Header Block: 2-Column Grid (Heading Left, Subtext & Badge Right) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-start">
                    {/* Left Column: Heading with controllable max-width */}
                    <div className="lg:col-span-7">
                        <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight !text-[#052237] max-w-[700px]">
                            {heading}
                        </Text>
                    </div>

                    {/* Right Column: Subtext + Clean Elevated Badge Card (Top-Aligned with Heading) */}
                    <div className="lg:col-span-5 flex flex-col gap-5">
                        {hasBody ? (
                            <PortableText value={section.body} components={bodyComponents} />
                        ) : (
                            <p className="text-base text-[#052237]/80 leading-relaxed font-medium">
                                {DEFAULT_BODY}
                            </p>
                        )}

                        {/* Clean Dispatch Card (No orange left border line) */}
                        <div className="p-6 rounded-2xl bg-[#052237] text-white shadow-sm flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-[#f4691a] animate-pulse" />
                                <span className="text-xs uppercase font-extrabold text-[#f4691a] tracking-wider">
                                    Immediate Rig Dispatch
                                </span>
                            </div>
                            <p className="text-sm font-semibold !text-white/90 leading-snug">
                                Because stock is held locally in Nigeria, your order moves from warehouse to rig site in days, not months — keeping your drilling programme strictly on schedule.
                            </p>
                        </div>
                    </div>
                </div>

                {/* 2. 5-Tile Bento Grid of Warehouse / Product Stock Photos */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {BENTO_STORE_ITEMS.map((item) => (
                        <div
                            key={item.title}
                            className={`relative overflow-hidden rounded-2xl group cursor-pointer bg-[#052237] ${item.gridSpan}`}
                        >
                            <img
                                src={item.image}
                                alt={item.title}
                                className="w-full h-full object-cover opacity-90 transition-transform duration-700 group-hover:scale-105 group-hover:opacity-100"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#052237]/90 via-[#052237]/30 to-transparent flex flex-col justify-end p-6">
                                <h3 className="text-2xl font-extrabold text-white tracking-wide">
                                    {item.title}
                                </h3>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StockLogistics;
