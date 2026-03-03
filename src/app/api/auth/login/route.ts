import { NextRequest, NextResponse } from 'next/server';
import { signIn } from '@/lib/services/auth';

// POST /api/auth/login - Sign in a user
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'email and password are required' },
        { status: 400 }
      );
    }

    const result = await signIn({ email, password });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('API error signing in:', error);
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
}
