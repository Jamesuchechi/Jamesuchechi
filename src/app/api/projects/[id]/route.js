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

// GET single project
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const projectRef = adminDb.collection('projects').doc(id);
    const projectSnap = await projectRef.get();
    if (!projectSnap.exists()) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ id: projectSnap.id, ...projectSnap.data() });
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
    const slugQuery = async (value) => {
      const snapshot = await adminDb.collection('projects').where('slug', '==', value).get();
      return snapshot.docs.some((docSnap) => docSnap.id !== id);
    };
    while (await slugQuery(uniqueSlug)) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const projectRef = adminDb.collection('projects').doc(id);
    const updatedData = {
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
      updatedAt: new Date().toISOString(),
    };

    await projectRef.update(updatedData);
    return NextResponse.json({ id, ...updatedData });
  } catch (error) {
    console.error('Error updating project:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await adminDb.collection('projects').doc(id).delete();
    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
