import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const experience = await prisma.experience.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(experience);
  } catch (error) {
    console.error('Experience GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch experience' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const experience = await prisma.experience.create({
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
    return NextResponse.json(experience, { status: 201 });
  } catch (error) {
    console.error('Experience creation error:', error);
    return NextResponse.json({ error: 'Failed to create experience', details: error.message }, { status: 500 });
  }
}
