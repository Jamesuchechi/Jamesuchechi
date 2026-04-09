import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single blog post
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const post = await prisma.blogPost.findUnique({
      where: { id },
    });
    if (!post) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch blog post' }, { status: 500 });
  }
}

// PUT update blog post
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Generate new slug if title updated
    let baseSlug = body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    let slug = baseSlug;
    let counter = 1;

    // Check unique slug excluding current post
    if (body.title) {
      while (await prisma.blogPost.findFirst({ 
        where: { 
          slug,
          id: { not: id } 
        } 
      })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    const post = await prisma.blogPost.update({
      where: { id },
      data: {
        title: body.title,
        slug: body.title ? slug : undefined,
        summary: body.summary,
        content: body.content,
        tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : (body.tags || '[]'),
        published: Boolean(body.published),
        publishedAt: body.publishedAt ? new Date(body.publishedAt) : undefined,
      },
    });

    return NextResponse.json(post);
  } catch (error) {
    console.error('Blog PUT error:', error);
    return NextResponse.json({ error: 'Failed to update blog post' }, { status: 500 });
  }
}

// DELETE blog post
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.blogPost.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Blog post deleted successfully' });
  } catch (error) {
    console.error('Blog DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete blog post' }, { status: 500 });
  }
}
