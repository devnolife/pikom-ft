import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/dashboard/page-header';
import { LandingPeriodeManager } from '@/components/dashboard/landing-periode-manager';

export const dynamic = 'force-dynamic';

export default async function AdminPeriodePage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') redirect('/dashboard');

  const rows = await prisma.landingPeriode.findMany({ orderBy: { order: 'asc' } });

  return (
    <>
      <Link
        href="/dashboard/admin/landing"
        className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.2em] text-fg-muted hover:text-accent mb-4"
      >
        <ChevronLeft size={14} /> Kembali
      </Link>
      <PageHeader
        eyebrow="Landing › Sejarah"
        title={<>Periode <span className="text-gold">Sebelumnya</span></>}
        description="Jejak kepemimpinan dari periode ke periode."
      />
      <LandingPeriodeManager initial={rows.map((r) => ({ id: r.id, periode: r.periode, ketua: r.ketua }))} />
    </>
  );
}
