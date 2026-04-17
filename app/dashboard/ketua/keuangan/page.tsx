import Link from 'next/link';
import { ExternalLink, TrendingDown, TrendingUp, Wallet } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { formatIDR } from '@/lib/format';
import { cn } from '@/lib/utils';

export default async function KetuaKeuanganPage() {
  await requireAuth();
  const [rows, sumIn, sumOut] = await Promise.all([
    prisma.transaksi.findMany({ orderBy: { tanggal: 'desc' } }),
    prisma.transaksi.aggregate({ _sum: { jumlah: true }, where: { tipe: 'PEMASUKAN' } }),
    prisma.transaksi.aggregate({ _sum: { jumlah: true }, where: { tipe: 'PENGELUARAN' } }),
  ]);
  const pIn = sumIn._sum.jumlah ?? 0;
  const pOut = sumOut._sum.jumlah ?? 0;
  const saldo = pIn - pOut;

  return (
    <>
      <PageHeader
        eyebrow="Ketua Umum · Read only"
        title={<>Kas & <span className="text-gold">Keuangan</span></>}
        description="Ringkasan dan rincian pemasukan-pengeluaran organisasi."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
        <StatCard label="Saldo" value={formatIDR(saldo)} icon={Wallet} tone={saldo >= 0 ? 'green' : 'red'} />
        <StatCard label="Pemasukan" value={formatIDR(pIn)} icon={TrendingUp} tone="green" />
        <StatCard label="Pengeluaran" value={formatIDR(pOut)} icon={TrendingDown} tone="red" />
      </div>

      <div className="flex justify-end mb-3">
        <Link href="/dashboard/ketua" className="text-[10px] font-mono uppercase tracking-widest text-fg-muted hover:text-fg">← Ringkasan</Link>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-border">
          <p className="text-label">{rows.length} transaksi</p>
        </div>
        {rows.length === 0 ? (
          <EmptyState className="m-4 md:m-6" icon={Wallet} title="Belum ada transaksi" description="Bendahara Umum belum mencatat transaksi." />
        ) : (
          <ul className="divide-y divide-border">
            {rows.map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-5 md:px-6 py-3.5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] uppercase tracking-widest',
                        r.tipe === 'PEMASUKAN'
                          ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10'
                          : 'border-red-500/40 text-red-500 bg-red-500/10'
                      )}
                    >
                      {r.tipe === 'PEMASUKAN' ? 'Masuk' : 'Keluar'}
                    </Badge>
                    <span className="text-[11px] font-mono text-fg-muted">
                      {new Date(r.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-fg-muted">{r.kategori}</span>
                  </div>
                  <p className="text-sm font-semibold mt-1 truncate">{r.deskripsi || r.kategori}</p>
                  {r.bidang && <p className="text-[11px] font-mono text-fg-muted">· {r.bidang}</p>}
                </div>
                <div className={cn('text-sm font-bold font-mono tabular-nums', r.tipe === 'PEMASUKAN' ? 'text-emerald-500' : 'text-red-500')}>
                  {r.tipe === 'PEMASUKAN' ? '+' : '−'} {formatIDR(r.jumlah)}
                </div>
                {r.notaUrl && (
                  <a href={r.notaUrl} target="_blank" rel="noreferrer" className="p-2 rounded-md text-fg-muted hover:text-fg hover:bg-glass-overlay">
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
