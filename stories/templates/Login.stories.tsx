import type { Meta, StoryObj } from '@storybook/react-vite';
import { LoginTela, type LoginTelaProps } from '@/components/application/telas/login';

const meta = {
  title: 'Templates/Sistemas/Login',
  component: LoginTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: "Entrada simples com o bloco LoginSimples, sem login social. Senha de exemplo: Citiesoft@2026. O erro de credencial não aponta qual campo está incorreto." } },
  },
  argTypes: {
    contained: { control: 'boolean' },
    layout: { control: 'inline-radio', options: ['card', 'dividido'] },
    identifierType: { control: 'inline-radio', options: ['email', 'cpf', 'texto'] },
  },
} satisfies Meta<LoginTelaProps>;

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

/** Layout dividido, com painel de marca ao lado do formulário. */
export const Dividido: Story = {
  args: { layout: 'dividido' },
};

/** Identificação por CPF, com máscara 000.000.000-00. */
export const PorCpf: Story = {
  args: { identifierType: 'cpf' },
};

/** Layout dividido com CPF. */
export const DivididoPorCpf: Story = {
  args: { layout: 'dividido', identifierType: 'cpf' },
};

/** Credencial incorreta: aviso acima do botão, valores preservados. */
export const Erro: Story = {
  args: { initialError: true },
};

/** Validando a credencial: botão em carregamento e campos bloqueados no envio. */
export const Carregando: Story = {
  args: { initialLoading: true },
};
