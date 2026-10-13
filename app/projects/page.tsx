import type { Metadata } from 'next';
import { ProjectsPage } from '@/features/projects';
import { getAllProjects, getProjectsPage } from '@/sanity/lib/queries';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

export const metadata: Metadata = {
    title: 'Projects & Case Studies',
    description: 'PCE Nigeria\'s landmark engineering projects — AKK River Niger HDD Crossing, OB3 River Niger HDD Crossing, 52km Pipeline EPC, Raoyang River 2,293m HDD, BPDS Pipeline Detection, and more. Delivering world-class trenchless solutions across Nigeria.',
    alternates: { canonical: `${siteUrl}/projects` },
    openGraph: {
        title: 'PCE Nigeria | Projects & Case Studies',
        description: 'Landmark HDD crossings and pipeline EPC projects: AKK, OB3, 52km Pipeline, Raoyang River crossing, BPDS detection — delivered by PCE Nigeria.',
        url: `${siteUrl}/projects`,
        type: 'website',
    },
};

export default async function Page() {
    const [sanityProjects, sanityPage] = await Promise.all([getAllProjects(), getProjectsPage()]);
    return <ProjectsPage sanityProjects={sanityProjects} sanityPage={sanityPage} />;
}
