import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ACCENTS,
  ContributionsCard,
  ContributionsGrid,
} from '@/components/application/dashboard/contributions-card';

const meta = {
  title: 'Charts/ContributionsCard',
  component: ContributionsCard,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    accent: { control: 'select', options: [...ACCENTS] },
    className: { control: false },
  },
  args: { accent: 'violet' },
  render: (args) => (
    <div className="w-[560px]">
      <ContributionsCard {...args} />
    </div>
  ),
} satisfies Meta<typeof ContributionsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Esmeralda: Story = { args: { accent: 'emerald' } };

export const Azul: Story = { args: { accent: 'blue' } };

export const Ambar: Story = { args: { accent: 'amber' } };

export const Rosa: Story = { args: { accent: 'rose' } };

export const TodasAsCores: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="grid w-[1180px] grid-cols-2 gap-4">
      {ACCENTS.map((accent) => (
        <ContributionsCard key={accent} accent={accent} />
      ))}
    </div>
  ),
};

export const SomenteGrade: Story = {
  name: 'Somente a grade (ContributionsGrid)',
  parameters: { controls: { disable: true } },
  render: () => (
    <div className="flex w-[560px] flex-col gap-4">
      <ContributionsGrid columns={37} accent="teal" />
      <ContributionsGrid columns={38} accent="indigo" animateIn />
    </div>
  ),
};
