import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Get the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [visitors, contacts, projects] = await Promise.all([
      prisma.visitorLog.groupBy({
        by: ['date'],
        _count: { id: true },
        where: { date: { gte: thirtyDaysAgo } },
      }),
      prisma.contact.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
      prisma.project.findMany({
        where: { createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
    ]);

    // Format data for Recharts
    // We'll need to group them by actual date string (YYYY-MM-DD)
    const statsMap = {};

    // Initialize map with last 30 days
    for (let i = 0; i < 30; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      statsMap[dateStr] = { date: dateStr, visitors: 0, contacts: 0, projects: 0 };
    }

    // Process visitors (they are already grouped by date in schema, but it's a DateTime)
    // Actually, prisma.visitorLog.groupBy by 'date' might be too granular if it's full timestamp.
    // Better to fetch and group in JS or use raw SQL if needed.
    // Let's fetch all and group in JS for simplicity on small datasets.
    
    const allVisitors = await prisma.visitorLog.findMany({
      where: { date: { gte: thirtyDaysAgo } },
      select: { date: true }
    });

    allVisitors.forEach(v => {
      const dateStr = v.date.toISOString().split('T')[0];
      if (statsMap[dateStr]) statsMap[dateStr].visitors++;
    });

    contacts.forEach(c => {
      const dateStr = c.createdAt.toISOString().split('T')[0];
      if (statsMap[dateStr]) statsMap[dateStr].contacts++;
    });

    projects.forEach(p => {
      const dateStr = p.createdAt.toISOString().split('T')[0];
      if (statsMap[dateStr]) statsMap[dateStr].projects++;
    });

    const chartData = Object.values(statsMap).sort((a, b) => a.date.localeCompare(b.date));

    return NextResponse.json(chartData);
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return NextResponse.json({ error: 'Failed to fetch dashboard stats' }, { status: 500 });
  }
}
