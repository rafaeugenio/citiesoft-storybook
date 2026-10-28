import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiArrowLeftLine, RiArrowRightLine } from '@remixicon/react';
import { LinkButton } from '@/components/base/buttons/link-button';

const meta = {
  title: 'Base/LinkButton',
  component: LinkButton,
  tags: ['autodocs'],
  args: { children: 'Saiba mais' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['primary', 'secondary'] },
    size: { control: 'inline-radio', options: ['medium', 'small', 'xs'] },
    disabled: { control: 'boolean' },
  },
} satisfies Meta<typeof LinkButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {(['primary', 'secondary'] as const).map((variant) => (
        <LinkButton key={variant} {...args} variant={variant}>
          {variant}
        </LinkButton>
      ))}
    </div>
  ),
};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      {(['medium', 'small', 'xs'] as const).map((size) => (
        <LinkButton key={size} {...args} size={size}>
          {size}
        </LinkButton>
      ))}
    </div>
  ),
};

export const ComIcones: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <LinkButton {...args} leadingIcon={RiArrowLeftLine}>Voltar</LinkButton>
      <LinkButton {...args} trailingIcon={RiArrowRightLine}>Continuar</LinkButton>
    </div>
  ),
};

export const ComoLink: Story = {
  render: () => (
    <LinkButton href="https://example.com" trailingIcon={RiArrowRightLine}>
      Ir para a documentação
    </LinkButton>
  ),
};

export const Desabilitado: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-4">
      <LinkButton {...args} disabled>Botão desabilitado</LinkButton>
      <LinkButton href="https://example.com" disabled>Link desabilitado</LinkButton>
    </div>
  ),
};
