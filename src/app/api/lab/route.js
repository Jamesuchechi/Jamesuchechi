import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.labItem.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(items);
  } catch (error) {
    console.error('Lab GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch lab items' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const item = await prisma.labItem.create({
      data: {
        title: body.title,
        description: body.description,
        status: body.status,
        progress: Number(body.progress || 0),
        link: body.link || '',
        tags: Array.isArray(body.tags) ? JSON.stringify(body.tags) : (body.tags || '[]'),
        order: Number(body.order || 0),
      },
    });
    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Lab creation error:', error);
    return NextResponse.json({ error: 'Failed to create lab item' }, { status: 500 });
  }
}
