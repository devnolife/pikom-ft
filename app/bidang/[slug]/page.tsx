import { BidangDetailClient } from '@/components/landing/bidang-detail-client';
import { getLandingAsset } from '@/lib/landing-assets';
import { getBidangBySlug } from '@/lib/landing-content';

export const dynamic = 'force-dynamic';

export default async function BidangPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [bidang, ketua, sekretaris] = await Promise.all([
    getBidangBySlug(slug),
    getLandingAsset(`bidang.${slug}.ketua`),
    getLandingAsset(`bidang.${slug}.sekretaris`),
  ]);
  return (
    <BidangDetailClient
      slug={slug}
      bidang={bidang}
      ketuaImg={ketua?.url ?? null}
      sekretarisImg={sekretaris?.url ?? null}
    />
  );
}
