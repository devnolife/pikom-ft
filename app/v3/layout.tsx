import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Lora } from 'next/font/google';
import './v3.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'PIKOM FT — Edisi v3 · Organisasi Kampus',
  description:
    'Situs resmi Pimpinan Komisariat IMM Fakultas Teknik. Anggun dalam Moral, Unggul dalam Intelektual.',
};

export default function V3Layout({ children }: { children: React.ReactNode }) {
  return (
    <div data-v3-root className={`${jakarta.variable} ${lora.variable} v3-root`}>
      {children}
    </div>
  );
}
