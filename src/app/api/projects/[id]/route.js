import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single project
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id }
    });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT update project
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Generate slug from title if title changed
    let slug = body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    
    // Check if slug already exists (excluding current project)
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.project.findFirst({ 
      where: { 
        slug: uniqueSlug,
        NOT: { id }
      } 
    })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    
    const project = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        slug: uniqueSlug,
        category: body.category,
        year: parseInt(body.year),
        description: body.description,
        imageUrl: body.imageUrl,
        gallery: Array.isArray(body.gallery) ? JSON.stringify(body.gallery) : body.gallery || null,
        projectUrl: body.projectUrl || null,
        githubUrl: body.githubUrl || null,
        technologies: JSON.stringify(body.technologies || []),
        featured: body.featured || false,
        order: body.order || 0
      }
    });
    return NextResponse.json(project);
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id }
    });
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
