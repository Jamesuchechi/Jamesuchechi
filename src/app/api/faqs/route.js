import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' },
    });
    return NextResponse.json(faqs);
  } catch (error) {
    console.error('FAQs GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch FAQs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const faq = await prisma.fAQ.create({
      data: {
        question: body.question,
        answer: body.answer,
        order: Number(body.order || 0),
      },
    });
    return NextResponse.json(faq, { status: 201 });
  } catch (error) {
    console.error('FAQ creation error:', error);
    return NextResponse.json({ error: 'Failed to create FAQ', details: error.message }, { status: 500 });
  }
}
