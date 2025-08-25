import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth-utils';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded || !decoded.userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const testId = params.id;

    // Verify the test belongs to the user
    const test = await prisma.previousTest.findFirst({
      where: {
        id: testId,
        userId: decoded.userId
      }
    });

    if (!test) {
      return NextResponse.json({ error: 'Test not found' }, { status: 404 });
    }

    // Delete the test
    await prisma.previousTest.delete({
      where: {
        id: testId
      }
    });

    return NextResponse.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Error deleting previous test:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
