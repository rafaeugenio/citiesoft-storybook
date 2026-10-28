import type { Meta, StoryObj } from '@storybook/react-vite';
import { Chip } from '@/components/base/badges/chip';

const colors = [
  'orange', 'lime', 'rose', 'yellow', 'cyan', 'blue', 'purple', 'neutral', 'gray', 'soft',
] as const;

const meta = {
  title: 'Base/Chip',
  component: Chip,
  tags: ['autodocs'],
  args: { children: 'Aprovado' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['bold', 'subtle', 'caption'] },
    color: { control: 'select', options: colors },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['bold', 'subtle', 'caption'] as const).map((variant) => (
        <Chip key={variant} {...args} variant={variant}>
          {variant}
        </Chip>
      ))}
    </div>
  ),
};

export const Cores: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {colors.map((color) => (
        <Chip key={color} {...args} color={color}>
          {color}
        </Chip>
      ))}
    </div>
  ),
};

export const Status: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Chip {...args} color="lime">Aprovado</Chip>
      <Chip {...args} color="yellow">Pendente</Chip>
      <Chip {...args} color="rose">Rejeitado</Chip>
      <Chip {...args} color="blue">Em análise</Chip>
    </div>
  ),
};
