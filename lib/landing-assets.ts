import 'server-only';
import { prisma } from '@/lib/prisma';

/**
 * Registry semua slot gambar yang dipakai di landing pages.
 *
 * Key format:
 *   - hero.<n>            : slide hero di landing (n = 1..4)
 *   - pimpinan.<role>     : foto pimpinan inti
 *   - bidang.<slug>.<role>: foto ketua/sekretaris tiap bidang
 *
 * Admin meng-upload gambar per-key via `/dashboard/admin/landing`.
 * Slot tanpa upload akan jatuh ke placeholder SVG inisial.
 */

export interface LandingAssetSlotDef {
  key: string;
  label: string;
  group: string;
  /**
   * Aspect ratio yang disarankan untuk preview di admin.
   * Tidak meng-enforce dimensi pada file yang di-upload.
   */
  aspect: 'wide' | 'portrait' | 'square';
}

export const PIMPINAN_INTI_SLOTS = [
  { key: 'pimpinan.ketua-umum', title: 'Ketua Umum', role: 'Pimpinan Tertinggi' },
  { key: 'pimpinan.sekretaris-umum', title: 'Sekretaris Umum', role: 'Administrasi & Operasional' },
  { key: 'pimpinan.bendahara-umum', title: 'Bendahara Umum', role: 'Manajemen Keuangan' },
  { key: 'pimpinan.bendahara-1', title: 'Bendahara 1', role: 'Keuangan Internal' },
  { key: 'pimpinan.bendahara-2', title: 'Bendahara 2', role: 'Keuangan Eksternal' },
] as const;

export const BIDANG_SLUGS = [
  'organisasi',
  'kader',
  'riset-pengembangan',
  'immawati',
  'hikmah',
  'tabligh',
  'ekonomi-kewirausahaan',
  'spm',
  'sbo',
  'media-komunikasi',
] as const;

export const HERO_COUNT = 4;

export function landingSlotDefs(): LandingAssetSlotDef[] {
  const defs: LandingAssetSlotDef[] = [];

  for (let i = 1; i <= HERO_COUNT; i++) {
    defs.push({
      key: `hero.${i}`,
      label: `Hero Slide ${i}`,
      group: 'Hero',
      aspect: 'wide',
    });
  }

  for (const s of PIMPINAN_INTI_SLOTS) {
    defs.push({
      key: s.key,
      label: `${s.title} — Foto`,
      group: 'Pimpinan Inti',
      aspect: 'portrait',
    });
  }

  for (const slug of BIDANG_SLUGS) {
    defs.push({
      key: `bidang.${slug}.ketua`,
      label: `Bidang ${slug} — Ketua`,
      group: 'Bidang',
      aspect: 'portrait',
    });
    defs.push({
      key: `bidang.${slug}.sekretaris`,
      label: `Bidang ${slug} — Sekretaris`,
      group: 'Bidang',
      aspect: 'portrait',
    });
    defs.push({
      key: `bidang.${slug}.cover`,
      label: `Bidang ${slug} — Cover card`,
      group: 'Bidang',
      aspect: 'square',
    });
  }

  return defs;
}

export interface LandingAssetData {
  url: string;
  alt: string | null;
}

/**
 * Ambil semua asset dalam satu query dan kembalikan sebagai Map keyed by `key`.
 * Dipakai oleh halaman publik (RSC) untuk fetch sekali per render.
 */
export async function getLandingAssetMap(): Promise<Record<string, LandingAssetData>> {
  try {
    const rows = await prisma.landingAsset.findMany({
      select: { key: true, url: true, alt: true },
    });
    const map: Record<string, LandingAssetData> = {};
    for (const r of rows) {
      map[r.key] = { url: r.url, alt: r.alt };
    }
    return map;
  } catch {
    // Jangan crash halaman publik kalau DB sementara down.
    return {};
  }
}

/**
 * Versi single-key: hanya dipakai kalau tidak praktis ambil banyak sekaligus.
 */
export async function getLandingAsset(
  key: string
): Promise<LandingAssetData | null> {
  try {
    const row = await prisma.landingAsset.findUnique({
      where: { key },
      select: { url: true, alt: true },
    });
    return row ?? null;
  } catch {
    return null;
  }
}

/**
 * Helper untuk komponen client. Mengembalikan `null` kalau slot belum di-upload,
 * pemanggil seharusnya merender placeholder fallback.
 */
export function pickAsset(
  map: Record<string, LandingAssetData>,
  key: string
): LandingAssetData | null {
  return map[key] ?? null;
}
