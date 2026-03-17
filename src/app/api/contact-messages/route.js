import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all contact messages
export async function GET() {
  try {
    const messages = await prisma.contact.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}
