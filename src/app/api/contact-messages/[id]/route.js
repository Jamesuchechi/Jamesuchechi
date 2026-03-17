import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// DELETE contact message
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await prisma.contact.delete({
      where: { id },
    });
    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error) {
    console.error('Failed to delete message:', error);
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
