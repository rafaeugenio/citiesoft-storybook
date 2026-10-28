import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@/components/base/buttons/button';
import { Tooltip, TooltipTrigger } from '@/components/base/tooltip/tooltip';

const meta = {
  title: 'Base/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  args: { children: 'Salva as alterações do cadastro' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    placement: { control: 'select', options: ['top', 'bottom', 'left', 'right'] },
    showArrow: { control: 'boolean' },
    offset: { control: 'number' },
  },
  decorators: [(Story) => <div className="flex min-h-40 items-center justify-center p-12"><Story /></div>],
  render: (args) => (
    <TooltipTrigger>
      <Button variant="secondary">Passe o mouse</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Tamanhos: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      {(['sm', 'md'] as const).map((size) => (
        <TooltipTrigger key={size}>
          <Button variant="secondary">{size}</Button>
          <Tooltip {...args} size={size} />
        </TooltipTrigger>
      ))}
    </div>
  ),
};

export const Posicoes: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-6">
      {(['top', 'bottom', 'left', 'right'] as const).map((placement) => (
        <TooltipTrigger key={placement}>
          <Button variant="secondary">{placement}</Button>
          <Tooltip {...args} placement={placement} />
        </TooltipTrigger>
      ))}
    </div>
  ),
};

export const SemSeta: Story = { args: { showArrow: false } };

export const Aberto: Story = {
  render: (args) => (
    <TooltipTrigger isOpen>
      <Button variant="secondary">Referência</Button>
      <Tooltip {...args} />
    </TooltipTrigger>
  ),
};
