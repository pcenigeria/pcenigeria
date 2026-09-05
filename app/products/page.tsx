import { ProductsPage } from '@/features/products';
import { getAllProducts, getProductsPage } from '@/sanity/lib/queries';

export const metadata = {
    title: 'Products & Brighter Star Drilling Fluids | PCE Nigeria',
    description: 'Explore PCE Nigeria\'s specialized drilling fluids, bentonites, biopolymers, and rheology control chemicals.',
};

export default async function Page() {
    const [sanityProducts, sanityPage] = await Promise.all([
        getAllProducts(),
        getProductsPage(),
    ]);
    return <ProductsPage sanityProducts={sanityProducts} sanityPage={sanityPage} />;
}
