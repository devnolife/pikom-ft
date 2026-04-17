'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Plus, Pencil, Trash2, TrendingUp, TrendingDown, Wallet, Search, ExternalLink,
} from 'lucide-react';
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
import { StatCard } from '@/components/dashboard/stat-card';
import {
  getTransaksi, createTransaksi, updateTransaksi, deleteTransaksi, type TransaksiInput,
} from '@/lib/actions/transaksi';
import { bidangDetail } from '@/app/data/bidang';
import { formatIDR } from '@/lib/format';
import { cn } from '@/lib/utils';

type TRow = {
  id: string;
  tipe: 'PEMASUKAN' | 'PENGELUARAN';
  tanggal: Date;
  kategori: string;
  jumlah: number;
  deskripsi: string | null;
  pihak: string | null;
  bidang: string | null;
  notaUrl: string | null;
};

type TipeFilter = 'ALL' | 'PEMASUKAN' | 'PENGELUARAN';

function firstOfMonth() {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().slice(0, 10);
}
function today() {
  return new Date().toISOString().slice(0, 10);
}

export default function BendaharaPage() {
  const [rows, setRows] = useState<TRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [from, setFrom] = useState(firstOfMonth());
  const [to, setTo] = useState(today());
  const [tipe, setTipe] = useState<TipeFilter>('ALL');
  const [search, setSearch] = useState('');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<TRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [fTipe, setFTipe] = useState<'PEMASUKAN' | 'PENGELUARAN'>('PEMASUKAN');
  const [fTanggal, setFTanggal] = useState('');
  const [fKategori, setFKategori] = useState('');
  const [fJumlah, setFJumlah] = useState('');
  const [fDeskripsi, setFDeskripsi] = useState('');
  const [fPihak, setFPihak] = useState('');
  const [fBidang, setFBidang] = useState('');
  const [fNota, setFNota] = useState<string | null>(null);
  const [fError, setFError] = useState('');

  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await getTransaksi({ from, to });
      setRows(data as TRow[]);
    } catch (e) {
      toast.error((e as Error).message);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, [from, to]);

  const summary = useMemo(() => {
    const pIn = rows.filter((r) => r.tipe === 'PEMASUKAN').reduce((a, b) => a + b.jumlah, 0);
    const pOut = rows.filter((r) => r.tipe === 'PENGELUARAN').reduce((a, b) => a + b.jumlah, 0);
    return { pemasukan: pIn, pengeluaran: pOut, saldo: pIn - pOut };
  }, [rows]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows
      .filter((r) => tipe === 'ALL' || r.tipe === tipe)
      .filter((r) => {
        if (!q) return true;
        return (
          r.kategori.toLowerCase().includes(q) ||
          (r.deskripsi?.toLowerCase().includes(q) ?? false) ||
          (r.pihak?.toLowerCase().includes(q) ?? false) ||
          (r.bidang?.toLowerCase().includes(q) ?? false)
        );
      });
  }, [rows, tipe, search]);

  const resetForm = () => {
    setFTipe('PEMASUKAN');
    setFTanggal(today());
    setFKategori('');
    setFJumlah('');
    setFDeskripsi('');
    setFPihak('');
    setFBidang('');
    setFNota(null);
    setFError('');
    setEditing(null);
  };

  const openCreate = () => { resetForm(); setDialogOpen(true); };
  const openEdit = (r: TRow) => {
    setEditing(r);
    setFTipe(r.tipe);
    setFTanggal(new Date(r.tanggal).toISOString().slice(0, 10));
    setFKategori(r.kategori);
    setFJumlah(String(r.jumlah));
    setFDeskripsi(r.deskripsi ?? '');
    setFPihak(r.pihak ?? '');
    setFBidang(r.bidang ?? '');
    setFNota(r.notaUrl ?? null);
    setFError('');
    setDialogOpen(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setFError('');
    const jumlah = Number(fJumlah.replace(/\D/g, ''));
    if (!fKategori.trim() || !fTanggal || !jumlah) {
      setFError('Kategori, tanggal, dan jumlah wajib diisi');
      return;
    }
    const payload: TransaksiInput = {
      tipe: fTipe,
      tanggal: fTanggal,
      kategori: fKategori,
      jumlah,
      deskripsi: fDeskripsi,
      pihak: fPihak,
      bidang: fBidang,
      notaUrl: fNota,
    };
    setSubmitting(true);
    try {
      if (editing) await updateTransaksi(editing.id, payload);
      else await createTransaksi(payload);
      await fetchAll();
      setDialogOpen(false);
      toast.success(editing ? 'Transaksi diperbarui' : 'Transaksi disimpan');
    } catch (err) {
      const msg = (err as Error).message;
      setFError(msg); toast.error(msg);
    } finally { setSubmitting(false); }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteTransaksi(deleteTarget.id);
      setRows((p) => p.filter((r) => r.id !== deleteTarget.id));
      toast.success('Transaksi dihapus');
      setDeleteTarget(null);
    } catch (e) { toast.error((e as Error).message); }
    finally { setDeleting(false); }
  };

  return (
    <>
      <PageHeader
        eyebrow="Bendahara Umum"
        title={<>Kas & <span className="text-gold">Keuangan</span></>}
        description="Catat pemasukan, pengeluaran, dan lampirkan nota untuk setiap transaksi."
        actions={
          <Button onClick={openCreate} className="gap-2">
            <Plus size={16} /> Transaksi Baru
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-6">
        <StatCard
          label="Saldo periode"
          value={formatIDR(summary.saldo)}
          icon={Wallet}
          tone={summary.saldo >= 0 ? 'green' : 'red'}
        />
        <StatCard
          label="Pemasukan"
          value={formatIDR(summary.pemasukan)}
          icon={TrendingUp}
          tone="green"
        />
        <StatCard
          label="Pengeluaran"
          value={formatIDR(summary.pengeluaran)}
          icon={TrendingDown}
          tone="red"
        />
      </div>

      <div className="glass rounded-2xl p-3 md:p-4 mb-5 grid grid-cols-1 md:grid-cols-[auto_auto_1fr_auto] gap-3 items-end">
        <FormField id="t-from" label="Dari tanggal">
          <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        </FormField>
        <FormField id="t-to" label="Sampai tanggal">
          <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
        </FormField>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-fg-muted" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kategori, pihak, atau deskripsi…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-1.5">
          {(['ALL', 'PEMASUKAN', 'PENGELUARAN'] as TipeFilter[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setTipe(v)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-widest border transition-colors',
                tipe === v
                  ? 'bg-accent text-[color:var(--color-selection-text)] border-accent'
                  : 'border-border text-fg-secondary hover:bg-glass-overlay'
              )}
            >
              {v === 'ALL' ? 'Semua' : v === 'PEMASUKAN' ? 'Masuk' : 'Keluar'}
            </button>
          ))}
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-border">
          <p className="text-label">{loading ? 'Memuat…' : `${filtered.length} transaksi`}</p>
        </div>
        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14 rounded-lg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            className="m-4 md:m-6"
            icon={Wallet}
            title="Belum ada transaksi"
            description="Tambahkan transaksi pertamamu lewat tombol di atas."
          />
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((r) => (
              <li key={r.id} className="flex items-center gap-3 px-5 md:px-6 py-3.5 hover:bg-glass-overlay transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge
                      variant="outline"
                      className={cn(
                        'text-[10px] uppercase tracking-widest',
                        r.tipe === 'PEMASUKAN'
                          ? 'border-emerald-500/40 text-emerald-500 bg-emerald-500/10'
                          : 'border-red-500/40 text-red-500 bg-red-500/10'
                      )}
                    >
                      {r.tipe === 'PEMASUKAN' ? 'Masuk' : 'Keluar'}
                    </Badge>
                    <span className="text-[11px] font-mono text-fg-muted">
                      {new Date(r.tanggal).toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[11px] font-mono uppercase tracking-widest text-fg-muted">
                      {r.kategori}
                    </span>
                    {r.bidang && (
                      <span className="text-[10px] font-mono uppercase tracking-widest text-fg-muted">· {r.bidang}</span>
                    )}
                  </div>
                  <p className="text-sm font-semibold mt-1 truncate">
                    {r.deskripsi || r.kategori}
                  </p>
                  {r.pihak && <p className="text-[11px] font-mono text-fg-muted truncate">· {r.pihak}</p>}
                </div>
                <div
                  className={cn(
                    'text-sm font-bold font-mono tabular-nums whitespace-nowrap',
                    r.tipe === 'PEMASUKAN' ? 'text-emerald-500' : 'text-red-500'
                  )}
                >
                  {r.tipe === 'PEMASUKAN' ? '+' : '−'} {formatIDR(r.jumlah)}
                </div>
                {r.notaUrl && (
                  <a href={r.notaUrl} target="_blank" rel="noreferrer" className="p-2 rounded-md text-fg-muted hover:text-fg hover:bg-glass-overlay" aria-label="Lihat nota">
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
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Transaksi' : 'Transaksi Baru'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <FormField id="tx-tipe" label="Tipe">
                <select
                  value={fTipe}
                  onChange={(e) => setFTipe(e.target.value as typeof fTipe)}
                  disabled={submitting}
                  aria-label="Tipe transaksi"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none"
                >
                  <option value="PEMASUKAN">Pemasukan</option>
                  <option value="PENGELUARAN">Pengeluaran</option>
                </select>
              </FormField>
              <FormField id="tx-tanggal" label="Tanggal">
                <Input type="date" value={fTanggal} onChange={(e) => setFTanggal(e.target.value)} disabled={submitting} />
              </FormField>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <FormField id="tx-kategori" label="Kategori" helperText="cth. Iuran, Donasi, Konsumsi, ATK">
                <Input value={fKategori} onChange={(e) => setFKategori(e.target.value)} disabled={submitting} />
              </FormField>
              <FormField id="tx-jumlah" label="Jumlah (Rp)">
                <Input
                  type="text"
                  inputMode="numeric"
                  value={fJumlah}
                  onChange={(e) => setFJumlah(e.target.value.replace(/\D/g, ''))}
                  disabled={submitting}
                  placeholder="0"
                />
              </FormField>
            </div>
            <FormField id="tx-deskripsi" label="Deskripsi">
              <Input value={fDeskripsi} onChange={(e) => setFDeskripsi(e.target.value)} disabled={submitting} placeholder="Ringkasan transaksi" />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField id="tx-pihak" label="Pihak terkait" helperText="Penyumbang / penerima / toko">
                <Input value={fPihak} onChange={(e) => setFPihak(e.target.value)} disabled={submitting} />
              </FormField>
              <FormField id="tx-bidang" label="Bidang terkait (opsional)">
                <select
                  value={fBidang}
                  onChange={(e) => setFBidang(e.target.value)}
                  disabled={submitting}
                  aria-label="Bidang"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm outline-none"
                >
                  <option value="">— Umum —</option>
                  {bidangDetail.map((b) => (
                    <option key={b.slug} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </FormField>
            </div>
            <FormField id="tx-nota" label="Nota / bukti (opsional)">
              <FileUpload
                kategori="nota"
                value={fNota}
                onChange={setFNota}
                disabled={submitting}
                label="Unggah nota"
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
            <DialogTitle className="text-red-500">Hapus transaksi?</DialogTitle>
          </DialogHeader>
          <p className="text-sm font-mono py-2">
            Transaksi <span className="font-bold text-fg">{deleteTarget?.kategori}</span> ({formatIDR(deleteTarget?.jumlah ?? 0)}) akan dihapus permanen.
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
