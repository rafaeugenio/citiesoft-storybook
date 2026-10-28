import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiAddLine, RiArrowRightLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';

const meta = {
  title: 'Base/Button',
  component: Button,
  tags: ['autodocs'],
  args: { children: 'Salvar' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'inline-radio', options: ['medium', 'small', 'xs'] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primario: Story = {};

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['primary', 'secondary', 'ghost', 'danger'] as const).map((variant) => (
        <Button key={variant} {...args} variant={variant}>
          {variant}
        </Button>
      ))}
    </div>
  ),
};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['medium', 'small', 'xs'] as const).map((size) => (
        <Button key={size} {...args} size={size}>
          {size}
        </Button>
      ))}
    </div>
  ),
};

export const ComIcones: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      <Button {...args} leadingIcon={RiAddLine}>Adicionar</Button>
      <Button {...args} variant="secondary" trailingIcon={RiArrowRightLine}>Continuar</Button>
      <Button {...args} iconOnly leadingIcon={RiAddLine} aria-label="Adicionar" />
    </div>
  ),
};

export const Desabilitado: Story = { args: { disabled: true } };
