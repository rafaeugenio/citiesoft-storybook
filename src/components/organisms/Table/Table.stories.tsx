import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import {
  Identificador,
  SemRegistro,
  Table,
  mascararCPF,
  resumoDePaginacao,
  type Coluna,
  type TableProps,
} from './Table';
import { StatusIndicator, type EstadoDeFluxo } from '../../atoms/Badge/Badge';
import { Button } from '../../atoms/Button/Button';
import { Switch } from '../../atoms/Choice/Choice';
import { Link } from '../../atoms/Link/Link';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';
import { Pagination } from '../../molecules/Pagination/Pagination';
import { Search } from '../../molecules/Search/Search';
import { Select } from '../../molecules/Select/Select';

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
  { chave: 'emissao', cabecalho: 'Emissão', mono: true, render: (linha) => linha.emissao },
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
          '  texto indentado à mão e o total do pai fica impossível de conferir: use a `TreeTable`.',
          '- **A relação entre os itens é a informação principal e cada item tem um rótulo só**',
          '  (estrutura organizacional, categorias). Uma tabela de uma coluna gasta a largura toda',
          '  para mostrar hierarquia que a `Tree` mostra melhor, com expandir e colapsar por',
          '  teclado. Para escolher um nó dentro de um formulário, use o `TreeSelect`.',
          '- **Cada registro é lido inteiro, um por vez, longe da comparação atributo a atributo**',
          '  (galeria de documentos anexados, catálogo com imagem, cartão com resumo em texto',
          '  corrido). A',
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

/**
 * Régua vertical: toda linha da tabela mede o mesmo, e a medida é inteira.
 *
 * As duas coisas importam. Altura que oscila com o conteúdo cansa a varredura
 * vertical, e altura fracionária desloca a base do texto de todas as linhas
 * abaixo por frações de pixel.
 */
async function conferirRegua(canvasElement: HTMLElement, alturaEsperada: number) {
  const linhas = Array.from(canvasElement.querySelectorAll('tbody tr'));
  const cabecalho = canvasElement.querySelector('thead tr') as HTMLElement;
  const alturas = [cabecalho, ...linhas].map((linha) => linha.getBoundingClientRect().height);

  for (const altura of alturas) {
    // Inteira: cada célula pinta o próprio fio de 1px inteiro, e a linha
    // assenta em coordenada redonda.
    await expect(Number.isInteger(altura)).toBe(true);
  }
  // Uniforme, cabeçalho e última linha inclusive. A lista inteira entra na
  // comparação para a falha dizer qual linha destoou.
  await expect(alturas).toEqual(alturas.map(() => alturaEsperada + 1));
}

export const Confortavel: Story = {
  name: 'Densidade · confortável (44px)',
  parameters: {
    docs: {
      description: {
        story: [
          'Anatomia do UI Kit: célula de 44 com padding 12, corpo Regular 14/20 em `text-base`,',
          'cabeçalho Medium 14/20 em caixa normal separado do dado por peso, fio de 1px em',
          '`border-default` e a última linha sem fio. Era 48 com cabeçalho em micro maiúscula; os',
          'dois valores vinham do PrimeOne, e o kit alinha a célula ao controle de 36 com 4 de',
          'respiro por lado.',
        ].join('\n'),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const grid = canvas.getByRole('grid', { name: 'Solicitações de TFD, 4 registros' });
    await expect(grid).toBeVisible();

    // 44px de célula mais o fio de 1px, igual em toda linha e no cabeçalho.
    await conferirRegua(canvasElement, 44);

    // Cabeçalho Medium 14 em caixa normal: peso separa cabeçalho de dado, e
    // não caixa alta com entreletra.
    const cabecalho = canvas.getByRole('columnheader', { name: /Servidor/ });
    const estilo = getComputedStyle(cabecalho);
    await expect(estilo.textTransform).toBe('none');
    await expect(estilo.fontSize).toBe('14px');
    await expect(Number(estilo.fontWeight)).toBe(500);
    // Corpo Regular 14 no dado.
    const dado = canvas.getByText('Maria de Fátima Souza');
    await expect(getComputedStyle(dado).fontSize).toBe('14px');
    await expect(Number(getComputedStyle(dado).fontWeight)).toBe(400);

    // Coluna mono: a data alinha na vertical com dígitos tabulares.
    const data = canvas.getAllByText('12/03/2025')[0];
    await expect(getComputedStyle(data).fontFamily).toMatch(/Red Hat Mono/);

    // Envoltório é cartão: raio 10, borda e sombra curta.
    const cartao = canvasElement.querySelector('.citie-table-wrapper') as HTMLElement;
    await expect(getComputedStyle(cartao).borderRadius).toBe('10px');
    await expect(getComputedStyle(cartao).boxShadow).not.toBe('none');

    // CPF sai mascarado na listagem; o valor completo só no detalhe.
    await expect(canvas.getByText('***.***.**9-00')).toBeVisible();
  },
};

export const Compacta: Story = {
  name: 'Densidade · compacta (36px)',
  args: { densidade: 'compacta' },
  parameters: {
    docs: {
      description: {
        story: [
          'A densidade compacta é um contrato de 36px, e a tabela o faz valer sobre os',
          'controles que entram nas células: dentro de uma célula compacta, altura de controle',
          'normal e grande passam a valer a pequena. Sem isso, um botão de 40px empurrava a',
          'linha para 41px contra 37px das vizinhas, e um degrau de 4px a cada poucas linhas é',
          'o que cansa a varredura.',
          '',
          'O que a tabela **não** encurta é conteúdo de duas linhas: um `ValorMonetario` com',
          'reembolso mede 45px em densidade compacta, contra 37px das vizinhas. Duas linhas não',
          'cabem em 36px, e a decisão é do consumidor: ou o valor vai sem a segunda linha, ou a',
          'tabela vai em densidade confortável, onde ele cabe e a régua se mantém em 49px.',
        ].join('\n'),
      },
    },
  },
  play: async ({ canvasElement }) => {
    await conferirRegua(canvasElement, 36);
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

/** As colunas padrão com o servidor em identificador de duas linhas: o CPF é metadado em text-secondary. */
const COLUNAS_COM_IDENTIFICADOR: Coluna<Solicitacao>[] = COLUNAS.map((coluna) =>
  coluna.chave === 'servidor'
    ? { ...coluna, render: (linha) => <Identificador principal={linha.servidor} secundario={mascararCPF(linha.cpf)} /> }
    : coluna,
);

/** Contraste WCAG entre duas cores computadas (`rgb(r, g, b)`). */
function contraste(a: string, b: string) {
  const lum = (cor: string) => {
    const [r, g, bl] = (cor.match(/\d+/g) ?? []).slice(0, 3).map((c) => {
      const v = Number(c) / 255;
      return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const [claro, escuro] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (claro + 0.05) / (escuro + 0.05);
}

export const SelecaoNaLinhaPar: Story = {
  name: 'Estado · seleção na linha par da zebra',
  args: { selecionavel: true },
  // O `args` do Storybook perde o genérico (`linhas: unknown[]`); o cast
  // devolve o tipo que a tabela desta story consome.
  render: (args) => (
    <Table<Solicitacao> {...(args as TableProps<Solicitacao>)} colunas={COLUNAS_COM_IDENTIFICADOR} />
  ),
  parameters: {
    docs: {
      description: {
        story: [
          'A zebra pinta a linha par e a seleção pinta a linha escolhida, e as duas usam a mesma',
          'propriedade de fundo. Por especificidade, a zebra vencia: ao marcar a página inteira,',
          'as linhas ímpares ficavam com a cor de seleção e as pares seguiam com a faixa da',
          'zebra, ou seja, metade da seleção era invisível. A ordem entre as duas agora é',
          'declarada por camada em `Table.css`, e vale nas duas paridades.',
          '',
          'Esta story cobre justamente a paridade que as outras duas de seleção deixavam de fora:',
          'ambas escolhiam linha ímpar, e por isso o defeito atravessava a suíte verde.',
        ].join('\n'),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const linhas = () => Array.from(canvasElement.querySelectorAll('tbody tr'));
    const fundo = (linha: Element) =>
      getComputedStyle(linha.querySelector('td') as HTMLElement).backgroundColor;

    const [impar, par] = linhas();

    // Em repouso a zebra separa as duas paridades: é o que torna a medição
    // seguinte capaz de reprovar.
    const parEmRepouso = fundo(par);
    await expect(parEmRepouso).not.toBe(fundo(impar));

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Selecionar a página atual' }));
    await expect(par).toHaveClass('citie-table__linha--selecionada');

    // Depois da transição de 140ms do fundo, as duas paridades selecionadas
    // pintam a MESMA cor, que é a de seleção, e nenhuma delas fica na cor que a
    // zebra pintava.
    await waitFor(async () => {
      await expect(fundo(par)).toBe(fundo(impar));
      await expect(fundo(par)).not.toBe(parEmRepouso);
    });

    // A seleção é o accent forte do kit, distinto do accent de hover, e o
    // rótulo sobe para text-primary no mesmo golpe (11,81:1 medido no claro).
    // O token é lido na própria célula, onde o tema já está herdado.
    const celula = par.querySelector('td') as HTMLElement;
    const token = (nome: string) => getComputedStyle(celula).getPropertyValue(nome).trim();
    const paraRgb = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
      return `rgb(${r}, ${g}, ${b})`;
    };
    await expect(fundo(par)).toBe(paraRgb(token('--citie-accent-forte')));
    await expect(fundo(par)).not.toBe(paraRgb(token('--citie-accent')));
    await expect(getComputedStyle(celula).color).toBe(paraRgb(token('--citie-text-primary')));

    // O véu sobre a seleção existe e é translúcido: sem o token a linha
    // selecionada deixa de responder ao ponteiro (o `@property` cai em
    // `transparent`), e opaco ele apagaria a seleção.
    const veu = token('--citie-veu-sobre-selecao');
    const alfa = Number(veu.match(/rgba?\([^)]*,\s*([\d.]+)\)$/)?.[1]);
    await expect(alfa).toBeGreaterThan(0);
    await expect(alfa).toBeLessThan(1);
    await expect(veu).not.toBe(token('--citie-accent'));

    // O metadado em text-secondary dentro da linha selecionada sobe para
    // text-base: sobre o accent forte o text-secondary mede 3,57:1 e reprova.
    const cpf = par.querySelector('.citie-table__identificador-secundario') as HTMLElement;
    await expect(getComputedStyle(cpf).color).toBe(paraRgb(token('--citie-text-base')));
    await expect(contraste(getComputedStyle(cpf).color, fundo(par))).toBeGreaterThanOrEqual(4.5);
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

/** As mesmas colunas, sem a coluna de ações montada à mão. */
const COLUNAS_SEM_ACOES = COLUNAS.filter((coluna) => coluna.chave !== 'acoes');

/* ---------- Listagem em cartão, como no Sismental ---------- */

interface Profissional {
  id: string;
  nome: string;
  cpf: string;
  profissao: string;
  unidade: string;
  cadastro: string;
  ativo: boolean;
}

const PROFISSIONAIS: Profissional[] = [
  { id: 'p1', nome: 'Ana Neri', cpf: '111.222.333-44', profissao: 'Enfermeira', unidade: 'CAPS AD III, São Luís', cadastro: '08/03/2026', ativo: true },
  { id: 'p2', nome: 'Manuel Braga', cpf: '222.333.444-55', profissao: 'Psicólogo', unidade: 'CAPS AD III, São Luís', cadastro: '11/03/2026', ativo: true },
  { id: 'p3', nome: 'Raimundo Nonato', cpf: '333.444.555-66', profissao: 'Psiquiatra', unidade: 'CAPS II, Imperatriz', cadastro: '14/03/2026', ativo: true },
  { id: 'p4', nome: 'Vitória Lima', cpf: '444.555.666-77', profissao: 'Médica', unidade: 'CAPS II, Imperatriz', cadastro: '20/03/2026', ativo: true },
  { id: 'p5', nome: 'Marcos Aquino', cpf: '555.666.777-88', profissao: 'Educador físico', unidade: 'CAPS AD III, São Luís', cadastro: '02/04/2026', ativo: false },
];

const IconeDeLapis = (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M10.8 2.2 13.8 5.2 5.6 13.4H2.6v-3z"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinejoin="round"
    />
  </svg>
);

const COLUNAS_DE_PROFISSIONAL: Coluna<Profissional>[] = [
  {
    chave: 'nome',
    cabecalho: 'Profissional',
    ordenavel: true,
    render: (linha) => <Identificador principal={linha.nome} secundario={mascararCPF(linha.cpf)} />,
  },
  { chave: 'profissao', cabecalho: 'Profissão', render: (linha) => linha.profissao },
  { chave: 'unidade', cabecalho: 'Unidade', render: (linha) => linha.unidade },
  { chave: 'cadastro', cabecalho: 'Cadastro', mono: true, ordenavel: true, render: (linha) => linha.cadastro },
  {
    chave: 'ativo',
    cabecalho: 'Status',
    render: (linha) => (
      <Switch label={linha.ativo ? 'Ativo' : 'Inativo'} defaultChecked={linha.ativo} />
    ),
  },
];

export const EmCartao: Story = {
  name: 'Composição · listagem em cartão',
  render: () => (
    <Table<Profissional>
      legenda="Profissionais, 98 registros"
      colunas={COLUNAS_DE_PROFISSIONAL}
      linhas={PROFISSIONAIS}
      chaveDaLinha={(linha) => linha.id}
      rotuloDaLinha={(linha) => linha.nome}
      linhaInativa={(linha) => !linha.ativo}
      acoesSempreVisiveis
      cabecalho={{
        titulo: 'Profissionais',
        subtitulo: 'Equipe cadastrada nas unidades da rede',
        acao: (
          <Button variant="primary" icon={<span aria-hidden="true">+</span>}>
            Cadastrar profissional
          </Button>
        ),
      }}
      filtros={
        <>
          <Search label="Pesquisar profissional" placeholder="Pesquisar" size="md" />
          <Select
            label="Status"
            placeholder="Todos os status"
            options={[
              { value: 'ativo', label: 'Ativo' },
              { value: 'inativo', label: 'Inativo' },
            ]}
          />
        </>
      }
      acoesDaLinha={(linha) => (
        <Button variant="outline" size="small" icon={IconeDeLapis} aria-label={`Editar ${linha.nome}`}>
          Editar
        </Button>
      )}
      paginacao={
        <Pagination label="Paginação de profissionais" totalRegistros={98} itensPorPagina={10} variant="simples" />
      }
      resumo={resumoDePaginacao(1, 10, 98, ['profissional', 'profissionais'])}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: [
          'A listagem do Sismental inteira dentro do cartão da tabela: cabeçalho com título 16',
          'Medium, subtítulo muted e ação primária à direita; linha de filtro com busca larga e',
          'select de escopo; identificador em duas linhas (nome 14 mais CPF em mono 12 muted);',
          'data em mono; coluna de status com switch e texto; botão outline "Editar" com lápis',
          'visível em toda linha porque é a ação principal da tela; linha inativa em',
          '`text-secondary` com "Inativo" anunciado ao leitor de tela; rodapé com paginação à',
          'esquerda e "Mostrando 1 a 10 de 98 profissionais" à direita.',
          '',
          'O que se copia do Sismental é a composição. A cor é a da casa: azul Citiesoft no',
          'botão, accent no hover, accent forte na seleção.',
        ].join('\n'),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('heading', { name: 'Profissionais' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Cadastrar profissional' })).toBeVisible();
    await expect(canvas.getByText('Mostrando 1 a 10 de 98 profissionais')).toBeVisible();

    // Identificador em duas linhas dentro dos 44px: nome mais CPF em mono muted.
    const cpf = canvas.getByText('***.***.**3-44');
    await expect(getComputedStyle(cpf).fontFamily).toMatch(/Red Hat Mono/);
    await expect(getComputedStyle(cpf).fontSize).toBe('12px');
    await conferirRegua(canvasElement, 44);

    // Linha inativa recua para text-secondary e diz "Inativo" a quem não vê a cor.
    const inativa = canvas.getByText('Marcos Aquino').closest('tr') as HTMLElement;
    await expect(inativa).toHaveClass('citie-table__linha--inativa');
    await expect(within(inativa).getByText('Inativo.')).toBeInTheDocument();

    // Busca e select da linha de filtro na mesma altura de 36 do kit.
    const busca = canvasElement.querySelector('.citie-table__filtros .citie-search') as HTMLElement;
    await expect(busca.getBoundingClientRect().height).toBe(36);
    await expect(canvas.getByRole('combobox', { name: 'Status' }).getBoundingClientRect().height).toBe(36);

    // Ação principal visível sem hover, em botão outline de 32.
    const editar = canvas.getByRole('button', { name: 'Editar Ana Neri' });
    await expect(getComputedStyle(editar).opacity).toBe('1');
    await expect(editar.getBoundingClientRect().height).toBe(32);
  },
};

export const ResumoDePaginacao: Story = {
  name: 'Regra · resumo de paginação',
  play: async () => {
    await expect(resumoDePaginacao(1, 10, 98, ['profissional', 'profissionais'])).toBe(
      'Mostrando 1 a 10 de 98 profissionais',
    );
    // A última página nunca diz "91 a 100" numa lista de 98.
    await expect(resumoDePaginacao(10, 10, 98)).toBe('Mostrando 91 a 98 de 98 registros');
    await expect(resumoDePaginacao(1, 10, 1)).toBe('Mostrando 1 a 1 de 1 registro');
    await expect(resumoDePaginacao(1, 10, 0)).toBe('Nenhum registro para mostrar');
  },
};

export const AcoesPorLinha: Story = {
  name: 'Controle · ações por linha',
  render: () => (
    <Table
      legenda="Solicitações de TFD, 4 registros"
      colunas={COLUNAS_SEM_ACOES}
      linhas={SOLICITACOES}
      chaveDaLinha={(linha) => linha.processo}
      zebra
      acoesDaLinha={ (linha: Solicitacao) => (
      <>
        <Button
          variant="text"
          size="small"
          iconOnly
          aria-label={`Abrir o processo ${linha.processo}`}
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M2 8s2.4-4 6-4 6 4 6 4-2.4 4-6 4-6-4-6-4Z"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          }
        />
        <Button
          variant="text"
          size="small"
          iconOnly
          aria-label={`Editar o processo ${linha.processo}`}
          icon={
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path
                d="M10.8 2.2 13.8 5.2 5.6 13.4H2.6v-3z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
          }
        />
      </>
      )}
    />
  ),
  parameters: {
    docs: {
      description: {
        story: [
          'A coluna de ações é gerada pela própria tabela, sem o consumidor montá-la como',
          'coluna comum. Antes, cada tela improvisava a sua: largura diferente, alinhamento',
          'diferente, e o cabeçalho às vezes com verbo. A anatomia vem do protótipo TFD.',
          '',
          'O cabeçalho fica visualmente oculto de propósito, porque "Ações" repetido em toda',
          'tabela é ruído, mas o leitor de tela precisa dele para anunciar a coluna.',
          '',
          'Os ícones aparecem no hover da linha para não competir com o dado numa tabela longa,',
          'e o `:focus-within` os revela na navegação por teclado. Cada ação nomeia o registro',
          'no `aria-label`: "Abrir" sozinho não diz ao leitor de tela qual processo será aberto.',
        ].join('\n'),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // O nome acessível carrega o verbo e o registro.
    const abrir = canvas.getByRole('button', { name: `Abrir o processo ${SOLICITACOES[0].processo}` });
    await expect(abrir).toBeInTheDocument();

    // O cabeçalho existe para o leitor de tela mesmo sem aparecer na tela, e é
    // único: a coluna improvisada foi substituída, não somada.
    await expect(canvas.getAllByText('Ações')).toHaveLength(1);

    // Alcançável por teclado: as ações continuam na ordem de tabulação mesmo
    // enquanto estão transparentes, que é o que o :focus-within resolve.
    abrir.focus();
    await expect(abrir).toHaveFocus();
  },
};

export const DestaqueDeLinha: Story = {
  name: 'Controle · destaque de linha por estado',
  render: () => (
    <Table
      legenda="Solicitações de TFD, 4 registros"
      colunas={COLUNAS}
      linhas={SOLICITACOES}
      chaveDaLinha={(linha) => linha.processo}
      rotuloDaLinha={(linha) => `o processo ${linha.processo}`}
      selecionavel
      zebra
      destaqueDaLinha={(linha) =>
      linha.estado === 'Devolvido'
        ? { severidade: 'critico' as const, motivo: 'Devolvido pela regulação e aguardando correção' }
        : linha.estado === 'Em Análise'
          ? { severidade: 'atencao' as const, motivo: 'Na regulação há mais de 5 dias' }
          : undefined
      }
    />
  ),
  parameters: {
    docs: {
      description: {
        story: [
          'Destaca a linha que exige atenção sem tirá-la do fluxo da lista. A anatomia vem do',
          'protótipo TFD, que usa barra vertical em três das suas filas de trabalho.',
          '',
          '**A barra é `box-shadow: inset`.** Fundo colorido briga com o',
          'zebrado e com o realce de hover, e a linha destacada deixa de responder ao ponteiro.',
          'A barra convive com os dois.',
          '',
          '**Cor sozinha não comunica.** O motivo do destaque entra como texto na primeira célula',
          'de dado, oculto visualmente e disponível ao leitor de tela. Ele vai na célula existente,',
          'e não numa coluna própria: coluna extra apenas nas linhas destacadas quebraria a',
          'contagem de colunas da grade.',
          '',
          '**Selecionar uma linha destacada não apaga o destaque.** Os dois trilhos se encaixam:',
          'a seleção ocupa a faixa colada na borda, que é a posição mais forte, e a condição do',
          'dado ocupa a faixa imediatamente ao lado. Antes a seleção sobrescrevia o destaque, e o',
          'motivo pelo qual a linha exigia atenção sumia da tela justo quando o servidor a',
          'escolhia para agir.',
          '',
          '**A tinta do trilho vem da família `*-strong`**, que é a de cor lida sobre superfície.',
          'Medido: `warning-emphasis` #d97706 sobre a linha zebrada do tema claro dá 2,92:1 e',
          'reprova o mínimo de 3:1 da WCAG 1.4.11; `warning-strong` #b45309 dá 4,60:1.',
        ].join('\n'),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // O motivo chega a quem não enxerga a barra.
    await expect(canvas.getByText(/Devolvido pela regulação e aguardando correção/)).toBeInTheDocument();
    await expect(canvas.getByText(/Na regulação há mais de 5 dias/)).toBeInTheDocument();

    // A contagem de colunas não muda por causa do destaque: a grade continua íntegra.
    const linhas = canvas.getAllByRole('row');
    const celulasDaPrimeira = linhas[1].querySelectorAll('td').length;
    const celulasDaSegunda = linhas[2].querySelectorAll('td').length;
    await expect(celulasDaPrimeira).toBe(celulasDaSegunda);

    // Selecionar a linha destacada não apaga o destaque: os dois trilhos ficam,
    // encaixados, e o de estado recua para caber ao lado do de seleção.
    const primeiraCelula = linhas[1].querySelector('td') as HTMLElement;
    const antes = getComputedStyle(primeiraCelula).boxShadow;
    await expect(antes).toContain('inset');

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Selecionar o processo 2025/0481' }));
    const depois = getComputedStyle(primeiraCelula).boxShadow;

    // Duas sombras internas: a lista tem duas entradas `inset`.
    await expect(depois.match(/inset/g)?.length).toBe(2);
    // A largura do trilho de estado dobra para ele encostar ao lado da seleção.
    await expect(depois).toContain('6px');
  },
};
