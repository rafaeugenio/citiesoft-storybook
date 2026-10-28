import type { Meta, StoryObj } from '@storybook/react-vite';
import { Verificacao2faTela, type Verificacao2faTelaProps } from '@/components/application/telas/verificacao-2fa';

const meta = {
  title: 'Templates/Sistemas/Verificação em duas etapas',
  component: Verificacao2faTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: "Código de 6 dígitos com o InputOtp. Código de exemplo: 123456. Reenvio com contagem de 30 segundos e bloqueio após 3 tentativas inválidas." } },
  },
  argTypes: {
    contained: { control: 'boolean' },
    layout: { control: 'inline-radio', options: ['card', 'dividido'] },
    canal: { control: 'inline-radio', options: ['autenticador', 'sms', 'email'] },
  },
} satisfies Meta<Verificacao2faTelaProps>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela inteira em desktop. */
export const Padrao: Story = {};

/** Dentro de um contêiner de altura fixa, como numa pré-visualização embutida. */
export const Contido: Story = {
  args: { contained: true },
  decorators: [
    (Story) => (
      <div
        className="relative h-[720px] overflow-hidden"
        style={{ ['--template-preview-height' as string]: '720px' }}
      >
        <Story />
      </div>
    ),
  ],
};

/** Viewport de celular. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

/** Layout dividido, espelhando o login. */
export const Dividido: Story = {
  args: { layout: 'dividido' },
};

/** Canal de aplicativo autenticador: sem reenvio. */
export const Autenticador: Story = {
  args: { canal: 'autenticador' },
};

/** Canal de e-mail. */
export const PorEmail: Story = {
  args: { canal: 'email' },
};

/** Contagem encerrada: link de reenvio disponível. */
export const ReenvioDisponivel: Story = {
  args: { initialCooldown: 0 },
};

/** Código inválido ou expirado, campo limpo. */
export const CodigoInvalido: Story = {
  args: { initialError: true },
};

/** Verificação em andamento: campo desabilitado. */
export const Verificando: Story = {
  args: { initialLoading: true },
};

/** Três tentativas inválidas: o código de recuperação é o único caminho. */
export const Bloqueado: Story = {
  args: { initialBlocked: true },
};
