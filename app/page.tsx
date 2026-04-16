'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Network, Users, FlaskConical, Flower2, Landmark,
  BookOpen, TrendingUp, HeartHandshake, Palette, Radio,
  ArrowRight, ArrowUp, Menu, X, ChevronDown, ChevronLeft, ChevronRight,
  Sun, Moon, SwatchBook
} from 'lucide-react';
import { useTheme, themeKeys, themeLabels, type ThemeKey } from './theme-provider';

// ── Data ──

const pimpinanInti = [
  { title: "Ketua Umum", role: "Pimpinan Tertinggi", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=500&fit=crop&crop=face" },
  { title: "Sekretaris Umum", role: "Administrasi & Operasional", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop&crop=face" },
  { title: "Bendahara Umum", role: "Manajemen Keuangan", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=500&fit=crop&crop=face" },
  { title: "Bendahara 1", role: "Keuangan Internal", img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&h=500&fit=crop&crop=face" },
  { title: "Bendahara 2", role: "Keuangan Eksternal", img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=500&fit=crop&crop=face" },
];

const pengurusSebelumnya = [
  { periode: "2024–2025", ketua: "Ahmad Fauzi", foto: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=300&h=300&fit=crop&crop=face" },
  { periode: "2023–2024", ketua: "Muhammad Rizki", foto: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&h=300&fit=crop&crop=face" },
  { periode: "2022–2023", ketua: "Andi Pratama", foto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face" },
  { periode: "2021–2022", ketua: "Ilham Saputra", foto: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face" },
];

const bidangData = [
  { name: "Organisasi", icon: Network, desc: "Diarahkan pada tercapainya struktur, fungsi dan stabilitas organisasi serta mekanisme kepemimpinan yang mantap. Program konsolidasi gerakan IMM diarahkan pada terciptanya kekuatan gerak IMM baik kedalam maupun keluar sebagai modal penggerak." },
  { name: "Kader", icon: Users, desc: "Diarahkan pada penguatan tri kompetensi dasar (aqidah, intelektual dan humanitas) yang secara dinamis mampu menempatkan diri sebagai pelaku perubahan sosial masyarakat dan ikatan." },
  { name: "Riset & Pengembangan", icon: FlaskConical, desc: "Diarahkan pada penguatan basis metodologi riset dan pengembangan sinergisitas keilmuan kader di semua disiplin ilmu." },
  { name: "Immawati", icon: Flower2, desc: "Diarahkan pada upaya penguatan jati diri dan peran aktif potensi sumber daya putri dalam transformasi sosial menuju masyarakat utama berbasis pada paradigma Dakwah dan berkeadilan gender." },
  { name: "Hikmah", icon: Landmark, desc: "Diarahkan pada penguatan peran sosial-politik IMM di tengah kehidupan berbangsa dan bernegara. Pemetaan basis data sosial politik, penguatan peran intelektual kader, dan laboratorium politik." },
  { name: "Tabligh", icon: BookOpen, desc: "Diarahkan pada gerakan dakwah Islam bernuansa pencerahan dan memakmurkan masjid kampus sebagai basis gerakan dakwah IMM." },
  { name: "Ekonomi & Kewirausahaan", icon: TrendingUp, desc: "Diarahkan pada pengembangan kapasitas kewirausahaan kader dan organisasi guna mencapai cita-cita kemandirian organisasi." },
  { name: "SPM", icon: HeartHandshake, desc: "Diarahkan pada kemampuan institusi IMM melakukan kerja-kerja pemberdayaan masyarakat di akar rumput sebagai terjemahan humanitas kader, terintegrasi dengan dakwah Muhammadiyah." },
  { name: "SBO", icon: Palette, desc: "Diarahkan pada pembentukan paradigma multikultral sesuai nilai Ke-Muhammadiyahan dan aktualisasi kreatifitas seni, budaya dan olahraga sebagai bagian dari gerakan dakwah Islam." },
  { name: "Media & Komunikasi", icon: Radio, desc: "Diarahkan pada terbangunnya sistem komunikasi internal dan eksternal IMM, pembangunan image IMM, media komunitas yang mumpuni, dan meningkatkan bargaining position." },
];

const geometricShapes = [
  { size: 50, x: '10%', y: '20%', type: 'circle' as const, animClass: 'animate-float' },
  { size: 35, x: '85%', y: '15%', type: 'diamond' as const, animClass: 'animate-float-reverse' },
  { size: 40, x: '20%', y: '75%', type: 'triangle' as const, animClass: 'animate-float' },
  { size: 30, x: '70%', y: '60%', type: 'circle' as const, animClass: 'animate-float-reverse' },
];

const statsData = [
  { label: 'Bidang', value: 10 },
  { label: 'Pimpinan Inti', value: 5 },
  { label: 'Kader Aktif', value: 120, suffix: '+' },
];

const navLinks = [
  { href: '#about', label: 'Tentang' },
  { href: '#struktur', label: 'Struktur' },
  { href: '#bidang', label: 'Bidang' },
];

// ── Components ──

function StatItem({ value, label, suffix, isVisible }: {
  value: number; label: string; suffix?: string; isVisible: boolean;
}) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let current = 0;
    const steps = 60;
    const increment = value / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 2000 / steps);
    return () => clearInterval(timer);
  }, [isVisible, value]);

  return (
    <div className="text-center">
      <div className="text-4xl md:text-5xl font-black text-gradient mb-2">
        {count}{suffix || ''}
      </div>
      <div className="text-[11px] uppercase tracking-[0.2em] font-mono" style={{ color: 'var(--color-text-muted)' }}>
        {label}
      </div>
    </div>
  );
}

const themeIcons: Record<ThemeKey, typeof Sun> = { classic: SwatchBook, light: Sun, dark: Moon };

// ── Page ──

export default function Page() {
  const { theme, colors, setTheme, isLight } = useTheme();
  const [announcement, setAnnouncement] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [activeSlide, setActiveSlide] = useState(0);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 500);
    };
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
      { threshold: 0.3 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!statsRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.5 }
    );
    observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  const handleAction = (message: string) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 3000);
  };

  const ThemeIcon = themeIcons[theme];

  return (
    <div className="min-h-screen font-sans overflow-x-hidden grain transition-colors duration-500"
      style={{ backgroundColor: colors.bg, color: colors.text }}>

      {/* ARIA Live Region */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {announcement}
      </div>

      {/* ── Navigation ── */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-3 px-6 md:px-8 glass-strong shadow-lg shadow-black/20' : 'py-6 px-6 md:px-8 bg-transparent'
        }`}>
        <div className="flex justify-between items-center max mx-auto">
          <a href="#about" className="flex items-center gap-4">
            <div className="flex h-8 w-6 rounded-b-md overflow-hidden shadow-lg" style={{ border: `1px solid ${colors.border}` }}>
              <div className="w-1/3 h-full bg-black" />
              <div className="w-1/3 h-full" style={{ backgroundColor: colors.accentSecondary }} />
              <div className="w-1/3 h-full" style={{ backgroundColor: colors.accent }} />
            </div>
            <div className="font-bold text-xl tracking-tighter uppercase">
              PIKOM<span className="text-gradient">FT</span>
            </div>
          </a>

          <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-[0.2em] font-mono">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="relative py-1 transition-colors"
                style={{ color: activeSection === link.href.slice(1) ? colors.accent : colors.textSecondary }}
              >
                {link.label}
                {activeSection === link.href.slice(1) && (
                  <motion.div layoutId="activeNav" className="absolute -bottom-1 left-0 right-0 h-[2px] rounded-full" style={{ backgroundColor: colors.accent }} />
                )}
              </a>
            ))}

            <Link href="/login"
              className="glass px-5 py-2 uppercase text-[11px] font-bold tracking-[0.15em] transition-all hover:scale-105"
              style={{ borderColor: colors.accent, color: colors.text }}>
              Login
            </Link>

            {/* Theme Switcher */}
            <div className="relative">
              <button
                onClick={() => setThemeMenuOpen(!themeMenuOpen)}
                className="glass p-2 rounded-full transition-all hover:scale-110"
                aria-label="Ganti tema"
              >
                <ThemeIcon size={14} />
              </button>
              <AnimatePresence>
                {themeMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    className="absolute right-0 top-10 glass-strong rounded-xl overflow-hidden min-w-[140px]"
                  >
                    {themeKeys.map((key) => {
                      const TIcon = themeIcons[key];
                      return (
                        <button
                          key={key}
                          onClick={() => { setTheme(key); setThemeMenuOpen(false); }}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-[11px] uppercase tracking-wider font-mono transition-colors"
                          style={{
                            backgroundColor: theme === key ? colors.accent : 'transparent',
                            color: theme === key ? colors.selectionText : colors.textSecondary,
                          }}
                        >
                          <TIcon size={13} />
                          {themeLabels[key]}
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => { const next = themeKeys[(themeKeys.indexOf(theme) + 1) % themeKeys.length]; setTheme(next); }}
              className="p-2" aria-label="Ganti tema">
              <ThemeIcon size={20} />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
              aria-label={mobileMenuOpen ? 'Tutup menu' : 'Buka menu'}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
            style={{ backgroundColor: colors.mobileMenuBg }}
          >
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)}
                className="text-3xl font-bold uppercase tracking-wider transition-colors"
                style={{ color: colors.text }}
                onMouseEnter={(e) => e.currentTarget.style.color = colors.accent}
                onMouseLeave={(e) => e.currentTarget.style.color = colors.text}>
                {link.label}
              </a>
            ))}
            <Link href="/login" onClick={() => setMobileMenuOpen(false)}
              className="mt-8 glass px-8 py-3 uppercase tracking-[0.2em] text-sm transition-all"
              style={{ color: colors.text }}>
              Login
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Hero Section ── */}
      <section id="about" className="min-h-screen flex flex-col lg:flex-row items-center justify-between px-6 md:px-16 pt-32 pb-20 relative gap-12">
        {/* Gradient blobs */}
        <div className="absolute top-1/4 right-10 w-64 h-64 rounded-full filter blur-[80px] opacity-15" style={{ background: `linear-gradient(to bottom right, ${colors.accent}, ${colors.accentSecondary})` }} />
        <div className="absolute bottom-1/4 left-10 w-48 h-48 rounded-full filter blur-[80px] opacity-10" style={{ background: `linear-gradient(to top right, ${colors.accent}, ${colors.accentSecondary})` }} />

        {/* Floating geometric shapes */}
        {geometricShapes.map((shape, i) => (
          <div
            key={i}
            className={`absolute pointer-events-none opacity-[0.07] ${shape.animClass}`}
            style={{ left: shape.x, top: shape.y }}
          >
            {shape.type === 'circle' && <div className="rounded-full" style={{ width: shape.size, height: shape.size, border: `1px solid ${colors.text}` }} />}
            {shape.type === 'diamond' && <div className="rotate-45" style={{ width: shape.size, height: shape.size, border: `1px solid ${colors.accent}` }} />}
            {shape.type === 'triangle' && (
              <div style={{ width: 0, height: 0, borderLeft: `${shape.size / 2}px solid transparent`, borderRight: `${shape.size / 2}px solid transparent`, borderBottom: `${shape.size}px solid ${colors.accent}4D` }} />
            )}
          </div>
        ))}

        {/* Hero Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="w-full lg:w-1/2 z-10"
        >
          <div className="text-[11px] uppercase tracking-[0.3em] mb-8 font-mono pl-4" style={{ color: colors.accent, borderLeft: `2px solid ${colors.accent}` }}>
            Ikatan Mahasiswa Muhammadiyah
          </div>

          <h1 className="text-6xl md:text-[90px] lg:text-[120px] font-black tracking-tighter leading-[0.85] uppercase mb-8">
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }} className="inline-block">
              Pikom
            </motion.span>
            <br />
            <motion.span initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }} className="inline-block text-gradient">
              Teknik
            </motion.span>
          </h1>

          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 0.8 }}
            className="text-lg md:text-xl max-w-xl font-mono leading-relaxed mb-12" style={{ color: colors.textSecondary }}>
            Ujung tombak pergerakan organisasi di lingkup Fakultas Teknik. Membangun kader berintelektual, berhumanitas, dan beraqidah kuat.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}
            className="flex items-center gap-6">
            <a href="#struktur"
              className="group px-8 py-4 uppercase text-[11px] font-bold tracking-[0.2em] transition-all flex items-center gap-2 rounded-sm"
              style={{ backgroundColor: colors.accent, color: colors.selectionText }}
>
              Jelajahi Struktur <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          className="w-full lg:w-1/2 relative h-[400px] lg:h-[600px] z-10 mt-12 lg:mt-0"
        >
          <div className="absolute inset-0 translate-x-4 translate-y-4 rounded-lg" style={{ background: `linear-gradient(to bottom right, ${colors.accent}, ${colors.accentSecondary})` }} />
          <div className="relative w-full h-full overflow-hidden rounded-lg" style={{ border: `1px solid ${colors.border}`, backgroundColor: colors.bgAlt }}>
            <Image src="https://picsum.photos/seed/teknik/1920/1080" alt="Mahasiswa Teknik" fill
              className="object-cover hover:scale-[1.02] transition-transform duration-300" referrerPolicy="no-referrer" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${colors.bgAlt}99, transparent)` }} />
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-6 md:left-16 flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] font-mono animate-float" style={{ color: colors.textMuted }}>
          <ChevronDown size={16} />
          <span>Scroll</span>
          <div className="w-12 h-[1px]" style={{ backgroundColor: colors.border }} />
        </div>
      </section>

      {/* ── Stats Marquee ── */}
      <section ref={statsRef} className="overflow-hidden py-5" style={{ borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}`, backgroundColor: colors.bgAlt }}>
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(4)].map((_, repeat) => (
            <div key={repeat} className="flex items-center shrink-0">
              {statsData.map((stat, i) => (
                <span key={`${repeat}-${i}`} className="flex items-center gap-3 mx-8 text-[13px] uppercase tracking-[0.2em] font-mono">
                  <span className="text-2xl md:text-3xl font-black text-gradient">
                    {statsVisible ? stat.value : 0}{stat.suffix || ''}
                  </span>
                  <span style={{ color: colors.textMuted }}>{stat.label}</span>
                  <span className="ml-8 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors.accent }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ── Pimpinan Inti Section ── */}
      <section id="struktur" className="py-20 px-6 md:px-16" style={{ borderBottom: `1px solid ${colors.border}` }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-center">
            {/* Left — Info */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-3">
                Pimpinan <span className="text-gradient">Inti</span>
              </h2>
              <p className="font-mono max-w-md mb-8 text-sm" style={{ color: colors.textMuted }}>Struktur kepengurusan tingkat dasar yang menjadi motor penggerak utama komisariat.</p>

              <AnimatePresence mode="wait">
                <motion.div key={activeSlide} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="mb-8">
                  <span className="text-[10px] font-mono uppercase tracking-[0.3em] mb-2 block" style={{ color: colors.accent }}>
                    {String(activeSlide + 1).padStart(2, '0')} / {String(pimpinanInti.length).padStart(2, '0')}
                  </span>
                  <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-1">
                    {pimpinanInti[activeSlide].title}
                  </h3>
                  <p className="text-xs font-mono uppercase tracking-widest" style={{ color: colors.textMuted }}>
                    {pimpinanInti[activeSlide].role}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button onClick={() => setActiveSlide((prev) => (prev - 1 + pimpinanInti.length) % pimpinanInti.length)}
                  className="glass p-2.5 rounded-full transition-all"
                  aria-label="Sebelumnya">
                  <ChevronLeft size={18} />
                </button>
                <button onClick={() => setActiveSlide((prev) => (prev + 1) % pimpinanInti.length)}
                  className="glass p-2.5 rounded-full transition-all"
                  aria-label="Berikutnya">
                  <ChevronRight size={18} />
                </button>
                <div className="flex gap-2 ml-4">
                  {pimpinanInti.map((_, i) => (
                    <button key={i} onClick={() => setActiveSlide(i)}
                      className={`h-1 rounded-full transition-all duration-300 ${i === activeSlide ? 'w-8' : 'w-3'}`}
                      style={{ backgroundColor: i === activeSlide ? colors.accent : `${colors.text}33` }}
                      aria-label={`Slide ${i + 1}`} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Right — Photo Slider */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.8 }}
              className="relative h-[350px] md:h-[420px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSlide}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="absolute inset-0 rounded-2xl overflow-hidden"
                >
                  <Image src={pimpinanInti[activeSlide].img} alt={pimpinanInti[activeSlide].title} fill
                    className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                  <div className="absolute inset-0 lg:hidden" style={{ background: `linear-gradient(to right, ${colors.bg}4D, transparent)` }} />
                </motion.div>
              </AnimatePresence>

              {/* Thumbnail strip */}
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {pimpinanInti.map((item, i) => (
                  <button key={i} onClick={() => setActiveSlide(i)}
                    aria-label={`Lihat ${item.title}`}
                    className={`relative w-11 h-11 rounded-md overflow-hidden border-2 transition-all duration-300 ${i === activeSlide ? 'scale-110' : 'border-transparent opacity-50 hover:opacity-80'
                      }`}
                    style={{ borderColor: i === activeSlide ? colors.accent : 'transparent' }}>
                    <Image src={item.img} alt={item.title} fill className="object-cover" />
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Pengurus Sebelumnya ── */}
      <section className="py-20 px-6 md:px-16" style={{ backgroundColor: colors.bgAlt, borderBottom: `1px solid ${colors.border}` }}>
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ duration: 0.6 }}
            className="mb-12">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase mb-3">
              Pengurus <span className="text-gradient">Sebelumnya</span>
            </h2>
            <p className="font-mono text-sm max-w-lg" style={{ color: colors.textMuted }}>
              Jejak kepemimpinan PIKOM Fakultas Teknik dari masa ke masa.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {pengurusSebelumnya.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="group glass rounded-xl overflow-hidden text-center"
              >
                <div className="relative w-full aspect-square overflow-hidden">
                  <Image src={item.foto} alt={item.ketua} fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${colors.bgAlt}, transparent 60%)` }} />
                </div>
                <div className="p-4 -mt-8 relative z-10">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-full glass inline-block mb-2" style={{ color: colors.accent }}>
                    {item.periode}
                  </span>
                  <h3 className="font-bold text-sm uppercase tracking-tight">{item.ketua}</h3>
                  <p className="text-[11px] font-mono" style={{ color: colors.textMuted }}>Ketua Umum</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bidang-Bidang (Bento Grid) ── */}
      <section id="bidang" className="py-32 px-6 md:px-16">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.8, ease: 'easeOut' }}
            className="mb-20">
            <h2 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-4">
              10 <span className="text-gradient">Bidang</span>
            </h2>
            <p className="font-mono max-w-2xl" style={{ color: colors.textSecondary }}>Setiap bidang dipimpin oleh Ketua Bidang, dibantu oleh Sekretaris Bidang, dan menaungi Departemen-departemen spesifik.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(320px,1fr)]">
            {bidangData.map((bidang, index) => {
              const Icon = bidang.icon;
              let spanClasses = '';
              if (index === 0) spanClasses = 'md:col-span-2 md:row-span-2';
              else if (index === 4) spanClasses = 'md:row-span-2';
              else if (index === 6 || index === 9) spanClasses = 'md:col-span-2';
              const seed = bidang.name.toLowerCase().replace(/\s+/g, '');

              return (
                <Link href={`/bidang/${bidang.name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '')}`} key={index} className={`block ${spanClasses}`}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: (index % 4) * 0.1 }}
                  className="group relative glass rounded-2xl overflow-hidden gradient-border hover:shadow-[0_0_40px_rgba(255,215,0,0.12)] transition-all duration-500 flex flex-col justify-between h-full"
                >
                  {/* Background Image */}
                  <div className="absolute inset-0 z-0">
                    <Image src={`https://picsum.photos/seed/${seed}/800/800`} alt={bidang.name} fill
                      className="object-cover brightness-100 saturate-100 opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-300"
                      referrerPolicy="no-referrer" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${colors.cardOverlay}, transparent)` }} />
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-6 md:p-8 flex flex-col h-full justify-between">
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-3 glass rounded-xl group-hover:bg-[#FFD700] group-hover:border-[#FFD700] transition-all duration-300">
                        <Icon size={24} className="text-white/80 group-hover:text-[#3A0914] group-hover:rotate-12 transition-all duration-300" />
                      </div>
                      <span className="text-[10px] font-mono glass px-3 py-1 rounded-full transition-colors" style={{ color: colors.textMuted }}>
                        BIDANG {String(index + 1).padStart(2, '0')}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight mb-4 transition-colors">{bidang.name}</h3>
                      <p className="text-sm font-mono leading-relaxed line-clamp-3 group-hover:line-clamp-none transition-all" style={{ color: colors.textMuted }}>
                        {bidang.desc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 flex items-center justify-between text-[10px] uppercase tracking-widest font-mono opacity-0 group-hover:opacity-100 transition-all duration-300" style={{ borderTop: `1px solid ${colors.border}`, color: colors.accent }}>
                      <div className="flex gap-4"><span>Ketua</span> • <span>Sekretaris</span> • <span>Departemen</span></div>
                      <span className="flex items-center gap-1">Lihat Detail <ArrowRight size={12} /></span>
                    </div>
                  </div>
                </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <footer className="py-32 px-6 md:px-16 text-center relative overflow-hidden" style={{ borderTop: `1px solid ${colors.border}`, backgroundColor: colors.bgAlt }}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full filter blur-[80px]" style={{ background: `linear-gradient(to bottom right, ${colors.accent}33, transparent)` }} />
        </div>

        <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }} transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative z-10">
          <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase mb-8">
            Siap <span className="text-gradient">Bergerak?</span>
          </h2>
          <p className="font-mono mb-12 max-w-xl mx-auto" style={{ color: colors.textSecondary }}>
            Jadilah bagian dari perubahan. Mari bersama-sama mewujudkan cita-cita Ikatan Mahasiswa Muhammadiyah di Fakultas Teknik.
          </p>
          <button
            onClick={() => handleAction('Membuka halaman kontak...')}
            className="group glass px-12 py-5 uppercase text-[13px] font-bold tracking-[0.2em] transition-all"
          >
            Hubungi Kami
          </button>
        </motion.div>

        <div className="relative z-10 mt-32 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-mono uppercase tracking-widest" style={{ borderTop: `1px solid ${colors.border}`, color: colors.textMuted }}>
          <p>&copy; 2026 PIKOM TEKNIK IMM</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors" style={{ color: colors.textMuted }}>Instagram</a>
            <a href="#" className="transition-colors" style={{ color: colors.textMuted }}>Twitter</a>
            <a href="#" className="transition-colors" style={{ color: colors.textMuted }}>Email</a>
          </div>
        </div>
      </footer>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-50 glass p-4 rounded-full transition-all group"
            aria-label="Scroll ke atas"
          >
            <ArrowUp size={20} className="group-hover:-translate-y-0.5 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
