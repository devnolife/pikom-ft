import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardRedirect() {
  const session = await auth();
  if (!session?.user) redirect('/login');

  const role = (session.user as { role: string }).role;
  const jabatan = (session.user as { jabatan?: string | null }).jabatan ?? null;

  if (role === 'ADMIN') redirect('/dashboard/admin');
  if (role === 'MAHASISWA') redirect('/dashboard/mahasiswa');

  // PENGURUS — by jabatan
  switch (jabatan) {
    case 'KETUA_UMUM':
      redirect('/dashboard/ketua');
    case 'SEKRETARIS_UMUM':
      redirect('/dashboard/sekum/persuratan');
    case 'BENDAHARA_UMUM':
      redirect('/dashboard/bendahara');
    case 'KETUA_BIDANG':
    case 'ANGGOTA_BIDANG':
    default:
      redirect('/dashboard/pengurus');
  }
}
