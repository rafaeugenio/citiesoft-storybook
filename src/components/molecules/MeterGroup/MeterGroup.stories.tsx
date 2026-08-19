import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { PALETA_PROPOSTA } from '../../organisms/Chart/Chart';
import { MeterGroup } from './MeterGroup';

const PROCESSOS = [
  { rotulo: 'Em análise', valor: 412 },
  { rotulo: 'Aguardando documento', valor: 268 },
  { rotulo: 'Deferido', valor: 731 },
  { rotulo: 'Indeferido', valor: 149 },
];

const DESPESAS = [
  { rotulo: 'Pessoal e encargos', valor: 4820000 },
  { rotulo: 'Custeio', valor: 1960000 },
  { rotulo: 'Investimento', valor: 740000 },
  { rotulo: 'Diárias e passagens', valor: 185000 },
];

const formatarReal = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

/** Ícones da variante `Icon` do part `metergroup-indicator`. */
const IconePasta = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <path d="M2 4.5A1.5 1.5 0 0 1 3.5 3h2.3l1.2 1.5h5.5A1.5 1.5 0 0 1 14 6v6a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 12z" />
  </svg>
);

const IconeRelogio = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="8" cy="8" r="6" />
    <path d="M8 4.5V8l2.5 1.5" />
  </svg>
);

const IconeCheck = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="8" cy="8" r="6" />
    <path d="m5.5 8 1.8 1.8 3.2-3.6" />
  </svg>
);

const IconeBloqueio = (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
    <circle cx="8" cy="8" r="6" />
    <path d="m5.5 5.5 5 5" />
  </svg>
);

const meta = {
  title: 'Moléculas/Visualização/MeterGroup',
  component: MeterGroup,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Barra de distribuição proporcional com legenda: mostra a composição de um total.',
          'Equivalente PrimeNG: `p-metergroup`. Figma CitieOne, página `6738:55111`, com as',
          'variantes `Type` (Basic · Multiple), `Orientation` (Horizontal · Vertical),',
          '`Label Position` (End · Start), `Label Orientation` (Horizontal · Vertical) e o part',
          '`metergroup-indicator` (`Type`: Marker · Icon).',
          '',
          '**Cor.** As faixas são séries categóricas, então a cor sai da paleta categórica já',
          'definida em `Chart.tsx`, nunca de valor inventado. O default é a `PALETA_OFICIAL` da',
          'spec `charts-data-viz.md`, mas o achado registrado no Chart vale aqui igual: **a paleta',
          'oficial reprova a validação de daltonismo** (as faixas 3 e 4, verde `#22c55e` e âmbar',
          '`#f59e0b`, colapsam sob deuteranopia e protanopia, e o par 1/2 fica ambíguo sob',
          'tritanopia). A `PALETA_PROPOSTA`, de 6 cores, passa em todas as simulações e está',
          'disponível pela prop `paleta`.',
          '',
          '**Acessibilidade.** A barra é `aria-hidden`; quem carrega a informação é a legenda em',
          'texto, com rótulo, valor absoluto e percentual de cada faixa. O grupo é nomeado pelo',
          'título e o total aparece escrito, então nada depende de cor nem do desenho. Faixa de',
          'fração mínima tem largura mínima de 4px para não sumir do trilho.',
        ].join(' '),
      },
    },
  },
  args: {
    titulo: 'Processos de TFD por situação',
    faixas: PROCESSOS,
    unidade: 'processos',
  },
} satisfies Meta<typeof MeterGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Multiplo: Story = {
  name: 'Variante · multiple',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Cada faixa aparece com rótulo e valor em texto: cor sozinha não identifica nada.
    await expect(canvas.getByText('Em análise')).toBeVisible();
    await expect(canvas.getByText('268 processos (17,2%)')).toBeVisible();
    await expect(canvas.getByText('1.560 processos no total')).toBeVisible();
  },
};

export const Basico: Story = {
  name: 'Variante · basic',
  args: {
    titulo: 'Cota anual de diárias consumida',
    faixas: [{ rotulo: 'Diárias autorizadas', valor: 186 }],
    total: 1200,
    unidade: 'diárias',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uma única faixa contra um total conhecido: a sobra do trilho é o saldo. Com `total` informado o percentual passa a ser da cota, não da soma das faixas.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('186 diárias (15,5%)')).toBeVisible();
  },
};

export const LegendaVertical: Story = {
  name: 'Legenda · orientação vertical',
  args: {
    titulo: 'Execução orçamentária por natureza de despesa',
    faixas: DESPESAS,
    orientacaoDaLegenda: 'vertical',
    unidade: undefined,
    formatar: formatarReal,
  },
};

export const LegendaAntes: Story = {
  name: 'Legenda · posição start',
  args: {
    posicaoDaLegenda: 'antes',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Variante `Label Position: Start` do Figma: a legenda vem antes do trilho, para quando a leitura começa pelo texto.',
      },
    },
  },
};

export const BarraVertical: Story = {
  name: 'Orientação · vertical',
  args: {
    titulo: 'Execução orçamentária por natureza de despesa',
    faixas: DESPESAS,
    orientacao: 'vertical',
    orientacaoDaLegenda: 'vertical',
    unidade: undefined,
    formatar: formatarReal,
  },
};

export const IndicadorIcone: Story = {
  name: 'Indicador · ícone',
  args: {
    indicador: 'icone',
    faixas: [
      { ...PROCESSOS[0], icone: IconeRelogio },
      { ...PROCESSOS[1], icone: IconePasta },
      { ...PROCESSOS[2], icone: IconeCheck },
      { ...PROCESSOS[3], icone: IconeBloqueio },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Part `metergroup-indicator` na variante `Icon`. O ícone é decorativo (`aria-hidden`) porque o rótulo em texto vem logo ao lado; ele reforça a identidade da faixa sem depender de cor.',
      },
    },
  },
};

export const PaletaProposta: Story = {
  name: 'Paleta · proposta acessível',
  args: {
    paleta: PALETA_PROPOSTA,
  },
  parameters: {
    docs: {
      description: {
        story:
          'A paleta oficial da spec reprova a validação de daltonismo: verde e âmbar colapsam sob deuteranopia e protanopia. A `PALETA_PROPOSTA` de 6 cores passa em todas as simulações e é a recomendação para tela com mais de duas faixas.',
      },
    },
  },
};

export const FaixaMinima: Story = {
  name: 'Borda · faixa muito estreita',
  args: {
    titulo: 'Processos de TFD por situação',
    faixas: [
      { rotulo: 'Deferido', valor: 2840 },
      { rotulo: 'Em análise', valor: 96 },
      { rotulo: 'Indeferido', valor: 12 },
      { rotulo: 'Cancelado por óbito', valor: 3 },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Faixa de 0,1% continua visível: a largura mínima de 4px impede que uma situação rara desapareça do trilho, e o valor exato está sempre na legenda.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('3 processos (0,1%)')).toBeVisible();
  },
};

export const Vazio: Story = {
  name: 'Estado · vazio',
  args: {
    faixas: [],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByText('Nenhum registro encontrado para o período selecionado'),
    ).toBeVisible();
    await expect(canvas.getByText('Sem dados')).toBeVisible();
  },
};
