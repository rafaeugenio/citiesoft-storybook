import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { InputOtp } from './InputOtp';

const meta = {
  title: 'Moléculas/Campos/InputOtp',
  component: InputOtp,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Código de verificação. Origem: Figma CitieOne, página ❖ InputOtp (variante Size: Normal | Small | Large). As alturas seguem a escala de controle do DS (32 / 40 / 48). Equivalente PrimeNG: `p-inputotp`.',
      },
    },
  },
  args: { label: 'Código enviado por SMS' },
} satisfies Meta<typeof InputOtp>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Size · normal',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Cada casa carrega a posição no nome acessível.
    const primeira = canvas.getByLabelText('Código enviado por SMS, dígito 1 de 6');
    await expect(primeira).toBeVisible();
    await expect(primeira.getBoundingClientRect().height).toBe(40);
  },
};

export const AvancoAutomatico: Story = {
  name: 'Comportamento · avanço automático',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primeira = canvas.getByLabelText('Código enviado por SMS, dígito 1 de 6');

    await userEvent.type(primeira, '4');
    // Digitar avança para a próxima casa sozinho.
    await expect(canvas.getByLabelText('Código enviado por SMS, dígito 2 de 6')).toHaveFocus();

    await userEvent.keyboard('{Backspace}');
    // Backspace numa casa vazia volta para a anterior.
    await expect(primeira).toHaveFocus();
  },
};

export const SomenteNumeros: Story = {
  name: 'Comportamento · só aceita dígito',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primeira = canvas.getByLabelText('Código enviado por SMS, dígito 1 de 6');

    await userEvent.type(primeira, 'a');
    await expect(primeira).toHaveValue('');
  },
};

export const Tamanhos: Story = {
  name: 'Size · 32 / 40 / 48px',
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <InputOtp {...args} size="small" label="Small" length={4} />
      <InputOtp {...args} size="normal" label="Normal" length={4} />
      <InputOtp {...args} size="large" label="Large" length={4} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alturas = ['Small', 'Normal', 'Large'].map(
      (nome) => canvas.getByLabelText(`${nome}, dígito 1 de 4`).getBoundingClientRect().height,
    );
    await expect(alturas).toEqual([32, 40, 48]);
  },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    invalid: true,
    error: 'Código incorreto. Confira os dígitos ou solicite um novo envio.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primeira = canvas.getByLabelText('Código enviado por SMS, dígito 1 de 6');
    await expect(primeira).toHaveAttribute('aria-invalid', 'true');
    await expect(primeira).toHaveAttribute('aria-describedby');
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true },
};

export const Mascarado: Story = {
  name: 'Variante · mascarado',
  args: { label: 'Senha de acesso', mask: true, length: 4 },
};
