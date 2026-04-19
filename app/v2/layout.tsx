import type { Metadata } from 'next';
import { Fraunces, JetBrains_Mono, Inter } from 'next/font/google';
import './v2.css';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz', 'SOFT', 'WONK'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-v2',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter-v2',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PIKOM FT — Manifesto Edisi v2',
  description:
    'Edisi editorial dari Pimpinan Komisariat IMM Fakultas Teknik. Tinta maroon, kertas krem, garis tegas.',
};

export default function V2Layout({ children }: { children: React.ReactNode }) {
  return (
    <div
      data-v2-root
      className={`${fraunces.variable} ${mono.variable} ${inter.variable} v2-root`}
    >
      {children}
    </div>
  );
}
