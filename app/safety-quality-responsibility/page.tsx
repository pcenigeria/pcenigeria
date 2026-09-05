import { SafetyPage } from '@/features/safety-quality';
import { getSafetyQualityPage } from '@/sanity/lib/queries';

export const metadata = {
    title: 'Safety | PCE Nigeria',
    description: 'PCE Nigeria Safety details.',
};

export default async function Page() {
    const sanityPage = await getSafetyQualityPage();
    return <SafetyPage sanityPage={sanityPage} />;
}
