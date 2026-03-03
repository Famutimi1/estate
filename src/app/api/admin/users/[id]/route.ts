import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PATCH /api/admin/users/[id] — update user role
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { role } = body;

    if (!role || !['user', 'agent', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role. Must be user, agent, or admin.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Update user role error:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/users/[id] — delete user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Delete user's favorites first, then properties, then user
    await prisma.$transaction([
      prisma.favorite.deleteMany({ where: { userId: id } }),
      prisma.property.deleteMany({ where: { userId: id } }),
      prisma.user.delete({ where: { id } }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}
