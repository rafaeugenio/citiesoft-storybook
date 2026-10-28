import type { AnchorHTMLAttributes } from 'react';

/**
 * Substituto de `next/link` para o Storybook, que roda em Vite e não tem o Next.
 * Os componentes do Citiesoft importam `next/link`; nos sistemas consumidores (Next.js)
 * o import real continua valendo, este arquivo só existe aqui.
 */
type Props = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; prefetch?: boolean; replace?: boolean; scroll?: boolean };

export default function Link({ prefetch: _p, replace: _r, scroll: _s, ...props }: Props) {
  return <a {...props} />;
}
