import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { DataView, type ItemDataView, type OrdenacaoDataView } from './DataView';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { StatusIndicator, type EstadoDeFluxo } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';

interface Unidade {
  codigo: string;
  nome: string;
  municipio: string;
  tipo: string;
  leitos: number;
  situacao: EstadoDeFluxo;
}

const UNIDADES: Unidade[] = [
  { codigo: '2510', nome: 'Hospital Geral Tarquínio Lopes Filho', municipio: 'São Luís', tipo: 'Hospital geral · porte II', leitos: 184, situacao: 'Homologado' },
  { codigo: '2511', nome: 'UPA Vila Luizão', municipio: 'São Luís', tipo: 'Unidade de pronto atendimento', leitos: 22, situacao: 'Homologado' },
  { codigo: '2512', nome: 'Hospital Regional de Imperatriz', municipio: 'Imperatriz', tipo: 'Hospital regional · porte III', leitos: 240, situacao: 'Pendente' },
  { codigo: '2513', nome: 'Centro de Saúde Bacabal Centro', municipio: 'Bacabal', tipo: 'Atenção básica', leitos: 8, situacao: 'Homologado' },
  { codigo: '2514', nome: 'Policlínica de Caxias', municipio: 'Caxias', tipo: 'Policlínica · especialidades', leitos: 36, situacao: 'Suspenso' },
  { codigo: '2515', nome: 'Hospital Materno Infantil de Timon', municipio: 'Timon', tipo: 'Hospital materno infantil', leitos: 96, situacao: 'Homologado' },
  { codigo: '2516', nome: 'Unidade Mista de Balsas', municipio: 'Balsas', tipo: 'Unidade mista', leitos: 44, situacao: 'Vencido' },
  { codigo: '2517', nome: 'Centro de Referência em TFD', municipio: 'São Luís', tipo: 'Apoio ao tratamento fora de domicílio', leitos: 12, situacao: 'Homologado' },
];

const ITENS: ItemDataView[] = UNIDADES.map((unidade) => ({
  id: unidade.codigo,
  titulo: unidade.nome,
  subtitulo: `${unidade.municipio} · CNES ${unidade.codigo}`,
  descricao: unidade.tipo,
  etiqueta: <StatusIndicator estado={unidade.situacao} size="sm" />,
  destaque: `${unidade.leitos} leitos`,
  midia: <Avatar nome={unidade.nome} shape="square" />,
  acoes: <Button variant="secondary" size="small">Ver unidade</Button>,
}));

const porTexto = (extrair: (item: ItemDataView) => string) => (a: ItemDataView, b: ItemDataView) =>
  extrair(a).localeCompare(extrair(b), 'pt-BR');

const ORDENACOES: OrdenacaoDataView[] = [
  { value: 'nome-asc', label: 'Nome (A-Z)', comparar: porTexto((item) => item.titulo) },
  {
    value: 'nome-desc',
    label: 'Nome (Z-A)',
    comparar: (a, b) => porTexto((item) => item.titulo)(b, a),
  },
  {
    value: 'municipio',
    label: 'Município (A-Z)',
    comparar: porTexto((item) => item.subtitulo ?? ''),
  },
];

const meta = {
  title: 'Organismos/Coleções/DataView',
  component: DataView,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Listagem que alterna entre visão em lista e visão em grade, com ordenação e paginação. Estrutura da página `❖ DataView` do CitieOne (`6738:49722`), eixo `Layout` do component set `dataview` (List e Grid). Equivalente PrimeNG: `p-dataview`. Reaproveita Card na grade, Pagination no rodapé, Select na ordenação, SelectButton na alternância, EmptyState no vazio e Skeleton no carregamento.',
      },
    },
  },
  args: {
    legenda: 'Unidades de saúde',
    itens: ITENS,
    ordenacoes: ORDENACOES,
    itensPorPagina: 4,
    unidadeDeContagem: { singular: 'unidade', plural: 'unidades' },
    vazioEstrutural: {
      titulo: 'Nenhuma unidade cadastrada',
      descricao: 'Cadastre a primeira unidade de saúde para começar a distribuir vagas de TFD.',
      acao: { rotulo: 'Cadastrar unidade' },
    },
    vazioPorFiltro: {
      titulo: 'Nenhuma unidade para esse filtro',
      descricao: 'Nenhuma unidade de Balsas está homologada na competência 03/2025.',
      acao: { rotulo: 'Limpar filtros' },
    },
  },
} satisfies Meta<typeof DataView>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Lista: Story = {
  name: 'Variante · lista',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('8 unidades · visão em lista')).toBeVisible();
    // Paginação de 4 em 4: a segunda página não está montada.
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(4);
  },
};

export const Grade: Story = {
  name: 'Variante · grade',
  args: { visaoInicial: 'grade' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Grade' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    await expect(canvas.getByText('8 unidades · visão em grade')).toBeVisible();
  },
};

export const AlternarVisao: Story = {
  name: 'Comportamento · alternar visão',
  parameters: {
    docs: {
      description: {
        story:
          'A alternância é um grupo de botões com `aria-pressed`, não um par de abas: as duas visões mostram os mesmos registros, só muda a densidade de leitura.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lista = canvas.getByRole('button', { name: 'Lista' });
    const grade = canvas.getByRole('button', { name: 'Grade' });

    await expect(canvas.getByRole('group', { name: 'Visualização dos resultados' })).toBeVisible();
    await expect(lista).toHaveAttribute('aria-pressed', 'true');

    await userEvent.click(grade);
    await expect(grade).toHaveAttribute('aria-pressed', 'true');
    await expect(lista).toHaveAttribute('aria-pressed', 'false');
    await expect(canvas.getByText('8 unidades · visão em grade')).toBeVisible();
  },
};

export const Ordenacao: Story = {
  name: 'Comportamento · ordenação',
  parameters: {
    docs: {
      description: {
        story:
          'A ordem é aplicada aos dados antes de renderizar, e a lista volta à primeira página: com paginação, ordenar sem voltar deixaria o primeiro item visível fora do topo da nova ordem. A comparação usa `localeCompare` em pt-BR, então "Unidade" vem antes de "UPA".',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const seletor = canvas.getByLabelText(/Ordenar por/);
    // Lê o primeiro item realmente renderizado, não um container que agrega tudo.
    const primeiroTitulo = () =>
      within(canvas.getAllByRole('listitem')[0]).getByRole('heading', { level: 3 });

    await userEvent.selectOptions(seletor, 'nome-asc');
    await expect(primeiroTitulo()).toHaveTextContent('Centro de Referência em TFD');

    await userEvent.selectOptions(seletor, 'nome-desc');
    await expect(primeiroTitulo()).toHaveTextContent('UPA Vila Luizão');

    // A contagem continua sendo anunciada na região aria-live depois de ordenar.
    await expect(canvas.getByText('8 unidades · visão em lista')).toHaveAttribute(
      'aria-live',
      'polite',
    );
  },
};

export const Paginacao: Story = {
  name: 'Comportamento · paginação',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Hospital Geral Tarquínio Lopes Filho')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Página 2' }));
    await expect(canvas.getByText('Policlínica de Caxias')).toBeVisible();
    await expect(canvas.queryByText('Hospital Geral Tarquínio Lopes Filho')).toBeNull();
  },
};

export const SemPaginacao: Story = {
  name: 'Variante · sem paginação',
  args: { paginacao: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('heading', { level: 3 })).toHaveLength(8);
    await expect(canvas.queryByRole('navigation')).toBeNull();
  },
};

export const Carregando: Story = {
  name: 'Estado · carregando',
  args: { carregando: true },
  parameters: {
    docs: {
      description: {
        story:
          'O esqueleto replica a forma da visão ativa. O cabeçalho continua real: ordenar e alternar seguem disponíveis enquanto a busca não volta.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByLabelText('Carregando unidades de saúde')).toBeVisible();
    await expect(canvas.getByText('Carregando unidades')).toBeVisible();
  },
};

export const VazioEstrutural: Story = {
  name: 'Estado · vazio estrutural',
  args: { itens: [] },
  parameters: {
    docs: {
      description: {
        story:
          'Nada cadastrado ainda. A ação leva ao cadastro, porque não há filtro nenhum para desfazer.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Nenhuma unidade cadastrada')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Cadastrar unidade' })).toBeVisible();
    await expect(canvas.getByText('Sem unidades para exibir')).toBeVisible();
  },
};

export const VazioPorFiltro: Story = {
  name: 'Estado · vazio por filtro',
  args: { itens: [], filtroAtivo: true },
  parameters: {
    docs: {
      description: {
        story:
          'Há unidades cadastradas, o recorte é que não devolveu nada. A ação desfaz o filtro em vez de mandar cadastrar, como já fazemos na Table.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Nenhuma unidade para esse filtro')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Limpar filtros' })).toBeVisible();
  },
};

export const ItensNavegaveis: Story = {
  name: 'Variante · item navegável',
  args: {
    itens: ITENS.slice(0, 4).map((item) => ({
      ...item,
      href: `/unidades/${item.id}`,
    })),
    paginacao: false,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Com `href` o título vira link e as ações do item somem: nada de botão dentro de área navegável.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('link', { name: 'Hospital Geral Tarquínio Lopes Filho' }),
    ).toHaveAttribute('href', '/unidades/2510');
    await expect(canvas.queryByRole('button', { name: 'Ver unidade' })).toBeNull();
  },
};
