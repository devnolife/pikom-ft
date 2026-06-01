import Link from 'next/link';
import { redirect } from 'next/navigation';
import { Image as ImageIcon, Users, Layers, History, Type, ArrowRight } from 'lucide-react';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { PageHeader } from '@/components/dashboard/page-header';

export const dynamic = 'force-dynamic';

export default async function AdminLandingHubPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') redirect('/dashboard');

  const [imagesCount, pimpinanCount, bidangCount, periodeCount, contentCount] = await Promise.all([
    prisma.landingAsset.count(),
    prisma.landingPimpinan.count(),
    prisma.landingBidang.count(),
    prisma.landingPeriode.count(),
    prisma.landingContent.count(),
  ]);

  const cards: Array<{ href: string; title: string; desc: string; count: number; Icon: typeof ImageIcon }> = [
    { href: '/dashboard/admin/landing/images', title: 'Gambar', desc: 'Hero, pimpinan, ketua/sekretaris bidang, cover.', count: imagesCount, Icon: ImageIcon },
    { href: '/dashboard/admin/landing/pimpinan', title: 'Pimpinan Inti', desc: 'Ketua, Sekretaris, Bendahara.', count: pimpinanCount, Icon: Users },
    { href: '/dashboard/admin/landing/bidang', title: 'Bidang', desc: 'Nama, ikon, ketua/sekretaris, anggota, proker.', count: bidangCount, Icon: Layers },
    { href: '/dashboard/admin/landing/periode', title: 'Periode Sebelumnya', desc: 'Jejak kepemimpinan dari periode ke periode.', count: periodeCount, Icon: History },
    { href: '/dashboard/admin/landing/teks', title: 'Teks Landing', desc: 'Hero, about, stats, CTA, footer, section headers.', count: contentCount, Icon: Type },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Landing Pages"
        title={<>Kelola <span className="text-gold">Landing</span></>}
        description="Atur seluruh isi halaman utama dari satu tempat — gambar, struktur pengurus, bidang, periode sebelumnya, hingga teks bebas."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group glass rounded-2xl p-6 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform border border-border/60"
          >
            <div className="flex items-center justify-between">
              <div className="p-2.5 rounded-xl glass-strong w-fit">
                <c.Icon size={18} className="text-accent" />
              </div>
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-fg-muted">
                {c.count} item
              </span>
            </div>
            <div>
              <h3 className="text-lg font-bold uppercase tracking-tight">{c.title}</h3>
              <p className="text-sm font-mono text-fg-muted mt-1 leading-relaxed">{c.desc}</p>
            </div>
            <div className="mt-auto flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-accent">
              Kelola
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
