'use client';

import React from 'react';
import Link from 'next/link';
import { Text } from '@/shared/components/ui/text';

interface ProductsCtaProps {
    section?: any;
}

const DEFAULT_TAGLINE = 'Brighter Star Drilling Fluids';
const DEFAULT_HEADING = 'When the ground gets difficult, choose the products that have already crossed it.';
const DEFAULT_BULLETS = ['Competitive Pricing', 'Guaranteed Quality', 'Ample Stock', 'The First Choice for HDD'];
const DEFAULT_BUTTON_TEXT = 'Contact Us / Request a Quote';
const DEFAULT_BUTTON_LINK = '/contact';

export const ProductsCta: React.FC<ProductsCtaProps> = ({ section }) => {
    const tagline = section?.tagline || DEFAULT_TAGLINE;
    const heading = section?.heading || DEFAULT_HEADING;
    const bullets = Array.isArray(section?.bullets) && section.bullets.length > 0
        ? section.bullets
        : DEFAULT_BULLETS;
    const buttonText = section?.buttonText || DEFAULT_BUTTON_TEXT;
    const buttonLink = section?.buttonLink || DEFAULT_BUTTON_LINK;

    return (
        <>
            {/* CLOSING CTA SECTION */}
            <section className="w-full section bg-[#052237] text-white text-center">
                <div className="flex flex-col items-center gap-6 max-w-4xl mx-auto">
                    <div className="flex items-center gap-2">
                        <span className="w-6 h-[3px] bg-[#f4691a] inline-block" />
                        <span className="text-sm uppercase tracking-wider text-[#f4691a] font-semibold">
                            {tagline}
                        </span>
                    </div>
                    <blockquote className="text-2xl md:text-3xl font-extrabold text-white leading-snug">
                        &ldquo;{heading}&rdquo;
                    </blockquote>
                    <p className="text-sm !text-white font-semibold">
                        {bullets.join(' · ')}
                    </p>
                    <div className="pt-4">
                        <Link href={buttonLink} className="inline-flex px-8 py-4 rounded-xl bg-[#f4691a] text-[#052237] font-extrabold text-base no-underline hover:bg-white transition-all shadow-md">
                            {buttonText}
                        </Link>
                    </div>
                </div>
            </section>

            {/* CONTACT / FOOTER SALES BLOCK (CARDLESS TYPOGRAPHY DIVIDER LAYOUT) */}
            <section className="w-full section bg-white">
                <div className="flex flex-col gap-12">
                    <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight !text-[#052237]">
                        Direct Sales & Engineering Contacts
                    </Text>

                    {/* 3 Sales Contacts (Pure Typography Divider Bar - No Cards) */}
                    <div className="w-full pt-4 border-t border-black/10 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0 md:divide-x md:divide-black/10">
                        {[
                            { name: 'Ms. Jannifer', phone: '+234-09136099052', email: 'info@pcenigeria.com' },
                            { name: 'Mr. Tom', phone: '+234-07074126596', email: 'wanyang@pcenigeria.com' },
                            { name: 'Mr. Frank', phone: '+234-07013732816', email: 'xuliangkui@pcenigeria.com' },
                        ].map((contact, i) => (
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

                    {/* 2 Office Locations (Pure Typography Divider Bar - No Cards) */}
                    <div className="w-full pt-8 mt-2 border-t border-black/10 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 md:divide-x md:divide-black/10">
                        <div className="flex flex-col items-start gap-1.5 md:px-8 first:md:pl-0">
                            <span className="text-xs uppercase font-extrabold text-[#f4691a] tracking-wider">Abuja Office</span>
                            <p className="text-base font-bold text-[#052237] leading-snug">House 45, Nelson Mandela Street, Asokoro, Abuja, Nigeria</p>
                        </div>
                        <div className="flex flex-col items-start gap-1.5 md:px-8 last:md:pr-0">
                            <span className="text-xs uppercase font-extrabold text-[#f4691a] tracking-wider">Lagos Office</span>
                            <p className="text-base font-bold text-[#052237] leading-snug">HyGroup Place, 6 Ojulari Street, Off Kusenla Road, Ikate, Elegushi, Lekki, Lagos</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default ProductsCta;
