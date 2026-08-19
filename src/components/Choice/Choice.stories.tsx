import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Checkbox, RadioGroup, Switch, ToggleButton } from './Choice';

const meta = {
  title: 'Formulário/Escolha',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Checkbox, RadioButton, ToggleSwitch e ToggleButton. Spec: `03-components/checkbox-radio-switch.md` v2.0.0. Regra que separa os dois mais parecidos: o switch promete efeito imediato, o checkbox aguarda o submit.',
      },
    },
  },
  args: { label: 'Aceito os termos de uso' },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ---------- Checkbox ---------- */

export const CheckboxDefault: Story = {
  name: 'Checkbox · desmarcado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const controle = canvas.getByRole('checkbox', { name: 'Aceito os termos de uso' });

    // O rótulo é clicável junto com o controle, então o alvo inclui o texto.
    await userEvent.click(canvas.getByText('Aceito os termos de uso'));
    await expect(controle).toBeChecked();
  },
};

export const CheckboxMarcado: Story = {
  name: 'Checkbox · marcado',
  args: { defaultChecked: true },
};

export const CheckboxIndeterminado: Story = {
  name: 'Checkbox · indeterminado',
  args: { label: 'Todos os colaboradores', indeterminate: true },
  parameters: {
    docs: {
      description: {
        story:
          'Estado parcial de um grupo, tipicamente no cabeçalho de seleção de uma tabela quando só alguns itens estão marcados.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const controle = canvas.getByRole('checkbox') as HTMLInputElement;
    await expect(controle.indeterminate).toBe(true);
  },
};

export const CheckboxDesabilitado: Story = {
  name: 'Checkbox · desabilitado',
  args: { disabled: true, defaultChecked: true },
};

/* ---------- RadioGroup ---------- */

export const Radio: Story = {
  name: 'Radio · grupo com legenda',
  render: () => (
    <RadioGroup
      legend="Tipo de deslocamento"
      name="tipo-deslocamento"
      defaultValue="terrestre"
      options={[
        { value: 'terrestre', label: 'Terrestre' },
        { value: 'aereo', label: 'Aéreo' },
        { value: 'fluvial', label: 'Fluvial' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // O grupo precisa de nome acessível vindo da legenda.
    await expect(canvas.getByRole('group', { name: 'Tipo de deslocamento' })).toBeVisible();

    await userEvent.click(canvas.getByRole('radio', { name: 'Aéreo' }));
    await expect(canvas.getByRole('radio', { name: 'Aéreo' })).toBeChecked();
    await expect(canvas.getByRole('radio', { name: 'Terrestre' })).not.toBeChecked();
  },
};

export const RadioInvalido: Story = {
  name: 'Radio · grupo obrigatório em erro',
  render: () => (
    <RadioGroup
      legend="Tipo de deslocamento"
      name="tipo-deslocamento-erro"
      error="Escolha o tipo de deslocamento para seguir."
      options={[
        { value: 'terrestre', label: 'Terrestre' },
        { value: 'aereo', label: 'Aéreo' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText('Escolha o tipo de deslocamento para seguir.'),
    ).toBeVisible();
  },
};

/* ---------- Switch ---------- */

export const SwitchLigado: Story = {
  name: 'Switch · efeito imediato',
  parameters: {
    docs: {
      description: {
        story:
          'Rótulo descreve o estado ligado, nunca a ação. Nunca usar dentro de formulário que só aplica ao salvar.',
      },
    },
  },
  render: () => <Switch label="Notificações por e-mail" defaultChecked />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const controle = canvas.getByRole('switch', { name: 'Notificações por e-mail' });

    await expect(controle).toBeChecked();
    await userEvent.click(controle);
    await expect(controle).not.toBeChecked();
  },
};

export const SwitchDesabilitado: Story = {
  name: 'Switch · desabilitado',
  render: () => <Switch label="Notificações por SMS" disabled />,
};

/* ---------- ToggleButton ---------- */

export const Toggle: Story = {
  name: 'ToggleButton · com rótulo',
  render: () => <ToggleButton label="Somente pendentes" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const botao = canvas.getByRole('button', { name: 'Somente pendentes' });

    await expect(botao).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(botao);
    await expect(botao).toHaveAttribute('aria-pressed', 'true');
  },
};

export const ToggleSomenteIcone: Story = {
  name: 'ToggleButton · somente ícone',
  render: () => (
    <ToggleButton
      aria-label="Alternar visão em lista"
      icon={
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Alternar visão em lista' })).toBeVisible();
  },
};
