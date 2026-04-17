'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAnyJabatan, requireAuth } from '@/lib/auth-helpers';
import type { TipeSurat } from '@prisma/client';

export type SuratInput = {
  tipe: TipeSurat;
  nomor: string;
  tanggal: string; // ISO date
  perihal: string;
  pengirim?: string;
  tujuan?: string;
  lampiranUrl?: string | null;
};

export async function getSurat() {
  await requireAuth();
  return prisma.surat.findMany({
    orderBy: { tanggal: 'desc' },
  });
}

export async function createSurat(data: SuratInput) {
  const user = await requireAnyJabatan('SEKRETARIS_UMUM');
  const row = await prisma.surat.create({
    data: {
      tipe: data.tipe,
      nomor: data.nomor.trim(),
      tanggal: new Date(data.tanggal),
      perihal: data.perihal.trim(),
      pengirim: data.pengirim?.trim() || null,
      tujuan: data.tujuan?.trim() || null,
      lampiranUrl: data.lampiranUrl || null,
      createdById: user.id,
    },
  });
  revalidatePath('/dashboard/sekum/persuratan');
  revalidatePath('/dashboard/ketua');
  return row;
}

export async function updateSurat(id: string, data: SuratInput) {
  await requireAnyJabatan('SEKRETARIS_UMUM');
  const row = await prisma.surat.update({
    where: { id },
    data: {
      tipe: data.tipe,
      nomor: data.nomor.trim(),
      tanggal: new Date(data.tanggal),
      perihal: data.perihal.trim(),
      pengirim: data.pengirim?.trim() || null,
      tujuan: data.tujuan?.trim() || null,
      lampiranUrl: data.lampiranUrl || null,
    },
  });
  revalidatePath('/dashboard/sekum/persuratan');
  revalidatePath('/dashboard/ketua');
  return row;
}

export async function deleteSurat(id: string) {
  await requireAnyJabatan('SEKRETARIS_UMUM');
  await prisma.surat.delete({ where: { id } });
  revalidatePath('/dashboard/sekum/persuratan');
  revalidatePath('/dashboard/ketua');
}
