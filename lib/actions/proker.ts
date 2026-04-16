'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

async function requirePengurus() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  const role = (session.user as { role: string }).role;
  if (role !== 'PENGURUS' && role !== 'ADMIN') {
    throw new Error('Pengurus access required');
  }
  return session;
}

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
  await requirePengurus();

  const proker = await prisma.proker.create({ data });

  revalidatePath('/dashboard/pengurus');
  return proker;
}

export async function updateProkerStatus(id: string, status: string) {
  await requirePengurus();

  const proker = await prisma.proker.update({
    where: { id },
    data: { status },
  });

  revalidatePath('/dashboard/pengurus');
  return proker;
}

export async function deleteProker(id: string) {
  await requirePengurus();

  await prisma.proker.delete({ where: { id } });
  revalidatePath('/dashboard/pengurus');
}
