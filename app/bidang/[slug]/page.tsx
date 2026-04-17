'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, Home, ChevronRight, Users } from 'lucide-react';

import { bidangDetail } from '../../data/bidang';
import { BackButton } from '@/components/landing/back-button';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { DecorativeBlobs } from '@/components/landing/decorative-blobs';
import { EmptyState } from '@/components/ui/empty-state';
import { CommandPalette } from '@/components/landing/command-palette';

export default function BidangPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const bidang = bidangDetail.find((b) => b.slug === slug);

  if (!bidang) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg text-fg px-6">
        <div className="text-center max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight">
            Bidang tidak ditemukan
          </h1>
          <p className="text-sm font-mono text-fg-muted mb-8">
            Slug <code className="text-accent">{slug}</code> tidak cocok
            dengan bidang manapun.
          </p>
          <Link
            href="/#bidang"
            className="inline-flex items-center gap-2 glass px-6 py-3 rounded-full uppercase text-[11px] font-bold tracking-[0.2em] hover:bg-white/10 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const Icon = bidang.icon;
  const totalProker = bidang.prokerDirencanakan.length + bidang.prokerTerlaksana.length;
  const progressPercent =
    totalProker === 0 ? 0 : Math.round((bidang.prokerTerlaksana.length / totalProker) * 100);

  return (
    <div className="min-h-screen bg-bg text-fg overflow-x-hidden">
      <CommandPalette />
      {/* ─── Sticky top bar ─── */}
      <nav
        className="sticky top-0 z-40 backdrop-blur-xl border-b border-border"
        aria-label="Navigasi halaman bidang"
      >
        <div className="mx-auto max-w-6xl px-6 md:px-10 lg:px-16 py-4 flex items-center justify-between gap-4">
          <BackButton href="/#bidang" label="Kembali ke Bidang" />
          <div className="flex items-center gap-3">
            <span className="hidden md:inline text-label">
              Bidang {bidang.name}
            </span>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative px-6 md:px-10 lg:px-16 pt-16 md:pt-24 pb-16 md:pb-20">
        <DecorativeBlobs variant="minimal" />
        <div className="mx-auto max-w-5xl relative z-10">
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-label mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-1 hover:text-accent transition-colors"
            >
              <Home size={12} />
              Beranda
            </Link>
            <ChevronRight size={12} />
            <Link href="/#bidang" className="hover:text-accent transition-colors">
              Bidang
            </Link>
            <ChevronRight size={12} />
            <span className="text-accent">{bidang.name}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ viewTransitionName: `bidang-card-${slug}` }}
          >
            <div className="inline-flex p-5 rounded-full glass-strong mb-6">
              <Icon size={32} className="text-accent" aria-hidden="true" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter uppercase mb-5 leading-[1.02]">
              Bidang <span className="text-gold">{bidang.name}</span>
            </h1>
            <p className="text-base md:text-lg font-mono leading-relaxed text-fg-secondary max-w-3xl">
              {bidang.desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ─── Pengurus ─── */}
      <section className="px-6 md:px-10 lg:px-16 py-16 md:py-20 border-t border-border">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10">
            <span className="text-eyebrow">Struktur Bidang</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tighter uppercase">
              Pengurus <span className="text-gold">Bidang</span>
            </h2>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6 mb-8">
            {[
              { role: 'Ketua Bidang', person: bidang.ketua },
              { role: 'Sekretaris Bidang', person: bidang.sekretaris },
            ].map((item, i) => (
              <motion.div
                key={item.role}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group glass rounded-2xl overflow-hidden relative aspect-[5/4]"
              >
                <Image
                  src={item.person.img}
                  alt={item.person.nama}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0"
                  style={{
                    background:
                      'linear-gradient(to top, var(--color-card-overlay), rgba(0,0,0,0.3) 35%, transparent 65%)',
                  }}
                />
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-6">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent block mb-2">
                    {item.role}
                  </span>
                  <h3 className="text-xl md:text-2xl font-bold leading-tight">
                    {item.person.nama}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Anggota */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="glass rounded-2xl p-6 md:p-8"
          >
            <header className="flex items-center gap-3 mb-5">
              <Users size={16} className="text-accent" aria-hidden="true" />
              <h3 className="text-label text-fg-muted">
                Anggota ({bidang.anggota.length})
              </h3>
            </header>
            {bidang.anggota.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Belum ada anggota"
                description="Data anggota bidang ini belum tercatat."
              />
            ) : (
              <ul className="flex flex-wrap gap-2">
                {bidang.anggota.map((nama) => (
                  <li
                    key={nama}
                    className="glass px-4 py-2 rounded-full text-sm font-mono text-fg-secondary"
                  >
                    {nama}
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </section>

      {/* ─── Program Kerja ─── */}
      <section className="px-6 md:px-10 lg:px-16 py-16 md:py-20 border-t border-border bg-bg-alt">
        <div className="mx-auto max-w-6xl">
          <header className="mb-10">
            <span className="text-eyebrow">Progres Kerja</span>
            <h2 className="mt-3 text-3xl md:text-4xl font-bold tracking-tighter uppercase">
              Program <span className="text-gold">Kerja</span>
            </h2>
          </header>

          {/* Progress summary */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            className="glass rounded-2xl p-6 md:p-8 mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-5">
              <div>
                <p className="text-label mb-2">Capaian Periode</p>
                <p className="text-5xl md:text-6xl font-black text-gold tabular-nums">
                  {progressPercent}%
                </p>
              </div>
              <div className="grid grid-cols-3 gap-6 text-sm font-mono">
                <div>
                  <p className="text-fg-muted text-xs uppercase tracking-wider mb-1">
                    Total
                  </p>
                  <p className="text-2xl font-bold tabular-nums">{totalProker}</p>
                </div>
                <div>
                  <p className="text-fg-muted text-xs uppercase tracking-wider mb-1">
                    Selesai
                  </p>
                  <p className="text-2xl font-bold tabular-nums text-green-500">
                    {bidang.prokerTerlaksana.length}
                  </p>
                </div>
                <div>
                  <p className="text-fg-muted text-xs uppercase tracking-wider mb-1">
                    Rencana
                  </p>
                  <p className="text-2xl font-bold tabular-nums text-accent">
                    {bidang.prokerDirencanakan.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="h-2.5 rounded-full overflow-hidden bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${progressPercent}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: 'easeOut' }}
                className="h-full rounded-full"
                style={{
                  background:
                    'linear-gradient(to right, var(--color-accent), var(--color-accent-secondary))',
                }}
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* Terlaksana */}
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              <header className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <CheckCircle2 size={16} className="text-green-500" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-green-500">
                  Terlaksana ({bidang.prokerTerlaksana.length})
                </h3>
              </header>
              {bidang.prokerTerlaksana.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="Belum ada yang terlaksana"
                  description="Program kerja yang selesai akan tampil di sini."
                  className="py-8"
                />
              ) : (
                <ul className="space-y-3">
                  {bidang.prokerTerlaksana.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                      <span className="text-sm font-mono leading-relaxed text-fg-secondary">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.article>

            {/* Direncanakan */}
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ delay: 0.15 }}
              className="glass rounded-2xl p-6 md:p-8"
            >
              <header className="flex items-center gap-3 mb-5">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Clock size={16} className="text-accent" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-mono uppercase tracking-[0.2em] text-accent">
                  Direncanakan ({bidang.prokerDirencanakan.length})
                </h3>
              </header>
              {bidang.prokerDirencanakan.length === 0 ? (
                <EmptyState
                  icon={Clock}
                  title="Tidak ada rencana"
                  description="Program kerja yang direncanakan akan tampil di sini."
                  className="py-8"
                />
              ) : (
                <ul className="space-y-3">
                  {bidang.prokerDirencanakan.map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/80 shrink-0" />
                      <span className="text-sm font-mono leading-relaxed text-fg-muted">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.article>
          </div>
        </div>
      </section>

      {/* ─── Mini Footer ─── */}
      <footer className="border-t border-border py-8 px-6 md:px-10 lg:px-16 text-center">
        <p className="text-label">
          &copy; 2026 PIKOM TEKNIK IMM — Bidang {bidang.name}
        </p>
      </footer>
    </div>
  );
}
