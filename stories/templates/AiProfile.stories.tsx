import type { ComponentType } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AiProfileShell } from '@/components/application/ai-profile/ai-profile-shell';

type ShellProps = { contained?: boolean };

const meta = {
  title: 'Templates/AI Profile',
  component: AiProfileShell as ComponentType<ShellProps>,
  tags: ['autodocs'],
  // a11y em 'todo': páginas completas do Citiesoft com achados (nav sem rótulo, aria-hidden com foco, contraste); tratar na fase de tema da marca.
  parameters: { a11y: { test: 'todo' },
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Perfil de assistente de IA com navegação lateral e painéis de uso. A prop contained limita a altura ao contêiner.',
      },
    },
  },
  argTypes: {
    contained: { control: 'boolean' },
  },
} satisfies Meta<ShellProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const ALTURA = '720px';

export const Padrao: Story = {
  name: 'Padrão',
  args: { contained: false },
};

export const Contido: Story = {
  name: 'Contido',
  args: { contained: true },
  parameters: { layout: 'padded' },
  render: function Render(args) {
    return (
      <div
        className="overflow-hidden rounded-xl border border-separator-border"
        style={{ height: ALTURA, '--template-preview-height': ALTURA } as CSSProperties}
      >
        <AiProfileShell {...args} />
      </div>
    );
  },
};

export const Mobile: Story = {
  name: 'Mobile',
  args: { contained: true },
  parameters: { layout: 'padded' },
  render: function Render(args) {
    return (
      <div
        className="w-[390px] overflow-hidden rounded-xl border border-separator-border"
        style={{ height: ALTURA, '--template-preview-height': ALTURA } as CSSProperties}
      >
        <AiProfileShell {...args} />
      </div>
    );
  },
};
