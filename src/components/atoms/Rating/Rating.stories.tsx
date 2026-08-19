import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Rating } from './Rating';

const meta = {
  title: 'Átomos/Entrada/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Avaliação por estrelas. Origem: Figma CitieOne, página ❖ Rating (Rating de 0 a 5, Disabled, e o ícone com State, Select, Read Only e Focus). Equivalente PrimeNG: `p-rating`.\n\n**Quando usar:** para satisfação declarada por quem foi atendido, em pesquisa curta ao fim de um fluxo, onde a escala é subjetiva e não entra no mérito do processo.\n\n**Quando não usar:** para nota que a norma define e a auditoria cobra (avaliação de desempenho, pontuação de classificação em processo seletivo, grau de risco). O componente aceita apenas inteiros de 1 até `total`, sem meia estrela e sem exibir a escala, então 3,5 não existe e o servidor não sabe se 3 é bom ou ruim; use `Input` numérico ou `Select` com os níveis nomeados. Para prioridade ou urgência: a estrela é lida como qualidade, e um chamado com cinco estrelas parece elogiado em vez de urgente; use `Tag` ou `StatusIndicator`. Como filtro de listagem, também não: cada estrela é um `radio` de um grupo, e radio marcado não volta a zero pelo teclado, então o servidor fica preso ao filtro que aplicou sem querer e precisa recarregar a tela; use `SelectButton` ou `Select`, que oferecem a opção de limpar. Em coluna de tabela, prefira o número por extenso: cinco ícones repetidos em cada linha custam largura e obrigam a contar pontas para ler um valor.',
      },
    },
  },
  args: { label: 'Avaliação do atendimento' },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vazio: Story = {
  name: 'Rating · 0',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Cada estrela é um radio de verdade, então o grupo navega pelas setas.
    await expect(canvas.getAllByRole('radio')).toHaveLength(5);

    await userEvent.click(canvas.getByRole('radio', { name: '4 estrelas' }));
    await expect(canvas.getByRole('radio', { name: '4 estrelas' })).toBeChecked();
  },
};

export const Preenchido: Story = {
  name: 'Rating · 3',
  args: { defaultValue: 3 },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('radio', { name: '3 estrelas' })).toBeChecked();
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { defaultValue: 4, disabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('radio')[0]).toBeDisabled();
  },
};

export const SomenteLeitura: Story = {
  name: 'Estado · somente leitura',
  args: { defaultValue: 4, readOnly: true },
  parameters: {
    docs: {
      description: {
        story:
          'Em tela de consulta o controle vira imagem com nome acessível, sem entrar na ordem de tabulação.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('img', { name: '4 de 5' })).toBeVisible();
    await expect(canvas.queryAllByRole('radio')).toHaveLength(0);
  },
};

export const EscalaDeDez: Story = {
  name: 'Variante · escala de 10',
  args: { label: 'Nota de satisfação', total: 10, defaultValue: 8 },
};
