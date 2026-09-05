import { ResourcesPage } from '@/features/resources';
import { getAllResourceCategories } from '@/sanity/lib/queries';

export const metadata = {
  title: 'Resources | PCE Nigeria',
  description: 'Download technical datasheets, corporate brochures, QHSE frameworks, and project case studies from PCE Nigeria.',
};

export default async function Page() {
  const sanityCategories = await getAllResourceCategories();
  return <ResourcesPage sanityCategories={sanityCategories} />;
}

