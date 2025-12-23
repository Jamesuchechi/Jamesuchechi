import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

// GET all skills
export async function GET() {
  try {
    const snapshot = await adminDb.collection('skills').get();
    const skills = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    skills.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return NextResponse.json(skills);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

// POST create skill
export async function POST(request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const skillData = {
      name: body.name,
      category: body.category,
      proficiency: Number(body.proficiency),
      icon: body.icon || '',
      order: body.order || 0,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await adminDb.collection('skills').add(skillData);
    return NextResponse.json({ id: docRef.id, ...skillData }, { status: 201 });
  } catch (error) {
    console.error('Failed to create skill:', error);
    return NextResponse.json({ error: 'Failed to create skill', details: error.message }, { status: 500 });
  }
}
