import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { DURACAO_POR_SEVERIDADE, Toast, ToastStack, type DadosDoToast } from './Feedback';
import { Button } from '../../atoms/Button/Button';

const meta = {
  title: 'Moléculas/Feedback/Toast',
  component: Toast,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Notificação temporária sobreposta que confirma o resultado de uma ação ou avisa de um evento sem interromper o fluxo. Spec: `03-components/feedback-toast-alert.md` v2.0.0. Biblioteca Figma: `07-figma-library/toast.md`. Equivalente PrimeNG: `p-toast`.\n\nRegra de escolha (Toast, Message ou banner): use Toast para confirmação efêmera do resultado de uma ação do usuário (salvar, enviar, aprovar, excluir) e para notificação passiva de sistema, porque não bloqueia o fluxo, some sozinho e não precisa ser lido depois. Nunca use Toast para erro de validação de campo, para informação que o usuário precisa ler com calma ou copiar (número de protocolo), nem para pergunta que exige decisão. Erro ou aviso ligado ao contexto da tela ou do formulário, que precisa permanecer ancorado até ser resolvido, é Message; decisão que exige confirmação explícita é Dialog.\n\nO `ToastStack` é documentado aqui: é o container do próprio Toast, responsável pela regra de no máximo 3 empilhados.\n\n**Quando não usar:**\n\n- **Conteúdo que o servidor precisa copiar ou anotar.** Número de protocolo, código de erro e prazo somem em 4 a 6 segundos (`success` 4s, `info` 5s, `warn` 6s), e o dado não volta. Deixe essa informação na tela, em `Moléculas/Feedback/Message` ou no próprio corpo da página.\n- **Erro de validação de campo.** O toast aparece longe do campo, e a pessoa fica com a mensagem sem saber onde corrigir. Use a mensagem do próprio campo (`error` do `Moléculas/Campos/Input` e demais campos), e a lista de erros do `Message` no topo do formulário quando forem vários.\n- **Decisão que exige resposta.** O toast some sozinho e não bloqueia nada, então a pergunta pode nunca ser respondida. Use `Moléculas/Overlay/ConfirmPopup` para confirmação leve ancorada ao botão e `Organismos/Overlay/ConfirmDialog` para ação irreversível.\n- **Estado que dura enquanto uma condição persistir.** Sistema em manutenção, competência fechada ou permissão insuficiente continuam valendo depois do toast desaparecer. Use o `Message` como banner no topo da página.\n- **Vários avisos ao mesmo tempo.** O `ToastStack` mostra no máximo 3 e descarta os mais antigos em silêncio, então o quarto aviso nunca é lido. Quando a operação gera muitos resultados (importação em lote, por exemplo), mostre um resumo persistente na tela com o detalhamento.\n- **Ausência de dados numa região.** Isso é `Moléculas/Feedback/EmptyState`.\n\nUma nota de acessibilidade que limita o uso: apenas a severidade `error` recebe `role="alert"` e `aria-live="assertive"`, e ela não fecha sozinha. As demais são anunciadas de forma educada e podem passar despercebidas por quem está lendo outra parte da tela, o que reforça a regra de nunca colocar informação necessária apenas no toast.',
      },
    },
  },
  args: {
    id: 'toast',
    severidade: 'success',
    titulo: 'Diária lançada com sucesso',
  },
} satisfies Meta<typeof Toast>;

export default meta;
type Story = StoryObj<typeof meta>;

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
        story:
          'Ao chegar um quarto toast, o mais antigo sai da pilha. A regra vive no `ToastStack`, o container do Toast; o `Button` aparece aqui por composição, só para disparar as notificações.',
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
