import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Rating } from './Rating';

const meta = {
  title: 'Formulário/Rating',
  component: Rating,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Avaliação por estrelas. Origem: Figma CitieOne, página ❖ Rating (Rating de 0 a 5, Disabled, e o ícone com State, Select, Read Only e Focus). Equivalente PrimeNG: `p-rating`.',
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
