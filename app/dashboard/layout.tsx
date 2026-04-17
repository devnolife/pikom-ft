'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Home, Users, BarChart3, ClipboardList, Mail, FileText, Wallet, LayoutDashboard,
} from 'lucide-react';
import { Sidebar, type SidebarNavItem } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';

const roleLabels: Record<string, string> = {
  MAHASISWA: 'Mahasiswa',
  PENGURUS: 'Pengurus',
  ADMIN: 'Administrator',
};

const jabatanLabels: Record<string, string> = {
  KETUA_UMUM: 'Ketua Umum',
  SEKRETARIS_UMUM: 'Sekretaris Umum',
  BENDAHARA_UMUM: 'Bendahara Umum',
  KETUA_BIDANG: 'Ketua Bidang',
  ANGGOTA_BIDANG: 'Anggota Bidang',
};

function getNavItems(role: string, jabatan?: string | null): SidebarNavItem[] {
  const base = '/dashboard';

  if (role === 'ADMIN') {
    return [
      { href: `${base}/admin`, label: 'Dashboard', icon: Home, group: 'Utama' },
      { href: `${base}/admin/users`, label: 'Kelola User', icon: Users, group: 'Administrasi' },
      { href: `${base}/admin/proker`, label: 'Semua Proker', icon: ClipboardList, group: 'Administrasi' },
      { href: `${base}/ketua`, label: 'Ringkasan Komisariat', icon: LayoutDashboard, group: 'Operasional' },
      { href: `${base}/sekum/persuratan`, label: 'Persuratan', icon: Mail, group: 'Operasional' },
      { href: `${base}/sekum/aturan`, label: 'TOR & Aturan', icon: FileText, group: 'Operasional' },
      { href: `${base}/bendahara`, label: 'Keuangan', icon: Wallet, group: 'Operasional' },
    ];
  }

  if (role === 'PENGURUS') {
    switch (jabatan) {
      case 'KETUA_UMUM':
        return [
          { href: `${base}/ketua`, label: 'Ringkasan', icon: LayoutDashboard, group: 'Utama' },
          { href: `${base}/pengurus/proker`, label: 'Proker Semua Bidang', icon: ClipboardList, group: 'Operasional' },
          { href: `${base}/ketua/persuratan`, label: 'Persuratan', icon: Mail, group: 'Operasional' },
          { href: `${base}/ketua/aturan`, label: 'TOR & Aturan', icon: FileText, group: 'Operasional' },
          { href: `${base}/ketua/keuangan`, label: 'Keuangan', icon: Wallet, group: 'Operasional' },
        ];
      case 'SEKRETARIS_UMUM':
        return [
          { href: `${base}/sekum/persuratan`, label: 'Persuratan', icon: Mail, group: 'Sekretariat' },
          { href: `${base}/sekum/aturan`, label: 'TOR & Aturan', icon: FileText, group: 'Sekretariat' },
        ];
      case 'BENDAHARA_UMUM':
        return [
          { href: `${base}/bendahara`, label: 'Kas & Keuangan', icon: Wallet, group: 'Keuangan' },
        ];
      case 'KETUA_BIDANG':
        return [
          { href: `${base}/pengurus`, label: 'Dashboard Bidang', icon: Home, group: 'Utama' },
          { href: `${base}/pengurus/proker`, label: 'Program Kerja', icon: ClipboardList, group: 'Bidang' },
          { href: `${base}/pengurus/kader`, label: 'Data Kader', icon: Users, group: 'Bidang' },
        ];
      case 'ANGGOTA_BIDANG':
      default:
        return [
          { href: `${base}/pengurus`, label: 'Dashboard Bidang', icon: Home, group: 'Utama' },
          { href: `${base}/pengurus/proker`, label: 'Kegiatan Kerja', icon: ClipboardList, group: 'Bidang' },
        ];
    }
  }

  // MAHASISWA
  return [
    { href: `${base}/mahasiswa`, label: 'Dashboard', icon: Home, group: 'Utama' },
    { href: `${base}/mahasiswa/progress`, label: 'Progress Saya', icon: BarChart3, group: 'Akademik' },
  ];
}

function getCrumbs(pathname: string, role: string): string[] {
  if (pathname === '/dashboard') return ['Dashboard'];
  const segments = pathname.split('/').filter(Boolean).slice(1);
  const first = segments[0];
  const rest = segments.slice(1);
  const areaLabels: Record<string, string> = {
    admin: 'Administrator',
    pengurus: 'Pengurus',
    mahasiswa: 'Mahasiswa',
    ketua: 'Ketua Umum',
    sekum: 'Sekretaris Umum',
    bendahara: 'Bendahara',
  };
  const mainLabel = areaLabels[first ?? ''] || (first ?? '');
  const map: Record<string, string> = {
    users: 'Kelola User',
    proker: 'Program Kerja',
    kader: 'Data Kader',
    progress: 'Progress',
    persuratan: 'Persuratan',
    aturan: 'TOR & Aturan',
    keuangan: 'Keuangan',
  };
  const restLabels = rest.map((s) => map[s] || s.charAt(0).toUpperCase() + s.slice(1));
  void role;
  return ['Dashboard', mainLabel, ...restLabels].filter(Boolean);
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = (session?.user as { role?: string } | undefined)?.role || 'MAHASISWA';
  const jabatan = (session?.user as { jabatan?: string | null } | undefined)?.jabatan ?? null;
  const nim = (session?.user as { nim?: string } | undefined)?.nim;
  const navItems = getNavItems(role, jabatan);
  const crumbs = getCrumbs(pathname, role);
  const roleLabel = jabatan ? jabatanLabels[jabatan] : roleLabels[role] || role;

  return (
    <div className="relative min-h-screen bg-bg text-fg flex overflow-hidden">
      {/* Ambient aurora glow — subtle personality, no visual weight */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[color:var(--color-accent)]/[0.05] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 -right-40 w-[420px] h-[420px] rounded-full bg-[color:var(--color-brand)]/[0.07] blur-3xl"
      />

      <Sidebar
        items={navItems}
        user={{
          name: session?.user?.name,
          nim,
          roleLabel,
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="relative flex-1 flex flex-col min-w-0">
        <Topbar
          crumbs={crumbs}
          onOpenSidebar={() => setSidebarOpen(true)}
          user={{ name: session?.user?.name, roleLabel }}
        />
        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}

