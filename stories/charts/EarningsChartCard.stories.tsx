import type { Meta, StoryObj } from '@storybook/react-vite';
import { EarningsChartCard } from '@/components/application/dashboard/earnings-chart-card';

const meta = {
  title: 'Charts/EarningsChartCard',
  component: EarningsChartCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Card de receita com gráfico de barras. O seletor Semanal, Mensal e Anual troca os dados e o total. Passe o mouse sobre uma barra para ver o valor do mês no cabeçalho.',
      },
    },
  },
  argTypes: { className: { control: false } },
  render: (args) => (
    <div className="w-[560px]">
      <EarningsChartCard {...args} />
    </div>
  ),
} satisfies Meta<typeof EarningsChartCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const LarguraCompacta: Story = {
  render: (args) => (
    <div className="w-[380px]">
      <EarningsChartCard {...args} />
    </div>
  ),
};

export const LarguraDoDashboard: Story = {
  name: 'Largura do dashboard (673px)',
  render: (args) => (
    <div className="w-[673px]">
      <EarningsChartCard {...args} />
    </div>
  ),
};
