import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { OrdersChartCard, type OrdersPoint } from '@/components/application/dashboard/orders-chart-card';

type OrdersChartCardProps = NonNullable<Parameters<typeof OrdersChartCard>[0]>;

const meta = {
  title: 'Charts/OrdersChartCard',
  component: OrdersChartCard as ComponentType<OrdersChartCardProps>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Barras mensais comparando o ano atual com o anterior. O total e o delta aparecem no cabeçalho; ao passar o mouse sobre um mês, o destaque troca para aquele mês.',
      },
    },
  },
  argTypes: {
    title: { control: 'text' },
  },
} satisfies Meta<OrdersChartCardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const pedidosCrescimento: OrdersPoint[] = [
  [820, 700], [860, 740], [940, 790], [910, 810], [1020, 850], [1080, 900],
  [1150, 940], [1120, 980], [1210, 1010], [1290, 1060], [1380, 1100], [1520, 1170],
].map(([current, previous], i) => ({ label: meses[i], current, previous }));

const pedidosQueda: OrdersPoint[] = [
  [1480, 1620], [1410, 1580], [1360, 1540], [1300, 1490], [1270, 1450], [1190, 1400],
  [1210, 1380], [1150, 1330], [1100, 1310], [1080, 1280], [1020, 1240], [980, 1210],
].map(([current, previous], i) => ({ label: meses[i], current, previous }));

export const Padrao: Story = {
  name: 'Dados padrão',
  render: (args) => (
    <div className="w-[560px]">
      <OrdersChartCard {...args} />
    </div>
  ),
};

export const Crescimento: Story = {
  name: 'Pedidos em crescimento',
  args: { title: 'Pedidos da loja online', data: pedidosCrescimento },
  render: (args) => (
    <div className="w-[560px]">
      <OrdersChartCard {...args} />
    </div>
  ),
};

export const Queda: Story = {
  name: 'Pedidos em queda (delta negativo)',
  args: { title: 'Pedidos no varejo', data: pedidosQueda },
  render: (args) => (
    <div className="w-[560px]">
      <OrdersChartCard {...args} />
    </div>
  ),
};

export const SemBaseAnterior: Story = {
  name: 'Sem ano anterior (novo)',
  args: {
    title: 'Pedidos do novo canal',
    data: meses.map((label, i) => ({ label, current: 120 + i * 35, previous: 0 })),
  },
  render: (args) => (
    <div className="w-[560px]">
      <OrdersChartCard {...args} />
    </div>
  ),
};
