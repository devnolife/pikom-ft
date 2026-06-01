import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/dashboard/page-header';
import { LandingContentEditor } from '@/components/dashboard/landing-content-editor';

export const dynamic = 'force-dynamic';

export default async function AdminTeksPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') redirect('/dashboard');

  const rows = await prisma.landingContent.findMany({
    orderBy: [{ groupName: 'asc' }, { order: 'asc' }],
  });

  return (
    <>
      <Link
        href="/dashboard/admin/landing"
        className="inline-flex items-center gap-1 text-[11px] font-mono uppercase tracking-[0.2em] text-fg-muted hover:text-accent mb-4"
      >
        <ChevronLeft size={14} /> Kembali
      </Link>
      <PageHeader
        eyebrow="Landing › Teks"
        title={<>Teks <span className="text-gold">Landing</span></>}
        description="Ubah seluruh kalimat di halaman utama — hero, about, stats, CTA, footer, dan header tiap section."
      />
      <LandingContentEditor
        initial={rows.map((r) => ({
          id: r.id,
          key: r.key,
          value: r.value,
          groupName: r.groupName,
          label: r.label,
          multiline: r.multiline,
        }))}
      />
    </>
  );
}
