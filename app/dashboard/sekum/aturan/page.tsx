'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, FileText, Search, ExternalLink } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { FileUpload } from '@/components/ui/file-upload';
import { PageHeader } from '@/components/dashboard/page-header';
import {
  getAturan, createAturan, updateAturan, deleteAturan, type AturanInput,
} from '@/lib/actions/aturan';
import { cn } from '@/lib/utils';

type AturanRow = {
  id: string;
  judul: string;
  kategori: 'TOR' | 'AD_ART' | 'SOP' | 'LAIN';
  konten: string | null;
  lampiranUrl: string | null;
  updatedAt: Date;
};

const kategoriLabel: Record<AturanRow['kategori'], string> = {
  TOR: 'TOR',
  AD_ART: 'AD/ART',
  SOP: 'SOP',
  LAIN: 'Lainnya',
};

const kategoriColor: Record<AturanRow['kategori'], string> = {
  TOR: 'border-blue-500/40 text-blue-500 bg-blue-500/10',
  AD_ART: 'border-purple-500/40 text-purple-500 bg-purple-500/10',
  SOP: 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10',
  LAIN: 'border-border text-fg-secondary bg-glass-overlay',
};

export default function AturanPage() {
  const [rows, setRows] = useState<AturanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'ALL' | AturanRow['kategori']>('ALL');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<AturanRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<AturanRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [fJudul, setFJudul] = useState('');
  const [fKategori, setFKategori] = useState<AturanRow['kategori']>('TOR');
  const [fKonten, setFKonten] = useState('');
  const [fLampiran, setFLampiran] = useState<string | null>(null);
  const [fError, setFError] = useState('');

  useEffect(() => {
    getAturan()
      .then((data) => setRows(data as AturanRow[]))
      .catch((e) => toast.error((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((r) => filter === 'ALL' || r.kategori === filter)
      .filter((r) => {
        if (!q) return true;
        return (
          r.judul.toLowerCase().includes(q) ||
          (r.konten?.toLowerCase().includes(q) ?? false)
        );
      });
  }, [rows, search, filter]);

  const resetForm = () => {
    setFJudul('');
    setFKategori('TOR');
    setFKonten('');
    setFLampiran(null);
    setFError('');
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (r: AturanRow) => {
    setEditing(r);
    setFJudul(r.judul);
    setFKategori(r.kategori);
    setFKonten(r.konten ?? '');
    setFLampiran(r.lampiranUrl ?? null);
    setFError('');
    setDialogOpen(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setFError('');
    if (!fJudul.trim()) { setFError('Judul wajib diisi'); return; }
    const payload: AturanInput = {
      judul: fJudul,
      kategori: fKategori,
      konten: fKonten,
      lampiranUrl: fLampiran,
    };
    setSubmitting(true);
    try {
      if (editing) await updateAturan(editing.id, payload);
      else await createAturan(payload);
      const fresh = await getAturan();
      setRows(fresh as AturanRow[]);
      setDialogOpen(false);
      toast.success(editing ? 'Aturan diperbarui' : 'Aturan disimpan');
    } catch (err) {
      const msg = (err as Error).message;
      setFError(msg); toast.error(msg);
    } finally { setSubmitting(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteAturan(deleteTarget.id);
      setRows((p) => p.filter((r) => r.id !== deleteTarget.id));
      toast.success('Aturan dihapus');
      setDeleteTarget(null);
    } catch (e) { toast.error((e as Error).message); }
    finally { setDeleting(false); }
  };

  const filters: { value: 'ALL' | AturanRow['kategori']; label: string }[] = [
    { value: 'ALL', label: 'Semua' },
    { value: 'TOR', label: 'TOR' },
    { value: 'AD_ART', label: 'AD/ART' },
    { value: 'SOP', label: 'SOP' },
    { value: 'LAIN', label: 'Lainnya' },
  ];

  return (
    <>
      <PageHeader
        eyebrow="Sekretaris Umum"
        title={<>TOR & <span className="text-gold">Aturan</span></>}
        description="Simpan TOR kegiatan, AD/ART, SOP, dan dokumen aturan organisasi lainnya."
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus size={16} /> Dokumen Baru
          </Button>
        }
      />

      <div className="glass rounded-2xl p-3 md:p-4 mb-5 flex flex-col md:flex-row gap-3">
        <div className="flex gap-1.5 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-widest border transition-colors',
                filter === f.value
                  ? 'bg-accent text-[color:var(--color-selection-text)] border-accent'
                  : 'border-border text-fg-secondary hover:bg-glass-overlay'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari judul atau isi dokumen…"
            className="pl-9"
          />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Belum ada dokumen"
          description="Buat dokumen TOR atau aturan pertamamu."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => (
            <article
              key={r.id}
              className="glass rounded-2xl p-5 flex flex-col gap-3 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between gap-2">
                <Badge variant="outline" className={cn('text-[10px] uppercase tracking-widest', kategoriColor[r.kategori])}>
                  {kategoriLabel[r.kategori]}
                </Badge>
                <div className="flex gap-1">
                  <button type="button" onClick={() => openEdit(r)} className="p-1.5 rounded-md text-fg-muted hover:text-fg hover:bg-glass-overlay">
                    <Pencil size={13} />
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(r)} className="p-1.5 rounded-md text-red-500 hover:bg-red-500/10">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              <h3 className="text-base font-bold leading-snug line-clamp-2">{r.judul}</h3>
              {r.konten && (
                <p className="text-xs font-mono text-fg-muted leading-relaxed line-clamp-4 whitespace-pre-wrap">
                  {r.konten.replace(/^#+\s?/gm, '')}
                </p>
              )}
              <div className="flex items-center justify-between mt-auto pt-2 border-t border-border text-[10px] font-mono uppercase tracking-widest text-fg-muted">
                <span>{new Date(r.updatedAt).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                {r.lampiranUrl && (
                  <a href={r.lampiranUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-fg">
                    <ExternalLink size={11} /> lampiran
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Dokumen' : 'Dokumen Baru'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 py-2">
            <div className="grid grid-cols-[1fr_auto] gap-3">
              <FormField id="a-judul" label="Judul">
                <Input value={fJudul} onChange={(e) => setFJudul(e.target.value)} disabled={submitting} placeholder="cth. TOR Musykom 2026" />
              </FormField>
              <FormField id="a-kategori" label="Kategori">
                <select
                  value={fKategori}
                  onChange={(e) => setFKategori(e.target.value as AturanRow['kategori'])}
                  disabled={submitting}
                  aria-label="Kategori"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none"
                >
                  <option value="TOR">TOR</option>
                  <option value="AD_ART">AD/ART</option>
                  <option value="SOP">SOP</option>
                  <option value="LAIN">Lainnya</option>
                </select>
              </FormField>
            </div>
            <FormField id="a-konten" label="Konten (markdown opsional)" helperText="Bisa kosong bila hanya ingin menyimpan lampiran file.">
              <textarea
                value={fKonten}
                onChange={(e) => setFKonten(e.target.value)}
                disabled={submitting}
                rows={8}
                placeholder="# Judul&#10;&#10;Tulis isi TOR atau aturan di sini..."
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm font-mono outline-none resize-y"
              />
            </FormField>
            <FormField id="a-lampiran" label="Lampiran (opsional)">
              <FileUpload
                kategori="aturan"
                value={fLampiran}
                onChange={setFLampiran}
                disabled={submitting}
                label="Unggah dokumen"
              />
            </FormField>
            {fError && <p className="text-xs text-destructive font-medium" role="alert">{fError}</p>}
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setDialogOpen(false)} disabled={submitting}>Batal</Button>
              <Button type="submit" loading={submitting}>{editing ? 'Simpan' : 'Tambah'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-red-500">Hapus dokumen?</DialogTitle>
          </DialogHeader>
          <p className="text-sm font-mono py-2">
            Dokumen <span className="font-bold text-fg">{deleteTarget?.judul}</span> akan dihapus permanen.
          </p>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => setDeleteTarget(null)} disabled={deleting}>Batal</Button>
            <Button type="button" variant="destructive" onClick={confirmDelete} loading={deleting}>Hapus</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
