import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const member = await prisma.teamMember.findUnique({
      where: { id },
    });

    if (!member) {
      return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Team Member GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch team member' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const member = await prisma.teamMember.update({
      where: { id },
      data: {
        name: body.name,
        role: body.role,
        description: body.description,
        profilePic: body.profilePic,
        portfolioUrl: body.portfolioUrl,
        githubUrl: body.githubUrl,
        order: Number(body.order || 0),
      },
    });

    return NextResponse.json(member);
  } catch (error) {
    console.error('Team Member PUT error:', error);
    return NextResponse.json({ error: 'Failed to update team member', details: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.teamMember.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Team Member DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete team member' }, { status: 500 });
  }
}
