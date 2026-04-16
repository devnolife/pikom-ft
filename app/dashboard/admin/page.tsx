'use client';

import { useTheme } from '@/app/theme-provider';
import { useSession } from 'next-auth/react';
import { Card, CardContent } from '@/components/ui/card';
import { Users, ClipboardList, Shield, TrendingUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getUsers } from '@/lib/actions/users';
import { getAllProker } from '@/lib/actions/proker';

export default function AdminPage() {
  const { colors, isLight } = useTheme();
  const { data: session } = useSession();
  const [userCount, setUserCount] = useState({ total: 0, mahasiswa: 0, pengurus: 0, admin: 0 });
  const [prokerCount, setProkerCount] = useState({ total: 0, terlaksana: 0 });

  useEffect(() => {
    getUsers().then((users) => {
      setUserCount({
        total: users.length,
        mahasiswa: users.filter((u) => u.role === 'MAHASISWA').length,
        pengurus: users.filter((u) => u.role === 'PENGURUS').length,
        admin: users.filter((u) => u.role === 'ADMIN').length,
      });
    });
    getAllProker().then((proker) => {
      setProkerCount({
        total: proker.length,
        terlaksana: proker.filter((p) => p.status === 'terlaksana').length,
      });
    });
  }, []);

  const stats = [
    { label: 'Total User', value: userCount.total, icon: Users, color: colors.accent },
    { label: 'Mahasiswa', value: userCount.mahasiswa, icon: Users, color: '#3b82f6' },
    { label: 'Pengurus', value: userCount.pengurus, icon: Shield, color: '#f59e0b' },
    { label: 'Total Proker', value: prokerCount.total, icon: ClipboardList, color: '#8b5cf6' },
    { label: 'Proker Selesai', value: prokerCount.terlaksana, icon: TrendingUp, color: '#22c55e' },
    { label: 'Admin', value: userCount.admin, icon: Shield, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard Admin</h1>
        <p style={{ color: colors.textSecondary }}>
          Selamat datang, {session?.user?.name}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((stat) => (
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
    </div>
  );
}
