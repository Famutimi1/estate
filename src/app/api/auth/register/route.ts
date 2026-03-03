import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/services/auth';

// POST /api/auth/register - Register a new user
export async function POST(request: NextRequest) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'name, email, and password are required' },
        { status: 400 }
      );
    }

    const result = await registerUser({ name, email, password, role });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('API error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
