import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { SleepScoreCard } from '@/components/application/medical/sleep-score-card';

type Props = { className?: string };

const meta = {
  title: 'Charts/SleepScoreCard',
  component: SleepScoreCard as ComponentType<Props>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Anel de pontuação do sono com três arcos (duração, horário de dormir e interrupções). Ao passar o mouse sobre um arco, o número central troca pela nota daquele critério. Os dados são embutidos no componente.',
      },
    },
  },
} satisfies Meta<Props>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  render: (args) => (
    <div className="w-[360px]">
      <SleepScoreCard {...args} />
    </div>
  ),
};

export const LarguraAmpla: Story = {
  render: (args) => (
    <div className="w-[560px]">
      <SleepScoreCard {...args} />
    </div>
  ),
};

export const LarguraCompacta: Story = {
  render: (args) => (
    <div className="w-[300px]">
      <SleepScoreCard {...args} />
    </div>
  ),
};

export const LadoALado: Story = {
  render: (args) => (
    <div className="flex w-[760px] gap-4">
      <SleepScoreCard {...args} />
      <SleepScoreCard {...args} className="opacity-90" />
    </div>
  ),
};
