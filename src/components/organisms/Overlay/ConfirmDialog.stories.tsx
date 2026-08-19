import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ConfirmDialog } from './Overlay';
import { Button } from '../../atoms/Button/Button';

/**
 * Toda story aqui começa FECHADA, com um gatilho visível.
 *
 * `dialog` em modo modal sobe para a top layer do navegador, acima de qualquer
 * z-index. Como a página de docs renderiza todas as stories juntas, abrir por
 * padrão empilhava os overlays uns sobre os outros e cobria a documentação.
 * Abrir pelo gatilho também é o uso real do componente.
 */

const meta = {
  title: 'Organismos/Overlay/ConfirmDialog',
  component: ConfirmDialog,
  tags: ['autodocs', 'organism', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Diálogo de confirmação para decisão explícita antes de prosseguir: `role="alertdialog"`, sem botão de fechar e com foco inicial na ação segura ("Cancelar"), padrão defensivo contra clique acidental. Spec: `03-components/modals-dialogs-drawers.md` v2.0.0. Equivalente PrimeNG: `p-confirmdialog`. **Quando usar este e não os irmãos:** use o ConfirmDialog quando a pessoa só precisa dizer sim ou não a uma consequência já descrita; use o [Dialog](?path=/docs/organismos-overlay-dialog--docs) quando houver uma tarefa a executar dentro do overlay, com foco total; use o [Drawer](?path=/docs/organismos-overlay-drawer--docs) quando o contexto da tela atrás precisa permanecer visível. Existe ainda o ConfirmPopup, irmão leve deste componente, ancorado ao próprio gatilho para confirmação de baixo risco e reversível: ação destrutiva permanente usa sempre este diálogo modal, nunca o popup. Cada story abre pelo botão, como no produto.',
          '',
          '**Quando não usar:** ação reversível e de baixo risco, como remover um filtro ou desfazer uma',
          'marcação, em que o modal cobra dois cliques por algo que a pessoa poderia simplesmente refazer',
          '(use o [ConfirmPopup](?path=/docs/moléculas-overlay-confirmpopup--docs), ancorado ao próprio',
          'gatilho); aviso de resultado já ocorrido, sem decisão pendente, que é `Toast` ou `Message`;',
          'erro de preenchimento de campo, que pertence à `Message` ao lado do campo; e decisão que',
          'depende de um dado a mais, como o motivo do indeferimento ou a data de efeito, porque o',
          '`alertdialog` só comporta título, descrição e dois botões (use o',
          '[Dialog](?path=/docs/organismos-overlay-dialog--docs) com o formulário dentro, senão a pessoa',
          'confirma e ainda cai em outro overlay para digitar). Nunca encadeie duas confirmações',
          'seguidas: a segunda ensina o servidor a clicar sem ler, e a proteção deixa de existir.',
          '',
          '**Peso em jornada longa:** este diálogo interrompe e prende o foco, então reserve-o para o que',
          'é permanente ou tem efeito para o cidadão do outro lado (excluir processo, encerrar prazo,',
          'indeferir pedido). Se aparecer no meio de um preenchimento, a descrição precisa nomear o',
          'objeto e a consequência mais grave logo na primeira frase, porque quem está com a atenção na',
          'digitação lê no máximo essa linha antes de decidir.',
        ].join('\n'),
      },
    },
  },
  args: {
    aberto: false,
    titulo: 'Excluir processo 2025/0481?',
    descricao: 'Os anexos e o histórico do processo serão removidos permanentemente.',
    rotuloConfirmar: 'Excluir processo',
  },
} satisfies Meta<typeof ConfirmDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Envolve a story num gatilho, mantendo o overlay fora da tela até o clique. */
function ComGatilho({
  rotulo,
  variante = 'primary',
  children,
}: {
  rotulo: string;
  variante?: 'primary' | 'secondary' | 'danger';
  children: (estado: { aberto: boolean; fechar: () => void }) => ReactNode;
}) {
  const [aberto, setAberto] = useState(false);
  return (
    <div style={{ padding: 24 }}>
      <Button variant={variante} onClick={() => setAberto(true)}>
        {rotulo}
      </Button>
      {children({ aberto, fechar: () => setAberto(false) })}
    </div>
  );
}

export const Confirmacao: Story = {
  name: 'ConfirmDialog · exclusão',
  parameters: {
    docs: {
      description: {
        story:
          'O título nomeia o objeto afetado e o corpo descreve a consequência. O foco inicial vai para "Cancelar", padrão defensivo contra clique acidental.',
      },
    },
  },
  render: () => (
    <ComGatilho rotulo="Excluir processo" variante="danger">
      {({ aberto, fechar }) => (
        <ConfirmDialog
          aberto={aberto}
          titulo="Excluir processo 2025/0481?"
          descricao="Os anexos e o histórico do processo serão removidos permanentemente."
          rotuloConfirmar="Excluir processo"
          onClose={fechar}
        />
      )}
    </ComGatilho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Excluir processo' }));

    const dialogo = canvasElement.querySelector('dialog')!;
    await expect(dialogo).toHaveAttribute('role', 'alertdialog');

    // Foco inicial na ação segura, nunca na destrutiva.
    await waitFor(() =>
      expect(within(dialogo).getByRole('button', { name: 'Cancelar' })).toHaveFocus(),
    );
    // Sem botão de fechar: a decisão precisa ser explícita.
    await expect(within(dialogo).queryByRole('button', { name: /Fechar/ })).toBeNull();
  },
};

export const ConfirmacaoEmCurso: Story = {
  name: 'ConfirmDialog · confirmando',
  parameters: {
    docs: {
      description: {
        story: 'Spinner na ação e ambos os botões desabilitados enquanto processa.',
      },
    },
  },
  render: () => (
    <ComGatilho rotulo="Arquivar processo" variante="secondary">
      {({ aberto, fechar }) => (
        <ConfirmDialog
          aberto={aberto}
          confirmando
          titulo="Arquivar processo 2025/0481?"
          descricao="O processo sai da fila de análise e pode ser reaberto pelo gestor."
          rotuloConfirmar="Arquivar"
          variante="warning"
          onClose={fechar}
        />
      )}
    </ComGatilho>
  ),
};
