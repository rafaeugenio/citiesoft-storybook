import type { Meta, StoryObj } from '@storybook/react-vite';
import { UsuariosPermissoesTela } from '@/components/application/telas/usuarios-permissoes';
import { decoradorContido, globaisMobile } from './_telas';

const meta = {
  title: 'Templates/Sistemas/Gestão de usuários e permissões',
  component: UsuariosPermissoesTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Gestão de usuários com membros, convites pendentes e a matriz de permissões por papel (Solicitante, Analista, Regulador, Gestor e Administrador). Segue os templates `tela-gestao-usuarios` e `tela-permissoes` do Design System.',
      },
    },
  },
} satisfies Meta<typeof UsuariosPermissoesTela>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela inteira em desktop, na aba Membros. */
export const Padrao: Story = {};

/** Dentro de um contêiner de altura fixa, como numa pré-visualização embutida. */
export const Contido: Story = {
  args: { contained: true },
  decorators: [decoradorContido],
};

/** Viewport de celular: a barra lateral vira gaveta e as tabelas rolam na horizontal. */
export const Mobile: Story = {
  globals: globaisMobile,
};

/** Drawer de convite aberto. */
export const ConviteAberto: Story = {
  args: { conviteAberto: true },
};

/** Convites pendentes, com situação e ações por linha. */
export const ConvitesPendentes: Story = {
  args: { abaInicial: 'convites' },
};

/** Matriz de permissões por papel, com cabeçalho fixo e alternância em massa por módulo. */
export const MatrizDePermissoes: Story = {
  args: { abaInicial: 'permissoes' },
};
