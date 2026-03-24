import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAdminNotificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, email, phone, subject, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Missing required fields: name, email, and message are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validate name length
    if (name.length < 2 || name.length > 255) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 255 characters' },
        { status: 400 }
      );
    }

    // Validate subject length if provided
    if (subject && (subject.length < 2 || subject.length > 255)) {
      return NextResponse.json(
        { error: 'Subject must be between 2 and 255 characters' },
        { status: 400 }
      );
    }

    // Validate message length
    if (message.length < 10 || message.length > 5000) {
      return NextResponse.json(
        { error: 'Message must be between 10 and 5000 characters' },
        { status: 400 }
      );
    }

    // Validate phone format if provided
    if (phone) {
      const phoneRegex = /^[\d\s\-\+\(\)]+$/;
      if (!phoneRegex.test(phone)) {
        return NextResponse.json(
          { error: 'Invalid phone format' },
          { status: 400 }
        );
      }
    }

    // Create contact entry
    const contact = await prisma.contact.create({
      data: {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message,
        status: 'unread',
      },
    });

    // Send admin notification
    try {
      await sendAdminNotificationEmail('contact', {
        name,
        email,
        phone: phone || null,
        subject: subject || null,
        message
      });
      console.log('Admin notification sent for new contact message:', email);
    } catch (notificationError) {
      console.error('Failed to send admin notification:', notificationError);
      // Don't fail contact creation if notification fails, but log the error
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Message sent successfully',
        contact 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating contact:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const email = searchParams.get('email');

    const where: any = {};
    if (status) where.status = status;
    if (email) where.email = email;

    const contacts = await prisma.contact.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ contacts }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch contacts' },
      { status: 500 }
    );
  }
}
