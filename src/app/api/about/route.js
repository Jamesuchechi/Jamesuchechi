import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebaseAdmin';

// GET about information
export async function GET() {
  try {
    const aboutRef = adminDb.collection('about').doc('profile');
    const aboutSnap = await aboutRef.get();

    if (!aboutSnap.exists) {
      const defaultAbout = {
        name: 'Your Name',
        title: 'Your Title',
        bio: 'Tell us about yourself...',
        socialLinks: {
          github: '',
          linkedin: '',
          twitter: '',
          website: '',
          whatsapp: '',
          facebook: '',
          tiktok: ''
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await aboutRef.set(defaultAbout);
      return NextResponse.json({ id: 'profile', ...defaultAbout });
    }

    return NextResponse.json({ id: aboutSnap.id, ...aboutSnap.data() });
  } catch (error) {
    console.error('Failed to fetch about:', error);
    return NextResponse.json({ error: 'Failed to fetch about information' }, { status: 500 });
  }
}

// POST/PUT update about information
export async function POST(request) {
  try {
    const body = await request.json();
    const aboutRef = adminDb.collection('about').doc('profile');
    const aboutData = {
      name: body.name,
      title: body.title,
      bio: body.bio,
      profileImage: body.profileImage || '',
      resumeUrl: body.resumeUrl || '',
      email: body.email || '',
      phone: body.phone || '',
      location: body.location || '',
      socialLinks: body.socialLinks || null,
      updatedAt: new Date().toISOString(),
    };

    await aboutRef.set(aboutData, { merge: true });
    return NextResponse.json({ id: 'profile', ...aboutData });
  } catch (error) {
    console.error('Failed to update about:', error);
    return NextResponse.json({ error: 'Failed to update about information', details: error.message }, { status: 500 });
  }
}
