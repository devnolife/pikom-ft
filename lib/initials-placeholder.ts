/**
 * Generate placeholder SVG (sebagai data URL) dengan inisial nama,
 * gradient warm bercorak gold/maroon agar konsisten dengan theme.
 *
 * Dipakai sebagai fallback bila slot LandingAsset belum di-upload.
 */
export function initialsDataUrl(name: string | undefined, opts?: { variant?: 'portrait' | 'square' | 'wide' }): string {
  const variant = opts?.variant ?? 'portrait';
  const { w, h } =
    variant === 'wide' ? { w: 1600, h: 900 } :
    variant === 'square' ? { w: 800, h: 800 } :
    { w: 600, h: 750 };

  const initials = getInitials(name);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#3a1a1f"/>
      <stop offset="1" stop-color="#0f0a0c"/>
    </linearGradient>
    <radialGradient id="r" cx="0.3" cy="0.25" r="0.7">
      <stop offset="0" stop-color="#ffd34a" stop-opacity="0.18"/>
      <stop offset="1" stop-color="#ffd34a" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect width="${w}" height="${h}" fill="url(#r)"/>
  <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle"
        font-family="ui-sans-serif, system-ui, sans-serif"
        font-weight="800" font-size="${Math.round(Math.min(w, h) * 0.32)}"
        fill="#ffd34a" opacity="0.85" letter-spacing="-4">${escapeXml(initials)}</text>
</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function getInitials(name?: string): string {
  if (!name) return '·';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '·';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
