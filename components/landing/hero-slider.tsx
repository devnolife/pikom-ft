'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HeroSlide {
  src: string;
  alt: string;
  caption?: string;
}

interface HeroSliderProps {
  slides: HeroSlide[];
  /** Auto-advance interval in ms. Set 0 untuk disable. Default 5500. */
  interval?: number;
  className?: string;
}

/**
 * HeroSlider — carousel landscape foto bersama.
 * Auto-advance + manual nav (prev/next + dots). Pause saat user hover.
 * Respects prefers-reduced-motion.
 */
export function HeroSlider({ slides, interval = 5500, className }: HeroSliderProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState(1);

  const go = useCallback(
    (next: number) => {
      setDirection(next > index ? 1 : -1);
      setIndex((next + slides.length) % slides.length);
    },
    [index, slides.length]
  );

  const prev = useCallback(() => go(index - 1), [go, index]);
  const next = useCallback(() => go(index + 1), [go, index]);

  // Auto-advance
  useEffect(() => {
    if (paused || interval <= 0 || slides.length <= 1) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;
    const id = window.setInterval(() => {
      setDirection(1);
      setIndex((i) => (i + 1) % slides.length);
    }, interval);
    return () => window.clearInterval(id);
  }, [paused, interval, slides.length]);

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [prev, next]);

  const current = slides[index];

  return (
    <div
      className={cn(
        'relative w-full aspect-[16/10] md:aspect-[16/9] rounded-2xl overflow-hidden border border-border-strong bg-surface group',
        className
      )}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Galeri foto bersama PIKOM FT"
    >
      {/* Slides */}
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={index}
          custom={direction}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={current.src}
            alt={current.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority={index === 0}
            className="object-cover"
            referrerPolicy="no-referrer"
          />
          {/* Gradient overlay bawah untuk caption readability */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 40%, transparent 70%)',
            }}
          />
          {current.caption && (
            <div className="absolute bottom-5 left-5 right-16 text-white">
              <p className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-80 mb-1">
                {String(index + 1).padStart(2, '0')} · {String(slides.length).padStart(2, '0')}
              </p>
              <p className="text-sm md:text-base font-medium leading-snug drop-shadow-md">
                {current.caption}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Prev / next */}
      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Slide sebelumnya"
            className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Slide berikutnya"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-black/60 transition-all opacity-0 group-hover:opacity-100 focus-visible:opacity-100"
          >
            <ChevronRight size={18} />
          </button>

          {/* Dots */}
          <div
            className="absolute bottom-4 right-4 flex items-center gap-1.5"
            role="tablist"
            aria-label="Pilih slide"
          >
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === index}
                aria-label={`Slide ${i + 1}`}
                onClick={() => go(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  i === index
                    ? 'w-6 bg-white'
                    : 'w-1.5 bg-white/50 hover:bg-white/80'
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
