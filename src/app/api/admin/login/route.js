import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebaseAdmin';

export async function POST(request) {
  try {
    const body = await request.json();
    const { idToken } = body;

    if (!idToken) {
      return NextResponse.json({ error: 'Auth token is required' }, { status: 400 });
    }

    const decoded = await adminAuth.verifyIdToken(idToken);
    const userRecord = await adminAuth.getUser(decoded.uid);
    const adminRef = adminDb.collection('admins').doc(decoded.uid);
    const adminSnap = await adminRef.get();

    let adminData = adminSnap.exists ? adminSnap.data() : null;

    if (!adminData) {
      adminData = {
        name: userRecord.displayName || 'Admin',
        email: userRecord.email,
        createdAt: new Date().toISOString(),
      };
      await adminRef.set(adminData);
    }

    return NextResponse.json({
      admin: { id: decoded.uid, ...adminData },
      token: idToken,
    });
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json({ error: 'Failed to login' }, { status: 500 });
  }
}
