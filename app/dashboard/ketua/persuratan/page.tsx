import Link from 'next/link';
import { ExternalLink, Mail } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { PageHeader } from '@/components/dashboard/page-header';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

export default async function KetuaPersuratanPage() {
  await requireAuth();
  const rows = await prisma.surat.findMany({ orderBy: { tanggal: 'desc' } });

  return (
    <>
      <PageHeader
        eyebrow="Ketua Umum · Read only"
        title={<>Persuratan <span className="text-gold">Organisasi</span></>}
        description="Seluruh surat masuk dan keluar yang tercatat oleh Sekretaris Umum."
      />

      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-border">
          <p className="text-label">{rows.length} surat tercatat</p>
          <Link href="/dashboard/ketua" className="text-[10px] font-mono uppercase tracking-widest text-fg-muted hover:text-fg">
            ← Ringkasan
          </Link>
        </div>
        {rows.length === 0 ? (
          <EmptyState className="m-4 md:m-6" icon={Mail} title="Belum ada surat" description="Sekretaris Umum belum mencatat surat." />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="flex items-start gap-3 px-5 md:px-6 py-3.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest">{r.tipe}</Badge>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest">{r.nomor}</Badge>
                    <span className="text-[11px] font-mono text-fg-muted">
                      {new Date(r.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mt-1 truncate">{r.perihal}</p>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-fg-muted truncate">
                    {r.tipe === 'MASUK' ? `Dari: ${r.pengirim ?? '—'}` : `Untuk: ${r.tujuan ?? '—'}`}
                  </p>
                </div>
                {r.lampiranUrl && (
                  <a href={r.lampiranUrl} target="_blank" rel="noreferrer" className="p-2 rounded-md text-fg-muted hover:text-fg hover:bg-glass-overlay" aria-label="Buka lampiran">
                    <ExternalLink size={14} />
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
