import type { Metadata } from 'next';
import { ContactPage } from '@/features/contact';
import { getContactPage } from '@/sanity/lib/queries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

export const metadata: Metadata = {
    title: 'Contact Us',
    description: 'Get in touch with PCE Nigeria Limited for HDD pipeline crossings, pipeline EPC projects, drilling fluids supply (Lantic Bentonite), and engineering consultations in Nigeria.',
    alternates: { canonical: `${siteUrl}/contact` },
    openGraph: {
        title: 'Contact PCE Nigeria Limited',
        description: 'Connect with our engineering and commercial teams for HDD contracting, pipeline EPC projects, and drilling mud products across Nigeria.',
        url: `${siteUrl}/contact`,
        type: 'website',
    },
};

export default async function Page() {
    const sanityPage = await getContactPage();
    return <ContactPage sanityPage={sanityPage} />;
}
