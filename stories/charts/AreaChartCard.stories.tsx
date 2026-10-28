import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  AreaChartCard,
  type AreaPoint,
  type AreaRange,
  type AreaSeries,
} from '@/components/application/charts/area-chart-card';

type AreaChartProps = NonNullable<Parameters<typeof AreaChartCard>[0]>;

const meta = {
  title: 'Charts/AreaChartCard',
  component: AreaChartCard as ComponentType<AreaChartProps>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gráfico de área com várias séries. A prop `variant` alterna entre empilhado, sobreposto e 100% empilhado. Ao passar o mouse sobre uma categoria, o título vira o nome dela e legenda e tiles mostram seus valores.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['stacked', 'overlap', 'percent'] },
    shape: { control: 'inline-radio', options: ['curved', 'sharp'] },
    tiles: { control: 'boolean' },
    title: { control: 'text' },
    range: { control: 'text' },
    delta: { control: 'number' },
    headline: { control: 'number' },
  },
} satisfies Meta<AreaChartProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const linhas = (loja: number[], app: number[], marketplace: number[], meses = MESES): AreaPoint[] =>
  meses.map((label, i) => ({ label, loja: loja[i], app: app[i], marketplace: marketplace[i] }));

const series: AreaSeries[] = [
  { key: 'loja', label: 'Loja física' },
  { key: 'app', label: 'Aplicativo' },
  { key: 'marketplace', label: 'Marketplace' },
];

const dadosAnual = linhas(
  [48000, 52000, 56000, 54000, 61000, 68000, 72000, 70000, 78000, 84000, 91000, 108000],
  [22000, 25000, 24000, 29000, 33000, 36000, 41000, 44000, 47000, 53000, 58000, 66000],
  [14000, 13000, 18000, 17000, 21000, 24000, 23000, 28000, 31000, 30000, 36000, 42000],
);

const dadosSemestre = linhas(
  [72000, 70000, 78000, 84000, 91000, 108000],
  [41000, 44000, 47000, 53000, 58000, 66000],
  [23000, 28000, 31000, 30000, 36000, 42000],
  MESES.slice(6),
);

const reais = (n: number) => `R$ ${n.toLocaleString('pt-BR')}`;

const periodos: AreaRange[] = [
  { id: 'ano', label: 'Este ano', data: dadosAnual, delta: 0.124 },
  { id: 'semestre', label: 'Últimos 6 meses', data: dadosSemestre, delta: 0.187 },
  {
    id: 'anterior',
    label: 'Ano passado',
    data: linhas(
      [41000, 43000, 45000, 44000, 49000, 53000, 56000, 55000, 60000, 64000, 69000, 80000],
      [12000, 14000, 15000, 17000, 19000, 21000, 24000, 26000, 28000, 31000, 34000, 39000],
      [9000, 8000, 11000, 10000, 13000, 15000, 14000, 17000, 19000, 18000, 22000, 26000],
    ),
    delta: -0.032,
  },
];

const base = {
  title: 'Receita por canal',
  data: dadosAnual,
  series,
  delta: 0.124,
  range: 'Jan a Dez de 2026',
  format: reais,
} satisfies Partial<AreaChartProps>;

export const Empilhado: Story = {
  name: 'Empilhado',
  args: { ...base, variant: 'stacked' },
  render: (args) => (
    <div className="w-[560px]">
      <AreaChartCard {...args} />
    </div>
  ),
};

export const Sobreposto: Story = {
  name: 'Sobreposto (comparação)',
  args: { ...base, variant: 'overlap' },
  render: (args) => (
    <div className="w-[560px]">
      <AreaChartCard {...args} />
    </div>
  ),
};

export const CemPorCentoEmpilhado: Story = {
  name: '100% empilhado (participação)',
  args: { ...base, variant: 'percent', title: 'Participação por canal' },
  render: (args) => (
    <div className="w-[560px]">
      <AreaChartCard {...args} />
    </div>
  ),
};

export const LinhasRetas: Story = {
  name: 'Linhas retas (shape sharp)',
  args: { ...base, shape: 'sharp' },
  render: (args) => (
    <div className="w-[560px]">
      <AreaChartCard {...args} />
    </div>
  ),
};

export const ComTiles: Story = {
  name: 'Com tiles por série',
  args: { ...base, tiles: true },
  render: (args) => (
    <div className="w-[560px]">
      <AreaChartCard {...args} />
    </div>
  ),
};

export const ComPeriodos: Story = {
  name: 'Períodos selecionáveis',
  args: {
    title: 'Receita por canal',
    series,
    ranges: periodos,
    defaultRange: 'ano',
    format: reais,
    tiles: true,
  },
  render: (args) => (
    <div className="w-[560px]">
      <AreaChartCard {...args} />
    </div>
  ),
};

export const QuedaNoPeriodo: Story = {
  name: 'Variação negativa',
  args: {
    ...base,
    title: 'Pedidos por origem',
    format: (n: number) => n.toLocaleString('pt-BR'),
    delta: -0.067,
    headline: 18420,
    range: 'Último trimestre',
  },
  render: (args) => (
    <div className="w-[560px]">
      <AreaChartCard {...args} />
    </div>
  ),
};

export const CoresPersonalizadas: Story = {
  name: 'Cores personalizadas',
  args: {
    ...base,
    series: [
      { key: 'loja', label: 'Loja física', color: '#146BFA', activeColor: '#0B4FC0' },
      { key: 'app', label: 'Aplicativo', color: '#14B8A6', activeColor: '#0F8F82' },
      { key: 'marketplace', label: 'Marketplace', color: '#F59E0B', activeColor: '#C77D06' },
    ],
  },
  render: (args) => (
    <div className="w-[560px]">
      <AreaChartCard {...args} />
    </div>
  ),
};

export const DadosPadrao: Story = {
  name: 'Dados padrão embutidos',
  render: (args) => (
    <div className="w-[560px]">
      <AreaChartCard {...args} />
    </div>
  ),
};
