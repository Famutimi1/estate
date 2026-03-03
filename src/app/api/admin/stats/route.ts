import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
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
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
