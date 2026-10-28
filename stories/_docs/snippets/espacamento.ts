import type { Abas } from '../Layout';

export const espacamentoUso: Abas = {
  'HTML + CSS': { codigo: `@import url('citiesoft.tokens.css');

/* --spacing vale 0.25rem (4px). Todo espaço é um múltiplo dele. */
.cartao {
  padding: calc(var(--spacing) * 4);      /* 16px */
  border-radius: var(--radius-2xl);
}
.cartao__titulo { margin-block-end: calc(var(--spacing) * 2); } /* 8px */` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

// t.$spacing é 0.25rem (4px)
@function espaco($n) { @return t.$spacing * $n; }

.cartao {
  padding: espaco(4);   // 16px
}
.cartao__titulo { margin-block-end: espaco(2); } // 8px` },
  'Tailwind': { codigo: `<!-- p-4 = 16px, mb-2 = 8px. O número da classe multiplica 4px. -->
<div class="rounded-2xl p-4">
  <h3 class="mb-2 text-headline-medium">Solicitações</h3>
  <p class="text-body-regular text-text-secondary">12 pendentes</p>
</div>` },
  'Angular': { codigo: `/* cartao.component.scss */
:host {
  display: block;
  padding: calc(var(--spacing) * 4);
}
.titulo { margin-block-end: calc(var(--spacing) * 2); }

// PrimeNG: os componentes trazem o próprio espaçamento interno.
// Use o token só no layout ao redor deles (gap, padding de página).` },
  'React': { codigo: `import './citiesoft.tokens.css';

export function Cartao({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ padding: 'calc(var(--spacing) * 4)' }}>
      {children}
    </div>
  );
}` },
};

export const espacamentoGap: Abas = {
  'HTML + CSS': { codigo: `/* O pai decide o espaço entre os filhos. Os filhos ficam sem margem. */
.pilha {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing) * 4);   /* 16px */
}
.linha {
  display: flex;
  align-items: center;
  gap: calc(var(--spacing) * 2);   /* 8px */
}` },
  'SCSS': { codigo: `@use 'citiesoft.tokens' as t;

.pilha {
  display: flex;
  flex-direction: column;
  gap: t.$spacing * 4;
}
.linha {
  display: flex;
  align-items: center;
  gap: t.$spacing * 2;
}` },
  'Tailwind': { codigo: `<div class="flex flex-col gap-4">
  <div class="flex items-center gap-2">
    <span>Maria</span>
    <span>Em análise</span>
  </div>
  <div class="flex items-center gap-2">
    <span>João</span>
    <span>Aprovado</span>
  </div>
</div>` },
  'Angular': { codigo: `<!-- template -->
<div class="pilha">
  @for (item of itens; track item.id) {
    <app-item [dados]="item" />
  }
</div>

/* styles do componente */
.pilha { display: flex; flex-direction: column; gap: calc(var(--spacing) * 4); }` },
  'React': { codigo: `const pilha = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'calc(var(--spacing) * 4)',
} as const;

export const Lista = ({ itens }: { itens: string[] }) => (
  <div style={pilha}>
    {itens.map((i) => <span key={i}>{i}</span>)}
  </div>
);` },
};
