import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  ScatterChartCard,
  type ScatterChartCardProps,
  type ScatterRange,
  type ScatterSeries,
} from '@/components/application/charts/scatter-chart-card';

const meta = {
  title: 'Charts/ScatterChartCard',
  component: ScatterChartCard as ComponentType<ScatterChartCardProps>,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    bubble: { control: 'boolean' },
    tiles: { control: 'boolean' },
    title: { control: 'text' },
  },
  render: (args) => (
    <div className="w-[560px]">
      <ScatterChartCard {...args} />
    </div>
  ),
} satisfies Meta<ScatterChartCardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const reais = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const meses = (n: number) => `${Math.round(n)} m`;

const porPorte: ScatterSeries[] = [
  {
    label: 'Pequeno porte',
    points: [
      { x: 6, y: 1800, z: 20, label: 'Padaria Aurora' },
      { x: 10, y: 2400, z: 35, label: 'Mercado Bom Preço' },
      { x: 14, y: 2100, z: 25, label: 'Papelaria Central' },
      { x: 18, y: 3200, z: 40, label: 'Café do Largo' },
      { x: 22, y: 2900, z: 30, label: 'Ótica Visão' },
    ],
  },
  {
    label: 'Médio porte',
    points: [
      { x: 24, y: 6200, z: 80, label: 'Rede Farmavida' },
      { x: 30, y: 7400, z: 110, label: 'Construtora Alicerce' },
      { x: 36, y: 6900, z: 70, label: 'Clínica Saúde Plena' },
      { x: 42, y: 8800, z: 130, label: 'Grupo Vale Verde' },
      { x: 48, y: 8100, z: 95, label: 'Transportes Rota Sul' },
    ],
  },
  {
    label: 'Grande porte',
    points: [
      { x: 50, y: 12400, z: 180, label: 'Atacadão Nordeste' },
      { x: 58, y: 14200, z: 220, label: 'Indústrias Horizonte' },
      { x: 66, y: 13100, z: 160, label: 'Hospital São Lucas' },
      { x: 72, y: 15800, z: 260, label: 'Grupo Litoral' },
    ],
  },
];

const semTamanho: ScatterSeries[] = porPorte.map((s) => ({
  ...s,
  points: s.points.map(({ z: _z, ...p }) => p),
}));

const escalar = (series: ScatterSeries[], f: number): ScatterSeries[] =>
  series.map((s) => ({ ...s, points: s.points.map((p) => ({ ...p, y: Math.round(p.y * f) })) }));

const periodos: ScatterRange[] = [
  { id: 'tri', label: 'Este trimestre', series: porPorte, delta: 0.068 },
  { id: 'tri-ant', label: 'Trimestre passado', series: escalar(porPorte, 0.82), delta: 0.041 },
  { id: 'ano', label: 'Este ano', series: escalar(porPorte, 3.6), delta: -0.019 },
];

export const Padrao: Story = {
  name: 'Dados padrão (com períodos)',
  args: {},
};

export const Bolhas: Story = {
  name: 'Bolhas (tamanho por z)',
  args: {
    title: 'Receita por cliente',
    series: porPorte,
    format: reais,
    formatX: meses,
    axisLabels: ['Tempo de contrato (meses)', 'Receita mensal (R$)'],
    range: 'Este trimestre',
    delta: 0.068,
  },
};

export const PontosSimples: Story = {
  name: 'Pontos simples (sem z)',
  args: {
    title: 'Receita por cliente',
    series: semTamanho,
    format: reais,
    formatX: meses,
    axisLabels: ['Tempo de contrato (meses)', 'Receita mensal (R$)'],
    range: 'Este trimestre',
  },
};

export const BolhasForcadasDesligadas: Story = {
  name: 'Bolhas desligadas à força',
  args: {
    title: 'Receita por cliente',
    series: porPorte,
    bubble: false,
    format: reais,
    formatX: meses,
    range: 'Este trimestre',
  },
};

export const ComSeletorDePeriodo: Story = {
  name: 'Seletor de período',
  args: {
    title: 'Receita por cliente',
    ranges: periodos,
    defaultRange: 'tri',
    format: reais,
    formatX: meses,
    axisLabels: ['Tempo de contrato (meses)', 'Receita mensal (R$)'],
  },
};

export const ComBlocosDeEstatistica: Story = {
  name: 'Blocos de estatística',
  args: {
    title: 'Receita por cliente',
    series: porPorte,
    format: reais,
    formatX: meses,
    tiles: true,
    range: 'Este trimestre',
    delta: 0.068,
  },
};

export const UmaSerie: Story = {
  name: 'Uma única série',
  args: {
    title: 'Tempo de espera x satisfação',
    series: [
      {
        label: 'Unidades de saúde',
        points: [
          { x: 8, y: 92, label: 'UBS Centro' },
          { x: 15, y: 88, label: 'UBS Norte' },
          { x: 22, y: 81, label: 'UBS Sul' },
          { x: 31, y: 74, label: 'UPA Leste' },
          { x: 40, y: 66, label: 'UPA Oeste' },
          { x: 52, y: 58, label: 'Pronto-socorro' },
        ],
      },
    ],
    format: (n: number) => `${n}%`,
    formatX: (n: number) => `${n} min`,
    axisLabels: ['Tempo de espera (minutos)', 'Satisfação (%)'],
    range: 'Outubro de 2026',
  },
};
