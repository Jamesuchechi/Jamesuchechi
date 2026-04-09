import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const posts = await prisma.blogPost.findMany({
      orderBy: { publishedAt: 'desc' },
    });
    return NextResponse.json(posts);
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Generate slug from title
    let baseSlug = body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await prisma.blogPost.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const post = await prisma.blogPost.create({
      data: {
        title: body.title,
        slug,
        summary: body.summary || '',
        content: body.content, // MDX
        tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : (body.tags || '[]'),
        published: Boolean(body.published),
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error('Blog post creation error:', error);
    return NextResponse.json({ error: 'Failed to create blog post', details: error.message }, { status: 500 });
  }
}
