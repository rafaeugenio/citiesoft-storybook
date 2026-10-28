import type { Abas } from '../Layout';

export const responsivoExemplo: Abas = {
  'HTML/CSS': { codigo: `/* Pontos de quebra oficiais: 375, 768, 1366 e 1920 px */
.lancamentos .tabela { display: none; }
.lancamentos .cartoes { display: grid; gap: 12px; }

@media (min-width: 768px) {
  .lancamentos .tabela { display: table; }
  .lancamentos .cartoes { display: none; }
}

/* Alvos de toque */
button, a.acao { min-height: 32px; }
@media (max-width: 1365px) { button, a.acao { min-height: 44px; min-width: 44px; } }

/* Cabeçalho fixo não pode cobrir o foco */
:target, :focus { scroll-margin-top: 64px; }` },
  'Angular com PrimeNG': { codigo: `// layout.component.ts
private bp = inject(BreakpointObserver);
mobile = toSignal(this.bp.observe('(max-width: 767px)').pipe(map((r) => r.matches)), { initialValue: false });

<!-- layout.component.html -->
@if (mobile()) {
  <ul>
    @for (l of lancamentos(); track l.id) {
      <li><app-cartao-lancamento [lancamento]="l" /></li>
    }
  </ul>
} @else {
  <p-table [value]="lancamentos()" [scrollable]="true" />
}

<p-drawer [(visible)]="menu" [fullScreen]="mobile()" />` },
  'React': { codigo: `import { useSyncExternalStore } from 'react';

function useMedia(consulta: string) {
  return useSyncExternalStore(
    (cb) => {
      const m = window.matchMedia(consulta);
      m.addEventListener('change', cb);
      return () => m.removeEventListener('change', cb);
    },
    () => window.matchMedia(consulta).matches,
    () => false,
  );
}

const cartoes = useMedia('(max-width: 767px)');
return cartoes ? <ListaDeCartoes linhas={linhas} /> : <TabelaDeLancamentos linhas={linhas} />;` },
};
