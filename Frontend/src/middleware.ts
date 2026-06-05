import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('bitebot_token')?.value;

  const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register');
  const isProtectedPage = 
    pathname.startsWith('/dashboard') || 
    pathname.startsWith('/recipes') || 
    pathname.startsWith('/ai');

  // Server-side redirect to dashboard if user has token and tries to access login/register
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Server-side redirect to login if user has no token and tries to access dashboard/recipes/ai
  if (isProtectedPage && !token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/recipes/:path*',
    '/ai/:path*',
  ],
};
