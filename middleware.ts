import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_API_PATHS = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/validate-code',
  '/api/auth/guest',
  '/api/auth/verify',
  '/api/health',
];

const ADMIN_API_PATHS = ['/api/admin'];

// Guest users can only access these API paths
const GUEST_ALLOWED_API_PATHS = ['/api/admin/exams', '/api/auth/verify'];

async function verifyJWT(token: string): Promise<{ userId: string; role: string } | null> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(secret)
    );
    if (payload.userId && typeof payload.userId === 'string') {
      return {
        userId: payload.userId,
        role: (payload.role as string) || 'user',
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect API routes — page-level auth is handled client-side by useAuth()
  // because tokens are stored in localStorage (not accessible server-side)
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow public API paths
  if (PUBLIC_API_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Extract token from Authorization header or cookie
  const authHeader = request.headers.get('authorization');
  const token =
    authHeader?.replace('Bearer ', '') ||
    request.cookies.get('auth_token')?.value;

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = await verifyJWT(token);
  if (!payload) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
  }

  // Guest API restrictions
  if (payload.role === 'guest') {
    const isAllowed = GUEST_ALLOWED_API_PATHS.some(p => pathname.startsWith(p));
    if (!isAllowed) {
      return NextResponse.json(
        { error: 'Guest access not allowed. Please register for full access.' },
        { status: 403 }
      );
    }
  }

  // Admin API route protection
  if (ADMIN_API_PATHS.some(p => pathname.startsWith(p)) && payload.role !== 'admin') {
    // Allow read-only access to /api/admin/exams for all authenticated users
    // (wizary-exam page needs to load exams)
    if (pathname === '/api/admin/exams' && request.method === 'GET') {
      // Allow
    } else {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
  }

  // Inject user info into request headers for downstream API routes
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', payload.userId);
  requestHeaders.set('x-user-role', payload.role);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/api/:path*'],
};
