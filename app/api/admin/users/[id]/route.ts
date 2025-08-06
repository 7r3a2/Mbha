import { NextRequest, NextResponse } from 'next/server';
import { deleteUser, findUserById } from '@/lib/db-utils';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userData = await request.json();
    
    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        gender: userData.gender,
        university: userData.university,
             hasWizaryExamAccess: true, // Always enabled for all users
     hasApproachAccess: userData.hasApproachAccess,
     hasQbankAccess: userData.hasQbankAccess,
     hasCoursesAccess: userData.hasCoursesAccess,
      },
    });

    const { password: _, ...userWithoutPassword } = updatedUser;
    return NextResponse.json(userWithoutPassword);
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await deleteUser(params.id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}