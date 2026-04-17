/**
 * Helper untuk menjalankan SPA navigation dengan View Transitions API.
 * Gracefully fallback bila browser tidak support (Firefox/Safari lama).
 */
import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

type StartVT = (cb: () => void) => { finished: Promise<void> };

export function startViewTransition(cb: () => void): void {
  const doc = document as Document & { startViewTransition?: StartVT };
  if (typeof doc.startViewTransition !== 'function') {
    cb();
    return;
  }
  doc.startViewTransition(cb);
}

/**
 * Membungkus router navigation agar browser memulai view transition
 * saat DOM root berganti.
 */
export function navigateWithTransition(
  router: AppRouterInstance,
  href: string,
  options?: { replace?: boolean }
): void {
  startViewTransition(() => {
    if (options?.replace) router.replace(href);
    else router.push(href);
  });
}
