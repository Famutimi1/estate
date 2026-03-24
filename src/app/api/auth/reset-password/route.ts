import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { sendPasswordResetSuccessEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: { message: 'Reset token and password are required' } },
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
        { error: { message: 'Invalid or expired reset token' } },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    // Send success notification email
    try {
      await sendPasswordResetSuccessEmail(user.email, user.name);
      console.log('Password reset success email sent to:', user.email);
    } catch (emailError) {
      console.error('Failed to send password reset success email:', emailError);
      // Don't fail the operation if email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been successfully reset'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: { message: 'Internal server error' } },
      { status: 500 }
    );
  }
}
