import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const achievement = await prisma.achievement.update({
      where: { id },
      data: {
        title: body.title,
        provider: body.provider,
        date: body.date,
        description: body.description,
        category: body.category,
        verificationUrl: body.verificationUrl || '',
        order: Number(body.order || 0),
      },
    });

    return NextResponse.json(achievement);
  } catch (error) {
    console.error('Achievement PUT error:', error);
    return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.achievement.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    console.error('Achievement DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
  }
}
