import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { DURACAO_POR_SEVERIDADE, Message, Toast, ToastStack, type DadosDoToast } from './Feedback';
import { Button } from '../Button/Button';

const meta = {
  title: 'Feedback/Toast e Message',
  component: Message,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Toast e Message. Spec: `03-components/feedback-toast-alert.md` v2.0.0. Regra de escolha: confirmação efêmera de ação é Toast; erro ou aviso que precisa permanecer ancorado à tela é Message.',
      },
    },
  },
  args: { children: 'Mensagem de exemplo' },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------- Toast ---------- */

export const ToastSucesso: Story = {
  name: 'Toast · sucesso',
  render: () => (
    <Toast
      id="t1"
      severidade="success"
      titulo="Diária lançada com sucesso"
      mensagem="O lançamento entrou na competência de março."
      acao={{ rotulo: 'Desfazer' }}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // success, info, warn e secondary anunciam sem interromper a leitura.
    const toast = canvas.getByRole('status');
    await expect(toast).toHaveAttribute('aria-live', 'polite');
    // O toast entra com fade, então a asserção espera a animação terminar.
    await waitFor(() => expect(canvas.getByRole('button', { name: 'Fechar notificação' })).toBeVisible());
  },
};

export const ToastErro: Story = {
  name: 'Toast · erro',
  parameters: {
    docs: {
      description: {
        story:
          'A severidade error interrompe a leitura em curso por ser crítica, e nunca some sozinha: permanece até o fechamento manual.',
      },
    },
  },
  render: () => (
    <Toast
      id="t2"
      severidade="error"
      titulo="Falha ao enviar o processo"
      mensagem="O SIGEP não respondeu. Tente novamente em alguns minutos."
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toast = canvas.getByRole('alert');

    await expect(toast).toHaveAttribute('aria-live', 'assertive');
    // Sem auto-dismiss na severidade error.
    await expect(DURACAO_POR_SEVERIDADE.error).toBeNull();
  },
};

export const ToastTemporizadores: Story = {
  name: 'Toast · temporizador por severidade',
  parameters: {
    docs: {
      description: {
        story: 'success 4s, info 5s, warn 6s, error sem auto-dismiss.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 12 }}>
      <Toast id="s" severidade="success" titulo="Cadastro salvo" />
      <Toast id="i" severidade="info" titulo="Sessão renovada" />
      <Toast id="w" severidade="warn" titulo="Lançamento salvo com ressalva" />
    </div>
  ),
  play: async () => {
    await expect(DURACAO_POR_SEVERIDADE.success).toBe(4000);
    await expect(DURACAO_POR_SEVERIDADE.info).toBe(5000);
    await expect(DURACAO_POR_SEVERIDADE.warn).toBe(6000);
  },
};

export const ToastEmpilhado: Story = {
  name: 'Toast · máximo de 3 empilhados',
  parameters: {
    docs: {
      description: {
        story: 'Ao chegar um quarto toast, o mais antigo sai da pilha.',
      },
    },
  },
  render: function Empilhado() {
    const [toasts, setToasts] = useState<DadosDoToast[]>([]);
    let contador = toasts.length;

    return (
      <div style={{ display: 'grid', gap: 16 }}>
        <Button
          onClick={() => {
            contador += 1;
            setToasts((atual) => [
              ...atual,
              {
                id: `toast-${atual.length + 1}`,
                severidade: 'error',
                titulo: `Notificação ${atual.length + 1}`,
              },
            ]);
          }}
        >
          Disparar notificação
        </Button>
        <ToastStack toasts={toasts} onDismiss={(id) => setToasts((a) => a.filter((t) => t.id !== id))} />
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const disparar = canvas.getByRole('button', { name: 'Disparar notificação' });

    for (let i = 0; i < 4; i += 1) await userEvent.click(disparar);

    await expect(canvas.getAllByRole('alert')).toHaveLength(3);
    // O mais antigo saiu; o mais novo continua.
    await expect(canvas.queryByText('Notificação 1')).toBeNull();
    await waitFor(() => expect(canvas.getByText('Notificação 4')).toBeVisible());
  },
};

/* ---------- Message ---------- */

export const MessageErroDeFormulario: Story = {
  name: 'Message · erros consolidados',
  parameters: {
    docs: {
      description: {
        story:
          'Erros de múltiplos campos consolidados numa única mensagem no topo, em lista semântica, em vez de repetir o aviso em cada campo. Máximo de 5 itens visíveis.',
      },
    },
  },
  render: () => (
    <Message
      severidade="error"
      titulo="Documentação pendente"
      erros={[
        'O CBO do servidor não foi informado.',
        'O comprovante de residência não foi anexado.',
        'A data de retorno é anterior à data de saída.',
      ]}
      acoes={[{ rotulo: 'Revisar cadastro' }, { rotulo: 'Anexar comprovantes' }]}
    >
      Corrija os itens abaixo antes de enviar o processo para análise.
    </Message>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
    // Lista semântica, nunca texto separado por quebras de linha.
    await expect(canvas.getByRole('list')).toBeVisible();
    await expect(canvas.getAllByRole('listitem')).toHaveLength(3);
  },
};

export const MessageExcedente: Story = {
  name: 'Message · excedente resumido',
  render: () => (
    <Message
      severidade="error"
      titulo="Importação com erros"
      erros={[
        'Linha 3: CPF inválido.',
        'Linha 7: município não encontrado.',
        'Linha 12: valor da diária vazio.',
        'Linha 15: competência fora do período.',
        'Linha 18: matrícula duplicada.',
        'Linha 22: CBO inválido.',
        'Linha 30: data inconsistente.',
      ]}
    >
      A planilha foi processada parcialmente.
    </Message>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('e mais 2 erros')).toBeVisible();
  },
};

export const MessageBloqueante: Story = {
  name: 'Message · bloqueio obrigatório',
  parameters: {
    docs: {
      description: {
        story: 'Pendência que impede o avanço do fluxo nunca tem botão de fechar.',
      },
    },
  },
  render: () => (
    <Message severidade="warn" titulo="Prazo legal em curso">
      O parecer precisa ser emitido em até 48 horas a partir do recebimento.
    </Message>
  ),
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.citie-message__fechar')).toBeNull();
  },
};

export const MessageDispensavel: Story = {
  name: 'Message · dispensável',
  render: () => (
    <Message severidade="info" dispensavel>
      A partir de abril, o lançamento de diárias exige o número do empenho.
    </Message>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Dispensar aviso' }));
    await expect(canvasElement.querySelector('.citie-message')).toBeNull();
  },
};

export const MessageTipos: Story = {
  name: 'Message · tipos default, outlined e simple',
  render: () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Message severidade="info" tipo="default">
        Fundo tonal, padrão para a maioria dos avisos.
      </Message>
      <Message severidade="info" tipo="outlined">
        Contorno, quando o fundo tonal competiria com outro elemento colorido próximo.
      </Message>
      <Message severidade="info" tipo="simple">
        Texto e ícone sem caixa, para contexto de baixa densidade visual.
      </Message>
    </div>
  ),
};
