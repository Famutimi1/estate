import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const page = Number(searchParams.get('page') || '1');
    const limit = Number(searchParams.get('limit') || '10');
    const propertyType = searchParams.get('propertyType') || '';
    const propertyStatus = searchParams.get('propertyStatus') || '';
    const status = searchParams.get('status') || '';
    const sortBy = searchParams.get('sortBy') || 'newest';
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { state: { contains: search, mode: 'insensitive' } },
        { location: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (propertyType) {
      where.propertyType = propertyType;
    }

    if (propertyStatus) {
      where.propertyStatus = propertyStatus;
    }

    if (status) {
      where.status = status;
    }

    let orderBy: Record<string, string> = { createdAt: 'desc' };
    switch (sortBy) {
      case 'newest': orderBy = { createdAt: 'desc' }; break;
      case 'oldest': orderBy = { createdAt: 'asc' }; break;
      case 'price-asc': orderBy = { price: 'asc' }; break;
      case 'price-desc': orderBy = { price: 'desc' }; break;
      case 'title': orderBy = { title: 'asc' }; break;
    }

    const [properties, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        select: {
          id: true,
          title: true,
          price: true,
          propertyStatus: true,
          propertyType: true,
          status: true,
          address: true,
          city: true,
          state: true,
          zipCode: true,
          location: true,
          description: true,
          bedrooms: true,
          bathrooms: true,
          area: true,
          areaUnit: true,
          garageSpaces: true,
          amenities: true,
          imageUrl: true,
          images: true,
          featuredImageIndex: true,
          createdAt: true,
          userId: true,
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return NextResponse.json({
      properties: properties.map((p: typeof properties[number]) => ({
        ...p,
        price: Number(p.price),
        area: Number(p.area),
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Admin properties error:', error);
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 });
  }
}
