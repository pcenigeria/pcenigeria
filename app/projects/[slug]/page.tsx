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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.pcenigeria.com';

export async function generateMetadata({ params }: PageProps) {
    const slug = await resolveSlug(params);
    const project = await getSanityProjectBySlug(slug);
    if (!project) return {};

    const canonicalUrl = `${siteUrl}/projects/${slug}`;
    const pageTitle = `${project.title} | PCE Nigeria Projects`;
    const description = project.intro || project.subtitle || project.tagline || '';
    const ogImageUrl = project.heroImage || `${siteUrl}/pictures/hero-slider/drilling-rig-cover-photo.jpg`;

    return {
        title: pageTitle,
        description,
        alternates: {
            canonical: canonicalUrl,
        },
        openGraph: {
            title: pageTitle,
            description,
            url: canonicalUrl,
            siteName: 'PCE Nigeria Limited',
            type: 'website',
            images: [
                {
                    url: ogImageUrl,
                    width: 1200,
                    height: 630,
                    alt: project.title,
                },
            ],
        },
        twitter: {
            card: 'summary_large_image',
            title: pageTitle,
            description,
            images: [ogImageUrl],
        },
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

    const canonicalUrl = `${siteUrl}/projects/${slug}`;
    const ogImageUrl = project.heroImage || `${siteUrl}/pictures/hero-slider/drilling-rig-cover-photo.jpg`;

    const projectJsonLd = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Article',
                '@id': `${canonicalUrl}#project`,
                'headline': project.title,
                'description': project.intro || project.subtitle || '',
                'image': ogImageUrl,
                'url': canonicalUrl,
                'author': {
                    '@type': 'Organization',
                    'name': 'PCE Nigeria Limited',
                    'url': siteUrl,
                },
                'publisher': {
                    '@type': 'Organization',
                    '@id': `${siteUrl}/#organization`,
                    'name': 'PCE Nigeria Limited',
                },
                ...(project.date && { 'datePublished': project.date }),
            },
            {
                '@type': 'BreadcrumbList',
                'itemListElement': [
                    {
                        '@type': 'ListItem',
                        'position': 1,
                        'name': 'Home',
                        'item': siteUrl,
                    },
                    {
                        '@type': 'ListItem',
                        'position': 2,
                        'name': 'Projects',
                        'item': `${siteUrl}/projects`,
                    },
                    {
                        '@type': 'ListItem',
                        'position': 3,
                        'name': project.title,
                        'item': canonicalUrl,
                    },
                ],
            },
        ],
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }}
            />
            <ProjectDetailTemplate
                project={mapSanityProject(project)}
                allProjects={allProjects.map((p: { title: string; slug: string }) => ({ title: p.title, slug: p.slug }))}
            />
        </>
    );
}
