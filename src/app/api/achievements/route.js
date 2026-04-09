import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const achievements = await prisma.achievement.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(achievements);
  } catch (error) {
    console.error('Achievements GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch achievements' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const achievement = await prisma.achievement.create({
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
    return NextResponse.json(achievement, { status: 201 });
  } catch (error) {
    console.error('Achievement creation error:', error);
    return NextResponse.json({ error: 'Failed to create achievement', details: error.message }, { status: 500 });
  }
}
