import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, within } from 'storybook/test';
import { RangeSlider, Slider } from './Slider';

const meta = {
  title: 'Formulário/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Entrada numérica por arrasto. Origem: Figma CitieOne, página ❖ Slider (variantes Slide, Input, Range, Direction, Disabled). Cores e medidas seguem os tokens Citiesoft do vault, não o azul padrão do PrimeOne. Equivalente PrimeNG: `p-slider`.',
      },
    },
  },
  args: { label: 'Percentual de execução' },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  name: 'Direction · horizontal',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const controle = canvas.getByRole('slider', { name: 'Percentual de execução' });

    await expect(controle).toHaveValue('50');

    // A navegação por seta é ação padrão do input[type=range] do navegador, que
    // o userEvent não reproduz. O que é nosso, e o que o teste cobre, é a
    // ligação do valor e o trilho preenchido acompanhando.
    fireEvent.change(controle, { target: { value: '75' } });
    await expect(controle).toHaveValue('75');
    await expect(canvas.getByText('75')).toBeVisible();
  },
};

export const Vertical: Story = {
  name: 'Direction · vertical',
  args: { direction: 'vertical' },
};

export const ComEntrada: Story = {
  name: 'Input · com campo numérico',
  args: { comEntrada: true },
  parameters: {
    docs: {
      description: {
        story: 'Para valor exato, o campo numérico entra ao lado e compartilha o mesmo estado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('spinbutton', { name: 'Percentual de execução, valor exato' }),
    ).toBeVisible();
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('slider')).toBeDisabled();
  },
};

const reais = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const Formatado: Story = {
  name: 'Conteúdo · valor formatado',
  args: {
    label: 'Valor máximo da diária',
    min: 0,
    max: 5000,
    step: 50,
    defaultValue: 1250,
    formatar: reais,
  },
  parameters: {
    docs: {
      description: {
        story:
          'O valor formatado vai também para `aria-valuetext`, então o leitor de tela anuncia "R$ 1.250,00" em vez de "1250".',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Comparar com o mesmo formatador: o pt-BR insere espaço não separável
    // depois de "R$", então a string literal não bate.
    await expect(canvas.getByRole('slider')).toHaveAttribute('aria-valuetext', reais(1250));
  },
};

export const Faixa: Story = {
  name: 'Range · duas pontas',
  parameters: {
    docs: {
      description: {
        story: 'As duas pontas são nomeadas, cada uma como controle próprio para o teclado.',
      },
    },
  },
  render: () => (
    <RangeSlider
      label="Faixa de valor da diária"
      rotuloInicio="Valor mínimo"
      rotuloFim="Valor máximo"
      min={0}
      max={5000}
      step={50}
      defaultValue={[500, 3000]}
      formatar={reais}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('slider', { name: 'Valor mínimo' })).toBeVisible();
    await expect(canvas.getByRole('slider', { name: 'Valor máximo' })).toBeVisible();
  },
};
