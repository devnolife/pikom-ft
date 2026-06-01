import 'server-only';
import { prisma } from '@/lib/prisma';

export interface LandingPimpinanData {
  slug: string;
  title: string;
  role: string | null;
  nama: string;
  featured: boolean;
}

export interface LandingBidangData {
  id: string;
  slug: string;
  name: string;
  icon: string;
  desc: string;
  ketua: string | null;
  sekretaris: string | null;
  anggota: string[];
  prokerTerlaksana: string[];
  prokerDirencanakan: string[];
}

export interface LandingPeriodeData {
  periode: string;
  ketua: string;
}

export type LandingContentMap = Record<string, string>;

export interface LandingPageData {
  pimpinan: LandingPimpinanData[];
  bidang: LandingBidangData[];
  periode: LandingPeriodeData[];
  content: LandingContentMap;
}

/**
 * Helper untuk akses `content[key]` dengan fallback default.
 */
export function getText(content: LandingContentMap, key: string, fallback = ''): string {
  return content[key] ?? fallback;
}

/**
 * Ambil semua data landing dalam beberapa query paralel (server-side).
 * Gagalnya satu query tidak boleh meng-crash halaman publik.
 */
export async function getLandingPageData(): Promise<LandingPageData> {
  try {
    const [pimpinanRows, bidangRows, periodeRows, contentRows] = await Promise.all([
      prisma.landingPimpinan.findMany({ orderBy: { order: 'asc' } }),
      prisma.landingBidang.findMany({
        orderBy: { order: 'asc' },
        include: {
          anggota: { orderBy: { order: 'asc' } },
          proker: { orderBy: { order: 'asc' } },
        },
      }),
      prisma.landingPeriode.findMany({ orderBy: { order: 'asc' } }),
      prisma.landingContent.findMany(),
    ]);

    return {
      pimpinan: pimpinanRows.map((p) => ({
        slug: p.slug,
        title: p.title,
        role: p.role,
        nama: p.nama,
        featured: p.featured,
      })),
      bidang: bidangRows.map((b) => ({
        id: b.id,
        slug: b.slug,
        name: b.name,
        icon: b.icon,
        desc: b.desc,
        ketua: b.ketua,
        sekretaris: b.sekretaris,
        anggota: b.anggota.map((a) => a.nama),
        prokerTerlaksana: b.proker.filter((p) => p.status === 'TERLAKSANA').map((p) => p.title),
        prokerDirencanakan: b.proker.filter((p) => p.status === 'DIRENCANAKAN').map((p) => p.title),
      })),
      periode: periodeRows.map((p) => ({ periode: p.periode, ketua: p.ketua })),
      content: Object.fromEntries(contentRows.map((c) => [c.key, c.value])),
    };
  } catch (err) {
    console.error('[landing-content] fetch error:', err);
    return { pimpinan: [], bidang: [], periode: [], content: {} };
  }
}

/**
 * Untuk halaman detail bidang. Mengembalikan null bila slug tidak terdaftar.
 */
export async function getBidangBySlug(slug: string): Promise<LandingBidangData | null> {
  try {
    const b = await prisma.landingBidang.findUnique({
      where: { slug },
      include: {
        anggota: { orderBy: { order: 'asc' } },
        proker: { orderBy: { order: 'asc' } },
      },
    });
    if (!b) return null;
    return {
      id: b.id,
      slug: b.slug,
      name: b.name,
      icon: b.icon,
      desc: b.desc,
      ketua: b.ketua,
      sekretaris: b.sekretaris,
      anggota: b.anggota.map((a) => a.nama),
      prokerTerlaksana: b.proker.filter((p) => p.status === 'TERLAKSANA').map((p) => p.title),
      prokerDirencanakan: b.proker.filter((p) => p.status === 'DIRENCANAKAN').map((p) => p.title),
    };
  } catch {
    return null;
  }
}
