import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: [{ featured: 'desc' }, { order: 'asc' }, { createdAt: 'desc' }],
    });
    return NextResponse.json(testimonials, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    console.error('GET /api/testimonials error:', error);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.name?.trim() || !body.role?.trim() || !body.quote?.trim()) {
      return NextResponse.json(
        { error: 'name, role, and quote are required' },
        { status: 400 }
      );
    }

    const rating = Math.max(1, Math.min(5, Number(body.rating) || 5));

    const testimonial = await prisma.testimonial.create({
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

    return NextResponse.json(testimonial, { status: 201 });
  } catch (error) {
    console.error('POST /api/testimonials error:', error);
    return NextResponse.json({ error: 'Failed to create testimonial' }, { status: 500 });
  }
}
