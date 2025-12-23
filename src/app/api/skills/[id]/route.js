import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

// GET single skill
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const skillRef = adminDb.collection('skills').doc(id);
    const skillSnap = await skillRef.get();
    if (!skillSnap.exists()) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json({ id: skillSnap.id, ...skillSnap.data() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skill' }, { status: 500 });
  }
}

// PUT update skill
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedData = {
      name: body.name,
      category: body.category,
      proficiency: Number(body.proficiency),
      icon: body.icon || '',
      order: body.order || 0,
      updatedAt: new Date().toISOString(),
    };
    await adminDb.collection('skills').doc(id).update(updatedData);
    return NextResponse.json({ id, ...updatedData });
  } catch (error) {
    console.error('Failed to update skill:', error);
    return NextResponse.json({ error: 'Failed to update skill', details: error.message }, { status: 500 });
  }
}

// DELETE skill
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await adminDb.collection('skills').doc(id).delete();
    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
