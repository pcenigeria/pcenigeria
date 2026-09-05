'use client';

import React from 'react';
import { PortableText } from '@portabletext/react';
import { Text } from '@/shared/components/ui/text';

interface PerformanceMatrixProps {
    section?: any;
}

const DEFAULT_TAGLINE = 'Performance Matrix';
const DEFAULT_HEADING = 'Technical Specification & Performance Comparison';
const DEFAULT_BODY = 'Compare physical properties, rheology modifications, filtration control, and environmental ratings across the five Brighter Star products:';

const bodyComponents = {
    block: {
        normal: ({ children }: any) => (
            <p className="text-base text-[#052237]/80 leading-relaxed font-medium max-w-[700px]">{children}</p>
        ),
    },
};

export const PerformanceMatrix: React.FC<PerformanceMatrixProps> = ({ section }) => {
    const tagline = section?.tagline || DEFAULT_TAGLINE;
    const heading = section?.heading || DEFAULT_HEADING;
    const hasBody = Array.isArray(section?.body) && section.body.length > 0;

    const matrixData = [
        {
            product: 'BRSBENT SQ',
            ingredient: 'Premium bentonite',
            viscosity: 'Excellent',
            reduceViscosity: 'N/A',
            dynamicShear: 'Excellent',
            filtration: 'Excellent',
            salinity: 'N/A',
            stratum: 'All strata',
            hazard: 'None',
        },
        {
            product: 'BRSCMC',
            ingredient: 'Sodium carboxymethyl cellulose',
            viscosity: 'Very good',
            reduceViscosity: 'N/A',
            dynamicShear: 'Very good',
            filtration: 'Excellent',
            salinity: 'N/A',
            stratum: 'Sand / Gravel / Rock',
            hazard: 'None',
        },
        {
            product: 'BRSMMH',
            ingredient: 'Positive electric adhesive dry powder',
            viscosity: 'Very good',
            reduceViscosity: 'N/A',
            dynamicShear: 'Excellent',
            filtration: 'N/A',
            salinity: 'N/A',
            stratum: 'Rock Formations',
            hazard: 'None',
        },
        {
            product: 'BRSVR',
            ingredient: 'Clay viscosity reducer',
            viscosity: 'N/A',
            reduceViscosity: 'Excellent',
            dynamicShear: 'N/A',
            filtration: 'N/A',
            salinity: 'N/A',
            stratum: 'Clay Formations',
            hazard: 'None',
        },
        {
            product: 'BRSXTG',
            ingredient: 'Xanthan gum',
            viscosity: 'Good',
            reduceViscosity: 'N/A',
            dynamicShear: 'Good',
            filtration: 'Good',
            salinity: 'Excellent',
            stratum: 'High-Salinity Formations',
            hazard: 'None',
        },
    ];

    const TABLE_HEADERS = [
        { label: 'Product & Main Ingredient', className: 'w-[220px] max-w-[220px] px-4' },
        { label: 'Increase Viscosity', className: 'px-3' },
        { label: 'Reduce Viscosity', className: 'px-3' },
        { label: 'Dynamic Shear', className: 'px-3' },
        { label: 'Reduce Filtration', className: 'px-3' },
        { label: 'High Salinity', className: 'px-3' },
        { label: 'Suitable Stratum', className: 'px-3' },
        { label: 'Env Hazard', className: 'px-3' },
    ];

    const renderRating = (val: string) => {
        if (val === 'Excellent') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-extrabold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" /> Excellent
                </span>
            );
        }
        if (val === 'Very good') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-900 border border-cyan-200 text-xs font-extrabold">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-600 shrink-0" /> Very Good
                </span>
            );
        }
        if (val === 'Good') {
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 text-xs font-extrabold">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" /> Good
                </span>
            );
        }
        return <span className="text-black/30 font-semibold text-xs px-2">—</span>;
    };

    return (
        <section className="w-full section bg-white">
            <div className="flex flex-col gap-20">
                <div className="flex flex-col gap-3 max-w-xl">
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-[3px] bg-[#f4691a] inline-block" />
                        <span className="text-sm uppercase tracking-wider text-[#052237] font-semibold">
                            {tagline}
                        </span>
                    </div>
                    <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight !text-[#052237] max-w-[900px]">
                        {heading}
                    </Text>
                    {hasBody ? (
                        <PortableText value={section.body} components={bodyComponents} />
                    ) : (
                        <p className="text-base text-[#052237]/80 leading-relaxed font-medium max-w-[700px]">
                            {DEFAULT_BODY}
                        </p>
                    )}
                </div>

                {/* Clean Performance Matrix Table Container */}
                <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-end text-xs font-bold text-[#052237]/60 md:hidden">
                        <span>← Scroll table horizontally →</span>
                    </div>
                    <div className="w-full rounded-2xl border border-black/10 shadow-sm bg-white overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left text-xs border-collapse">
                        <thead className="bg-[#052237] text-white">
                            <tr>
                                {TABLE_HEADERS.map((header, i) => (
                                    <th key={i} className={`py-4 font-extrabold uppercase tracking-wider text-white ${header.className}`}>
                                        {header.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-black/10">
                            {matrixData.map((row, idx) => (
                                <tr key={idx} className="odd:bg-white even:bg-[#d8e7f1]/20 hover:bg-[#d8e7f1]/50 transition-colors">
                                    <td className="py-4 px-4 w-[220px] max-w-[220px]">
                                        <div className="flex flex-col gap-0.5">
                                            <span className="font-extrabold text-[#052237] text-sm">{row.product}</span>
                                            <span className="text-xs text-[#052237]/75 font-medium leading-normal break-words">{row.ingredient}</span>
                                        </div>
                                    </td>
                                    <td className="py-4 px-3">{renderRating(row.viscosity)}</td>
                                    <td className="py-4 px-3">{renderRating(row.reduceViscosity)}</td>
                                    <td className="py-4 px-3">{renderRating(row.dynamicShear)}</td>
                                    <td className="py-4 px-3">{renderRating(row.filtration)}</td>
                                    <td className="py-4 px-3">{renderRating(row.salinity)}</td>
                                    <td className="py-4 px-3">
                                        <span className="inline-block px-2.5 py-1 rounded-lg bg-[#052237]/10 text-[#052237] font-extrabold text-[11px]">
                                            {row.stratum}
                                        </span>
                                    </td>
                                    <td className="py-4 px-3">
                                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-extrabold text-[11px]">
                                            🛡️ None
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </section>
    );
};

export default PerformanceMatrix;
