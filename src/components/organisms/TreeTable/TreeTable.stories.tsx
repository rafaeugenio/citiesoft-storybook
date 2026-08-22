import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { TreeTable, somarSubarvore, type ColunaDaArvore, type NoDaTreeTable } from './TreeTable';
import { EmptyState } from '../../molecules/EmptyState/EmptyState';

interface Conta {
  codigo: string;
  nome: string;
  /** Preenchido só nas folhas; o pai exibe a soma da subárvore. */
  dotacao?: number;
  empenhado?: number;
}

// Plano de contas da despesa, exercício 2025, Secretaria de Estado da Saúde.
const PLANO_DE_CONTAS: NoDaTreeTable<Conta>[] = [
  {
    chave: '3',
    dados: { codigo: '3', nome: 'Despesas correntes' },
    filhos: [
      {
        chave: '3.1',
        dados: { codigo: '3.1', nome: 'Pessoal e encargos sociais' },
        filhos: [
          {
            chave: '3.1.90.11',
            dados: {
              codigo: '3.1.90.11',
              nome: 'Vencimentos e vantagens fixas',
              dotacao: 4820000,
              empenhado: 4310500.4,
            },
          },
          {
            chave: '3.1.90.13',
            dados: {
              codigo: '3.1.90.13',
              nome: 'Obrigações patronais',
              dotacao: 964000,
              empenhado: 862100,
            },
          },
        ],
      },
      {
        chave: '3.3',
        dados: { codigo: '3.3', nome: 'Outras despesas correntes' },
        filhos: [
          {
            chave: '3.3.90.14',
            dados: {
              codigo: '3.3.90.14',
              nome: 'Diárias de TFD',
              dotacao: 1350000,
              empenhado: 987430.25,
            },
          },
          {
            chave: '3.3.90.33',
            dados: {
              codigo: '3.3.90.33',
              nome: 'Passagens e locomoção',
              dotacao: 720000,
              empenhado: 604880.9,
            },
          },
          {
            chave: '3.3.90.39',
            dados: {
              codigo: '3.3.90.39',
              nome: 'Serviços de terceiros, pessoa jurídica',
              dotacao: 2110000,
              empenhado: 1488220.7,
            },
          },
        ],
      },
    ],
  },
  {
    chave: '4',
    dados: { codigo: '4', nome: 'Despesas de capital' },
    filhos: [
      {
        chave: '4.4',
        dados: { codigo: '4.4', nome: 'Investimentos' },
        filhos: [
          {
            chave: '4.4.90.52',
            dados: {
              codigo: '4.4.90.52',
              nome: 'Equipamentos e material permanente',
              dotacao: 1580000,
              empenhado: 726400,
            },
          },
          {
            chave: '4.4.90.51',
            dados: {
              codigo: '4.4.90.51',
              nome: 'Obras e instalações',
              dotacao: 2400000,
              empenhado: 1120000,
            },
          },
        ],
      },
    ],
  },
];

const reais = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const totalGeral = (metrica: (conta: Conta) => number) =>
  PLANO_DE_CONTAS.reduce((total, no) => total + somarSubarvore(no, metrica), 0);

const dotacaoDe = (conta: Conta) => conta.dotacao ?? 0;
const empenhadoDe = (conta: Conta) => conta.empenhado ?? 0;

const COLUNAS: ColunaDaArvore<Conta>[] = [
  {
    chave: 'conta',
    cabecalho: 'Natureza da despesa',
    ordenavel: true,
    valorDeOrdenacao: (conta) => conta.codigo,
    render: (conta) => (
      <span>
        <strong className="citie-treetable__codigo">{conta.codigo}</strong> {conta.nome}
      </span>
    ),
    rodape: 'Total do exercício',
  },
  {
    chave: 'dotacao',
    cabecalho: 'Dotação atualizada',
    alinhamento: 'direita',
    ordenavel: true,
    largura: '190px',
    valorDeOrdenacao: dotacaoDe,
    render: (_conta, no) => reais(somarSubarvore(no, dotacaoDe)),
    rodape: reais(totalGeral(dotacaoDe)),
  },
  {
    chave: 'empenhado',
    cabecalho: 'Empenhado',
    alinhamento: 'direita',
    largura: '190px',
    render: (_conta, no) => reais(somarSubarvore(no, empenhadoDe)),
    rodape: reais(totalGeral(empenhadoDe)),
  },
  {
    chave: 'saldo',
    cabecalho: 'Saldo a empenhar',
    alinhamento: 'direita',
    largura: '190px',
    render: (_conta, no) => reais(somarSubarvore(no, dotacaoDe) - somarSubarvore(no, empenhadoDe)),
    rodape: reais(totalGeral(dotacaoDe) - totalGeral(empenhadoDe)),
  },
];

// Estrutura de lotação: o mesmo componente com outra hierarquia e outro total.
interface Lotacao {
  nome: string;
  sigla: string;
  servidores?: number;
}

const LOTACOES: NoDaTreeTable<Lotacao>[] = [
  {
    chave: 'ses',
    dados: { nome: 'Secretaria de Estado da Saúde', sigla: 'SES' },
    filhos: [
      {
        chave: 'ses-tfd',
        dados: { nome: 'Superintendência de TFD', sigla: 'SES/TFD' },
        filhos: [
          {
            chave: 'ses-tfd-autorizacao',
            dados: { nome: 'Núcleo de Autorização', sigla: 'SES/TFD/NAU', servidores: 12 },
          },
          {
            chave: 'ses-tfd-pagamento',
            dados: { nome: 'Núcleo de Pagamento de Diárias', sigla: 'SES/TFD/NPD', servidores: 7 },
          },
        ],
      },
      {
        chave: 'ses-gestao',
        dados: { nome: 'Superintendência de Gestão de Pessoas', sigla: 'SES/SGP', servidores: 23 },
      },
    ],
  },
];

const COLUNAS_LOTACAO: ColunaDaArvore<Lotacao>[] = [
  {
    chave: 'unidade',
    cabecalho: 'Unidade administrativa',
    render: (lotacao) => lotacao.nome,
  },
  { chave: 'sigla', cabecalho: 'Sigla', largura: '180px', render: (lotacao) => lotacao.sigla },
  {
    chave: 'servidores',
    cabecalho: 'Servidores lotados',
    alinhamento: 'direita',
    largura: '180px',
    render: (_lotacao, no) => somarSubarvore(no, (dados) => dados.servidores ?? 0),
  },
];

const meta = {
  title: 'Organismos/Tabelas/TreeTable',
  component: TreeTable,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Tabela hierárquica: cada linha expande revelando as filhas, com recuo de 16px (`spacing.4`) por nível e total agregado no nó pai. Página do Figma CitieOne `❖ TreeTable` (`6738:49729`); variantes cobertas: Size (Default e Small, mapeados para as densidades de 48px e 36px da marca), Grid Lines, Sortable com Sort Order, Selection em cascata, treetable-node-toggle-button, treetable-header e treetable-footer. Equivalente PrimeNG: `p-treetable`.',
          '',
          '**A `Table` é o padrão do sistema para exibir conjunto de registros.** A TreeTable é',
          'exceção, para o caso em que as linhas têm relação de pai e filho e o pai só faz sentido',
          'como soma dos filhos: plano de contas da despesa, estrutura orçamentária, secretaria com',
          'suas unidades. O ganho é poder conferir o total do grupo e abrir só o ramo que interessa,',
          'sem perder as colunas de vista.',
          '',
          '**Quando não usar:**',
          '',
          '- **As linhas são todas do mesmo nível.** Uma TreeTable sem filhos entrega uma coluna de',
          '  botões de expandir que nunca abrem nada, e cada um deles ainda é uma parada a mais na',
          '  navegação por teclado: use a `Table`.',
          '- **Os itens têm um rótulo só e nenhum atributo a comparar** (estrutura organizacional',
          '  pura). As colunas ficam vazias e a grade só gasta largura: use a `Tree`.',
          '- **A escolha vai virar valor de um campo do formulário**: use o `TreeSelect`.',
          '- **O que se quer é a proporção entre as partes de um total** (quanto cada grupo de',
          '  despesa representa), sem precisar do valor exato linha a linha: use o `DonutChart` ou o',
          '  `BarChart`, e deixe a TreeTable para a conferência.',
          '- **O usuário precisa procurar um registro específico dentro da estrutura.** A TreeTable',
          '  não filtra, e o item procurado pode estar num ramo fechado que ninguém sabe abrir:',
          '  ofereça `FilterBar` mais `Table` do resultado plano, com o caminho do nó em uma coluna.',
          '',
          'Limites reais da implementação: a ordenação reordena os irmãos dentro de cada pai, então',
          'ela nunca produz um ranking geral atravessando os níveis; o rodapé de totais vem de',
          '`coluna.rodape`, calculado por quem monta a tela (o helper `somarSubarvore` está',
          'exportado para isso); e todos os nós recebidos são renderizados, sem carregamento sob',
          'demanda.',
          '',
          '**Profundidade: o limite, medido.** O recuo custa `spacing.4` por nível, e o preço só',
          'aparece quando a coluna não tem folga. Medida a largura restante do rótulo numa coluna',
          'de 320px, que é o que a primeira coluna vira a 200% de zoom (exigência do e-MAG) num',
          'monitor de 1366px: **288px no nível 1, 272 no 2, 256 no 3, 240 no 4, 224 no 5, 208 no 6,',
          '192 no 7 e 176 no 8**, ou seja, 16px a menos por nível e 5,6% da coluna. Numa coluna de 640px',
          'o rótulo bate no teto de `--citie-largura-maxima-da-celula` e a profundidade não custa',
          'nada. **O limite prático é 5 níveis**: abaixo disso o rótulo cai de 224px e o código da',
          'conta passa a truncar. Estruturas mais fundas pedem uma tela por camada, com',
          '`Breadcrumb` marcando o caminho.',
          '',
          '**A profundidade não depende de medir o recuo a olho.** A escada de peso para no nível 2,',
          'então do terceiro em diante todas as linhas ficam com o mesmo peso e a mesma cor. Um',
          'fio vertical por ancestral é desenhado dentro da faixa que o recuo já reservou, e ele',
          'torna a profundidade contável: três fios é nível 4. Custa zero de largura e sobrevive ao',
          'zoom. Para quem usa leitor de tela, a profundidade continua vindo do `aria-level`.',
        ].join('\n'),
      },
    },
  },
  args: {
    legenda: 'Plano de contas da despesa 2025, 2 grupos',
    colunas: COLUNAS,
    nos: PLANO_DE_CONTAS,
    rotuloDoNo: (conta: Conta) => `a conta ${conta.codigo}`,
    expandidosIniciais: ['3'],
    zebra: false,
  },
} satisfies Meta<typeof TreeTable<Conta>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confortavel: Story = {
  name: 'Densidade · confortável (48px)',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const arvore = canvas.getByRole('treegrid', {
      name: 'Plano de contas da despesa 2025, 2 grupos',
    });
    await expect(arvore).toBeVisible();

    // O grupo 3 abre com dois filhos; o grupo 4 continua fechado.
    const raiz = canvas.getByRole('row', { name: /3 Despesas correntes/ });
    await expect(raiz).toHaveAttribute('aria-expanded', 'true');
    await expect(raiz).toHaveAttribute('aria-level', '1');
    await expect(raiz).toHaveAttribute('aria-posinset', '1');
    await expect(raiz).toHaveAttribute('aria-setsize', '2');

    const filha = canvas.getByRole('row', { name: /3\.1 Pessoal e encargos sociais/ });
    await expect(filha).toHaveAttribute('aria-level', '2');
    await conferirRegua(canvasElement, 48);

    /*
     * O fio de hierarquia é contínuo, e não uma coluna de traços.
     *
     * Medido antes desta guarda existir: o elemento pintado media 24,00px
     * dentro de uma linha de 49,00px, então a tela mostrava traços com vão de
     * 25px. A convenção de árvore de arquivo que este trilho invoca é contínua,
     * e traço interrompido a cada linha obriga o olho a reconstruir a ligação
     * que o fio existe para dar pronta.
     *
     * A tolerância de 1,5px cobre o fio separador da própria linha, que é
     * justamente o que emenda uma célula na seguinte.
     */
    const trilhos = canvasElement.querySelectorAll('.citie-treetable__conteudo--hierarquia');
    await expect(trilhos.length).toBeGreaterThan(0);

    for (const trilho of trilhos) {
      const celula = trilho.closest('td');
      const alturaDoFio = trilho.getBoundingClientRect().height;
      const alturaDaCelula = celula!.getBoundingClientRect().height;
      await expect(alturaDaCelula - alturaDoFio).toBeLessThanOrEqual(1.5);
    }
  },
};

/**
 * Régua vertical, a mesma da `Table`: toda linha mede o mesmo, e a medida é
 * inteira. Altura fracionária desloca a base do texto de todas as linhas abaixo
 * por frações de pixel, e é o que o fio dividido entre vizinhas produzia.
 */
async function conferirRegua(canvasElement: HTMLElement, alturaEsperada: number) {
  const linhas = Array.from(canvasElement.querySelectorAll('tbody tr'));
  const cabecalho = canvasElement.querySelector('thead tr') as HTMLElement;
  for (const linha of [cabecalho, ...linhas]) {
    const altura = linha.getBoundingClientRect().height;
    await expect(Number.isInteger(altura)).toBe(true);
    await expect(altura).toBe(alturaEsperada + 1);
  }
}

export const Compacta: Story = {
  name: 'Densidade · compacta (36px)',
  args: { densidade: 'compacta' },
  play: async ({ canvasElement }) => {
    await conferirRegua(canvasElement, 36);
  },
};

export const Expansao: Story = {
  name: 'Comportamento · expandir e recolher',
  args: { expandidosIniciais: [] },
  parameters: {
    docs: {
      description: {
        story:
          'Fechada, a tabela mostra só o primeiro nível. O botão de expandir gira o chevron e a linha passa a declarar `aria-expanded="true"`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('row')).toHaveLength(3); // cabeçalho + 2 grupos

    await userEvent.click(canvas.getByRole('button', { name: 'Expandir a conta 3' }));
    await expect(canvas.getByRole('row', { name: /3 Despesas correntes/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(canvas.getAllByRole('row')).toHaveLength(5);

    await userEvent.click(canvas.getByRole('button', { name: 'Recolher a conta 3' }));
    await expect(canvas.getAllByRole('row')).toHaveLength(3);
  },
};

export const Teclado: Story = {
  name: 'Comportamento · navegação por teclado',
  args: { expandidosIniciais: [] },
  parameters: {
    docs: {
      description: {
        story:
          'A linha é o alvo do foco, como manda o padrão treegrid. Setas para baixo e para cima percorrem as linhas visíveis, seta direita abre o nó e seta esquerda fecha ou sobe para o pai.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const primeira = canvas.getByRole('row', { name: /3 Despesas correntes/ });

    primeira.focus();
    await expect(primeira).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(primeira).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('row', { name: /3\.1 Pessoal e encargos sociais/ })).toHaveFocus();

    // Sem filhos abertos, a seta esquerda devolve o foco ao pai.
    await userEvent.keyboard('{ArrowLeft}');
    await expect(primeira).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    await expect(primeira).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Selecao: Story = {
  name: 'Estado · seleção em cascata',
  args: { selecionavel: true, expandidosIniciais: ['3', '3.1'] },
  parameters: {
    docs: {
      description: {
        story:
          'Marcar um nó marca toda a subárvore. Com parte dos filhos marcados o pai fica em estado parcial, nunca em branco.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Selecionar a conta 3.1' }));
    await expect(canvas.getByRole('checkbox', { name: 'Selecionar a conta 3.1.90.11' })).toBeChecked();
    await expect(canvas.getByRole('checkbox', { name: 'Selecionar a conta 3.1.90.13' })).toBeChecked();

    // O grupo 3 tem a subárvore 3.3 fora da seleção: fica parcial.
    const grupo = canvas.getByRole('checkbox', { name: 'Selecionar a conta 3' });
    await expect(grupo).not.toBeChecked();
    await expect(grupo).toBePartiallyChecked();
  },
};

export const SelecaoNaLinhaPar: Story = {
  name: 'Estado · seleção na linha par da zebra',
  args: { selecionavel: true, zebra: true, expandidosIniciais: ['3', '3.1'] },
  parameters: {
    docs: {
      description: {
        story: [
          'A `TreeTable` pinta o fundo da linha com a mesma propriedade da `Table`, e por isso',
          'herdava o mesmo defeito: a zebra vencia a seleção por especificidade e a linha par',
          'selecionada ficava com a faixa da zebra. A ordem entre as duas é declarada por camada,',
          'com os mesmos nomes usados na `Table`.',
          '',
          'A seleção em cascata desta story marca linhas nas duas paridades de uma vez, então a',
          'medição abaixo cobre as duas sem depender de qual índice caiu em qual lugar.',
        ].join('\n'),
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const fundo = (linha: Element) =>
      getComputedStyle(linha.querySelector('td') as HTMLElement).backgroundColor;

    const linhas = Array.from(canvasElement.querySelectorAll('tbody tr'));
    // A zebra separa as paridades em repouso: é o que dá à medição poder de reprovar.
    const zebrada = fundo(linhas[1]);
    await expect(zebrada).not.toBe(fundo(linhas[0]));

    await userEvent.click(canvas.getByRole('checkbox', { name: 'Selecionar a conta 3.1' }));

    await waitFor(async () => {
      const selecionadas = linhas.filter((linha) =>
        linha.classList.contains('citie-treetable__linha--selecionada'),
      );
      // A cascata marca linha par e linha ímpar de uma vez.
      await expect(selecionadas.length).toBeGreaterThan(1);
      const pares = selecionadas.filter((linha) => linhas.indexOf(linha) % 2 === 1);
      await expect(pares.length).toBeGreaterThan(0);

      // Toda linha selecionada pinta a mesma cor, e nenhuma delas fica na cor da zebra.
      const cores = new Set(selecionadas.map(fundo));
      await expect(cores.size).toBe(1);
      await expect(cores.has(zebrada)).toBe(false);
    });
  },
};

export const Ordenacao: Story = {
  name: 'Estado · ordenação',
  parameters: {
    docs: {
      description: {
        story:
          'A ordenação reordena os irmãos dentro de cada nível e preserva a hierarquia: uma conta filha nunca sobe para junto das raízes.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cabecalho = canvas.getByRole('columnheader', { name: /Dotação atualizada/ });

    await expect(cabecalho).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(within(cabecalho).getByRole('button'));
    await expect(cabecalho).toHaveAttribute('aria-sort', 'ascending');

    await userEvent.click(within(cabecalho).getByRole('button'));
    await expect(cabecalho).toHaveAttribute('aria-sort', 'descending');
    await expect(canvas.getAllByRole('row')[1]).toHaveAttribute('aria-level', '1');
  },
};

export const LinhasDeGrade: Story = {
  name: 'Variante · linhas de grade e rodapé de total',
  args: {
    linhasDeGrade: true,
    zebra: true,
    comRodape: true,
    titulo: 'Execução orçamentária · exercício 2025',
    expandidosIniciais: ['3', '3.3'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Grid Lines do Figma com a faixa de título (treetable-header) e a linha de total (treetable-footer). O total geral soma as folhas, não as linhas visíveis.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Total do exercício')).toBeVisible();
    // O separador de milhar do pt-BR usa espaço rígido depois do R$; casa por padrão.
    await expect(canvas.getByText(/13\.944\.000,00/)).toBeVisible();
  },
};

export const HeaderFixo: Story = {
  name: 'Variante · header fixo',
  args: { headerFixo: true, zebra: true, expandidosIniciais: ['3', '3.1', '3.3', '4', '4.4'] },
  parameters: {
    docs: {
      description: {
        story: 'Com a árvore toda aberta o cabeçalho gruda no topo da área rolável.',
      },
    },
  },
};

export const Lotacao: StoryObj<typeof TreeTable<Lotacao>> = {
  name: 'Conteúdo · estrutura de lotação',
  args: {
    legenda: 'Estrutura de lotação da SES, 1 secretaria',
    colunas: COLUNAS_LOTACAO,
    nos: LOTACOES,
    rotuloDoNo: (lotacao: Lotacao) => lotacao.sigla,
    expandidosIniciais: ['ses', 'ses-tfd'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Mesma tabela com outra hierarquia: a unidade pai mostra a soma dos servidores lotados nas unidades abaixo dela.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // 12 + 7 nos núcleos e 23 na SGP fecham 42 na secretaria.
    await expect(canvas.getByRole('row', { name: /Secretaria de Estado da Saúde/ })).toHaveTextContent(
      '42',
    );
  },
};

export const Carregando: Story = {
  name: 'Estado · carregando',
  args: { carregando: true },
  parameters: {
    docs: {
      description: {
        story: 'Skeleton no corpo, cabeçalho real e legível. Nunca spinner sobre a tabela.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('treegrid')).toHaveAttribute('aria-busy', 'true');
    await expect(canvas.getByRole('columnheader', { name: /Natureza da despesa/ })).toBeVisible();
  },
};

export const SemConteudo: Story = {
  name: 'Estado · vazio no primeiro uso',
  args: {
    legenda: 'Plano de contas da despesa 2025, 0 grupos',
    nos: [],
    semConteudo: (
      <EmptyState
        size="md"
        titulo="Nenhuma natureza de despesa cadastrada"
        descricao="Importe o plano de contas do exercício para acompanhar a execução por aqui."
        acaoPrimaria={{ rotulo: 'Importar plano de contas' }}
      />
    ),
  },
};
