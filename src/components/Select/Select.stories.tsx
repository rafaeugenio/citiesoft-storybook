import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Select, SelectButton } from './Select';

const MUNICIPIOS = [
  { value: 'sao-luis', label: 'São Luís' },
  { value: 'imperatriz', label: 'Imperatriz' },
  { value: 'caxias', label: 'Caxias' },
  { value: 'timon', label: 'Timon' },
];

const meta = {
  title: 'Formulário/Select',
  component: Select,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Escolha em lista fechada. Spec: `03-components/select.md` v2.0.0. Equivalente PrimeNG: `p-select`, `p-multiselect`, `p-cascadeselect`, `p-selectbutton`.',
      },
    },
  },
  args: {
    label: 'Município de destino',
    options: MUNICIPIOS,
    placeholder: 'Selecione o município',
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Estado · default',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Município de destino');
    // O placeholder mostra a ação de escolha e nunca fica vazio.
    await expect(campo).toHaveDisplayValue('Selecione o município');
  },
};

export const Selecionado: Story = {
  name: 'Estado · selecionado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Município de destino');
    await userEvent.selectOptions(campo, 'imperatriz');
    await expect(campo).toHaveDisplayValue('Imperatriz');
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    required: true,
    error: 'Escolha o município de destino para calcular a diária.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText(/Município de destino/)).toHaveAttribute(
      'aria-invalid',
      'true',
    );
  },
};

export const Tamanhos: Story = {
  name: 'Tamanhos · 32 / 40 / 48px',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16, maxWidth: 360 }}>
      <Select {...args} size="small" label="Small" />
      <Select {...args} size="normal" label="Normal" />
      <Select {...args} size="large" label="Large" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alturas = ['Small', 'Normal', 'Large'].map(
      (nome) => canvas.getByLabelText(nome).getBoundingClientRect().height,
    );
    await expect(alturas).toEqual([32, 40, 48]);
  },
};

export const SelectButtonUnico: Story = {
  name: 'SelectButton · escolha única',
  parameters: {
    docs: {
      description: {
        story:
          'De 2 a 4 opções exclusivas sempre visíveis, tipicamente alternando a visão de uma tabela logo acima dela. O segmento ativo é anunciado como pressionado.',
      },
    },
  },
  render: () => (
    <SelectButton
      legend="Situação da solicitação"
      options={[
        { value: 'pendentes', label: 'Pendentes' },
        { value: 'aprovadas', label: 'Aprovadas' },
        { value: 'negadas', label: 'Negadas' },
      ]}
      defaultValue={['pendentes']}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pendentes = canvas.getByRole('button', { name: 'Pendentes' });
    const aprovadas = canvas.getByRole('button', { name: 'Aprovadas' });

    await expect(pendentes).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(aprovadas);
    await expect(aprovadas).toHaveAttribute('aria-pressed', 'true');
    // Escolha única: marcar uma desmarca a anterior.
    await expect(pendentes).toHaveAttribute('aria-pressed', 'false');
  },
};

export const SelectButtonMultiplo: Story = {
  name: 'SelectButton · escolha múltipla',
  render: () => (
    <SelectButton
      legend="Tipos de benefício"
      multiple
      options={[
        { value: 'saude', label: 'Saúde' },
        { value: 'transporte', label: 'Transporte' },
        { value: 'alimentacao', label: 'Alimentação' },
      ]}
      defaultValue={['saude']}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Transporte' }));

    await expect(canvas.getByRole('button', { name: 'Saúde' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(canvas.getByRole('button', { name: 'Transporte' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
  },
};
