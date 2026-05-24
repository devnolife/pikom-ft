import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { verifySimakCredentials, type SimakUser } from '@/lib/simak';

/**
 * Strategi autentikasi:
 *
 *   1. Coba SIMAK (https://sicekcok.if.unismuh.ac.id/graphql) menggunakan NIM.
 *      - Bandingkan md5(password input) dengan field `passwd` dari SIMAK.
 *      - Jika cocok → upsert User lokal dari data SIMAK. Bila User lokal sudah
 *        ada (mis. sudah ditetapkan jabatan PENGURUS), JANGAN override role/
 *        jabatan/bidang-nya. Hanya update `name`, `email`, `prodi`, `source`.
 *
 *   2. Kalau SIMAK gagal/tidak cocok, fallback ke User lokal (bcrypt).
 *      Ini dipakai oleh akun ADMIN / PENGURUS seed yang tidak ada di SIMAK.
 *
 * Side note: kita tetap menyimpan kolom `password` di User. Untuk akun yang
 * dibuat dari SIMAK, kolom ini diisi placeholder ("SIMAK") karena verifikasi
 * password tidak pernah lewat bcrypt lokal.
 */

const SIMAK_PLACEHOLDER_PASSWORD = 'SIMAK_AUTH_PLACEHOLDER';

async function syncSimakUser(simak: SimakUser) {
  const existing = await prisma.user.findUnique({ where: { nim: simak.nim } });

  if (existing) {
    // Update field umum dari SIMAK, JANGAN ubah role/jabatan/bidang/password.
    return prisma.user.update({
      where: { id: existing.id },
      data: {
        name: simak.nama ?? existing.name,
        email: simak.email ?? existing.email,
        prodi: simak.prodi ?? existing.prodi,
        source: existing.source === 'LOCAL' ? 'LOCAL' : 'SIMAK',
      },
    });
  }

  // User baru — default role MAHASISWA.
  return prisma.user.create({
    data: {
      nim: simak.nim,
      name: simak.nama || simak.nim,
      email: simak.email,
      prodi: simak.prodi,
      password: SIMAK_PLACEHOLDER_PASSWORD,
      role: 'MAHASISWA',
      source: 'SIMAK',
    },
  });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      name: 'NIM',
      credentials: {
        nim: { label: 'NIM', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const nim = (credentials?.nim as string | undefined)?.trim();
        const password = credentials?.password as string | undefined;
        if (!nim || !password) return null;

        // --- 1. SIMAK first ---------------------------------------------------
        const simak = await verifySimakCredentials(nim, password);
        if (simak) {
          const user = await syncSimakUser(simak);
          return {
            id: user.id,
            name: user.name,
            nim: user.nim,
            role: user.role,
            jabatan: user.jabatan,
            bidang: user.bidang,
          };
        }

        // --- 2. Fallback local (ADMIN/PENGURUS seed) --------------------------
        const local = await prisma.user.findUnique({ where: { nim } });
        if (!local) return null;
        if (local.password === SIMAK_PLACEHOLDER_PASSWORD) return null;

        const ok = await compare(password, local.password);
        if (!ok) return null;

        return {
          id: local.id,
          name: local.name,
          nim: local.nim,
          role: local.role,
          jabatan: local.jabatan,
          bidang: local.bidang,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  pages: { signIn: '/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role: string }).role;
        token.nim = (user as { nim: string }).nim;
        token.jabatan = (user as { jabatan?: string | null }).jabatan ?? null;
        token.bidang = (user as { bidang?: string }).bidang;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
        (session.user as { role: string }).role = token.role as string;
        (session.user as { nim: string }).nim = token.nim as string;
        (session.user as { jabatan?: string | null }).jabatan =
          (token.jabatan as string | null) ?? null;
        (session.user as { bidang?: string }).bidang = token.bidang as
          | string
          | undefined;
      }
      return session;
    },
  },
});
