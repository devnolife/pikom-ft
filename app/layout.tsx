import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';
import { ThemeProvider } from './theme-provider';
import { AuthProvider } from './providers';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001'
  ),
  title: 'PIKOM FT — Ikatan Mahasiswa Muhammadiyah',
  description:
    'Website resmi Pimpinan Komisariat IMM Fakultas Teknik. Anggun dalam Moral, Unggul dalam Intelektual.',
};

/**
 * Pre-hydration script: baca theme dari localStorage dan setel `data-theme`
 * pada `<html>` SEBELUM CSS + React render. Mencegah flash of wrong theme.
 */
const themeBootScript = `(function(){try{var t=localStorage.getItem('pikom-theme');if(t!=='classic'&&t!=='light'&&t!=='dark')t='classic';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','classic');}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="id"
      data-theme="classic"
      className={cn('scroll-smooth', inter.variable, jetbrainsMono.variable)}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body className="font-sans antialiased bg-bg text-fg" suppressHydrationWarning>
        <ThemeProvider>
          <AuthProvider>{children}</AuthProvider>
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              classNames: {
                toast: 'border-border',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
