import type { Meta, StoryObj } from '@storybook/react-vite';
import { ListagemSolicitacoesTela } from '@/components/application/telas/listagem-solicitacoes';
import { SOLICITACOES } from '@/components/application/telas/dados/listagem-solicitacoes';
import { decoradorContido, globaisMobile } from './_telas';

const meta = {
  title: 'Templates/Sistemas/Listagem de solicitações TFD',
  component: ListagemSolicitacoesTela,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Listagem de solicitações de TFD com cabeçalho, filtros, seleção em massa, menu de ações por linha e drawer de detalhe. Busca, filtro, ordenação e paginação funcionam sobre dados locais. Segue o template `tela-listagem` do Design System.',
      },
    },
  },
} satisfies Meta<typeof ListagemSolicitacoesTela>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela inteira em desktop. */
export const Padrao: Story = {};

/** Dentro de um contêiner de altura fixa, como numa pré-visualização embutida. */
export const Contido: Story = {
  args: { contained: true },
  decorators: [decoradorContido],
};

/** Viewport de celular: a barra lateral vira gaveta e a tabela rola na horizontal. */
export const Mobile: Story = {
  globals: globaisMobile,
};

/** Drawer de detalhe aberto sobre a listagem. */
export const DetalheAberto: Story = {
  args: { detalheInicial: SOLICITACOES[0].id },
};

/** Seleção em massa com a confirmação de cancelamento mostrando o número exato de registros. */
export const ConfirmarCancelamento: Story = {
  args: {
    // As três primeiras da ordenação inicial (data da consulta), visíveis na página 1.
    selecionadosIniciais: [...SOLICITACOES]
      .sort((a, b) => a.dataConsulta.localeCompare(b.dataConsulta))
      .slice(0, 3)
      .map((s) => s.id),
    cancelarInicial: true,
  },
};
