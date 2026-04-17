'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { requireAnyJabatan, requireAuth } from '@/lib/auth-helpers';
import type { TipeTransaksi } from '@prisma/client';

export type TransaksiInput = {
  tipe: TipeTransaksi;
  tanggal: string;
  kategori: string;
  jumlah: number;
  deskripsi?: string;
  pihak?: string;
  bidang?: string;
  notaUrl?: string | null;
};

export async function getTransaksi(opts?: { from?: string; to?: string; bidang?: string }) {
  await requireAuth();
  return prisma.transaksi.findMany({
    where: {
      ...(opts?.from || opts?.to
        ? {
          tanggal: {
            ...(opts.from ? { gte: new Date(opts.from) } : {}),
            ...(opts.to ? { lte: new Date(opts.to) } : {}),
          },
        }
        : {}),
      ...(opts?.bidang ? { bidang: opts.bidang } : {}),
    },
    orderBy: { tanggal: 'desc' },
  });
}

export async function getSaldoSummary(opts?: { from?: string; to?: string }) {
  await requireAuth();
  const where = opts?.from || opts?.to
    ? {
      tanggal: {
        ...(opts.from ? { gte: new Date(opts.from) } : {}),
        ...(opts.to ? { lte: new Date(opts.to) } : {}),
      },
    }
    : {};

  const [pemasukan, pengeluaran] = await Promise.all([
    prisma.transaksi.aggregate({
      _sum: { jumlah: true },
      where: { ...where, tipe: 'PEMASUKAN' },
    }),
    prisma.transaksi.aggregate({
      _sum: { jumlah: true },
      where: { ...where, tipe: 'PENGELUARAN' },
    }),
  ]);

  const pIn = pemasukan._sum.jumlah ?? 0;
  const pOut = pengeluaran._sum.jumlah ?? 0;
  return { pemasukan: pIn, pengeluaran: pOut, saldo: pIn - pOut };
}

export async function createTransaksi(data: TransaksiInput) {
  const user = await requireAnyJabatan('BENDAHARA_UMUM');
  const row = await prisma.transaksi.create({
    data: {
      tipe: data.tipe,
      tanggal: new Date(data.tanggal),
      kategori: data.kategori.trim(),
      jumlah: Math.round(data.jumlah),
      deskripsi: data.deskripsi?.trim() || null,
      pihak: data.pihak?.trim() || null,
      bidang: data.bidang?.trim() || null,
      notaUrl: data.notaUrl || null,
      createdById: user.id,
    },
  });
  revalidatePath('/dashboard/bendahara');
  revalidatePath('/dashboard/ketua');
  return row;
}

export async function updateTransaksi(id: string, data: TransaksiInput) {
  await requireAnyJabatan('BENDAHARA_UMUM');
  const row = await prisma.transaksi.update({
    where: { id },
    data: {
      tipe: data.tipe,
      tanggal: new Date(data.tanggal),
      kategori: data.kategori.trim(),
      jumlah: Math.round(data.jumlah),
      deskripsi: data.deskripsi?.trim() || null,
      pihak: data.pihak?.trim() || null,
      bidang: data.bidang?.trim() || null,
      notaUrl: data.notaUrl || null,
    },
  });
  revalidatePath('/dashboard/bendahara');
  revalidatePath('/dashboard/ketua');
  return row;
}

export async function deleteTransaksi(id: string) {
  await requireAnyJabatan('BENDAHARA_UMUM');
  await prisma.transaksi.delete({ where: { id } });
  revalidatePath('/dashboard/bendahara');
  revalidatePath('/dashboard/ketua');
}
