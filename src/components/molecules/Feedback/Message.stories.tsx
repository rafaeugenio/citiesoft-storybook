import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Message } from './Feedback';

const meta = {
  title: 'Moléculas/Feedback/Message',
  component: Message,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Mensagem fixa e inline, ancorada à seção, ao formulário ou ao topo da página, que permanece visível até ser resolvida ou dispensada. Spec: `03-components/feedback-toast-alert.md` v2.0.0. Biblioteca Figma: `07-figma-library/message.md`. Equivalente PrimeNG: `p-message`.\n\nRegra de escolha (Toast, Message ou banner): use Message para erro ou aviso ligado ao contexto atual da tela ou do formulário, que precisa permanecer visível, e para estado sistêmico amplo em formato de banner (tipo `default`, largura total da seção, no topo da página). Nunca use Message para feedback de ação pontual que não precisa persistir, isso é Toast: confirmação efêmera que some sozinha. Erro de validação de um único campo pertence à mensagem abaixo do próprio campo, fora do Message de seção; decisão que exige confirmação explícita é Dialog.\n\n**Quando não usar:**\n\n- **Confirmar uma ação que deu certo.** Um bloco fixo dizendo "Diária lançada com sucesso" fica ocupando o topo da tela em todo lançamento seguinte e vira ruído que o servidor aprende a ignorar. Use `Moléculas/Feedback/Toast`.\n- **Erro de um único campo.** A mensagem no topo da seção obriga a pessoa a procurar o campo culpado no formulário inteiro. Use o `error` do próprio campo (`Moléculas/Campos/Input`, `Moléculas/Campos/Select` e demais), que já liga a mensagem ao controle por `aria-describedby`. O `Message` com a lista de erros serve para o resumo no topo de um envio que falhou em vários campos, com cada item levando ao campo correspondente.\n- **A região está sem nenhum conteúdo.** Isso é `Moléculas/Feedback/EmptyState`, que explica a causa e oferece a saída.\n- **A pessoa precisa decidir antes de continuar.** O `Message` informa e não bloqueia. Use `Moléculas/Overlay/ConfirmPopup` ou `Organismos/Overlay/ConfirmDialog`.\n- **Instrução permanente de preenchimento.** Formato aceito e regra do campo pertencem ao `helper` do campo, abaixo dele. O `Message` reservado a instrução transforma orientação de rotina em alarme.\n- **Vários avisos empilhados na mesma seção.** Três blocos coloridos seguidos apagam a hierarquia e nenhum deles é lido. Consolide em um só, com a lista de itens dentro.\n\nUma nota de acessibilidade: só a severidade `error` recebe `role="alert"` com `aria-live="assertive"`, e a propriedade `focarAoAparecer` leva o foco ao bloco. Reserve esse par para a falha de envio de formulário; usá-lo em aviso comum interrompe a leitura de quem usa leitor de tela sem motivo.',
      },
    },
  },
  args: { children: 'Mensagem de exemplo' },
} satisfies Meta<typeof Message>;

export default meta;
type Story = StoryObj<typeof meta>;

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
