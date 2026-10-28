import type { Abas } from '../Layout';

export const motionTokensCodigo: Abas = {
  'CSS': { linguagem: 'css', codigo: `.painel {
  transition:
    opacity var(--motion-standard) var(--ease-citie-out),
    transform var(--motion-standard) var(--ease-citie-out);
}
.painel[data-saindo] {
  transition-duration: var(--motion-quick);
  transition-timing-function: var(--ease-citie-exit);
}
.gaveta { transition: transform var(--motion-expressive) var(--ease-citie-drawer); }

@media (prefers-reduced-motion: reduce) {
  :root {
    --motion-press: 0ms;
    --motion-quick: 0ms;
    --motion-standard: 0ms;
    --motion-expressive: 0ms;
    --motion-hero: 0ms;
  }
}` },
  'Tailwind': { linguagem: 'xml', codigo: `<!-- Com os tokens do tema carregados -->
<div
  class="transition-[opacity,translate] duration-(--motion-standard) ease-(--ease-citie-out) motion-reduce:transition-none"
></div>` },
  'Angular': { linguagem: 'typescript', codigo: `// painel.component.ts
@Component({
  selector: 'app-painel',
  template: '<div class="painel"><ng-content /></div>',
  styles: [\`
    .painel {
      transition: opacity var(--motion-standard) var(--ease-citie-out);
    }
    @media (prefers-reduced-motion: reduce) {
      .painel { transition: none; }
    }
  \`],
})
export class PainelComponent {}` },
  'React': { linguagem: 'tsx', codigo: `export function Painel({ aberto, children }: { aberto: boolean; children: React.ReactNode }) {
  return (
    <div
      className="motion-reduce:transition-none"
      style={{
        opacity: aberto ? 1 : 0,
        transition: 'opacity var(--motion-standard) var(--ease-citie-out)',
      }}
    >
      {children}
    </div>
  );
}` },
};

export const logoMotionCodigo: Abas = {
  'CSS': { linguagem: 'css', codigo: `/* Símbolo primeiro, wordmark depois, fundo sólido */
.logo-simbolo {
  opacity: 0;
  transform: scale(0.94);
  animation: logo-entra 500ms cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.logo-wordmark {
  opacity: 0;
  animation: logo-entra 400ms cubic-bezier(0.16, 1, 0.3, 1) 300ms forwards;
}
@keyframes logo-entra { to { opacity: 1; transform: none; } }

@media (prefers-reduced-motion: reduce) {
  .logo-simbolo, .logo-wordmark { animation: none; opacity: 1; transform: none; }
}` },
  'React': { linguagem: 'tsx', codigo: `// Duas animações CSS, uma para cada parte do logo
export function LogoAnimado() {
  return (
    <svg viewBox="0 0 240 64" role="img" aria-label="Citiesoft">
      <g className="logo-simbolo">{/* símbolo de LogoBranca.svg */}</g>
      <g className="logo-wordmark">{/* wordmark de LogoBranca.svg */}</g>
    </svg>
  );
}` },
};

export const slidesCodigo: Abas = {
  'Reveal.js': { linguagem: 'javascript', codigo: `Reveal.initialize({
  transition: 'fade',       // uma transição para o deck inteiro
  transitionSpeed: 'default',
});
/* CSS dos fragmentos */
.reveal .fragment { transition-duration: 300ms; transition-timing-function: cubic-bezier(0, 0, 0.2, 1); }` },
};
