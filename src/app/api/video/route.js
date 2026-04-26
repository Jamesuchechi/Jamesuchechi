import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const video = await prisma.video.findFirst({
      where: { active: true },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json(video || {});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch video' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const { url, title } = data;

    // Deactivate others
    await prisma.video.updateMany({
      where: { active: true },
      data: { active: false },
    });

    const video = await prisma.video.create({
      data: {
        url,
        title,
        active: true,
      },
    });

    return NextResponse.json(video);
  } catch (error) {
    console.error('Video save error:', error);
    return NextResponse.json({ error: 'Failed to save video' }, { status: 500 });
  }
}
