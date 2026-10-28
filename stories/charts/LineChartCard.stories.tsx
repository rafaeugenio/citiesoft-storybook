import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChartCard } from '@/components/application/dashboard/line-chart-card';

type LineChartCardProps = NonNullable<Parameters<typeof LineChartCard>[0]>;

const meta = {
  title: 'Charts/LineChartCard',
  component: LineChartCard as ComponentType<LineChartCardProps>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Cartão de receita com linha e área em gradiente. Alterna entre períodos semanal, mensal e anual pelo controle segmentado; ao passar o mouse, o valor em destaque acompanha o ponto.',
      },
    },
  },
  argTypes: {
    shape: { control: 'inline-radio', options: ['curved', 'sharp'] },
  },
} satisfies Meta<LineChartCardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Curvo: Story = {
  name: 'Curvo (padrão)',
  args: { shape: 'curved' },
  render: (args) => (
    <div className="w-[560px]">
      <LineChartCard {...args} />
    </div>
  ),
};

export const Anguloso: Story = {
  name: 'Anguloso',
  args: { shape: 'sharp' },
  render: (args) => (
    <div className="w-[560px]">
      <LineChartCard {...args} />
    </div>
  ),
};

export const LadoALado: Story = {
  name: 'Curvo e anguloso lado a lado',
  render: () => (
    <div className="flex w-[1160px] gap-6">
      <LineChartCard shape="curved" />
      <LineChartCard shape="sharp" />
    </div>
  ),
};

export const Compacto: Story = {
  name: 'Largura estreita (mobile)',
  args: { shape: 'curved' },
  render: (args) => (
    <div className="w-[360px]">
      <LineChartCard {...args} />
    </div>
  ),
};
