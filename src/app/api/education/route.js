import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const education = await prisma.education.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(education);
  } catch (error) {
    console.error('Education GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch education records' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const education = await prisma.education.create({
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
    return NextResponse.json(education, { status: 201 });
  } catch (error) {
    console.error('Education creation error:', error);
    return NextResponse.json({ error: 'Failed to create education record', details: error.message }, { status: 500 });
  }
}
