'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import {
  Network, Users, FlaskConical, Flower2, Landmark,
  BookOpen, TrendingUp, HeartHandshake, Palette, Radio,
  ArrowUpRight, ArrowDown, Star,
} from 'lucide-react';

// ── Data ──────────────────────────────────────────────────────

const pimpinanInti = [
  { title: 'Ketua Umum', role: 'Pimpinan Tertinggi', nama: 'Ahmad Fauzi', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=1000&fit=crop&crop=face' },
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
  { name: 'Organisasi', slug: 'organisasi', icon: Network, kicker: 'Konsolidasi & Stabilitas' },
  { name: 'Kader', slug: 'kader', icon: Users, kicker: 'Tri-Kompetensi Dasar' },
  { name: 'Riset & Pengembangan', slug: 'riset-pengembangan', icon: FlaskConical, kicker: 'Metodologi & Sinergi Keilmuan' },
  { name: 'Immawati', slug: 'immawati', icon: Flower2, kicker: 'Jati Diri & Keadilan Gender' },
  { name: 'Hikmah', slug: 'hikmah', icon: Landmark, kicker: 'Sosial-Politik Kebangsaan' },
  { name: 'Tabligh', slug: 'tabligh', icon: BookOpen, kicker: 'Dakwah Pencerahan' },
  { name: 'Ekonomi & Kewirausahaan', slug: 'ekonomi-kewirausahaan', icon: TrendingUp, kicker: 'Kemandirian Organisasi' },
  { name: 'SPM', slug: 'spm', icon: HeartHandshake, kicker: 'Pemberdayaan Akar Rumput' },
  { name: 'SBO', slug: 'sbo', icon: Palette, kicker: 'Seni, Budaya, Olahraga' },
  { name: 'Media & Komunikasi', slug: 'media-komunikasi', icon: Radio, kicker: 'Sistem Komunikasi & Image' },
];

const railSections = [
  { id: 'manifesto', label: '№ 01 · Manifesto' },
  { id: 'tentang', label: '№ 02 · Tentang' },
  { id: 'struktur', label: '№ 03 · Struktur' },
  { id: 'bidang', label: '№ 04 · Bidang' },
  { id: 'arsip', label: '№ 05 · Arsip' },
];

const marqueeWords = [
  'ANGGUN DALAM MORAL',
  'UNGGUL DALAM INTELEKTUAL',
  'FIASTABIQUL KHAIRAT',
  'IKATAN MAHASISWA MUHAMMADIYAH',
  'FAKULTAS TEKNIK',
  'PERIODE 2025 — 2026',
];

// ── Page ──────────────────────────────────────────────────────

export default function V2LandingPage() {
  const [active, setActive] = useState('manifesto');
  const { scrollYProgress } = useScroll();
  const heroParallax = useTransform(scrollYProgress, [0, 0.2], [0, -60]);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { threshold: 0.3, rootMargin: '-30% 0px -50% 0px' }
    );
    document.querySelectorAll('section[id]').forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, []);

  return (
    <main className="v2-root-page">
      {/* ── Vertical chapter rail ─────────────────────────── */}
      <nav aria-label="Bab" className="v2-rail">
        <div className="flex flex-col">
          {railSections.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              data-active={active === s.id}
              className="v2-rail-link"
            >
              {s.label}
            </a>
          ))}
        </div>
      </nav>

      {/* ── Top masthead ──────────────────────────────────── */}
      <header className="border-b border-[var(--v2-rule-strong)] sticky top-0 bg-[var(--v2-paper)]/90 backdrop-blur-md z-40">
        <div className="mx-auto max-w-7xl px-6 md:px-12 py-4 flex items-center justify-between gap-6">
          <Link href="/v2" className="flex items-center gap-3">
            <div className="v2-spin-slow">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="var(--v2-ink)" strokeWidth="1" />
                <path d="M16 1 L16 31 M1 16 L31 16" stroke="var(--v2-ink)" strokeWidth="0.5" />
                <circle cx="16" cy="16" r="6" fill="var(--v2-maroon)" />
                <circle cx="16" cy="16" r="2" fill="var(--v2-gold)" />
              </svg>
            </div>
            <div className="leading-tight">
              <p className="v2-mono text-[10px] uppercase tracking-[0.32em] text-[var(--v2-ink-soft)]">PIKOM · IMM · FT</p>
              <p className="v2-serif text-base font-bold tracking-tight v2-opsz-96-wonk">
                The Manifesto
              </p>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <span className="v2-mono text-[10px] uppercase tracking-[0.32em] text-[var(--v2-ink-soft)]">
              Vol. I · Edisi v2 · April 2026
            </span>
            <Link href="/" className="v2-mono text-[10px] uppercase tracking-[0.28em] underline decoration-[var(--v2-gold)] decoration-2 underline-offset-4 hover:text-[var(--v2-maroon)]">
              ↩ Edisi Klasik
            </Link>
            <Link href="/login" className="v2-btn v2-btn-ghost text-[10px] !py-2 !px-4">
              Login
            </Link>
          </div>

          <Link href="/" className="md:hidden v2-mono text-[10px] uppercase tracking-[0.28em] underline">
            ↩
          </Link>
        </div>
      </header>

      {/* ═══════════════════════════════════════════════════════
          № 01 — MANIFESTO HERO
          ═══════════════════════════════════════════════════════ */}
      <section id="manifesto" className="relative px-6 md:px-12 pt-12 md:pt-20 pb-24 md:pb-32">
        <div className="mx-auto max-w-7xl">
          {/* Top metadata strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-8 mb-12 border-b border-[var(--v2-rule-strong)]">
            <div>
              <p className="v2-label">Edisi</p>
              <p className="v2-mono text-sm font-semibold mt-1">№ 01 / 2026</p>
            </div>
            <div>
              <p className="v2-label">Periode</p>
              <p className="v2-mono text-sm font-semibold mt-1">2025 — 2026</p>
            </div>
            <div>
              <p className="v2-label">Lokus</p>
              <p className="v2-mono text-sm font-semibold mt-1">Fakultas Teknik</p>
            </div>
            <div className="text-right">
              <p className="v2-label">Tanggal</p>
              <p className="v2-mono text-sm font-semibold mt-1">19.04.2026</p>
            </div>
          </div>

          {/* Hero grid */}
          <div className="grid lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left: Display headline */}
            <motion.div
              style={{ y: heroParallax }}
              className="lg:col-span-7 relative"
            >
              <p className="v2-eyebrow mb-6">№ 01 — Manifesto Komisariat</p>

              <h1 className="v2-display text-[clamp(3.5rem,11vw,9rem)] mb-2">
                Pikom
              </h1>
              <h1 className="v2-display text-[clamp(3.5rem,11vw,9rem)] mb-2 italic v2-c-maroon">
                Teknik
              </h1>
              <h1 className="v2-display text-[clamp(3.5rem,11vw,9rem)] mb-8">
                <span className="v2-highlight">IMM.</span>
              </h1>

              <div className="grid md:grid-cols-[auto_1fr] gap-6 max-w-2xl">
                <div className="v2-stamp shrink-0">
                  <div>
                    <p className="v2-mono text-[8px] tracking-[0.2em] leading-tight">SAH</p>
                    <p className="v2-mono text-[8px] tracking-[0.2em] leading-tight">2025</p>
                    <p className="v2-mono text-[8px] tracking-[0.2em] leading-tight">— 2026</p>
                  </div>
                </div>
                <p className="v2-serif text-lg md:text-xl leading-snug v2-opsz-24">
                  Sebuah ikhtiar pengkaderan mahasiswa muslim di lingkup Fakultas Teknik —
                  membangun kader berintelektual, berhumanitas, dan beraqidah kuat.
                </p>
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-4">
                <a href="#struktur" className="v2-btn">
                  Telusuri Struktur <ArrowUpRight size={14} strokeWidth={2.5} />
                </a>
                <a href="#bidang" className="v2-btn v2-btn-ghost">
                  10 Bidang
                </a>
              </div>
            </motion.div>

            {/* Right: Polaroid + meta */}
            <div className="lg:col-span-5 space-y-6">
              <div className="v2-polaroid mx-auto max-w-sm">
                <div className="v2-tape" />
                <div className="relative aspect-[4/5] overflow-hidden bg-[var(--v2-paper-deep)]">
                  <Image
                    src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=900&h=1125&fit=crop"
                    alt="Pelantikan pengurus PIKOM FT"
                    fill
                    className="object-cover grayscale-[40%] sepia-[15%]"
                    sizes="(max-width: 1024px) 100vw, 35vw"
                    priority
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 v2-photo-warm-overlay" />
                </div>
                <p className="v2-mono text-[10px] tracking-[0.18em] mt-3 text-center text-[var(--v2-ink-soft)] uppercase">
                  Pelantikan · Aula FT · 12.10.2025
                </p>
              </div>

              {/* Vertical 3-stat block */}
              <div className="border border-[var(--v2-ink)] bg-[var(--v2-paper-soft)]">
                <div className="grid grid-cols-3 divide-x divide-[var(--v2-ink)]">
                  {[
                    { k: 'Sejak', v: '1964' },
                    { k: 'Bidang', v: '10' },
                    { k: 'Kader', v: '120+' },
                  ].map((s) => (
                    <div key={s.k} className="px-3 py-4 text-center">
                      <p className="v2-label">{s.k}</p>
                      <p className="v2-numeral text-[clamp(2rem,4vw,3rem)] mt-1">{s.v}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="mt-16 flex items-center gap-3 v2-mono text-[10px] uppercase tracking-[0.32em] text-[var(--v2-ink-soft)]">
            <ArrowDown size={14} className="animate-bounce" />
            <span>Lanjutkan membaca</span>
            <div className="flex-1 h-px bg-[var(--v2-rule)]" />
          </div>
        </div>
      </section>

      {/* ── Marquee ribbon ────────────────────────────────── */}
      <section className="v2-ink-block border-y-2 border-[var(--v2-ink)] py-5 overflow-hidden">
        <div className="v2-marquee-track v2-mono text-sm md:text-base uppercase tracking-[0.3em] font-semibold">
          {[...Array(2)].map((_, ri) => (
            <div key={ri} className="inline-flex gap-12 items-center pr-12">
              {marqueeWords.map((w, i) => (
                <span key={`${ri}-${i}`} className="inline-flex items-center gap-12">
                  {w}
                  <Star size={12} className="text-[var(--v2-gold)]" fill="currentColor" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          № 02 — TENTANG (editorial 2-col)
          ═══════════════════════════════════════════════════════ */}
      <section id="tentang" className="px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="v2-section-head mb-16">
            <p className="v2-section-num">№02</p>
            <div>
              <p className="v2-eyebrow mb-3">Tentang Komisariat</p>
              <h2 className="v2-section-title">
                Anggun dalam Moral, <br />
                <em className="italic v2-c-maroon">Unggul dalam Intelektual.</em>
              </h2>
            </div>
            <p className="v2-mono text-[10px] uppercase tracking-[0.28em] text-[var(--v2-ink-soft)] md:text-right">
              Bab II ·<br />Halaman 02
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Drop-cap article */}
            <article className="lg:col-span-7 v2-serif text-[1.08rem] leading-[1.7] text-[var(--v2-ink)] columns-1 md:columns-2 md:gap-10 v2-opsz-14">
              <p className="v2-dropcap mb-4">
                Ikatan Mahasiswa Muhammadiyah Pimpinan Komisariat Fakultas Teknik
                adalah organisasi mahasiswa otonom di bawah Muhammadiyah yang
                bergerak di bidang keagamaan, kemahasiswaan, dan kemasyarakatan.
              </p>
              <p className="mb-4">
                Berakar pada tiga pilar — religiusitas, intelektualitas, dan
                humanitas — kami hadir sebagai wadah pengkaderan yang menyiapkan
                akademisi Islam berkarakter, mampu menjalankan amal dakwah di
                tengah masyarakat.
              </p>
              <p>
                Periode <strong>2025 – 2026</strong> menandai babak baru:
                konsolidasi sepuluh bidang, penguatan kapasitas kader,
                dan pengembangan sinergi keilmuan lintas program studi
                Fakultas Teknik.
              </p>
            </article>

            {/* Sidebar pillars */}
            <aside className="lg:col-span-5 space-y-3">
              {[
                { n: 'I', label: 'Visi', body: 'Terbentuknya akademisi Islam berkarakter yang menjalankan amal dakwah.' },
                { n: 'II', label: 'Misi', body: 'Membina keimanan, memperjuangkan keilmuan, menggerakkan kemanusiaan.' },
                { n: 'III', label: 'Nilai', body: 'Religiusitas · Intelektualitas · Humanitas — tiga pilar kader IMM.' },
              ].map((p, i) => (
                <motion.div
                  key={p.n}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="border-l-4 border-[var(--v2-maroon)] bg-[var(--v2-paper-soft)] pl-5 pr-4 py-4 flex items-baseline gap-4"
                >
                  <span className="v2-serif text-3xl font-bold italic v2-c-maroon v2-opsz-96-wonk">
                    {p.n}.
                  </span>
                  <div>
                    <p className="v2-eyebrow !text-[10px]">{p.label}</p>
                    <p className="v2-serif text-base mt-1 leading-snug">{p.body}</p>
                  </div>
                </motion.div>
              ))}
            </aside>
          </div>

          {/* Big editorial stats row */}
          <div className="mt-20 border-y-2 border-[var(--v2-ink)] py-8 grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--v2-rule-strong)]">
            {[
              { v: '10', k: 'Bidang Aktif' },
              { v: '05', k: 'Pimpinan Inti' },
              { v: '120', k: 'Kader Aktif', plus: true },
              { v: '04', k: 'Periode Arsip' },
            ].map((s) => (
              <div key={s.k} className="px-4 md:px-6 text-center md:text-left">
                <p className="v2-numeral">
                  {s.v}
                  {s.plus && <span className="v2-c-maroon">+</span>}
                </p>
                <p className="v2-label mt-2">{s.k}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          № 03 — STRUKTUR (editorial roster)
          ═══════════════════════════════════════════════════════ */}
      <section id="struktur" className="v2-maroon-block py-24 md:py-32 px-6 md:px-12 relative overflow-hidden">
        {/* Gold corner */}
        <div aria-hidden className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-[var(--v2-gold)] opacity-20 blur-3xl" />

        <div className="mx-auto max-w-7xl relative">
          <div className="v2-section-head mb-16 text-[var(--v2-paper)]">
            <p className="v2-section-num v2-c-gold-soft">№03</p>
            <div>
              <p className="v2-eyebrow mb-3">Pimpinan Inti</p>
              <h2 className="v2-section-title text-[var(--v2-paper)]">
                Lima nama yang <em className="italic v2-c-gold-soft">memikul</em> amanah.
              </h2>
            </div>
            <p className="v2-mono text-[10px] uppercase tracking-[0.28em] text-[var(--v2-paper)]/70 md:text-right">
              Bab III ·<br />Halaman 03
            </p>
          </div>

          <div className="grid lg:grid-cols-12 gap-10">
            {/* Featured leader (Ketua Umum) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5"
            >
              <div className="relative aspect-[4/5] overflow-hidden border-2 border-[var(--v2-paper)]">
                <Image
                  src={pimpinanInti[0].img}
                  alt={pimpinanInti[0].nama}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover grayscale-[55%] contrast-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 v2-photo-deep-overlay" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-[var(--v2-paper)]">
                  <p className="v2-eyebrow !text-[10px] v2-c-gold-soft">
                    {pimpinanInti[0].title}
                  </p>
                  <p className="v2-display text-5xl mt-2 v2-c-paper v2-opsz-96-wonk">
                    {pimpinanInti[0].nama}
                  </p>
                  <p className="v2-mono text-xs mt-2 opacity-80">{pimpinanInti[0].role}</p>
                </div>
                <div className="absolute top-4 right-4 v2-serif text-6xl font-black italic opacity-30 v2-c-gold-soft">01</div>
              </div>
            </motion.div>

            {/* Editorial roster */}
            <div className="lg:col-span-7">
              <div className="border-t border-[var(--v2-paper)]/40">
                {pimpinanInti.slice(1).map((p, i) => (
                  <motion.div
                    key={p.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: '-40px' }}
                    transition={{ delay: i * 0.06, duration: 0.45 }}
                    className="grid grid-cols-[3rem_1fr_auto] gap-4 items-center py-6 border-b border-[var(--v2-paper)]/40 group"
                  >
                    <span className="v2-serif text-3xl italic v2-c-gold-soft v2-opsz-96-wonk">
                      0{i + 2}
                    </span>
                    <div>
                      <p className="v2-eyebrow !text-[10px] v2-c-gold-soft">{p.title}</p>
                      <p className="v2-serif text-2xl md:text-3xl font-bold leading-tight mt-1 text-[var(--v2-paper)] group-hover:translate-x-2 transition-transform v2-opsz-96-soft">
                        {p.nama}
                      </p>
                    </div>
                    <div className="relative w-14 h-14 md:w-20 md:h-20 overflow-hidden rounded-full border-2 border-[var(--v2-gold-soft)]">
                      <Image src={p.img} alt={p.nama} fill className="object-cover" sizes="80px" referrerPolicy="no-referrer" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          № 04 — BIDANG (editorial table of contents)
          ═══════════════════════════════════════════════════════ */}
      <section id="bidang" className="px-6 md:px-12 py-24 md:py-32 bg-[var(--v2-paper-soft)] border-y border-[var(--v2-rule-strong)]">
        <div className="mx-auto max-w-6xl">
          <div className="v2-section-head mb-12">
            <p className="v2-section-num">№04</p>
            <div>
              <p className="v2-eyebrow mb-3">Sepuluh Bidang Garapan</p>
              <h2 className="v2-section-title">
                Daftar <em className="italic v2-c-maroon">Isi.</em>
              </h2>
            </div>
            <p className="v2-mono text-[10px] uppercase tracking-[0.28em] text-[var(--v2-ink-soft)] md:text-right">
              Bab IV ·<br />Halaman 04
            </p>
          </div>

          <p className="v2-serif text-lg max-w-2xl mb-12 text-[var(--v2-ink-soft)] v2-opsz-24">
            Setiap bidang dipimpin oleh Ketua Bidang, dibantu Sekretaris Bidang,
            dan menaungi departemen-departemen spesifik.
          </p>

          <div className="border-t-2 border-[var(--v2-ink)]">
            {bidangData.map((b, i) => {
              const Icon = b.icon;
              return (
                <Link
                  key={b.slug}
                  href={`/bidang/${b.slug}`}
                  className="v2-index-entry"
                >
                  <span className="v2-num">{String(i + 1).padStart(2, '0')}</span>

                  <div className="flex items-baseline gap-4 min-w-0">
                    <Icon
                      size={24}
                      strokeWidth={1.5}
                      className="shrink-0 text-[var(--v2-maroon)] self-center"
                      aria-hidden
                    />
                    <div className="min-w-0">
                      <p className="v2-title-line truncate">{b.name}</p>
                      <p className="v2-mono text-[11px] uppercase tracking-[0.18em] text-[var(--v2-ink-soft)] mt-1">
                        {b.kicker}
                      </p>
                    </div>
                  </div>

                  <span className="v2-page inline-flex items-center gap-2">
                    Hal. {String(i + 5).padStart(2, '0')}
                    <ArrowUpRight size={14} strokeWidth={2} className="opacity-60 group-hover:opacity-100" />
                  </span>
                </Link>
              );
            })}
            <div className="v2-rule-thick" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          № 05 — ARSIP (timeline horizontal)
          ═══════════════════════════════════════════════════════ */}
      <section id="arsip" className="px-6 md:px-12 py-24 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="v2-section-head mb-16">
            <p className="v2-section-num">№05</p>
            <div>
              <p className="v2-eyebrow mb-3">Jejak Kepemimpinan</p>
              <h2 className="v2-section-title">
                Estafet <em className="italic v2-c-maroon">Pengurus.</em>
              </h2>
            </div>
            <p className="v2-mono text-[10px] uppercase tracking-[0.28em] text-[var(--v2-ink-soft)] md:text-right">
              Bab V ·<br />Halaman 15
            </p>
          </div>

          <div className="relative">
            <div className="absolute top-8 left-0 right-0 h-px bg-[var(--v2-ink)]" aria-hidden />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4">
              {pengurusSebelumnya.map((p, i) => (
                <motion.div
                  key={p.periode}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.45 }}
                  className="relative pt-12"
                >
                  <span
                    className="absolute top-[26px] left-0 w-4 h-4 rounded-full bg-[var(--v2-maroon)] border-4 border-[var(--v2-paper)] shadow-[0_0_0_2px_var(--v2-ink)]"
                    aria-hidden
                  />
                  <p className="v2-eyebrow">{p.periode}</p>
                  <h3 className="v2-serif text-2xl md:text-3xl font-bold mt-2 leading-tight v2-opsz-96-soft">
                    {p.ketua}
                  </h3>
                  <p className="v2-mono text-[10px] uppercase tracking-[0.28em] text-[var(--v2-ink-soft)] mt-2">
                    Ketua Umum
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          CTA + Footer
          ═══════════════════════════════════════════════════════ */}
      <section className="v2-ink-block px-6 md:px-12 py-24 md:py-36 relative overflow-hidden border-t-2 border-[var(--v2-ink)]">
        <div aria-hidden className="absolute inset-0 opacity-[0.04] overflow-hidden">
          <div className="v2-watermark">
            FIASTABIQUL · KHAIRAT · FIASTABIQUL · KHAIRAT
          </div>
        </div>
        <div className="mx-auto max-w-5xl text-center relative">
          <p className="v2-eyebrow mb-6 v2-c-gold-soft">
            Penutup · Ajakan
          </p>
          <h2 className="v2-display text-[clamp(3rem,8vw,7rem)] v2-c-paper">
            Siap <em className="italic v2-c-gold-soft">Bergerak</em>?
          </h2>
          <p className="v2-serif text-lg md:text-xl mt-8 max-w-2xl mx-auto leading-snug v2-c-paper v2-opsz-24">
            Jadilah bagian dari estafet. Mari bersama mewujudkan cita-cita
            Ikatan Mahasiswa Muhammadiyah di Fakultas Teknik.
          </p>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/login" className="v2-btn v2-btn-gold">
              Masuk Dashboard <ArrowUpRight size={14} strokeWidth={2.5} />
            </Link>
            <a href="#manifesto" className="v2-btn v2-btn-on-dark">
              Kembali ke Awal
            </a>
          </div>
        </div>
      </section>

      <footer className="v2-ink-block px-6 md:px-12 py-10 border-t border-[var(--v2-paper)]/20">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 v2-mono text-[10px] uppercase tracking-[0.32em] v2-c-paper">
          <p>© 2026 PIKOM TEKNIK · IMM</p>
          <p className="opacity-60">Vol. I · Edisi v2 · Cetakan Pertama</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-[var(--v2-gold-soft)]">IG</a>
            <a href="#" className="hover:text-[var(--v2-gold-soft)]">X</a>
            <a href="#" className="hover:text-[var(--v2-gold-soft)]">Email</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
