import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET about information
export async function GET() {
  try {
    let about = await prisma.about.findFirst();
    
    if (!about) {
      // Create default about entry
      about = await prisma.about.create({
        data: {
          name: 'Your Name',
          title: 'Your Title',
          bio: 'Tell us about yourself...',
          socialLinks: JSON.stringify({
            github: '',
            linkedin: '',
            twitter: '',
            website: '',
            whatsapp: '',
            facebook: '',
            tiktok: ''
          })
        }
      });
    }
    
    return NextResponse.json(about);
  } catch (error) {
    console.error('Failed to fetch about:', error);
    return NextResponse.json({ error: 'Failed to fetch about information' }, { status: 500 });
  }
}

// POST/PUT update about information
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Check if about entry exists
    const existing = await prisma.about.findFirst();
    
    let about;
    if (existing) {
      // Update existing
      about = await prisma.about.update({
        where: { id: existing.id },
        data: {
          name: body.name,
          title: body.title,
          bio: body.bio,
          profileImage: body.profileImage || null,
          resumeUrl: body.resumeUrl || null,
          email: body.email || null,
          phone: body.phone || null,
          location: body.location || null,
          socialLinks: body.socialLinks ? JSON.stringify(body.socialLinks) : null
        }
      });
    } else {
      // Create new
      about = await prisma.about.create({
        data: {
          name: body.name,
          title: body.title,
          bio: body.bio,
          profileImage: body.profileImage || null,
          resumeUrl: body.resumeUrl || null,
          email: body.email || null,
          phone: body.phone || null,
          location: body.location || null,
          socialLinks: body.socialLinks ? JSON.stringify(body.socialLinks) : null
        }
      });
    }
    
    return NextResponse.json(about);
  } catch (error) {
    console.error('Failed to update about:', error);
    return NextResponse.json({ error: 'Failed to update about information', details: error.message }, { status: 500 });
  }
}
