import { ContactPage } from '@/features/contact';
import { getContactPage } from '@/sanity/lib/queries';

export const metadata = {
    title: 'Contact | PCE Nigeria',
    description: 'PCE Nigeria Contact details.',
};

export default async function Page() {
    const sanityPage = await getContactPage();
    return <ContactPage sanityPage={sanityPage} />;
}
