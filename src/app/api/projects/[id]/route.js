import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single project
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const project = await prisma.project.findUnique({
      where: { id },
    });
    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error('Project GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch project' }, { status: 500 });
  }
}

// PUT update project
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Generate new slug if title updated
    let baseSlug = body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    let slug = baseSlug;
    let counter = 1;

    // Check unique slug excluding current project
    while (await prisma.project.findFirst({ 
      where: { 
        slug,
        id: { not: id } 
      } 
    })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const project = await prisma.project.update({
      where: { id },
      data: {
        title: body.title,
        slug,
        category: body.category,
        year: Number(body.year),
        description: body.description,
        imageUrl: body.imageUrl || '',
        gallery: Array.isArray(body.gallery) ? JSON.stringify(body.gallery) : (body.gallery || '[]'),
        projectUrl: body.projectUrl || '',
        githubUrl: body.githubUrl || '',
        technologies: Array.isArray(body.technologies) ? JSON.stringify(body.technologies) : (body.technologies || '[]'),
        problem: body.problem || '',
        process: body.process || '',
        outcome: body.outcome || '',
        featured: Boolean(body.featured),
        order: Number(body.order || 0),
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Project PUT error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.project.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Project DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
