import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');
    const role = searchParams.get('role') || '';
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role) {
      where.role = role;
    }

    const [users, total, totalAll, adminCount, agentCount, userCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          avatarUrl: true,
          _count: { select: { properties: true, favorites: true } },
        },
      }),
      prisma.user.count({ where }),
      prisma.user.count(),
      prisma.user.count({ where: { role: 'admin' } }),
      prisma.user.count({ where: { role: 'agent' } }),
      prisma.user.count({ where: { role: 'user' } }),
    ]);

    return NextResponse.json({
      users,
      total,
      totalAll,
      adminCount,
      agentCount,
      userCount,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin users error:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
