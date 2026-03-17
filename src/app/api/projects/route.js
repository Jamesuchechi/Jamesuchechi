import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
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
    while (await prisma.project.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const project = await prisma.project.create({
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

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Project creation error:', error);
    return NextResponse.json({ error: 'Failed to create project', details: error.message }, { status: 500 });
  }
}
