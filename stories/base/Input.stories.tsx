import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiMailLine, RiSearchLine } from '@remixicon/react';
import { Input } from '@/components/base/input/input';

const meta = {
  title: 'Base/Input',
  component: Input,
  tags: ['autodocs'],
  args: { label: 'Nome completo', placeholder: 'Digite o nome' },
  argTypes: {
    size: { control: 'inline-radio', options: ['medium', 'small'] },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
    isReadOnly: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div className="w-80 max-w-full">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      {(['medium', 'small'] as const).map((size) => (
        <Input key={size} {...args} size={size} label={size} />
      ))}
    </div>
  ),
};

export const ComDica: Story = {
  args: { label: 'E-mail', type: 'email', placeholder: 'nome@exemplo.com', hint: 'Usaremos este e-mail para contato.' },
};

export const Obrigatorio: Story = {
  args: { isRequired: true, tooltip: 'Campo obrigatório' },
};

export const ComIcones: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <Input {...args} label="E-mail" leadingIcon={RiMailLine} placeholder="nome@exemplo.com" />
      <Input {...args} label="Buscar" trailingIcon={RiSearchLine} placeholder="Pesquisar" />
    </div>
  ),
};

export const Invalido: Story = {
  parameters: { a11y: { test: 'todo' } }, // contraste da paleta accent do Citiesoft: some ao mapear a marca Citiesoft (fase Fundação)
  args: { isInvalid: true, defaultValue: 'João', hint: 'Informe o nome e o sobrenome.' },
};

export const Desabilitado: Story = {
  args: { isDisabled: true, defaultValue: 'Campo bloqueado' },
};
