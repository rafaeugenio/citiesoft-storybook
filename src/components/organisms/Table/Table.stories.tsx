import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SemRegistro, Table, mascararCPF, type Coluna } from './Table';
import { StatusIndicator, type EstadoDeFluxo } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';
import { Link } from '../../atoms/Link/Link';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';

interface Solicitacao {
  processo: string;
  servidor: string;
  cpf: string;
  destino: string;
  valor: number;
  emissao: string;
  estado: EstadoDeFluxo;
}

const SOLICITACOES: Solicitacao[] = [
  { processo: '2025/0481', servidor: 'Maria de Fátima Souza', cpf: '123.456.789-00', destino: 'São Luís', valor: 1234.56, emissao: '12/03/2025', estado: 'Em Análise' },
  { processo: '2025/0482', servidor: 'João Silva', cpf: '987.654.321-00', destino: 'Imperatriz', valor: 890, emissao: '12/03/2025', estado: 'Aprovado' },
  { processo: '2025/0483', servidor: 'Carlos Andrade', cpf: '456.789.123-00', destino: 'Caxias', valor: 2410.9, emissao: '13/03/2025', estado: 'Devolvido' },
  { processo: '2025/0484', servidor: 'Ana Beatriz Lima', cpf: '321.654.987-00', destino: 'Timon', valor: 640, emissao: '14/03/2025', estado: 'Rascunho' },
];

const reais = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Ordem fixa: identificador, descritivos, numéricos e data, status, ações.
const COLUNAS: Coluna<Solicitacao>[] = [
  {
    chave: 'processo',
    cabecalho: 'Processo',
    ordenavel: true,
    // O identificador usa o átomo Link. Como `<a>` cru, ele herdava o azul
    // default do navegador e media 1,67:1 sobre a linha zebrada no tema escuro.
    render: (linha) => (
      <Link papel="identificador" href="#detalhe">
        {linha.processo}
      </Link>
    ),
  },
  { chave: 'servidor', cabecalho: 'Servidor', ordenavel: true, render: (linha) => linha.servidor },
  { chave: 'cpf', cabecalho: 'CPF', render: (linha) => mascararCPF(linha.cpf) },
  {
    chave: 'destino',
    cabecalho: 'Destino',
    render: (linha) => linha.destino || <SemRegistro texto="Não informado" />,
  },
  {
    chave: 'valor',
    cabecalho: 'Valor da diária',
    alinhamento: 'direita',
    ordenavel: true,
    render: (linha) => reais(linha.valor),
  },
  { chave: 'emissao', cabecalho: 'Emissão', alinhamento: 'centro', render: (linha) => linha.emissao },
  {
    chave: 'estado',
    cabecalho: 'Situação',
    render: (linha) => <StatusIndicator estado={linha.estado} size="sm" />,
  },
  {
    chave: 'acoes',
    cabecalho: 'Ações',
    largura: '72px',
    alinhamento: 'centro',
    render: (linha) => (
      <Button variant="text" size="small" aria-label={`Abrir o processo ${linha.processo}`}>
        Abrir
      </Button>
    ),
  },
];

const meta = {
  title: 'Organismos/Tabelas/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Tabela operacional. Spec: `03-components/tables-data-grid.md` v2.0.0. Equivalente PrimeNG: `p-table`, `p-treetable`.',
          '',
          '**Este é o padrão do DS Citiesoft para exibir conjunto de registros.** Use a `Table`',
          'sempre que as linhas forem do mesmo tipo, sem relação de pai e filho entre elas, e o',
          'servidor precisar comparar registros atributo a atributo, ordenar por uma coluna e agir',
          'sobre vários de uma vez. É a listagem de processos, de servidores, de diárias e de',
          'lançamentos. Quando houver dúvida entre esta e outra forma de listar, a resposta padrão',
          'é a tabela.',
          '',
          '**Quando não usar:**',
          '',
          '- **As linhas se agrupam em pai e filho e o pai soma os filhos** (plano de contas,',
          '  estrutura de despesa, secretaria com suas unidades). Na tabela plana a hierarquia vira',
          '  texto indentado à mão e o total do pai deixa de ser conferível: use a `TreeTable`.',
          '- **A relação entre os itens é a informação principal e cada item tem um rótulo só**',
          '  (estrutura organizacional, categorias). Uma tabela de uma coluna gasta a largura toda',
          '  para mostrar hierarquia que a `Tree` mostra melhor, com expandir e colapsar por',
          '  teclado. Para escolher um nó dentro de um formulário, use o `TreeSelect`.',
          '- **Cada registro é lido inteiro, um por vez, e não comparado com os outros** (galeria de',
          '  documentos anexados, catálogo com imagem, cartão com resumo em texto corrido). A',
          '  tabela obriga a espremer descrição longa em célula que trunca: use o `DataView`, que',
          '  alterna lista e grade e já traz ordenação e paginação.',
          '- **São dois ou três atributos de um único registro.** Uma tabela de uma linha é um',
          '  cabeçalho gasto sem ganho: use a lista de definições do detalhe do processo, ou o',
          '  `Card`.',
          '- **O número é um só e serve de indicador de painel** (total do mês, prazo médio): use o',
          '  `KpiWidget`; para a fila curta de itens que exigem atenção, o `ListaResumoWidget`.',
          '- **Sequência de eventos com data e autor** (tramitação, auditoria): a ordem cronológica',
          '  e o encadeamento se perdem em linhas de grade, use a `Timeline`.',
          '',
          'Limites reais da implementação: a `Table` não pagina nem filtra sozinha (componha com',
          '`Pagination` e `FilterBar`) e renderiza todas as linhas recebidas, sem virtualização.',
          'Passe para a tela um recorte paginado no servidor em vez de milhares de linhas de uma',
          'vez, senão a jornada longa do servidor público paga em travamento de rolagem.',
        ].join('\n'),
      },
    },
  },
  args: {
    legenda: 'Solicitações de TFD, 4 registros',
    colunas: COLUNAS,
    linhas: SOLICITACOES,
    chaveDaLinha: (linha: Solicitacao) => linha.processo,
    rotuloDaLinha: (linha: Solicitacao) => `o processo ${linha.processo}`,
    zebra: true,
  },
} satisfies Meta<typeof Table<Solicitacao>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confortavel: Story = {
  name: 'Densidade · confortável (48px)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('grid', { name: 'Solicitações de TFD, 4 registros' });
    await expect(grid).toBeVisible();

    // A spec define 48px como altura MÍNIMA: uma linha com botão de 32px mais
    // o padding de 12px cresce para 56px, e isso é o comportamento esperado.
    const primeiraLinha = canvas.getAllByRole('row')[1];
    await expect(primeiraLinha.getBoundingClientRect().height).toBeGreaterThanOrEqual(48);
    await expect(primeiraLinha.getBoundingClientRect().height).toBeLessThanOrEqual(56);

    // CPF sai mascarado na listagem; o valor completo só no detalhe.
    await expect(canvas.getByText('***.***.**9-00')).toBeVisible();
  },
};

export const Compacta: Story = {
  name: 'Densidade · compacta (36px)',
  args: { densidade: 'compacta' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primeiraLinha = canvas.getAllByRole('row')[1];
    await expect(primeiraLinha.getBoundingClientRect().height).toBeGreaterThanOrEqual(36);
    await expect(primeiraLinha.getBoundingClientRect().height).toBeLessThanOrEqual(40);
  },
};

export const ComSelecao: Story = {
  name: 'Estado · seleção e ações em massa',
  args: {
    selecionavel: true,
    acoesEmMassa: () => (
      <Button variant="danger" size="small">
        Excluir selecionados
      </Button>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'O checkbox do cabeçalho marca apenas a página atual. A barra de ações em massa aparece acima do cabeçalho com a contagem.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Selecionar o processo 2025/0481' }));
    await expect(canvas.getByText('1 selecionados')).toBeVisible();

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Selecionar a página atual' }));
    await expect(canvas.getByText('4 selecionados')).toBeVisible();
  },
};

export const Ordenacao: Story = {
  name: 'Estado · ordenação',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cabecalho = canvas.getByRole('columnheader', { name: /Valor da diária/ });

    await expect(cabecalho).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(within(cabecalho).getByRole('button'));
    await expect(cabecalho).toHaveAttribute('aria-sort', 'ascending');
    await userEvent.click(within(cabecalho).getByRole('button'));
    await expect(cabecalho).toHaveAttribute('aria-sort', 'descending');
  },
};

export const Carregando: Story = {
  name: 'Estado · carregando',
  args: { carregando: true },
  parameters: {
    docs: {
      description: {
        story:
          'Skeleton no corpo, cabeçalho continua real e visível. Nunca spinner flutuante sobre a tabela.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('grid')).toHaveAttribute('aria-busy', 'true');
    // O cabeçalho permanece legível durante o carregamento.
    await expect(canvas.getByRole('columnheader', { name: /Processo/ })).toBeVisible();
  },
};

export const VazioPrimeiroUso: Story = {
  name: 'Estado · vazio no primeiro uso',
  args: {
    legenda: 'Solicitações de TFD, 0 registros',
    linhas: [],
    semConteudo: (
      <EmptyState
        size="md"
        titulo="Nenhuma solicitação registrada ainda"
        descricao="Registre a primeira solicitação de TFD para acompanhar o trâmite por aqui."
        acaoPrimaria={{ rotulo: 'Registrar solicitação' }}
      />
    ),
  },
};

export const VazioComFiltro: Story = {
  name: 'Estado · vazio com filtro',
  args: {
    legenda: 'Solicitações de TFD, 0 registros',
    linhas: [],
    semConteudo: (
      <EmptyState
        size="md"
        situacao="busca-sem-resultado"
        titulo="Nenhum resultado para os filtros aplicados"
        descricao="Ajuste o período ou o município para ampliar a busca."
        acaoPrimaria={{ rotulo: 'Limpar filtros' }}
      />
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A causa muda o conteúdo: sem filtro é ausência de dado real e oferece criar; com filtro é busca sem correspondência e oferece limpar, sem botão de criar.',
      },
    },
  },
};
