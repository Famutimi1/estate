import { NextResponse } from 'next/server';
import { signOut } from '@/lib/services/auth';

// POST /api/auth/logout - Sign out the current user
export async function POST() {
  try {
    const result = await signOut();

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to sign out' },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API error signing out:', error);
    return NextResponse.json(
      { error: 'Failed to sign out' },
      { status: 500 }
    );
  }
}
