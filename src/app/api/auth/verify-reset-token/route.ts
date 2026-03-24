import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { valid: false, error: { message: 'Reset token is required' } },
        { status: 400 }
      );
    }

    // Find user with valid reset token
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(), // Token must not be expired
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { valid: false, error: { message: 'Invalid or expired reset token' } },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      message: 'Token is valid'
    });

  } catch (error) {
    console.error('Verify reset token error:', error);
    return NextResponse.json(
      { valid: false, error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
