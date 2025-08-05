import { NextRequest, NextResponse } from 'next/server';
import { generateNewCodes } from '@/lib/db-utils';

export async function POST(request: NextRequest) {
  try {
    const { count = 10 } = await request.json();
    
    console.log(`🚀 Generating ${count} new codes...`);
    
    const newCodes = await generateNewCodes(count);
    
    console.log(`✅ Generated ${newCodes.length} new codes`);
    
    return NextResponse.json({
      success: true,
      codes: newCodes,
      message: `Successfully generated ${newCodes.length} new codes`
    });
  } catch (error) {
    console.error('Error generating codes:', error);
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