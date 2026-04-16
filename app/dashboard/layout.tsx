'use client';

import { useTheme, themeKeys, themeLabels, type ThemeKey } from '@/app/theme-provider';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Sun, Moon, SwatchBook, LogOut, Home, Users, BarChart3,
  ClipboardList, Settings, Menu, X, ChevronRight,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

const themeIcons: Record<ThemeKey, typeof Sun> = {
  classic: SwatchBook,
  light: Sun,
  dark: Moon,
};

const roleLabels: Record<string, string> = {
  MAHASISWA: 'Mahasiswa',
  PENGURUS: 'Pengurus',
  ADMIN: 'Administrator',
};

function getNavItems(role: string) {
  const base = '/dashboard';
  switch (role) {
    case 'ADMIN':
      return [
        { href: `${base}/admin`, label: 'Dashboard', icon: Home },
        { href: `${base}/admin/users`, label: 'Kelola User', icon: Users },
        { href: `${base}/admin/proker`, label: 'Semua Proker', icon: ClipboardList },
      ];
    case 'PENGURUS':
      return [
        { href: `${base}/pengurus`, label: 'Dashboard', icon: Home },
        { href: `${base}/pengurus/proker`, label: 'Program Kerja', icon: ClipboardList },
        { href: `${base}/pengurus/kader`, label: 'Data Kader', icon: Users },
      ];
    default:
      return [
        { href: `${base}/mahasiswa`, label: 'Dashboard', icon: Home },
        { href: `${base}/mahasiswa/progress`, label: 'Progress Saya', icon: BarChart3 },
      ];
  }
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { colors, theme, setTheme, isLight } = useTheme();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = (session?.user as { role?: string } | undefined)?.role || 'MAHASISWA';
  const navItems = getNavItems(role);

  const cycleTheme = () => {
    const idx = themeKeys.indexOf(theme);
    setTheme(themeKeys[(idx + 1) % themeKeys.length]);
  };
  const ThemeIcon = themeIcons[theme];

  const initials = session?.user?.name
    ?.split(' ')
    .map((w: string) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase() || '??';

  return (
    <div className="min-h-screen flex" style={{ background: colors.bg, color: colors.text }}>
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: isLight ? '#fff' : colors.bgAlt,
          borderRight: `1px solid ${colors.border}`,
        }}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="p-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-lg font-bold" style={{ color: colors.accent }}>
                PIKOM FT
              </span>
            </Link>
            <button
              className="lg:hidden p-1 rounded"
              onClick={() => setSidebarOpen(false)}
              style={{ color: colors.textSecondary }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Separator style={{ background: colors.border }} />

          {/* User info */}
          <div className="p-4 flex items-center gap-3">
            <Avatar className="w-10 h-10" style={{ background: `${colors.accent}30` }}>
              <AvatarFallback style={{ color: colors.accent, background: 'transparent' }}>
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-xs truncate" style={{ color: colors.textMuted }}>
                {roleLabels[role] || role}
              </p>
            </div>
          </div>

          <Separator style={{ background: colors.border }} />

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                  style={{
                    background: isActive ? `${colors.accent}15` : 'transparent',
                    color: isActive ? colors.accent : colors.textSecondary,
                  }}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  {item.label}
                  {isActive && <ChevronRight className="w-4 h-4 ml-auto" />}
                </Link>
              );
            })}
          </nav>

          {/* Bottom actions */}
          <div className="p-3 space-y-1">
            <button
              onClick={cycleTheme}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-colors"
              style={{ color: colors.textSecondary }}
            >
              <ThemeIcon className="w-4 h-4" />
              Tema: {themeLabels[theme]}
            </button>

            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm w-full transition-colors text-red-500"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header
          className="sticky top-0 z-20 flex items-center h-14 px-4 gap-4"
          style={{
            background: isLight ? 'rgba(255,255,255,0.8)' : `${colors.bgAlt}cc`,
            backdropFilter: 'blur(10px)',
            borderBottom: `1px solid ${colors.border}`,
          }}
        >
          <button
            className="lg:hidden p-1.5 rounded-lg"
            onClick={() => setSidebarOpen(true)}
            style={{ color: colors.textSecondary }}
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <span className="text-xs" style={{ color: colors.textMuted }}>
            {(session?.user as { nim?: string } | undefined)?.nim}
          </span>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  );
}
