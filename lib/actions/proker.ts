'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import {
  getSessionUser,
  requireAuth,
  requireBidangWrite,
  canEditBidangData,
} from '@/lib/auth-helpers';

export async function getProkerByBidang(bidang: string) {
  return prisma.proker.findMany({
    where: { bidang },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllProker() {
  return prisma.proker.findMany({
    orderBy: [{ bidang: 'asc' }, { createdAt: 'desc' }],
  });
}

export async function createProker(data: {
  bidang: string;
  title: string;
  deskripsi?: string;
}) {
  const user = await requireBidangWrite(data.bidang);

  const proker = await prisma.proker.create({
    data: { ...data, createdById: user.id },
  });

  revalidatePath('/dashboard/pengurus');
  revalidatePath('/dashboard/ketua');
  return proker;
}

export async function updateProkerStatus(id: string, status: string) {
  await requireAuth();
  const existing = await prisma.proker.findUnique({ where: { id } });
  if (!existing) throw new Error('Proker tidak ditemukan');

  await requireBidangWrite(existing.bidang);

  const proker = await prisma.proker.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/dashboard/pengurus');
  revalidatePath('/dashboard/ketua');
  return proker;
}

export async function deleteProker(id: string) {
  const existing = await prisma.proker.findUnique({ where: { id } });
  if (!existing) throw new Error('Proker tidak ditemukan');

  await requireBidangWrite(existing.bidang);

  await prisma.proker.delete({ where: { id } });
  revalidatePath('/dashboard/pengurus');
  revalidatePath('/dashboard/ketua');
}

export async function canEditBidang(bidang: string) {
  const user = await getSessionUser();
  if (!user) return false;
  return canEditBidangData(user, bidang);
}
