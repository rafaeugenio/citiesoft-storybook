import type { Abas } from '../Layout';

export const breakpointsUso: Abas = {
  'HTML + CSS': { codigo: `/* Media query não aceita var(): escreva o valor do breakpoint. */
/* sm 40rem · md 48rem · lg 64rem · xl 80rem · 2xl 96rem */
.cartoes { display: grid; grid-template-columns: 1fr; gap: calc(var(--spacing) * 4); }

@media (min-width: 40rem) { .cartoes { grid-template-columns: repeat(2, 1fr); } }
@media (min-width: 64rem) { .cartoes { grid-template-columns: repeat(4, 1fr); } }` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

// t.$breakpoint-sm, -md, -lg, -xl, -2xl
@mixin a-partir-de($bp) { @media (min-width: $bp) { @content; } }

.cartoes {
  display: grid;
  grid-template-columns: 1fr;
  gap: t.$spacing * 4;
  @include a-partir-de(t.$breakpoint-sm) { grid-template-columns: repeat(2, 1fr); }
  @include a-partir-de(t.$breakpoint-lg) { grid-template-columns: repeat(4, 1fr); }
}` },
  'Tailwind': { codigo: `<!-- Mobile primeiro: o prefixo vale do breakpoint para cima -->
<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
  <div>...</div>
</div>` },
  'Angular': { codigo: `// Lógica em TypeScript: BreakpointObserver do @angular/cdk/layout
import { BreakpointObserver } from '@angular/cdk/layout';

leitura = inject(BreakpointObserver).observe('(min-width: 64rem)');

/* Estilo: a mesma media query do CSS */
@media (min-width: 64rem) { .cartoes { grid-template-columns: repeat(4, 1fr); } }` },
  'React': { codigo: `import { useEffect, useState } from 'react';

export function useAPartirDe(largura: string) {
  const [ativo, setAtivo] = useState(false);
  useEffect(() => {
    const m = window.matchMedia(\`(min-width: \${largura})\`);
    const f = () => setAtivo(m.matches);
    f();
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, [largura]);
  return ativo;
}
// const desktop = useAPartirDe('64rem');` },
};

export const conteineresUso: Abas = {
  'HTML + CSS': { codigo: `.leitura   { max-width: var(--container-3xl); margin-inline: auto; } /* 48rem */
.formulario { max-width: var(--container-md); }                      /* 28rem */
.pagina    { max-width: var(--container-7xl); margin-inline: auto; } /* 80rem */` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

.leitura    { max-width: t.$container-3xl; margin-inline: auto; }
.formulario { max-width: t.$container-md; }` },
  'Tailwind': { codigo: `<article class="mx-auto max-w-3xl">Texto de leitura</article>
<form class="max-w-md">...</form>` },
  'Angular': { codigo: `/* componente.scss */
.leitura { max-width: var(--container-3xl); margin-inline: auto; }

// PrimeNG: aplique o max-width no elemento que envolve p-card ou p-table.` },
  'React': { codigo: `export const Leitura = ({ children }: { children: React.ReactNode }) => (
  <article style={{ maxWidth: 'var(--container-3xl)', marginInline: 'auto' }}>
    {children}
  </article>
);` },
};

export const molduraUso: Abas = {
  'HTML + CSS': { codigo: `<div class="moldura">
  <aside class="barra">Navegação</aside>
  <main class="principal">
    <div class="coluna">Conteúdo</div>
  </main>
</div>

<style>
.moldura   { display: flex; gap: calc(var(--spacing) * 4); padding: calc(var(--spacing) * 3);
             height: 100dvh; background: var(--color-background-full); }
.barra     { display: none; width: 260px; flex-shrink: 0; }
.principal { flex: 1; min-width: 0; display: flex; justify-content: center; overflow-y: auto; }
.coluna    { width: 100%; max-width: 1300px; display: flex; flex-direction: column; gap: 10px; }
@media (min-width: 64rem) { .barra { display: block; } } /* a partir de lg */
</style>` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

.moldura {
  display: flex;
  gap: t.$spacing * 4;       // 16px
  padding: t.$spacing * 3;   // 12px
  height: 100dvh;
}
.barra { display: none; width: 260px; flex-shrink: 0; }
.principal { flex: 1; min-width: 0; display: flex; justify-content: center; overflow-y: auto; }
.coluna { width: 100%; max-width: 1300px; display: flex; flex-direction: column; gap: 10px; }
@media (min-width: t.$breakpoint-lg) { .barra { display: block; } }` },
  'Tailwind': { codigo: `<div class="flex h-dvh w-full gap-4 bg-background-full p-3">
  <aside class="hidden w-[260px] shrink-0 lg:block">Navegação</aside>
  <main class="flex min-w-0 flex-1 justify-center overflow-y-auto">
    <div class="flex w-full max-w-[1300px] flex-col gap-2.5">
      Conteúdo
    </div>
  </main>
</div>` },
  'Angular': { codigo: `<!-- app.component.html -->
<div class="moldura">
  <aside class="barra"><app-menu /></aside>
  <main class="principal">
    <div class="coluna"><router-outlet /></div>
  </main>
</div>

/* app.component.scss: mesmas regras do CSS puro */
// PrimeNG: p-drawer cumpre o papel da barra abaixo de lg.` },
  'React': { codigo: `export function Moldura({ barra, children }: { barra: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex h-dvh w-full gap-4 bg-background-full p-3">
      <aside className="hidden w-[260px] shrink-0 lg:block">{barra}</aside>
      <main className="flex min-w-0 flex-1 justify-center overflow-y-auto">
        <div className="flex w-full max-w-[1300px] flex-col gap-2.5">{children}</div>
      </main>
    </div>
  );
}
// Sem Tailwind, troque as classes pelo CSS da aba HTML + CSS.` },
};

export const gridUso: Abas = {
  'HTML + CSS': { codigo: `/* Colunas que se ajustam à largura disponível, sem media query */
.grade {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(16rem, 1fr)); /* container-3xs */
  gap: calc(var(--spacing) * 4);
}

/* Duas colunas no celular, quatro no desktop (padrão dos cartões de indicador) */
.indicadores { display: grid; grid-template-columns: repeat(2, 1fr); gap: calc(var(--spacing) * 4); }
@media (min-width: 64rem) { .indicadores { grid-template-columns: repeat(4, 1fr); } }` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

.grade {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(t.$container-3xs, 1fr));
  gap: t.$spacing * 4;
}
.indicadores {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: t.$spacing * 4;
  @media (min-width: t.$breakpoint-lg) { grid-template-columns: repeat(4, 1fr); }
}` },
  'Tailwind': { codigo: `<div class="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-4">...</div>

<div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
  <div>Indicador</div>
</div>` },
  'Angular': { codigo: `<div class="indicadores">
  @for (i of indicadores; track i.id) {
    <app-indicador [dados]="i" />
  }
</div>

/* styles: regras .indicadores do CSS puro */
// PrimeNG: p-table e p-card ocupam a célula inteira (width: 100%) do grid.` },
  'React': { codigo: `export const Indicadores = ({ itens }: { itens: React.ReactNode[] }) => (
  <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">{itens}</div>
);
// Sem Tailwind, use as regras .indicadores da aba HTML + CSS.` },
};

export const rtlUso: Abas = {
  'HTML + CSS': { codigo: `<html lang="ar" dir="rtl">

/* Propriedades lógicas seguem a direção do texto */
.icone  { margin-inline-end: calc(var(--spacing) * 2); }   /* ms/me no Tailwind */
.campo  { padding-inline: calc(var(--spacing) * 3) calc(var(--spacing) * 2); }
.rotulo { text-align: start; }
.fixo   { inset-inline-start: 0; }
.aba    { border-start-start-radius: var(--radius-lg); border-end-start-radius: var(--radius-lg); }` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

.icone { margin-inline-end: t.$spacing * 2; }
.rotulo { text-align: start; }

// Quando precisar de um ajuste só em RTL:
[dir='rtl'] .seta { transform: scaleX(-1); }` },
  'Tailwind': { codigo: `<!-- ms/me = margin-inline-start/end · ps/pe = padding-inline-start/end -->
<button class="flex items-center gap-2 ps-3 pe-2 text-start">
  <svg class="me-2 rtl:-scale-x-100">...</svg>
  Voltar
</button>
<aside class="start-0 rounded-s-lg">...</aside>` },
  'Angular': { codigo: `<!-- index.html -->
<html lang="ar" dir="rtl">

// Ler a direção em um componente
import { Directionality } from '@angular/cdk/bidi';
dir = inject(Directionality).value; // 'ltr' | 'rtl'

/* componente.scss: use margin-inline-*, padding-inline-*, text-align: start */` },
  'React': { codigo: `import { DirectionProvider } from '@/components/foundations/direction/direction';

export default function Raiz({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        {/* locale em BCP 47: 'ar' e 'he' viram RTL, 'pt-BR' fica LTR */}
        <DirectionProvider locale="ar">{children}</DirectionProvider>
      </body>
    </html>
  );
}

// Dentro de um menu em portal: const dir = useDirection(); <div dir={dir}>` },
};
