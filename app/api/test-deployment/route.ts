import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({
    status: 'SUCCESS',
    message: 'Deployment is working!',
    timestamp: new Date().toISOString(),
    branch: 'new-feature',
    version: '1.0.0'
  });
}
