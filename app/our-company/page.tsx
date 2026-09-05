import { CompanyPage } from '@/features/company';
import { getCompanyPage } from '@/sanity/lib/queries';

export const metadata = {
    title: 'Our Company | PCE Nigeria',
    description: 'Learn about PCE Nigeria, our history, and our leadership in engineering and construction.',
};

export default async function Page() {
    const sanityPage = await getCompanyPage();
    return <CompanyPage sanityPage={sanityPage} />;
}
