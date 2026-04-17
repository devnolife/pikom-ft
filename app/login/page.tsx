'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Eye, EyeOff, LogIn, ArrowLeft, Quote, ChevronDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { BrandMark } from '@/components/landing/brand-mark';
import { DecorativeBlobs } from '@/components/landing/decorative-blobs';
import { cn } from '@/lib/utils';

const devAccounts = [
  { label: 'Admin', nim: 'ADMIN001', password: 'admin123' },
  { label: 'Pengurus', nim: 'PENGURUS001', password: 'pengurus123' },
  { label: 'Mahasiswa', nim: '2024001', password: 'mhs123' },
];

const isDev = process.env.NODE_ENV !== 'production';

export default function LoginPage() {
  const router = useRouter();
  const [nim, setNim] = useState('');
  const [password, setPassword] = useState('');
  const [nimError, setNimError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [devOpen, setDevOpen] = useState(false);

  const validate = () => {
    let ok = true;
    if (!nim.trim()) {
      setNimError('NIM wajib diisi');
      ok = false;
    } else setNimError('');
    if (!password) {
      setPasswordError('Password wajib diisi');
      ok = false;
    } else setPasswordError('');
    return ok;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    const result = await signIn('credentials', {
      nim: nim.trim(),
      password,
      redirect: false,
    });

    if (result?.error) {
      setLoading(false);
      toast.error('Gagal masuk', {
        description: 'NIM atau password yang Anda masukkan tidak cocok.',
      });
      setPasswordError('NIM atau password salah');
      return;
    }

    toast.success('Selamat datang kembali!', {
      description: 'Mengalihkan ke dashboard...',
    });
    router.push('/dashboard');
    router.refresh();
  };

  const handleDevSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const acc = devAccounts.find((a) => a.nim === e.target.value);
    if (acc) {
      setNim(acc.nim);
      setPassword(acc.password);
      setNimError('');
      setPasswordError('');
    }
  };

  return (
    <div className="min-h-screen bg-bg text-fg lg:grid lg:grid-cols-[55fr_45fr]">
      {/* ═══════════════════════════════════════════════════════
          BRAND PANEL (desktop) / HEADER (mobile)
          ═══════════════════════════════════════════════════════ */}
      <aside
        className="relative overflow-hidden lg:sticky lg:top-0 lg:h-screen flex flex-col justify-between px-6 md:px-10 lg:px-14 py-8 lg:py-12"
        style={{
          background:
            'linear-gradient(135deg, var(--color-brand), var(--color-brand-alt) 60%, var(--color-bg-alt))',
        }}
      >
        <DecorativeBlobs variant="hero" />

        <header className="relative z-10 flex items-center justify-between">
          <BrandMark />
          <Link
            href="/"
            className="hidden lg:inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-mono text-fg-secondary hover:text-fg transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Beranda
          </Link>
        </header>

        {/* Hero content (desktop only) */}
        <div className="hidden lg:block relative z-10 max-w-md">
          <span className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.2em] text-accent mb-8">
            <Quote size={12} aria-hidden="true" />
            Pesan IMM
          </span>
          <h1 className="font-black tracking-tighter uppercase leading-[0.95] text-5xl xl:text-6xl mb-6">
            Anggun dalam <span className="text-gold">Moral</span>,
            Unggul dalam Intelektual
          </h1>
          <p className="text-base font-mono leading-relaxed text-fg-secondary">
            Masuk ke dashboard PIKOM Fakultas Teknik untuk mengelola program
            kerja, kader, dan progress Anda.
          </p>
        </div>

        <footer className="hidden lg:block relative z-10 text-[11px] font-mono uppercase tracking-[0.2em] text-fg-muted">
          &copy; 2026 PIKOM FT — IMM
        </footer>

        {/* Mobile compact header */}
        <div className="lg:hidden relative z-10 mt-4">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-fg-muted">
            Anggun dalam Moral, Unggul dalam Intelektual
          </p>
        </div>
      </aside>

      {/* ═══════════════════════════════════════════════════════
          FORM PANEL
          ═══════════════════════════════════════════════════════ */}
      <main className="relative flex items-center justify-center px-6 md:px-10 py-12 lg:py-16">
        {/* Top-right theme toggle */}
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div className="w-full max-w-md">
          {/* Back link (mobile) */}
          <Link
            href="/"
            className="lg:hidden inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] font-mono text-fg-secondary hover:text-accent transition-colors mb-8"
          >
            <ArrowLeft size={14} />
            Beranda
          </Link>

          <div className="mb-10">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 glass-strong"
              aria-hidden="true"
            >
              <LogIn size={22} className="text-accent" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight uppercase mb-2">
              Masuk ke Dashboard
            </h2>
            <p className="text-sm font-mono text-fg-secondary">
              Gunakan NIM dan password yang diberikan pengurus.
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            <FormField
              id="nim"
              label="NIM"
              helperText="Contoh: 2024001"
              error={nimError}
            >
              <Input
                type="text"
                name="nim"
                autoComplete="username"
                inputMode="text"
                autoFocus
                value={nim}
                onChange={(e) => {
                  setNim(e.target.value);
                  if (nimError) setNimError('');
                }}
                placeholder="Masukkan NIM"
                disabled={loading}
                className="h-11 bg-surface/60 border-border"
              />
            </FormField>

            <FormField
              id="password"
              label="Password"
              error={passwordError}
              rightSlot={
                <button
                  type="button"
                  onClick={() => toast.info('Hubungi pengurus untuk reset password')}
                  className="text-fg-muted hover:text-accent transition-colors font-mono"
                >
                  Lupa password?
                </button>
              }
            >
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) setPasswordError('');
                  }}
                  placeholder="Masukkan password"
                  disabled={loading}
                  className="h-11 bg-surface/60 border-border pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-fg-muted hover:text-fg transition-colors"
                  aria-label={showPassword ? 'Sembunyikan password' : 'Tampilkan password'}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </FormField>

            <Button
              type="submit"
              loading={loading}
              className="w-full h-11 rounded-full bg-accent text-[color:var(--color-selection-text)] font-bold uppercase text-xs tracking-[0.2em] hover:opacity-90 transition-opacity"
            >
              {loading ? 'Memverifikasi...' : 'Masuk'}
            </Button>
          </form>

          {/* Dev quick login */}
          {isDev && (
            <div className="mt-8">
              <button
                type="button"
                onClick={() => setDevOpen((v) => !v)}
                aria-expanded={devOpen}
                className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.3em] text-fg-muted hover:text-accent transition-colors"
              >
                <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
                Dev Quick Login
                <ChevronDown
                  size={12}
                  className={cn('transition-transform', devOpen && 'rotate-180')}
                />
              </button>
              {devOpen && (
                <div className="mt-3 p-3 rounded-xl glass border border-border">
                  <label htmlFor="dev-account" className="sr-only">
                    Pilih akun dev
                  </label>
                  <select
                    id="dev-account"
                    onChange={handleDevSelect}
                    defaultValue=""
                    className="w-full px-3 py-2 rounded-md text-sm bg-surface border border-border text-fg cursor-pointer"
                  >
                    <option value="" disabled>
                      Pilih akun untuk auto-fill...
                    </option>
                    {devAccounts.map((acc) => (
                      <option key={acc.nim} value={acc.nim}>
                        {acc.label} — {acc.nim}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <p className="text-center text-xs text-fg-muted mt-10 font-mono">
            Hubungi pengurus jika belum memiliki akun
          </p>
        </div>
      </main>
    </div>
  );
}
