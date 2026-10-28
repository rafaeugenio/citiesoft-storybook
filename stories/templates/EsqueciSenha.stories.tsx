import type { Meta, StoryObj } from '@storybook/react-vite';
import { EsqueciSenhaTela, type EsqueciSenhaTelaProps } from '@/components/application/telas/esqueci-senha';

const meta = {
  title: 'Templates/Sistemas/Esqueci a senha',
  component: EsqueciSenhaTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: "Um campo e um botão. A confirmação é a mesma exista ou não o e-mail na base." } },
  },
  argTypes: {
    contained: { control: 'boolean' },
    layout: { control: 'inline-radio', options: ['card', 'dividido'] },
    initialStep: { control: 'inline-radio', options: ['formulario', 'confirmacao'] },
  },
} satisfies Meta<EsqueciSenhaTelaProps>;

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

/** Envio do link em andamento. */
export const Carregando: Story = {
  args: { initialLoading: true },
};

/** Confirmação no lugar do formulário, com reenvio e volta ao login. */
export const Confirmacao: Story = {
  args: { initialStep: 'confirmacao' },
};

/** Falha técnica de envio, nunca "e-mail não encontrado". */
export const FalhaDeEnvio: Story = {
  args: { initialError: true },
};
