import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Inplace } from './Inplace';

/** Guarda o valor entre confirmações para a story refletir o efeito real. */
function InplaceControlado({
  inicial,
  ...props
}: { inicial: string } & Omit<Parameters<typeof Inplace>[0], 'valor' | 'aoConfirmar'>) {
  const [valor, setValor] = useState(inicial);
  return <Inplace {...props} valor={valor} aoConfirmar={setValor} />;
}

const meta = {
  title: 'Moléculas/Campos/Inplace',
  component: Inplace,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Edição no lugar: o valor exibido vira campo ao ser acionado, e volta a valor ao confirmar ou cancelar. Figma CitieOne, página `6738:55110` (set `inplace`, eixos `State` Idle/Hover/N/A e `Active` False/True, mais a part `inplace-content`). Equivalente PrimeNG: `p-inplace`.',
          '',
          '**Quando não usar.** A edição no lugar esconde a affordance de edição: quem olha a tela vê um valor, não um campo. Em formulário de cadastro isso custa caro, porque o usuário precisa descobrir campo por campo o que dá para preencher, e o percurso por teclado passa a exigir um acionamento extra por campo. Cadastro pede campos abertos desde o início.',
          '',
          'O lugar dela é o ajuste pontual de um valor numa tela de consulta: a diária que saiu com o valor errado dentro do processo já aberto, o número de empenho digitado com um dígito trocado. Um valor, uma correção, sem sair da tela.',
        ].join('\n'),
      },
    },
  },
  args: {
    rotulo: 'Valor da diária',
    valor: 'R$ 1.234,56',
    aoConfirmar: () => {},
  },
} satisfies Meta<typeof Inplace>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Exibicao: Story = {
  name: 'Estado · exibição',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // O nome acessível precisa dizer o que edita e qual é o valor de agora.
    const gatilho = canvas.getByRole('button', {
      name: 'Editar Valor da diária, atualmente R$ 1.234,56',
    });
    await expect(gatilho).toBeInTheDocument();
  },
};

export const Edicao: Story = {
  name: 'Estado · em edição',
  args: {
    rotulo: 'Valor da diária',
    valor: 'R$ 1.234,56',
    // O gatilho mostra o valor formatado; o campo recebe o número puro.
    valorEdicao: '1234,56',
    addonStart: 'R$',
    helper: 'Use vírgula para os centavos.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Editar Valor da diária/ }));

    const campo = canvas.getByLabelText('Valor da diária');
    // Foco automático: sem ele o usuário aciona a edição e continua parado no gatilho.
    await expect(campo).toHaveFocus();
    await expect(campo).toHaveValue('1234,56');
    await expect(canvas.getByRole('button', { name: 'Confirmar' })).toBeInTheDocument();
  },
};

export const ConfirmarComEnter: Story = {
  name: 'Interação · Enter confirma',
  render: (args) => <InplaceControlado {...args} inicial="1234,56" addonStart="R$" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Editar Valor da diária/ }));

    const campo = canvas.getByLabelText('Valor da diária');
    await userEvent.clear(campo);
    await userEvent.type(campo, '1480,00{Enter}');

    const gatilho = await canvas.findByRole('button', {
      name: 'Editar Valor da diária, atualmente 1480,00',
    });
    // O foco volta ao gatilho: quem confirmou por teclado não fica solto na página.
    await expect(gatilho).toHaveFocus();
  },
};

export const CancelarComEscape: Story = {
  name: 'Interação · Esc cancela',
  render: (args) => <InplaceControlado {...args} inicial="2025/0481-7" />,
  args: {
    rotulo: 'Número de empenho',
    valor: '2025/0481-7',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: /Editar Número de empenho/ }));

    const campo = canvas.getByLabelText('Número de empenho');
    await userEvent.clear(campo);
    await userEvent.type(campo, '2025/9999-0{Escape}');

    const gatilho = await canvas.findByRole('button', {
      name: 'Editar Número de empenho, atualmente 2025/0481-7',
    });
    await expect(gatilho).toHaveFocus();
  },
};

export const SemValor: Story = {
  name: 'Estado · sem valor registrado',
  args: {
    rotulo: 'Número de empenho',
    valor: '',
    placeholder: 'Sem empenho registrado',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('button', {
        name: 'Editar Número de empenho, atualmente Sem empenho registrado',
      }),
    ).toBeInTheDocument();
  },
};

export const Bloqueado: Story = {
  name: 'Estado · bloqueado',
  args: {
    rotulo: 'Valor da diária',
    valor: 'R$ 1.234,56',
    desabilitado: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Processo já empenhado não aceita correção de valor. O gatilho continua alcançável por teclado, com `aria-disabled`, para que o valor possa ser lido; o clique não abre a edição.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', {
      name: 'Valor da diária, R$ 1.234,56. Edição bloqueada.',
    });
    await userEvent.click(gatilho);
    await expect(canvas.queryByLabelText('Valor da diária')).not.toBeInTheDocument();
  },
};
