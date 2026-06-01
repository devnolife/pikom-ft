'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Star, ArrowUp, ArrowDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  createPimpinan,
  deletePimpinan,
  reorderPimpinan,
  updatePimpinan,
} from '@/lib/actions/landing';

interface Row {
  id: string;
  slug: string;
  title: string;
  role: string | null;
  nama: string;
  featured: boolean;
}

export function LandingPimpinanManager({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState({ slug: '', title: '', role: '', nama: '', featured: false });

  const refreshOrder = (next: Row[]) => {
    setRows(next);
    startTransition(async () => {
      try {
        await reorderPimpinan(next.map((r) => r.id));
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...rows];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    refreshOrder(next);
  };

  const onAdd = () => {
    if (!draft.slug.trim() || !draft.title.trim() || !draft.nama.trim()) {
      toast.error('Slug, title, dan nama wajib diisi.');
      return;
    }
    startTransition(async () => {
      try {
        await createPimpinan({
          slug: draft.slug,
          title: draft.title,
          role: draft.role || null,
          nama: draft.nama,
          featured: draft.featured,
        });
        toast.success('Pimpinan ditambahkan');
        location.reload();
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  const onSave = (r: Row) => {
    startTransition(async () => {
      try {
        await updatePimpinan(r.id, {
          title: r.title,
          role: r.role,
          nama: r.nama,
          featured: r.featured,
        });
        toast.success('Tersimpan');
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  const onDelete = (id: string) => {
    if (!confirm('Hapus pimpinan ini?')) return;
    startTransition(async () => {
      try {
        await deletePimpinan(id);
        setRows((cur) => cur.filter((r) => r.id !== id));
        toast.success('Dihapus');
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  const patch = (id: string, p: Partial<Row>) =>
    setRows((cur) => cur.map((r) => (r.id === id ? { ...r, ...p } : r)));

  return (
    <div className="space-y-6">
      {/* Add new */}
      <div className="glass rounded-2xl p-5 border border-border/60">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4">Tambah Pimpinan</h3>
        <div className="grid gap-3 md:grid-cols-5">
          <Input
            placeholder="slug (mis. ketua-umum)"
            value={draft.slug}
            onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
          />
          <Input
            placeholder="Title (Ketua Umum)"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
          />
          <Input
            placeholder="Role (opsional)"
            value={draft.role}
            onChange={(e) => setDraft({ ...draft, role: e.target.value })}
          />
          <Input
            placeholder="Nama"
            value={draft.nama}
            onChange={(e) => setDraft({ ...draft, nama: e.target.value })}
          />
          <Button onClick={onAdd} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
            Tambah
          </Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-3">
        {rows.map((r, idx) => (
          <div
            key={r.id}
            className="glass rounded-2xl p-4 border border-border/60 grid gap-3 md:grid-cols-[auto_1fr_1fr_1fr_auto_auto] items-center"
          >
            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => move(idx, -1)}
                disabled={idx === 0 || isPending}
                className="p-1 rounded hover:bg-white/5 disabled:opacity-30"
                aria-label="Naik"
              >
                <ArrowUp size={14} />
              </button>
              <button
                type="button"
                onClick={() => move(idx, 1)}
                disabled={idx === rows.length - 1 || isPending}
                className="p-1 rounded hover:bg-white/5 disabled:opacity-30"
                aria-label="Turun"
              >
                <ArrowDown size={14} />
              </button>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-fg-muted mb-1">
                {r.slug}
              </p>
              <Input value={r.title} onChange={(e) => patch(r.id, { title: e.target.value })} />
            </div>
            <Input
              placeholder="Role"
              value={r.role ?? ''}
              onChange={(e) => patch(r.id, { role: e.target.value })}
            />
            <Input value={r.nama} onChange={(e) => patch(r.id, { nama: e.target.value })} />
            <button
              type="button"
              onClick={() => patch(r.id, { featured: !r.featured })}
              className={`p-2 rounded-lg ${r.featured ? 'text-gold' : 'text-fg-muted'}`}
              aria-label="Featured"
              title="Featured (tampil besar)"
            >
              <Star size={16} fill={r.featured ? 'currentColor' : 'none'} />
            </button>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onSave(r)} disabled={isPending}>
                Simpan
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDelete(r.id)}
                disabled={isPending}
                aria-label="Hapus"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-center text-sm font-mono text-fg-muted py-8">Belum ada pimpinan.</p>
        )}
      </div>
    </div>
  );
}
