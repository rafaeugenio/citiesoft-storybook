import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from '@/components/base/avatar/avatar';

const meta = {
  title: 'Base/Avatar',
  component: Avatar,
  tags: ['autodocs'],
  args: { initials: 'M' },
  argTypes: {
    size: { control: 'inline-radio', options: ['xs', 'sm', 'md', 'lg'] },
    color: { control: 'inline-radio', options: ['neutral', 'blue', 'lime', 'pink'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['xs', 'sm', 'md', 'lg'] as const).map((size) => (
        <Avatar key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Cores: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['neutral', 'blue', 'lime', 'pink'] as const).map((color) => (
        <Avatar key={color} {...args} color={color} />
      ))}
    </div>
  ),
};

export const ComFoto: Story = {
  args: {
    src: "data:image/svg+xml;utf8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='72' height='72'%3E%3Crect width='72' height='72' fill='%23146BFA'/%3E%3Ccircle cx='36' cy='28' r='13' fill='%23fff'/%3E%3Cellipse cx='36' cy='66' rx='24' ry='19' fill='%23fff'/%3E%3C/svg%3E",
    alt: 'Foto de perfil de Maria',
    size: 'lg',
  },
};
