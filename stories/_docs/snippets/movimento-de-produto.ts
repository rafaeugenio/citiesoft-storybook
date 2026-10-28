import type { Abas } from '../Layout';

export const pressEOptIn: Abas = {
  'Angular (PrimeNG)': { codigo: `// styles.scss: estado base estático, animação só com preferência liberada
@media (prefers-reduced-motion: no-preference) {
  .p-button:not(:disabled):active { transform: scale(0.97); }
  .p-button {
    transition: transform var(--motion-press) var(--ease-citie-out),
                background-color var(--motion-press) var(--ease-citie-out);
  }
}

// Overlays do PrimeNG: entrada com teto de 300 ms, saída em 75%
dialogShow = '300ms cubic-bezier(0.16, 1, 0.3, 1)';
dialogHide = '225ms cubic-bezier(0.3, 0, 1, 1)';`, linguagem: 'scss' },
  'HTML/CSS': { codigo: `:is(.btn, .card-link, .tab):not([disabled]):active { transform: scale(0.97); }

.card-interativo {
  transition: transform var(--motion-quick) var(--ease-citie-out),
              box-shadow var(--motion-quick) var(--ease-citie-out);
}
@media (hover: hover) and (pointer: fine) {
  .card-interativo:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }
}

.tabela tbody tr td { transition: background-color var(--motion-press) linear; }`, linguagem: 'css' },
  'React': { codigo: `// Respeita a preferência do sistema
const reduzido = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const duracao = reduzido ? 0 : 180;

element.animate(
  [{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
  { duration: duracao, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' },
);`, linguagem: 'tsx' },
};

export const carregamento: Abas = {
  'HTML/CSS': { codigo: `<div class="card" aria-busy="true">
  <span class="sr-only" role="status">Carregando registros, aguarde.</span>
  <div class="skeleton"></div>
  <div class="skeleton" style="width:55%"></div>
</div>

.skeleton { height: 14px; animation: shimmer 1.6s linear infinite; }
.spinner  { animation: spin 700ms linear infinite; }
@media (prefers-reduced-motion: reduce) {
  .skeleton { animation: none; }
  .spinner  { animation-duration: 1.2s; }
}`, linguagem: 'html' },
  'Angular (PrimeNG)': { codigo: `<p-button label="Salvar lançamento" [loading]="enviando()" [disabled]="enviando()" />

<div [attr.aria-busy]="carregando()">
  @if (carregando()) {
    <p-skeleton width="100%" height="2rem" />
  }
</div>`, linguagem: 'html' },
  'React': { codigo: `<button disabled={enviando} aria-busy={enviando}>
  {enviando ? 'Salvando…' : 'Salvar lançamento'}
</button>`, linguagem: 'tsx' },
};
