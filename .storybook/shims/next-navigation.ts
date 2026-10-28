import { useSyncExternalStore } from 'react';

/**
 * Substituto de `next/navigation` para o Storybook (Vite). `usePathname` devolve o caminho
 * atual da página e `useRouter` só registra a navegação, sem sair da story.
 */
const subscribe = (cb: () => void) => {
  window.addEventListener('popstate', cb);
  return () => window.removeEventListener('popstate', cb);
};

export function usePathname(): string {
  return useSyncExternalStore(subscribe, () => window.location.pathname, () => '/');
}

export function useRouter() {
  return {
    push: (href: string) => console.info('[router.push]', href),
    replace: (href: string) => console.info('[router.replace]', href),
    back: () => {},
    forward: () => {},
    refresh: () => {},
    prefetch: () => {},
  };
}
