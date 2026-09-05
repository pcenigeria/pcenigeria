import { CapabilitiesPage } from '@/features/capabilities';
import { getAllCapabilities, getCapabilitiesPage } from '@/sanity/lib/queries';

export const metadata = {
    title: 'Capabilities | PCE Nigeria',
    description: 'PCE Nigeria Capabilities details.',
};

export default async function Page() {
    const [sanityCapabilities, sanityPage] = await Promise.all([
        getAllCapabilities(),
        getCapabilitiesPage(),
    ]);

    return <CapabilitiesPage sanityCapabilities={sanityCapabilities} sanityPage={sanityPage} />;
}
