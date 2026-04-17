'use client';

import { useEffect, useRef, useState } from 'react';

interface StatCounterProps {
  value: number;
  label: string;
  suffix?: string;
  /** Durasi animasi counter (ms). */
  duration?: number;
}

/**
 * StatCounter — tampilkan angka dengan animasi count-up saat element masuk
 * viewport. Menghormati prefers-reduced-motion (langsung tampil nilai final).
 */
export function StatCounter({ value, label, suffix, duration = 1600 }: StatCounterProps) {
  const [count, setCount] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const prefersReduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setCount(value);
      return;
    }
    const steps = 40;
    const increment = value / steps;
    let current = 0;
    const interval = duration / steps;
    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, interval);
    return () => clearInterval(timer);
  }, [visible, value, duration]);

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl lg:text-6xl font-black text-gradient mb-2 tabular-nums">
        {count}
        {suffix || ''}
      </div>
      <div className="text-label">{label}</div>
    </div>
  );
}
