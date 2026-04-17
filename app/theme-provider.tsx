'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type ThemeKey = 'classic' | 'light' | 'dark';

export interface ThemeColors {
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
    textSecondary: 'rgba(255,255,255,0.82)',
    textMuted: 'rgba(255,255,255,0.68)',
    border: 'rgba(255,255,255,0.12)',
    selection: '#FFD700',
    selectionText: '#3A0914',
    gradientFrom: '#FFD700',
    gradientTo: '#FFA500',
    glassOverlay: 'rgba(255,255,255,0.06)',
    cardOverlay: '#3A0914',
    cursorBorder: 'rgba(255,215,0,0.5)',
    mobileMenuBg: 'rgba(58,9,20,0.97)',
    scrollbarTrack: '#3A0914',
    scrollbarThumb: '#FFD700',
  },
  light: {
    bg: '#FAFAFA',
    bgAlt: '#FFFFFF',
    accent: '#8A1525',
    accentSecondary: '#C41E3A',
    accentHover: '#3A0914',
    text: '#17181A',
    textSecondary: '#2D2F33',
    textMuted: '#55595F',
    border: 'rgba(23,24,26,0.1)',
    selection: '#8A1525',
    selectionText: '#FFFFFF',
    gradientFrom: '#8A1525',
    gradientTo: '#8A1525',
    glassOverlay: 'rgba(255,255,255,0.72)',
    cardOverlay: '#F4F4F4',
    cursorBorder: 'rgba(138,21,37,0.5)',
    mobileMenuBg: 'rgba(250,250,250,0.97)',
    scrollbarTrack: '#ECECEC',
    scrollbarThumb: '#8A1525',
  },
  dark: {
    bg: '#0A0A0A',
    bgAlt: '#141414',
    accent: '#E3000F',
    accentSecondary: '#FFD700',
    accentHover: '#FFFFFF',
    text: '#F5F5F5',
    textSecondary: 'rgba(255,255,255,0.82)',
    textMuted: 'rgba(255,255,255,0.66)',
    border: 'rgba(255,255,255,0.1)',
    selection: '#E3000F',
    selectionText: '#FFFFFF',
    gradientFrom: '#E3000F',
    gradientTo: '#FFD700',
    glassOverlay: 'rgba(255,255,255,0.05)',
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

interface ThemeContextValue {
  theme: ThemeKey;
  colors: ThemeColors;
  setTheme: (t: ThemeKey) => void;
  label: string;
  isLight: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'classic',
  colors: themes.classic,
  setTheme: () => { },
  label: 'Klasik',
  isLight: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeKey>(() => {
    if (typeof document === 'undefined') return 'classic';
    const attr = document.documentElement.getAttribute('data-theme') as ThemeKey | null;
    return attr && attr in themes ? attr : 'classic';
  });

  const setTheme = (t: ThemeKey) => {
    setThemeState(t);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('pikom-theme', t);
      } catch {
        /* ignore quota / disabled storage */
      }
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        colors: themes[theme],
        setTheme,
        label: themeLabels[theme],
        isLight: theme === 'light',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export const themeKeys: ThemeKey[] = ['classic', 'light', 'dark'];
export { themeLabels };
