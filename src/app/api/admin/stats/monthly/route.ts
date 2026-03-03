import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ALLOW_OFFLINE_BUILD = process.env.ALLOW_OFFLINE_BUILD === 'true';

const emptyResponse = { monthlyData: [] as { month: string; users: number; properties: number }[] };

export async function GET() {
  if (ALLOW_OFFLINE_BUILD && process.env.NODE_ENV === 'production') {
    console.warn('[admin/stats/monthly] Skipping DB query because ALLOW_OFFLINE_BUILD=true');
    return NextResponse.json(emptyResponse);
  }

  try {
    // Get last 12 months of data
    const now = new Date();
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);

    // Fetch users grouped by month
    const usersByMonth = await prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
        COUNT(*)::bigint as count
      FROM users
      WHERE created_at >= ${twelveMonthsAgo}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `;

    // Fetch properties grouped by month
    const propertiesByMonth = await prisma.$queryRaw<{ month: string; count: bigint }[]>`
      SELECT 
        TO_CHAR(DATE_TRUNC('month', created_at), 'YYYY-MM') as month,
        COUNT(*)::bigint as count
      FROM properties
      WHERE created_at >= ${twelveMonthsAgo}
      GROUP BY DATE_TRUNC('month', created_at)
      ORDER BY DATE_TRUNC('month', created_at) ASC
    `;

    // Generate all months in range
    const months: string[] = [];
    for (let i = 0; i < 12; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1);
      const monthStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.push(monthStr);
    }

    // Map results to include all months with zero counts for missing data
    const usersMap = new Map(usersByMonth.map((row: { month: string; count: bigint }) => [row.month, Number(row.count)]));
    const propertiesMap = new Map(propertiesByMonth.map((row: { month: string; count: bigint }) => [row.month, Number(row.count)]));

    const monthlyData = months.map((month) => ({
      month,
      users: usersMap.get(month) || 0,
      properties: propertiesMap.get(month) || 0,
    }));

    return NextResponse.json({ monthlyData });
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    if (ALLOW_OFFLINE_BUILD) {
      return NextResponse.json(emptyResponse);
    }
    return NextResponse.json({ error: 'Failed to fetch monthly stats' }, { status: 500 });
  }
}
