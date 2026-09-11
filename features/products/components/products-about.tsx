'use client';

import React from 'react';
import { PortableText } from '@portabletext/react';
import { Text } from '@/shared/components/ui/text';

interface ProductsAboutProps {
    section?: any;
}

const DEFAULT_STATS = [
    { stat: '15+', label: 'Years in HDD' },
    { stat: '500+', label: 'HDD Crossings' },
    { stat: '300+', label: 'Kilometres Drilled' },
    { stat: '5', label: 'Countries Served' },
    { stat: '6″–56″', label: 'Pipe Diameters' },
];

const portableTextComponents = {
    block: {
        normal: ({ children }: any) => (
            <p className="text-base text-[#052237]/80 leading-relaxed">{children}</p>
        ),
    },
};

export const ProductsAbout: React.FC<ProductsAboutProps> = ({ section }) => {
    const tagline = section?.tagline || 'About Us';
    const heading = section?.heading || 'A Team Built on Drilling Fluid Expertise';
    const hasBody = Array.isArray(section?.body) && section.body.length > 0;

    const calloutBadge = section?.callout?.badge || 'Quality Control & Testing';
    const calloutTitle = section?.callout?.title || '100% Laboratory Verified Before Delivery';
    const calloutText = section?.callout?.text || 'Every batch of Brighter Star products is verified in our own laboratory before it ever reaches a job site: viscosity profiles, fluid loss, carrying capacity and salt resistance are all measured on standard mud-testing equipment.';
    const calloutFooter = section?.callout?.footer || 'ISO-Standard Mud Testing Protocol';

    const stats = (section?.stats && section.stats.length > 0) ? section.stats : DEFAULT_STATS;

    return (
        <section className="w-full section bg-white">
            <div className="flex flex-col gap-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                    <div className="lg:col-span-7 flex flex-col gap-5">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-[3px] bg-[#f4691a] inline-block" />
                            <span className="text-sm uppercase tracking-wider text-[#052237] font-semibold">
                                {tagline}
                            </span>
                        </div>
                        <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight !text-[#052237]">
                            {heading}
                        </Text>
                        {hasBody ? (
                            <div className="flex flex-col gap-4">
                                <PortableText value={section.body} components={portableTextComponents} />
                            </div>
                        ) : (
                            <>
                                <p className="text-base text-[#052237]/80 leading-relaxed">
                                    Our team brings more than fifteen years of hands-on HDD construction experience. Across Nigeria, China, Thailand, Pakistan and Bangladesh, we have completed over 500 horizontal directional drilling crossings totalling more than 300 kilometres — through silt, clay, sand, gravel, cobble and hard rock, with pipe diameters ranging from 6 inches all the way up to 56 inches.
                                </p>
                                <p className="text-base text-[#052237]/80 leading-relaxed">
                                    Year after year on the job site taught us one lesson above all: the correct use of drilling fluid is the foundation of every successful HDD crossing. That is why we moved from <em>using</em> drilling fluids to <em>engineering</em> them. Drawing on our field record, we developed a complete family of HDD drilling fluid materials — bentonite, CMC, viscosity reducers, MMH and xanthan gum — each one formulated to solve the problems we know best.
                                </p>
                            </>
                        )}
                    </div>

                    {/* Lab QA Callout Box */}
                    <div className="lg:col-span-5 bg-[#052237] text-white p-8 rounded-2xl flex flex-col justify-between h-full shadow-sm">
                        <div className="flex flex-col gap-4">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#f4691a]">
                                {calloutBadge}
                            </span>
                            <h3 className="!text-[28px] lg:!text-2xl font-bold text-white leading-snug">
                                {calloutTitle}
                            </h3>
                            <p className="text-sm !text-white leading-relaxed">
                                {calloutText}
                            </p>
                        </div>
                        <div className="pt-6 mt-6 border-t border-white/10 text-xs text-[#f4691a] font-bold">
                            {calloutFooter}
                        </div>
                    </div>
                </div>

                {/* 5 Stats Bar */}
                <div className="w-full pt-10 mt-6 border-t border-black/10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-0 lg:divide-x lg:divide-black/10">
                    {stats.map((item: any, idx: number) => (
                        <div key={idx} className="flex flex-col items-start gap-1 lg:px-8 first:lg:pl-0 last:lg:pr-0">
                            <span className="text-4xl lg:text-5xl font-extrabold text-[#f4691a] leading-none">
                                {item.stat}
                            </span>
                            <span className="text-xs font-bold text-[#052237]/75 leading-snug mt-1">
                                {item.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductsAbout;
