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

// GET all services
export async function GET() {
  try {
    const snapshot = await adminDb.collection('services').get();
    const services = snapshot.docs.map((docSnap) => ({
      id: docSnap.id,
      ...docSnap.data(),
    }));
    services.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

// POST create service
export async function POST(request) {
  try {
    const body = await request.json();
    const now = new Date().toISOString();
    const serviceData = {
      title: body.title,
      description: body.description,
      icon: body.icon || '',
      features: parseArray(body.features),
      order: body.order || 0,
      createdAt: now,
      updatedAt: now,
    };
    const docRef = await adminDb.collection('services').add(serviceData);
    return NextResponse.json({ id: docRef.id, ...serviceData }, { status: 201 });
  } catch (error) {
    console.error('Failed to create service:', error);
    return NextResponse.json({ error: 'Failed to create service', details: error.message }, { status: 500 });
  }
}
