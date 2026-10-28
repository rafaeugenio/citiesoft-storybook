import type { Abas } from '../Layout';

export const densidadeELayout: Abas = {
  'HTML/CSS': { linguagem: 'html', codigo: `<div class="density-compact">
  <form class="form-section">
    <label for="processo">Número do processo</label>
    <input id="processo" placeholder="Ex.: 2025/0481" />
  </form>
</div>

<style>
  .density-comfortable {
    --spacing-form-gap: 16px;
    --spacing-form-group-gap: 24px;
    --spacing-section-gap: 40px;
    --spacing-card-padding: 24px;
  }
  .density-compact {
    --spacing-form-gap: 12px;
    --spacing-form-group-gap: 16px;
    --spacing-section-gap: 32px;
    --spacing-card-padding: 16px;
  }
  .form-section { display: grid; gap: var(--spacing-form-gap); max-width: 960px; }
  label { display: block; margin-bottom: 4px; }
  html { scroll-padding-top: 64px; } /* topbar de 56 px mais 8 px de folga */
</style>` },
  'Angular (PrimeNG)': { linguagem: 'html', codigo: `<!-- Layout de detalhe: 8 e 4 colunas no desktop -->
<div class="density-compact">
  <div class="grid">
    <div class="col-12 xl:col-8"><!-- painel principal --></div>
    <div class="col-12 xl:col-4"><!-- painel lateral --></div>
  </div>

  <p-table [value]="lancamentos" styleClass="p-datatable-sm" />
</div>

<!-- Formulário: 2 campos lado a lado a partir de md -->
<div class="grid">
  <div class="col-12 md:col-6"><!-- Nome completo --></div>
  <div class="col-12 md:col-6"><!-- CPF --></div>
</div>` },
  'React': { linguagem: 'tsx', codigo: `type Densidade = 'comfortable' | 'compact';

export function Tela({ densidade, children }: { densidade: Densidade; children: React.ReactNode }) {
  return <div className={'density-' + densidade}>{children}</div>;
}

// Pares de raio e sombra por superfície
export const SUPERFICIES = {
  campo: 'rounded-md shadow-sm',
  card: 'rounded-lg shadow-md',
  menu: 'rounded-lg shadow-lg',
  modal: 'rounded-xl shadow-xl',
};` },
};
