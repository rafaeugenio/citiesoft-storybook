import type { Meta, StoryObj } from '@storybook/react-vite';
import { InputOtp } from '@/components/base/input-otp/input-otp';

const meta = {
  title: 'Base/InputOtp',
  component: InputOtp,
  tags: ['autodocs'],
  args: { length: 6, 'aria-label': 'Código de verificação' },
  argTypes: {
    length: { control: { type: 'number', min: 3, max: 8 } },
    groupEvery: { control: 'number' },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
  },
} satisfies Meta<typeof InputOtp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Agrupado: Story = { args: { groupEvery: 3 } };

export const QuatroDigitos: Story = { args: { length: 4 } };

export const Preenchido: Story = { args: { defaultValue: '123456' } };

export const Invalido: Story = {
  parameters: { a11y: { test: 'todo' } }, // contraste da paleta accent do Citiesoft: some ao mapear a marca Citiesoft (fase Fundação)
  args: { defaultValue: '123456', isInvalid: true } };

export const Desabilitado: Story = { args: { defaultValue: '123', isDisabled: true } };
