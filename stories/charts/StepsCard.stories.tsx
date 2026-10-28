import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { StepsCard } from '@/components/application/medical/steps-card';

type Props = { className?: string };

const meta = {
  title: 'Charts/StepsCard',
  component: StepsCard as ComponentType<Props>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Passos por dia da semana em barras. Passar o mouse sobre uma barra mostra a contagem do dia; as setas do seletor de semana navegam entre semanas. Os dados são gerados dentro do componente.',
      },
    },
  },
} satisfies Meta<Props>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: (args) => (
    <div className="w-[360px]">
      <StepsCard {...args} />
    </div>
  ),
};

export const LarguraAmpla: Story = {
  render: (args) => (
    <div className="w-[560px]">
      <StepsCard {...args} />
    </div>
  ),
};

export const LarguraCompacta: Story = {
  render: (args) => (
    <div className="w-[300px]">
      <StepsCard {...args} />
    </div>
  ),
};

export const ComClasseExtra: Story = {
  render: (args) => (
    <div className="w-[420px]">
      <StepsCard {...args} className="shadow-lg" />
    </div>
  ),
};
