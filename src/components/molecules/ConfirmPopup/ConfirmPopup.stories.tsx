import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { ConfirmPopup } from './ConfirmPopup';
import { ConfirmDialog } from '../../organisms/Overlay/Overlay';
import { Button } from '../../atoms/Button/Button';

/**
 * Toda story começa FECHADA, com o gatilho visível. O cartão só existe no DOM
 * depois do clique, como no produto.
 */

const meta = {
  title: 'Moléculas/Overlay/ConfirmPopup',
  component: ConfirmPopup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Confirmação leve ancorada ao próprio botão que disparou a ação, sem escurecer a tela. Figma CitieOne, página `❖ ConfirmPopup` (`6738:50208`), component set `confirmpopup` com o eixo `Popup: False | True`. Equivalente PrimeNG: `p-confirmpopup`.',
          '',
          '**Popup ou ConfirmDialog?**',
          '',
          '- **ConfirmPopup** para ação reversível e de baixo risco, que acontece no lugar em que o usuário já está olhando: reenviar ofício, duplicar lançamento, arquivar filtro, marcar como lido. O contexto da tela permanece visível e o custo do engano é baixo.',
          '- **ConfirmDialog** (`Overlay/Dialog e Drawer`) para exclusão permanente e qualquer ação irreversível. A spec `03-components/modals-dialogs-drawers.md` exige o diálogo modal nesse caso, porque ele bloqueia a tela e obriga a decisão explícita.',
          '',
          '**O popup não serve para exclusão.** Se a ação apaga dado, remove vínculo ou não pode ser desfeita pelo próprio usuário, use o `ConfirmDialog`.',
          '',
          '**Quando não usar:**',
          '',
          '- **Exclusão permanente, cancelamento de processo, remoção de vínculo, envio ao órgão externo.** O popup fecha com clique fora e com Escape, então uma tecla distraída resolve a pergunta como cancelamento, e o custo do engano no caminho contrário seria um dado de processo perdido. Use `Organismos/Overlay/ConfirmDialog`.',
          '- **A confirmação precisa mostrar o que será afetado.** O cartão comporta uma pergunta e um detalhe curto. Lista de 14 lançamentos que entram numa operação em lote, resumo do que muda ou campo de justificativa pedem `Organismos/Overlay/Dialog` ou `Organismos/Overlay/Drawer`.',
          '- **A ação é reversível de verdade e o clique acidental é barato.** Perguntar antes de marcar como lido só acrescenta um clique em toda repetição da tarefa. Execute direto e ofereça o desfazer no `Moléculas/Feedback/Toast`, que já aceita uma ação.',
          '- **A ação parte de uma linha de tabela sem gatilho fixo.** O popup se ancora ao elemento que o disparou; se essa linha sai da tela ao rolar, ou se a tabela recarrega, a âncora desaparece com a pergunta em aberto. Em listagem que atualiza sozinha, use o `ConfirmDialog`.',
          '- **Comunicar resultado em vez de perguntar.** Confirmação de algo já feito é `Moléculas/Feedback/Toast`; alerta que permanece é `Moléculas/Feedback/Message`.',
          '- **Explicar o que um botão faz.** Isso é `Moléculas/Overlay/Tooltip`, e conteúdo auxiliar mais longo é `Moléculas/Overlay/Popover`. Nenhum dos dois pergunta nada.',
          '',
          'Acessibilidade: `role="alertdialog"` com `aria-labelledby` na pergunta e `aria-describedby` no detalhe, foco inicial em "Cancelar", Tab preso dentro do cartão, Escape fecha e devolve o foco ao gatilho. Clique fora também cancela.',
        ].join('\n'),
      },
    },
  },
  args: {
    aberto: false,
    mensagem: 'Reenviar o ofício 2025/0481?',
    rotuloConfirmar: 'Reenviar',
    children: null,
  },
} satisfies Meta<typeof ConfirmPopup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Ação · reenviar ofício',
  parameters: {
    docs: {
      description: {
        story:
          'Estrutura do Figma: ícone de alerta, a pergunta e o rodapé com "Cancelar" antes da ação. O reenvio é reversível, cabe no popup.',
      },
    },
  },
  render: function Padrao() {
    const [aberto, setAberto] = useState(false);
    return (
      <div style={{ padding: 24 }}>
        <ConfirmPopup
          aberto={aberto}
          mensagem="Reenviar o ofício 2025/0481?"
          rotuloConfirmar="Reenviar"
          onCancel={() => setAberto(false)}
          onConfirm={() => setAberto(false)}
        >
          <Button variant="secondary" onClick={() => setAberto(true)}>
            Reenviar ofício
          </Button>
        </ConfirmPopup>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Reenviar ofício' });
    await userEvent.click(gatilho);

    const popup = await canvas.findByRole('alertdialog');
    await expect(popup).toHaveAccessibleName('Reenviar o ofício 2025/0481?');

    // Foco inicial na ação segura.
    await waitFor(() => expect(within(popup).getByRole('button', { name: 'Cancelar' })).toHaveFocus());

    // Escape fecha e devolve o foco ao gatilho.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('alertdialog')).toBeNull());
    await expect(gatilho).toHaveFocus();
  },
};

export const ComDetalhe: Story = {
  name: 'Estado · com consequência descrita',
  parameters: {
    docs: {
      description: {
        story:
          'Quando a pergunta não basta, o detalhe descreve a consequência e vira o `aria-describedby` do cartão.',
      },
    },
  },
  render: function ComDetalhe() {
    const [aberto, setAberto] = useState(false);
    return (
      <div style={{ padding: 24 }}>
        <ConfirmPopup
          aberto={aberto}
          mensagem="Duplicar o lançamento de diária?"
          detalhe="A cópia entra na competência 03/2025 como rascunho, no nome de Maria de Fátima Souza."
          rotuloConfirmar="Duplicar lançamento"
          variante="informacao"
          onCancel={() => setAberto(false)}
          onConfirm={() => setAberto(false)}
        >
          <Button variant="secondary" onClick={() => setAberto(true)}>
            Duplicar lançamento
          </Button>
        </ConfirmPopup>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Duplicar lançamento' }));

    const popup = await canvas.findByRole('alertdialog');
    await expect(popup).toHaveAccessibleDescription(
      'A cópia entra na competência 03/2025 como rascunho, no nome de Maria de Fátima Souza.',
    );
  },
};

export const FocoPreso: Story = {
  name: 'Comportamento · foco preso no cartão',
  parameters: {
    // A varredura de a11y fica em modo aviso nesta story por causa de um achado
    // ABERTO do design system, não por descuido: os preenchimentos
    // `success.emphasis` #16A34A (3,30:1) e `warning.emphasis` #D97706 (3,19:1)
    // com rótulo branco reprovam WCAG AA. Está documentado no README, com a
    // correção proposta, e o mesmo tratamento já é dado nas stories do Button.
    a11y: { test: 'todo' },
    docs: {
      description: {
        story:
          'Enquanto aberto, o Tab circula entre "Cancelar" e a ação. O gatilho não recebe foco de volta antes do fechamento.',
      },
    },
  },
  render: function FocoPreso() {
    const [aberto, setAberto] = useState(false);
    return (
      <div style={{ padding: 24 }}>
        <ConfirmPopup
          aberto={aberto}
          mensagem="Arquivar o filtro salvo da Secretaria de Saúde?"
          rotuloConfirmar="Arquivar filtro"
          onCancel={() => setAberto(false)}
          onConfirm={() => setAberto(false)}
        >
          <Button variant="secondary" onClick={() => setAberto(true)}>
            Arquivar filtro
          </Button>
        </ConfirmPopup>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Arquivar filtro' }));

    const popup = await canvas.findByRole('alertdialog');
    const cancelar = within(popup).getByRole('button', { name: 'Cancelar' });
    const confirmar = within(popup).getByRole('button', { name: 'Arquivar filtro' });

    await waitFor(() => expect(cancelar).toHaveFocus());

    await userEvent.tab();
    await expect(confirmar).toHaveFocus();

    // Do último volta ao primeiro, sem escapar para a página.
    await userEvent.tab();
    await expect(cancelar).toHaveFocus();

    await userEvent.tab({ shift: true });
    await expect(confirmar).toHaveFocus();
  },
};

export const Acima: Story = {
  name: 'Posição · acima e alinhado ao fim',
  parameters: {
    docs: {
      description: {
        story:
          'Gatilho no rodapé de uma tabela ou colado à direita: o cartão sobe e alinha pela borda direita para não sair da tela.',
      },
    },
  },
  render: function Acima() {
    const [aberto, setAberto] = useState(false);
    return (
      <div style={{ padding: '160px 24px 24px', display: 'flex', justifyContent: 'flex-end' }}>
        <ConfirmPopup
          aberto={aberto}
          posicao="acima"
          alinhamento="fim"
          mensagem="Marcar as 12 solicitações de TFD como lidas?"
          rotuloConfirmar="Marcar como lidas"
          variante="sucesso"
          onCancel={() => setAberto(false)}
          onConfirm={() => setAberto(false)}
        >
          <Button variant="secondary" onClick={() => setAberto(true)}>
            Marcar como lidas
          </Button>
        </ConfirmPopup>
      </div>
    );
  },
};

export const Confirmando: Story = {
  name: 'Estado · confirmando',
  parameters: {
    docs: {
      description: {
        story: 'Spinner na ação e "Cancelar" desabilitado enquanto o envio acontece.',
      },
    },
  },
  render: function Confirmando() {
    const [aberto, setAberto] = useState(false);
    return (
      <div style={{ padding: 24 }}>
        <ConfirmPopup
          aberto={aberto}
          confirmando
          mensagem="Reenviar a notificação para a Secretaria de Educação?"
          rotuloConfirmar="Reenviar"
          onCancel={() => setAberto(false)}
        >
          <Button variant="secondary" onClick={() => setAberto(true)}>
            Reenviar notificação
          </Button>
        </ConfirmPopup>
      </div>
    );
  },
};

export const PopupOuDialogo: Story = {
  name: 'Uso · popup x ConfirmDialog',
  parameters: {
    docs: {
      description: {
        story:
          'À esquerda, ação reversível confirmada no lugar. À direita, exclusão permanente: o popup fica de fora e a confirmação sobe como diálogo modal, conforme a spec.',
      },
    },
  },
  render: function PopupOuDialogo() {
    const [popupAberto, setPopupAberto] = useState(false);
    const [dialogoAberto, setDialogoAberto] = useState(false);
    return (
      <div style={{ display: 'flex', gap: 24, padding: 24 }}>
        <ConfirmPopup
          aberto={popupAberto}
          mensagem="Arquivar o processo 2025/0481?"
          detalhe="O processo sai da fila de análise e pode ser reaberto pelo gestor."
          rotuloConfirmar="Arquivar"
          onCancel={() => setPopupAberto(false)}
          onConfirm={() => setPopupAberto(false)}
        >
          <Button variant="secondary" onClick={() => setPopupAberto(true)}>
            Arquivar processo
          </Button>
        </ConfirmPopup>

        <Button variant="danger" onClick={() => setDialogoAberto(true)}>
          Excluir processo
        </Button>
        <ConfirmDialog
          aberto={dialogoAberto}
          titulo="Excluir processo 2025/0481?"
          descricao="Os anexos e o histórico do processo serão removidos permanentemente."
          rotuloConfirmar="Excluir processo"
          onClose={() => setDialogoAberto(false)}
        />
      </div>
    );
  },
};
