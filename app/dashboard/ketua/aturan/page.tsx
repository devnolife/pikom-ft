import Link from 'next/link';
import { ExternalLink, FileText } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { PageHeader } from '@/components/dashboard/page-header';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { cn } from '@/lib/utils';

const kategoriLabel: Record<string, string> = {
  TOR: 'TOR', AD_ART: 'AD/ART', SOP: 'SOP', LAIN: 'Lainnya',
};
const kategoriColor: Record<string, string> = {
  TOR: 'border-blue-500/40 text-blue-500 bg-blue-500/10',
  AD_ART: 'border-purple-500/40 text-purple-500 bg-purple-500/10',
  SOP: 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10',
  LAIN: 'border-border text-fg-secondary bg-glass-overlay',
};

export default async function KetuaAturanPage() {
  await requireAuth();
  const rows = await prisma.aturan.findMany({ orderBy: { updatedAt: 'desc' } });

  return (
    <>
      <PageHeader
        eyebrow="Ketua Umum · Read only"
        title={<>TOR & <span className="text-gold">Aturan</span></>}
        description="Daftar dokumen aturan, TOR, dan SOP yang dikelola Sekretaris Umum."
      />

      <div className="flex justify-end mb-3">
        <Link href="/dashboard/ketua" className="text-[10px] font-mono uppercase tracking-widest text-fg-muted hover:text-fg">← Ringkasan</Link>
      </div>

      {rows.length === 0 ? (
        <EmptyState icon={FileText} title="Belum ada dokumen" description="Belum ada dokumen tersimpan." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((r) => (
            <article key={r.id} className="glass rounded-2xl p-5 flex flex-col gap-3">
              <Badge variant="outline" className={cn('text-[10px] uppercase tracking-widest self-start', kategoriColor[r.kategori])}>
                {kategoriLabel[r.kategori]}
              </Badge>
              <h3 className="text-base font-bold leading-snug line-clamp-2">{r.judul}</h3>
              {r.konten && (
                <p className="text-xs font-mono text-fg-muted leading-relaxed line-clamp-4 whitespace-pre-wrap">
                  {r.konten.replace(/^#+\s?/gm, '')}
                </p>
              )}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border text-[10px] font-mono uppercase tracking-widest text-fg-muted">
                <span>{new Date(r.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                {r.lampiranUrl && (
                  <a href={r.lampiranUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-fg">
                    <ExternalLink size={11} /> lampiran
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
