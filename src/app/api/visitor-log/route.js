import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { userAgent } = await request.json();
    const ip = request.headers.get('x-forwarded-for') || 'unknown';

    await prisma.visitorLog.create({
      data: {
        ip,
        userAgent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Visitor log error:', error);
    return NextResponse.json({ error: 'Failed to log visitor' }, { status: 500 });
  }
}
