import { NextRequest, NextResponse } from 'next/server';
import { generateNewCodes } from '@/lib/repositories/code.repository';

export async function POST(request: NextRequest) {
  try {
    const { count = 10 } = await request.json();
    const newCodes = await generateNewCodes(count);

    return NextResponse.json({
      success: true,
      codes: newCodes,
      message: `Successfully generated ${newCodes.length} new codes`
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate codes',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
