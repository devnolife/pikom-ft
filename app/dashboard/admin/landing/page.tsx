import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { PageHeader } from '@/components/dashboard/page-header';
import { LandingAssetManager } from '@/components/dashboard/landing-asset-manager';
import { landingSlotDefs, getLandingAssetMap } from '@/lib/landing-assets';

export const dynamic = 'force-dynamic';

export default async function AdminLandingPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  const role = (session.user as { role: string }).role;
  if (role !== 'ADMIN') redirect('/dashboard');

  const slots = landingSlotDefs();
  const assets = await getLandingAssetMap();

  // Group by `group` field for tampilan rapi.
  const grouped: Record<string, typeof slots> = {};
  for (const s of slots) {
    (grouped[s.group] ??= []).push(s);
  }

  const initial = slots.map((s) => ({
    ...s,
    url: assets[s.key]?.url ?? null,
    alt: assets[s.key]?.alt ?? null,
  }));

  return (
    <>
      <PageHeader
        eyebrow="Landing Pages"
        title={<>Gambar <span className="text-gold">Landing</span></>}
        description="Upload foto untuk hero slider, pimpinan inti, ketua/sekretaris tiap bidang, dan cover card bidang. Slot tanpa gambar akan menampilkan placeholder inisial."
      />
      <LandingAssetManager initial={initial} groups={Object.keys(grouped)} />
    </>
  );
}
