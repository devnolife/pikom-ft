import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/dashboard/page-header';
import { LandingBidangListManager } from '@/components/dashboard/landing-bidang-list-manager';

export const dynamic = 'force-dynamic';

export default async function AdminBidangListPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') redirect('/dashboard');

  const rows = await prisma.landingBidang.findMany({ orderBy: { order: 'asc' } });

  return (
    <>
      <Link
        href="/dashboard/admin/landing"
        className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.2em] text-fg-muted hover:text-accent mb-4"
      >
        <ChevronLeft size={14} /> Kembali
      </Link>
      <PageHeader
        eyebrow="Landing › Struktur"
        title={<>Daftar <span className="text-gold">Bidang</span></>}
        description="Tambah, hapus, dan susun urutan bidang. Klik Edit untuk mengatur ketua, sekretaris, anggota, dan proker."
      />
      <LandingBidangListManager
        initial={rows.map((r) => ({
          id: r.id,
          slug: r.slug,
          name: r.name,
          icon: r.icon,
          desc: r.desc,
        }))}
      />
    </>
  );
}
