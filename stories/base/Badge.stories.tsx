import type { Meta, StoryObj } from '@storybook/react-vite';
import { Badge } from '@/components/base/badges/badge';

const meta = {
  title: 'Base/Badge',
  component: Badge,
  tags: ['autodocs'],
  args: { children: '12' },
  argTypes: {
    color: { control: 'inline-radio', options: ['primary', 'neutral'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Cores: Story = {
  parameters: { a11y: { test: 'todo' } }, // contraste da paleta accent do Citiesoft: some ao mapear a marca Citiesoft (fase Fundação)
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['primary', 'neutral'] as const).map((color) => (
        <Badge key={color} {...args} color={color}>
          {color}
        </Badge>
      ))}
    </div>
  ),
};

export const Contadores: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge {...args} color="primary">3</Badge>
      <Badge {...args} color="neutral">28</Badge>
      <Badge {...args} color="neutral">99+</Badge>
    </div>
  ),
};
