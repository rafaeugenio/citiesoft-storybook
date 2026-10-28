import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiMailLine } from '@remixicon/react';
import { Notification } from '@/components/base/notification/notification';

const meta = {
  title: 'Base/Notification',
  component: Notification,
  tags: ['autodocs'],
  args: {
    title: 'Solicitação atualizada',
    description: 'O status do pedido foi alterado para em análise.',
    timestamp: 'há 2 min',
  },
  argTypes: {
    status: { control: 'inline-radio', options: ['neutral', 'information', 'success', 'error'] },
    dismissible: { control: 'boolean' },
    autoDismissDuration: { control: 'number' },
  },
  decorators: [
    (Story) => (
      <div className="w-[400px] max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Notification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Estados: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(['neutral', 'information', 'success', 'error'] as const).map((status) => (
        <Notification key={status} {...args} status={status} title={status} />
      ))}
    </div>
  ),
};

export const ComAcoes: Story = {
  args: {
    status: 'information',
    actions: [{ label: 'Ver detalhes' }, { label: 'Dispensar' }],
  },
};

export const ComAvatar: Story = {
  args: {
    title: 'Maria Souza',
    description: 'Comentou na sua solicitação.',
    avatar: { initials: 'MS', color: 'blue', presence: 'online' },
  },
};

export const IconePersonalizado: Story = {
  args: { icon: RiMailLine, title: 'Nova mensagem', description: 'Você recebeu 1 mensagem não lida.' },
};

export const SemDispensar: Story = { args: { dismissible: false } };

export const DispensaAutomatica: Story = {
  args: { status: 'success', title: 'Salvo com sucesso', description: 'Some em 6 segundos.', autoDismissDuration: 6000 },
};
