import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body   = await request.json();

    if (!body.name?.trim() || !body.role?.trim() || !body.quote?.trim()) {
      return NextResponse.json(
        { error: 'name, role, and quote are required' },
        { status: 400 }
      );
    }

    const rating = Math.max(1, Math.min(5, Number(body.rating) || 5));

    const testimonial = await prisma.testimonial.update({
      where: { id },
      data: {
        name:      body.name.trim(),
        role:      body.role.trim(),
        company:   (body.company || '').trim(),
        quote:     body.quote.trim(),
        avatarUrl: body.avatarUrl?.trim() || null,
        rating,
        featured:  Boolean(body.featured),
        order:     Number(body.order) || 0,
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    console.error('PUT /api/testimonials/[id] error:', error);
    return NextResponse.json({ error: 'Failed to update testimonial' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.testimonial.delete({ where: { id } });
    return NextResponse.json({ message: 'Testimonial deleted successfully' });
  } catch (error) {
    if (error?.code === 'P2025') {
      return NextResponse.json({ error: 'Testimonial not found' }, { status: 404 });
    }
    console.error('DELETE /api/testimonials/[id] error:', error);
    return NextResponse.json({ error: 'Failed to delete testimonial' }, { status: 500 });
  }
}
