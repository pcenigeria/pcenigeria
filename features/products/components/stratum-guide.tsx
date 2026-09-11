'use client';

import React from 'react';
import Link from 'next/link';
import { Text } from '@/shared/components/ui/text';

interface StratumGuideProps {
    section?: any;
}

const DEFAULT_CARDS = [
    {
        title: 'Clay Formations',
        tags: ['High Viscosity', 'High Torque', 'Pipe Balling', 'Frac-Out Risk'],
        desc: 'Clay swells and sticks to the drill string and reamer, driving torque up sharply and choking the annulus. Without control, mud pressure builds until it breaks out.',
        recommended: 'BRSBENT SQ + BRSVR',
        proofPoint: 'BRSVR disperses clay and cuts torque over 90% in field records.',
    },
    {
        title: 'Sandy Formations',
        tags: ['Unconsolidated', 'Borehole Collapse', 'Pipe Sticking', 'Frac-Out Risk'],
        desc: 'Sand offers no natural stability: the borehole wall caves in easily, cuttings settle fast, and the drill string can be buried. Requires a tough, low-loss filter cake.',
        recommended: 'BRSBENT SQ + BRSCMC',
        proofPoint: 'Our most-used combination, from the Niger River to the Min Jiang River.',
    },
    {
        title: 'Rock Formations',
        tags: ['Poor Transport', 'Secondary Grinding', 'Severe Tool Wear', 'Low ROP'],
        desc: 'Rock cuttings are heavy and angular. If mud cannot carry them out, they are ground a second time at the bit — wearing out tooling and slowing ROP.',
        recommended: 'BRSBENT SQ + BRSMMH',
        proofPoint: 'BRSMMH boosts carrying capacity on long rock crossings such as Zhanjiang.',
    },
    {
        title: 'Marine Sedimentary',
        tags: ['System Failure', 'Salt Contamination', 'Pipe Sticking'],
        desc: 'Salt water and high-salinity formations flocculate ordinary bentonite muds, destroying viscosity and filtration control precisely where the crossing is hardest.',
        recommended: 'BRSBENT SQ + BRSXTG',
        proofPoint: 'BRSXTG keeps mud system stable for the full duration of offshore drives.',
    },
];

export const StratumGuide: React.FC<StratumGuideProps> = ({ section }) => {
    const tagline = section?.tagline || 'Know the Ground';
    const heading = section?.heading || 'HDD Challenges & Recommended Mud Systems';
    const intro = section?.intro || 'Each formation puts its own demands on the drilling fluid. The Brighter Star product family — BRSBENT SQ, BRSCMC, BRSMMH, BRSVR and BRSXTG — was engineered specifically against these four challenge profiles to ensure bore stability and success.';
    const buttonText = section?.buttonText || 'Consult Engineering Team →';
    const buttonLink = section?.buttonLink || '/contact';

    const cards = (section?.cards && section.cards.length > 0) ? section.cards : DEFAULT_CARDS;

    return (
        <section className="w-full section bg-[#d8e7f1]">
            <div className="flex flex-col gap-20">
                {/* Header Block matching Home Capabilities Grid Pattern */}
                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-end">
                    {/* Left Column: Headline */}
                    <div className="lg:col-span-7 flex flex-col items-start gap-3">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-[3px] bg-[#f4691a] inline-block" />
                            <span className="text-sm uppercase tracking-wider text-[#052237] font-semibold">
                                {tagline}
                            </span>
                        </div>
                        <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight !text-[#052237]">
                            {heading}
                        </Text>
                    </div>

                    {/* Right Column: Positioned right, text & button neatly stacked together */}
                    <div className="lg:col-span-5 flex justify-start lg:justify-end">
                        <div className="flex flex-col items-start gap-4 max-w-[440px]">
                            <p className="text-sm md:text-base text-[#052237]/80 leading-relaxed font-medium text-left">
                                {intro}
                            </p>
                            <Link
                                href={buttonLink}
                                className="inline-flex items-center gap-2 bg-[#052237] hover:bg-[#f4691a] text-white text-xs uppercase tracking-wider font-extrabold py-3 px-6 rounded-md transition-colors no-underline shadow-sm"
                            >
                                {buttonText}
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                    {cards.map((card: any, i: number) => (
                        <div key={i} className="bg-white rounded-2xl p-6 border border-black/10 flex flex-col justify-between shadow-sm">
                            <div className="flex flex-col gap-3">
                                <h3 className="!text-[28px] lg:!text-2xl font-extrabold text-[#052237] leading-tight">{card.title}</h3>
                                <div className="flex flex-wrap gap-1.5">
                                    {(card.tags || []).map((tag: string, tIdx: number) => (
                                        <span key={tIdx} className="text-[10px] font-bold text-[#052237] bg-[#052237]/10 px-2 py-0.5 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-sm text-[#052237]/80 leading-relaxed">{card.desc}</p>
                            </div>

                            <div className="mt-6 pt-4 border-t border-black/10 flex flex-col gap-2 bg-[#d8e7f1]/40 p-3.5 rounded-xl">
                                <div>
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#f4691a] block">
                                        Recommended Mud System
                                    </span>
                                    <span className="text-sm font-extrabold text-[#052237]">
                                        {card.recommended}
                                    </span>
                                </div>
                                <p className="text-xs text-[#052237]/80 font-medium">
                                    ★ {card.proofPoint}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default StratumGuide;
