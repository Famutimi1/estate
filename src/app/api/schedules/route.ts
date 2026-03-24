import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendAdminNotificationEmail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { preferredDate, preferredTime, name, phone, email, viewerType, message, propertyId, propertyTitle } = body;

    // Validate required fields
    if (!preferredDate || !preferredTime || !name || !phone || !email || !viewerType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
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

    // Create schedule entry
    const schedule = await prisma.schedule.create({
      data: {
        preferredDate,
        preferredTime,
        name,
        phone,
        email,
        viewerType,
        message: message || null,
        propertyId: propertyId || null,
        propertyTitle: propertyTitle || null,
        status: 'pending',
      },
    });

    // Send admin notification
    try {
      await sendAdminNotificationEmail('schedule', {
        name,
        email,
        phone,
        preferredDate,
        preferredTime,
        viewerType,
        message: message || null,
        propertyTitle: propertyTitle || null,
        propertyId: propertyId || null
      });
      console.log('Admin notification sent for new viewing schedule:', email);
    } catch (notificationError) {
      console.error('Failed to send admin notification:', notificationError);
      // Don't fail schedule creation if notification fails, but log the error
    }

    return NextResponse.json(
      { 
        success: true, 
        message: 'Viewing scheduled successfully',
        schedule 
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating schedule:', error);
    return NextResponse.json(
      { error: 'Failed to schedule viewing' },
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

    const schedules = await prisma.schedule.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ schedules }, { status: 200 });
  } catch (error) {
    console.error('Error fetching schedules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch schedules' },
      { status: 500 }
    );
  }
}
