import type { Meta, StoryObj } from '@storybook/react-vite';
import { Textarea } from '@/components/base/textarea/textarea';

const meta = {
  title: 'Base/Textarea',
  component: Textarea,
  tags: ['autodocs'],
  args: { label: 'Observações', placeholder: 'Escreva aqui' },
  argTypes: {
    rows: { control: 'number' },
    maxRows: { control: 'number' },
    resize: { control: 'inline-radio', options: ['none', 'vertical'] },
    autoResize: { control: 'boolean' },
    showCount: { control: 'boolean' },
    maxLength: { control: 'number' },
    isDisabled: { control: 'boolean' },
    isInvalid: { control: 'boolean' },
    isRequired: { control: 'boolean' },
  },
  decorators: [(Story) => <div className="max-w-md"><Story /></div>],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const ComDica: Story = { args: { hint: 'Descreva o contexto em poucas linhas.' } };

export const Obrigatorio: Story = { args: { isRequired: true } };

export const ComContador: Story = {
  args: { maxLength: 280, showCount: true, hint: 'Máximo de 280 caracteres.' },
};

export const Linhas: Story = { args: { rows: 6 } };

export const RedimensionavelNaVertical: Story = { args: { resize: 'vertical' } };

export const CrescimentoAutomatico: Story = {
  args: { autoResize: true, rows: 2, maxRows: 6, hint: 'Cresce até 6 linhas e depois rola.' },
};

export const Invalido: Story = {
  parameters: { a11y: { test: 'todo' } }, // contraste da paleta accent do Citiesoft: some ao mapear a marca Citiesoft (fase Fundação)
  args: { isInvalid: true, hint: 'Este campo não pode ficar vazio.' },
};

export const Desabilitado: Story = { args: { isDisabled: true, defaultValue: 'Conteúdo bloqueado para edição.' } };
