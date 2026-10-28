import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ComponentType } from 'react';
import { AiChatShell } from '@/components/application/ai-chat/ai-chat-shell';

type Props = Parameters<typeof AiChatShell>[0];

const meta = {
  title: 'Templates/AI Image Generation',
  component: AiChatShell as ComponentType<NonNullable<Props>>,
  tags: ['autodocs'],
  // a11y em 'todo': páginas completas do Citiesoft com achados (nav sem rótulo, aria-hidden com foco, contraste); tratar na fase de tema da marca.
  parameters: { a11y: { test: 'todo' }, layout: 'fullscreen' },
  args: { defaultScenario: "image-generation" },
} satisfies Meta<NonNullable<Props>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela inteira em desktop. */
export const Padrao: Story = {};

/** Dentro de um contêiner de altura fixa, como numa pré-visualização embutida. */
export const Contido: Story = {
  args: { contained: true },
  decorators: [
    (Story) => (
      <div
        className="relative h-[720px] overflow-hidden"
        style={{ ['--template-preview-height' as string]: '720px' }}
      >
        <Story />
      </div>
    ),
  ],
};

/** Viewport de celular: a barra lateral vira gaveta. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};
