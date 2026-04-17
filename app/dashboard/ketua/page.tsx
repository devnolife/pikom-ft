import Link from 'next/link';
import {
  ClipboardList, Mail, FileText, Wallet, TrendingUp, TrendingDown, ArrowRight,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth-helpers';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { Badge } from '@/components/ui/badge';
import { formatIDR } from '@/lib/format';

export default async function KetuaOverviewPage() {
  await requireAuth();

  const [
    prokerCount, prokerTerlaksana, suratCount, aturanCount,
    sumIn, sumOut, prokerByBidang, recentSurat, recentTransaksi,
  ] = await Promise.all([
    prisma.proker.count(),
    prisma.proker.count({ where: { status: 'terlaksana' } }),
    prisma.surat.count(),
    prisma.aturan.count(),
    prisma.transaksi.aggregate({ _sum: { jumlah: true }, where: { tipe: 'PEMASUKAN' } }),
    prisma.transaksi.aggregate({ _sum: { jumlah: true }, where: { tipe: 'PENGELUARAN' } }),
    prisma.proker.groupBy({ by: ['bidang'], _count: { _all: true } }),
    prisma.surat.findMany({ orderBy: { tanggal: 'desc' }, take: 5 }),
    prisma.transaksi.findMany({ orderBy: { tanggal: 'desc' }, take: 5 }),
  ]);

  const pIn = sumIn._sum.jumlah ?? 0;
  const pOut = sumOut._sum.jumlah ?? 0;
  const saldo = pIn - pOut;

  return (
    <>
      <PageHeader
        eyebrow="Ketua Umum"
        title={<>Ringkasan <span className="text-gold">Komisariat</span></>}
        description="Pantau kondisi organisasi lintas bidang: program kerja, persuratan, aturan, dan keuangan."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-8">
        <StatCard
          label="Saldo Kas"
          value={formatIDR(saldo)}
          icon={Wallet}
          tone={saldo >= 0 ? 'green' : 'red'}
          hint={`${formatIDR(pIn)} masuk · ${formatIDR(pOut)} keluar`}
        />
        <StatCard
          label="Program Kerja"
          value={prokerCount}
          icon={ClipboardList}
          tone="gold"
          hint={`${prokerTerlaksana} terlaksana`}
        />
        <StatCard
          label="Persuratan"
          value={suratCount}
          icon={Mail}
          tone="accent"
        />
        <StatCard
          label="Aturan & TOR"
          value={aturanCount}
          icon={FileText}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-5">
        {/* Proker per bidang */}
        <section className="glass rounded-2xl p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-label">Proker per Bidang</h2>
            <Link href="/dashboard/pengurus/proker" className="text-[10px] font-mono uppercase tracking-widest text-fg-muted hover:text-fg flex items-center gap-1">
              Detail <ArrowRight size={11} />
            </Link>
          </div>
          <ul className="space-y-2">
            {prokerByBidang.map((b) => (
              <li key={b.bidang} className="flex items-center justify-between text-sm">
                <span className="truncate">{b.bidang}</span>
                <Badge variant="outline" className="text-[10px] uppercase tracking-widest font-mono">
                  {b._count._all}
                </Badge>
              </li>
            ))}
            {prokerByBidang.length === 0 && (
              <li className="text-xs font-mono text-fg-muted">Belum ada proker.</li>
            )}
          </ul>
        </section>

        {/* Surat terbaru */}
        <section className="glass rounded-2xl p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-label">Surat Terbaru</h2>
            <Link href="/dashboard/ketua/persuratan" className="text-[10px] font-mono uppercase tracking-widest text-fg-muted hover:text-fg flex items-center gap-1">
              Lihat semua <ArrowRight size={11} />
            </Link>
          </div>
          <ul className="space-y-3">
            {recentSurat.map((s) => (
              <li key={s.id} className="text-sm">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="outline" className="text-[9px] uppercase tracking-widest">
                    {s.tipe}
                  </Badge>
                  <span className="text-[11px] font-mono text-fg-muted">
                    {new Date(s.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
                  </span>
                </div>
                <p className="truncate font-medium mt-0.5">{s.perihal}</p>
                <p className="text-[11px] font-mono text-fg-muted truncate">{s.nomor}</p>
              </li>
            ))}
            {recentSurat.length === 0 && (
              <li className="text-xs font-mono text-fg-muted">Belum ada surat.</li>
            )}
          </ul>
        </section>

        {/* Transaksi terbaru */}
        <section className="glass rounded-2xl p-5 lg:col-span-1">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-label">Transaksi Terbaru</h2>
            <Link href="/dashboard/ketua/keuangan" className="text-[10px] font-mono uppercase tracking-widest text-fg-muted hover:text-fg flex items-center gap-1">
              Lihat semua <ArrowRight size={11} />
            </Link>
          </div>
          <ul className="space-y-3">
            {recentTransaksi.map((t) => (
              <li key={t.id} className="text-sm flex items-center gap-2">
                {t.tipe === 'PEMASUKAN'
                  ? <TrendingUp size={14} className="text-emerald-500 shrink-0" />
                  : <TrendingDown size={14} className="text-red-500 shrink-0" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{t.deskripsi || t.kategori}</p>
                  <p className="text-[11px] font-mono text-fg-muted">
                    {new Date(t.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })} · {t.kategori}
                  </p>
                </div>
                <span className={t.tipe === 'PEMASUKAN' ? 'text-emerald-500 text-xs font-mono tabular-nums' : 'text-red-500 text-xs font-mono tabular-nums'}>
                  {t.tipe === 'PEMASUKAN' ? '+' : '−'} {formatIDR(t.jumlah)}
                </span>
              </li>
            ))}
            {recentTransaksi.length === 0 && (
              <li className="text-xs font-mono text-fg-muted">Belum ada transaksi.</li>
            )}
          </ul>
        </section>
      </div>
    </>
  );
}
