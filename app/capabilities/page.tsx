import type { Metadata } from 'next';
import { CapabilitiesPage } from '@/features/capabilities';
import { getAllCapabilities, getCapabilitiesPage } from '@/sanity/lib/queries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

export const metadata: Metadata = {
    title: 'Capabilities',
    description: "PCE Nigeria's full range of engineering capabilities: Horizontal Directional Drilling (HDD) with 1200t & 500t rigs, Pipeline EPC construction, Buried Pipeline Detection System (BPDS), and specialist equipment fleet for oil & gas projects in Nigeria.",
    alternates: { canonical: `${siteUrl}/capabilities` },
    openGraph: {
        title: 'PCE Nigeria | Capabilities — HDD, EPC & BPDS',
        description: "From 48-inch River Niger HDD crossings to 52km pipeline EPC — explore PCE Nigeria's full engineering capabilities for Nigeria's oil & gas sector.",
        url: `${siteUrl}/capabilities`,
        type: 'website',
    },
};

export default async function Page() {
    const [sanityCapabilities, sanityPage] = await Promise.all([
        getAllCapabilities(),
        getCapabilitiesPage(),
    ]);

    return <CapabilitiesPage sanityCapabilities={sanityCapabilities} sanityPage={sanityPage} />;
}
