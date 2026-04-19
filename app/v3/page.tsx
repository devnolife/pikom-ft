'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  Network, Users, FlaskConical, Flower2, Landmark,
  BookOpen, TrendingUp, HeartHandshake, Palette, Radio,
  ArrowRight, Calendar, MapPin, Mail, Instagram, ChevronRight,
  Menu, X, Quote, Award, Target, BookMarked, CheckCircle2,
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────

const navLinks = [
  { href: '#tentang', label: 'Tentang' },
  { href: '#program', label: 'Program' },
  { href: '#struktur', label: 'Struktur' },
  { href: '#bidang', label: 'Bidang' },
  { href: '#arsip', label: 'Arsip' },
  { href: '#kontak', label: 'Kontak' },
];

const pimpinanInti = [
  { title: 'Ketua Umum', role: 'Pimpinan Tertinggi', nama: 'Ahmad Fauzi', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=face' },
  { title: 'Sekretaris Umum', role: 'Administrasi & Operasional', nama: 'Rina Lestari', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&h=750&fit=crop&crop=face' },
  { title: 'Bendahara Umum', role: 'Manajemen Keuangan', nama: 'Dian Prasetyo', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&h=750&fit=crop&crop=face' },
  { title: 'Bendahara 1', role: 'Keuangan Internal', nama: 'Fitri Amalia', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&h=750&fit=crop&crop=face' },
  { title: 'Bendahara 2', role: 'Keuangan Eksternal', nama: 'Rizky Pratama', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=600&h=750&fit=crop&crop=face' },
];

const pengurusSebelumnya = [
  { periode: '2024–2025', ketua: 'Ahmad Fauzi' },
  { periode: '2023–2024', ketua: 'Muhammad Rizki' },
  { periode: '2022–2023', ketua: 'Andi Pratama' },
  { periode: '2021–2022', ketua: 'Ilham Saputra' },
];

const bidangData = [
  { name: 'Organisasi', slug: 'organisasi', icon: Network, desc: 'Konsolidasi struktur dan stabilitas organisasi.' },
  { name: 'Kader', slug: 'kader', icon: Users, desc: 'Penguatan tri-kompetensi dasar kader IMM.' },
  { name: 'Riset & Pengembangan', slug: 'riset-pengembangan', icon: FlaskConical, desc: 'Metodologi riset & sinergi keilmuan kader.' },
  { name: 'Immawati', slug: 'immawati', icon: Flower2, desc: 'Penguatan jati diri dan peran perempuan IMM.' },
  { name: 'Hikmah', slug: 'hikmah', icon: Landmark, desc: 'Sosial-politik, intelektualitas, kebangsaan.' },
  { name: 'Tabligh', slug: 'tabligh', icon: BookOpen, desc: 'Dakwah pencerahan dan kemakmuran masjid.' },
  { name: 'Ekonomi & Kewirausahaan', slug: 'ekonomi-kewirausahaan', icon: TrendingUp, desc: 'Kapasitas wirausaha dan kemandirian organisasi.' },
  { name: 'SPM', slug: 'spm', icon: HeartHandshake, desc: 'Pemberdayaan masyarakat akar rumput.' },
  { name: 'SBO', slug: 'sbo', icon: Palette, desc: 'Seni, budaya, dan olahraga sebagai dakwah.' },
  { name: 'Media & Komunikasi', slug: 'media-komunikasi', icon: Radio, desc: 'Sistem komunikasi & image organisasi.' },
];

const programUnggulan = [
  {
    badge: 'Pengkaderan',
    title: 'Darul Arqam Dasar (DAD)',
    desc: 'Program kaderisasi formal untuk membentuk kader IMM yang militan, intelektual, dan religius.',
    icon: Award,
  },
  {
    badge: 'Akademik',
    title: 'Forum Diskusi Mingguan',
    desc: 'Ruang dialektika lintas keilmuan teknik untuk mempertajam nalar kritis kader.',
    icon: BookMarked,
  },
  {
    badge: 'Sosial',
    title: 'Pengabdian Masyarakat',
    desc: 'Aksi nyata humanitas — bakti sosial, mengajar daerah 3T, dan kerja kemanusiaan.',
    icon: HeartHandshake,
  },
];

const galleryItems = [
  { src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&h=700&fit=crop', caption: 'Pelantikan Pengurus' },
  { src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=900&h=700&fit=crop', caption: 'Forum Diskusi Kader' },
  { src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900&h=700&fit=crop', caption: 'Pengabdian Masyarakat' },
  { src: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=900&h=700&fit=crop', caption: 'Rapat Kerja Tahunan' },
];

// ── Page ──────────────────────────────────────────────────────

export default function V3LandingPage() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('tentang');

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { threshold: 0.25, rootMargin: '-30% 0px -50% 0px' }
    );
    document.querySelectorAll('section[id]').forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <main>
      {/* ── Top bar ──────────────────────────────────────── */}
      <header className="v3-topbar sticky top-0 z-50">
        <div className="v3-container flex items-center justify-between gap-4 py-3.5">
          <Link href="/v3" className="flex items-center gap-3">
            <span className="v3-mark" aria-hidden />
            <div className="leading-tight">
              <p className="text-[10px] font-bold tracking-[0.18em] v3-c-ink-muted uppercase">
                IMM · Komisariat
              </p>
              <p className="text-base font-extrabold tracking-tight v3-c-ink">
                PIKOM Fakultas Teknik
              </p>
            </div>
          </Link>

          <nav aria-label="Navigasi" className="hidden lg:flex items-center gap-1">
            {navLinks.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={`px-3.5 py-2 rounded-full text-sm font-medium transition-colors ${active === l.href.replace('#', '')
                    ? 'v3-c-red v3-bg-red-tint'
                    : 'v3-c-ink-soft hover:v3-c-red hover:bg-[var(--v3-bg-soft)]'
                  }`}
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden lg:flex items-center gap-2">
            <Link href="/" className="v3-btn v3-btn-ghost text-xs">
              ↩ v1 Klasik
            </Link>
            <Link href="/login" className="v3-btn v3-btn-primary">
              Masuk Dashboard <ArrowRight size={14} strokeWidth={2.5} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg border v3-border hover:v3-bg-soft"
            aria-label={open ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={open ? 'true' : 'false'}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {open && (
          <div className="v3-drawer lg:hidden">
            <div className="v3-container py-4 flex flex-col gap-1">
              {navLinks.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium v3-c-ink-soft hover:v3-bg-soft"
                >
                  {l.label}
                </a>
              ))}
              <div className="flex gap-2 mt-2 pt-3 border-t v3-border">
                <Link href="/" className="v3-btn v3-btn-outline flex-1 justify-center text-xs">
                  v1 Klasik
                </Link>
                <Link href="/login" className="v3-btn v3-btn-primary flex-1 justify-center">
                  Masuk
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ═══════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden v3-section">
        <div className="v3-blob-red w-[420px] h-[420px] -top-32 -left-32" aria-hidden />
        <div className="v3-blob-yellow w-[380px] h-[380px] -bottom-32 -right-24" aria-hidden />

        <div className="v3-container relative">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Text */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7"
            >
              <div className="v3-ribbon mb-6">
                <span className="v3-ribbon-dot" />
                Periode Aktif 2025 – 2026
              </div>

              <h1 className="v3-display text-[clamp(2.4rem,5.5vw,4.25rem)] mb-6">
                Pimpinan Komisariat IMM<br />
                <span className="v3-c-red">Fakultas Teknik</span>
              </h1>

              <p className="text-lg v3-c-ink-soft leading-relaxed max-w-2xl mb-3">
                Organisasi mahasiswa Muhammadiyah otonom di lingkup Fakultas Teknik
                yang bergerak di bidang <span className="v3-highlight">keagamaan, kemahasiswaan, dan kemasyarakatan</span>.
              </p>
              <p className="v3-serif italic text-lg v3-c-ink-soft mb-10">
                &ldquo;Anggun dalam Moral, Unggul dalam Intelektual.&rdquo;
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <a href="#bidang" className="v3-btn v3-btn-primary">
                  Lihat 10 Bidang <ArrowRight size={16} strokeWidth={2.5} />
                </a>
                <a href="#tentang" className="v3-btn v3-btn-outline">
                  Tentang Kami
                </a>
              </div>

              {/* Trust strip */}
              <div className="mt-10 pt-8 border-t v3-border grid grid-cols-3 gap-6">
                {[
                  { v: '10', k: 'Bidang' },
                  { v: '120+', k: 'Kader Aktif' },
                  { v: '1964', k: 'Sejak' },
                ].map((s) => (
                  <div key={s.k}>
                    <p className="text-3xl md:text-4xl font-extrabold v3-c-ink tracking-tight">
                      {s.v}
                    </p>
                    <p className="text-xs font-medium v3-c-ink-muted uppercase tracking-wider mt-1">
                      {s.k}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden border v3-border-strong shadow-[0_24px_60px_-20px_rgba(15,23,42,0.25)]">
                <Image
                  src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&h=1125&fit=crop"
                  alt="Pengurus PIKOM Fakultas Teknik"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                  priority
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Floating stat tag */}
              <div className="absolute -bottom-5 -left-5 v3-card p-4 flex items-center gap-3 shadow-xl bg-white">
                <div className="w-10 h-10 rounded-full v3-bg-red grid place-items-center text-white">
                  <CheckCircle2 size={18} strokeWidth={2.5} />
                </div>
                <div>
                  <p className="text-xs v3-c-ink-muted">Status</p>
                  <p className="text-sm font-bold v3-c-ink">Resmi & Aktif</p>
                </div>
              </div>
              {/* Yellow accent square */}
              <div
                className="absolute -top-4 -right-4 w-20 h-20 rounded-2xl border-4 border-white shadow-md v3-yellow-square"
                aria-hidden
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Logo / partners ribbon ───────────────────────── */}
      <section className="v3-bg-soft border-y v3-border">
        <div className="v3-container py-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
          <p className="text-xs font-bold uppercase tracking-[0.2em] v3-c-ink-muted">
            Berafiliasi dengan
          </p>
          {['Muhammadiyah', 'IMM Pusat', 'DPD IMM', 'Universitas', 'Fakultas Teknik'].map((n) => (
            <span key={n} className="text-sm font-semibold v3-c-ink-soft">
              {n}
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          TENTANG
          ═══════════════════════════════════════════════════ */}
      <section id="tentang" className="v3-section">
        <div className="v3-container">
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-5">
              <p className="v3-eyebrow mb-4">Tentang Komisariat</p>
              <h2 className="v3-display text-3xl md:text-5xl mb-6">
                Membentuk akademisi Islam <span className="v3-c-red">berkarakter</span>.
              </h2>
              <p className="v3-c-ink-soft text-base leading-relaxed mb-6">
                Ikatan Mahasiswa Muhammadiyah (IMM) Pimpinan Komisariat Fakultas Teknik
                adalah organisasi mahasiswa otonom di bawah Muhammadiyah yang
                bergerak sejak 1964 di tiga ranah utama: keagamaan,
                kemahasiswaan, dan kemasyarakatan.
              </p>
              <div className="v3-quote">
                <Quote className="v3-c-red mb-2" size={20} strokeWidth={2} />
                <p className="v3-serif italic text-base leading-relaxed v3-c-ink-soft">
                  &ldquo;IMM untuk kemanusiaan, IMM untuk ilmu, IMM untuk agama.&rdquo;
                </p>
                <p className="text-xs v3-c-ink-muted font-medium mt-3">
                  — Falsafah Gerakan IMM
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Target,
                  label: 'Visi',
                  body: 'Terbentuknya akademisi Islam berkarakter yang menjalankan amal dakwah di tengah masyarakat.',
                },
                {
                  icon: Award,
                  label: 'Misi',
                  body: 'Membina keimanan, memperjuangkan keilmuan, dan menggerakkan kemanusiaan.',
                },
                {
                  icon: BookMarked,
                  label: 'Tri Kompetensi',
                  body: 'Religiusitas, intelektualitas, humanitas — tiga pilar utama kader IMM.',
                },
                {
                  icon: HeartHandshake,
                  label: 'Komitmen',
                  body: 'Menjawab tantangan zaman dengan basis iman, ilmu, dan aksi nyata.',
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.06, duration: 0.4 }}
                    className="v3-card p-6 flex flex-col gap-3"
                  >
                    <div className="w-11 h-11 rounded-xl v3-bg-red-tint v3-c-red grid place-items-center">
                      <Icon size={20} strokeWidth={2} />
                    </div>
                    <p className="text-base font-bold v3-c-ink">{item.label}</p>
                    <p className="text-sm v3-c-ink-soft leading-relaxed">{item.body}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          PROGRAM UNGGULAN
          ═══════════════════════════════════════════════════ */}
      <section id="program" className="v3-section v3-bg-soft border-y v3-border">
        <div className="v3-container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="v3-eyebrow justify-center mb-4">Program Unggulan</p>
            <h2 className="v3-display text-3xl md:text-5xl mb-4">
              Tiga ranah <span className="v3-c-red">aksi</span> kami.
            </h2>
            <p className="v3-c-ink-soft">
              Setiap program dijalankan kolaboratif lintas bidang untuk
              membentuk kader yang utuh.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {programUnggulan.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.article
                  key={p.title}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="v3-card v3-card-interactive p-7 flex flex-col gap-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="w-12 h-12 rounded-xl v3-bg-red text-white grid place-items-center">
                      <Icon size={22} strokeWidth={2} />
                    </div>
                    <span className="v3-badge v3-badge-yellow">{p.badge}</span>
                  </div>
                  <h3 className="text-xl font-bold v3-c-ink leading-tight">{p.title}</h3>
                  <p className="text-sm v3-c-ink-soft leading-relaxed">{p.desc}</p>
                  <a href="#kontak" className="v3-link text-sm inline-flex items-center gap-1.5 mt-2 self-start">
                    Pelajari lebih <ChevronRight size={14} />
                  </a>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          STRUKTUR — Pimpinan Inti
          ═══════════════════════════════════════════════════ */}
      <section id="struktur" className="v3-section">
        <div className="v3-container">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="v3-eyebrow mb-4">Struktur Kepengurusan</p>
              <h2 className="v3-display text-3xl md:text-5xl">
                Pimpinan <span className="v3-c-red">Inti</span>.
              </h2>
            </div>
            <p className="text-sm v3-c-ink-muted max-w-md">
              Periode 2025 – 2026 · Dipimpin oleh Ketua Umum, didampingi
              Sekretaris dan tiga Bendahara.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
            {pimpinanInti.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="v3-leader"
              >
                <div className="v3-leader-photo">
                  <Image
                    src={p.img}
                    alt={p.nama}
                    fill
                    sizes="(max-width: 1024px) 50vw, 20vw"
                    className="object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {i === 0 && (
                    <span className="absolute top-3 left-3 v3-badge v3-badge-red">
                      Ketua Umum
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-bold uppercase tracking-wider v3-c-red mb-1">
                    {p.title}
                  </p>
                  <p className="text-base font-bold v3-c-ink leading-tight">
                    {p.nama}
                  </p>
                  <p className="text-xs v3-c-ink-muted mt-1.5">{p.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          BIDANG (10)
          ═══════════════════════════════════════════════════ */}
      <section id="bidang" className="v3-section v3-bg-soft border-y v3-border">
        <div className="v3-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="v3-eyebrow justify-center mb-4">Sepuluh Bidang Garapan</p>
            <h2 className="v3-display text-3xl md:text-5xl mb-4">
              Bidang <span className="v3-c-red">Organisasi</span>.
            </h2>
            <p className="v3-c-ink-soft">
              Setiap bidang dipimpin oleh Ketua Bidang, dibantu Sekretaris,
              dan menaungi departemen-departemen spesifik.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {bidangData.map((b, i) => {
              const Icon = b.icon;
              return (
                <motion.div
                  key={b.slug}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ delay: (i % 5) * 0.05, duration: 0.4 }}
                >
                  <Link
                    href={`/bidang/${b.slug}`}
                    className="v3-bidang-card group"
                    aria-label={`Bidang ${b.name}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="v3-bidang-card-icon">
                        <Icon size={20} strokeWidth={2} />
                      </div>
                      <span className="text-xs font-mono v3-c-ink-muted">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <h3 className="text-base font-bold v3-c-ink leading-tight">
                      {b.name}
                    </h3>
                    <p className="text-sm v3-c-ink-soft leading-relaxed flex-1">
                      {b.desc}
                    </p>
                    <span className="text-xs font-semibold v3-c-red inline-flex items-center gap-1 group-hover:gap-2 transition-all mt-1">
                      Detail bidang <ArrowRight size={12} strokeWidth={2.5} />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          GALERI KEGIATAN
          ═══════════════════════════════════════════════════ */}
      <section className="v3-section">
        <div className="v3-container">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-10">
            <div>
              <p className="v3-eyebrow mb-4">Dokumentasi</p>
              <h2 className="v3-display text-3xl md:text-5xl">
                Galeri <span className="v3-c-red">Kegiatan</span>.
              </h2>
            </div>
            <a href="#kontak" className="v3-link text-sm inline-flex items-center gap-1.5">
              Lihat semua dokumentasi <ChevronRight size={14} />
            </a>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {galleryItems.map((g, i) => (
              <motion.figure
                key={g.caption}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
                className="group relative overflow-hidden rounded-xl border v3-border bg-white"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={g.src}
                    alt={g.caption}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <figcaption className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/70 to-transparent text-white text-sm font-medium">
                  {g.caption}
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ARSIP / PENGURUS SEBELUMNYA
          ═══════════════════════════════════════════════════ */}
      <section id="arsip" className="v3-section v3-bg-soft border-y v3-border">
        <div className="v3-container">
          <div className="grid lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5">
              <p className="v3-eyebrow mb-4">Jejak Kepengurusan</p>
              <h2 className="v3-display text-3xl md:text-5xl mb-5">
                Estafet <span className="v3-c-red">kepemimpinan</span>.
              </h2>
              <p className="v3-c-ink-soft leading-relaxed">
                Daftar Ketua Umum PIKOM Fakultas Teknik dari periode ke periode —
                mata rantai amanah yang terus berlanjut.
              </p>
            </div>

            <div className="lg:col-span-7 flex flex-col gap-3">
              {pengurusSebelumnya.map((p, i) => (
                <motion.div
                  key={p.periode}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06, duration: 0.4 }}
                  className="v3-period"
                >
                  <span className="v3-badge">{p.periode}</span>
                  <div>
                    <p className="text-base font-bold v3-c-ink">{p.ketua}</p>
                    <p className="text-xs v3-c-ink-muted">Ketua Umum</p>
                  </div>
                  <Calendar size={18} className="v3-c-ink-muted" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          CTA + KONTAK
          ═══════════════════════════════════════════════════ */}
      <section id="kontak" className="v3-section">
        <div className="v3-container">
          <div className="relative overflow-hidden rounded-3xl v3-bg-red text-white p-10 md:p-16">
            <div
              className="absolute -top-20 -right-20 w-64 h-64 rounded-full v3-cta-blob-yellow"
              aria-hidden
            />
            <div
              className="absolute -bottom-32 -left-20 w-80 h-80 rounded-full v3-cta-blob-white"
              aria-hidden
            />

            <div className="relative grid lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-7">
                <p className="text-xs font-bold uppercase tracking-[0.2em] v3-c-yellow mb-4 inline-flex items-center gap-2">
                  <span className="w-7 h-[2px] bg-current" />
                  Bergabung
                </p>
                <h2 className="v3-display text-3xl md:text-5xl text-white mb-5">
                  Siap <span className="v3-c-yellow">bergerak</span>?<br />
                  Bersama IMM Fakultas Teknik.
                </h2>
                <p className="text-white/80 leading-relaxed max-w-xl mb-8">
                  Jadilah bagian dari kader yang dibina untuk berintelektual,
                  berhumanitas, dan beraqidah kuat.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link href="/login" className="v3-btn v3-btn-yellow">
                    Masuk Dashboard <ArrowRight size={16} strokeWidth={2.5} />
                  </Link>
                  <a href="#tentang" className="v3-btn bg-white/10 text-white border border-white/20 hover:bg-white/20">
                    Tentang Lebih Lanjut
                  </a>
                </div>
              </div>

              <div className="lg:col-span-5 grid gap-3">
                {[
                  { icon: MapPin, label: 'Alamat', body: 'Sekretariat IMM, Gedung FT Lt. 2' },
                  { icon: Mail, label: 'Email', body: 'pikom.ft@imm.id' },
                  { icon: Instagram, label: 'Instagram', body: '@imm_fakultasteknik' },
                ].map((c) => {
                  const Icon = c.icon;
                  return (
                    <div
                      key={c.label}
                      className="flex items-center gap-4 p-4 rounded-xl bg-white/10 border border-white/15"
                    >
                      <div className="w-10 h-10 rounded-lg v3-bg-yellow-tint v3-c-red grid place-items-center shrink-0">
                        <Icon size={18} strokeWidth={2} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider v3-c-yellow">
                          {c.label}
                        </p>
                        <p className="text-sm font-semibold text-white truncate">
                          {c.body}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════ */}
      <footer className="border-t v3-border">
        <div className="v3-container py-12 grid md:grid-cols-12 gap-8">
          <div className="md:col-span-5">
            <Link href="/v3" className="flex items-center gap-3 mb-4">
              <span className="v3-mark" aria-hidden />
              <div className="leading-tight">
                <p className="text-[10px] font-bold tracking-[0.18em] v3-c-ink-muted uppercase">
                  IMM · Komisariat
                </p>
                <p className="text-base font-extrabold v3-c-ink">
                  PIKOM Fakultas Teknik
                </p>
              </div>
            </Link>
            <p className="text-sm v3-c-ink-soft leading-relaxed max-w-md">
              Pimpinan Komisariat Ikatan Mahasiswa Muhammadiyah di lingkup
              Fakultas Teknik. Periode 2025 – 2026.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="text-xs font-bold uppercase tracking-wider v3-c-ink-muted mb-4">
              Navigasi
            </p>
            <ul className="space-y-2">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm v3-c-ink-soft hover:v3-c-red">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-4">
            <p className="text-xs font-bold uppercase tracking-wider v3-c-ink-muted mb-4">
              Edisi Lain
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="v3-c-ink-soft hover:v3-c-red">
                  ↩ Edisi v1 — Klasik (Maroon Glass)
                </Link>
              </li>
              <li>
                <Link href="/v2" className="v3-c-ink-soft hover:v3-c-red">
                  ↩ Edisi v2 — Manifesto Editorial
                </Link>
              </li>
              <li>
                <Link href="/login" className="v3-c-red font-semibold hover:underline">
                  → Masuk Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t v3-border">
          <div className="v3-container py-5 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-xs v3-c-ink-muted">
              © 2026 PIKOM Teknik · Ikatan Mahasiswa Muhammadiyah
            </p>
            <p className="text-xs v3-c-ink-muted">
              Edisi v3 · Clean Campus Organization
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
