'use client';

import React from 'react';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { Text } from '@/shared/components/ui/text';

interface CardProduct {
    id: string;
    slug: string;
    title: string;
    subtitle?: string;
    description: string;
    image?: string;
}

interface ProductCardsGridProps {
    sanityProducts?: any[];
    section?: any;
}

const DEFAULT_PRODUCTS: CardProduct[] = [
    {
        id: 'brsbent-sq',
        slug: 'brsbent-sq',
        title: 'BRSBENT SQ',
        subtitle: 'Activated Bentonite',
        description: 'Premium drilling fluid material for HDD, slurry TBM and deep foundation applications',
        image: '/pictures/product-image/bent/cover-photo.jpg',
    },
    {
        id: 'brscmc',
        slug: 'brscmc',
        title: 'BRSCMC',
        subtitle: 'Carboxymethyl Cellulose',
        description: 'High purity sodium carboxymethyl cellulose providing efficient filtration control and rheology enhancement in water based fluids.',
        image: '/pictures/product-image/brscmc-pack.png',
    },
    {
        id: 'brsmmh',
        slug: 'brsmmh',
        title: 'BRSMMH',
        subtitle: 'Positive Electric Adhesive Dry Powder',
        description: 'Positively charged mixed layered metal hydroxide (MMH) crystal colloid for drilling fluid stabilization',
        image: '/pictures/product-image/brsmmh-pack.png',
    },
    {
        id: 'brsvr',
        slug: 'brsvr',
        title: 'BRSVR',
        subtitle: 'Clay Viscosity Reducer',
        description: 'Clay Stripper and Clay Dispersing Solution for Drilling Fluids',
        image: '/pictures/product-image/brsvr-pack.png',
    },
    {
        id: 'brsxtg',
        slug: 'brsxtg',
        title: 'BRSXTG',
        subtitle: 'Xanthan Gum',
        description: 'High Molecular Weight Polysaccharide Viscosifier and Suspending Agent for Water Based Drilling Systems',
        image: '/pictures/product-image/brsxtg-pack.png',
    },
];

const bodyComponents = {
    block: {
        normal: ({ children }: any) => (
            <p className="text-sm !text-white/80 leading-relaxed">{children}</p>
        ),
    },
};

export const ProductCardsGrid: React.FC<ProductCardsGridProps> = ({ sanityProducts, section }) => {
    const products: CardProduct[] = React.useMemo(() => {
        if (!sanityProducts || sanityProducts.length === 0) {
            return DEFAULT_PRODUCTS;
        }
        return sanityProducts.map((p) => ({
            id: p._id,
            slug: p.slug,
            title: p.title,
            subtitle: p.subtitle,
            description: p.description,
            image: p.image,
        }));
    }, [sanityProducts]);

    const hasBody = Array.isArray(section?.body) && section.body.length > 0;

    return (
        <section className="w-full section bg-[#001723] text-white">
            <div className="flex flex-col gap-12">
                {(section?.tagline || section?.heading || hasBody) && (
                    <div className="flex flex-col gap-3 max-w-2xl">
                        {section?.tagline && (
                            <div className="flex items-center gap-2">
                                <span className="w-6 h-[3px] bg-[#f4691a] inline-block" />
                                <span className="text-sm uppercase tracking-wider text-white/80 font-semibold">
                                    {section.tagline}
                                </span>
                            </div>
                        )}
                        {section?.heading && (
                            <Text variant="display-lg" as="h2" intent="default" className="!font-extrabold leading-tight !text-white">
                                {section.heading}
                            </Text>
                        )}
                        {hasBody && (
                            <div className="flex flex-col gap-2">
                                <PortableText value={section.body} components={bodyComponents} />
                            </div>
                        )}
                    </div>
                )}

                {/* Grid of Product Cards (Full-Bleed Image Card Layout) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
                    {products.map((product) => (
                        <div key={product.id} className="w-full flex flex-col items-start gap-6 group">

                            {/* 1. Full-Bleed Product Image Frame */}
                            <Link
                                href={`/products/${product.slug}`}
                                className="w-full h-[300px] sm:h-[340px] lg:h-[380px] relative overflow-hidden rounded-xl border border-white/10 group cursor-pointer no-underline block bg-white/5"
                            >
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.title}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-[#052237] flex items-center justify-center text-4xl text-white">🧪</div>
                                )}
                            </Link>

                            {/* 2. Text & CTA Panel Underneath */}
                            <div className="w-full flex flex-col items-start gap-3">
                                <div className="flex flex-col gap-0.5">
                                    <h3 className="text-2xl font-extrabold text-white group-hover:text-[#f4691a] transition-colors">
                                        {product.title}
                                    </h3>
                                    <p className="text-xs font-bold !text-white/70">
                                        {product.subtitle}
                                    </p>
                                </div>

                                <p className="text-sm !text-white/80 leading-relaxed line-clamp-2 min-h-[44px]">
                                    {product.description}
                                </p>

                                <Link
                                    href={`/products/${product.slug}`}
                                    className="inline-flex items-center gap-2 bg-[#f4691a] hover:bg-white hover:text-[#001723] text-white text-xs uppercase tracking-wider font-extrabold py-3 px-6 rounded-md transition-colors mt-2 no-underline shadow-sm"
                                >
                                    Read More →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default ProductCardsGrid;
