'use client';

import { useTheme } from '@/app/theme-provider';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, CheckCircle2, Clock, AlertCircle, Plus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getMyProgress, updateProgress, addProgress } from '@/lib/actions/progress';
import { Input } from '@/components/ui/input';

type ProgressItem = {
  id: string;
  title: string;
  status: string;
  note: string | null;
};

const statusConfig: Record<string, { label: string; icon: typeof CheckCircle2; color: string }> = {
  selesai: { label: 'Selesai', icon: CheckCircle2, color: '#22c55e' },
  proses: { label: 'Dalam Proses', icon: Clock, color: '#f59e0b' },
  belum: { label: 'Belum Mulai', icon: AlertCircle, color: '#ef4444' },
};

export default function MahasiswaPage() {
  const { colors, isLight } = useTheme();
  const { data: session } = useSession();
  const [progress, setProgress] = useState<ProgressItem[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyProgress().then((data) => {
      setProgress(data);
      setLoading(false);
    });
  }, []);

  const handleAdd = async () => {
    if (!newTitle.trim()) return;
    const item = await addProgress(newTitle.trim());
    setProgress((prev) => [...prev, item]);
    setNewTitle('');
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    await updateProgress(id, newStatus);
    setProgress((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
    );
  };

  const nextStatus = (current: string) => {
    const order = ['belum', 'proses', 'selesai'];
    const idx = order.indexOf(current);
    return order[(idx + 1) % order.length];
  };

  const stats = {
    total: progress.length,
    selesai: progress.filter((p) => p.status === 'selesai').length,
    proses: progress.filter((p) => p.status === 'proses').length,
    belum: progress.filter((p) => p.status === 'belum').length,
  };

  const percentage = stats.total > 0 ? Math.round((stats.selesai / stats.total) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Mahasiswa</h1>
        <p style={{ color: colors.textSecondary }}>
          Selamat datang, {session?.user?.name}
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total', value: stats.total, icon: BarChart3, color: colors.accent },
          { label: 'Selesai', value: stats.selesai, icon: CheckCircle2, color: '#22c55e' },
          { label: 'Proses', value: stats.proses, icon: Clock, color: '#f59e0b' },
          { label: 'Belum', value: stats.belum, icon: AlertCircle, color: '#ef4444' },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="border"
            style={{
              background: isLight ? '#fff' : colors.bgAlt,
              borderColor: colors.border,
            }}
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs" style={{ color: colors.textMuted }}>{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <stat.icon className="w-8 h-8 opacity-50" style={{ color: stat.color }} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Progress bar */}
      <Card
        className="border"
        style={{ background: isLight ? '#fff' : colors.bgAlt, borderColor: colors.border }}
      >
        <CardHeader>
          <CardTitle className="text-lg">Progress Keseluruhan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ background: colors.border }}>
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${percentage}%`, background: colors.accent }}
              />
            </div>
            <span className="text-sm font-semibold" style={{ color: colors.accent }}>
              {percentage}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Add new progress */}
      <Card
        className="border"
        style={{ background: isLight ? '#fff' : colors.bgAlt, borderColor: colors.border }}
      >
        <CardContent className="p-4">
          <div className="flex gap-2">
            <Input
              placeholder="Tambah progress baru..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="border"
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

      {/* Progress list */}
      <Card
        className="border"
        style={{ background: isLight ? '#fff' : colors.bgAlt, borderColor: colors.border }}
      >
        <CardHeader>
          <CardTitle className="text-lg">Daftar Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {loading ? (
            <p className="text-center py-8" style={{ color: colors.textMuted }}>
              Memuat...
            </p>
          ) : progress.length === 0 ? (
            <p className="text-center py-8" style={{ color: colors.textMuted }}>
              Belum ada progress. Tambahkan yang pertama!
            </p>
          ) : (
            progress.map((item) => {
              const config = statusConfig[item.status] || statusConfig.belum;
              const StatusIcon = config.icon;
              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors"
                  style={{ borderColor: colors.border }}
                  onClick={() => handleStatusChange(item.id, nextStatus(item.status))}
                >
                  <StatusIcon className="w-5 h-5 shrink-0" style={{ color: config.color }} />
                  <span className="flex-1 text-sm">{item.title}</span>
                  <Badge
                    variant="outline"
                    className="text-xs"
                    style={{ borderColor: config.color, color: config.color }}
                  >
                    {config.label}
                  </Badge>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>
    </div>
  );
}
