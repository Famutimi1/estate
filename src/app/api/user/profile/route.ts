import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, verifyToken } from '@/lib/services/auth';

// GET /api/user/profile - Get the current user's profile
export async function GET(request: NextRequest) {
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

    const result = await getCurrentUser(userId);
    if (!result.user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Transform field names to match frontend interface
    const { avatarUrl, ...userWithoutAvatar } = result.user;
    const transformedUser = {
      ...userWithoutAvatar,
      avatar_url: avatarUrl, // Transform avatarUrl to avatar_url
    };

    return NextResponse.json({ user: transformedUser });
  } catch (error) {
    console.error('Error getting user profile:', error);
    return NextResponse.json(
      { error: 'Failed to get user profile' },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile - Update the current user's profile
export async function PUT(request: NextRequest) {
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

    const body = await request.json();
    const { name, phone, avatar_url } = body;

    // Validate input
    if (name && (name.length < 2 || name.length > 255)) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 255 characters' },
        { status: 400 }
      );
    }

    // Validate phone format if provided
    if (phone && phone.length > 0) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(phone) || phone.length > 50) {
        return NextResponse.json(
          { error: 'Invalid phone format' },
          { status: 400 }
        );
      }
    }

    // Import the update function
    const { updateUserProfile } = await import('@/lib/services/auth');
    const result = await updateUserProfile({
      id: userId,
      name,
      phone: phone || null,
      avatar_url,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to update profile', details: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: result.user,
    });
  } catch (error) {
    console.error('Error updating user profile:', error);
    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
