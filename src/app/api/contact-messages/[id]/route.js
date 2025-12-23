import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

// DELETE contact message
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    await adminDb.collection('contacts').doc(id).delete();
    return NextResponse.json({ message: 'Message deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete message' }, { status: 500 });
  }
}
