'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import {
  Pencil, Trash2, UserPlus, Search, Users as UsersIcon, ShieldAlert,
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/ui/form-field';
import { EmptyState } from '@/components/ui/empty-state';
import { Skeleton } from '@/components/ui/skeleton';
import { PageHeader } from '@/components/dashboard/page-header';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/actions/users';
import { bidangDetail } from '@/app/data/bidang';
import { cn } from '@/lib/utils';

type JabatanValue =
  | 'KETUA_UMUM'
  | 'SEKRETARIS_UMUM'
  | 'BENDAHARA_UMUM'
  | 'KETUA_BIDANG'
  | 'ANGGOTA_BIDANG';

type UserRow = {
  id: string;
  nim: string;
  name: string;
  role: string;
  jabatan: JabatanValue | null;
  bidang: string | null;
  createdAt: Date;
};

const jabatanLabels: Record<JabatanValue, string> = {
  KETUA_UMUM: 'Ketua Umum',
  SEKRETARIS_UMUM: 'Sekretaris Umum',
  BENDAHARA_UMUM: 'Bendahara Umum',
  KETUA_BIDANG: 'Ketua Bidang',
  ANGGOTA_BIDANG: 'Anggota Bidang',
};

type RoleFilter = 'ALL' | 'ADMIN' | 'PENGURUS' | 'MAHASISWA';

const roleBadgeClass: Record<string, string> = {
  ADMIN: 'border-red-500/40 text-red-500 bg-red-500/10',
  PENGURUS: 'border-[color:var(--color-accent)]/40 text-gold bg-[color:var(--color-accent)]/10',
  MAHASISWA: 'border-border text-fg-secondary bg-glass-overlay',
};

const roleFilters: { value: RoleFilter; label: string }[] = [
  { value: 'ALL', label: 'Semua' },
  { value: 'ADMIN', label: 'Admin' },
  { value: 'PENGURUS', label: 'Pengurus' },
  { value: 'MAHASISWA', label: 'Mahasiswa' },
];

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('ALL');

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Form state
  const [formNim, setFormNim] = useState('');
  const [formName, setFormName] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<'MAHASISWA' | 'PENGURUS' | 'ADMIN'>('MAHASISWA');
  const [formJabatan, setFormJabatan] = useState<JabatanValue | ''>('');
  const [formBidang, setFormBidang] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch((err) => toast.error((err as Error).message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== 'ALL' && u.role !== roleFilter) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.nim.toLowerCase().includes(q) ||
        (u.bidang?.toLowerCase().includes(q) ?? false)
      );
    });
  }, [users, search, roleFilter]);

  const resetForm = () => {
    setFormNim('');
    setFormName('');
    setFormPassword('');
    setFormRole('MAHASISWA');
    setFormJabatan('');
    setFormBidang('');
    setFormError('');
    setEditingUser(null);
  };

  const openCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const openEdit = (user: UserRow) => {
    setEditingUser(user);
    setFormNim(user.nim);
    setFormName(user.name);
    setFormPassword('');
    setFormRole(user.role as 'MAHASISWA' | 'PENGURUS' | 'ADMIN');
    setFormJabatan(user.jabatan ?? '');
    setFormBidang(user.bidang || '');
    setFormError('');
    setDialogOpen(true);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setFormError('');

    if (!formName.trim()) {
      setFormError('Nama wajib diisi');
      return;
    }
    if (!editingUser && (!formNim.trim() || !formPassword.trim())) {
      setFormError('NIM dan password wajib diisi');
      return;
    }

    setSubmitting(true);
    try {
      const jabatanValue: JabatanValue | null = formRole === 'PENGURUS' && formJabatan ? formJabatan : null;
      if (editingUser) {
        await updateUser(editingUser.id, {
          name: formName,
          role: formRole,
          jabatan: jabatanValue,
          bidang: formBidang || undefined,
          password: formPassword || undefined,
        });
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? { ...u, name: formName, role: formRole, jabatan: jabatanValue, bidang: formBidang || null }
              : u
          )
        );
        toast.success('User berhasil diperbarui');
      } else {
        await createUser({
          nim: formNim,
          name: formName,
          password: formPassword,
          role: formRole,
          jabatan: jabatanValue,
          bidang: formBidang || undefined,
        });
        const fresh = await getUsers();
        setUsers(fresh);
        toast.success('User baru berhasil dibuat');
      }
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      const msg = (err as Error).message;
      setFormError(msg);
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUser(deleteTarget.id);
      setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
      toast.success(`User ${deleteTarget.name} dihapus`);
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
        eyebrow="Administrator"
        title={<>Kelola <span className="text-gold">User</span></>}
        description="Tambah, edit, atau hapus akun pengurus dan mahasiswa. Total akun aktif di organisasi."
        actions={
          <Button onClick={openCreate} className="gap-2">
            <UserPlus size={16} /> Tambah User
          </Button>
        }
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
            placeholder="Cari nama, NIM, atau bidang…"
            className="pl-9"
            aria-label="Cari user"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {roleFilters.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setRoleFilter(f.value)}
              className={cn(
                'px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-widest border transition-colors',
                roleFilter === f.value
                  ? 'bg-accent text-[color:var(--color-selection-text)] border-accent'
                  : 'border-border text-fg-secondary hover:bg-glass-overlay'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-border">
          <p className="text-label">
            {loading ? 'Memuat…' : `${filtered.length} dari ${users.length} user`}
          </p>
        </div>

        {loading ? (
          <div className="p-4 space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            className="m-4 md:m-6"
            icon={UsersIcon}
            title={users.length === 0 ? 'Belum ada user' : 'Tidak ada user yang cocok'}
            description={
              users.length === 0
                ? 'Tambahkan user pertama lewat tombol di atas.'
                : 'Ubah kata kunci atau filter role untuk melihat user lain.'
            }
          />
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((user) => (
              <li
                key={user.id}
                className="flex items-center gap-3 px-5 md:px-6 py-3.5 hover:bg-glass-overlay transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold truncate">{user.name}</p>
                  <p className="text-[11px] font-mono uppercase tracking-widest text-fg-muted truncate">
                    {user.nim}
                    {user.jabatan && ` · ${jabatanLabels[user.jabatan]}`}
                    {user.bidang && ` · ${user.bidang}`}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={cn('shrink-0 text-[10px] uppercase tracking-widest', roleBadgeClass[user.role])}
                >
                  {user.role}
                </Badge>
                <button
                  type="button"
                  onClick={() => openEdit(user)}
                  aria-label={`Edit ${user.name}`}
                  className="p-2 rounded-md text-fg-muted hover:text-fg hover:bg-glass-overlay transition-colors"
                >
                  <Pencil size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(user)}
                  aria-label={`Hapus ${user.name}`}
                  className="p-2 rounded-md text-red-500 hover:bg-red-500/10 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingUser ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-2">
            <FormField id="user-nim" label="NIM">
              <Input
                value={formNim}
                onChange={(e) => setFormNim(e.target.value)}
                disabled={!!editingUser || submitting}
                placeholder="cth. 20210001"
                autoFocus={!editingUser}
              />
            </FormField>
            <FormField id="user-name" label="Nama lengkap">
              <Input
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                disabled={submitting}
                placeholder="Nama sesuai KTP/KTM"
              />
            </FormField>
            <FormField
              id="user-password"
              label="Password"
              helperText={editingUser ? 'Kosongkan jika tidak ingin mengubah' : 'Minimum 6 karakter'}
            >
              <Input
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                disabled={submitting}
                placeholder={editingUser ? '••••••••' : 'Buat password'}
              />
            </FormField>
            <div className="grid grid-cols-2 gap-3">
              <FormField id="user-role" label="Role">
                <select
                  value={formRole}
                  onChange={(e) => {
                    const v = e.target.value as typeof formRole;
                    setFormRole(v);
                    if (v !== 'PENGURUS') setFormJabatan('');
                  }}
                  disabled={submitting}
                  aria-label="Pilih role user"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                >
                  <option value="MAHASISWA">Mahasiswa</option>
                  <option value="PENGURUS">Pengurus</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </FormField>
              <FormField
                id="user-jabatan"
                label="Jabatan"
                helperText={formRole === 'PENGURUS' ? 'Khusus pengurus' : 'Hanya untuk role Pengurus'}
              >
                <select
                  value={formJabatan}
                  onChange={(e) => setFormJabatan(e.target.value as JabatanValue | '')}
                  disabled={submitting || formRole !== 'PENGURUS'}
                  aria-label="Pilih jabatan"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                >
                  <option value="">— Tanpa jabatan khusus —</option>
                  <option value="KETUA_UMUM">Ketua Umum</option>
                  <option value="SEKRETARIS_UMUM">Sekretaris Umum</option>
                  <option value="BENDAHARA_UMUM">Bendahara Umum</option>
                  <option value="KETUA_BIDANG">Ketua Bidang</option>
                  <option value="ANGGOTA_BIDANG">Anggota Bidang</option>
                </select>
              </FormField>
              <FormField id="user-bidang" label="Bidang (opsional)">
                <select
                  value={formBidang}
                  onChange={(e) => setFormBidang(e.target.value)}
                  disabled={submitting}
                  aria-label="Pilih bidang"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
                >
                  <option value="">— Tidak ada —</option>
                  {bidangDetail.map((b) => (
                    <option key={b.slug} value={b.name}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            {formError && (
              <p className="text-xs text-destructive font-medium" role="alert">
                {formError}
              </p>
            )}
            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setDialogOpen(false)}
                disabled={submitting}
              >
                Batal
              </Button>
              <Button type="submit" loading={submitting}>
                {editingUser ? 'Simpan' : 'Buat User'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-500">
              <ShieldAlert size={18} /> Hapus user?
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm font-mono leading-relaxed text-fg-secondary py-2">
            Akun <span className="font-bold text-fg">{deleteTarget?.name}</span> ({deleteTarget?.nim})
            akan dihapus permanen. Aksi ini tidak bisa dibatalkan.
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
              Hapus Permanen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
