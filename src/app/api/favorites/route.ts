import { NextRequest, NextResponse } from 'next/server';
import { getUserFavorites, addToFavorites, removeFromFavorites, isPropertyFavorited } from '@/lib/services/favorites';

// GET /api/favorites?userId=...&propertyId=... - Get user favorites or check single
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const propertyId = searchParams.get('propertyId');

    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // If propertyId is provided, check if it's favorited
    if (propertyId) {
      const result = await isPropertyFavorited(userId, propertyId);
      return NextResponse.json(result);
    }

    // Otherwise, get all favorites for the user
    const result = await getUserFavorites(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error fetching favorites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch favorites' },
      { status: 500 }
    );
  }
}

// POST /api/favorites - Add a property to favorites
export async function POST(request: NextRequest) {
  try {
    const { userId, propertyId } = await request.json();

    if (!userId || !propertyId) {
      return NextResponse.json(
        { error: 'userId and propertyId are required' },
        { status: 400 }
      );
    }

    const result = await addToFavorites(userId, propertyId);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('API error adding favorite:', error);
    return NextResponse.json(
      { error: 'Failed to add favorite' },
      { status: 500 }
    );
  }
}

// DELETE /api/favorites - Remove a property from favorites
export async function DELETE(request: NextRequest) {
  try {
    const { userId, propertyId } = await request.json();

    if (!userId || !propertyId) {
      return NextResponse.json(
        { error: 'userId and propertyId are required' },
        { status: 400 }
      );
    }

    const result = await removeFromFavorites(userId, propertyId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error removing favorite:', error);
    return NextResponse.json(
      { error: 'Failed to remove favorite' },
      { status: 500 }
    );
  }
}
