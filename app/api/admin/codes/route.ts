import { NextRequest, NextResponse } from 'next/server';
import { getAllUniqueCodes } from '@/lib/db-utils';

export async function GET(request: NextRequest) {
  try {
    const codes = await getAllUniqueCodes();
    return NextResponse.json(codes);
  } catch (error) {
    console.error('Error fetching codes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch codes' },
      { status: 500 }
    );
  }
}