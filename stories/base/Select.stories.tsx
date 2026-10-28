import type { Meta, StoryObj } from '@storybook/react-vite';
import { Select, SelectItem } from '@/components/base/select/select';

const meta = {
  title: 'Base/Select',
  component: Select,
  tags: ['autodocs'],
  args: { placeholder: 'Selecione um status', 'aria-label': 'Status', children: null },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    isDisabled: { control: 'boolean' },
  },
  render: (args) => (
    <div className="min-h-[260px]">
      <Select {...args}>
        <SelectItem id="ativo">Ativo</SelectItem>
        <SelectItem id="pendente">Pendente</SelectItem>
        <SelectItem id="inativo">Inativo</SelectItem>
      </Select>
    </div>
  ),
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(['md', 'sm'] as const).map((size) => (
        <Select key={size} {...args} size={size} aria-label={`Tamanho ${size}`}>
          <SelectItem id="ativo">Ativo</SelectItem>
          <SelectItem id="pendente">Pendente</SelectItem>
          <SelectItem id="inativo">Inativo</SelectItem>
        </Select>
      ))}
    </div>
  ),
};

export const ComValorSelecionado: Story = { args: { defaultSelectedKey: 'pendente' } };

export const ItemDesabilitado: Story = {
  render: (args) => (
    <div className="min-h-[260px]">
      <Select {...args}>
        <SelectItem id="ativo">Ativo</SelectItem>
        <SelectItem id="pendente" isDisabled>Pendente</SelectItem>
        <SelectItem id="inativo">Inativo</SelectItem>
      </Select>
    </div>
  ),
};

export const Desabilitado: Story = { args: { isDisabled: true } };
