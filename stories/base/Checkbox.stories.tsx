import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from '@/components/base/checkbox/checkbox';

const meta = {
  title: 'Base/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  args: { children: 'Aceito os termos de uso' },
  argTypes: {
    size: { control: 'inline-radio', options: ['md', 'sm'] },
    isSelected: { control: 'boolean' },
    isIndeterminate: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      {(['md', 'sm'] as const).map((size) => (
        <Checkbox key={size} {...args} size={size} defaultSelected>
          Tamanho {size}
        </Checkbox>
      ))}
    </div>
  ),
};

export const Estados: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Checkbox {...args}>Desmarcado</Checkbox>
      <Checkbox {...args} defaultSelected>Marcado</Checkbox>
      <Checkbox {...args} isIndeterminate>Indeterminado</Checkbox>
    </div>
  ),
};

export const Desabilitado: Story = {
  render: (args) => (
    <div className="flex flex-col gap-3">
      <Checkbox {...args} isDisabled>Desmarcado</Checkbox>
      <Checkbox {...args} isDisabled defaultSelected>Marcado</Checkbox>
      <Checkbox {...args} isDisabled isIndeterminate>Indeterminado</Checkbox>
    </div>
  ),
};

export const SemRotulo: Story = {
  args: { children: undefined, 'aria-label': 'Selecionar linha' },
};
