import { NextRequest, NextResponse } from 'next/server';
import { getProperties, createProperty } from '@/lib/services/properties';

// GET /api/properties - List properties with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const filters = {
      propertyType: searchParams.get('propertyType') || undefined,
      propertyStatus: searchParams.get('propertyStatus') || undefined,
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      location: searchParams.get('location') || undefined,
      bedrooms: searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined,
      bathrooms: searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined,
      sortBy: searchParams.get('sortBy') || undefined,
      page: searchParams.get('page') ? Number(searchParams.get('page')) : undefined,
      limit: searchParams.get('limit') ? Number(searchParams.get('limit')) : undefined,
    };

    const result = await getProperties(filters);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error fetching properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

// POST /api/properties - Create a new property
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const property = await createProperty(body);

    if (!property) {
      return NextResponse.json(
        { error: 'Failed to create property' },
        { status: 400 }
      );
    }

    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('API error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
