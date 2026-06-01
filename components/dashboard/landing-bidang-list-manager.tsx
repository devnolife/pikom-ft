'use client';

import Link from 'next/link';
import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, ArrowUp, ArrowDown, Loader2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { createBidang, deleteBidang, reorderBidang } from '@/lib/actions/landing';
import { LANDING_BIDANG_ICON_NAMES, resolveBidangIcon } from '@/lib/landing-icons';

interface Row {
  id: string;
  slug: string;
  name: string;
  icon: string;
  desc: string;
}

export function LandingBidangListManager({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [isPending, startTransition] = useTransition();
  const [draft, setDraft] = useState({ slug: '', name: '', icon: 'Sparkles', desc: '' });

  const move = (idx: number, dir: -1 | 1) => {
    const next = [...rows];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setRows(next);
    startTransition(async () => {
      try {
        await reorderBidang(next.map((r) => r.id));
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  const onAdd = () => {
    if (!draft.slug.trim() || !draft.name.trim()) {
      toast.error('Slug & nama wajib diisi.');
      return;
    }
    startTransition(async () => {
      try {
        await createBidang({
          slug: draft.slug,
          name: draft.name,
          icon: draft.icon,
          desc: draft.desc,
        });
        toast.success('Bidang ditambahkan');
        location.reload();
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  const onDelete = (id: string) => {
    if (!confirm('Hapus bidang ini? Anggota & proker akan ikut terhapus.')) return;
    startTransition(async () => {
      try {
        await deleteBidang(id);
        setRows((cur) => cur.filter((r) => r.id !== id));
        toast.success('Dihapus');
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5 border border-border/60 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Tambah Bidang</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <Input
            placeholder="slug (mis. organisasi)"
            value={draft.slug}
            onChange={(e) => setDraft({ ...draft, slug: e.target.value })}
          />
          <Input
            placeholder="Nama bidang"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
          />
          <select
            value={draft.icon}
            onChange={(e) => setDraft({ ...draft, icon: e.target.value })}
            className="h-9 rounded-md bg-bg-alt border border-border px-3 text-sm"
          >
            {LANDING_BIDANG_ICON_NAMES.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
        <Textarea
          placeholder="Deskripsi singkat bidang"
          rows={3}
          value={draft.desc}
          onChange={(e) => setDraft({ ...draft, desc: e.target.value })}
        />
        <Button onClick={onAdd} disabled={isPending}>
          {isPending ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
          Tambah Bidang
        </Button>
      </div>

      <div className="space-y-3">
        {rows.map((r, idx) => {
          const Icon = resolveBidangIcon(r.icon);
          return (
            <div
              key={r.id}
              className="glass rounded-2xl p-4 border border-border/60 grid gap-3 md:grid-cols-[auto_auto_1fr_auto] items-center"
            >
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => move(idx, -1)}
                  disabled={idx === 0 || isPending}
                  className="p-1 rounded hover:bg-white/5 disabled:opacity-30"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => move(idx, 1)}
                  disabled={idx === rows.length - 1 || isPending}
                  className="p-1 rounded hover:bg-white/5 disabled:opacity-30"
                >
                  <ArrowDown size={14} />
                </button>
              </div>
              <div className="p-2.5 rounded-xl glass-strong">
                <Icon size={18} className="text-accent" />
              </div>
              <div>
                <p className="text-[10px] font-mono uppercase tracking-[0.25em] text-fg-muted">
                  {r.slug}
                </p>
                <h3 className="text-base font-bold uppercase tracking-tight">{r.name}</h3>
                <p className="text-xs font-mono text-fg-muted line-clamp-2 mt-1">{r.desc}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/dashboard/admin/landing/bidang/${r.id}`}>
                  <Button size="sm" variant="outline">
                    <Pencil size={12} /> Edit
                  </Button>
                </Link>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(r.id)}
                  disabled={isPending}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
