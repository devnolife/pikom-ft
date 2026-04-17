'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAnyJabatan, requireAuth } from '@/lib/auth-helpers';
import type { KategoriAturan } from '@prisma/client';

export type AturanInput = {
  judul: string;
  kategori: KategoriAturan;
  konten?: string;
  lampiranUrl?: string | null;
};

export async function getAturan() {
  await requireAuth();
  return prisma.aturan.findMany({ orderBy: { updatedAt: 'desc' } });
}

export async function getAturanById(id: string) {
  await requireAuth();
  return prisma.aturan.findUnique({ where: { id } });
}

export async function createAturan(data: AturanInput) {
  const user = await requireAnyJabatan('SEKRETARIS_UMUM');
  const row = await prisma.aturan.create({
    data: {
      judul: data.judul.trim(),
      kategori: data.kategori,
      konten: data.konten?.trim() || null,
      lampiranUrl: data.lampiranUrl || null,
      createdById: user.id,
    },
  });
  revalidatePath('/dashboard/sekum/aturan');
  revalidatePath('/dashboard/ketua');
  return row;
}

export async function updateAturan(id: string, data: AturanInput) {
  await requireAnyJabatan('SEKRETARIS_UMUM');
  const row = await prisma.aturan.update({
    where: { id },
    data: {
      judul: data.judul.trim(),
      kategori: data.kategori,
      konten: data.konten?.trim() || null,
      lampiranUrl: data.lampiranUrl || null,
    },
  });
  revalidatePath('/dashboard/sekum/aturan');
  revalidatePath('/dashboard/ketua');
  return row;
}

export async function deleteAturan(id: string) {
  await requireAnyJabatan('SEKRETARIS_UMUM');
  await prisma.aturan.delete({ where: { id } });
  revalidatePath('/dashboard/sekum/aturan');
  revalidatePath('/dashboard/ketua');
}
