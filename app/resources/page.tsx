import { ResourcesPage } from '@/features/resources';
import { getAllResourceCategories, getResourcesPage } from '@/sanity/lib/queries';

export const metadata = {
  title: 'Resources | PCE Nigeria',
  description: 'Download technical datasheets, corporate brochures, QHSE frameworks, and project case studies from PCE Nigeria.',
};

export default async function Page() {
  const [sanityCategories, sanityPage] = await Promise.all([
    getAllResourceCategories(),
    getResourcesPage(),
  ]);
  return <ResourcesPage sanityCategories={sanityCategories} sanityPage={sanityPage} />;
}
