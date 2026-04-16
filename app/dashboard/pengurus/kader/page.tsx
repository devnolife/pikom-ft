'use client';

import { useTheme } from '@/app/theme-provider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useEffect, useState } from 'react';
import { getUsers } from '@/lib/actions/users';

type UserRow = {
  id: string;
  nim: string;
  name: string;
  role: string;
  bidang: string | null;
};

export default function PengurusKaderPage() {
  const { colors, isLight } = useTheme();
  const [users, setUsers] = useState<UserRow[]>([]);

  useEffect(() => {
    getUsers()
      .then(setUsers)
      .catch(() => setUsers([]));
  }, []);

  const mahasiswa = users.filter((u) => u.role === 'MAHASISWA');

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Data Kader</h1>

      <Card
        className="border"
        style={{ background: isLight ? '#fff' : colors.bgAlt, borderColor: colors.border }}
      >
        <CardHeader>
          <CardTitle className="text-lg">Mahasiswa Terdaftar ({mahasiswa.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {mahasiswa.length === 0 ? (
              <p className="text-center py-8" style={{ color: colors.textMuted }}>
                Belum ada data kader
              </p>
            ) : (
              mahasiswa.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                  style={{ borderColor: colors.border }}
                >
                  <div>
                    <p className="text-sm font-medium">{u.name}</p>
                    <p className="text-xs" style={{ color: colors.textMuted }}>{u.nim}</p>
                  </div>
                  {u.bidang && (
                    <Badge variant="outline" style={{ borderColor: colors.accent, color: colors.accent }}>
                      {u.bidang}
                    </Badge>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
