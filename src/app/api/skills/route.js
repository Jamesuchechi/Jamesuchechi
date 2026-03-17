import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const skills = await prisma.skill.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(skills);
  } catch (error) {
    console.error('Skills GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch skills' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const skill = await prisma.skill.create({
      data: {
        name: body.name,
        category: body.category,
        proficiency: Number(body.proficiency),
        icon: body.icon || '',
        order: Number(body.order || 0),
      },
    });
    return NextResponse.json(skill, { status: 201 });
  } catch (error) {
    console.error('Skill creation error:', error);
    return NextResponse.json({ error: 'Failed to create skill', details: error.message }, { status: 500 });
  }
}
