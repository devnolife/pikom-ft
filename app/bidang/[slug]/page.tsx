import { BidangDetailClient } from '@/components/landing/bidang-detail-client';
import { getLandingAsset } from '@/lib/landing-assets';

/**
 * Server Component: fetch foto ketua & sekretaris untuk bidang ini,
 * lalu render UI client. Konten tekstual tetap dari `app/data/bidang.ts`.
 */
export const dynamic = 'force-dynamic';

export default async function BidangPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [ketua, sekretaris] = await Promise.all([
    getLandingAsset(`bidang.${slug}.ketua`),
    getLandingAsset(`bidang.${slug}.sekretaris`),
  ]);
  return (
    <BidangDetailClient
      slug={slug}
      ketuaImg={ketua?.url ?? null}
      sekretarisImg={sekretaris?.url ?? null}
    />
  );
}
