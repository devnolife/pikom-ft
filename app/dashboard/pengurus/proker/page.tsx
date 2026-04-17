'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Inbox, ShieldAlert } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/dashboard/page-header';
import {
  getAllProker, createProker, updateProkerStatus, deleteProker,
} from '@/lib/actions/proker';
import { bidangDetail } from '@/app/data/bidang';
import { cn } from '@/lib/utils';

type ProkerItem = {
  id: string;
  bidang: string;
  title: string;
  status: string;
  deskripsi: string | null;
};

type StatusFilter = 'ALL' | 'terlaksana' | 'direncanakan';

const filters: { value: StatusFilter; label: string }[] = [
  { value: 'ALL', label: 'Semua' },
  { value: 'terlaksana', label: 'Terlaksana' },
  { value: 'direncanakan', label: 'Direncanakan' },
];

export default function PengurusProkerPage() {
  const { data: session } = useSession();
  const [proker, setProker] = useState<ProkerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('ALL');

  const [deleteTarget, setDeleteTarget] = useState<ProkerItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const userBidang = (session?.user as { bidang?: string } | undefined)?.bidang;

  useEffect(() => {
    getAllProker()
      .then(setProker)
      .catch((err) => toast.error((err as Error).message))
      .finally(() => setLoading(false));
    if (userBidang) setSelectedBidang(userBidang);
  }, [userBidang]);

  const scopeProker = useMemo(
    () => (userBidang ? proker.filter((p) => p.bidang === userBidang) : proker),
    [proker, userBidang]
  );

  const filteredProker = useMemo(
    () =>
      statusFilter === 'ALL'
        ? scopeProker
        : scopeProker.filter((p) => p.status === statusFilter),
    [scopeProker, statusFilter]
  );

  const handleAdd = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newTitle.trim()) {
      toast.error('Judul proker wajib diisi');
      return;
    }
    if (!selectedBidang) {
      toast.error('Pilih bidang terlebih dahulu');
      return;
    }
    setSubmitting(true);
    try {
      const item = await createProker({
        bidang: selectedBidang,
        title: newTitle.trim(),
      });
      setProker((prev) => [item, ...prev]);
      setNewTitle('');
      toast.success('Program kerja ditambahkan');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleStatus = async (item: ProkerItem) => {
    const newStatus = item.status === 'terlaksana' ? 'direncanakan' : 'terlaksana';
    // Optimistic
    setProker((prev) =>
      prev.map((p) => (p.id === item.id ? { ...p, status: newStatus } : p))
    );
    try {
      await updateProkerStatus(item.id, newStatus);
      toast.success(`Status: ${newStatus}`);
    } catch (err) {
      // Rollback
      setProker((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: item.status } : p))
      );
      toast.error((err as Error).message);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteProker(deleteTarget.id);
      setProker((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success(`"${deleteTarget.title}" dihapus`);
      setDeleteTarget(null);
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow={userBidang ? `Bidang · ${userBidang}` : 'Program Kerja'}
        title={<>Kelola <span className="text-gold">Program Kerja</span></>}
        description="Tambahkan, tandai selesai, atau hapus proker. Klik status untuk toggle cepat."
      />

      {/* Add form */}
      <form
        onSubmit={handleAdd}
        className="glass rounded-2xl p-4 md:p-5 mb-5 flex flex-col sm:flex-row gap-3"
      >
        {!userBidang && (
          <select
            value={selectedBidang}
            onChange={(e) => setSelectedBidang(e.target.value)}
            aria-label="Pilih bidang"
            disabled={submitting}
            className="flex h-9 min-w-[180px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
          >
            <option value="">Pilih Bidang…</option>
            {bidangDetail.map((b) => (
              <option key={b.slug} value={b.name}>
                {b.name}
              </option>
            ))}
          </select>
        )}
        <Input
          placeholder="Nama program kerja…"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          disabled={submitting}
          className="flex-1"
          aria-label="Judul proker baru"
        />
        <Button type="submit" loading={submitting} className="gap-2 shrink-0">
          <Plus size={16} /> Tambah
        </Button>
      </form>

      {/* Filter + list */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-5 md:px-6 py-4 border-b border-border">
          <p className="text-label">
            {loading ? 'Memuat…' : `${filteredProker.length} dari ${scopeProker.length} proker`}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {filters.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setStatusFilter(f.value)}
                className={cn(
                  'px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-widest border transition-colors',
                  statusFilter === f.value
                    ? 'bg-accent text-[color:var(--color-selection-text)] border-accent'
                    : 'border-border text-fg-secondary hover:bg-glass-overlay'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : filteredProker.length === 0 ? (
          <EmptyState
            className="m-4 md:m-6"
            icon={Inbox}
            title={
              scopeProker.length === 0
                ? 'Belum ada program kerja'
                : 'Tidak ada proker pada filter ini'
            }
            description={
              scopeProker.length === 0
                ? 'Tambahkan proker pertama di form di atas.'
                : 'Ubah filter status untuk melihat proker lain.'
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {filteredProker.map((item) => (
              <li
                key={item.id}
                className="flex items-center gap-3 px-5 md:px-6 py-3.5 hover:bg-glass-overlay transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{item.title}</p>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-fg-muted truncate">
                    {item.bidang}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleStatus(item)}
                  aria-label={`Toggle status ${item.title}`}
                  className={cn(
                    'text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded-full border shrink-0 cursor-pointer transition-colors',
                    item.status === 'terlaksana'
                      ? 'border-green-500/40 text-green-500 bg-green-500/10 hover:bg-green-500/20'
                      : 'border-[color:var(--color-accent)]/40 text-accent bg-[color:var(--color-accent)]/10 hover:bg-[color:var(--color-accent)]/20'
                  )}
                >
                  {item.status}
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  aria-label={`Hapus ${item.title}`}
                  className="p-2 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <ShieldAlert size={18} /> Hapus proker?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm font-mono leading-relaxed text-fg-secondary py-2">
            Program kerja <span className="font-bold text-fg">{deleteTarget?.title}</span> akan
            dihapus permanen.
          </p>
          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setDeleteTarget(null)}
              disabled={deleting}
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              loading={deleting}
              onClick={confirmDelete}
            >
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
