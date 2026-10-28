import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiAddLine, RiDeleteBinLine, RiExternalLinkLine, RiMoreLine, RiNotification3Line } from '@remixicon/react';
import { IconButton, IconLinkButton } from '@/components/base/buttons/icon-button';

const meta = {
  title: 'Base/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  args: { icon: RiNotification3Line, 'aria-label': 'Notificações' },
  argTypes: {
    size: { control: 'inline-radio', options: ['medium', 'small'] },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['medium', 'small'] as const).map((size) => (
        <IconButton key={size} {...args} size={size} />
      ))}
    </div>
  ),
};

export const Icones: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <IconButton {...args} icon={RiAddLine} aria-label="Adicionar" />
      <IconButton {...args} icon={RiDeleteBinLine} aria-label="Excluir" />
      <IconButton {...args} icon={RiMoreLine} aria-label="Mais ações" />
    </div>
  ),
};

export const ComoLink: Story = {
  render: () => (
    <IconLinkButton href="https://example.com" target="_blank" rel="noreferrer" icon={RiExternalLinkLine} aria-label="Abrir em nova aba" />
  ),
};

export const Desabilitado: Story = { args: { disabled: true } };
