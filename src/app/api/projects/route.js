import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

const parseArray = (value) => {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};
const slugExists = async (slug) => {
  const snapshot = await adminDb.collection('projects').where('slug', '==', slug).get();
  return !snapshot.empty;
};

// GET all projects
export async function GET() {
  try {
    const snapshot = await adminDb.collection('projects').get();
    const projects = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));

    projects.sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1;
      if ((a.order ?? 0) !== (b.order ?? 0)) return (a.order ?? 0) - (b.order ?? 0);
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
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
    while (await slugExists(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const now = new Date().toISOString();
    const projectData = {
      title: body.title,
      slug: uniqueSlug,
      category: body.category,
      year: Number(body.year),
      description: body.description,
      imageUrl: body.imageUrl || '',
      gallery: parseArray(body.gallery),
      projectUrl: body.projectUrl || '',
      githubUrl: body.githubUrl || '',
      technologies: parseArray(body.technologies),
      featured: Boolean(body.featured),
      order: body.order || 0,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await adminDb.collection('projects').add(projectData);
    return NextResponse.json({ id: docRef.id, ...projectData }, { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
  }
}
