'use client';

import React from 'react';
import { Text } from '@/shared/components/ui/text';

interface HddCaseStudiesProps {
    section?: any;
}

const DEFAULT_CASE_STUDIES = [
    {
        num: '01',
        title: 'OB3 RNC HDD Project',
        country: 'Nigeria · NGIC',
        lengthDia: '2,000 m × 48″',
        depth: '52 m',
        stratum: 'Sand / gravel',
        rigs: '1,200T / 500T',
        products: 'BRSBENT SQ + BRSCMC',
        desc: 'A 2 km crossing of the Niger River at 52 m depth through complex sand and gravel strata — the largest-scale HDD project in Nigeria.',
    },
    {
        num: '02',
        title: 'AKK Niger River HDD Project',
        country: 'Nigeria · NGIC',
        lengthDia: '1,565 m × 40″',
        depth: '16 m',
        stratum: 'Sand / gravel / rock',
        rigs: '1,200T / 350T',
        products: 'BRSBENT SQ + BRSCMC',
        desc: 'A 1,565 m crossing of the Niger River through complex sand, gravel and rock on the strategic AKK gas pipeline project.',
    },
    {
        num: '03',
        title: 'Fuzhou River HDD Crossing',
        country: 'China · SWG',
        lengthDia: '2,100 m × 40″',
        depth: '35 m',
        stratum: 'Sand / gravel',
        rigs: '1,000T / 600T',
        products: 'BRSBENT SQ + BRSCMC',
        desc: 'A 2.1 km EPC crossing of the Min Jiang River at 35 m depth — a showcase of filtration control and borehole stability.',
    },
    {
        num: '04',
        title: 'Zhanjiang Offshore HDD Crossing',
        country: 'China · CNOOC',
        lengthDia: '2,200 m × 5 × 20″',
        depth: '42 m',
        stratum: 'Rock / sand (marine)',
        rigs: '1,000T / 600T',
        products: 'BRSBENT SQ + BRSMMH + BRSXTG',
        desc: 'Five parallel 2.2 km onshore-to-offshore crossings through marine sedimentary rock and sand. BRSMMH lifted rock cuttings while BRSXTG prevented salt flocculation.',
    },
    {
        num: '05',
        title: 'Raoyang River HDD Crossing',
        country: 'China · CNPC',
        lengthDia: '2,293 m × 48″',
        depth: '27.5 m',
        stratum: 'Sand / gravel / rock',
        rigs: '1,000T / 600T',
        products: 'BRSBENT SQ + BRSCMC',
        desc: 'A 2.3 km, 48-inch crossing of the Raoyang River through sand, gravel and rock — among the largest HDD crossings in China.',
    },
    {
        num: '06',
        title: 'Tianjin LNG HDD Crossing',
        country: 'China · CNPC',
        lengthDia: '655 / 750 / 860 m × 56″',
        depth: '30 m',
        stratum: 'Sand with clay',
        rigs: '1,000T / 600T',
        products: 'BRSBENT SQ + BRSCMC / BRSVR',
        desc: 'Three river crossings with 56-inch pipe — the largest pipe-size HDD crossing in China — through sand with clay at 30 m depth.',
    },
    {
        num: '07',
        title: '5TP-1 36″ Branch HDD Crossing',
        country: 'Thailand · PTT',
        lengthDia: '1,700 m × 36″',
        depth: '20 m',
        stratum: 'High-viscosity clay',
        rigs: '600T',
        products: 'BRSBENT SQ + BRSVR',
        desc: 'The longest large-diameter HDD in Thailand through high-viscosity clay. BRSVR kept clay dispersed and torque low across the full drive.',
    },
    {
        num: '08',
        title: '5TP-1 HDD1 Gulf Crossing',
        country: 'Thailand · PTT',
        lengthDia: '1,400 m × 42″',
        depth: '20 m',
        stratum: 'Sand / granite rock',
        rigs: '600T',
        products: 'BRSBENT SQ + BRSMMH',
        desc: 'The largest-scale HDD in Thailand — 1.4 km through sand and granite rock. BRSMMH provided the carrying capacity needed to lift granite cuttings.',
    },
];

export const HddCaseStudies: React.FC<HddCaseStudiesProps> = ({ section }) => {
    const tagline = section?.tagline || 'Proven in the Field';
    const heading = section?.heading || 'Typical HDD Project Case Studies';
    const subtext = section?.subtext || 'Validated on large-scale HDD crossings across Nigeria, China, and Thailand.';

    const caseStudies = (section?.items && section.items.length > 0) ? section.items : DEFAULT_CASE_STUDIES;

    return (
        <section className="w-full section bg-[#d8e7f1]">
            <div className="flex flex-col gap-20">
                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-[3px] bg-[#f4691a] inline-block" />
                        <span className="text-sm uppercase tracking-wider text-[#052237] font-semibold">
                            {tagline}
                        </span>
                    </div>
                    <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight !text-[#052237]">
                        {heading}
                    </Text>
                    <p className="text-base text-[#052237]/80 max-w-3xl">
                        {subtext}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {caseStudies.map((cs: any) => (
                        <div key={cs.num} className="bg-white p-6 rounded-2xl border border-black/10 flex flex-col justify-between shadow-sm">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-extrabold text-[#f4691a]">{cs.num}</span>
                                    <span className="text-[10px] font-bold text-[#052237]/70 bg-[#052237]/5 px-2 py-0.5 rounded">
                                        {cs.country}
                                    </span>
                                </div>
                                <h3 className="!text-[28px] lg:!text-xl font-extrabold text-[#052237] leading-tight mb-2">{cs.title}</h3>
                                <div className="text-xs font-bold text-[#1470AD] mb-3">{cs.lengthDia}</div>
                                <p className="text-xs text-[#052237]/80 leading-relaxed mb-4">{cs.desc}</p>
                            </div>
                            <div className="pt-3 border-t border-black/5 text-[10px] font-bold text-[#052237]">
                                Products: <span className="text-[#f4691a]">{cs.products}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HddCaseStudies;
