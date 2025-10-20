import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all contact messages
export async function GET() {
  try {
    const messages = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

// DELETE contact message
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.contact.delete({
      where: { id }
    });
    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
