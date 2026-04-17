import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_MIMES = new Set([
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'application/pdf',
]);
const ALLOWED_KATEGORI = new Set(['surat', 'aturan', 'nota', 'umum']);

function safeName(name: string) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 80);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const role = (session.user as { role: string }).role;
  if (role !== 'PENGURUS' && role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const form = await req.formData();
  const file = form.get('file');
  const kategoriRaw = (form.get('kategori') as string) || 'umum';
  const kategori = ALLOWED_KATEGORI.has(kategoriRaw) ? kategoriRaw : 'umum';

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'File kosong' }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File > 5 MB' }, { status: 413 });
  }
  if (!ALLOWED_MIMES.has(file.type)) {
    return NextResponse.json({ error: `Tipe file ${file.type} tidak diizinkan` }, { status: 415 });
  }

  const buf = Buffer.from(await file.arrayBuffer());
  const dir = path.join(process.cwd(), 'public', 'uploads', kategori);
  await mkdir(dir, { recursive: true });
  const filename = `${randomUUID()}-${safeName(file.name)}`;
  await writeFile(path.join(dir, filename), buf);

  const url = `/uploads/${kategori}/${filename}`;
  return NextResponse.json({ url, filename, size: file.size, type: file.type });
}
