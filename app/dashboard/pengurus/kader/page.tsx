'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Users as UsersIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { PageHeader } from '@/components/dashboard/page-header';
import { getUsers } from '@/lib/actions/users';
import { bidangDetail } from '@/app/data/bidang';
import { cn } from '@/lib/utils';

type UserRow = {
  id: string;
  nim: string;
  name: string;
  role: string;
  bidang: string | null;
};

export default function PengurusKaderPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [bidangFilter, setBidangFilter] = useState<string>('ALL');

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const mahasiswa = useMemo(
    () => users.filter((u) => u.role === 'MAHASISWA'),
    [users]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return mahasiswa.filter((u) => {
      if (bidangFilter !== 'ALL' && u.bidang !== bidangFilter) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) || u.nim.toLowerCase().includes(q)
      );
    });
  }, [mahasiswa, search, bidangFilter]);

  return (
    <>
      <PageHeader
        eyebrow="Pengurus"
        title={<>Data <span className="text-gold">Kader</span></>}
        description={`Total ${mahasiswa.length} mahasiswa terdaftar. Gunakan pencarian atau filter bidang untuk menelusuri kader.`}
      />

      {/* Toolbar */}
      <div className="glass rounded-2xl p-3 md:p-4 mb-5 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted"
            aria-hidden="true"
          />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama atau NIM…"
            className="pl-9"
            aria-label="Cari kader"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 overflow-x-auto">
          <button
            type="button"
            onClick={() => setBidangFilter('ALL')}
            className={cn(
              'px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-widest border transition-colors shrink-0',
              bidangFilter === 'ALL'
                ? 'bg-accent text-[color:var(--color-selection-text)] border-accent'
                : 'border-border text-fg-secondary hover:bg-glass-overlay'
            )}
          >
            Semua
          </button>
          {bidangDetail.map((b) => (
            <button
              key={b.slug}
              type="button"
              onClick={() => setBidangFilter(b.name)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-widest border transition-colors shrink-0',
                bidangFilter === b.name
                  ? 'bg-accent text-[color:var(--color-selection-text)] border-accent'
                  : 'border-border text-fg-secondary hover:bg-glass-overlay'
              )}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={UsersIcon}
          title={mahasiswa.length === 0 ? 'Belum ada kader' : 'Tidak ada hasil'}
          description={
            mahasiswa.length === 0
              ? 'Data kader akan muncul setelah mahasiswa terdaftar.'
              : 'Ubah pencarian atau filter bidang.'
          }
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map((u) => (
            <div
              key={u.id}
              className="glass rounded-2xl p-4 flex items-center gap-3 hover:bg-glass-overlay transition-colors"
            >
              <div className="shrink-0 size-11 rounded-full bg-[color:var(--color-accent)]/10 flex items-center justify-center text-accent font-bold">
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{u.name}</p>
                <p className="text-[11px] font-mono uppercase tracking-widest text-fg-muted truncate">
                  {u.nim}
                </p>
                {u.bidang && (
                  <p className="text-[11px] font-mono text-accent mt-0.5 truncate">
                    {u.bidang}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
