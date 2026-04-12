import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let about = await prisma.about.findFirst();

    if (!about) {
      // Create default if not exists
      about = await prisma.about.create({
        data: {
          name: 'James Uchechi',
          title: 'Full Stack Developer',
          bio: 'Passionate about building digital experiences.',
          availabilityStatus: 'available',
        },
      });
    }

    return NextResponse.json(about);
  } catch (error) {
    console.error('About GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch about data' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    let about = await prisma.about.findFirst();

    const data = {
      name: body.name,
      title: body.title,
      bio: body.bio,
      profileImage: body.profileImage || '',
      resumeUrl: body.resumeUrl || '',
      email: body.email || '',
      phone: body.phone || '',
      location: body.location || '',
      latitude: body.latitude ? parseFloat(body.latitude) : null,
      longitude: body.longitude ? parseFloat(body.longitude) : null,
      socialLinks: typeof body.socialLinks === 'string' ? body.socialLinks : JSON.stringify(body.socialLinks || {}),
      availabilityStatus: body.availabilityStatus || 'available',
    };

    if (about) {
      about = await prisma.about.update({
        where: { id: about.id },
        data,
      });
    } else {
      about = await prisma.about.create({ data });
    }

    return NextResponse.json(about);
  } catch (error) {
    console.error('About POST error:', error);
    return NextResponse.json({ error: 'Failed to update about data' }, { status: 500 });
  }
}
