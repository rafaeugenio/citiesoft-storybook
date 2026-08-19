import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  Breadcrumb,
  Button,
  FilterBar,
  Pagination,
  Search,
  Select,
  StatusIndicator,
  Table,
  type Coluna,
} from '../../../src';
import { Listagem } from './Listagem';

/**
 * O template não conhece domínio. Os dados abaixo existem só para dar corpo às
 * regiões: são registros genéricos, sem entidade nem vocabulário de negócio.
 */
interface RegistroGenerico {
  id: string;
  descricao: string;
  responsavel: string;
  valor: string;
  data: string;
}

const REGISTROS: RegistroGenerico[] = Array.from({ length: 6 }, (_, indice) => ({
  id: `R-${1001 + indice}`,
  descricao: `Registro de demonstração ${indice + 1}`,
  responsavel: indice % 2 === 0 ? 'Setor A' : 'Setor B',
  valor: `R$ ${(1200 + indice * 130).toLocaleString('pt-BR')},00`,
  data: `0${(indice % 9) + 1}/03/2025`,
}));

/** Ordem fixa da spec: identificador, descritivos, numéricos e data, status, ações. */
const COLUNAS: Coluna<RegistroGenerico>[] = [
  {
    chave: 'id',
    cabecalho: 'Identificador',
    ordenavel: true,
    largura: '140px',
    // Regra fixa: o identificador leva ao detalhe por link, nunca por botão.
    render: (linha) => <a href={`#/registros/${linha.id}`}>{linha.id}</a>,
  },
  { chave: 'descricao', cabecalho: 'Descrição', render: (linha) => linha.descricao },
  { chave: 'responsavel', cabecalho: 'Responsável', render: (linha) => linha.responsavel },
  {
    chave: 'valor',
    cabecalho: 'Valor',
    alinhamento: 'direita',
    render: (linha) => linha.valor,
  },
  { chave: 'data', cabecalho: 'Data', ordenavel: true, render: (linha) => linha.data },
  {
    chave: 'situacao',
    cabecalho: 'Situação',
    render: () => <StatusIndicator estado="Em Análise" size="sm" />,
  },
  {
    chave: 'acoes',
    cabecalho: 'Ações',
    alinhamento: 'direita',
    largura: '96px',
    render: (linha) => (
      <Button variant="text" size="small" aria-label={`Editar registro ${linha.id}`}>
        Editar
      </Button>
    ),
  },
];

const CONTROLES = (
  <>
    <Search label="Buscar registros" placeholder="Identificador ou descrição" size="md" />
    <Select
      label="Situação"
      placeholder="Todas"
      options={[
        { value: 'analise', label: 'Em análise' },
        { value: 'aprovado', label: 'Aprovado' },
      ]}
    />
    <Select
      label="Responsável"
      placeholder="Todos"
      options={[
        { value: 'a', label: 'Setor A' },
        { value: 'b', label: 'Setor B' },
      ]}
    />
  </>
);

const FILTROS = (
  <FilterBar
    controles={CONTROLES}
    filtros={[{ id: 'situacao', rotulo: 'Situação', valor: 'Em análise', dimensao: 'select' }]}
    resultado={{ total: 6, substantivo: ['registro', 'registros'] }}
    densidade="compacta"
  />
);

function tabela({ selecionavel = true }: { selecionavel?: boolean } = {}) {
  return (
    <Table
      legenda="Registros, 6 no total"
      colunas={COLUNAS}
      linhas={REGISTROS}
      chaveDaLinha={(linha) => linha.id}
      rotuloDaLinha={(linha) => `registro ${linha.id}`}
      densidade="compacta"
      zebra
      selecionavel={selecionavel}
      acoesEmMassa={
        selecionavel
          ? () => (
              <>
                <Button variant="secondary" size="small">
                  Exportar seleção
                </Button>
                <Button variant="danger" size="small">
                  Excluir selecionados
                </Button>
              </>
            )
          : undefined
      }
    />
  );
}

const meta = {
  title: 'Templates/Listagem/Listagem com filtros',
  component: Listagem,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Estrutura da tela de listagem, a mais usada nos sistemas B2G da Citiesoft.',
          'Anatomia e regras fixas: `design-system/09-templates/tela-listagem.md` v1.0.0.',
          '',
          'Zonas, na ordem fixa da spec: **1** cabeçalho com trilha, título no plural e ação',
          'primária de criação; **2** barra de filtros; **3** chips de filtros ativos;',
          '**4** barra de ações em massa, que substitui as zonas 2 e 3 quando há seleção;',
          '**5** tabela; **6** rodapé com paginador e itens por página.',
          '',
          'Componentes do sistema usados nas stories: `Breadcrumb`, `Button`, `Search`,',
          '`Select`, `FilterBar`, `Table`, `StatusIndicator`, `Pagination`.',
          'O template em si não importa componente nenhum: recebe tudo por slot.',
        ].join('\n'),
      },
    },
    viewport: {
      options: {
        desktopGrande: { name: 'Desktop 1920', styles: { width: '1920px', height: '1080px' } },
        desktop: { name: 'Desktop 1366', styles: { width: '1366px', height: '768px' } },
        tabletCitie: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' } },
        celular: { name: 'Celular 375', styles: { width: '375px', height: '812px' } },
      },
    },
  },
  args: {
    trilha: (
      <Breadcrumb
        niveis={[{ rotulo: 'Início', href: '#' }, { rotulo: 'Módulo', href: '#' }, { rotulo: 'Registros' }]}
      />
    ),
    titulo: 'Registros',
    descricao: 'Estrutura genérica: o conteúdo de domínio entra pela página.',
    acaoPrimaria: <Button variant="primary">Novo registro</Button>,
    filtros: FILTROS,
    tabela: tabela(),
    paginacao: <Pagination label="Paginação de registros" totalRegistros={6} itensPorPagina={25} />,
    itensPorPagina: (
      <Select
        label="Itens por página"
        placeholder="25"
        size="small"
        options={[
          { value: '25', label: '25' },
          { value: '50', label: '50' },
          { value: '100', label: '100' },
        ]}
      />
    ),
  },
} satisfies Meta<typeof Listagem>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Estrutura: Story = {
  name: 'Estrutura · seis zonas na ordem da spec',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Zona 1: um único `main`, um único `h1` e a trilha nomeada.
    await expect(canvas.getByRole('main')).toBeVisible();
    await expect(canvas.getByRole('heading', { level: 1, name: 'Registros' })).toBeVisible();
    await expect(canvas.getByRole('navigation', { name: 'Trilha de navegação' })).toBeVisible();

    // Regra fixa: a ação de criar mora no cabeçalho, nunca na barra de filtros.
    const criar = canvas.getByRole('button', { name: 'Novo registro' });
    await expect(criar.closest('.citie-tpl-listagem__cabecalho')).not.toBeNull();

    // Zonas 2 e 3, zona 5 e zona 6.
    await expect(canvas.getByRole('group', { name: 'Filtros da listagem' })).toBeVisible();
    await expect(canvas.getByRole('grid', { name: 'Registros, 6 no total' })).toBeVisible();
    await expect(canvas.getByRole('navigation', { name: 'Paginação de registros' })).toBeVisible();
  },
};

export const SelecaoAtiva: Story = {
  name: 'Estado · seleção substitui os filtros',
  args: { selecaoAtiva: true },
  parameters: {
    docs: {
      description: {
        story:
          'Com `selecaoAtiva`, as zonas 2 e 3 saem da tela e o espaço fica para a barra de ações em massa, que o `Table` renderiza acima do cabeçalho com o contador de selecionados.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('group', { name: 'Filtros da listagem' })).toBeNull();
    await expect(canvas.getByRole('grid', { name: 'Registros, 6 no total' })).toBeVisible();
  },
};

export const SemAcoesEmMassa: Story = {
  name: 'Variação · sem coluna de seleção',
  args: { tabela: tabela({ selecionavel: false }) },
  parameters: {
    docs: {
      description: {
        story:
          'A coluna de seleção só existe quando a entidade tem ao menos uma ação em massa definida. Sem ações, a tabela começa no identificador.',
      },
    },
  },
};

export const Desktop1920: Story = {
  name: 'Responsivo · 1920',
  globals: { viewport: { value: 'desktopGrande' } },
};

export const Desktop1366: Story = {
  name: 'Responsivo · 1366',
  globals: { viewport: { value: 'desktop' } },
};

export const Tablet768: Story = {
  name: 'Responsivo · 768',
  globals: { viewport: { value: 'tabletCitie' } },
  parameters: {
    docs: {
      description: {
        story:
          'Abaixo de 900px de largura de contêiner, a ação primária ocupa a linha inteira e o rodapé empilha o seletor de itens por página acima do paginador.',
      },
    },
  },
};

export const Celular375: Story = {
  name: 'Responsivo · 375',
  globals: { viewport: { value: 'celular' } },
  parameters: {
    docs: {
      description: {
        story:
          'Abaixo de 560px o título reduz de escala e a tabela passa a rolar no eixo horizontal, preservando a ordem das colunas.',
      },
    },
  },
};
