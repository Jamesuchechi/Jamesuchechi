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

// GET single service
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const serviceRef = adminDb.collection('services').doc(id);
    const serviceSnap = await serviceRef.get();
    if (!serviceSnap.exists()) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json({ id: serviceSnap.id, ...serviceSnap.data() });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

// PUT update service
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedData = {
      title: body.title,
      description: body.description,
      icon: body.icon || '',
      features: parseArray(body.features),
      order: body.order || 0,
      updatedAt: new Date().toISOString(),
    };
    await adminDb.collection('services').doc(id).update(updatedData);
    return NextResponse.json({ id, ...updatedData });
  } catch (error) {
    console.error('Failed to update service:', error);
    return NextResponse.json({ error: 'Failed to update service', details: error.message }, { status: 500 });
  }
}

// DELETE service
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await adminDb.collection('services').doc(id).delete();
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
