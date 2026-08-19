import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Knob } from './Knob';

const meta = {
  title: 'Formulário/Knob',
  component: Knob,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Ajuste radial de valor. Origem: Figma CitieOne, página ❖ Knob (State: Idle | Disabled | Focus, Size: Default | Double, mais o texto do valor). O arco é decorativo; a semântica vive no `role="slider"`. Equivalente PrimeNG: `p-knob`.',
      },
    },
  },
  args: { label: 'Percentual de execução' },
} satisfies Meta<typeof Knob>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  name: 'Size · default',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const controle = canvas.getByRole('slider', { name: 'Percentual de execução' });

    await expect(controle).toHaveAttribute('aria-valuenow', '60');
    await expect(controle).toHaveAttribute('aria-valuemin', '0');
    await expect(controle).toHaveAttribute('aria-valuemax', '100');
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'A11y · navegação por teclado',
  parameters: {
    docs: {
      description: {
        story: 'Setas ajustam pelo step, Page Up e Page Down andam de dez em dez, Home e End vão às pontas.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const controle = canvas.getByRole('slider');

    controle.focus();
    await userEvent.keyboard('{ArrowRight}');
    await expect(controle).toHaveAttribute('aria-valuenow', '61');

    await userEvent.keyboard('{PageUp}');
    await expect(controle).toHaveAttribute('aria-valuenow', '71');

    await userEvent.keyboard('{Home}');
    await expect(controle).toHaveAttribute('aria-valuenow', '0');

    await userEvent.keyboard('{End}');
    await expect(controle).toHaveAttribute('aria-valuenow', '100');
  },
};

export const Double: Story = {
  name: 'Size · double',
  args: { size: 'double', defaultValue: 78 },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true, defaultValue: 40 },
  play: async ({ canvasElement }) => {
    const controle = within(canvasElement).getByRole('slider');
    await expect(controle).toHaveAttribute('aria-disabled', 'true');
    // Fora da ordem de tabulação quando desabilitado.
    await expect(controle).toHaveAttribute('tabindex', '-1');
  },
};

export const Formatado: Story = {
  name: 'Conteúdo · valor formatado',
  args: {
    label: 'Meta da competência',
    defaultValue: 64,
    formatar: (valor: number) => `${valor}%`,
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('slider')).toHaveAttribute(
      'aria-valuetext',
      '64%',
    );
  },
};
