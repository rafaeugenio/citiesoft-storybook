import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import {
  MultiAgentChat,
  type MultiAgentChatProps,
} from '@/components/application/multi-agent-chat/multi-agent-chat';

const meta = {
  title: 'Templates/Multi-agent Chat',
  component: MultiAgentChat as ComponentType<MultiAgentChatProps>,
  tags: ['autodocs'],
  // a11y em 'todo': páginas completas do Citiesoft com achados (nav sem rótulo, aria-hidden com foco, contraste); tratar na fase de tema da marca.
  parameters: { a11y: { test: 'todo' }, layout: 'fullscreen' },
  // Chave própria por story: o componente persiste o workspace em localStorage.
  args: { storageKey: 'storybook:multi-agent-chat:padrao' },
} satisfies Meta<MultiAgentChatProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela inteira em desktop. */
export const Padrao: Story = {};

/** Sem persistência: cada abertura começa do workspace inicial. */
export const SemPersistencia: Story = { args: { storageKey: null } };

/** Viewport de celular. */
export const Mobile: Story = {
  args: { storageKey: 'storybook:multi-agent-chat:mobile' },
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};
