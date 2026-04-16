'use client';

import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowLeft, CheckCircle, Clock, Sun, Moon, SwatchBook } from 'lucide-react';
import { bidangDetail } from '../../data/bidang';
import { useTheme, themeKeys, themeLabels, type ThemeKey } from '../../theme-provider';

const themeIcons: Record<ThemeKey, typeof Sun> = { classic: SwatchBook, light: Sun, dark: Moon };

export default function BidangPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { theme, colors, setTheme } = useTheme();
  const bidang = bidangDetail.find((b) => b.slug === slug);

  if (!bidang) {
    return (
      <div className="min-h-screen flex items-center justify-center grain" style={{ backgroundColor: colors.bg, color: colors.text }}>
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Bidang tidak ditemukan</h1>
          <Link href="/#bidang" className="hover:underline font-mono text-sm" style={{ color: colors.accent }}>
            &larr; Kembali ke halaman utama
          </Link>
        </div>
      </div>
    );
  }

  const Icon = bidang.icon;
  const totalProker = bidang.prokerDirencanakan.length + bidang.prokerTerlaksana.length;
  const progressPercent = Math.round((bidang.prokerTerlaksana.length / totalProker) * 100);
  const ThemeIcon = themeIcons[theme];

  return (
    <div className="min-h-screen font-sans overflow-x-hidden grain transition-colors duration-500"
      style={{ backgroundColor: colors.bg, color: colors.text }}>

      {/* Back Nav */}
      <nav className="fixed top-0 w-full z-50 py-4 px-6 md:px-16 glass-strong shadow-lg shadow-black/20">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/#bidang" className="flex items-center gap-3 text-sm font-mono transition-colors" style={{ color: colors.textSecondary }}>
            <ArrowLeft size={16} />
            <span>Kembali</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono uppercase tracking-[0.2em]" style={{ color: colors.textMuted }}>
              Bidang {bidang.name}
            </span>
            <button
              onClick={() => { const next = themeKeys[(themeKeys.indexOf(theme) + 1) % themeKeys.length]; setTheme(next); }}
              className="glass p-2 rounded-full transition-all hover:scale-110" aria-label="Ganti tema">
              <ThemeIcon size={14} />
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 md:px-16 relative">
        <div className="absolute top-1/4 right-10 w-72 h-72 rounded-full filter blur-[120px] opacity-15"
          style={{ background: `linear-gradient(to bottom right, ${colors.accent}, ${colors.accentSecondary})` }} />
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="p-4 glass rounded-xl w-fit mb-6">
              <Icon size={32} style={{ color: colors.accent }} />
            </div>
            <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase mb-4">
              Bidang <span className="text-gradient">{bidang.name}</span>
            </h1>
            <p className="font-mono max-w-3xl leading-relaxed text-sm md:text-base" style={{ color: colors.textSecondary }}>
              {bidang.desc}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pengurus */}
      <section className="py-16 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-3xl md:text-4xl font-bold tracking-tighter uppercase mb-10">
            Pengurus <span className="text-gradient">Bidang</span>
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {/* Ketua */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="glass rounded-2xl overflow-hidden group">
              <div className="relative h-64 md:h-72">
                <Image src={bidang.ketua.img} alt={bidang.ketua.nama} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${colors.cardOverlay}, ${colors.cardOverlay}66, transparent)` }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] mb-1 block" style={{ color: colors.accent }}>Ketua Bidang</span>
                  <h3 className="text-xl font-bold">{bidang.ketua.nama}</h3>
                </div>
              </div>
            </motion.div>

            {/* Sekretaris */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="glass rounded-2xl overflow-hidden group">
              <div className="relative h-64 md:h-72">
                <Image src={bidang.sekretaris.img} alt={bidang.sekretaris.nama} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${colors.cardOverlay}, ${colors.cardOverlay}66, transparent)` }} />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] mb-1 block" style={{ color: colors.accent }}>Sekretaris Bidang</span>
                  <h3 className="text-xl font-bold">{bidang.sekretaris.nama}</h3>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Anggota */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6 md:p-8">
            <h4 className="text-sm font-mono uppercase tracking-[0.2em] mb-4" style={{ color: colors.textMuted }}>Anggota</h4>
            <div className="flex flex-wrap gap-3">
              {bidang.anggota.map((nama, i) => (
                <span key={i} className="glass px-4 py-2 rounded-full text-sm font-mono" style={{ color: colors.textSecondary }}>
                  {nama}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Program Kerja */}
      <section className="py-16 px-6 md:px-16 pb-32">
        <div className="max-w-6xl mx-auto">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} className="text-3xl md:text-4xl font-bold tracking-tighter uppercase mb-4">
            Program <span className="text-gradient">Kerja</span>
          </motion.h2>

          {/* Progress bar */}
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mb-10">
            <div className="flex justify-between text-[11px] font-mono uppercase tracking-widest mb-2" style={{ color: colors.textMuted }}>
              <span>Progress</span>
              <span>{progressPercent}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ backgroundColor: `${colors.text}1A` }}>
              <motion.div initial={{ width: 0 }} whileInView={{ width: `${progressPercent}%` }}
                viewport={{ once: true }} transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full rounded-full" style={{ background: `linear-gradient(to right, ${colors.accent}, ${colors.accentSecondary})` }} />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Terlaksana */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <CheckCircle size={18} className="text-green-400" />
                <h4 className="text-sm font-mono uppercase tracking-[0.2em] text-green-400">Terlaksana</h4>
              </div>
              <ul className="space-y-3">
                {bidang.prokerTerlaksana.map((item, i) => (
                  <li key={i} className="flex items-start gap-3" style={{ color: colors.textSecondary }}>
                    <span className="mt-1.5 w-2 h-2 rounded-full bg-green-400 shrink-0" />
                    <span className="text-sm font-mono">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Direncanakan */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: 0.2 }}
              className="glass rounded-2xl p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <Clock size={18} style={{ color: colors.accent }} />
                <h4 className="text-sm font-mono uppercase tracking-[0.2em]" style={{ color: colors.accent }}>Direncanakan</h4>
              </div>
              <ul className="space-y-3">
                {bidang.prokerDirencanakan.map((item, i) => (
                  <li key={i} className="flex items-start gap-3" style={{ color: colors.textMuted }}>
                    <span className="mt-1.5 w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: `${colors.accent}80` }} />
                    <span className="text-sm font-mono">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mini Footer */}
      <footer className="py-8 px-6 md:px-16 text-center" style={{ borderTop: `1px solid ${colors.border}`, backgroundColor: colors.bgAlt }}>
        <p className="text-[11px] font-mono uppercase tracking-widest" style={{ color: colors.textMuted }}>
          &copy; 2026 PIKOM TEKNIK IMM — Bidang {bidang.name}
        </p>
      </footer>
    </div>
  );
}
