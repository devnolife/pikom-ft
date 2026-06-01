import { LandingPageClient } from '@/components/landing/landing-page-client';
import { getLandingAssetMap } from '@/lib/landing-assets';
import { getLandingPageData } from '@/lib/landing-content';

// Halaman di-cache dan hanya di-render ulang saat admin mengedit
// (lib/actions/landing.ts memanggil revalidatePath('/', 'layout')).
// revalidate menjadi fallback berbasis waktu (1 jam) bila DB diubah langsung.
export const revalidate = 3600;

export default async function LandingPage() {
  const [assets, data] = await Promise.all([
    getLandingAssetMap(),
    getLandingPageData(),
  ]);
  return (
    <LandingPageClient
      assets={assets}
      pimpinan={data.pimpinan}
      bidang={data.bidang}
      periode={data.periode}
      content={data.content}
    />
  );
}
