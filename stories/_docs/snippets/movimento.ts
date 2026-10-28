import type { Abas } from '../Layout';

export const movimentoUso: Abas = {
  'HTML/CSS': { codigo: `<link rel="stylesheet" href="citiesoft.tokens.css">

.botao {
  transition:
    background-color var(--button-transition-ms) var(--ease-in-out),
    color var(--button-transition-ms) var(--ease-in-out);
}
.painel {
  transition: opacity 200ms var(--ease-out), transform 200ms var(--ease-out);
}` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

@mixin transicao($props...) {
  transition-property: $props;
  transition-duration: var(--default-transition-duration);
  transition-timing-function: var(--default-transition-timing-function);
}

.botao { @include transicao(background-color, color); }
.painel { transition: opacity 200ms var(--ease-out); }` },
  'Tailwind': { codigo: `<!-- 150ms e ease-in-out são o padrão de transition-* -->
<button class="transition-colors hover:bg-background-primary-hover">Salvar</button>

<!-- entrada: 200ms com ease-out -->
<div class="transition-[opacity,translate] duration-200 ease-out data-[closed]:opacity-0"></div>` },
  'Angular': { codigo: `// painel.component.ts
import { trigger, transition, style, animate } from '@angular/animations';

export const entrada = trigger('entrada', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(4px)' }),
    animate('200ms cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: 'none' })),
  ]),
  transition(':leave', [animate('150ms cubic-bezier(0.4, 0, 1, 1)', style({ opacity: 0 }))]),
]);` },
  'React': { codigo: `export function Painel({ aberto, children }: { aberto: boolean; children: React.ReactNode }) {
  return (
    <div
      className="transition-[opacity,translate] duration-200 ease-out"
      style={{ opacity: aberto ? 1 : 0, translate: aberto ? '0 0' : '0 4px' }}
      aria-hidden={!aberto}
    >
      {children}
    </div>
  );
}` },
};

export const movimentoInterrompivel: Abas = {
  'HTML/CSS': { codigo: `/* Uma transition parte do valor atual ao inverter. Keyframes reiniciam do começo. */
.gaveta {
  transform: translateX(100%);
  transition: transform 200ms var(--ease-out);
}
.gaveta[data-aberta] { transform: none; }` },
  'SCSS': { codigo: `.gaveta {
  transform: translateX(100%);
  transition: transform 200ms var(--ease-out);

  &[data-aberta] { transform: none; }
}` },
  'Tailwind': { codigo: `<aside
  class="translate-x-full transition-transform duration-200 ease-out data-[aberta]:translate-x-0"
  data-aberta
></aside>` },
  'Angular': { codigo: `<!-- Prefira classe + transition CSS a @trigger quando o estado alterna rápido -->
<aside class="gaveta" [attr.data-aberta]="aberta() ? '' : null"></aside>` },
  'React': { codigo: `export const Gaveta = ({ aberta }: { aberta: boolean }) => (
  <aside
    className="translate-x-full transition-transform duration-200 ease-out data-[aberta]:translate-x-0"
    data-aberta={aberta ? '' : undefined}
  />
);` },
};

export const movimentoReduzido: Abas = {
  'HTML/CSS': { codigo: `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}` },
  'SCSS': { codigo: `@mixin sem-movimento {
  @media (prefers-reduced-motion: reduce) { @content; }
}

.painel {
  transition: transform 200ms var(--ease-out);
  @include sem-movimento { transition: none; transform: none; }
}` },
  'Tailwind': { codigo: `<div class="transition-transform duration-200 motion-reduce:transition-none motion-reduce:transform-none"></div>

<!-- só anima quando o usuário não pediu redução -->
<span class="motion-safe:animate-pulse"></span>` },
  'Angular': { codigo: `// app.config.ts: desliga @trigger quando o sistema pede movimento reduzido
import { provideAnimations, provideNoopAnimations } from '@angular/platform-browser/animations';

const reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
export const appConfig = {
  providers: [reduz ? provideNoopAnimations() : provideAnimations()],
};` },
  'React': { codigo: `import { useEffect, useState } from 'react';

export function useMovimentoReduzido() {
  const [reduz, setReduz] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduz(m.matches);
    const f = () => setReduz(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  return reduz;
}` },
};

export const movimentoBotao: Abas = {
  'HTML/CSS': { codigo: `.botao {
  transition:
    background-color var(--button-transition-ms) ease,
    border-color var(--button-transition-ms) ease,
    box-shadow var(--button-transition-ms) ease,
    color var(--button-transition-ms) ease,
    transform 420ms cubic-bezier(0.4, 0, 0.2, 1);
}
.botao:active:not(:disabled) {
  transform: scale(0.98);
  transition-duration: 150ms, 150ms, 150ms, 150ms, 220ms;
}
@media (prefers-reduced-motion: reduce) {
  .botao { transition: none; transform: none; }
}` },
  'Tailwind': { codigo: `<!-- utilitário button-press-motion definido em styles/theme.css -->
<button class="button-press-motion bg-button-primary">Salvar</button>` },
};
