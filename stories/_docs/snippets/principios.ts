import type { Abas } from '../Layout';

export const principiosNaPratica: Abas = {
  'HTML/CSS': { linguagem: 'html', codigo: `<!-- Status com texto e ícone, nunca só cor (WCAG 1.4.1) -->
<span class="status status--warning">
  <svg aria-hidden="true" width="16" height="16"><use href="#alerta" /></svg>
  Pendente
</span>

<button class="btn">Enviar para aprovação</button>

<style>
  .btn {
    min-width: 44px;
    min-height: 44px;
    transition: background-color 200ms cubic-bezier(0.2, 0, 0.38, 0.9);
  }
  .btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px rgba(18, 97, 228, 0.4);
  }
  @media (prefers-reduced-motion: reduce) {
    .btn { transition: none; }
  }
</style>` },
  'Angular (PrimeNG)': { linguagem: 'html', codigo: `<!-- p-tag com severidade, ícone e rótulo textual -->
<p-tag severity="warn" icon="pi pi-exclamation-triangle" value="Pendente" />

<p-button
  label="Enviar para aprovação"
  [loading]="enviando"
  (onClick)="enviar()"
  styleClass="min-h-[44px]"
/>` },
  'React': { linguagem: 'tsx', codigo: `export function Situacao({ rotulo }: { rotulo: string }) {
  return (
    <span className="status status--warning">
      <svg aria-hidden="true" width={16} height={16}>
        <use href="#alerta" />
      </svg>
      {rotulo}
    </span>
  );
}

export function EnviarParaAprovacao({ onEnviar }: { onEnviar: () => void }) {
  return (
    <button type="button" className="btn" onClick={onEnviar}>
      Enviar para aprovação
    </button>
  );
}` },
};
