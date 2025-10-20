import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single project
export async function GET(request, { params }) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id }
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
    const body = await request.json();
    const project = await prisma.project.update({
      where: { id: params.id },
      data: {
        title: body.title,
        category: body.category,
        year: parseInt(body.year),
        description: body.description,
        imageUrl: body.imageUrl,
        projectUrl: body.projectUrl || null,
        githubUrl: body.githubUrl || null,
        technologies: JSON.stringify(body.technologies || []),
        featured: body.featured || false,
        order: body.order || 0
      }
    });
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(request, { params }) {
  try {
    await prisma.project.delete({
      where: { id: params.id }
    });
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
