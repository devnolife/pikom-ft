'use client';

import { useTheme } from '@/app/theme-provider';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, Users, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getAllProker } from '@/lib/actions/proker';

type ProkerItem = {
  id: string;
  bidang: string;
  title: string;
  status: string;
};

export default function PengurusPage() {
  const { colors, isLight } = useTheme();
  const { data: session } = useSession();
  const [proker, setProker] = useState<ProkerItem[]>([]);

  useEffect(() => {
    getAllProker().then(setProker);
  }, []);

  const bidang = (session?.user as { bidang?: string } | undefined)?.bidang;
  const myProker = bidang ? proker.filter((p) => p.bidang === bidang) : proker;

  const stats = {
    total: myProker.length,
    terlaksana: myProker.filter((p) => p.status === 'terlaksana').length,
    direncanakan: myProker.filter((p) => p.status === 'direncanakan').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Pengurus</h1>
        <p style={{ color: colors.textSecondary }}>
          {bidang ? `Bidang: ${bidang}` : 'Semua Bidang'} — {session?.user?.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: 'Total Proker', value: stats.total, icon: ClipboardList, color: colors.accent },
          { label: 'Terlaksana', value: stats.terlaksana, icon: CheckCircle2, color: '#22c55e' },
          { label: 'Direncanakan', value: stats.direncanakan, icon: TrendingUp, color: '#3b82f6' },
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

      {/* Recent proker */}
      <Card
        className="border"
        style={{ background: isLight ? '#fff' : colors.bgAlt, borderColor: colors.border }}
      >
        <CardHeader>
          <CardTitle className="text-lg">Program Kerja Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {myProker.length === 0 ? (
            <p className="text-center py-8" style={{ color: colors.textMuted }}>
              Belum ada program kerja
            </p>
          ) : (
            myProker.slice(0, 10).map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-lg border"
                style={{ borderColor: colors.border }}
              >
                <div>
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs" style={{ color: colors.textMuted }}>{item.bidang}</p>
                </div>
                <span
                  className="text-xs px-2 py-1 rounded-full"
                  style={{
                    background: item.status === 'terlaksana' ? '#22c55e20' : '#3b82f620',
                    color: item.status === 'terlaksana' ? '#22c55e' : '#3b82f6',
                  }}
                >
                  {item.status}
                </span>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
