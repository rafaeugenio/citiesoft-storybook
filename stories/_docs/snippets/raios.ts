import type { Abas } from '../Layout';

export const raiosUso: Abas = {
  'HTML + CSS': { codigo: `@import url('citiesoft.tokens.css');

.cartao { border-radius: var(--radius-2xl); }   /* 16px */
.campo  { border-radius: var(--radius-2lg); }   /* 10px */
.botao  { border-radius: var(--radius-2lg); }   /* 10px */
.botao--pequeno { border-radius: var(--radius-lg); } /* 8px */
.pilula { border-radius: 9999px; }              /* sem token: use um valor alto */` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

.cartao { border-radius: t.$radius-2xl; }
.campo  { border-radius: t.$radius-2lg; }
.botao  { border-radius: t.$radius-2lg; }
.pilula { border-radius: 9999px; }` },
  'Tailwind': { codigo: `<div class="rounded-2xl border p-4">Cartão</div>
<input class="rounded-2lg border px-1.5 py-2" />
<button class="h-9 rounded-2lg p-2">Salvar</button>
<span class="rounded-full px-2 py-1">Aprovado</span>` },
  'Angular': { codigo: `/* componente.scss */
.cartao { border-radius: var(--radius-2xl); }
.campo  { border-radius: var(--radius-2lg); }

// PrimeNG: sobrescreva o raio dos componentes no CSS do tema
// com var(--radius-2lg) para campos e botões.` },
  'React': { codigo: `export const Cartao = ({ children }: { children: React.ReactNode }) => (
  <div style={{ borderRadius: 'var(--radius-2xl)' }}>{children}</div>
);

export const Pilula = ({ children }: { children: React.ReactNode }) => (
  <span style={{ borderRadius: 9999 }}>{children}</span>
);` },
};

export const raiosAninhados: Abas = {
  'HTML + CSS': { codigo: `/* Raio interno = raio externo menos o espaço entre eles */
.painel { padding: calc(var(--spacing) * 2); border-radius: var(--radius-2xl); } /* 16px, 8px */
.painel > .item { border-radius: var(--radius-lg); }                              /* 16 - 8 = 8px */` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

.painel {
  padding: t.$spacing * 2;      // 8px
  border-radius: t.$radius-2xl; // 16px
  > .item { border-radius: t.$radius-lg; } // 8px
}` },
  'Tailwind': { codigo: `<div class="rounded-2xl p-2">
  <div class="rounded-lg">Item</div>
</div>` },
  'Angular': { codigo: `.painel { padding: calc(var(--spacing) * 2); border-radius: var(--radius-2xl); }
.painel .item { border-radius: var(--radius-lg); }` },
  'React': { codigo: `<div style={{ padding: 'calc(var(--spacing) * 2)', borderRadius: 'var(--radius-2xl)' }}>
  <div style={{ borderRadius: 'var(--radius-lg)' }}>Item</div>
</div>` },
};
