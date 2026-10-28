import type { Meta, StoryObj } from '@storybook/react-vite';
import { SegmentedControl, SegmentedControlItem } from '@/components/base/segmented-control/segmented-control';

const meta = {
  title: 'Base/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  args: { defaultSelectedKeys: ['semana'], 'aria-label': 'Período' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['solid', 'plain'] },
    isDisabled: { control: 'boolean' },
  },
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem id="dia">Dia</SegmentedControlItem>
      <SegmentedControlItem id="semana">Semana</SegmentedControlItem>
      <SegmentedControlItem id="mes">Mês</SegmentedControlItem>
    </SegmentedControl>
  ),
} satisfies Meta<typeof SegmentedControl>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-4">
      {(['solid', 'plain'] as const).map((variant) => (
        <SegmentedControl key={variant} {...args} variant={variant}>
          <SegmentedControlItem id="dia">Dia</SegmentedControlItem>
          <SegmentedControlItem id="semana">Semana</SegmentedControlItem>
          <SegmentedControlItem id="mes">Mês</SegmentedControlItem>
        </SegmentedControl>
      ))}
    </div>
  ),
};

export const ItemDesabilitado: Story = {
  render: (args) => (
    <SegmentedControl {...args}>
      <SegmentedControlItem id="dia">Dia</SegmentedControlItem>
      <SegmentedControlItem id="semana">Semana</SegmentedControlItem>
      <SegmentedControlItem id="mes" isDisabled>Mês</SegmentedControlItem>
    </SegmentedControl>
  ),
};

export const Desabilitado: Story = { args: { isDisabled: true } };
