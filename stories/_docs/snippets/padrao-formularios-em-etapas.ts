import type { Abas } from '../Layout';

export const etapasExemplo: Abas = {
  'HTML/CSS': { codigo: `<nav aria-label="Progresso do cadastro">
  <ol class="passos">
    <li><a href="#pessoais" aria-label="Etapa 1: Dados pessoais (concluída)">Dados pessoais</a></li>
    <li aria-current="step">Dados funcionais</li>
    <li>Revisão</li>
  </ol>
</nav>

<section aria-labelledby="titulo-etapa">
  <h2 id="titulo-etapa" tabindex="-1">Dados funcionais</h2>
  <!-- campo condicional: entra e sai do DOM, não só do visual -->
</section>

// ao trocar de etapa, o foco vai ao título da nova etapa
document.getElementById('titulo-etapa').focus();

@media (prefers-reduced-motion: reduce) { .condicional { transition: none; } }` },
  'Angular com PrimeNG': { codigo: `<p-stepper [value]="etapa()" [linear]="false">
  <p-step-list>
    <p-step [value]="1">Dados pessoais</p-step>
    <p-step [value]="2">Dados funcionais</p-step>
    <p-step [value]="3">Revisão</p-step>
  </p-step-list>
  <p-step-panels>
    <p-step-panel [value]="2">
      <ng-template #content let-prev="prevCallback" let-next="nextCallback">
        <p-select formControlName="vinculo" [options]="vinculos" aria-label="Tipo de vínculo" />
        @if (form.value.vinculo === 'CELETISTA') {
          <input pInputText formControlName="ctps" aria-label="Número da CTPS" />
        }
        <p-button label="Anterior" severity="secondary" (onClick)="prev.emit()" />
        <p-button label="Próximo" (onClick)="avancar(next)" />
      </ng-template>
    </p-step-panel>
  </p-step-panels>
</p-stepper>` },
  'React': { codigo: `import { Stepper } from '@/components/application/stepper/stepper';

const etapas = [
  { key: 'pessoais', label: 'Dados pessoais' },
  { key: 'funcionais', label: 'Dados funcionais' },
  { key: 'revisao', label: 'Revisão' },
];

<Stepper
  steps={etapas}
  current={etapa}
  clickable="completed"
  onStepClick={(i) => setEtapa(i)}
  aria-label="Progresso do cadastro"
/>

{/* Voltar nunca valida. Próximo valida a etapa e leva o foco ao primeiro erro. */}
<Button variant="secondary" onClick={voltar}>Anterior</Button>
<Button onClick={avancar}>Próximo</Button>` },
};
