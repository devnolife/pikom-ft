'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Loader2, Save, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { triggerSeed, updateContentBulk } from '@/lib/actions/landing';

interface Row {
  id: string;
  key: string;
  value: string;
  groupName: string;
  label: string | null;
  multiline: boolean;
}

export function LandingContentEditor({ initial }: { initial: Row[] }) {
  const [rows, setRows] = useState<Row[]>(initial);
  const [dirty, setDirty] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();

  const patch = (id: string, value: string) => {
    setRows((cur) => cur.map((r) => (r.id === id ? { ...r, value } : r)));
    setDirty((cur) => new Set(cur).add(id));
  };

  const onSave = () => {
    const entries = rows.filter((r) => dirty.has(r.id)).map((r) => ({ id: r.id, value: r.value }));
    if (entries.length === 0) {
      toast.message('Tidak ada perubahan.');
      return;
    }
    startTransition(async () => {
      try {
        await updateContentBulk(entries);
        setDirty(new Set());
        toast.success(`${entries.length} teks tersimpan`);
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  const onSeed = () => {
    if (!confirm('Re-seed default content? Item yang sudah ada tidak akan ditimpa.')) return;
    startTransition(async () => {
      try {
        const res = await triggerSeed();
        toast.success(`Seed selesai. Bidang: ${res.bidang}, Pimpinan: ${res.pimpinan}, Periode: ${res.periode}, Content: ${res.content}`);
        location.reload();
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  const groups: Record<string, Row[]> = {};
  for (const r of rows) (groups[r.groupName] ??= []).push(r);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-mono text-fg-muted">
          {dirty.size > 0 ? `${dirty.size} perubahan belum disimpan.` : 'Semua tersimpan.'}
        </p>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" onClick={onSeed} disabled={isPending}>
            <RefreshCw size={14} /> Seed default
          </Button>
          <Button onClick={onSave} disabled={isPending || dirty.size === 0}>
            {isPending ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
            Simpan ({dirty.size})
          </Button>
        </div>
      </div>

      {Object.entries(groups).map(([group, items]) => (
        <section key={group} className="glass rounded-2xl p-5 border border-border/60 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em]">{group}</h3>
          <div className="grid gap-3">
            {items.map((r) => (
              <div key={r.id} className="grid gap-1.5">
                <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-fg-muted">
                  {r.label || r.key}
                  <span className="ml-2 text-fg-muted/60 normal-case">({r.key})</span>
                </label>
                {r.multiline ? (
                  <Textarea
                    rows={3}
                    value={r.value}
                    onChange={(e) => patch(r.id, e.target.value)}
                  />
                ) : (
                  <Input value={r.value} onChange={(e) => patch(r.id, e.target.value)} />
                )}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
