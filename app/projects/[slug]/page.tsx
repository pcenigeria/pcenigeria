import React from 'react';
import { notFound } from 'next/navigation';
import { ProjectDetailTemplate } from '@/features/projects/components/project-detail-template';
import { getProjectBySlug as getSanityProjectBySlug, getAllProjects } from '@/sanity/lib/queries';
import { ProjectDetail } from '@/features/projects/types/project.types';

type PageProps = {
    params: Promise<{ slug: string }> | { slug: string };
};

export async function generateStaticParams() {
    const projects = await getAllProjects();
    return projects.map((project: { slug: string }) => ({
        slug: project.slug,
    }));
}

async function resolveSlug(params: PageProps['params']): Promise<string> {
    if (params && typeof (params as any).then === 'function') {
        const resolved = await params;
        return resolved.slug;
    }
    return (params as { slug: string }).slug;
}

function mapSanityProject(project: any): ProjectDetail {
    return {
        id: project._id || project.slug,
        slug: project.slug,
        title: project.title,
        subtitle: project.subtitle,
        tagline: project.tagline,
        date: project.date,
        location: project.location,
        country: project.country,
        isBpds: project.isBpds,
        category: project.category,
        heroImage: project.heroImage,
        intro: project.intro,
        sections: project.sections,
        specs: project.specs,
        bentoImages: Array.isArray(project.bentoImages)
            ? project.bentoImages.map((img: { src: string }) => img.src)
            : undefined,
    };
}

export async function generateMetadata({ params }: PageProps) {
    const slug = await resolveSlug(params);
    const project = await getSanityProjectBySlug(slug);
    if (!project) return {};
    return {
        title: `${project.title} | PCE Nigeria Projects`,
        description: project.intro,
    };
}

export default async function Page({ params }: PageProps) {
    const slug = await resolveSlug(params);
    const [project, allProjects] = await Promise.all([
        getSanityProjectBySlug(slug),
        getAllProjects(),
    ]);

    if (!project) {
        notFound();
    }

    return (
        <ProjectDetailTemplate
            project={mapSanityProject(project)}
            allProjects={allProjects.map((p: { title: string; slug: string }) => ({ title: p.title, slug: p.slug }))}
        />
    );
}
