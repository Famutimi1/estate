import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/services/auth';

// DELETE /api/user/account - Delete the current user's account
export async function DELETE(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Get the user to check if they can delete their account
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        properties: true,
        favorites: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent deletion of admin accounts (backend protection)
    if (user.role === 'admin') {
      return NextResponse.json(
        { error: 'Admin accounts cannot be deleted through this interface' },
        { status: 403 }
      );
    }

    // Check if user has properties (optional: prevent deletion if they have active properties)
    if (user.properties.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete account with existing properties. Please transfer or delete properties first.' },
        { status: 400 }
      );
    }

    // Delete user's favorites first (due to foreign key constraints)
    await prisma.favorite.deleteMany({
      where: { userId },
    });

    // Delete any contact messages sent by this user (if email is used as identifier)
    await prisma.contact.deleteMany({
      where: { email: user.email },
    });

    // Delete any schedule requests by this user
    await prisma.schedule.deleteMany({
      where: { email: user.email },
    });

    // Finally, delete the user account
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return NextResponse.json(
      { error: 'Failed to delete account' },
      { status: 500 }
    );
  }
}
