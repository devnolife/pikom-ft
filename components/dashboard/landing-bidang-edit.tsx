'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { LANDING_BIDANG_ICON_NAMES } from '@/lib/landing-icons';
import {
  setBidangAnggota,
  setBidangProker,
  updateBidang,
} from '@/lib/actions/landing';

interface Props {
  id: string;
  initial: {
    slug: string;
    name: string;
    icon: string;
    desc: string;
    ketua: string | null;
    sekretaris: string | null;
    anggota: string[];
    prokerTerlaksana: string[];
    prokerDirencanakan: string[];
  };
}

export function LandingBidangEdit({ id, initial }: Props) {
  const [form, setForm] = useState(initial);
  const [anggotaText, setAnggotaText] = useState(initial.anggota.join('\n'));
  const [terlaksanaText, setTerlaksanaText] = useState(initial.prokerTerlaksana.join('\n'));
  const [direncanakanText, setDirencanakanText] = useState(initial.prokerDirencanakan.join('\n'));
  const [isPending, startTransition] = useTransition();

  const onSave = () => {
    startTransition(async () => {
      try {
        await updateBidang(id, {
          slug: form.slug,
          name: form.name,
          icon: form.icon,
          desc: form.desc,
          ketua: form.ketua,
          sekretaris: form.sekretaris,
        });
        await setBidangAnggota(id, anggotaText.split('\n'));
        await setBidangProker(id, {
          terlaksana: terlaksanaText.split('\n'),
          direncanakan: direncanakanText.split('\n'),
        });
        toast.success('Bidang tersimpan');
      } catch (e) {
        toast.error((e as Error).message);
      }
    });
  };

  return (
    <div className="space-y-6">
      <section className="glass rounded-2xl p-5 border border-border/60 space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Informasi Dasar</h3>
        <div className="grid gap-3 md:grid-cols-3">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-fg-muted">Slug</label>
            <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-fg-muted">Nama</label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-fg-muted">Ikon</label>
            <select
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              className="h-9 w-full rounded-md bg-bg-alt border border-border px-3 text-sm"
            >
              {LANDING_BIDANG_ICON_NAMES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-fg-muted">Deskripsi</label>
          <Textarea rows={4} value={form.desc} onChange={(e) => setForm({ ...form, desc: e.target.value })} />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-fg-muted">Ketua Bidang</label>
            <Input
              value={form.ketua ?? ''}
              onChange={(e) => setForm({ ...form, ketua: e.target.value })}
            />
          </div>
          <div>
            <label className="text-[10px] font-mono uppercase tracking-[0.25em] text-fg-muted">Sekretaris Bidang</label>
            <Input
              value={form.sekretaris ?? ''}
              onChange={(e) => setForm({ ...form, sekretaris: e.target.value })}
            />
          </div>
        </div>
      </section>

      <section className="glass rounded-2xl p-5 border border-border/60 space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Anggota</h3>
        <p className="text-xs font-mono text-fg-muted">Satu nama per baris.</p>
        <Textarea rows={6} value={anggotaText} onChange={(e) => setAnggotaText(e.target.value)} />
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="glass rounded-2xl p-5 border border-border/60 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Proker Terlaksana</h3>
          <p className="text-xs font-mono text-fg-muted">Satu proker per baris.</p>
          <Textarea rows={6} value={terlaksanaText} onChange={(e) => setTerlaksanaText(e.target.value)} />
        </section>
        <section className="glass rounded-2xl p-5 border border-border/60 space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-[0.2em]">Proker Direncanakan</h3>
          <p className="text-xs font-mono text-fg-muted">Satu proker per baris.</p>
          <Textarea rows={6} value={direncanakanText} onChange={(e) => setDirencanakanText(e.target.value)} />
        </section>
      </div>

      <div className="sticky bottom-4 flex justify-end">
        <Button onClick={onSave} disabled={isPending} size="lg">
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
          Simpan Semua
        </Button>
      </div>
    </div>
  );
}
