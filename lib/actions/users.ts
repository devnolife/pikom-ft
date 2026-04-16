'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { hash } from 'bcryptjs';
import { revalidatePath } from 'next/cache';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || (session.user as { role: string }).role !== 'ADMIN') {
    throw new Error('Admin access required');
  }
  return session;
}

export async function getUsers() {
  await requireAdmin();
  return prisma.user.findMany({
    select: {
      id: true,
      nim: true,
      name: true,
      role: true,
      bidang: true,
      createdAt: true,
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function createUser(data: {
  nim: string;
  name: string;
  password: string;
  role: 'MAHASISWA' | 'PENGURUS' | 'ADMIN';
  bidang?: string;
}) {
  await requireAdmin();

  const existing = await prisma.user.findUnique({ where: { nim: data.nim } });
  if (existing) throw new Error('NIM sudah terdaftar');

  const hashedPassword = await hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      nim: data.nim,
      name: data.name,
      password: hashedPassword,
      role: data.role,
      bidang: data.bidang,
    },
  });

  revalidatePath('/dashboard/admin');
  return { id: user.id, nim: user.nim, name: user.name, role: user.role };
}

export async function updateUser(
  id: string,
  data: {
    name?: string;
    role?: 'MAHASISWA' | 'PENGURUS' | 'ADMIN';
    bidang?: string;
    password?: string;
  }
) {
  await requireAdmin();

  const updateData: Record<string, unknown> = {};
  if (data.name) updateData.name = data.name;
  if (data.role) updateData.role = data.role;
  if (data.bidang !== undefined) updateData.bidang = data.bidang;
  if (data.password) updateData.password = await hash(data.password, 12);

  const user = await prisma.user.update({
    where: { id },
    data: updateData,
  });

  revalidatePath('/dashboard/admin');
  return { id: user.id, nim: user.nim, name: user.name, role: user.role };
}

export async function deleteUser(id: string) {
  await requireAdmin();

  await prisma.user.delete({ where: { id } });
  revalidatePath('/dashboard/admin');
}
