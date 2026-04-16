import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

export default async function AdminProkerPage() {
  const session = await auth();
  if (!session?.user) redirect('/login');
  // Admin uses pengurus proker page functionality
  redirect('/dashboard/pengurus/proker');
}
