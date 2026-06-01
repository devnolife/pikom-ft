'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight, ArrowUp, ChevronDown, Sparkles, Quote,
} from 'lucide-react';

import { NavBar } from '@/components/landing/nav-bar';
import { StatCounter } from '@/components/landing/stat-counter';
import { BidangCard } from '@/components/landing/bidang-card';
import { LeaderCard } from '@/components/landing/leader-card';
import { DecorativeBlobs } from '@/components/landing/decorative-blobs';
import { HeroSlider, type HeroSlide } from '@/components/landing/hero-slider';
import { Section } from '@/components/ui/section';
import { resolveBidangIcon } from '@/lib/landing-icons';
import type { LandingAssetData } from '@/lib/landing-assets';
import type {
  LandingBidangData,
  LandingPeriodeData,
  LandingPimpinanData,
  LandingContentMap,
} from '@/lib/landing-content';

const navLinks = [
  { href: '#about', label: 'Tentang' },
  { href: '#struktur', label: 'Struktur' },
  { href: '#bidang', label: 'Bidang' },
];

const heroSlideDefs: Array<{ alt: string; caption?: string }> = [
  { alt: 'Foto bersama pengurus PIKOM FT di acara pelantikan',  caption: 'Pelantikan Pengurus PIKOM Fakultas Teknik — Periode 2025–2026' },
  { alt: 'Diskusi kader dalam forum mingguan',                  caption: 'Forum Diskusi Kader — Membangun intelektual bersama' },
  { alt: 'Kegiatan pengabdian masyarakat oleh kader PIKOM FT',  caption: 'Pengabdian Masyarakat — Humanitas dalam aksi nyata' },
  { alt: 'Rapat kerja tahunan seluruh bidang',                  caption: 'Rapat Kerja Tahunan — Konsolidasi 10 bidang organisasi' },
];

const t = (content: LandingContentMap, key: string, fallback = ''): string =>
  content[key] ?? fallback;

const numOr = (content: LandingContentMap, key: string, fallback: number): number => {
  const v = Number.parseInt(content[key] ?? '', 10);
  return Number.isFinite(v) ? v : fallback;
};

interface LandingPageClientProps {
  assets: Record<string, LandingAssetData>;
  pimpinan: LandingPimpinanData[];
  bidang: LandingBidangData[];
  periode: LandingPeriodeData[];
  content: LandingContentMap;
}

export function LandingPageClient({
  assets,
  pimpinan,
  bidang,
  periode,
  content,
}: LandingPageClientProps) {
  const [activeSection, setActiveSection] = useState('about');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const heroSlides: HeroSlide[] = heroSlideDefs.map((s, i) => {
    const a = assets[`hero.${i + 1}`];
    return { src: a?.url ?? null, alt: a?.alt || s.alt, caption: s.caption };
  });

  const statsData = [
    { label: t(content, 'stats.bidang.label', 'Bidang'),       value: numOr(content, 'stats.bidang.value', bidang.length || 10) },
    { label: t(content, 'stats.pimpinan.label', 'Pimpinan Inti'), value: numOr(content, 'stats.pimpinan.value', pimpinan.length || 5) },
    { label: t(content, 'stats.kader.label', 'Kader Aktif'),   value: numOr(content, 'stats.kader.value', 120), suffix: t(content, 'stats.kader.suffix', '+') },
    { label: t(content, 'stats.periode.label', 'Periode Aktif'), value: numOr(content, 'stats.periode.value', periode.length || 4), suffix: '' },
  ];

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
                {t(content, 'hero.eyebrow', 'Periode 2025–2026')}
              </span>
            </div>

            <h1 className="font-black tracking-tighter uppercase leading-[0.9] mb-6 text-[clamp(2.5rem,6.5vw,5.5rem)]">
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.55 }}
                className="inline-block text-maroon"
              >
                {t(content, 'hero.title.1', 'Pikom')}
              </motion.span>
              <br />
              <motion.span
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.55 }}
                className="inline-block text-gold"
              >
                {t(content, 'hero.title.2', 'Teknik')}
              </motion.span>
            </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.55, duration: 0.6 }}
              className="text-base md:text-lg font-mono leading-relaxed text-fg-secondary max-w-xl mb-10"
            >
              {t(content, 'hero.tagline', 'Pimpinan Komisariat IMM di lingkup Fakultas Teknik.')}
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
                {t(content, 'hero.cta.primary', 'Jelajahi Struktur')}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </a>
              <Link
                href="/login"
                className="glass inline-flex items-center gap-2 px-7 py-3.5 rounded-full uppercase text-[11px] font-bold tracking-[0.2em] hover:bg-white/10 transition-colors"
              >
                {t(content, 'hero.cta.secondary', 'Masuk Dashboard')}
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
                  {t(content, 'hero.stat.sejak.label', 'Sejak')}
                </p>
                <p className="text-xl font-black">{t(content, 'hero.stat.sejak.value', '1964')}</p>
              </div>
              <div className="glass rounded-xl px-4 py-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent mb-1">
                  {t(content, 'hero.stat.kader.label', 'Kader')}
                </p>
                <p className="text-xl font-black">{t(content, 'hero.stat.kader.value', '120+')}</p>
              </div>
              <div className="glass rounded-xl px-4 py-3">
                <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent mb-1">
                  {t(content, 'hero.stat.bidang.label', 'Bidang')}
                </p>
                <p className="text-xl font-black">{t(content, 'hero.stat.bidang.value', '10')}</p>
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
        eyebrow={t(content, 'about.eyebrow', 'Tentang PIKOM')}
        title={t(content, 'about.title', 'Anggun dalam Moral, Unggul dalam Intelektual')}
        description={t(content, 'about.description', 'Ikatan Mahasiswa Muhammadiyah (IMM) Pimpinan Komisariat Fakultas Teknik adalah organisasi mahasiswa otonom di bawah Muhammadiyah yang bergerak di bidang keagamaan, kemahasiswaan, dan kemasyarakatan.')}
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
              &ldquo;{t(content, 'about.quote', 'IMM untuk kemanusiaan, IMM untuk ilmu, IMM untuk agama.')}&rdquo;
            </p>
            <div className="pt-4 border-t border-border">
              <p className="text-label">{t(content, 'about.quote.source', 'Falsafah Gerakan IMM')}</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {[1, 2, 3, 4].map((n, i) => {
              const label = t(content, `about.value.${n}.label`, '');
              const body = t(content, `about.value.${n}.body`, '');
              if (!label && !body) return null;
              return (
              <div
                key={n}
                className="glass rounded-2xl p-6 flex flex-col gap-3 hover:-translate-y-1 transition-transform"
              >
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-accent">
                  0{i + 1} / {label}
                </span>
                <p className="text-sm font-mono leading-relaxed text-fg-secondary">
                  {body}
                </p>
              </div>
              );
            })}
          </motion.div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          STRUKTUR PIMPINAN
          ═══════════════════════════════════════════════════════ */}
      <Section
        id="struktur"
        eyebrow={t(content, 'section.struktur.eyebrow', 'Kepemimpinan')}
        title={<>Pimpinan <span className="text-gold">Inti</span></>}
        description={t(content, 'section.struktur.description', 'Struktur kepengurusan tingkat komisariat.')}
        container="max-w-6xl"
        className="border-t border-border"
      >
        <div className="grid lg:grid-cols-12 gap-5 md:gap-6">
          {pimpinan.length === 0 ? (
            <p className="lg:col-span-12 text-center text-sm font-mono text-fg-muted py-10">
              Pimpinan inti belum diatur. Admin dapat menambahkan via dashboard.
            </p>
          ) : (
            (() => {
              const featured = pimpinan.find((p) => p.featured) ?? pimpinan[0];
              const others = pimpinan.filter((p) => p.slug !== featured.slug);
              return (
                <>
                  <div className="lg:col-span-6 lg:row-span-2">
                    <LeaderCard
                      title={featured.title}
                      role={featured.role ?? undefined}
                      nama={featured.nama}
                      img={assets[`pimpinan.${featured.slug}`]?.url ?? null}
                      index={0}
                      variant="featured"
                    />
                  </div>
                  {others.map((p, i) => (
                    <div key={p.slug} className="lg:col-span-3">
                      <LeaderCard
                        title={p.title}
                        role={p.role ?? undefined}
                        nama={p.nama}
                        img={assets[`pimpinan.${p.slug}`]?.url ?? null}
                        index={i + 1}
                      />
                    </div>
                  ))}
                </>
              );
            })()
          )}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          BIDANG — BENTO GRID
          ═══════════════════════════════════════════════════════ */}
      <Section
        id="bidang"
        eyebrow={t(content, 'section.bidang.eyebrow', `${bidang.length} Bidang`)}
        title={<>Struktur <span className="text-gold">Bidang</span></>}
        description={t(content, 'section.bidang.description', 'Setiap bidang dipimpin oleh Ketua Bidang dan Sekretaris Bidang.')}
        className="bg-bg-alt border-y border-border"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5 auto-rows-[minmax(300px,auto)] md:auto-rows-[280px]">
          {bidang.map((b, index) => {
            const variant =
              index === 0 ? 'featured' : index === 6 || index === 9 ? 'wide' : 'default';
            return (
              <BidangCard
                key={b.slug}
                name={b.name}
                desc={b.desc}
                icon={resolveBidangIcon(b.icon)}
                slug={b.slug}
                index={index}
                variant={variant}
                coverUrl={assets[`bidang.${b.slug}.cover`]?.url ?? null}
              />
            );
          })}
        </div>
      </Section>

      {/* ═══════════════════════════════════════════════════════
          PENGURUS SEBELUMNYA
          ═══════════════════════════════════════════════════════ */}
      <Section
        eyebrow={t(content, 'section.periode.eyebrow', 'Jejak Kepemimpinan')}
        title={<>Pengurus <span className="text-gold">Sebelumnya</span></>}
        description={t(content, 'section.periode.description', 'Estafet kepemimpinan dari periode ke periode.')}
        container="max-w-6xl"
      >
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
          {periode.map((item, i) => (
            <motion.div
              key={item.periode + item.ketua}
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
            {t(content, 'cta.title.before', 'Siap')} <span className="text-gold">{t(content, 'cta.title.gold', 'Bergerak?')}</span>
          </h2>
          <p className="text-base md:text-lg font-mono leading-relaxed text-fg-secondary max-w-xl mx-auto mb-10">
            {t(content, 'cta.description', 'Jadilah bagian dari perubahan.')}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 bg-accent text-[color:var(--color-selection-text)] px-8 py-4 rounded-full uppercase text-[11px] font-bold tracking-[0.2em] hover:scale-[1.02] transition-transform shadow-lg shadow-black/20"
            >
              {t(content, 'cta.button.primary', 'Masuk Dashboard')}
              <ArrowRight size={16} />
            </Link>
            <a
              href="#about"
              className="glass inline-flex items-center gap-2 px-8 py-4 rounded-full uppercase text-[11px] font-bold tracking-[0.2em] hover:bg-white/10 transition-colors"
            >
              {t(content, 'cta.button.secondary', 'Pelajari Lebih')}
            </a>
          </div>
        </motion.div>

        <div className="relative z-10 mt-20 pt-8 mx-auto max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4 text-[11px] font-mono uppercase tracking-widest text-fg-muted border-t border-border">
          <p>{t(content, 'footer.copyright', '© 2026 PIKOM TEKNIK IMM')}</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-accent transition-colors">{t(content, 'footer.link.1', 'Instagram')}</a>
            <a href="#" className="hover:text-accent transition-colors">{t(content, 'footer.link.2', 'Twitter')}</a>
            <a href="#" className="hover:text-accent transition-colors">{t(content, 'footer.link.3', 'Email')}</a>
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
