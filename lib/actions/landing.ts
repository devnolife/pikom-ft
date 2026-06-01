'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function assertAdmin() {
  const session = await auth();
  if (!session?.user) throw new Error('Unauthorized');
  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') throw new Error('Forbidden');
  return session;
}

function revalidatePublic() {
  // Revalidate landing & semua slug bidang.
  revalidatePath('/', 'layout');
}

// ── Pimpinan Inti ─────────────────────────────────────────────

export async function createPimpinan(input: {
  slug: string;
  title: string;
  role?: string | null;
  nama: string;
  featured?: boolean;
}) {
  await assertAdmin();
  const slug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  if (!slug) throw new Error('Slug tidak boleh kosong');
  const max = await prisma.landingPimpinan.aggregate({ _max: { order: true } });
  await prisma.landingPimpinan.create({
    data: {
      slug,
      title: input.title.trim(),
      role: input.role?.trim() || null,
      nama: input.nama.trim(),
      featured: input.featured ?? false,
      order: (max._max.order ?? -1) + 1,
    },
  });
  revalidatePublic();
}

export async function updatePimpinan(id: string, input: {
  title?: string;
  role?: string | null;
  nama?: string;
  featured?: boolean;
  order?: number;
}) {
  await assertAdmin();
  await prisma.landingPimpinan.update({
    where: { id },
    data: {
      ...(input.title !== undefined ? { title: input.title.trim() } : {}),
      ...(input.role !== undefined ? { role: input.role?.trim() || null } : {}),
      ...(input.nama !== undefined ? { nama: input.nama.trim() } : {}),
      ...(input.featured !== undefined ? { featured: input.featured } : {}),
      ...(input.order !== undefined ? { order: input.order } : {}),
    },
  });
  revalidatePublic();
}

export async function deletePimpinan(id: string) {
  await assertAdmin();
  await prisma.landingPimpinan.delete({ where: { id } });
  revalidatePublic();
}

export async function reorderPimpinan(ids: string[]) {
  await assertAdmin();
  await prisma.$transaction(
    ids.map((id, idx) =>
      prisma.landingPimpinan.update({ where: { id }, data: { order: idx } })
    )
  );
  revalidatePublic();
}

// ── Bidang ────────────────────────────────────────────────────

export async function createBidang(input: {
  slug: string;
  name: string;
  icon: string;
  desc: string;
  ketua?: string | null;
  sekretaris?: string | null;
}) {
  await assertAdmin();
  const slug = input.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-');
  if (!slug) throw new Error('Slug tidak boleh kosong');
  const max = await prisma.landingBidang.aggregate({ _max: { order: true } });
  const row = await prisma.landingBidang.create({
    data: {
      slug,
      name: input.name.trim(),
      icon: input.icon || 'Sparkles',
      desc: input.desc.trim(),
      ketua: input.ketua?.trim() || null,
      sekretaris: input.sekretaris?.trim() || null,
      order: (max._max.order ?? -1) + 1,
    },
  });
  revalidatePublic();
  return row;
}

export async function updateBidang(id: string, input: {
  name?: string;
  slug?: string;
  icon?: string;
  desc?: string;
  ketua?: string | null;
  sekretaris?: string | null;
  order?: number;
}) {
  await assertAdmin();
  await prisma.landingBidang.update({
    where: { id },
    data: {
      ...(input.name !== undefined ? { name: input.name.trim() } : {}),
      ...(input.slug !== undefined ? { slug: input.slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-') } : {}),
      ...(input.icon !== undefined ? { icon: input.icon } : {}),
      ...(input.desc !== undefined ? { desc: input.desc.trim() } : {}),
      ...(input.ketua !== undefined ? { ketua: input.ketua?.trim() || null } : {}),
      ...(input.sekretaris !== undefined ? { sekretaris: input.sekretaris?.trim() || null } : {}),
      ...(input.order !== undefined ? { order: input.order } : {}),
    },
  });
  revalidatePublic();
}

export async function deleteBidang(id: string) {
  await assertAdmin();
  await prisma.landingBidang.delete({ where: { id } });
  revalidatePublic();
}

export async function reorderBidang(ids: string[]) {
  await assertAdmin();
  await prisma.$transaction(
    ids.map((id, idx) =>
      prisma.landingBidang.update({ where: { id }, data: { order: idx } })
    )
  );
  revalidatePublic();
}

// ── Bidang Anggota ────────────────────────────────────────────

export async function setBidangAnggota(bidangId: string, names: string[]) {
  await assertAdmin();
  const clean = names.map((n) => n.trim()).filter(Boolean);
  await prisma.$transaction([
    prisma.landingBidangAnggota.deleteMany({ where: { bidangId } }),
    prisma.landingBidangAnggota.createMany({
      data: clean.map((nama, i) => ({ bidangId, nama, order: i })),
    }),
  ]);
  revalidatePublic();
}

// ── Proker ────────────────────────────────────────────────────

export async function setBidangProker(
  bidangId: string,
  data: { terlaksana: string[]; direncanakan: string[] }
) {
  await assertAdmin();
  const cleanT = data.terlaksana.map((s) => s.trim()).filter(Boolean);
  const cleanD = data.direncanakan.map((s) => s.trim()).filter(Boolean);
  await prisma.$transaction([
    prisma.landingProker.deleteMany({ where: { bidangId } }),
    prisma.landingProker.createMany({
      data: [
        ...cleanT.map((title, i) => ({ bidangId, title, status: 'TERLAKSANA' as const, order: i })),
        ...cleanD.map((title, i) => ({ bidangId, title, status: 'DIRENCANAKAN' as const, order: i })),
      ],
    }),
  ]);
  revalidatePublic();
}

// ── Periode Sebelumnya ────────────────────────────────────────

export async function createPeriode(input: { periode: string; ketua: string }) {
  await assertAdmin();
  const max = await prisma.landingPeriode.aggregate({ _max: { order: true } });
  await prisma.landingPeriode.create({
    data: {
      periode: input.periode.trim(),
      ketua: input.ketua.trim(),
      order: (max._max.order ?? -1) + 1,
    },
  });
  revalidatePublic();
}

export async function updatePeriode(id: string, input: { periode?: string; ketua?: string; order?: number }) {
  await assertAdmin();
  await prisma.landingPeriode.update({
    where: { id },
    data: {
      ...(input.periode !== undefined ? { periode: input.periode.trim() } : {}),
      ...(input.ketua !== undefined ? { ketua: input.ketua.trim() } : {}),
      ...(input.order !== undefined ? { order: input.order } : {}),
    },
  });
  revalidatePublic();
}

export async function deletePeriode(id: string) {
  await assertAdmin();
  await prisma.landingPeriode.delete({ where: { id } });
  revalidatePublic();
}

// ── Content (key-value) ───────────────────────────────────────

export async function updateContentBulk(entries: Array<{ id: string; value: string }>) {
  await assertAdmin();
  await prisma.$transaction(
    entries.map((e) =>
      prisma.landingContent.update({ where: { id: e.id }, data: { value: e.value } })
    )
  );
  revalidatePublic();
}

export async function upsertContent(input: {
  key: string;
  value: string;
  groupName?: string;
  label?: string;
  multiline?: boolean;
}) {
  await assertAdmin();
  await prisma.landingContent.upsert({
    where: { key: input.key },
    create: {
      key: input.key,
      value: input.value,
      groupName: input.groupName ?? 'Umum',
      label: input.label ?? null,
      multiline: input.multiline ?? false,
    },
    update: { value: input.value },
  });
  revalidatePublic();
}

// ── Seed trigger ──────────────────────────────────────────────

export async function triggerSeed() {
  await assertAdmin();
  const { seedLandingCMS } = await import('@/lib/landing-cms-seed');
  return seedLandingCMS(prisma);
}
