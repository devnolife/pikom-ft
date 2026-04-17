'use client';

import { useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  Home, Users, BarChart3, ClipboardList,
} from 'lucide-react';
import { Sidebar, type SidebarNavItem } from '@/components/dashboard/sidebar';
import { Topbar } from '@/components/dashboard/topbar';

const roleLabels: Record<string, string> = {
  MAHASISWA: 'Mahasiswa',
  PENGURUS: 'Pengurus',
  ADMIN: 'Administrator',
};

function getNavItems(role: string): SidebarNavItem[] {
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

// Map path → page title (breadcrumb terakhir)
function getCrumbs(pathname: string, role: string): string[] {
  if (pathname === '/dashboard') return ['Dashboard'];
  const segments = pathname.split('/').filter(Boolean).slice(1); // drop "dashboard"
  const first = segments[0];
  const rest = segments.slice(1);
  const mainLabel = roleLabels[first?.toUpperCase() ?? ''] || (first ?? '');
  const restLabels = rest.map((s) => {
    const map: Record<string, string> = {
      users: 'Kelola User',
      proker: 'Program Kerja',
      kader: 'Data Kader',
      progress: 'Progress',
    };
    return map[s] || s.charAt(0).toUpperCase() + s.slice(1);
  });
  // void role param (reserved for future)
  void role;
  return ['Dashboard', mainLabel, ...restLabels].filter(Boolean);
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const role = (session?.user as { role?: string } | undefined)?.role || 'MAHASISWA';
  const nim = (session?.user as { nim?: string } | undefined)?.nim;
  const navItems = getNavItems(role);
  const crumbs = getCrumbs(pathname, role);

  return (
    <div className="min-h-screen bg-bg text-fg flex">
      <Sidebar
        items={navItems}
        user={{
          name: session?.user?.name,
          nim,
          roleLabel: roleLabels[role] || role,
        }}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar crumbs={crumbs} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 p-4 md:p-8 lg:p-10 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
