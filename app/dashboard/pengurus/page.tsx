'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  ClipboardList, CheckCircle2, CalendarClock, ArrowRight, Inbox,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { getAllProker } from '@/lib/actions/proker';
import { cn } from '@/lib/utils';

type ProkerItem = {
  id: string;
  bidang: string;
  title: string;
  status: string;
};

export default function PengurusPage() {
  const { data: session } = useSession();
  const [proker, setProker] = useState<ProkerItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProker()
      .then(setProker)
      .finally(() => setLoading(false));
  }, []);

  const bidang = (session?.user as { bidang?: string } | undefined)?.bidang;
  const myProker = bidang ? proker.filter((p) => p.bidang === bidang) : proker;

  const stats = {
    total: myProker.length,
    terlaksana: myProker.filter((p) => p.status === 'terlaksana').length,
    direncanakan: myProker.filter((p) => p.status === 'direncanakan').length,
  };

  const progressPct =
    stats.total === 0 ? 0 : Math.round((stats.terlaksana / stats.total) * 100);

  return (
    <>
      <PageHeader
        eyebrow={bidang ? `Bidang · ${bidang}` : 'Pengurus'}
        title={<>Halo, <span className="text-gold">{session?.user?.name ?? 'Pengurus'}</span></>}
        description="Pantau status program kerja bidangmu dan kelola kaderisasi dari satu tempat."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-8">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
          : (
            <>
              <StatCard
                label="Total Proker"
                value={stats.total}
                icon={ClipboardList}
                tone="accent"
              />
              <StatCard
                label="Terlaksana"
                value={stats.terlaksana}
                icon={CheckCircle2}
                tone="green"
                hint={`${progressPct}% tuntas`}
              />
              <StatCard
                label="Direncanakan"
                value={stats.direncanakan}
                icon={CalendarClock}
                tone="default"
              />
            </>
          )}
      </div>

      {!loading && stats.total > 0 && (
        <div className="glass rounded-2xl p-5 md:p-6 mb-8">
          <div className="flex items-end justify-between mb-3">
            <p className="text-eyebrow">Progres Bidang</p>
            <p className="text-sm font-mono text-fg-muted tabular-nums">
              {stats.terlaksana}/{stats.total} · {progressPct}%
            </p>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-secondary)] transition-[width] duration-700"
              // eslint-disable-next-line react/forbid-dom-props
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}

      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-border">
          <div>
            <p className="text-eyebrow mb-0.5">Program Kerja</p>
            <h3 className="text-lg font-bold uppercase tracking-tight">Aktivitas Terbaru</h3>
          </div>
          <Link
            href="/dashboard/pengurus/proker"
            className="text-xs font-mono uppercase tracking-widest text-fg-muted hover:text-accent transition-colors inline-flex items-center gap-1"
          >
            Kelola <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-12 rounded-lg" />
            ))}
          </div>
        ) : myProker.length === 0 ? (
          <EmptyState
            className="m-4 md:m-6"
            icon={Inbox}
            title="Belum ada program kerja"
            description="Tambahkan proker pertama dari halaman Program Kerja."
          />
        ) : (
          <ul className="divide-y divide-border">
            {myProker.slice(0, 10).map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 px-5 md:px-6 py-3.5"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{item.title}</p>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-fg-muted truncate">
                    {item.bidang}
                  </p>
                </div>
                <span
                  className={cn(
                    'text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0',
                    item.status === 'terlaksana'
                      ? 'border-green-500/40 text-green-500 bg-green-500/10'
                      : 'border-[color:var(--color-accent)]/40 text-accent bg-[color:var(--color-accent)]/10'
                  )}
                >
                  {item.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
