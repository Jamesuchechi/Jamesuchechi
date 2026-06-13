import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import { normalizeImageUrl } from '@/lib/imageUtils';
import ProjectDetailsClient from '@/components/ProjectDetailsClient';

const DEFAULT_OG_IMAGE = 'https://vercel.app/favicon.svg';
const DEFAULT_METADATA = {
    title: 'Okpara James Uchechi',
    description: 'Portfolio and case studies by Okpara James Uchechi.',
    openGraph: {
        title: 'Okpara James Uchechi',
        description: 'Portfolio and case studies by Okpara James Uchechi.',
        url: 'https://vercel.app',
        siteName: 'Okpara James Uchechi',
        images: [{ url: DEFAULT_OG_IMAGE, alt: 'Okpara James Uchechi' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Okpara James Uchechi',
        description: 'Portfolio and case studies by Okpara James Uchechi.',
        creator: '@jamesuchechi6',
        images: [DEFAULT_OG_IMAGE],
    },
};

const normalizeSlug = (title) => title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');

// Use React's cache() to dedupe calls within the same request lifecycle
const getProjectBySlug = cache(async (slug) => {
    if (!slug) return null;

    let project = await prisma.project.findUnique({ where: { slug } });
    if (!project) {
        const allProjects = await prisma.project.findMany();
        project = allProjects.find((item) => normalizeSlug(item.title) === slug) || null;
    }

    return project;
});

export async function generateMetadata({ params }) {
    try {
        const project = await getProjectBySlug(params.slug);
        if (!project) return DEFAULT_METADATA;

        const title = `${project.title} | Project by Okpara James Uchechi`;
        const description = project.description || project.problem || `Project case study for ${project.title} by Okpara James Uchechi.`;
        const imageUrl = project.imageUrl ? normalizeImageUrl(project.imageUrl) : DEFAULT_OG_IMAGE;
        const url = `https://vercel.app/projects/${params.slug}`;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                url,
                siteName: 'Okpara James Uchechi',
                type: 'website',
                images: [
                    {
                        url: imageUrl,
                        alt: `${project.title} cover image`,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                creator: '@jamesuchechi6',
                images: [imageUrl],
            },
        };
    } catch (err) {
        console.error('generateMetadata(project) error:', err);
        return DEFAULT_METADATA;
    }
}

export default async function ProjectDetailsPage({ params }) {
    const project = await getProjectBySlug(params.slug);
    if (!project) notFound();

    const projectData = JSON.parse(JSON.stringify(project));
    const techUsed = projectData.technologies
        ? Array.isArray(projectData.technologies)
            ? projectData.technologies
            : JSON.parse(projectData.technologies)
        : [];
    const gallery = projectData.gallery
        ? Array.isArray(projectData.gallery)
            ? projectData.gallery
            : JSON.parse(projectData.gallery)
        : [];
    const imageUrl = projectData.imageUrl ? normalizeImageUrl(projectData.imageUrl) : null;
    const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: projectData.title,
        description: projectData.description || projectData.problem || 'Project work by Okpara James Uchechi.',
        url: `https://vercel.app/projects/${params.slug}`,
        image: imageUrl || undefined,
        datePublished: projectData.createdAt ? new Date(projectData.createdAt).toISOString() : undefined,
        author: {
            '@type': 'Person',
            name: 'Okpara James Uchechi',
            url: 'https://vercel.app',
        },
        keywords: [...techUsed, projectData.category].filter(Boolean).join(', '),
        genre: projectData.category,
    });

    return (
        <>
            <ProjectDetailsClient project={projectData} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        </>
    );
}
