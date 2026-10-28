import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ComboChartCard,
  type ComboPoint,
  type ComboRange,
  type ComboSeries,
} from '@/components/application/charts/combo-chart-card';

type ComboChartProps = NonNullable<Parameters<typeof ComboChartCard>[0]>;

const meta = {
  title: 'Charts/ComboChartCard',
  component: ComboChartCard as ComponentType<ComboChartProps>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Barras (eixo esquerdo) mais linha (eixo direito) no mesmo cartão: volume e taxa, como receita e margem. Cada série tem seu próprio formato. Ao passar o mouse, a barra escurece, as demais esmaecem e o título passa a nomear a categoria.',
      },
    },
  },
  argTypes: {
    tiles: { control: 'boolean' },
    headlineFrom: { control: 'inline-radio', options: ['bar', 'line'] },
    title: { control: 'text' },
    range: { control: 'text' },
    delta: { control: 'number' },
    headline: { control: 'number' },
  },
} satisfies Meta<ComboChartProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const linhas = (receita: number[], margem: number[], meses = MESES): ComboPoint[] =>
  meses.map((label, i) => ({ label, receita: receita[i], margem: margem[i] }));

const dadosAnual = linhas(
  [182000, 196000, 214000, 205000, 238000, 261000, 249000, 277000, 296000, 288000, 322000, 351000],
  [18.2, 19.1, 20.4, 19.6, 21.8, 22.9, 21.7, 23.5, 24.1, 23.2, 25.0, 26.3],
);

const reais = (n: number) => `R$ ${n.toLocaleString('pt-BR')}`;
const reaisCompacto = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)} mil` : String(n));
const percentual = (n: number) => `${(Math.round(n * 10) / 10).toLocaleString('pt-BR')}%`;

const barra: ComboSeries = {
  key: 'receita',
  label: 'Receita',
  format: reais,
  axisFormat: reaisCompacto,
};

const linha: ComboSeries = {
  key: 'margem',
  label: 'Margem',
  color: 'var(--color-chart-6)',
  activeColor: 'var(--color-chart-6-active)',
  format: percentual,
};

const base = {
  title: 'Receita e margem',
  data: dadosAnual,
  bar: barra,
  line: linha,
  delta: 0.094,
  range: 'Jan a Dez de 2026',
} satisfies Partial<ComboChartProps>;

const periodos: ComboRange[] = [
  { id: 'ano', label: 'Este ano', data: dadosAnual, delta: 0.094 },
  {
    id: 'semestre',
    label: 'Últimos 6 meses',
    data: linhas(
      [249000, 277000, 296000, 288000, 322000, 351000],
      [21.7, 23.5, 24.1, 23.2, 25.0, 26.3],
      MESES.slice(6),
    ),
    delta: 0.121,
  },
  {
    id: 'anterior',
    label: 'Ano passado',
    data: linhas(
      [151000, 163000, 177000, 169000, 192000, 205000, 198000, 221000, 236000, 229000, 254000, 272000],
      [15.1, 16.0, 16.8, 16.2, 17.9, 18.6, 18.0, 19.4, 19.8, 19.1, 20.7, 21.5],
    ),
    delta: -0.028,
  },
];

export const Padrao: Story = {
  name: 'Padrão (barras + linha)',
  args: base,
  render: (args) => (
    <div className="w-[560px]">
      <ComboChartCard {...args} />
    </div>
  ),
};

export const ComTiles: Story = {
  name: 'Com tiles (total e média)',
  args: { ...base, tiles: true },
  render: (args) => (
    <div className="w-[560px]">
      <ComboChartCard {...args} />
    </div>
  ),
};

export const DestaqueNaLinha: Story = {
  name: 'Destaque na linha (headlineFrom)',
  args: {
    title: 'Visitas e conversão',
    headlineFrom: 'line',
    tiles: true,
    data: [
      { label: 'Jan', visitas: 41200, conversao: 2.4 },
      { label: 'Fev', visitas: 44800, conversao: 2.6 },
      { label: 'Mar', visitas: 52600, conversao: 3.1 },
      { label: 'Abr', visitas: 49200, conversao: 2.9 },
      { label: 'Mai', visitas: 58400, conversao: 3.4 },
      { label: 'Jun', visitas: 63100, conversao: 3.8 },
    ],
    bar: { key: 'visitas', label: 'Visitas', format: (n: number) => n.toLocaleString('pt-BR') },
    line: { key: 'conversao', label: 'Conversão', color: 'var(--color-chart-6)', activeColor: 'var(--color-chart-6-active)', format: percentual },
    delta: 0.062,
    range: '1º semestre de 2026',
  },
  render: (args) => (
    <div className="w-[560px]">
      <ComboChartCard {...args} />
    </div>
  ),
};

export const LegendaPersonalizada: Story = {
  name: 'Legenda personalizada (caption)',
  args: {
    ...base,
    caption: (linhaAtual) =>
      linhaAtual
        ? `${reais(Number(linhaAtual.receita))} com margem de ${percentual(Number(linhaAtual.margem))}`
        : 'Receita bruta mensal',
  },
  render: (args) => (
    <div className="w-[560px]">
      <ComboChartCard {...args} />
    </div>
  ),
};

export const ComPeriodos: Story = {
  name: 'Períodos selecionáveis',
  args: {
    title: 'Receita e margem',
    bar: barra,
    line: linha,
    ranges: periodos,
    defaultRange: 'ano',
    tiles: true,
  },
  render: (args) => (
    <div className="w-[560px]">
      <ComboChartCard {...args} />
    </div>
  ),
};

export const QuedaNoPeriodo: Story = {
  name: 'Variação negativa',
  args: { ...base, delta: -0.045, headline: 2640000 },
  render: (args) => (
    <div className="w-[560px]">
      <ComboChartCard {...args} />
    </div>
  ),
};

export const CoresPersonalizadas: Story = {
  name: 'Cores personalizadas',
  args: {
    ...base,
    bar: { ...barra, color: '#14B8A6', activeColor: '#0F8F82' },
    line: { ...linha, color: '#F59E0B', activeColor: '#C77D06' },
  },
  render: (args) => (
    <div className="w-[560px]">
      <ComboChartCard {...args} />
    </div>
  ),
};

export const DadosPadrao: Story = {
  name: 'Dados padrão embutidos',
  render: (args) => (
    <div className="w-[560px]">
      <ComboChartCard {...args} />
    </div>
  ),
};
