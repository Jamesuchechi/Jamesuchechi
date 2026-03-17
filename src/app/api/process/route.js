import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const steps = await prisma.processStep.findMany({
      orderBy: [{ order: 'asc' }, { stepNumber: 'asc' }],
    });
    return NextResponse.json(steps, {
      headers: { 'Cache-Control': 's-maxage=300, stale-while-revalidate=600' },
    });
  } catch (error) {
    console.error('GET /api/process error:', error);
    return NextResponse.json({ error: 'Failed to fetch process steps' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.title?.trim() || !body.description?.trim()) {
      return NextResponse.json(
        { error: 'title and description are required' },
        { status: 400 }
      );
    }

    const step = await prisma.processStep.create({
      data: {
        stepNumber:   Number(body.stepNumber) || 1,
        title:        body.title.trim(),
        description:  body.description.trim(),
        icon:         body.icon?.trim() || null,
        durationHint: body.durationHint?.trim() || null,
        order:        Number(body.order) || 0,
      },
    });

    return NextResponse.json(step, { status: 201 });
  } catch (error) {
    console.error('POST /api/process error:', error);
    return NextResponse.json({ error: 'Failed to create process step' }, { status: 500 });
  }
}
