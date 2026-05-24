import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, unlink } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * /api/admin/landing-assets
 *
 *   GET    : list semua asset
 *   POST   : upload baru / replace (multipart: file, key, alt?)
 *   DELETE : hapus by key (query ?key=...)
 *
 * Hanya untuk role ADMIN. Disimpan di `public/uploads/landing/`.
 */

const MAX_SIZE = 8 * 1024 * 1024; // 8 MB
const ALLOWED_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
  'image/svg+xml',
]);

function safeExt(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (!ext || ext.length > 6) return '.png';
  return ext.replace(/[^a-z0-9.]/g, '');
}

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) return { error: 'Unauthorized', status: 401 } as const;
  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') return { error: 'Forbidden', status: 403 } as const;
  return { session } as const;
}

export async function GET() {
  const guard = await requireAdmin();
  if ('error' in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const rows = await prisma.landingAsset.findMany({
    orderBy: { key: 'asc' },
    select: { id: true, key: true, url: true, alt: true, updatedAt: true },
  });
  return NextResponse.json({ assets: rows });
}

export async function POST(req: NextRequest) {
  const guard = await requireAdmin();
  if ('error' in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }

  const form = await req.formData();
  const file = form.get('file');
  const keyRaw = form.get('key');
  const alt = (form.get('alt') as string) || null;

  if (typeof keyRaw !== 'string' || !keyRaw.trim()) {
    return NextResponse.json({ error: 'Key wajib diisi' }, { status: 400 });
  }
  const key = keyRaw.trim();
  if (!/^[a-z0-9._-]+$/.test(key)) {
    return NextResponse.json(
      { error: 'Format key tidak valid (a-z0-9._-)' },
      { status: 400 }
    );
  }
  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File kosong' }, { status: 400 });
  }
  if (file.size === 0) {
    return NextResponse.json({ error: 'File kosong' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: `File > ${MAX_SIZE / 1024 / 1024} MB` },
      { status: 413 }
    );
  }
  if (!ALLOWED_MIMES.has(file.type)) {
    return NextResponse.json(
      { error: `Tipe file ${file.type} tidak diizinkan` },
      { status: 415 }
    );
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), 'public', 'uploads', 'landing');
  await mkdir(dir, { recursive: true });

  const filename = `${key.replace(/[^a-z0-9-]/g, '_')}-${randomUUID().slice(0, 8)}${safeExt(file.name)}`;
  await writeFile(path.join(dir, filename), buf);
  const url = `/uploads/landing/${filename}`;

  const existing = await prisma.landingAsset.findUnique({ where: { key } });

  const row = await prisma.landingAsset.upsert({
    where: { key },
    create: {
      key,
      url,
      alt,
      uploadedBy: guard.session.user.id ?? null,
    },
    update: {
      url,
      alt,
      uploadedBy: guard.session.user.id ?? null,
    },
  });

  if (existing && existing.url !== url && existing.url.startsWith('/uploads/landing/')) {
    const oldPath = path.join(process.cwd(), 'public', existing.url);
    unlink(oldPath).catch(() => {});
  }

  return NextResponse.json({ asset: row });
}

export async function DELETE(req: NextRequest) {
  const guard = await requireAdmin();
  if ('error' in guard) {
    return NextResponse.json({ error: guard.error }, { status: guard.status });
  }
  const key = new URL(req.url).searchParams.get('key');
  if (!key) {
    return NextResponse.json({ error: 'Key wajib' }, { status: 400 });
  }
  const existing = await prisma.landingAsset.findUnique({ where: { key } });
  if (!existing) {
    return NextResponse.json({ error: 'Tidak ditemukan' }, { status: 404 });
  }
  await prisma.landingAsset.delete({ where: { key } });
  if (existing.url.startsWith('/uploads/landing/')) {
    const p = path.join(process.cwd(), 'public', existing.url);
    unlink(p).catch(() => {});
  }
  return NextResponse.json({ ok: true });
}
