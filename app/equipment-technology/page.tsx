import type { Metadata } from 'next';
import { EquipmentPage } from '@/features/equipment';
import { getAllEquipmentCategories, getEquipmentPage } from '@/sanity/lib/queries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

export const metadata: Metadata = {
    title: 'Equipment & Technology',
    description: 'Explore PCE Nigeria heavy-duty HDD drill rigs (1,200t and 500t capacity), high-volume mud pumps, closed-loop recycling systems, ParaTrack 2 guidance technology, and offshore support fleet.',
    alternates: { canonical: `${siteUrl}/equipment-technology` },
    openGraph: {
        title: 'PCE Nigeria | Equipment & Technology Fleet',
        description: 'West Africa\'s most powerful trenchless fleet: 1,200t & 500t HDD rigs, mud recycling systems, and ParaTrack 2 steering technology.',
        url: `${siteUrl}/equipment-technology`,
        type: 'website',
    },
};

export default async function Page() {
    const [sanityCategories, sanityPage] = await Promise.all([
        getAllEquipmentCategories(),
        getEquipmentPage(),
    ]);
    return <EquipmentPage sanityCategories={sanityCategories} sanityPage={sanityPage} />;
}

