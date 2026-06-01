import type { Metadata } from 'next';
import { getBidangBySlug } from '@/lib/landing-content';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const bidang = await getBidangBySlug(slug);

  if (!bidang) {
    return {
      title: 'Bidang tidak ditemukan · PIKOM Teknik',
    };
  }

  const title = `Bidang ${bidang.name} · PIKOM Teknik`;
  const description = bidang.desc.slice(0, 160);

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function BidangLayout({ children }: { children: React.ReactNode }) {
  return children;
}
