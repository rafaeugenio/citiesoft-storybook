import type { Meta, StoryObj } from '@storybook/react-vite';
import { ErrosEstadosTela } from '@/components/application/telas/erros-estados';

const meta = {
  title: 'Templates/Sistemas/Páginas de erro e estados',
  component: ErrosEstadosTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Páginas de erro (404, 403, 500 e manutenção) na mesma estrutura de quatro zonas, mais o estado vazio inicial de uma listagem e a confirmação destrutiva. Seguem os templates tela-erro e tela-estados-apoio do Design System: um único botão primário por página de erro, sem navegação principal, foco inicial no título; na confirmação, foco inicial em Cancelar e Esc cancela.',
      },
    },
  },
  argTypes: {
    variante: {
      control: 'select',
      options: ['404', '403', '500', 'manutencao', 'vazio', 'confirmacao'],
    },
  },
} satisfies Meta<typeof ErrosEstadosTela>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Variante 404 em tela cheia. */
export const Padrao: Story = {};

/** Dentro de um contêiner de altura fixa, como numa pré-visualização embutida. */
export const Contido: Story = {
  args: { contained: true },
  decorators: [
    (Story) => (
      <div className="relative h-[640px] overflow-hidden" style={{ ['--template-preview-height' as string]: '640px' }}>
        <Story />
      </div>
    ),
  ],
};

/** Viewport de celular. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

/** Rota ou registro inexistente. */
export const Erro404: Story = { args: { variante: '404' } };

/** Sem permissão para o recurso: o perfil está autenticado, mas não autorizado. */
export const Erro403SemPermissao: Story = { args: { variante: '403' } };

/** Falha interna: "Tentar novamente" com carregamento e, se a falha persistir, reforço do suporte. */
export const Erro500: Story = { args: { variante: '500' } };

/** Janela de manutenção com previsão de retorno. */
export const Manutencao: Story = { args: { variante: 'manutencao' } };

/** Primeiro acesso a uma listagem sem registros, com CTA de criação. */
export const EstadoVazioInicial: Story = { args: { variante: 'vazio' } };

/** Exclusão de alto impacto: ConfirmDialog aberto, campo de protocolo e foco em Cancelar. */
export const ConfirmacaoDestrutiva: Story = { args: { variante: 'confirmacao' } };
