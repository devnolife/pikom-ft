import { auth } from '@/lib/auth';
import type { Jabatan, Role } from '@prisma/client';

export type SessionUser = {
  id: string;
  name: string;
  nim: string;
  role: Role;
  jabatan?: Jabatan | null;
  bidang?: string | null;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  const session = await auth();
  if (!session?.user) return null;
  return session.user as SessionUser;
}

export async function requireAuth(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) throw new Error('Unauthorized');
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== 'ADMIN') throw new Error('Admin access required');
  return user;
}

export async function requirePengurus(): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role !== 'PENGURUS' && user.role !== 'ADMIN') {
    throw new Error('Pengurus access required');
  }
  return user;
}

/**
 * Require session user has one of the given jabatan. Admin selalu lolos.
 */
export async function requireAnyJabatan(...list: Jabatan[]): Promise<SessionUser> {
  const user = await requireAuth();
  if (user.role === 'ADMIN') return user;
  if (!user.jabatan || !list.includes(user.jabatan)) {
    throw new Error('Akses ditolak untuk jabatan Anda');
  }
  return user;
}

/**
 * Apakah user boleh menulis data di bidang tertentu.
 * Rule: ADMIN selalu bisa; KETUA_BIDANG/ANGGOTA_BIDANG hanya untuk bidangnya
 * sendiri; KETUA_UMUM read-only (tidak bisa menulis).
 */
export function canEditBidangData(user: SessionUser, bidang: string): boolean {
  if (user.role === 'ADMIN') return true;
  if (user.role !== 'PENGURUS') return false;
  if (user.jabatan === 'KETUA_BIDANG' || user.jabatan === 'ANGGOTA_BIDANG') {
    return user.bidang === bidang;
  }
  return false;
}

export async function requireBidangWrite(bidang: string): Promise<SessionUser> {
  const user = await requireAuth();
  if (!canEditBidangData(user, bidang)) {
    throw new Error(`Anda tidak boleh mengubah data bidang ${bidang}`);
  }
  return user;
}

export function canReadAllBidang(user: SessionUser): boolean {
  return (
    user.role === 'ADMIN' ||
    user.jabatan === 'KETUA_UMUM' ||
    user.jabatan === 'SEKRETARIS_UMUM' ||
    user.jabatan === 'BENDAHARA_UMUM'
  );
}
