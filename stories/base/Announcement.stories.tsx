import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiSparklingFill } from '@remixicon/react';
import { Announcement } from '@/components/base/announcement/announcement';

const meta = {
  title: 'Base/Announcement',
  component: Announcement,
  tags: ['autodocs'],
  args: {
    title: 'Novidades do sistema',
    description: 'Conheça os novos relatórios disponíveis no painel.',
    actionLabel: 'Ver novidades',
  },
  decorators: [
    (Story) => (
      <div className="w-[236px]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Announcement>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const ApenasTitulo: Story = {
  args: { description: undefined, actionLabel: undefined },
};

export const SemAcao: Story = {
  args: { actionLabel: undefined },
};

export const ComIconePersonalizado: Story = {
  args: { icon: RiSparklingFill, title: 'Recurso novo' },
};

export const Dispensavel: Story = {
  args: { dismissible: true, closeLabel: 'Dispensar aviso' },
};

export const ComEntradaAnimada: Story = {
  args: { introDelay: 0.3, dismissible: true, closeLabel: 'Dispensar aviso' },
};
