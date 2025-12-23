import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    // Validate required fields
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }

    const userRecord = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    const createdAt = new Date().toISOString();
    await adminDb.collection('admins').doc(userRecord.uid).set({
      name,
      email,
      createdAt,
    });

    return NextResponse.json(
      { id: userRecord.uid, name, email },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin registration error:', error);
    if (error?.code === 'auth/email-already-exists') {
      return NextResponse.json({ error: 'Admin with this email already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Failed to create admin account' }, { status: 500 });
  }
}
