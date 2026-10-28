import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, userEvent, within } from 'storybook/test';
import { LoginSimples } from '@/components/application/login-simples/login-simples';

const meta = {
  title: 'Blocos/LoginSimples',
  component: LoginSimples,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onSubmit: fn(),
    onForgot: fn(),
    description: 'Acesse o sistema de Tratamento Fora de Domicílio.',
    footer: 'Suporte: suporte@exemplo.gov.br · Versão 2.4.0',
  },
  argTypes: {
    identifierType: { control: 'inline-radio', options: ['email', 'cpf', 'texto'] },
    layout: { control: 'inline-radio', options: ['card', 'dividido'] },
    isLoading: { control: 'boolean' },
    isDisabled: { control: 'boolean' },
    showRemember: { control: 'boolean' },
  },
} satisfies Meta<typeof LoginSimples>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const PorCpf: Story = {
  args: { identifierType: 'cpf', description: 'Informe o CPF e a senha cadastrados.' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const campo = canvas.getByLabelText(/CPF/);
    await userEvent.type(campo, '12345678901');
    await expect(campo).toHaveValue('123.456.789-01');
  },
};

export const PorUsuario: Story = {
  args: { identifierType: 'texto', identifierLabel: 'Matrícula', identifierPlaceholder: 'Ex.: 004512' },
};

export const Dividido: Story = { args: { layout: 'dividido' } };

export const DivididoPorCpf: Story = { args: { layout: 'dividido', identifierType: 'cpf' } };

export const SemLembrarDeMim: Story = { args: { showRemember: false } };

export const ComErro: Story = {
  args: { error: 'CPF ou senha incorretos. Confira os dados e tente novamente.', identifierType: 'cpf' },
};

export const Carregando: Story = { args: { isLoading: true } };

export const Desabilitado: Story = { args: { isDisabled: true } };

export const ValidacaoDeCampos: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Entrar' }));
    await expect(await canvas.findByText('Informe o e-mail.')).toBeVisible();
  },
};

export const FluxoComErroSimulado: Story = {
  render: function Render(args) {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | undefined>();
    return (
      <LoginSimples
        {...args}
        isLoading={carregando}
        error={erro}
        onSubmit={() => {
          setErro(undefined);
          setCarregando(true);
          window.setTimeout(() => {
            setCarregando(false);
            setErro('E-mail ou senha incorretos.');
          }, 800);
        }}
      />
    );
  },
};

export const ComConteudoExtra: Story = {
  args: {
    extra: (
      <p className="rounded-2lg bg-background-tertiary-default p-3 text-caption-1-regular text-text-secondary">
        Ambiente de homologação. Os dados exibidos são fictícios.
      </p>
    ),
  },
};

export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
  args: { layout: 'dividido' },
};
