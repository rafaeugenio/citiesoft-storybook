import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiKey2Line } from '@remixicon/react';
import { SocialButton } from '@/components/base/social-button/social-button';

const meta = {
  title: 'Base/SocialButton',
  component: SocialButton,
  tags: ['autodocs'],
  args: { brand: 'google' },
  argTypes: {
    brand: {
      control: 'select',
      options: ['google', 'apple', 'github', 'gitlab', 'microsoft', 'x'],
    },
    size: { control: 'inline-radio', options: ['medium', 'small'] },
    appearance: { control: 'inline-radio', options: ['colorful', 'black', 'white'] },
    iconOnly: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
  },
} satisfies Meta<typeof SocialButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Aparencias: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['colorful', 'black', 'white'] as const).map((appearance) => (
        <SocialButton key={appearance} {...args} appearance={appearance} />
      ))}
    </div>
  ),
};

export const Provedores: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(['google', 'apple', 'github', 'gitlab', 'microsoft', 'x'] as const).map((brand) => (
        <SocialButton key={brand} {...args} brand={brand} appearance="white" />
      ))}
    </div>
  ),
};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-3">
      {(['medium', 'small'] as const).map((size) => (
        <SocialButton key={size} {...args} size={size} appearance="white" />
      ))}
    </div>
  ),
};

export const SomenteIcone: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['colorful', 'black', 'white'] as const).map((appearance) => (
        <SocialButton key={appearance} {...args} iconOnly appearance={appearance} />
      ))}
    </div>
  ),
};

export const LarguraTotal: Story = {
  args: { fullWidth: true, appearance: 'white' },
  decorators: [(Story) => <div className="w-[420px]"><Story /></div>],
};

export const Personalizado: Story = {
  args: {
    brand: 'custom',
    appearance: 'colorful',
    config: { icon: <RiKey2Line />, label: 'SSO corporativo', color: '#146BFA' },
  },
};

export const Desabilitado: Story = { args: { disabled: true, appearance: 'white' } };
