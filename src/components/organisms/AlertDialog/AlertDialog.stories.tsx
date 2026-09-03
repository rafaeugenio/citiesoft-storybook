import { useState, type ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { AlertDialog } from './AlertDialog';
import { Button } from '../../atoms/Button/Button';

/**
 * Toda story começa FECHADA, com um gatilho visível: `dialog` modal sobe
 * para a top layer, e a página de docs renderiza todas as stories juntas.
 * Mesma regra do `ConfirmDialog` (Overlay, Lote 3).
 */

const meta = {
  title: 'Organismos/Overlay/AlertDialog',
  component: AlertDialog,
  tags: ['autodocs', 'organism', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'AlertDialog. Confirmação destrutiva ou crítica, com a caixa de ícone de severidade que o `ConfirmDialog` (`Organismos/Overlay/ConfirmDialog`, Lote 3) não tem: 480px, ícone de 20 numa caixa tonal de 40, `role="alertdialog"`.',
          '',
          '**Quando usar este e não o ConfirmDialog:** a decisão precisa de um sinal visual de severidade além do texto, tipicamente quando o AlertDialog aparece isolado numa tela sem o contexto de cor de um botão destrutivo ao lado (atalho de teclado, notificação, fluxo automatizado). Fora isso, o `ConfirmDialog` já resolve a mesma tarefa com um diálogo mais compacto.',
          '',
          '**Quando não usar:** ação reversível e de baixo risco (`ConfirmPopup`); decisão que depende de um dado a mais além de confirmar, que pede formulário dentro de um `Dialog`.',
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
} satisfies Meta<typeof AlertDialog>;

export default meta;
type Story = StoryObj<typeof meta>;

function ComGatilho({
  rotulo,
  variante = 'danger',
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

export const Destrutiva: Story = {
  name: 'Severidade · destrutiva',
  parameters: {
    docs: {
      description: {
        story:
          'Ícone de lixeira em caixa tonal vermelha (`--sev-bg`/`--sev-fg` de `danger`), botão de confirmação na pele Destructive. Foco inicial em "Cancelar" e Escape cancela.',
      },
    },
  },
  render: () => (
    <ComGatilho rotulo="Excluir processo" variante="danger">
      {({ aberto, fechar }) => (
        <AlertDialog
          aberto={aberto}
          severidade="destrutiva"
          titulo="Excluir processo 2025/0481?"
          descricao="Os anexos e o histórico do processo serão removidos permanentemente."
          rotuloConfirmar="Excluir processo"
          onClose={fechar}
          onConfirm={fechar}
        />
      )}
    </ComGatilho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Excluir processo' }));

    const dialogo = canvasElement.querySelector('dialog')!;
    await expect(dialogo).toHaveAttribute('role', 'alertdialog');
    await expect(dialogo).toHaveAttribute('aria-describedby');

    // Foco inicial na ação segura, nunca na destrutiva.
    await waitFor(() =>
      expect(within(dialogo).getByRole('button', { name: 'Cancelar' })).toHaveFocus(),
    );

    const icone = dialogo.querySelector('.citie-alert-dialog__icone') as HTMLElement;
    const larguraEsperada = getComputedStyle(document.documentElement)
      .getPropertyValue('--citie-alert-dialog-caixa-de-icone')
      .trim();
    await expect(getComputedStyle(icone).width).toBe(larguraEsperada);

    const larguraDialogo = getComputedStyle(dialogo).width;
    const esperada = getComputedStyle(document.documentElement)
      .getPropertyValue('--citie-largura-alert-dialog')
      .trim();
    await expect(larguraDialogo).toBe(esperada);
  },
};

export const Critica: Story = {
  name: 'Severidade · crítica',
  parameters: {
    docs: {
      description: {
        story:
          'Ícone de alerta em caixa tonal âmbar (`warn`), confirmação na pele primária: crítica, mas não destrutiva (enviar para aprovação, encerrar prazo prorrogável).',
      },
    },
  },
  render: () => (
    <ComGatilho rotulo="Enviar para aprovação" variante="primary">
      {({ aberto, fechar }) => (
        <AlertDialog
          aberto={aberto}
          severidade="critica"
          titulo="Enviar processo 2025/0481 para aprovação?"
          descricao="O processo sai da sua fila e a edição fica bloqueada até o gestor decidir."
          rotuloConfirmar="Enviar para aprovação"
          onClose={fechar}
          onConfirm={fechar}
        />
      )}
    </ComGatilho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Enviar para aprovação' }));

    const dialogo = canvasElement.querySelector('dialog')!;
    const confirmar = within(dialogo).getByRole('button', { name: 'Enviar para aprovação' });
    await expect(confirmar).toHaveClass('citie-button--primary');
  },
};

export const CicloDeTab: Story = {
  name: 'Interação · ciclo de Tab não escapa do diálogo',
  parameters: {
    docs: {
      description: {
        story:
          'O `dialog` nativo torna o fundo inerte e devolve o foco ao gatilho ao fechar, mas não recicla o Tab sozinho: `useDialogModal` (Overlay) fecha esse ciclo no keydown, para o Tab do último botão voltar ao primeiro em vez de escapar para o `<body>`. Medido com Tab e Shift+Tab reais.',
      },
    },
  },
  render: () => (
    <ComGatilho rotulo="Excluir processo" variante="danger">
      {({ aberto, fechar }) => (
        <AlertDialog
          aberto={aberto}
          titulo="Excluir processo 2025/0481?"
          descricao="Os anexos e o histórico do processo serão removidos permanentemente."
          rotuloConfirmar="Excluir processo"
          onClose={fechar}
          onConfirm={fechar}
        />
      )}
    </ComGatilho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Excluir processo' }));

    const dialogo = canvasElement.querySelector('dialog')!;
    const cancelar = within(dialogo).getByRole('button', { name: 'Cancelar' });
    const confirmar = within(dialogo).getByRole('button', { name: 'Excluir processo' });

    await waitFor(() => expect(cancelar).toHaveFocus());

    await userEvent.tab();
    await expect(confirmar).toHaveFocus();

    // Tab a partir do último focável recicla para o primeiro.
    await userEvent.tab();
    await expect(cancelar).toHaveFocus();

    // Shift+Tab a partir do primeiro recicla para o último.
    await userEvent.tab({ shift: true });
    await expect(confirmar).toHaveFocus();
  },
};

export const Confirmando: Story = {
  name: 'Estado · confirmando',
  parameters: {
    docs: {
      description: { story: 'Spinner na ação e ambos os botões desabilitados enquanto processa.' },
    },
  },
  render: () => (
    <ComGatilho rotulo="Arquivar processo" variante="secondary">
      {({ aberto, fechar }) => (
        <AlertDialog
          aberto={aberto}
          confirmando
          severidade="critica"
          titulo="Arquivar processo 2025/0481?"
          descricao="O processo sai da fila de análise e pode ser reaberto pelo gestor."
          rotuloConfirmar="Arquivar"
          onClose={fechar}
        />
      )}
    </ComGatilho>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Arquivar processo' }));

    const dialogo = canvasElement.querySelector('dialog')!;
    await expect(within(dialogo).getByRole('button', { name: 'Cancelar' })).toBeDisabled();
  },
};

export const EscapeCancela: Story = {
  name: 'Interação · Escape cancela',
  parameters: {
    docs: {
      description: {
        story:
          'O `<dialog>` nativo dispara o evento `cancel` quando a pessoa pressiona Escape sobre um modal. O `AlertDialog` escuta esse evento, previne o fechamento automático do navegador e chama `onClose`, para o fechamento passar pelo mesmo estado controlado da abertura. A suíte de teste dispara o `cancel` diretamente: o Escape sintético do `userEvent` não é um evento confiável (`isTrusted`) e o Chromium só aciona o cancelamento nativo de `dialog` para eventos confiáveis, a mesma limitação já registrada para `:hover` no Lote 1.',
      },
    },
  },
  render: () => (
    <ComGatilho rotulo="Excluir processo" variante="danger">
      {({ aberto, fechar }) => (
        <AlertDialog
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
    await waitFor(() => expect(dialogo).toHaveAttribute('open'));

    // Dispara o `cancel` nativo diretamente, no lugar do Escape sintético.
    fireEvent(dialogo, new Event('cancel', { cancelable: true }));
    await waitFor(() => expect(dialogo).not.toHaveAttribute('open'));
  },
};
