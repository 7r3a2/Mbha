import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers } from '@/lib/repositories/user.repository';

export async function GET(request: NextRequest) {
  try {
    const users = await getAllUsers();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
