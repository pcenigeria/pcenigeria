import { ProjectsPage } from '@/features/projects';
import { getAllProjects, getProjectsPage } from '@/sanity/lib/queries';

export const metadata = {
    title: 'Projects | PCE Nigeria',
    description: 'PCE Nigeria Projects details.',
};

export default async function Page() {
    const [sanityProjects, sanityPage] = await Promise.all([getAllProjects(), getProjectsPage()]);
    return <ProjectsPage sanityProjects={sanityProjects} sanityPage={sanityPage} />;
}
