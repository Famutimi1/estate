import { NextRequest, NextResponse } from 'next/server';
import { getPropertyById, updateProperty, deleteProperty } from '@/lib/services/properties';

// GET /api/properties/[id] - Get a single property
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const property = await getPropertyById(id);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('API error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// PUT /api/properties/[id] - Update a property
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const property = await updateProperty(id, body);

    if (!property) {
      return NextResponse.json(
        { error: 'Failed to update property' },
        { status: 400 }
      );
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('API error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// DELETE /api/properties/[id] - Delete a property
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteProperty(id);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete property' },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('API error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
