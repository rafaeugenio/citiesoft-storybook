import type { Abas } from '../Layout';

export const historicoExemplo: Abas = {
  'HTML/CSS': { codigo: `<ol class="historico" aria-label="Histórico de alterações">
  <li>
    <p>Salário base alterado de R$ 3.200,00 para R$ 3.450,00</p>
    <p><span>Marta Lima</span> · <time datetime="2025-06-15T14:30">15/06/2025 14:30</time></p>
  </li>
  <li>
    <p>Cadastro criado</p>
    <p><span>Marta Lima</span> · <time datetime="2025-06-02T11:05">02/06/2025 11:05</time></p>
  </li>
</ol>

<!-- Toast de desfazer: 8 segundos, focável, anunciado -->
<div role="status" class="toast">Benefício inativado. <button type="button">Desfazer</button></div>

.historico li + li { border-block-start: 1px solid var(--color-separator-border); padding-block: 12px; }` },
  'Angular com PrimeNG': { codigo: `<p-timeline [value]="eventos" aria-label="Histórico de alterações">
  <ng-template #content let-evento>
    <p>{{ evento.descricao }}</p>
    <small>{{ evento.autor }} · {{ evento.data | date: 'dd/MM/yyyy HH:mm' : undefined : 'pt-BR' }}</small>
  </ng-template>
</p-timeline>

// desfazer por 8 segundos
this.messages.add({
  severity: 'success',
  summary: 'Benefício inativado.',
  life: 8000,
  data: { desfazer: true },
});` },
  'React': { codigo: `import { Timeline, type TimelineEvent } from '@/components/application/detalhe/timeline';
import { ConfirmDialog } from '@/components/application/dialog/confirm-dialog';

const eventos: TimelineEvent[] = [
  { key: '2', title: 'Status alterado para Aprovado', date: '03/06/2025 16:48', dateTime: '2025-06-03T16:48', author: 'Carlos Menezes', tone: 'success' },
  { key: '1', title: 'Cadastro criado', date: '02/06/2025 11:05', dateTime: '2025-06-02T11:05', author: 'Marta Lima' },
];

<Timeline events={eventos} aria-label="Histórico de alterações" emptyText="Nenhuma alteração registrada ainda. As ações realizadas neste cadastro aparecerão aqui." />

<ConfirmDialog tone="danger" title="Cancelar processo 2025/0481?" confirmLabel="Cancelar processo"
  description="O processo será cancelado e os participantes notificados. Não é possível reabrir após o cancelamento." />` },
};
