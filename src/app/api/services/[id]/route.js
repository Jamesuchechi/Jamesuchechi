import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single service
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({
      where: { id }
    });
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
}

// PUT update service
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const service = await prisma.service.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        icon: body.icon || null,
        features: body.features ? JSON.stringify(body.features) : null,
        order: body.order || 0
      }
    });
    return NextResponse.json(service);
  } catch (error) {
    console.error('Failed to update service:', error);
    return NextResponse.json({ error: 'Failed to update service', details: error.message }, { status: 500 });
  }
}

// DELETE service
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.service.delete({
      where: { id }
    });
    return NextResponse.json({ message: 'Service deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}
