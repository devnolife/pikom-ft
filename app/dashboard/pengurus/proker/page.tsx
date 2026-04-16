'use client';

import { useTheme } from '@/app/theme-provider';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllProker, createProker, updateProkerStatus, deleteProker } from '@/lib/actions/proker';
import { bidangDetail } from '@/app/data/bidang';

type ProkerItem = {
  id: string;
  bidang: string;
  title: string;
  status: string;
  deskripsi: string | null;
};

export default function PengurusProkerPage() {
  const { colors, isLight } = useTheme();
  const { data: session } = useSession();
  const [proker, setProker] = useState<ProkerItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [selectedBidang, setSelectedBidang] = useState('');

  const role = (session?.user as { role?: string } | undefined)?.role;
  const userBidang = (session?.user as { bidang?: string } | undefined)?.bidang;

  useEffect(() => {
    getAllProker().then(setProker);
    if (userBidang) setSelectedBidang(userBidang);
  }, [userBidang]);

  const handleAdd = async () => {
    if (!newTitle.trim() || !selectedBidang) return;
    const item = await createProker({
      bidang: selectedBidang,
      title: newTitle.trim(),
    });
    setProker((prev) => [item, ...prev]);
    setNewTitle('');
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'terlaksana' ? 'direncanakan' : 'terlaksana';
    await updateProkerStatus(id, newStatus);
    setProker((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const handleDelete = async (id: string) => {
    await deleteProker(id);
    setProker((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredProker = userBidang
    ? proker.filter((p) => p.bidang === userBidang)
    : proker;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Program Kerja</h1>

      <Card
        className="border"
        style={{ background: isLight ? '#fff' : colors.bgAlt, borderColor: colors.border }}
      >
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-2">
            {!userBidang && (
              <select
                value={selectedBidang}
                onChange={(e) => setSelectedBidang(e.target.value)}
                aria-label="Pilih bidang"
                className="border rounded-md px-3 py-2 text-sm"
                style={{
                  background: isLight ? '#f9f9f9' : colors.bg,
                  borderColor: colors.border,
                  color: colors.text,
                }}
              >
                <option value="">Pilih Bidang</option>
                {bidangDetail.map((b) => (
                  <option key={b.slug} value={b.name}>{b.name}</option>
                ))}
              </select>
            )}
            <Input
              placeholder="Nama program kerja..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="border flex-1"
              style={{
                background: isLight ? '#f9f9f9' : colors.bg,
                borderColor: colors.border,
                color: colors.text,
              }}
            />
            <Button
              onClick={handleAdd}
              className="shrink-0 cursor-pointer"
              style={{ background: colors.accent, color: isLight ? '#fff' : colors.bg }}
            >
              <Plus className="w-4 h-4 mr-1" /> Tambah
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card
        className="border"
        style={{ background: isLight ? '#fff' : colors.bgAlt, borderColor: colors.border }}
      >
        <CardHeader>
          <CardTitle className="text-lg">Daftar Program Kerja</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {filteredProker.length === 0 ? (
            <p className="text-center py-8" style={{ color: colors.textMuted }}>
              Belum ada program kerja
            </p>
          ) : (
            filteredProker.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3 rounded-lg border"
                style={{ borderColor: colors.border }}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>{item.bidang}</p>
                </div>
                <Badge
                  className="cursor-pointer text-xs shrink-0"
                  variant="outline"
                  onClick={() => handleToggleStatus(item.id, item.status)}
                  style={{
                    borderColor: item.status === 'terlaksana' ? '#22c55e' : '#3b82f6',
                    color: item.status === 'terlaksana' ? '#22c55e' : '#3b82f6',
                  }}
                >
                  {item.status}
                </Badge>
                <button
                  onClick={() => handleDelete(item.id)}
                  aria-label={`Hapus ${item.title}`}
                  className="text-red-500 p-1 rounded hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
