import { LandingPageClient } from '@/components/landing/landing-page-client';
import { getLandingAssetMap } from '@/lib/landing-assets';

/**
 * Server Component: fetch semua LandingAsset sekali, lalu render UI client.
 * Asset di-upload via /dashboard/admin/landing.
 */
export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const assets = await getLandingAssetMap();
  return <LandingPageClient assets={assets} />;
}
