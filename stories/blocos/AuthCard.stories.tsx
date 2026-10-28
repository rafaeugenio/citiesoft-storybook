import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
import { AuthCard, AuthMediaCarousel } from '@/components/application/auth/auth-card';

const meta = {
  title: 'Blocos/AuthCard',
  component: AuthCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    onSubmit: fn(),
    onProvider: fn(),
    onResend: fn(),
    onComplete: fn(),
    title: 'Bem-vindo de volta',
    description: 'Entre para continuar de onde parou.',
  },
  argTypes: {
    mode: { control: 'inline-radio', options: ['signin', 'signup', 'verify'] },
    layout: { control: 'inline-radio', options: ['stacked', 'inline', 'grid'] },
    centered: { control: 'boolean' },
    confirmPassword: { control: 'boolean' },
  },
} satisfies Meta<typeof AuthCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Entrar: Story = {};

export const Cadastro: Story = {
  args: {
    mode: 'signup',
    title: 'Crie sua conta',
    description: 'Comece em poucos minutos.',
  },
};

export const CadastroComConfirmacaoDeSenha: Story = {
  args: { ...Cadastro.args, confirmPassword: true },
};

export const Verificacao: Story = {
  args: {
    mode: 'verify',
    email: 'mariana.souza@exemplo.com.br',
    title: 'Confira seu e-mail',
    description: undefined,
  },
};

export const VerificacaoComOitoDigitos: Story = {
  args: { ...Verificacao.args, codeLength: 8 },
};

export const ProvedoresEmLinha: Story = {
  args: { layout: 'inline', providers: ['google', 'apple', 'github'] },
};

export const ProvedoresEmGrade: Story = {
  args: { layout: 'grid', providers: ['google', 'apple', 'github'] },
};

export const SemProvedores: Story = {
  args: { providers: [] },
};

export const CentralizadoComRodape: Story = {
  args: {
    centered: true,
    headingLevel: 2,
    footnote: 'Ao continuar, você concorda com os Termos de Uso e a Política de Privacidade.',
  },
};

export const ComMidia: Story = {
  parameters: { layout: 'fullscreen' },
  args: {
    headingLevel: 2,
    media: (
      <AuthMediaCarousel
        slides={[
          { src: '/carousel/sunrise.webp' },
          { src: '/carousel/floral.webp' },
          { src: '/carousel/space-squid.webp' },
        ]}
      />
    ),
    footnote: 'Acesso restrito a usuários autorizados.',
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-[640px] w-full items-center justify-center p-6">
        <Story />
      </div>
    ),
  ],
};
