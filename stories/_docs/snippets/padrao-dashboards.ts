import type { Abas } from '../Layout';

export const indicadorExemplo: Abas = {
  'HTML/CSS': { codigo: `<article class="indicador" aria-labelledby="ind-1">
  <h3 id="ind-1">Aguardando parecer médico</h3>
  <p class="indicador__valor">127</p>
  <p class="indicador__periodo">Nov 2025</p>
  <p class="delta delta--ruim">
    <span class="sr-only">23% acima do mês anterior</span>
    <span aria-hidden="true">▲ 23%</span>
  </p>
  <div role="progressbar" aria-label="82% da meta mensal" aria-valuenow="82" aria-valuemin="0" aria-valuemax="100"></div>
</article>

.indicador { display: grid; gap: 4px; padding: 16px; border-radius: 12px; border: 1px solid var(--color-border-button-default); }
.delta--ruim { color: var(--color-text-error-primary); }
@media (prefers-reduced-motion: reduce) { .indicador { transition: none; } }` },
  'Angular com PrimeNG': { codigo: `<p-card>
  <ng-template #header><h3 id="ind-1">Aguardando parecer médico</h3></ng-template>
  <p class="valor">{{ indicador.valor | number: '1.0-0' : 'pt-BR' }}</p>
  <small>{{ periodo }}</small>
  <small [class.delta--ruim]="indicador.piorou" [attr.aria-label]="indicador.deltaFalado">
    {{ indicador.deltaTexto }}
  </small>
  <p-progressbar [value]="indicador.meta" [showValue]="false" />
</p-card>

<p-drawer [(visible)]="detalhe" position="right" header="Aguardando parecer médico" [style]="{ width: '40%', minWidth: '480px' }">
  <!-- tabela paginada, busca, exportação e link Ver completo -->
</p-drawer>` },
  'React': { codigo: `import { Drawer } from '@/components/application/drawer/drawer';

<li className="rounded-2xl border border-border-button-default bg-background-primary-default p-4">
  <p className="text-caption-1-medium text-text-secondary">Aguardando parecer médico</p>
  <button type="button" onClick={() => setDetalhe(true)} className="text-title-1-semibold text-text-primary">
    127
  </button>
  <p className="text-caption-1-medium text-text-error-primary">23% acima do mês anterior</p>
</li>

<Drawer isOpen={detalhe} onOpenChange={setDetalhe} title="Aguardando parecer médico" size="md">
  {/* tabela de detalhe */}
</Drawer>` },
};
