'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  BarChart3, CheckCircle2, Clock, AlertCircle, Plus, Target,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import {
  getMyProgress, updateProgress, addProgress,
} from '@/lib/actions/progress';
import { cn } from '@/lib/utils';

type ProgressItem = {
  id: string;
  title: string;
  status: string;
  note: string | null;
};

const statusConfig: Record<
  string,
  { label: string; icon: typeof CheckCircle2; badge: string; icon_cls: string }
> = {
  selesai: {
    label: 'Selesai',
    icon: CheckCircle2,
    badge: 'border-green-500/40 text-green-500 bg-green-500/10',
    icon_cls: 'text-green-500',
  },
  proses: {
    label: 'Proses',
    icon: Clock,
    badge: 'border-[color:var(--color-accent)]/40 text-gold bg-[color:var(--color-accent)]/10',
    icon_cls: 'text-gold',
  },
  belum: {
    label: 'Belum',
    icon: AlertCircle,
    badge: 'border-red-500/40 text-red-500 bg-red-500/10',
    icon_cls: 'text-red-500',
  },
};

const nextStatus = (current: string) => {
  const order = ['belum', 'proses', 'selesai'];
  const idx = order.indexOf(current);
  return order[(idx + 1) % order.length];
};

export default function MahasiswaPage() {
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getMyProgress()
      .then(setProgress)
      .catch((err) => toast.error((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTitle.trim()) return;
    setSubmitting(true);
    try {
      const item = await addProgress(newTitle.trim());
      setProgress((prev) => [...prev, item]);
      setNewTitle('');
      toast.success('Progress ditambahkan');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatusChange = async (item: ProgressItem) => {
    const newStatus = nextStatus(item.status);
    // Optimistic
    setProgress((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, status: newStatus } : p))
    );
    try {
      await updateProgress(item.id, newStatus);
    } catch (err) {
      setProgress((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: item.status } : p))
      );
      toast.error((err as Error).message);
    }
  };

  const stats = {
    total: progress.length,
    selesai: progress.filter((p) => p.status === 'selesai').length,
    proses: progress.filter((p) => p.status === 'proses').length,
    belum: progress.filter((p) => p.status === 'belum').length,
  };

  const percentage =
    stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0;

  return (
    <>
      <PageHeader
        eyebrow="Mahasiswa"
        title={<>Halo, <span className="text-gold">{session?.user?.name ?? 'Kader'}</span></>}
        description="Pantau progress kaderisasimu. Klik item untuk berpindah status: Belum → Proses → Selesai."
      />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
          : (
            <>
              <StatCard label="Total" value={stats.total} icon={BarChart3} tone="accent" />
              <StatCard
                label="Selesai"
                value={stats.selesai}
                icon={CheckCircle2}
                tone="green"
              />
              <StatCard label="Proses" value={stats.proses} icon={Clock} tone="gold" />
              <StatCard label="Belum" value={stats.belum} icon={AlertCircle} tone="red" />
            </>
          )}
      </div>

      {/* Progress bar */}
      {!loading && (
        <div className="glass rounded-2xl p-5 md:p-6 mb-6">
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-eyebrow mb-1">Progres Keseluruhan</p>
              <p className="text-4xl md:text-5xl font-black tabular-nums">
                {percentage}
                <span className="text-2xl text-fg-muted">%</span>
              </p>
            </div>
            <p className="text-sm font-mono text-fg-muted tabular-nums">
              <Target size={14} className="inline mr-1 -mt-0.5" aria-hidden="true" />
              {stats.selesai}/{stats.total} tuntas
            </p>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-secondary)] transition-[width] duration-700"
              // eslint-disable-next-line react/forbid-dom-props
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="glass rounded-2xl p-4 md:p-5 mb-5 flex flex-col sm:flex-row gap-3"
      >
        <Input
          placeholder="Tambah progress baru…"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={submitting}
          className="flex-1"
          aria-label="Judul progress baru"
        />
        <Button type="submit" loading={submitting} className="gap-2 shrink-0">
          <Plus size={16} /> Tambah
        </Button>
      </form>

      {/* List */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-5 md:px-6 py-4 border-b border-border">
          <p className="text-eyebrow mb-0.5">Checklist</p>
          <h3 className="text-lg font-bold uppercase tracking-tight">Daftar Progress</h3>
        </div>

        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : progress.length === 0 ? (
          <EmptyState
            className="m-4 md:m-6"
            icon={Target}
            title="Belum ada progress"
            description="Tambahkan item pertama melalui form di atas untuk mulai tracking."
          />
        ) : (
          <ul className="divide-y divide-border">
            {progress.map((item) => {
              const config = statusConfig[item.status] || statusConfig.belum;
              const StatusIcon = config.icon;
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleStatusChange(item)}
                    className="w-full flex items-center gap-3 px-5 md:px-6 py-3.5 hover:bg-glass-overlay transition-colors text-left"
                  >
                    <StatusIcon
                      size={18}
                      className={cn('shrink-0', config.icon_cls)}
                      aria-hidden="true"
                    />
                    <span className="flex-1 text-sm font-medium">{item.title}</span>
                    <span
                      className={cn(
                        'text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0',
                        config.badge
                      )}
                    >
                      {config.label}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
}
