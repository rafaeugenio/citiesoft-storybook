import type { Meta, StoryObj } from '@storybook/react-vite';
import { CloseButton } from '@/components/base/buttons/close-button';

const meta = {
  title: 'Base/CloseButton',
  component: CloseButton,
  tags: ['autodocs'],
  args: { 'aria-label': 'Fechar' },
  argTypes: {
    size: { control: 'inline-radio', options: ['2xs', 'xs', 'sm', 'md'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof CloseButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['2xs', 'xs', 'sm', 'md'] as const).map((size) => (
        <CloseButton key={size} {...args} size={size} aria-label={`Fechar (${size})`} />
      ))}
    </div>
  ),
};

export const Desabilitado: Story = { args: { disabled: true } };
