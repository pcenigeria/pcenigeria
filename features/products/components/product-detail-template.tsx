'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ProductDetail } from '../types';
import { Text } from '@/shared/components/ui/text';

interface ProductDetailTemplateProps {
    product: ProductDetail;
}

export const ProductDetailTemplate: React.FC<ProductDetailTemplateProps> = ({ product }) => {
    const [openSdsSection, setOpenSdsSection] = useState<number | null>(() => {
        let initial = 1;
        product.sdsSections?.forEach(sec => {
            if (sec.isDefaultOpen) {
                initial = sec.num;
            }
        });
        return initial;
    });

    const toggleSdsSection = (num: number) => {
        setOpenSdsSection(prev => (prev === num ? null : num));
    };

    return (
        <div className="flex flex-col w-full bg-[#d8e7f1] min-h-screen">
            {/* PART 1 — PRODUCT PHOTO & HERO */}
            <section className="w-full section bg-[#052237] text-white py-[100px] border-b border-white/10">
                <div className="flex flex-col gap-6 w-full">


                    <div className="flex flex-col lg:flex-row items-center justify-between gap-10 w-full">
                        {/* Left Column: Text (constrained width) */}
                        <div className="flex-1 max-w-[640px] flex flex-col gap-4">
                            <div className="flex items-center gap-2 md:gap-3">
                                <span className="w-6 h-[3px] bg-[#f4691a] inline-block shrink-0" />
                                <span className="text-sm uppercase tracking-wider text-white/80 font-semibold">
                                    {product.eyebrow || 'HDD Drilling Fluid Additive'}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
                                {product.title}®
                            </h1>
                            <p className="text-xl font-extrabold !text-[#f4691a]">
                                {product.subtitle || 'Sodium Carboxymethyl Cellulose — Oil Drilling Grade'}
                            </p>
                            <p className="text-base !text-white leading-relaxed font-medium">
                                {product.description}
                            </p>

                            {/* Quick-fact chips */}
                            <div className="flex flex-wrap gap-2 pt-2">
                                {['Non-Toxic', 'Odorless', 'Biodegradable', 'Low Dosage, High Yield'].map((chip, i) => (
                                    <span key={i} className="px-3 py-1 rounded-full bg-white/10 text-white text-xs font-bold border border-white/20">
                                        ✓ {chip}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Product Photo Showcase (Fixed size card pushed to right margin) */}
                        <div className="w-full lg:w-[420px] shrink-0 h-[380px] lg:h-[420px] rounded-2xl overflow-hidden shadow-lg bg-[#052237] border border-white/10 ml-auto">
                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-5xl">
                                    🧪
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* PART 2 — PRODUCT INFORMATION */}
            <section className="w-full section py-[100px] bg-white">
                <div className="flex flex-col gap-14">
                    {/* Product Overview & Features */}
                    <div className="flex flex-col gap-12 lg:gap-16">
                        {/* Top Area: Intro & Image */}
                        <div className="flex flex-col lg:flex-row gap-12 items-start">
                            <div className="flex-1 flex flex-col gap-6">
                                <div className="flex items-center gap-2 md:gap-3">
                                    <span className="w-6 h-[3px] bg-[#f4691a] inline-block shrink-0" />
                                    <span className="text-sm uppercase tracking-wider text-[#052237] font-semibold">
                                        Product Overview
                                    </span>
                                </div>
                                <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight">What {product.title} Is</Text>
                                {product.alsoKnownAs && (
                                    <p className="text-sm text-[#052237]/80 leading-relaxed font-medium">
                                        Also known as: {product.alsoKnownAs}
                                    </p>
                                )}
                                <div className="max-w-[600px]">
                                    {product.overviewText ? (
                                        <p className="text-lg text-[#052237]/80 leading-relaxed">
                                            {product.overviewText}
                                        </p>
                                    ) : (
                                        <p className="text-lg text-[#052237]/80 leading-relaxed">
                                            {product.description}
                                        </p>
                                    )}
                                </div>
                                {product.executiveStandard && (
                                    <div className="py-2 px-4 bg-black/5 rounded inline-block self-start mt-2">
                                        <span className="text-sm font-bold text-[#052237]">Executive Standard:</span> <span className="text-sm font-medium text-[#052237]/70">{product.executiveStandard}</span>
                                    </div>
                                )}
                            </div>
                            {/* Secondary Image */}
                            {product.secondaryImage && (
                                <div className="w-full lg:w-[400px] xl:w-[500px] shrink-0 rounded-2xl overflow-hidden shadow-sm">
                                    <img src={product.secondaryImage} alt={`${product.title} view`} className="w-full h-auto object-cover" />
                                </div>
                            )}
                            {/* What It Does (Moves here if no features exist) */}
                            {(!product.features || product.features.length === 0) && product.whatItDoes && (
                                <div className="w-full lg:w-[400px] xl:w-[500px] shrink-0 flex flex-col gap-4">
                                    <h3 className="text-2xl !font-medium text-[#052237]">What It Does</h3>
                                    <p className="text-lg text-[#052237]/80 leading-relaxed">
                                        {product.whatItDoes}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Bottom Area: 2-Column Split for Functions and Features */}
                        {((product.mainFunctions && product.mainFunctions.length > 0) || (product.features && product.features.length > 0)) && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 pt-12 border-t border-black/10">
                                {/* Left: What It Does or Main Functions */}
                                <div className="flex flex-col gap-6">
                                    {product.whatItDoes && (!product.mainFunctions || product.mainFunctions.length === 0) && (product.features && product.features.length > 0) && (
                                        <div className="flex flex-col gap-4">
                                            <h3 className="text-2xl !font-medium text-[#052237]">What It Does</h3>
                                            <p className="text-lg text-[#052237]/80 leading-relaxed">
                                                {product.whatItDoes}
                                            </p>
                                        </div>
                                    )}
                                    {product.mainFunctions && product.mainFunctions.length > 0 && (
                                        <div className="flex flex-col gap-4">
                                            <h3 className="text-2xl !font-medium text-[#052237]">Main Functions</h3>
                                            <ul className="flex flex-col gap-3 list-disc pl-5">
                                                {product.mainFunctions.map((func, i) => (
                                                    <li key={i} className="text-lg text-[#052237]/80 leading-relaxed">{func}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                </div>

                                {/* Right: Key Features */}
                                <div className="flex flex-col gap-6">
                                    {product.features && product.features.length > 0 && (
                                        <>
                                            <div className="flex flex-col gap-2">
                                                <h3 className="text-2xl !font-medium text-[#052237]">Key Features & Advantages</h3>
                                            </div>
                                            <div className="flex flex-col border-t border-b border-black/10 divide-y divide-black/10 mt-2">
                                                {product.features.map((adv, idx) => (
                                                    <div key={idx} className="py-4 flex items-start gap-4">
                                                        <span className="w-6 h-6 rounded-full bg-[#f4691a]/10 text-[#f4691a] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">✓</span>
                                                        <span className="text-lg text-[#052237]/80 font-normal leading-relaxed">{adv}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* PART 2.5, 2.2, 2.3 — TYPICAL APPLICATIONS, USAGE & SUPPLY */}
            {( (product.applications && product.applications.length > 0) || product.howItsUsed || product.supplyDetails ) && (
                <section className="w-full section py-[100px] bg-[#001723] text-white">
                    <div className="flex flex-col gap-24">
                        
                        {/* TYPICAL APPLICATIONS */}
                        {product.applications && product.applications.length > 0 && (
                            <div className="flex flex-col gap-14">
                                {/* Typical Applications Table / Grid */}
                                <div className="flex flex-col gap-8">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <span className="w-6 h-[3px] bg-[#f4691a] inline-block shrink-0" />
                                            <span className="text-sm uppercase tracking-wider text-white/80 font-semibold">Where It Is Used</span>
                                        </div>
                                        <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight !text-white">Typical Drilling Applications</Text>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-x-16 gap-y-8 mt-4">
                                        {product.applications.map((app, index) => (
                                            <div 
                                                key={index} 
                                                className={`py-8 border-b border-white/20 flex flex-col gap-3 ${
                                                    index === 0 ? 'border-t' : ''
                                                } ${
                                                    index > 0 && index < 4 ? 'md:border-t' : ''
                                                }`}
                                            >
                                                <span className="text-xl font-extrabold text-[#f4691a]">{app.title}</span>
                                                <span className="text-base text-white/70 leading-relaxed font-medium">{app.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* HOW IT IS USED */}
                        {product.howItsUsed && (
                            <div className="flex flex-col gap-10">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <span className="w-6 h-[3px] bg-[#f4691a] inline-block shrink-0" />
                                        <span className="text-sm uppercase tracking-wider text-white/80 font-semibold">Application & Dosage</span>
                                    </div>
                                    <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight !text-white">How {product.title} Is Used</Text>
                                </div>
                                                 {/* Suitability */}
                                {/* Suitability */}
                                {product.howItsUsed.suitability && (
                                    <p className="text-lg text-white/80 leading-relaxed font-medium">
                                        {product.howItsUsed.suitability}
                                    </p>
                                )}
                                
                                {/* Dosage Table */}
                                {product.howItsUsed.dosageTable && product.howItsUsed.dosageTable.length > 0 && (
                                    <div className="overflow-x-auto w-full bg-white p-6 shadow-sm border border-black/5 mt-4">
                                        <table className="w-full text-left text-sm md:text-base border-b border-black/10">
                                            <thead className="bg-white text-gray-500 uppercase tracking-wider font-semibold border-b border-black/10 text-xs md:text-sm">
                                                <tr>
                                                    <th className="px-6 py-5">Use</th>
                                                    <th className="px-6 py-5 border-l border-black/5">Dosage</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-black/10">
                                                {product.howItsUsed.dosageTable.map((row, i) => (
                                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                        <td className="px-6 py-5 font-bold text-[#052237]">{row.use}</td>
                                                        <td className="px-6 py-5 font-semibold text-[#1470AD] border-l border-black/5">{row.dosage}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Application & Dosage Cards */}
                                {(product.howItsUsed.application || product.howItsUsed.dosage) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {product.howItsUsed.application && (
                                            <div className="p-8 bg-white/5 rounded-2xl flex flex-col gap-4">
                                                <h3 className="text-xl font-bold text-[#f4691a]">Application</h3>
                                                <p className="text-lg text-white/90 leading-relaxed font-medium">{product.howItsUsed.application}</p>
                                            </div>
                                        )}
                                        {product.howItsUsed.dosage && (
                                            <div className="p-8 bg-white/5 rounded-2xl flex flex-col gap-4">
                                                <h3 className="text-xl font-bold text-[#f4691a]">Dosage</h3>
                                                <p className="text-lg text-white/90 leading-relaxed font-medium">{product.howItsUsed.dosage}</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Mixing Steps */}
                                {product.howItsUsed.mixingSteps && product.howItsUsed.mixingSteps.length > 0 && (
                                    <div className="flex flex-col gap-4 mt-8">
                                        <h3 className="text-2xl font-bold text-white">Mixing Procedure</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-16 gap-y-8 mt-4">
                                            {product.howItsUsed.mixingSteps.map((step, i) => (
                                                <div 
                                                    key={i} 
                                                    className={`py-8 border-b border-white/20 flex flex-col gap-3 ${
                                                        i === 0 ? 'border-t' : ''
                                                    } ${
                                                        i > 0 && i < 4 ? 'md:border-t' : ''
                                                    }`}
                                                >
                                                    <span className="text-xl font-extrabold text-[#f4691a]">Step {i + 1}</span>
                                                    <p className="text-base text-white/70 leading-relaxed font-medium">{step}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {product.howItsUsed.precaution && (
                                    <div className="p-6 rounded-2xl border border-red-500/30 bg-red-500/10">
                                        <p className="text-base text-red-200 font-medium">{product.howItsUsed.precaution}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* GALLERY / BENTO GRID */}
                        {product.galleryImages && product.galleryImages.length >= 3 && (
                            <div className="flex flex-col gap-6 mt-12 mb-12">
                                {product.galleryImages.length === 3 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px] md:h-[800px]">
                                        <div className="h-full rounded-3xl overflow-hidden shadow-sm relative group bg-white/5 border border-white/10">
                                            <Image src={product.galleryImages[0]} alt="Gallery image 1" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                        </div>
                                        <div className="grid grid-rows-2 gap-4 h-full">
                                            <div className="h-full rounded-3xl overflow-hidden shadow-sm relative group bg-white/5 border border-white/10">
                                                <Image src={product.galleryImages[1]} alt="Gallery image 2" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                            </div>
                                            <div className="h-full rounded-3xl overflow-hidden shadow-sm relative group bg-white/5 border border-white/10">
                                                <Image src={product.galleryImages[2]} alt="Gallery image 3" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {product.galleryImages.length === 4 && (
                                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 h-[600px] md:h-[900px]">
                                        <div className="md:col-span-3 h-full rounded-3xl overflow-hidden shadow-sm relative group bg-white/5 border border-white/10">
                                            <Image src={product.galleryImages[0]} alt="Gallery image 1" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                        </div>
                                        <div className="md:col-span-2 grid grid-rows-3 gap-4 h-full">
                                            {product.galleryImages.slice(1, 4).map((img, idx) => (
                                                <div key={idx} className="h-full rounded-3xl overflow-hidden shadow-sm relative group bg-white/5 border border-white/10">
                                                    <Image src={img} alt={`Gallery image ${idx + 2}`} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {product.galleryImages.length >= 5 && (
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[700px] md:h-[900px]">
                                        <div className="grid grid-rows-2 gap-4 h-full hidden md:grid">
                                            <div className="h-full rounded-3xl overflow-hidden shadow-sm relative group bg-white/5 border border-white/10">
                                                <Image src={product.galleryImages[0]} alt="Gallery image 1" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                            </div>
                                            <div className="h-full rounded-3xl overflow-hidden shadow-sm relative group bg-white/5 border border-white/10">
                                                <Image src={product.galleryImages[1]} alt="Gallery image 2" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 h-full rounded-3xl overflow-hidden shadow-sm relative group bg-white/5 border border-white/10">
                                            <Image src={product.galleryImages[2]} alt="Gallery image 3" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                        </div>
                                        <div className="grid grid-rows-2 gap-4 h-full hidden md:grid">
                                            <div className="h-full rounded-3xl overflow-hidden shadow-sm relative group bg-white/5 border border-white/10">
                                                <Image src={product.galleryImages[3]} alt="Gallery image 4" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                            </div>
                                            <div className="h-full rounded-3xl overflow-hidden shadow-sm relative group bg-white/5 border border-white/10">
                                                <Image src={product.galleryImages[4]} alt="Gallery image 5" fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* PACKAGING, STORAGE & TRANSPORT */}
                        {product.supplyDetails && product.supplyDetails.length > 0 && (
                            <div className="flex flex-col gap-10">
                                <div className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <span className="w-6 h-[3px] bg-[#f4691a] inline-block shrink-0" />
                                        <span className="text-sm uppercase tracking-wider text-white/80 font-semibold">Packaging, Storage & Transport</span>
                                    </div>
                                    <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight !text-white">How It's Supplied</Text>
                                </div>
                                {product.storageInfo && (
                                    <div className="flex flex-col gap-1 -mt-4 mb-4" style={{ maxWidth: '800px' }}>
                                        <span className="font-medium text-white/50" style={{ fontSize: '28px' }}>Storage</span>
                                        <p className="text-lg font-medium text-white/90 leading-relaxed">{product.storageInfo}</p>
                                    </div>
                                )}
                                
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {product.supplyDetails.map((detail, idx) => (
                                        <div key={idx} className="p-8 bg-white/5 rounded-2xl flex flex-col gap-2">
                                            <h4 className="text-sm uppercase tracking-widest text-white/50 font-bold">{detail.label}</h4>
                                            <p className="text-lg font-medium text-white/90">{detail.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                    </div>
                </section>
            )}

            {/* PART 2.5 — KEY SPECIFICATIONS (simple label/value list from Sanity specRows) */}
            {product.specs && product.specs.length > 0 && (
                <section className="w-full section py-[100px] bg-white border-b border-black/10">
                    <div className="flex flex-col gap-16">
                        <div className="flex flex-col gap-2">
                            <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight max-w-[900px]">Key Specifications</Text>
                        </div>
                        <div className="overflow-x-auto w-full bg-white shadow-sm border border-black/5">
                            <table className="w-full text-left text-sm md:text-base">
                                <tbody className="divide-y divide-black/5 font-medium text-[#052237]">
                                    {product.specs.map((spec, sIdx) => (
                                        <tr key={sIdx} className="hover:bg-black/[0.02] transition-colors">
                                            <td className="px-6 py-5 font-bold text-gray-500 uppercase tracking-wide text-xs md:text-sm w-1/3">{spec.label}</td>
                                            <td className="px-6 py-5 font-bold text-[#1470AD]">{spec.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>
            )}

            {/* PART 3 — TECHNICAL DATA SHEET (TDS SPEC) */}
            {product.specTables && product.specTables.length > 0 && (
                <section className="w-full section py-[100px] bg-[var(--color-canvas-tint)] border-b border-black/10">
                    <div className="flex flex-col gap-16">
                        <div className="flex flex-col gap-2">
                            <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight max-w-[900px]">Technical Data Sheet</Text>
                        </div>

                        {product.specTestConditions && (
                            <div className="flex flex-col gap-1 -mt-8" style={{ maxWidth: '600px' }}>
                                <span className="font-medium text-gray-500" style={{ fontSize: '28px' }}>Test Conditions</span>
                                <p className="text-lg font-medium text-[#052237]/80 leading-relaxed">{product.specTestConditions}</p>
                            </div>
                        )}

                        <div className={`grid grid-cols-1 ${product.specTables.length > 1 ? 'lg:grid-cols-2' : ''} gap-8`}>
                            {product.specTables.map((table, tIdx) => (
                                <div key={tIdx} className="flex flex-col gap-6">
                                    <h3 className="text-2xl font-bold text-[#052237]">{table.title}</h3>
                                    <div className="overflow-x-auto w-full bg-white p-6 shadow-sm border border-black/5 h-full">
                                        <table className="w-full text-left text-sm md:text-base border-b border-black/10">
                                            <thead className="bg-white text-gray-500 uppercase tracking-wider font-semibold border-b border-black/10 text-xs md:text-sm">
                                                <tr>
                                                    {table.headers.map((header, hIdx) => (
                                                        <th key={hIdx} className={`px-6 py-5 ${hIdx > 0 ? 'border-l border-black/5' : ''}`}>{header}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-black/5 font-medium text-[#052237] bg-white">
                                                {table.rows.map((row, rIdx) => (
                                                    <tr key={rIdx} className="hover:bg-black/[0.02] transition-colors">
                                                        {row.map((cell, cIdx) => (
                                                            <td key={cIdx} className={`px-6 py-5 ${cIdx === 0 ? 'font-bold' : ''} ${cIdx === row.length - 1 ? 'font-bold text-[#1470AD]' : ''} ${cIdx > 0 ? 'border-l border-black/5' : ''}`}>{cell}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* {product.technicalImages && product.technicalImages.length > 0 && (
                            <div className={`grid grid-cols-1 ${product.technicalImages.length > 1 ? 'md:grid-cols-2' : ''} gap-8 mt-12`}>
                                {product.technicalImages.map((img, idx) => (
                                    <div key={idx} className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-sm border border-black/10">
                                        <Image 
                                            src={img}
                                            alt={`${product.title} technical illustration ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        )} */}
                    </div>
                </section>
            )}

            {/* STANDALONE SAFETY AT A GLANCE BANNER */}
            {product.safetyAtAGlance && (
                <section className="w-full section py-[100px] bg-[#052237] text-white text-center border-b border-black/10">
                    <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
                        <div className="flex items-center gap-2">
                            <span className="w-6 h-[3px] bg-[#f4691a] inline-block" />
                            <span className="text-sm uppercase tracking-wider text-white/80 font-semibold">
                                Safety at a Glance
                            </span>
                        </div>
                        <Text variant="display-lg" as="h2" intent="default" className="!text-white !font-extrabold leading-tight">Handle With Confidence</Text>
                        
                        {product.safetyAtAGlance.cautionStrip && (
                            <div className="w-full bg-[#f4691a]/10 border border-[#f4691a] text-white p-6 rounded-xl text-left max-w-4xl mx-auto flex items-start gap-4">
                                <span className="text-[#f4691a] text-2xl shrink-0 mt-0.5">⚠️</span>
                                <p className="leading-relaxed text-[#f4691a] font-medium text-lg">
                                    <strong>Caution:</strong> {product.safetyAtAGlance.cautionStrip}
                                </p>
                            </div>
                        )}
                        {(product.safetyAtAGlance.ghsHazard || product.safetyAtAGlance.hazardClass) && (
                            <p className="text-base !text-white leading-relaxed max-w-2xl mx-auto">
                                <strong>GHS Hazard Classification:</strong> {product.safetyAtAGlance.ghsHazard || product.safetyAtAGlance.hazardClass}
                            </p>
                        )}

                        {/* Safety Tables Container */}
                        <div className={`w-full mt-8 grid grid-cols-1 gap-8 ${product.safetyAtAGlance.ppe && product.safetyAtAGlance.physicalChemical ? 'lg:grid-cols-2' : 'max-w-3xl mx-auto'}`}>
                            {/* PPE Table */}
                            {product.safetyAtAGlance.ppe && product.safetyAtAGlance.ppe.length > 0 && (
                                <div className="w-full bg-white p-6 shadow-sm border border-black/5 flex flex-col gap-4">
                                    <h4 className="text-lg font-bold text-[#052237] text-left">Quick PPE Reference</h4>
                                    <table className="w-full text-left text-sm md:text-base border-b border-black/10">
                                        <thead className="bg-white text-gray-500 uppercase tracking-wider font-semibold border-b border-black/10 text-xs md:text-sm">
                                            <tr>
                                                <th className="px-6 py-5 w-1/3">Protection</th>
                                                <th className="px-6 py-5 border-l border-black/5">Recommended</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black/10 bg-white">
                                            {product.safetyAtAGlance.ppe.map((item, i) => (
                                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-5 font-bold text-[#f4691a]">{item.type}</td>
                                                    <td className="px-6 py-5 font-medium text-[#052237] border-l border-black/5">{item.recommendation}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Physical & Chemical Table */}
                            {product.safetyAtAGlance.physicalChemical && product.safetyAtAGlance.physicalChemical.length > 0 && (
                                <div className="w-full bg-white p-6 shadow-sm border border-black/5 flex flex-col gap-4">
                                    <h4 className="text-lg font-bold text-[#052237] text-left">Physical & Chemical Snapshot</h4>
                                    <table className="w-full text-left text-sm md:text-base border-b border-black/10">
                                        <thead className="bg-white text-gray-500 uppercase tracking-wider font-semibold border-b border-black/10 text-xs md:text-sm">
                                            <tr>
                                                <th className="px-6 py-5 w-1/3">Property</th>
                                                <th className="px-6 py-5 border-l border-black/5">Value</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-black/10 bg-white">
                                            {product.safetyAtAGlance.physicalChemical.map((item, i) => (
                                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-6 py-5 font-bold text-[#f4691a]">{item.property}</td>
                                                    <td className="px-6 py-5 font-medium text-[#052237] border-l border-black/5">{item.value}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        {/* Dynamic Safety Ratings */}
                        {product.safetyAtAGlance.ratings && product.safetyAtAGlance.ratings.length > 0 && (
                            <div className="flex items-center justify-center gap-4 pt-6 mt-2 border-t border-white/10 w-full max-w-lg mx-auto flex-wrap">
                                <span className="text-xs font-bold uppercase text-white/70">
                                    {product.safetyAtAGlance.ratingSystemName || 'Safety Rating'}:
                                </span>
                                {product.safetyAtAGlance.ratings.map((rating, i) => (
                                    <span key={i} className={`px-3 py-1 rounded ${rating.color} ${rating.textColor} text-xs font-extrabold`}>
                                        {rating.label}: {rating.value}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            )}

            {/* PART 4 — SAFETY DATA SHEET (SDS & GHS 16-SECTION) */}
            {product.sdsSections && product.sdsSections.length > 0 && (
                <section className="w-full section py-[100px] bg-white border-b border-black/10">
                    <div className="flex flex-col gap-12">
                        {/* Full 16-Section SDS Accordion */}
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col items-center justify-center text-center gap-2">
                                <div className="flex items-center justify-center gap-2 md:gap-3">
                                    <span className="w-6 h-[3px] bg-[#f4691a] inline-block shrink-0" />
                                    <span className="text-sm uppercase tracking-wider text-[#052237] font-semibold">Regulatory Compliance</span>
                                </div>
                                <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight max-w-[900px] mx-auto">
                                    {product.sdsTitle || 'Full Safety Data Sheet'}
                                </Text>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full mx-auto items-start">
                                {product.sdsSections.map((sec) => {
                                    const isOpen = openSdsSection === sec.num;
                                    return (
                                        <div key={sec.num} className="border border-black/10 rounded-xl bg-white overflow-hidden shadow-sm">
                                            <button
                                                onClick={() => toggleSdsSection(sec.num)}
                                                className="w-full p-4 md:p-6 text-left flex items-center justify-between font-bold text-[20px] text-[#052237] hover:bg-black/5 transition-colors"
                                            >
                                                <span>{sec.title}</span>
                                                <span className="text-xl text-[#f4691a]">{isOpen ? '−' : '+'}</span>
                                            </button>
                                            {isOpen && (
                                                <div className="p-4 md:p-6 pt-0 md:pt-0 text-sm md:text-base text-[#052237]/80 leading-relaxed border-t border-black/5 bg-[#d8e7f1]/30">
                                                    {sec.content}
                                                    {sec.table && (
                                                        <div className="overflow-x-auto w-full bg-white p-4 shadow-sm border border-black/5 mt-4 rounded-xl">
                                                            <table className="w-full text-left text-sm border-b border-black/10">
                                                                <thead className="bg-gray-50 text-gray-600 uppercase tracking-wider font-semibold border-b border-black/10 text-xs">
                                                                    <tr>
                                                                        {sec.table.headers.map((h, i) => (
                                                                            <th key={i} className={`px-4 py-3 ${i > 0 ? 'border-l border-black/5' : ''}`}>{h}</th>
                                                                        ))}
                                                                    </tr>
                                                                </thead>
                                                                <tbody className="divide-y divide-black/10 bg-white">
                                                                    {sec.table.rows.map((row, rIdx) => (
                                                                        <tr key={rIdx} className="hover:bg-gray-50 transition-colors">
                                                                            {row.map((cell, cIdx) => (
                                                                                <td key={cIdx} className={`px-4 py-3 font-medium text-[#052237]/90 ${cIdx > 0 ? 'border-l border-black/5' : ''}`}>{cell}</td>
                                                                            ))}
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* PART 5 — DIRECT SALES & ENGINEERING CONTACTS */}
            {product.salesContacts && product.salesContacts.length > 0 && (
                <section className="w-full section py-[100px] bg-white">
                    <div className="flex flex-col gap-12">
                        <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight !text-[#052237]">
                            Direct Sales & Engineering Contacts
                        </Text>

                        {/* 3 Sales Contacts (Pure Typography Divider Bar - No Cards) */}
                        <div className="w-full pt-4 border-t border-black/10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-black/10">
                            {product.salesContacts.map((contact, i) => (
                                <div key={i} className="flex flex-col items-start gap-1.5 md:px-8 first:md:pl-0 last:md:pr-0">
                                    <span className="text-xl font-extrabold text-[#052237] mb-1">{contact.name}</span>
                                    <a href={`tel:${contact.phone.replace(/[^0-9+]/g, '')}`} className="text-sm font-bold text-[#1470AD] hover:underline no-underline flex items-center gap-1.5">
                                        📞 {contact.phone}
                                    </a>
                                    <a href={`mailto:${contact.email}`} className="text-sm font-bold text-[#1470AD] hover:underline no-underline flex items-center gap-1.5">
                                        ✉️ {contact.email}
                                    </a>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default ProductDetailTemplate;
