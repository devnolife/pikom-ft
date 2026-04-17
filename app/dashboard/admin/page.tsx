'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  Users, ClipboardList, Shield, TrendingUp, CheckCircle2,
  GraduationCap, ArrowRight,
} from 'lucide-react';
import { PageHeader } from '@/components/dashboard/page-header';
import { StatCard } from '@/components/dashboard/stat-card';
import { Skeleton } from '@/components/ui/skeleton';
import { getUsers } from '@/lib/actions/users';
import { getAllProker } from '@/lib/actions/proker';

export default function AdminPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [userCount, setUserCount] = useState({ total: 0, mahasiswa: 0, pengurus: 0, admin: 0 });
  const [prokerCount, setProkerCount] = useState({ total: 0, terlaksana: 0 });

  useEffect(() => {
    Promise.all([getUsers(), getAllProker()])
      .then(([users, proker]) => {
        setUserCount({
          total: users.length,
          mahasiswa: users.filter((u) => u.role === 'MAHASISWA').length,
          pengurus: users.filter((u) => u.role === 'PENGURUS').length,
          admin: users.filter((u) => u.role === 'ADMIN').length,
        });
        setProkerCount({
          total: proker.length,
          terlaksana: proker.filter((p) => p.status === 'terlaksana').length,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const progressPct =
    prokerCount.total === 0
      ? 0
      : Math.round((prokerCount.terlaksana / prokerCount.total) * 100);

  return (
    <>
      <PageHeader
        eyebrow="Administrator"
        title={<>Halo, <span className="text-gold">{session?.user?.name ?? 'Admin'}</span></>}
        description="Ringkasan aktivitas organisasi — user, program kerja, dan status kaderisasi secara keseluruhan."
      />

      {/* Stat grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 md:gap-4 mb-10">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))
          : (
            <>
              <StatCard
                label="Total User"
                value={userCount.total}
                icon={Users}
                tone="accent"
              />
              <StatCard
                label="Mahasiswa"
                value={userCount.mahasiswa}
                icon={GraduationCap}
                tone="default"
              />
              <StatCard
                label="Pengurus"
                value={userCount.pengurus}
                icon={Shield}
                tone="gold"
              />
              <StatCard
                label="Admin"
                value={userCount.admin}
                icon={Shield}
                tone="red"
              />
              <StatCard
                label="Total Proker"
                value={prokerCount.total}
                icon={ClipboardList}
                tone="default"
              />
              <StatCard
                label="Proker Selesai"
                value={prokerCount.terlaksana}
                icon={CheckCircle2}
                tone="green"
                hint={`${progressPct}% dari total`}
              />
            </>
          )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
        <QuickLink
          href="/dashboard/admin/users"
          icon={Users}
          title="Kelola User"
          desc="Tambah, edit, atau hapus akun pengurus dan mahasiswa."
        />
        <QuickLink
          href="/dashboard/admin/proker"
          icon={ClipboardList}
          title="Program Kerja"
          desc="Tinjau semua proker dari seluruh bidang dan statusnya."
        />
      </div>

      {/* Overall progress card */}
      {!loading && prokerCount.total > 0 && (
        <div className="mt-10 glass rounded-2xl p-6 md:p-8">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-eyebrow mb-1">Progres Organisasi</p>
              <p className="text-4xl md:text-5xl font-black tabular-nums">
                {progressPct}
                <span className="text-2xl text-fg-muted">%</span>
              </p>
            </div>
            <p className="text-sm font-mono text-fg-muted">
              <TrendingUp size={14} className="inline mr-1 -mt-0.5" aria-hidden="true" />
              {prokerCount.terlaksana} / {prokerCount.total} proker selesai
            </p>
          </div>
          <div className="h-2 rounded-full overflow-hidden bg-white/10">
            <div
              className="h-full rounded-full transition-[width] duration-700 bg-gradient-to-r from-[color:var(--color-accent)] to-[color:var(--color-accent-secondary)]"
              // eslint-disable-next-line react/forbid-dom-props
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      )}
    </>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  desc,
}: {
  href: string;
  icon: typeof Users;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="group glass rounded-2xl p-6 flex items-center gap-5 hover:bg-glass-overlay transition-colors"
    >
      <span className="p-3 rounded-xl bg-[color:var(--color-accent)]/10">
        <Icon size={22} className="text-accent" aria-hidden="true" />
      </span>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold uppercase tracking-tight">{title}</h3>
        <p className="text-sm font-mono text-fg-muted mt-0.5">{desc}</p>
      </div>
      <ArrowRight
        size={18}
        className="text-fg-muted group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0"
        aria-hidden="true"
      />
    </Link>
  );
}
