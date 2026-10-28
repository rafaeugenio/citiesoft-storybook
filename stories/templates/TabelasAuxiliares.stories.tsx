import type { Meta, StoryObj } from '@storybook/react-vite';
import { TabelasAuxiliaresTela } from '@/components/application/telas/tabelas-auxiliares';
import { decoradorContido, globaisMobile } from './_telas';

const meta = {
  title: 'Templates/Sistemas/Tabelas auxiliares',
  component: TabelasAuxiliaresTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Configuração de tabelas de apoio do TFD. A navegação lateral troca a tabela, e com ela as colunas, os dados e os campos do formulário. Inclui alternância de ativo, drawer de edição e confirmação de exclusão.',
      },
    },
  },
} satisfies Meta<typeof TabelasAuxiliaresTela>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela inteira em desktop. */
export const Padrao: Story = {};

/** Dentro de um contêiner de altura fixa, como numa pré-visualização embutida. */
export const Contido: Story = {
  args: { contained: true },
  decorators: [decoradorContido],
};

/** Viewport de celular: a navegação lateral vira um seletor acima da tabela. */
export const Mobile: Story = {
  globals: globaisMobile,
};

/** Outra tabela, com colunas próprias. */
export const UnidadesDeSaude: Story = {
  args: { tabelaInicial: 'unidades' },
};

/** Drawer de edição aberto sobre um registro. */
export const EdicaoAberta: Story = {
  args: { editarInicial: 'mun-1' },
};

/** Confirmação de exclusão de um registro. */
export const ExclusaoConfirmar: Story = {
  args: { excluirInicial: 'mun-2' },
};
