import { createHash } from 'crypto';

/**
 * Klien untuk SIMAK GraphQL — autentikasi mahasiswa via NIM.
 * Endpoint resmi: https://sicekcok.if.unismuh.ac.id/graphql
 *
 * Struktur response (data.mahasiswaUser):
 *   { nim, nama, email, prodi, passwd }   // `passwd` = md5 hex
 */

export interface SimakUser {
  nim: string;
  nama: string;
  email: string | null;
  prodi: string | null;
  passwd: string;
}

const SIMAK_ENDPOINT =
  process.env.SIMAK_GRAPHQL_URL ?? 'https://sicekcok.if.unismuh.ac.id/graphql';

const QUERY = `query MahasiswaUser($nim: String!) {
  mahasiswaUser(nim: $nim) {
    nim
    nama
    email
    prodi
    passwd
  }
}`;

function md5(text: string): string {
  return createHash('md5').update(text, 'utf8').digest('hex');
}

/**
 * Ambil data mahasiswa dari SIMAK. Mengembalikan `null` jika tidak ditemukan
 * atau endpoint gagal (network/timeout/server error). Tidak melempar; pemanggil
 * cukup men-treat `null` sebagai "tidak valid".
 */
export async function fetchSimakUser(nim: string): Promise<SimakUser | null> {
  if (!nim) return null;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8_000);

    const res = await fetch(SIMAK_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ query: QUERY, variables: { nim } }),
      signal: controller.signal,
      cache: 'no-store',
    }).finally(() => clearTimeout(timeout));

    if (!res.ok) return null;

    const json = (await res.json()) as {
      data?: { mahasiswaUser?: SimakUser | null };
      errors?: unknown;
    };

    const user = json?.data?.mahasiswaUser;
    if (!user || !user.nim || !user.passwd) return null;
    return user;
  } catch {
    return null;
  }
}

/**
 * Verifikasi kredensial SIMAK. Mengembalikan user jika password cocok,
 * `null` jika tidak.
 */
export async function verifySimakCredentials(
  nim: string,
  password: string
): Promise<SimakUser | null> {
  const user = await fetchSimakUser(nim);
  if (!user) return null;
  const hashed = md5(password);
  return hashed.toLowerCase() === user.passwd.toLowerCase() ? user : null;
}
