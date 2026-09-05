'use client';

import React from 'react';

export const ProductsHero: React.FC = () => {
    return (
        <section className="w-full section bg-[#052237] text-white pt-16 pb-20">
            <div className="flex flex-col gap-6 w-full max-w-6xl">
                {/* White PCE Lantic Logo */}
                <div>
                    <img
                        src="/logo/lantic-white-and-orange.png"
                        alt="Lantic Logo"
                        className="h-[67px] md:h-[78px] w-auto object-contain"
                    />
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight whitespace-nowrap">
                    Brighter Star Drilling Fluids
                </h1>

                <p className="text-xl md:text-2xl font-extrabold !text-[#f4691a]">
                    Engineered for HDD · Made for Results
                </p>

                <p className="text-base md:text-lg !text-white max-w-3xl leading-relaxed font-medium">
                    Bentonite &nbsp;·&nbsp; CMC &nbsp;·&nbsp; MMH &nbsp;·&nbsp; Clay Viscosity Reducer &nbsp;·&nbsp; Xanthan Gum
                </p>

                {/* Value Pillars Chips */}
                <div className="flex flex-wrap gap-2.5 pt-2">
                    {['Competitive Pricing', 'Guaranteed Quality', 'Ample Stock', 'The First Choice for HDD'].map((pillar, i) => (
                        <span
                            key={i}
                            className="px-3.5 py-1.5 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20"
                        >
                            {pillar}
                        </span>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductsHero;
