import type { Meta, StoryObj } from '@storybook/react-vite';
import { NotificacoesTela } from '@/components/application/telas/notificacoes';

const meta = {
  title: 'Templates/Sistemas/Notificações',
  component: NotificacoesTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Central de notificações (lista agrupada, filtro Todas e Não lidas, marcar como lida e menu de ações por item) e preferências por canal (matriz evento por canal com frequência). Segue o template tela-notificacoes do Design System: eventos de segurança não saem do e-mail, "Marcar todas como lidas" afeta só o filtro ativo e o contador do sino some em zero.',
      },
    },
  },
  argTypes: {
    abaInicial: { control: 'inline-radio', options: ['central', 'preferencias'] },
    estado: { control: 'inline-radio', options: ['pronto', 'carregando', 'erro', 'vazio'] },
  },
} satisfies Meta<typeof NotificacoesTela>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela inteira em desktop, na central. */
export const Padrao: Story = {};

/** Dentro de um contêiner de altura fixa, como numa pré-visualização embutida. */
export const Contido: Story = {
  args: { contained: true },
  decorators: [
    (Story) => (
      <div className="relative h-[720px] overflow-hidden" style={{ ['--template-preview-height' as string]: '720px' }}>
        <Story />
      </div>
    ),
  ],
};

/** Viewport de celular: gaveta de navegação e lista em coluna única. */
export const Mobile: Story = {
  globals: { viewport: { value: 'mobile2', isRotated: false } },
};

/** Matriz evento por canal, com frequência e eventos de segurança fixos no e-mail. */
export const Preferencias: Story = { args: { abaInicial: 'preferencias' } };

/** Esqueleto da lista, com o sino e o filtro já utilizáveis. */
export const Carregando: Story = { args: { estado: 'carregando' } };

/** Falha de carregamento com "Tentar novamente". */
export const Erro: Story = { args: { estado: 'erro' } };

/** Central sem nenhuma notificação. */
export const Vazia: Story = { args: { estado: 'vazio' } };
