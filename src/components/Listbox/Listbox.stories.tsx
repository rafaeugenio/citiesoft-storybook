import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Listbox } from './Listbox';

const ESPECIALIDADES = [
  { value: 'cardio', label: 'Cardiologia', grupo: 'Clínicas' },
  { value: 'neuro', label: 'Neurologia', grupo: 'Clínicas' },
  { value: 'onco', label: 'Oncologia', grupo: 'Clínicas' },
  { value: 'orto', label: 'Ortopedia', grupo: 'Cirúrgicas' },
  { value: 'oftalmo', label: 'Oftalmologia', grupo: 'Cirúrgicas' },
  { value: 'vascular', label: 'Cirurgia vascular', grupo: 'Cirúrgicas', disabled: true },
];

const meta = {
  title: 'Formulário/Listbox',
  component: Listbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lista sempre visível, sem overlay. Origem: Figma CitieOne, página ❖ Listbox (State: Idle | Invalid | Disabled, Show Filter, e a opção com State, Group e Checkmark). Equivalente PrimeNG: `p-listbox`.',
      },
    },
  },
  args: { label: 'Especialidade', opcoes: ESPECIALIDADES },
} satisfies Meta<typeof Listbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'State · idle',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lista = canvas.getByRole('listbox', { name: 'Especialidade' });

    await expect(lista).toBeVisible();
    await userEvent.click(canvas.getByRole('option', { name: 'Neurologia' }));
    await expect(canvas.getByRole('option', { name: 'Neurologia' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const Agrupada: Story = {
  name: 'Option · agrupada',
  parameters: {
    docs: {
      description: {
        story: 'Cabeçalho de grupo por categoria, com as opções em um grupo nomeado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Clínicas' })).toBeVisible();
    await expect(canvas.getByRole('group', { name: 'Cirúrgicas' })).toBeVisible();
  },
};

export const Multipla: Story = {
  name: 'Variante · múltipla com checkmark',
  args: { multiplo: true, defaultValue: ['cardio'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lista = canvas.getByRole('listbox');

    await expect(lista).toHaveAttribute('aria-multiselectable', 'true');
    await userEvent.click(canvas.getByRole('option', { name: /Ortopedia/ }));

    await expect(canvas.getByRole('option', { name: /Cardiologia/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(canvas.getByRole('option', { name: /Ortopedia/ })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const ComFiltro: Story = {
  name: 'Show Filter · com filtro',
  args: { comFiltro: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(canvas.getByRole('searchbox', { name: 'Filtrar especialidade' }), 'onco');
    await expect(canvas.getByRole('option', { name: 'Oncologia' })).toBeVisible();
    await expect(canvas.queryByRole('option', { name: 'Ortopedia' })).toBeNull();
  },
};

export const SemResultado: Story = {
  name: 'Estado · filtro sem resultado',
  args: { comFiltro: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.type(canvas.getByRole('searchbox'), 'zzz');
    await expect(canvas.getByText('Nenhuma opção para o filtro aplicado')).toBeVisible();
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'A11y · navegação por teclado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lista = canvas.getByRole('listbox');

    lista.focus();
    await userEvent.keyboard('{ArrowDown}{ArrowDown}{Enter}');
    await expect(canvas.getByRole('option', { name: 'Oncologia' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  },
};

export const Invalida: Story = {
  name: 'State · invalid',
  args: { error: 'Escolha a especialidade para seguir com a solicitação.' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Escolha a especialidade para seguir com a solicitação.'),
    ).toBeVisible();
  },
};

export const Desabilitada: Story = {
  name: 'State · disabled',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('listbox')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  },
};
