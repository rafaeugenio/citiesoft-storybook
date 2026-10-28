import type { Meta, StoryObj } from '@storybook/react-vite';
import { Switch } from '@/components/base/switch/switch';

const meta = {
  title: 'Base/Switch',
  component: Switch,
  tags: ['autodocs'],
  args: { children: 'Receber notificações' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    shape: { control: 'inline-radio', options: ['pill', 'rectangle'] },
    isDisabled: { control: 'boolean' },
    isSelected: { control: 'boolean' },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Formatos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      {(['pill', 'rectangle'] as const).map((shape) => (
        <Switch key={shape} {...args} shape={shape} defaultSelected>
          {shape}
        </Switch>
      ))}
    </div>
  ),
};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      {(['sm', 'md', 'lg'] as const).map((size) => (
        <Switch key={size} {...args} size={size} defaultSelected>
          {size}
        </Switch>
      ))}
    </div>
  ),
};

export const Estados: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      <Switch {...args}>Desligado</Switch>
      <Switch {...args} defaultSelected>Ligado</Switch>
      <Switch {...args} isDisabled>Desabilitado</Switch>
      <Switch {...args} isDisabled defaultSelected>Ligado e desabilitado</Switch>
    </div>
  ),
};

export const SemRotulo: Story = {
  args: { children: undefined, 'aria-label': 'Ativar modo escuro' },
};
