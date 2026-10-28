import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '@/components/base/divider/divider';

const meta = {
  title: 'Base/Divider',
  component: Divider,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'inline-radio', options: ['single', 'double', 'fill'] },
    align: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  decorators: [(Story) => <div className="w-[480px] max-w-full"><Story /></div>],
} satisfies Meta<typeof Divider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(['single', 'double', 'fill'] as const).map((variant) => (
        <div key={variant} className="flex flex-col gap-3">
          <Divider {...args} variant={variant} />
          <Divider {...args} variant={variant}>Ou continue com</Divider>
        </div>
      ))}
    </div>
  ),
};

export const Alinhamentos: Story = {
  render: (args) => (
    <div className="flex flex-col gap-6">
      {(['start', 'center', 'end'] as const).map((align) => (
        <Divider key={align} {...args} align={align}>
          Alinhado ({align})
        </Divider>
      ))}
    </div>
  ),
};
