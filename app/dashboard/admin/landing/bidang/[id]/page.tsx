import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/dashboard/page-header';
import { LandingBidangEdit } from '@/components/dashboard/landing-bidang-edit';

export const dynamic = 'force-dynamic';

export default async function AdminBidangEditPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') redirect('/dashboard');

  const { id } = await params;
  const row = await prisma.landingBidang.findUnique({
    where: { id },
    include: {
      anggota: { orderBy: { order: 'asc' } },
      proker: { orderBy: { order: 'asc' } },
    },
  });
  if (!row) notFound();

  return (
    <>
      <Link
        href="/dashboard/admin/landing/bidang"
        className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.2em] text-fg-muted hover:text-accent mb-4"
      >
        <ChevronLeft size={14} /> Kembali ke daftar bidang
      </Link>
      <PageHeader
        eyebrow={`Bidang › ${row.slug}`}
        title={<>Edit <span className="text-gold">{row.name}</span></>}
        description="Atur informasi, ketua, sekretaris, anggota, dan program kerja."
      />
      <LandingBidangEdit
        id={row.id}
        initial={{
          slug: row.slug,
          name: row.name,
          icon: row.icon,
          desc: row.desc,
          ketua: row.ketua,
          sekretaris: row.sekretaris,
          anggota: row.anggota.map((a) => a.nama),
          prokerTerlaksana: row.proker.filter((p) => p.status === 'TERLAKSANA').map((p) => p.title),
          prokerDirencanakan: row.proker.filter((p) => p.status === 'DIRENCANAKAN').map((p) => p.title),
        }}
      />
    </>
  );
}
