import { useState } from 'react';
import { RiAddCircleLine, RiCheckLine, RiEditLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { Chip } from '@/components/base/badges/chip';
import { Timeline, type TimelineEvent } from '@/components/application/detalhe/timeline';
import { ConfirmDialog } from '@/components/application/dialog/confirm-dialog';
import { Moldura } from './Moldura';

const EVENTOS: TimelineEvent[] = [
  { key: '4', title: 'Salário base alterado de R$ 3.200,00 para R$ 3.450,00', date: '15/06/2025 14:30', dateTime: '2025-06-15T14:30', author: 'Marta Lima', icon: RiEditLine, tone: 'brand' },
  { key: '3', title: 'Benefício Vale-Transporte adicionado. Vencimento: 31/12/2026', date: '10/06/2025 09:12', dateTime: '2025-06-10T09:12', author: 'Marta Lima', icon: RiAddCircleLine, tone: 'success' },
  { key: '2', title: 'Status alterado para Aprovado', date: '03/06/2025 16:48', dateTime: '2025-06-03T16:48', author: 'Carlos Menezes', icon: RiCheckLine, tone: 'success' },
  { key: '1', title: 'Cadastro criado', date: '02/06/2025 11:05', dateTime: '2025-06-02T11:05', author: 'Marta Lima', tone: 'neutral' },
];

/** Histórico somente leitura: ação, valores antes e depois, autor pelo nome e data com hora. */
export function HistoricoDemo() {
  return (
    <Moldura legenda="Sem botão de editar ou excluir entradas, nem para administrador." largura={560}>
      <div className="mb-4 flex items-center gap-2">
        <p className="text-body-medium text-text-primary">Processo 2025/0481</p>
        <Chip variant="caption" color="lime">Aprovado</Chip>
      </div>
      <Timeline events={EVENTOS} aria-label="Histórico de alterações" />
    </Moldura>
  );
}

/** Ação irreversível com confirmação e ação reversível com desfazer por 8 segundos. */
export function ConfirmacaoEDesfazerDemo() {
  const [confirmando, setConfirmando] = useState(false);
  const [cancelado, setCancelado] = useState(false);
  const [desfazer, setDesfazer] = useState(false);
  return (
    <Moldura legenda="Cancelar processo pede confirmação. Inativar benefício mostra o toast com Desfazer.">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="danger" size="small" disabled={cancelado} onClick={() => setConfirmando(true)}>
          {cancelado ? 'Processo cancelado' : 'Cancelar processo'}
        </Button>
        <Button variant="secondary" size="small" onClick={() => setDesfazer(true)}>Inativar benefício</Button>
      </div>
      {desfazer ? (
        <div role="status" className="mt-4 flex max-w-[420px] items-center justify-between gap-3 rounded-2xl border border-border-button-default bg-background-secondary-default px-4 py-3">
          <p className="text-body-regular text-text-primary">Benefício inativado.</p>
          <Button variant="ghost" size="small" onClick={() => setDesfazer(false)}>Desfazer</Button>
        </div>
      ) : null}
      <ConfirmDialog
        isOpen={confirmando}
        onOpenChange={setConfirmando}
        tone="danger"
        title="Cancelar processo 2025/0481?"
        description="O processo será cancelado e os participantes notificados. Não é possível reabrir após o cancelamento."
        confirmLabel="Cancelar processo"
        onConfirm={() => { setCancelado(true); setConfirmando(false); }}
      />
    </Moldura>
  );
}
