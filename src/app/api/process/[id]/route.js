import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body   = await request.json();

    if (!body.title?.trim() || !body.description?.trim()) {
      return NextResponse.json(
        { error: 'title and description are required' },
        { status: 400 }
      );
    }

    const step = await prisma.processStep.update({
      where: { id },
      data: {
        stepNumber:   Number(body.stepNumber) || 1,
        title:        body.title.trim(),
        description:  body.description.trim(),
        icon:         body.icon?.trim() || null,
        durationHint: body.durationHint?.trim() || null,
        order:        Number(body.order) || 0,
      },
    });

    return NextResponse.json(step);
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }
    console.error('PUT /api/process/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update process step' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.processStep.delete({ where: { id } });
    return NextResponse.json({ message: 'Step deleted successfully' });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Step not found' }, { status: 404 });
    }
    console.error('DELETE /api/process/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete process step' }, { status: 500 });
  }
}
