import { prisma } from '../prisma';
import { Favorite as PrismaFavorite } from '@prisma/client';

export type Favorite = PrismaFavorite;

// Get all favorites for a user
export async function getUserFavorites(userId: string) {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { property: true },
    });

    return { success: true, favorites };
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return { success: false, error };
  }
}

// Add a property to favorites
export async function addToFavorites(userId: string, propertyId: string) {
  try {
    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    if (existing) {
      return { success: true, message: 'Property already in favorites' };
    }

    // Add to favorites
    const favorite = await prisma.favorite.create({
      data: { userId, propertyId },
    });

    return { success: true, favorite };
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return { success: false, error };
  }
}

// Remove a property from favorites
export async function removeFromFavorites(userId: string, propertyId: string) {
  try {
    await prisma.favorite.delete({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    return { success: true };
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return { success: false, error };
  }
}

// Check if a property is in user's favorites
export async function isPropertyFavorited(userId: string, propertyId: string) {
  try {
    const favorite = await prisma.favorite.findUnique({
      where: {
        userId_propertyId: { userId, propertyId },
      },
    });

    return { success: true, isFavorited: !!favorite };
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return { success: false, error };
  }
}