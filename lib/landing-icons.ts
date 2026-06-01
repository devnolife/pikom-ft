/**
 * Daftar icon Lucide yang boleh dipilih admin untuk bidang.
 * Dibatasi agar bundle tidak meledak dan UI dropdown tetap rapi.
 */
import {
  Network, Users, FlaskConical, Flower2, Landmark, BookOpen,
  TrendingUp, HeartHandshake, Palette, Radio, Sparkles, Star,
  Heart, Lightbulb, Megaphone, Trophy, ShieldCheck, Globe,
  Briefcase, Building2, GraduationCap, Wrench, Code, Music,
  type LucideIcon,
} from 'lucide-react';

export const LANDING_BIDANG_ICONS: Record<string, LucideIcon> = {
  Network, Users, FlaskConical, Flower2, Landmark, BookOpen,
  TrendingUp, HeartHandshake, Palette, Radio, Sparkles, Star,
  Heart, Lightbulb, Megaphone, Trophy, ShieldCheck, Globe,
  Briefcase, Building2, GraduationCap, Wrench, Code, Music,
};

export const LANDING_BIDANG_ICON_NAMES = Object.keys(LANDING_BIDANG_ICONS);

export function resolveBidangIcon(name: string | null | undefined): LucideIcon {
  if (!name) return Sparkles;
  return LANDING_BIDANG_ICONS[name] ?? Sparkles;
}
