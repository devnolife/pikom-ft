import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

const publicPaths = ['/', '/login', '/bidang'];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  // Allow public paths and static assets
  if (
    publicPaths.some(p => pathname === p || pathname.startsWith(p + '/')) ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Redirect unauthenticated users to login
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const role = (session.user as { role?: string }).role;

  // Role-based route protection
  if (pathname.startsWith('/dashboard/admin') && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard/' + (role || 'mahasiswa').toLowerCase(), req.url));
  }
  if (pathname.startsWith('/dashboard/pengurus') && role !== 'PENGURUS' && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/dashboard/' + (role || 'mahasiswa').toLowerCase(), req.url));
  }

  // Redirect /dashboard to role-specific page
  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL('/dashboard/' + (role || 'mahasiswa').toLowerCase(), req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
