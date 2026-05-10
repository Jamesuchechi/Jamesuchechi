import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const team = await prisma.teamMember.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(team);
  } catch (error) {
    console.error('Team GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch team members' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Generate slug from name
    let baseSlug = body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    let slug = baseSlug;
    let counter = 1;

    // Ensure unique slug
    while (await prisma.teamMember.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const member = await prisma.teamMember.create({
      data: {
        name: body.name,
        slug,
        role: body.role,
        description: body.description,
        profilePic: body.profilePic || '',
        portfolioUrl: body.portfolioUrl || '',
        githubUrl: body.githubUrl || '',
        order: Number(body.order || 0),
      },
    });

    return NextResponse.json(member, { status: 201 });
  } catch (error) {
    console.error('Team creation error:', error);
    return NextResponse.json({ error: 'Failed to create team member', details: error.message }, { status: 500 });
  }
}
