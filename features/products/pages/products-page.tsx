'use client';

import React from 'react';
import {
    ProductsHero,
    ProductsAbout,
    StratumGuide,
    ProductCardsGrid,
    PerformanceMatrix,
    HddCaseStudies,
    StockLogistics,
    ProductsCta,
} from '../components';

interface ProductsPageProps {
    sanityProducts?: any[];
    sanityPage?: any;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ sanityProducts, sanityPage }) => {
    return (
        <div className="flex flex-col w-full bg-[#d8e7f1] min-h-screen">
            <ProductsHero sanityPage={sanityPage} />
            <ProductCardsGrid sanityProducts={sanityProducts} section={sanityPage?.catalogSection} />
            <ProductsAbout />
            <StratumGuide />
            <PerformanceMatrix section={sanityPage?.matrixSection} />
            <HddCaseStudies />
            <StockLogistics section={sanityPage?.logisticsSection} />
            <ProductsCta section={sanityPage?.ctaSection} />
        </div>
    );
};

export default ProductsPage;
