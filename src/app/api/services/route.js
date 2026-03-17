import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(services);
  } catch (error) {
    console.error('Services GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const service = await prisma.service.create({
      data: {
        title: body.title,
        description: body.description,
        icon: body.icon || '',
        features: Array.isArray(body.features) ? JSON.stringify(body.features) : (body.features || '[]'),
        order: Number(body.order || 0),
      },
    });
    return NextResponse.json(service, { status: 201 });
  } catch (error) {
    console.error('Service creation error:', error);
    return NextResponse.json({ error: 'Failed to create service', details: error.message }, { status: 500 });
  }
}
