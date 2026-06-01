'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createPeriode, deletePeriode, updatePeriode } from '@/lib/actions/landing';

interface Row {
  id: string;
  periode: string;
  ketua: string;
}

export function LandingPeriodeManager({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [draft, setDraft] = useState({ periode: '', ketua: '' });
  const [isPending, startTransition] = useTransition();

  const onAdd = () => {
    if (!draft.periode.trim() || !draft.ketua.trim()) {
      toast.error('Periode & ketua wajib diisi.');
      return;
    }
    startTransition(async () => {
      try {
        await createPeriode(draft);
        toast.success('Periode ditambahkan');
        location.reload();
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  const onSave = (r: Row) => {
    startTransition(async () => {
      try {
        await updatePeriode(r.id, { periode: r.periode, ketua: r.ketua });
        toast.success('Tersimpan');
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  const onDelete = (id: string) => {
    if (!confirm('Hapus periode ini?')) return;
    startTransition(async () => {
      try {
        await deletePeriode(id);
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
      <div className="glass rounded-2xl p-5 border border-border/60">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4">Tambah Periode</h3>
        <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
          <Input
            placeholder="Periode (mis. 2024–2025)"
            value={draft.periode}
            onChange={(e) => setDraft({ ...draft, periode: e.target.value })}
          />
          <Input
            placeholder="Nama Ketua"
            value={draft.ketua}
            onChange={(e) => setDraft({ ...draft, ketua: e.target.value })}
          />
          <Button onClick={onAdd} disabled={isPending}>
            {isPending ? <Loader2 className="animate-spin" size={14} /> : <Plus size={14} />}
            Tambah
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {rows.map((r) => (
          <div
            key={r.id}
            className="glass rounded-2xl p-4 border border-border/60 grid gap-3 md:grid-cols-[1fr_1fr_auto] items-center"
          >
            <Input value={r.periode} onChange={(e) => patch(r.id, { periode: e.target.value })} />
            <Input value={r.ketua} onChange={(e) => patch(r.id, { ketua: e.target.value })} />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onSave(r)} disabled={isPending}>
                Simpan
              </Button>
              <Button size="sm" variant="ghost" onClick={() => onDelete(r.id)} disabled={isPending}>
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        ))}
        {rows.length === 0 && (
          <p className="text-center text-sm font-mono text-fg-muted py-8">Belum ada periode.</p>
        )}
      </div>
    </div>
  );
}
