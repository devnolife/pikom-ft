import { ImageResponse } from 'next/og';
import { bidangDetail } from '@/app/data/bidang';

export const runtime = 'edge';
export const alt = 'PIKOM Teknik IMM — Bidang';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const bidang = bidangDetail.find((b) => b.slug === params.slug);
  const name = bidang?.name ?? 'Bidang';
  const desc = bidang?.desc ?? 'Pimpinan Komisariat IMM Fakultas Teknik';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          background:
            'radial-gradient(circle at 18% 18%, #ffd70055 0%, transparent 45%),' +
            'radial-gradient(circle at 82% 12%, #ffa50033 0%, transparent 50%),' +
            'radial-gradient(circle at 78% 90%, #00a86b33 0%, transparent 55%),' +
            'linear-gradient(135deg, #8a1525 0%, #3a0914 100%)',
          color: '#fff',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Top bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 14,
            fontSize: 22,
            letterSpacing: 8,
            textTransform: 'uppercase',
            color: '#ffd700',
            fontWeight: 700,
          }}
        >
          <div style={{ display: 'flex', gap: 4 }}>
            <div style={{ width: 8, height: 28, background: '#8a1525', borderRadius: 2 }} />
            <div style={{ width: 8, height: 28, background: '#ffd700', borderRadius: 2 }} />
            <div style={{ width: 8, height: 28, background: '#00a86b', borderRadius: 2 }} />
          </div>
          <span>PIKOMFT · Bidang</span>
        </div>

        {/* Main */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <div
            style={{
              fontSize: 30,
              fontFamily: 'monospace',
              letterSpacing: 4,
              textTransform: 'uppercase',
              color: '#ffd700',
              opacity: 0.9,
            }}
          >
            Bidang
          </div>
          <div
            style={{
              fontSize: name.length > 18 ? 96 : 128,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: -3,
              textTransform: 'uppercase',
              backgroundImage: 'linear-gradient(135deg,#ffd700,#ffa500,#ffd700)',
              backgroundClip: 'text',
              color: 'transparent',
              maxWidth: 1040,
            }}
          >
            {name}
          </div>
          <div
            style={{
              fontSize: 26,
              fontFamily: 'monospace',
              lineHeight: 1.4,
              color: 'rgba(255,255,255,0.82)',
              maxWidth: 960,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {desc}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: 20,
            fontFamily: 'monospace',
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            borderTop: '1px solid rgba(255,255,255,0.15)',
            paddingTop: 28,
          }}
        >
          <span>Ikatan Mahasiswa Muhammadiyah · Fakultas Teknik</span>
          <span style={{ color: '#ffd700' }}>Periode 2025–2026</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
