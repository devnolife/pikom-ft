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
  const jabatan = (session.user as { jabatan?: string | null }).jabatan ?? null;

  // Compute home route by role + jabatan so redirects never loop back to /dashboard
  const homeFor = (r?: string, j?: string | null): string => {
    if (r === 'ADMIN') return '/dashboard/admin';
    if (r === 'MAHASISWA') return '/dashboard/mahasiswa';
    if (r === 'PENGURUS') {
      switch (j) {
        case 'KETUA_UMUM': return '/dashboard/ketua';
        case 'SEKRETARIS_UMUM': return '/dashboard/sekum/persuratan';
        case 'BENDAHARA_UMUM': return '/dashboard/bendahara';
        case 'KETUA_BIDANG':
        case 'ANGGOTA_BIDANG':
        default:
          return '/dashboard/pengurus';
      }
    }
    return '/login';
  };
  const fallback = homeFor(role, jabatan);

  // Admin keeps full access
  if (role === 'ADMIN') {
    if (pathname === '/dashboard') {
      return NextResponse.redirect(new URL('/dashboard/admin', req.url));
    }
    return NextResponse.next();
  }

  // Role-based section guards
  if (pathname.startsWith('/dashboard/admin')) {
    return NextResponse.redirect(new URL(fallback, req.url));
  }

  // Jabatan-based section guards (PENGURUS)
  if (pathname.startsWith('/dashboard/ketua')) {
    if (role !== 'PENGURUS' || jabatan !== 'KETUA_UMUM') {
      return NextResponse.redirect(new URL(fallback, req.url));
    }
  }
  if (pathname.startsWith('/dashboard/sekum')) {
    if (role !== 'PENGURUS' || jabatan !== 'SEKRETARIS_UMUM') {
      return NextResponse.redirect(new URL(fallback, req.url));
    }
  }
  if (pathname.startsWith('/dashboard/bendahara')) {
    if (role !== 'PENGURUS' || jabatan !== 'BENDAHARA_UMUM') {
      return NextResponse.redirect(new URL(fallback, req.url));
    }
  }
  if (pathname.startsWith('/dashboard/pengurus')) {
    if (role !== 'PENGURUS') {
      return NextResponse.redirect(new URL(fallback, req.url));
    }
    // Only KETUA_BIDANG or ANGGOTA_BIDANG (or KETUA_UMUM for view) may enter
    const allowed = ['KETUA_BIDANG', 'ANGGOTA_BIDANG', 'KETUA_UMUM'];
    if (jabatan && !allowed.includes(jabatan)) {
      return NextResponse.redirect(new URL(fallback, req.url));
    }
    // Anggota bidang: no /kader
    if (jabatan === 'ANGGOTA_BIDANG' && pathname.startsWith('/dashboard/pengurus/kader')) {
      return NextResponse.redirect(new URL('/dashboard/pengurus/proker', req.url));
    }
  }

  if (pathname === '/dashboard') {
    return NextResponse.redirect(new URL(fallback, req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
