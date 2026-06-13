import { prisma } from '@/lib/prisma';
import { cache } from 'react';
import { notFound } from 'next/navigation';
import BlogPostClient from '@/components/BlogPostClient';

const DEFAULT_OG_IMAGE = 'https://vercel.app/favicon.svg';
const DEFAULT_METADATA = {
    title: 'Okpara James Uchechi',
    description: 'Portfolio and writings by Okpara James Uchechi.',
    openGraph: {
        title: 'Okpara James Uchechi',
        description: 'Portfolio and writings by Okpara James Uchechi.',
        url: 'https://vercel.app',
        siteName: 'Okpara James Uchechi',
        images: [{ url: DEFAULT_OG_IMAGE, alt: 'Okpara James Uchechi' }],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Okpara James Uchechi',
        description: 'Portfolio and writings by Okpara James Uchechi.',
        creator: '@jamesuchechi6',
        images: [DEFAULT_OG_IMAGE],
    },
};

// Use React cache() to dedupe blog post fetches within the same request lifecycle
const getBlogPostBySlug = cache(async (slug) => {
    if (!slug) return null;

    let post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) {
        const allPosts = await prisma.blogPost.findMany();
        post = allPosts.find((item) => item.slug === slug) || null;
    }

    return post;
});

function getExcerpt(text) {
    if (!text) return '';
    const cleaned = text.replace(/\s+/g, ' ').trim();
    return cleaned.length > 160 ? `${cleaned.slice(0, 157)}...` : cleaned;
}

export async function generateMetadata({ params }) {
    try {
        const post = await getBlogPostBySlug(params.slug);
        if (!post) return DEFAULT_METADATA;

        const title = `${post.title} | Blog | Okpara James Uchechi`;
        const description = post.summary || getExcerpt(post.content);
        const url = `https://vercel.app/blog/${params.slug}`;
        const imageUrl = DEFAULT_OG_IMAGE;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                url,
                siteName: 'Okpara James Uchechi',
                type: 'article',
                images: [
                    {
                        url: imageUrl,
                        alt: `${post.title} preview image`,
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
        console.error('generateMetadata(blog) error:', err);
        return DEFAULT_METADATA;
    }
}

export default async function BlogPostPage({ params }) {
    const post = await getBlogPostBySlug(params.slug);
    if (!post) notFound();

    const postData = JSON.parse(JSON.stringify(post));
    const tags = postData.tags ? JSON.parse(postData.tags) : [];
    const jsonLd = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: postData.title,
        description: postData.summary || getExcerpt(postData.content),
        url: `https://vercel.app/blog/${params.slug}`,
        datePublished: postData.publishedAt ? new Date(postData.publishedAt).toISOString() : undefined,
        author: {
            '@type': 'Person',
            name: 'Okpara James Uchechi',
            url: 'https://vercel.app',
        },
        image: DEFAULT_OG_IMAGE,
        keywords: Array.isArray(tags) ? tags.join(', ') : tags,
        mainEntityOfPage: `https://vercel.app/blog/${params.slug}`,
    });

    return (
        <>
            <BlogPostClient post={postData} />
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        </>
    );
}
