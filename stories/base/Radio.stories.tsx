import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioDot, RadioGroup } from '@/components/base/radio/radio';

const meta = {
  title: 'Base/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
  args: { defaultValue: 'mensal', 'aria-label': 'Periodicidade' },
  argTypes: {
    isDisabled: { control: 'boolean' },
    orientation: { control: 'inline-radio', options: ['vertical', 'horizontal'] },
  },
  render: (args) => (
    <RadioGroup {...args} className="flex flex-col gap-3">
      <Radio value="mensal">Mensal</Radio>
      <Radio value="trimestral">Trimestral</Radio>
      <Radio value="anual">Anual</Radio>
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(['md', 'sm'] as const).map((size) => (
        <RadioGroup key={size} {...args} aria-label={`Tamanho ${size}`} className="flex flex-col gap-3">
          <Radio value="mensal" size={size}>Mensal ({size})</Radio>
          <Radio value="anual" size={size}>Anual ({size})</Radio>
        </RadioGroup>
      ))}
    </div>
  ),
};

export const Horizontal: Story = {
  args: { orientation: 'horizontal' },
  render: (args) => (
    <RadioGroup {...args} className="flex items-center gap-6">
      <Radio value="mensal">Mensal</Radio>
      <Radio value="trimestral">Trimestral</Radio>
      <Radio value="anual">Anual</Radio>
    </RadioGroup>
  ),
};

export const Desabilitado: Story = {
  render: (args) => (
    <RadioGroup {...args} className="flex flex-col gap-3">
      <Radio value="mensal">Mensal</Radio>
      <Radio value="trimestral" isDisabled>Trimestral (indisponível)</Radio>
      <Radio value="anual">Anual</Radio>
    </RadioGroup>
  ),
};

export const GrupoDesabilitado: Story = { args: { isDisabled: true } };

export const IndicadorIsolado: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <RadioDot />
      <RadioDot selected />
      <RadioDot size="md" />
      <RadioDot size="md" selected />
    </div>
  ),
};
