import type { Meta, StoryObj } from '@storybook/react-vite';
import { RangeSlider, Slider } from '@/components/base/slider/slider';

const meta = {
  title: 'Base/Slider',
  component: Slider,
  tags: ['autodocs'],
  args: { label: 'Volume', defaultValue: 40, minValue: 0, maxValue: 100, thumbLabel: 'Volume' },
  argTypes: {
    showTooltip: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    step: { control: { type: 'number', min: 1 } },
  },
  decorators: [(Story) => <div className="w-[360px]"><Story /></div>],
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const SemBalao: Story = { args: { showTooltip: false } };

export const ComPasso: Story = { args: { step: 10, defaultValue: 50 } };

export const ValorFormatado: Story = {
  args: { label: 'Orçamento', defaultValue: 5000, maxValue: 10000, step: 500, thumbLabel: 'Orçamento' },
  render: (args) => (
    <Slider {...args} formatValue={(v) => `R$ ${v.toLocaleString('pt-BR')}`} />
  ),
};

export const Intervalo: Story = {
  render: (args) => (
    <RangeSlider
      label="Faixa de preço"
      defaultValue={[20, 70]}
      minValue={0}
      maxValue={100}
      thumbLabels={['Mínimo', 'Máximo']}
      isDisabled={args.isDisabled}
    />
  ),
};

export const Desabilitado: Story = { parameters: { a11y: { test: 'todo' } }, /* controle desabilitado: isento no WCAG 1.4.3, o axe mede a opacidade */ args: { isDisabled: true } };
