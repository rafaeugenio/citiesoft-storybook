import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RevenueChartCard, type RevenuePoint } from '@/components/application/dashboard/revenue-chart-card';

type RevenueChartCardProps = NonNullable<Parameters<typeof RevenueChartCard>[0]>;

const meta = {
  title: 'Charts/RevenueChartCard',
  component: RevenueChartCard as ComponentType<RevenueChartCardProps>,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    title: { control: 'text' },
  },
  render: (args) => (
    <div className="flex w-[560px]">
      <RevenueChartCard {...args} />
    </div>
  ),
} satisfies Meta<RevenueChartCardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const crescimento: RevenuePoint[] = [
  { label: 'Jan', current: 41200, previous: 36800 },
  { label: 'Feb', current: 43850, previous: 37900 },
  { label: 'Mar', current: 47100, previous: 40200 },
  { label: 'Apr', current: 45600, previous: 41000 },
  { label: 'May', current: 49800, previous: 42700 },
  { label: 'Jun', current: 52300, previous: 44100 },
  { label: 'Jul', current: 55900, previous: 46500 },
  { label: 'Aug', current: 54200, previous: 47300 },
  { label: 'Sep', current: 58700, previous: 49000 },
  { label: 'Oct', current: 61400, previous: 50800 },
  { label: 'Nov', current: 63900, previous: 52400 },
  { label: 'Dec', current: 68500, previous: 55200 },
];

const queda: RevenuePoint[] = crescimento.map((p, i) => ({
  ...p,
  current: Math.round(p.previous * (i < 4 ? 1.04 : 0.88 - i * 0.004)),
}));

const semHistorico: RevenuePoint[] = crescimento.map((p) => ({ ...p, previous: 0 }));

export const Padrao: Story = {
  name: 'Dados padrão',
  args: {},
};

export const TituloPersonalizado: Story = {
  name: 'Título personalizado',
  args: { title: 'Receita de mensalidades', data: crescimento },
};

export const CrescimentoAnual: Story = {
  name: 'Crescimento sobre o ano anterior',
  args: { title: 'Receita total', data: crescimento },
};

export const QuedaNaReceita: Story = {
  name: 'Receita em queda (variação negativa)',
  args: { title: 'Receita total', data: queda },
};

export const SemAnoAnterior: Story = {
  name: 'Sem histórico (chip "New")',
  args: { title: 'Receita total', data: semHistorico },
};
