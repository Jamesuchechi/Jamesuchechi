import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const item = await prisma.labItem.update({
      where: { id },
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
    return NextResponse.json(item);
  } catch (error) {
    console.error('Lab update error:', error);
    return NextResponse.json({ error: 'Failed to update lab item' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    await prisma.labItem.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Lab deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete lab item' }, { status: 500 });
  }
}
