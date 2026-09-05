import { EquipmentPage } from '@/features/equipment';
import { getAllEquipmentCategories, getEquipmentPage } from '@/sanity/lib/queries';

export const metadata = {
    title: 'Equipment & Technology | PCE Nigeria',
    description: 'Explore PCE Nigeria heavy-duty HDD drill rigs, high-volume mud pumps, recycling systems, guidance technology, and support equipment.',
};

export default async function Page() {
    const [sanityCategories, sanityPage] = await Promise.all([
        getAllEquipmentCategories(),
        getEquipmentPage(),
    ]);
    return <EquipmentPage sanityCategories={sanityCategories} sanityPage={sanityPage} />;
}

