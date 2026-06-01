import { LandingPageClient } from '@/components/landing/landing-page-client';
import { getLandingAssetMap } from '@/lib/landing-assets';
import { getLandingPageData } from '@/lib/landing-content';

export const dynamic = 'force-dynamic';

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
