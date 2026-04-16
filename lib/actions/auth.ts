'use server';

import { signIn } from '@/lib/auth';
import { AuthError } from 'next-auth';

export async function loginAction(_prevState: { error?: string } | undefined, formData: FormData) {
  const nim = formData.get('nim') as string;
  const password = formData.get('password') as string;

  if (!nim || !password) {
    return { error: 'NIM dan password wajib diisi' };
  }

  try {
    await signIn('credentials', {
      nim,
      password,
      redirect: false,
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'NIM atau password salah' };
    }
    throw error;
  }

  // Return success - client will redirect
  return { success: true };
}
