import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all projects
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        { featured: 'desc' },
        { order: 'asc' },
        { createdAt: 'desc' }
      ]
    });
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 });
  }
}

// POST new project
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Generate slug from title
    const slug = body.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    
    // Check if slug already exists and make it unique
    let uniqueSlug = slug;
    let counter = 1;
    while (await prisma.project.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }
    
    const project = await prisma.project.create({
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
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
