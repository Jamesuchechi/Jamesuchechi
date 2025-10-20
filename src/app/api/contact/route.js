import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    
    const contact = await prisma.contact.create({
      data: {
        name: body.name,
        email: body.email,
        message: body.message
      }
    });

    return NextResponse.json({ message: 'Contact form submitted successfully', contact }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to submit contact form' }, { status: 500 });
  }
}

// GET all contact submissions (for admin)
export async function GET() {
  try {
    const contacts = await prisma.contact.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(contacts);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch contacts' }, { status: 500 });
  }
}
