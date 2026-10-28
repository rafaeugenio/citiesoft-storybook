import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { FinanceShell } from '@/components/application/finance/finance-shell';

type ShellProps = { contained?: boolean };

const meta = {
  title: 'Templates/Finance Dashboard',
  component: FinanceShell as ComponentType<ShellProps>,
  tags: ['autodocs'],
  // a11y em 'todo': páginas completas do Citiesoft com achados (nav sem rótulo, aria-hidden com foco, contraste); tratar na fase de tema da marca.
  parameters: { a11y: { test: 'todo' }, layout: 'fullscreen' },
  argTypes: { contained: { control: 'boolean' } },
} satisfies Meta<ShellProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Contido: Story = {
  args: { contained: true },
  parameters: { layout: 'padded' },
  render: function Render(args) {
    return (
      <div className="h-[720px] w-full overflow-hidden rounded-xl border border-separator-border">
        <FinanceShell {...args} />
      </div>
    );
  },
};

export const Mobile: Story = {
  args: { contained: true },
  parameters: { layout: 'padded' },
  render: function Render(args) {
    return (
      <div className="h-[760px] w-[390px] overflow-hidden rounded-xl border border-separator-border">
        <FinanceShell {...args} />
      </div>
    );
  },
};
