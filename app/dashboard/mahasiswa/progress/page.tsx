import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function MahasiswaProgressPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  // The progress is shown on the main mahasiswa page
  redirect('/dashboard/mahasiswa');
}
