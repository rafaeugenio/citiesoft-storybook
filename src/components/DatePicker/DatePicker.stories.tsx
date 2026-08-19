import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DatePicker, dataPorExtenso, formatarData, gradeDoMes } from './DatePicker';

// Data fixa para a story ser determinística no snapshot e no teste.
const HOJE = new Date(2026, 2, 15);

const meta = {
  title: 'Formulário/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Seleção de data. Spec: `03-components/date-picker.md` v2.0.0. Equivalente PrimeNG: `p-datepicker`. Exibição sempre em dd/mm/aaaa.',
      },
    },
  },
  args: { label: 'Data de saída', hoje: HOJE },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Estado · default',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Data de saída');
    // O placeholder mostra o formato com "Ex.:".
    await expect(campo).toHaveAttribute('placeholder', 'Ex.: 15/03/2026');
  },
};

export const Aberto: Story = {
  name: 'Estado · calendário aberto',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText('Data de saída'));

    const painel = canvas.getByRole('dialog', { name: 'Calendário de data de saída' });
    await expect(painel).toBeVisible();
    await expect(canvas.getByText('março de 2026')).toBeVisible();

    // O dia de hoje é anunciado com a data completa por extenso.
    const hoje = canvas.getByRole('button', { name: '15 de março de 2026' });
    await expect(hoje).toHaveAttribute('aria-current', 'date');
  },
};

export const Selecao: Story = {
  name: 'Estado · selecionado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Data de saída');

    await userEvent.click(campo);
    await userEvent.click(canvas.getByRole('button', { name: '20 de março de 2026' }));

    await expect(campo).toHaveValue('20/03/2026');
    // O painel fecha ao escolher a data.
    await expect(canvas.queryByRole('dialog')).toBeNull();
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'A11y · navegação por teclado',
  parameters: {
    docs: {
      description: {
        story:
          'Setas andam entre os dias, Page Up e Page Down trocam de mês, Enter seleciona e Esc fecha.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Data de saída');

    await userEvent.click(campo);
    await expect(canvas.getByRole('button', { name: '15 de março de 2026' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('button', { name: '16 de março de 2026' })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('button', { name: '23 de março de 2026' })).toHaveFocus();

    await userEvent.keyboard('{PageDown}');
    await expect(canvas.getByText('abril de 2026')).toBeVisible();

    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('dialog')).toBeNull();
  },
};

export const DiasForaDoMes: Story = {
  name: 'Regra · dias fora do mês',
  parameters: {
    docs: {
      description: {
        story: 'Dias de preenchimento do mês vizinho aparecem em cor de desabilitado e não clicam.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByLabelText('Data de saída'));

    // Março de 2026 começa num domingo, então a grade puxa o fim de fevereiro.
    const grade = gradeDoMes(HOJE);
    await expect(grade).toHaveLength(42);
    await expect(canvas.getByRole('button', { name: '4 de abril de 2026' })).toBeDisabled();
  },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    label: 'Data final',
    valorInicial: new Date(2026, 2, 10),
    error: 'Data final anterior à data inicial. Ajuste o período.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText('Data final');

    await expect(campo).toHaveAttribute('aria-invalid', 'true');
    // A data digitada é preservada no erro.
    await expect(campo).toHaveValue('10/03/2026');
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true, valorInicial: HOJE },
};

export const Intervalo: Story = {
  name: 'Combinação · intervalo',
  parameters: {
    docs: {
      description: {
        story: 'As duas pontas são nomeadas, nunca "Data 1" e "Data 2".',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      <DatePicker {...args} label="Data inicial" />
      <DatePicker {...args} label="Data final" />
    </div>
  ),
  play: async () => {
    await expect(formatarData(HOJE)).toBe('15/03/2026');
    await expect(dataPorExtenso(HOJE)).toBe('15 de março de 2026');
  },
};
