import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    
    // Using upsert to increment or create in one go
    const stats = await prisma.stats.upsert({
      where: { month: currentMonth },
      update: { count: { increment: 1 } },
      create: { month: currentMonth, count: 1 },
    });

    return NextResponse.json({ count: stats.count, month: stats.month });
  } catch (error) {
    console.error('Visitor count error:', error);
    return NextResponse.json({ error: 'Failed to update visitor count' }, { status: 500 });
  }
}
