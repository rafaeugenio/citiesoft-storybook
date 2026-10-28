import type { Meta, StoryObj } from '@storybook/react-vite';
import { HubConfiguracoesTela } from '@/components/application/telas/hub-configuracoes';
import { decoradorContido, globaisMobile } from './_telas';

const meta = {
  title: 'Templates/Sistemas/Hub de configurações',
  component: HubConfiguracoesTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Hub de configurações com as categorias fixas Conta, Sistema, Segurança e Notificações, na ordem do template `tela-configuracoes`. Cada seção salva de forma independente. O seletor de tema alterna a classe `dark` no documento.',
      },
    },
  },
} satisfies Meta<typeof HubConfiguracoesTela>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela inteira em desktop, na categoria Conta. */
export const Padrao: Story = {};

/** Dentro de um contêiner de altura fixa, como numa pré-visualização embutida. */
export const Contido: Story = {
  args: { contained: true },
  decorators: [decoradorContido],
};

/** Viewport de celular: a navegação de categorias vira um seletor. */
export const Mobile: Story = {
  globals: globaisMobile,
};

/** Categoria Sistema, com o seletor de tema claro e escuro. */
export const Aparencia: Story = {
  args: { categoriaInicial: 'sistema' },
};

/** Segurança com a confirmação de encerramento de sessão aberta. */
export const EncerrarSessao: Story = {
  args: { categoriaInicial: 'seguranca', confirmarSessaoInicial: true },
};

/** Avisos por evento e canal. */
export const Notificacoes: Story = {
  args: { categoriaInicial: 'notificacoes' },
};
