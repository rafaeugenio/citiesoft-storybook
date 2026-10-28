import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiAddLine } from '@remixicon/react';
import { Button } from '@/components/base/buttons/button';
import { DataListing } from '@/components/application/data-listing/data-listing';
import type { DataListingSort } from '@/components/application/data-listing/data-listing';
import { SOLICITACOES_LISTAGEM } from '../../.storybook/fixtures/listagem-solicitacoes';
import type { SolicitacaoListagem } from '../../.storybook/fixtures/listagem-solicitacoes';
import {
  COLUNAS_SOLICITACAO,
  ENTIDADE,
  ListagemTFD,
  acoesDaLinha,
  ordenarSolicitacoes,
} from './_apoio-listagem';

const meta = {
  title: 'Blocos/DataListing',
  component: DataListing<SolicitacaoListagem>,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  args: {
    label: 'Solicitações de TFD',
    entity: ENTIDADE,
    columns: COLUNAS_SOLICITACAO,
    data: SOLICITACOES_LISTAGEM.slice(0, 10),
    getRowId: (r: SolicitacaoListagem) => r.id,
    getRowLabel: (r: SolicitacaoListagem) => r.protocolo,
    getRowHref: (r: SolicitacaoListagem) => `#/solicitacoes/${r.id}`,
    total: SOLICITACOES_LISTAGEM.length,
    page: 1,
    pageSize: 10,
  },
  argTypes: {
    state: { control: 'select', options: ['pronto', 'carregando', 'vazio', 'vazio-filtro', 'erro'] },
    density: { control: 'inline-radio', options: ['compacta', 'confortavel'] },
  },
} satisfies Meta<typeof DataListing<SolicitacaoListagem>>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Tela completa: cabeçalho, filtros, tabela e barra de seleção com dados locais. */
export const Padrao: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <ListagemTFD />,
};

/** Só a tabela, com ordenação e paginação funcionando sobre os dados locais. */
export const SoATabela: Story = {
  render: function Render(args) {
    const [sort, setSort] = useState<DataListingSort | null>({ column: 'dataConsulta', direction: 'descending' });
    const [pagina, setPagina] = useState(1);
    const [tamanho, setTamanho] = useState(10);
    const ordenados = ordenarSolicitacoes(SOLICITACOES_LISTAGEM, sort);
    return (
      <DataListing
        {...args}
        data={ordenados.slice((pagina - 1) * tamanho, pagina * tamanho)}
        sort={sort}
        onSortChange={(s) => {
          setSort(s);
          setPagina(1);
        }}
        page={pagina}
        pageSize={tamanho}
        onPageChange={setPagina}
        onPageSizeChange={(n) => {
          setTamanho(n);
          setPagina(1);
        }}
      />
    );
  },
};

export const SelecaoEmMassa: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <ListagemTFD selecionavel posicaoSelecao="viewport" />,
};

export const SemSelecao: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <ListagemTFD selecionavel={false} />,
};

export const Compacta: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <ListagemTFD densidadeInicial="compacta" porPagina={25} />,
};

export const DuasAcoesEmIcones: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <ListagemTFD acoesPorLinha={2} />,
};

export const TresAcoesEmMenu: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <ListagemTFD acoesPorLinha={3} />,
};

export const Carregando: Story = {
  render: function Render(args) {
    return <DataListing {...args} state="carregando" selectable rowActions={acoesDaLinha(2)} />;
  },
};

export const Vazio: Story = {
  render: function Render(args) {
    return (
      <DataListing
        {...args}
        data={[]}
        total={0}
        state="vazio"
        emptyTitle="Nenhuma solicitação cadastrada"
        emptyDescription="As solicitações de TFD criadas aparecem aqui."
        emptyAction={
          <Button size="small" leadingIcon={RiAddLine}>
            Nova solicitação
          </Button>
        }
      />
    );
  },
};

export const VazioPorFiltro: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <ListagemTFD buscaInicial="zzzz" />,
};

export const Erro: Story = {
  parameters: { layout: 'fullscreen' },
  render: () => <ListagemTFD forcarEstado="erro" />,
};

export const Mobile: Story = {
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story) => (
      <div className="w-[390px]">
        <Story />
      </div>
    ),
  ],
  render: () => <ListagemTFD porPagina={5} />,
};
