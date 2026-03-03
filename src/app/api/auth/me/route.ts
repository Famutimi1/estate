import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, verifyToken } from '@/lib/services/auth';

// GET /api/auth/me - Get the current authenticated user
export async function GET(request: NextRequest) {
  try {
    // Extract token from Authorization header or cookie
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ')
      ? authHeader.slice(7)
      : request.cookies.get('token')?.value;

    if (!token) {
      return NextResponse.json({ user: null });
    }

    const userId = verifyToken(token);
    if (!userId) {
      return NextResponse.json({ user: null });
    }

    const result = await getCurrentUser(userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('API error getting current user:', error);
    return NextResponse.json(
      { error: 'Failed to get current user' },
      { status: 500 }
    );
  }
}
