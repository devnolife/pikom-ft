'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ThemeKey = 'classic' | 'light' | 'dark';

interface ThemeColors {
  bg: string;
  bgAlt: string;
  accent: string;
  accentSecondary: string;
  accentHover: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  selection: string;
  selectionText: string;
  gradientFrom: string;
  gradientTo: string;
  glassOverlay: string;
  cardOverlay: string;
  cursorBorder: string;
  mobileMenuBg: string;
  scrollbarTrack: string;
  scrollbarThumb: string;
}

const themes: Record<ThemeKey, ThemeColors> = {
  classic: {
    bg: '#8A1525',
    bgAlt: '#3A0914',
    accent: '#FFD700',
    accentSecondary: '#FFA500',
    accentHover: '#FFFFFF',
    text: '#FFFFFF',
    textSecondary: 'rgba(255,255,255,0.7)',
    textMuted: 'rgba(255,255,255,0.5)',
    border: 'rgba(255,255,255,0.1)',
    selection: '#FFD700',
    selectionText: '#3A0914',
    gradientFrom: '#FFD700',
    gradientTo: '#FFA500',
    glassOverlay: 'rgba(255,255,255,0.05)',
    cardOverlay: '#3A0914',
    cursorBorder: 'rgba(255,215,0,0.5)',
    mobileMenuBg: 'rgba(58,9,20,0.95)',
    scrollbarTrack: '#3A0914',
    scrollbarThumb: '#FFD700',
  },
  light: {
    bg: '#FAFAFA',
    bgAlt: '#FFFFFF',
    accent: '#C41E3A',
    accentSecondary: '#FFD700',
    accentHover: '#8A1525',
    text: '#1A1A1A',
    textSecondary: '#555555',
    textMuted: '#888888',
    border: 'rgba(0,0,0,0.08)',
    selection: '#C41E3A',
    selectionText: '#FFFFFF',
    gradientFrom: '#C41E3A',
    gradientTo: '#C41E3A',
    glassOverlay: 'rgba(0,0,0,0.03)',
    cardOverlay: '#F0F0F0',
    cursorBorder: 'rgba(196,30,58,0.5)',
    mobileMenuBg: 'rgba(250,250,250,0.97)',
    scrollbarTrack: '#F0F0F0',
    scrollbarThumb: '#C41E3A',
  },
  dark: {
    bg: '#0A0A0A',
    bgAlt: '#141414',
    accent: '#E3000F',
    accentSecondary: '#FFD700',
    accentHover: '#FFFFFF',
    text: '#F5F5F5',
    textSecondary: 'rgba(255,255,255,0.6)',
    textMuted: 'rgba(255,255,255,0.4)',
    border: 'rgba(255,255,255,0.08)',
    selection: '#E3000F',
    selectionText: '#FFFFFF',
    gradientFrom: '#E3000F',
    gradientTo: '#FFD700',
    glassOverlay: 'rgba(255,255,255,0.04)',
    cardOverlay: '#141414',
    cursorBorder: 'rgba(227,0,15,0.5)',
    mobileMenuBg: 'rgba(10,10,10,0.97)',
    scrollbarTrack: '#141414',
    scrollbarThumb: '#E3000F',
  },
};

const themeLabels: Record<ThemeKey, string> = {
  classic: 'Klasik',
  light: 'Terang',
  dark: 'Gelap',
};

interface ThemeContext {
  theme: ThemeKey;
  colors: ThemeColors;
  setTheme: (t: ThemeKey) => void;
  label: string;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContext>({
  theme: 'classic',
  colors: themes.classic,
  setTheme: () => {},
  label: 'Klasik',
  isLight: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>('classic');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('pikom-theme') as ThemeKey | null;
    if (saved && themes[saved]) setThemeState(saved);
    setMounted(true);
  }, []);

  const setTheme = (t: ThemeKey) => {
    setThemeState(t);
    localStorage.setItem('pikom-theme', t);
  };

  useEffect(() => {
    if (!mounted) return;
    const c = themes[theme];
    const root = document.documentElement;
    root.style.setProperty('--color-bg', c.bg);
    root.style.setProperty('--color-bg-alt', c.bgAlt);
    root.style.setProperty('--color-accent', c.accent);
    root.style.setProperty('--color-accent-secondary', c.accentSecondary);
    root.style.setProperty('--color-accent-hover', c.accentHover);
    root.style.setProperty('--color-text', c.text);
    root.style.setProperty('--color-text-secondary', c.textSecondary);
    root.style.setProperty('--color-text-muted', c.textMuted);
    root.style.setProperty('--color-border', c.border);
    root.style.setProperty('--color-selection', c.selection);
    root.style.setProperty('--color-selection-text', c.selectionText);
    root.style.setProperty('--color-gradient-from', c.gradientFrom);
    root.style.setProperty('--color-gradient-to', c.gradientTo);
    root.style.setProperty('--color-glass-overlay', c.glassOverlay);
    root.style.setProperty('--color-card-overlay', c.cardOverlay);
    root.style.setProperty('--color-cursor-border', c.cursorBorder);
    root.style.setProperty('--color-mobile-menu-bg', c.mobileMenuBg);
    root.style.setProperty('--color-scrollbar-track', c.scrollbarTrack);
    root.style.setProperty('--color-scrollbar-thumb', c.scrollbarThumb);
  }, [theme, mounted]);

  if (!mounted) return null;

  return (
    <ThemeContext value={{
      theme,
      colors: themes[theme],
      setTheme,
      label: themeLabels[theme],
      isLight: theme === 'light',
    }}>
      {children}
    </ThemeContext>
  );
}

export const themeKeys: ThemeKey[] = ['classic', 'light', 'dark'];
export { themeLabels };
