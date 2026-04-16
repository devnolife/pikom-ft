'use server';

import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getMyProgress() {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  return prisma.progress.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'asc' },
  });
}

export async function updateProgress(id: string, status: string, note?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  // Verify ownership
  const progress = await prisma.progress.findUnique({ where: { id } });
  if (!progress || progress.userId !== session.user.id) {
    throw new Error('Forbidden');
  }

  const updated = await prisma.progress.update({
    where: { id },
    data: { status, note },
  });

  revalidatePath('/dashboard/mahasiswa');
  return updated;
}

export async function addProgress(title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error('Unauthorized');

  const created = await prisma.progress.create({
    data: {
      title,
      userId: session.user.id,
    },
  });

  revalidatePath('/dashboard/mahasiswa');
  return created;
}
