import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

const ALLOW_OFFLINE_BUILD = process.env.ALLOW_OFFLINE_BUILD === 'true';

const emptyPayload = {
  totalUsers: 0,
  totalProperties: 0,
  totalFavorites: 0,
  propertiesForSale: 0,
  propertiesForRent: 0,
  draftProperties: 0,
  publishedProperties: 0,
  recentUsers: [],
  recentProperties: [],
};

export async function GET() {
  if (ALLOW_OFFLINE_BUILD && process.env.NODE_ENV === 'production') {
    console.warn('[admin/stats] Skipping DB query because ALLOW_OFFLINE_BUILD=true');
    return NextResponse.json(emptyPayload);
  }

  try {
    const [
      totalUsers,
      totalProperties,
      totalFavorites,
      propertiesForSale,
      propertiesForRent,
      draftProperties,
      publishedProperties,
      recentUsers,
      recentProperties,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.favorite.count(),
      prisma.property.count({ where: { propertyStatus: 'ForSale' } }),
      prisma.property.count({ where: { propertyStatus: 'ForRent' } }),
      prisma.property.count({ where: { status: 'draft' } }),
      prisma.property.count({ where: { status: 'publish' } }),
      prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.property.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          title: true,
          price: true,
          propertyStatus: true,
          status: true,
          city: true,
          state: true,
          createdAt: true,
        },
      }),
    ]);

    return NextResponse.json({
      totalUsers,
      totalProperties,
      totalFavorites,
      propertiesForSale,
      propertiesForRent,
      draftProperties,
      publishedProperties,
      recentUsers,
      recentProperties: recentProperties.map((p: typeof recentProperties[number]) => ({
        ...p,
        price: Number(p.price),
      })),
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    if (ALLOW_OFFLINE_BUILD) {
      return NextResponse.json(emptyPayload);
    }
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
