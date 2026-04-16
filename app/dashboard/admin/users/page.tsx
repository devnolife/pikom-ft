'use client';

import { useTheme } from '@/app/theme-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, UserPlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '@/lib/actions/users';
import { bidangDetail } from '@/app/data/bidang';

type UserRow = {
  id: string;
  nim: string;
  name: string;
  role: string;
  bidang: string | null;
  createdAt: Date;
};

const roleColors: Record<string, string> = {
  ADMIN: '#ef4444',
  PENGURUS: '#f59e0b',
  MAHASISWA: '#3b82f6',
};

export default function AdminUsersPage() {
  const { colors, isLight } = useTheme();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);

  // Form state
  const [formNim, setFormNim] = useState('');
  const [formName, setFormName] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<'MAHASISWA' | 'PENGURUS' | 'ADMIN'>('MAHASISWA');
  const [formBidang, setFormBidang] = useState('');
  const [formError, setFormError] = useState('');

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const resetForm = () => {
    setFormNim('');
    setFormName('');
    setFormPassword('');
    setFormRole('MAHASISWA');
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
    setFormBidang(user.bidang || '');
    setFormError('');
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setFormError('');

    if (!formName.trim()) {
      setFormError('Nama wajib diisi');
      return;
    }

    try {
      if (editingUser) {
        // Update
        await updateUser(editingUser.id, {
          name: formName,
          role: formRole,
          bidang: formBidang || undefined,
          password: formPassword || undefined,
        });
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? { ...u, name: formName, role: formRole, bidang: formBidang || null }
              : u
          )
        );
      } else {
        // Create
        if (!formNim.trim() || !formPassword.trim()) {
          setFormError('NIM dan password wajib diisi');
          return;
        }
        await createUser({
          nim: formNim,
          name: formName,
          password: formPassword,
          role: formRole,
          bidang: formBidang || undefined,
        });
        // Refresh list
        const fresh = await getUsers();
        setUsers(fresh);
      }
      setDialogOpen(false);
      resetForm();
    } catch (err) {
      setFormError((err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Yakin hapus user ini?')) return;
    await deleteUser(id);
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const inputStyle = {
    background: isLight ? '#f9f9f9' : colors.bg,
    borderColor: colors.border,
    color: colors.text,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kelola User</h1>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger
            onClick={openCreate}
            className="cursor-pointer inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium h-9 px-4 py-2"
            style={{ background: colors.accent, color: isLight ? '#fff' : colors.bg }}
          >
            <UserPlus className="w-4 h-4 mr-2" /> Tambah User
          </DialogTrigger>
          <DialogContent
            style={{
              background: isLight ? '#fff' : colors.bgAlt,
              borderColor: colors.border,
              color: colors.text,
            }}
          >
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Tambah User Baru'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label style={{ color: colors.textSecondary }}>NIM</Label>
                <Input
                  value={formNim}
                  onChange={(e) => setFormNim(e.target.value)}
                  disabled={!!editingUser}
                  className="border"
                  style={inputStyle}
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: colors.textSecondary }}>Nama</Label>
                <Input
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="border"
                  style={inputStyle}
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: colors.textSecondary }}>
                  Password {editingUser && '(kosongkan jika tidak ingin mengubah)'}
                </Label>
                <Input
                  type="password"
                  value={formPassword}
                  onChange={(e) => setFormPassword(e.target.value)}
                  className="border"
                  style={inputStyle}
                />
              </div>
              <div className="space-y-2">
                <Label style={{ color: colors.textSecondary }}>Role</Label>
                <select
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as 'MAHASISWA' | 'PENGURUS' | 'ADMIN')}
                  aria-label="Pilih role"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  style={inputStyle}
                >
                  <option value="MAHASISWA">Mahasiswa</option>
                  <option value="PENGURUS">Pengurus</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label style={{ color: colors.textSecondary }}>Bidang (opsional)</Label>
                <select
                  value={formBidang}
                  onChange={(e) => setFormBidang(e.target.value)}
                  aria-label="Pilih bidang"
                  className="w-full border rounded-md px-3 py-2 text-sm"
                  style={inputStyle}
                >
                  <option value="">— Tidak ada —</option>
                  {bidangDetail.map((b) => (
                    <option key={b.slug} value={b.name}>{b.name}</option>
                  ))}
                </select>
              </div>
              {formError && <p className="text-red-500 text-sm">{formError}</p>}
            </div>
            <DialogFooter>
              <Button
                onClick={handleSubmit}
                className="cursor-pointer"
                style={{ background: colors.accent, color: isLight ? '#fff' : colors.bg }}
              >
                {editingUser ? 'Simpan' : 'Buat User'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card
        className="border"
        style={{ background: isLight ? '#fff' : colors.bgAlt, borderColor: colors.border }}
      >
        <CardHeader>
          <CardTitle className="text-lg">Daftar User ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-3 rounded-lg border"
                style={{ borderColor: colors.border }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>
                    {user.nim} {user.bidang && `• ${user.bidang}`}
                  </p>
                </div>
                <Badge
                  className="text-xs shrink-0"
                  variant="outline"
                  style={{
                    borderColor: roleColors[user.role],
                    color: roleColors[user.role],
                  }}
                >
                  {user.role}
                </Badge>
                <button
                  onClick={() => openEdit(user)}
                  aria-label={`Edit ${user.name}`}
                  className="p-1.5 rounded hover:opacity-70"
                  style={{ color: colors.textSecondary }}
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  aria-label={`Hapus ${user.name}`}
                  className="p-1.5 rounded text-red-500 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
