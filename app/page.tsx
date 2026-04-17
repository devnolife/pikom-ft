'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Network, Users, FlaskConical, Flower2, Landmark,
  BookOpen, TrendingUp, HeartHandshake, Palette, Radio,
  ArrowRight, ArrowUp, ChevronDown, Sparkles, Quote,
} from 'lucide-react';

import { NavBar } from '@/components/landing/nav-bar';
import { StatCounter } from '@/components/landing/stat-counter';
import { BidangCard } from '@/components/landing/bidang-card';
import { LeaderCard } from '@/components/landing/leader-card';
import { DecorativeBlobs } from '@/components/landing/decorative-blobs';
import { HeroSlider, type HeroSlide } from '@/components/landing/hero-slider';
import { Section } from '@/components/ui/section';

// ── Data ──────────────────────────────────────────────────────

const pimpinanInti = [
  {
    title: 'Ketua Umum',
    role: 'Pimpinan Tertinggi',
    nama: 'Ahmad Fauzi',
    img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=750&fit=crop&crop=face',
    featured: true,
  },
  {
    title: 'Sekretaris Umum',
    role: 'Administrasi & Operasional',
    nama: 'Rina Lestari',
    img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face',
  },
  {
    title: 'Bendahara Umum',
    role: 'Manajemen Keuangan',
    nama: 'Dian Prasetyo',
    img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face',
  },
  {
    title: 'Bendahara 1',
    role: 'Keuangan Internal',
    nama: 'Fitri Amalia',
    img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=face',
  },
  {
    title: 'Bendahara 2',
    role: 'Keuangan Eksternal',
    nama: 'Rizky Pratama',
    img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face',
  },
];

const pengurusSebelumnya = [
  { periode: '2024–2025', ketua: 'Ahmad Fauzi' },
  { periode: '2023–2024', ketua: 'Muhammad Rizki' },
  { periode: '2022–2023', ketua: 'Andi Pratama' },
  { periode: '2021–2022', ketua: 'Ilham Saputra' },
];

const bidangData = [
  { name: 'Organisasi', slug: 'organisasi', icon: Network, desc: 'Diarahkan pada tercapainya struktur, fungsi dan stabilitas organisasi serta mekanisme kepemimpinan yang mantap. Program konsolidasi gerakan IMM diarahkan pada terciptanya kekuatan gerak IMM baik kedalam maupun keluar.' },
  { name: 'Kader', slug: 'kader', icon: Users, desc: 'Diarahkan pada penguatan tri kompetensi dasar (aqidah, intelektual dan humanitas) yang secara dinamis mampu menempatkan diri sebagai pelaku perubahan sosial masyarakat dan ikatan.' },
  { name: 'Riset & Pengembangan', slug: 'riset-pengembangan', icon: FlaskConical, desc: 'Diarahkan pada penguatan basis metodologi riset dan pengembangan sinergisitas keilmuan kader di semua disiplin ilmu.' },
  { name: 'Immawati', slug: 'immawati', icon: Flower2, desc: 'Diarahkan pada upaya penguatan jati diri dan peran aktif potensi sumber daya putri dalam transformasi sosial menuju masyarakat utama berbasis pada paradigma Dakwah dan berkeadilan gender.' },
  { name: 'Hikmah', slug: 'hikmah', icon: Landmark, desc: 'Diarahkan pada penguatan peran sosial-politik IMM di tengah kehidupan berbangsa dan bernegara. Pemetaan basis data sosial politik, penguatan peran intelektual kader, dan laboratorium politik.' },
  { name: 'Tabligh', slug: 'tabligh', icon: BookOpen, desc: 'Diarahkan pada gerakan dakwah Islam bernuansa pencerahan dan memakmurkan masjid kampus sebagai basis gerakan dakwah IMM.' },
  { name: 'Ekonomi & Kewirausahaan', slug: 'ekonomi-kewirausahaan', icon: TrendingUp, desc: 'Diarahkan pada pengembangan kapasitas kewirausahaan kader dan organisasi guna mencapai cita-cita kemandirian organisasi.' },
  { name: 'SPM', slug: 'spm', icon: HeartHandshake, desc: 'Diarahkan pada kemampuan institusi IMM melakukan kerja-kerja pemberdayaan masyarakat di akar rumput sebagai terjemahan humanitas kader, terintegrasi dengan dakwah Muhammadiyah.' },
  { name: 'SBO', slug: 'sbo', icon: Palette, desc: 'Diarahkan pada pembentukan paradigma multikultral sesuai nilai Ke-Muhammadiyahan dan aktualisasi kreatifitas seni, budaya dan olahraga sebagai bagian dari gerakan dakwah Islam.' },
  { name: 'Media & Komunikasi', slug: 'media-komunikasi', icon: Radio, desc: 'Diarahkan pada terbangunnya sistem komunikasi internal dan eksternal IMM, pembangunan image IMM, media komunitas yang mumpuni, dan meningkatkan bargaining position.' },
];

const navLinks = [
  { href: '#about', label: 'Tentang' },
  { href: '#struktur', label: 'Struktur' },
  { href: '#bidang', label: 'Bidang' },
];

const statsData = [
  { label: 'Bidang', value: 10 },
  { label: 'Pimpinan Inti', value: 5 },
  { label: 'Kader Aktif', value: 120, suffix: '+' },
  { label: 'Periode Aktif', value: 4, suffix: '' },
];

const heroSlides: HeroSlide[] = [
  {
    src: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1600&h=900&fit=crop',
    alt: 'Foto bersama pengurus PIKOM FT di acara pelantikan',
    caption: 'Pelantikan Pengurus PIKOM Fakultas Teknik — Periode 2025–2026',
  },
  {
    src: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1600&h=900&fit=crop',
    alt: 'Diskusi kader dalam forum mingguan',
    caption: 'Forum Diskusi Kader — Membangun intelektual bersama',
  },
  {
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1600&h=900&fit=crop',
    alt: 'Kegiatan pengabdian masyarakat oleh kader PIKOM FT',
    caption: 'Pengabdian Masyarakat — Humanitas dalam aksi nyata',
  },
  {
    src: 'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=1600&h=900&fit=crop',
    alt: 'Rapat kerja tahunan seluruh bidang',
    caption: 'Rapat Kerja Tahunan — Konsolidasi 10 bidang organisasi',
  },
];

// ── Page ──────────────────────────────────────────────────────

export default function LandingPage() {
  const [activeSection, setActiveSection] = useState('about');
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sections = document.querySelectorAll('section[id]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.25, rootMargin: '-80px 0px -40% 0px' }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-bg text-fg overflow-x-hidden grain">
      <NavBar links={navLinks} activeSection={activeSection} />

      {/* ═══════════════════════════════════════════════════════
          HERO
          ═══════════════════════════════════════════════════════ */}
      <section
        id="about"
        className="relative min-h-[88vh] flex items-center px-6 md:px-10 lg:px-16 pt-28 pb-16 overflow-hidden"
      >
        <div className="mx-auto max-w-7xl w-full grid lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="lg:col-span-5 relative z-10"
          >
            <div className="flex items-center gap-3 mb-6">
              <span className="inline-flex items-center gap-2 glass px-3 py-1.5 rounded-full text-[11px] font-mono uppercase tracking-[0.2em] text-accent">
                <Sparkles size={12} aria-hidden="true" />
                Periode 2025–2026
              </span>
            </div>

            <h1 className="font-black tracking-tighter uppercase leading-[0.9] mb-6 text-[clamp(2.5rem,6.5vw,5.5rem)]">
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55 }}
                className="inline-block text-maroon"
              >
                Pikom
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.55 }}
                className="inline-block text-gold"
              >
                Teknik
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-base md:text-lg font-mono leading-relaxed text-fg-secondary max-w-xl mb-10"
            >
              Pimpinan Komisariat IMM di lingkup Fakultas Teknik. Membangun
              kader berintelektual, berhumanitas, dan beraqidah kuat.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="flex flex-wrap items-center gap-4"
            >
              <a
                href="#struktur"
                className="group inline-flex items-center gap-2 bg-accent text-[color:var(--color-selection-text)] px-7 py-3.5 rounded-full uppercase text-[11px] font-bold tracking-[0.2em] hover:scale-[1.02] transition-transform shadow-lg shadow-black/20"
              >
                Jelajahi Struktur
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="/login"
                className="glass inline-flex items-center gap-2 px-7 py-3.5 rounded-full uppercase text-[11px] font-bold tracking-[0.2em] hover:bg-white/10 transition-colors"
              >
                Masuk Dashboard
              </Link>
            </motion.div>
          </motion.div>

          {/* Hero visual — landscape slider */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            className="lg:col-span-7 relative z-10"
          >
            <HeroSlider slides={heroSlides} />
            {/* Floating stat strip di bawah slider */}
            <div className="mt-4 grid grid-cols-3 gap-3">
              <div className="glass rounded-xl px-4 py-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent mb-1">
                  Sejak
                </p>
                <p className="text-xl font-black">1964</p>
              </div>
              <div className="glass rounded-xl px-4 py-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent mb-1">
                  Kader
                </p>
                <p className="text-xl font-black">120+</p>
              </div>
              <div className="glass rounded-xl px-4 py-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent mb-1">
                  Bidang
                </p>
                <p className="text-xl font-black">10</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-6 md:left-10 lg:left-16 flex items-center gap-3 text-label animate-float"
        >
          <ChevronDown size={16} />
          <span>Scroll</span>
          <div className="w-10 h-px bg-border" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          STATS STRIP
          ═══════════════════════════════════════════════════════ */}
      <section
        aria-label="Statistik organisasi"
        className="border-y border-border bg-bg-alt"
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 lg:px-16 py-12 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {statsData.map((s) => (
            <StatCounter key={s.label} value={s.value} label={s.label} suffix={s.suffix} />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════
          TENTANG PIKOM
          ═══════════════════════════════════════════════════════ */}
      <Section
        eyebrow="Tentang PIKOM"
        title={<>Anggun dalam <span className="text-gold">Moral</span>,<br />Unggul dalam Intelektual</>}
        description="Ikatan Mahasiswa Muhammadiyah (IMM) Pimpinan Komisariat Fakultas Teknik adalah organisasi mahasiswa otonom di bawah Muhammadiyah yang bergerak di bidang keagamaan, kemahasiswaan, dan kemasyarakatan."
        container="max-w-6xl"
      >
        <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
            className="glass rounded-3xl p-8 md:p-10 flex flex-col gap-4"
          >
            <div className="p-3 rounded-xl glass-strong w-fit">
              <Quote size={20} className="text-accent" aria-hidden="true" />
            </div>
            <p className="text-lg md:text-xl font-mono leading-relaxed text-fg">
              &ldquo;IMM untuk kemanusiaan, IMM untuk ilmu, IMM untuk agama.
              Kami hadir sebagai wadah pengkaderan mahasiswa muslim yang
              berkarakter.&rdquo;
            </p>
            <div className="pt-4 border-t border-border">
              <p className="text-label">Falsafah Gerakan IMM</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[
              { label: 'Visi', body: 'Terbentuknya akademisi Islam berkarakter, menjalankan amal dakwah di tengah masyarakat.' },
              { label: 'Misi', body: 'Membina keimanan, memperjuangkan nilai keilmuan, menggerakkan kemanusiaan.' },
              { label: 'Nilai', body: 'Religiusitas, intelektualitas, humanitas — tiga pilar kader IMM.' },
              { label: 'Arah', body: 'Menjawab tantangan zaman dengan basis iman, ilmu, dan aksi nyata.' },
            ].map((item, i) => (
              <div
                key={item.label}
                className="glass rounded-2xl p-6 flex flex-col gap-3 hover:-translate-y-1 transition-transform"
              >
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent">
                  0{i + 1} / {item.label}
                </span>
                <p className="text-sm font-mono leading-relaxed text-fg-secondary">
                  {item.body}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          STRUKTUR PIMPINAN
          ═══════════════════════════════════════════════════════ */}
      <Section
        id="struktur"
        eyebrow="Kepemimpinan"
        title={<>Pimpinan <span className="text-gold">Inti</span></>}
        description="Struktur kepengurusan tingkat komisariat yang menjadi motor penggerak utama. Ketua Umum memimpin, didampingi Sekretaris dan tiga Bendahara."
        container="max-w-6xl"
        className="border-t border-border"
      >
        <div className="grid lg:grid-cols-12 gap-5 md:gap-6">
          {/* Featured: Ketua Umum */}
          <div className="lg:col-span-6 lg:row-span-2">
            <LeaderCard
              title={pimpinanInti[0].title}
              role={pimpinanInti[0].role}
              nama={pimpinanInti[0].nama}
              img={pimpinanInti[0].img}
              index={0}
              variant="featured"
            />
          </div>
          {pimpinanInti.slice(1).map((p, i) => (
            <div key={p.title} className="lg:col-span-3">
              <LeaderCard
                title={p.title}
                role={p.role}
                nama={p.nama}
                img={p.img}
                index={i + 1}
              />
            </div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          BIDANG — BENTO GRID
          ═══════════════════════════════════════════════════════ */}
      <Section
        id="bidang"
        eyebrow="10 Bidang"
        title={<>Struktur <span className="text-gold">Bidang</span></>}
        description="Setiap bidang dipimpin oleh Ketua Bidang, dibantu oleh Sekretaris Bidang, dan menaungi departemen-departemen spesifik."
        className="bg-bg-alt border-y border-border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(300px,auto)] md:auto-rows-[280px]">
          {bidangData.map((bidang, index) => {
            const variant =
              index === 0 ? 'featured' : index === 6 || index === 9 ? 'wide' : 'default';
            return (
              <BidangCard
                key={bidang.slug}
                name={bidang.name}
                desc={bidang.desc}
                icon={bidang.icon}
                slug={bidang.slug}
                index={index}
                variant={variant}
              />
            );
          })}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          PENGURUS SEBELUMNYA
          ═══════════════════════════════════════════════════════ */}
      <Section
        eyebrow="Jejak Kepemimpinan"
        title={<>Pengurus <span className="text-gold">Sebelumnya</span></>}
        description="Estafet kepemimpinan PIKOM Fakultas Teknik dari periode ke periode."
        container="max-w-6xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {pengurusSebelumnya.map((item, i) => (
            <motion.div
              key={item.periode}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="glass rounded-2xl p-6 flex flex-col gap-3 hover:-translate-y-1 transition-transform"
            >
              <span className="text-label">{item.periode}</span>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight leading-tight">
                  {item.ketua}
                </h3>
                <p className="text-xs font-mono text-fg-muted mt-1">Ketua Umum</p>
              </div>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          CTA FOOTER
          ═══════════════════════════════════════════════════════ */}
      <footer className="relative px-6 md:px-10 lg:px-16 py-24 md:py-32 border-t border-border bg-bg-alt overflow-hidden">
        <DecorativeBlobs variant="footer" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="relative mx-auto max-w-4xl text-center z-10"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase mb-6">
            Siap <span className="text-gold">Bergerak?</span>
          </h2>
          <p className="text-base md:text-lg font-mono leading-relaxed text-fg-secondary max-w-xl mx-auto mb-10">
            Jadilah bagian dari perubahan. Mari bersama-sama mewujudkan
            cita-cita Ikatan Mahasiswa Muhammadiyah di Fakultas Teknik.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-accent text-[color:var(--color-selection-text)] px-8 py-4 rounded-full uppercase text-[11px] font-bold tracking-[0.2em] hover:scale-[1.02] transition-transform shadow-lg shadow-black/20"
            >
              Masuk Dashboard
              <ArrowRight size={16} />
            </Link>
            <a
              href="#about"
              className="glass inline-flex items-center gap-2 px-8 py-4 rounded-full uppercase text-[11px] font-bold tracking-[0.2em] hover:bg-white/10 transition-colors"
            >
              Pelajari Lebih
            </a>
          </div>
        </motion.div>

        <div className="relative z-10 mt-20 pt-8 mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-mono uppercase tracking-widest text-fg-muted border-t border-border">
          <p>&copy; 2026 PIKOM TEKNIK IMM</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">Instagram</a>
            <a href="#" className="hover:text-accent transition-colors">Twitter</a>
            <a href="#" className="hover:text-accent transition-colors">Email</a>
          </div>
        </div>
      </footer>

      {/* Scroll to top */}
      {showScrollTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 glass-strong p-3.5 rounded-full shadow-lg shadow-black/20 hover:scale-110 transition-transform group"
          aria-label="Kembali ke atas"
        >
          <ArrowUp size={18} className="group-hover:-translate-y-0.5 transition-transform" />
        </motion.button>
      )}
    </div>
  );
}
