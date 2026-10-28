import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CalendarDate } from '@internationalized/date';
import { DatePicker } from '@/components/base/date-picker/date-picker';

const meta = {
  title: 'Base/DatePicker',
  component: DatePicker,
  tags: ['autodocs'],
  args: { 'aria-label': 'Data de vencimento' },
  argTypes: {
    isDisabled: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="min-h-[460px]"><Story /></div>],
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const ComValorInicial: Story = {
  args: { defaultValue: new CalendarDate(2026, 10, 20) },
};

export const Controlado: Story = {
  render: function Render(args) {
    const [valor, setValor] = useState<CalendarDate | null>(new CalendarDate(2026, 11, 5));
    return (
      <div className="flex flex-col items-start gap-3">
        <DatePicker {...args} value={valor} onChange={setValor} />
        <span className="text-body-medium text-text-secondary">
          Selecionada: {valor ? valor.toString() : 'nenhuma'}
        </span>
      </div>
    );
  },
};

export const Desabilitado: Story = { args: { isDisabled: true } };
