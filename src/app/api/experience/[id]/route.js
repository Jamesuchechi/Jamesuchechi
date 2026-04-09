import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const experience = await prisma.experience.update({
      where: { id },
      data: {
        role: body.role,
        company: body.company,
        location: body.location || '',
        period: body.period,
        description: body.description,
        technologies: Array.isArray(body.technologies) ? JSON.stringify(body.technologies) : (body.technologies || '[]'),
        results: body.results || '',
        type: body.type || 'Formal',
        order: Number(body.order || 0),
      },
    });

    return NextResponse.json(experience);
  } catch (error) {
    console.error('Experience PUT error:', error);
    return NextResponse.json({ error: 'Failed to update experience' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.experience.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Experience DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete experience' }, { status: 500 });
  }
}
