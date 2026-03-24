import { NextRequest, NextResponse } from 'next/server';
import { registerUser } from '@/lib/services/auth';
import { sendWelcomeEmail, sendAdminNotificationEmail } from '@/lib/email';

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

    // Send welcome email
    try {
      await sendWelcomeEmail(email, name, role);
      console.log('Welcome email sent successfully to:', email);
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      // Don't fail registration if email fails, but log the error
    }

    // Send admin notification
    try {
      await sendAdminNotificationEmail('registration', {
        name,
        email,
        role,
        phone: null // Phone not available during registration
      });
      console.log('Admin notification sent for new user registration:', email);
    } catch (notificationError) {
      console.error('Failed to send admin notification:', notificationError);
      // Don't fail registration if notification fails, but log the error
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
