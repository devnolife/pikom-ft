'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Mail, Search, ExternalLink } from 'lucide-react';
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
  getSurat, createSurat, updateSurat, deleteSurat, type SuratInput,
} from '@/lib/actions/surat';
import { cn } from '@/lib/utils';

type SuratRow = {
  id: string;
  tipe: 'MASUK' | 'KELUAR';
  nomor: string;
  tanggal: Date;
  perihal: string;
  pengirim: string | null;
  tujuan: string | null;
  lampiranUrl: string | null;
};

type TabValue = 'MASUK' | 'KELUAR';

export default function PersuratanPage() {
  const [rows, setRows] = useState<SuratRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<TabValue>('MASUK');
  const [search, setSearch] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<SuratRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<SuratRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [fTipe, setFTipe] = useState<TabValue>('MASUK');
  const [fNomor, setFNomor] = useState('');
  const [fTanggal, setFTanggal] = useState('');
  const [fPerihal, setFPerihal] = useState('');
  const [fPengirim, setFPengirim] = useState('');
  const [fTujuan, setFTujuan] = useState('');
  const [fLampiran, setFLampiran] = useState<string | null>(null);
  const [fError, setFError] = useState('');

  useEffect(() => {
    getSurat()
      .then((data) => setRows(data as SuratRow[]))
      .catch((e) => toast.error((e as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((r) => r.tipe === tab)
      .filter((r) => {
        if (!q) return true;
        return (
          r.nomor.toLowerCase().includes(q) ||
          r.perihal.toLowerCase().includes(q) ||
          (r.pengirim?.toLowerCase().includes(q) ?? false) ||
          (r.tujuan?.toLowerCase().includes(q) ?? false)
        );
      });
  }, [rows, tab, search]);

  const resetForm = () => {
    setFTipe(tab);
    setFNomor('');
    setFTanggal(new Date().toISOString().slice(0, 10));
    setFPerihal('');
    setFPengirim('');
    setFTujuan('');
    setFLampiran(null);
    setFError('');
    setEditing(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (r: SuratRow) => {
    setEditing(r);
    setFTipe(r.tipe);
    setFNomor(r.nomor);
    setFTanggal(new Date(r.tanggal).toISOString().slice(0, 10));
    setFPerihal(r.perihal);
    setFPengirim(r.pengirim ?? '');
    setFTujuan(r.tujuan ?? '');
    setFLampiran(r.lampiranUrl ?? null);
    setFError('');
    setDialogOpen(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setFError('');
    if (!fNomor.trim() || !fPerihal.trim() || !fTanggal) {
      setFError('Nomor, perihal, dan tanggal wajib diisi');
      return;
    }
    const payload: SuratInput = {
      tipe: fTipe,
      nomor: fNomor,
      tanggal: fTanggal,
      perihal: fPerihal,
      pengirim: fPengirim,
      tujuan: fTujuan,
      lampiranUrl: fLampiran,
    };
    setSubmitting(true);
    try {
      if (editing) {
        await updateSurat(editing.id, payload);
      } else {
        await createSurat(payload);
      }
      const fresh = await getSurat();
      setRows(fresh as SuratRow[]);
      setDialogOpen(false);
      toast.success(editing ? 'Surat diperbarui' : 'Surat baru disimpan');
    } catch (err) {
      const msg = (err as Error).message;
      setFError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteSurat(deleteTarget.id);
      setRows((p) => p.filter((r) => r.id !== deleteTarget.id));
      toast.success('Surat dihapus');
      setDeleteTarget(null);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Sekretaris Umum"
        title={<>Persuratan <span className="text-gold">Organisasi</span></>}
        description="Kelola pencatatan surat masuk dan surat keluar beserta lampirannya."
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus size={16} /> Surat Baru
          </Button>
        }
      />

      <div className="glass rounded-2xl p-3 md:p-4 mb-5 flex flex-col md:flex-row gap-3">
        <div className="flex gap-1.5">
          {(['MASUK', 'KELUAR'] as TabValue[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setTab(v)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-widest border transition-colors',
                tab === v
                  ? 'bg-accent text-[color:var(--color-selection-text)] border-accent'
                  : 'border-border text-fg-secondary hover:bg-glass-overlay'
              )}
            >
              Surat {v.charAt(0) + v.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor, perihal, pengirim, atau tujuan…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-border">
          <p className="text-label">
            {loading ? 'Memuat…' : `${filtered.length} surat ${tab.toLowerCase()}`}
          </p>
        </div>

        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            className="m-4 md:m-6"
            icon={Mail}
            title="Belum ada surat"
            description="Tambahkan surat baru lewat tombol di atas."
          />
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((r) => (
              <li
                key={r.id}
                className="flex items-start gap-3 px-5 md:px-6 py-3.5 hover:bg-glass-overlay transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-widest">
                      {r.nomor}
                    </Badge>
                    <span className="text-[11px] font-mono text-fg-muted">
                      {new Date(r.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <p className="text-sm font-semibold mt-1 truncate">{r.perihal}</p>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-fg-muted truncate">
                    {r.tipe === 'MASUK' ? `Dari: ${r.pengirim ?? '—'}` : `Untuk: ${r.tujuan ?? '—'}`}
                  </p>
                </div>
                {r.lampiranUrl && (
                  <a
                    href={r.lampiranUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-md text-fg-muted hover:text-fg hover:bg-glass-overlay"
                    aria-label="Buka lampiran"
                  >
                    <ExternalLink size={14} />
                  </a>
                )}
                <button type="button" onClick={() => openEdit(r)} className="p-2 rounded-md text-fg-muted hover:text-fg hover:bg-glass-overlay">
                  <Pencil size={14} />
                </button>
                <button type="button" onClick={() => setDeleteTarget(r)} className="p-2 rounded-md text-red-500 hover:bg-red-500/10">
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Surat' : 'Tambah Surat'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <FormField id="f-tipe" label="Tipe">
                <select
                  value={fTipe}
                  onChange={(e) => setFTipe(e.target.value as TabValue)}
                  disabled={submitting}
                  aria-label="Pilih tipe surat"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none"
                >
                  <option value="MASUK">Masuk</option>
                  <option value="KELUAR">Keluar</option>
                </select>
              </FormField>
              <FormField id="f-tanggal" label="Tanggal">
                <Input type="date" value={fTanggal} onChange={(e) => setFTanggal(e.target.value)} disabled={submitting} />
              </FormField>
            </div>
            <FormField id="f-nomor" label="Nomor surat">
              <Input value={fNomor} onChange={(e) => setFNomor(e.target.value)} disabled={submitting} placeholder="cth. 001/IMM-FT/IV/2026" />
            </FormField>
            <FormField id="f-perihal" label="Perihal">
              <Input value={fPerihal} onChange={(e) => setFPerihal(e.target.value)} disabled={submitting} placeholder="Ringkasan isi surat" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField id="f-pengirim" label="Pengirim" helperText={fTipe === 'MASUK' ? 'Wajib untuk surat masuk' : 'Opsional'}>
                <Input value={fPengirim} onChange={(e) => setFPengirim(e.target.value)} disabled={submitting} />
              </FormField>
              <FormField id="f-tujuan" label="Tujuan" helperText={fTipe === 'KELUAR' ? 'Wajib untuk surat keluar' : 'Opsional'}>
                <Input value={fTujuan} onChange={(e) => setFTujuan(e.target.value)} disabled={submitting} />
              </FormField>
            </div>
            <FormField id="f-lampiran" label="Lampiran (opsional)">
              <FileUpload
                kategori="surat"
                value={fLampiran}
                onChange={setFLampiran}
                disabled={submitting}
                label="Unggah lampiran surat"
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
            <DialogTitle className="text-red-500">Hapus surat?</DialogTitle>
          </DialogHeader>
          <p className="text-sm font-mono py-2">
            Surat <span className="font-bold text-fg">{deleteTarget?.nomor}</span> akan dihapus permanen.
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
