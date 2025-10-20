import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single skill
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const skill = await prisma.skill.findUnique({
      where: { id }
    });
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }
    return NextResponse.json(skill);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch skill' }, { status: 500 });
  }
}

// PUT update skill
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const skill = await prisma.skill.update({
      where: { id },
      data: {
        name: body.name,
        category: body.category,
        proficiency: parseInt(body.proficiency),
        icon: body.icon || null,
        order: body.order || 0
      }
    });
    return NextResponse.json(skill);
  } catch (error) {
    console.error('Failed to update skill:', error);
    return NextResponse.json({ error: 'Failed to update skill', details: error.message }, { status: 500 });
  }
}

// DELETE skill
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.skill.delete({
      where: { id }
    });
    return NextResponse.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete skill' }, { status: 500 });
  }
}
