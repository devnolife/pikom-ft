'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme, themeKeys, themeLabels, type ThemeKey } from '@/app/theme-provider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Sun, Moon, SwatchBook, LogIn, Loader2 } from 'lucide-react';

const themeIcons: Record<ThemeKey, typeof Sun> = {
  classic: SwatchBook,
  light: Sun,
  dark: Moon,
};

const devAccounts = [
  { label: 'Admin', nim: 'ADMIN001', password: 'admin123' },
  { label: 'Pengurus', nim: 'PENGURUS001', password: 'pengurus123' },
  { label: 'Mahasiswa', nim: '2024001', password: 'mhs123' },
];

export default function LoginPage() {
  const { colors, theme, setTheme, isLight } = useTheme();
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!nim || !password) {
      setError('NIM dan password wajib diisi');
      setLoading(false);
      return;
    }

    const result = await signIn('credentials', {
      nim,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError('NIM atau password salah');
      setLoading(false);
      return;
    }

    router.push('/dashboard');
    router.refresh();
  };

  const handleDevSelect = (value: string) => {
    const account = devAccounts.find((a) => a.nim === value);
    if (account) {
      setNim(account.nim);
      setPassword(account.password);
    }
  };

  const cycleTheme = () => {
    const idx = themeKeys.indexOf(theme);
    setTheme(themeKeys[(idx + 1) % themeKeys.length]);
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: `linear-gradient(135deg, ${colors.bg}, ${colors.bgAlt})` }}
    >
      {/* Background decorations */}
      <div
        className="absolute top-[-20%] right-[-10%] w-96 h-96 rounded-full blur-3xl opacity-20 animate-blob"
        style={{ background: colors.accent }}
      />
      <div
        className="absolute bottom-[-20%] left-[-10%] w-96 h-96 rounded-full blur-3xl opacity-15 animate-blob"
        style={{ background: colors.accentSecondary, animationDelay: '2s' }}
      />

      <div className="w-full max-w-md relative z-10">
        {/* Theme toggle */}
        <div className="flex justify-end mb-4">
          <button
            onClick={cycleTheme}
            className="p-2 rounded-full glass"
            style={{ color: colors.accent }}
            title={`Tema: ${themeLabels[theme]}`}
          >
            <ThemeIcon className="w-5 h-5" />
          </button>
        </div>

        <Card
          className="border-0 shadow-2xl"
          style={{
            background: isLight ? 'rgba(255,255,255,0.9)' : colors.glassOverlay,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${colors.border}`,
            color: colors.text,
          }}
        >
          <CardHeader className="text-center space-y-2">
            <div
              className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-2"
              style={{ background: `${colors.accent}20` }}
            >
              <LogIn className="w-8 h-8" style={{ color: colors.accent }} />
            </div>
            <CardTitle className="text-2xl font-bold" style={{ color: colors.text }}>
              PIKOM FT — IMM
            </CardTitle>
            <CardDescription style={{ color: colors.textSecondary }}>
              Masuk dengan NIM dan password
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* Dev Quick Login */}
            <div className="mb-5 p-3 rounded-lg" style={{ background: `${colors.accent}10`, border: `1px dashed ${colors.accent}40` }}>
              <label className="text-[10px] uppercase tracking-widest font-mono block mb-2" style={{ color: colors.accent }}>
                Dev — Quick Login
              </label>
              <select
                onChange={(e) => handleDevSelect(e.target.value)}
                defaultValue=""
                className="w-full px-3 py-2 rounded-md text-sm border cursor-pointer"
                style={{
                  background: isLight ? '#fff' : colors.bgAlt,
                  borderColor: colors.border,
                  color: colors.text,
                }}
              >
                <option value="" disabled>Pilih akun...</option>
                {devAccounts.map((acc) => (
                  <option key={acc.nim} value={acc.nim}>
                    {acc.label} — {acc.nim}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nim" style={{ color: colors.textSecondary }}>
                  NIM
                </Label>
                <Input
                  id="nim"
                  name="nim"
                  type="text"
                  placeholder="Masukkan NIM"
                  required
                  value={nim}
                  onChange={(e) => setNim(e.target.value)}
                  className="border"
                  style={{
                    background: isLight ? '#fff' : colors.bgAlt,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" style={{ color: colors.textSecondary }}>
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Masukkan password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border"
                  style={{
                    background: isLight ? '#fff' : colors.bgAlt,
                    borderColor: colors.border,
                    color: colors.text,
                  }}
                />
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full font-semibold cursor-pointer"
                style={{
                  background: colors.accent,
                  color: isLight ? '#fff' : colors.bg,
                }}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Masuk...
                  </>
                ) : (
                  'Masuk'
                )}
              </Button>
            </form>

            <p className="text-center text-xs mt-6" style={{ color: colors.textMuted }}>
              Hubungi pengurus jika belum memiliki akun
            </p>
          </CardContent>
        </Card>

        {/* Back to home */}
        <div className="text-center mt-4">
          <a
            href="/"
            className="text-sm hover:underline"
            style={{ color: colors.textSecondary }}
          >
            ← Kembali ke beranda
          </a>
        </div>
      </div>
    </div>
  );
}
