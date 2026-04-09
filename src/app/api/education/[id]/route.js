import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const education = await prisma.education.update({
      where: { id },
      data: {
        school: body.school,
        degree: body.degree,
        field: body.field,
        location: body.location || '',
        period: body.period,
        description: body.description || '',
        honors: body.honors || '',
        order: Number(body.order || 0),
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    console.error('Education PUT error:', error);
    return NextResponse.json({ error: 'Failed to update education record' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.education.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Education record deleted successfully' });
  } catch (error) {
    console.error('Education DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete education record' }, { status: 500 });
  }
}
