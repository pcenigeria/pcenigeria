import type { Metadata } from 'next';
import { ProductsPage } from '@/features/products';
import { getAllProducts, getProductsPage } from '@/sanity/lib/queries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

export const metadata: Metadata = {
    title: 'Drilling Fluids & Chemical Products',
    description: "Explore PCE Nigeria's specialized drilling fluids, high-yield activated sodium bentonite (BRSBENT SQ), biopolymers (BRSXTG), fluid loss reducers (BRSCMC), and rheology control chemicals engineered for heavy HDD and oilfield drilling.",
    alternates: { canonical: `${siteUrl}/products` },
    openGraph: {
        title: 'PCE Nigeria | Drilling Fluids & Chemical Products',
        description: 'High-performance HDD drilling muds, API bentonite, biopolymers, and fluid loss control products for complex trenchless crossings.',
        url: `${siteUrl}/products`,
        type: 'website',
    },
};

export default async function Page() {
    const [sanityProducts, sanityPage] = await Promise.all([
        getAllProducts(),
        getProductsPage(),
    ]);
    return <ProductsPage sanityProducts={sanityProducts} sanityPage={sanityPage} />;
}
