import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  HeatmapChartCard,
  type HeatmapChartCardProps,
  type HeatmapRange,
  type HeatmapRow,
} from '@/components/application/charts/heatmap-chart-card';

const meta = {
  title: 'Charts/HeatmapChartCard',
  component: HeatmapChartCard as ComponentType<HeatmapChartCardProps>,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    title: { control: 'text' },
    color: { control: 'color' },
    activeColor: { control: 'color' },
    max: { control: 'number' },
    headline: { control: 'number' },
    delta: { control: { type: 'number', step: 0.001 } },
    range: { control: 'text' },
    columnLabelEvery: { control: { type: 'number', min: 1, max: 6 } },
    rows: { control: false },
    columns: { control: false },
    ranges: { control: false },
    format: { control: false },
    className: { control: false },
  },
  render: (args) => (
    <div className="w-[560px]">
      <HeatmapChartCard {...args} />
    </div>
  ),
} satisfies Meta<HeatmapChartCardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

const atendimentosPorRegiao: HeatmapRow[] = [
  { label: 'Norte', values: [120, 135, 150, 142, 160, 148, 130, 125, 158, 172, 165, 140] },
  { label: 'Nordeste', values: [310, 295, 340, 365, 380, 352, 330, 345, 372, 398, 410, 360] },
  { label: 'Centro-Oeste', values: [140, 150, 162, 158, 170, 166, 152, 148, 175, 181, 177, 160] },
  { label: 'Sudeste', values: [520, 498, 545, 570, 590, 565, 540, 552, 598, 620, 634, 580] },
  { label: 'Sul', values: [260, 248, 270, 285, 301, 290, 272, 278, 305, 318, 322, 296] },
];

const diasSemana = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const horas = ['08h', '10h', '12h', '14h', '16h', '18h', '20h'];

const acessosPorHorario: HeatmapRow[] = [
  { label: diasSemana[0], values: [34, 52, 38, 55, 48, 30, 14] },
  { label: diasSemana[1], values: [36, 56, 40, 60, 51, 32, 15] },
  { label: diasSemana[2], values: [35, 54, 42, 58, 50, 31, 13] },
  { label: diasSemana[3], values: [38, 58, 44, 62, 53, 34, 16] },
  { label: diasSemana[4], values: [30, 46, 34, 44, 36, 22, 12] },
  { label: diasSemana[5], values: [10, 18, 22, 24, 20, 16, 11] },
  { label: diasSemana[6], values: [6, 12, 16, 18, 15, 13, 9] },
];

export const Padrao: Story = {
  name: 'Padrão (dados embutidos)',
};

export const AtendimentosPorRegiao: Story = {
  args: {
    title: 'Atendimentos por região',
    rows: atendimentosPorRegiao,
    columns: meses,
    delta: 0.074,
    range: 'Ano de 2026',
  },
};

export const AcessosPorHorario: Story = {
  args: {
    title: 'Acessos ao portal',
    rows: acessosPorHorario,
    columns: horas,
    delta: 0.032,
    range: 'Últimos 7 dias',
  },
};

export const CorPersonalizada: Story = {
  args: {
    title: 'Acessos ao portal',
    rows: acessosPorHorario,
    columns: horas,
    color: '#10b981',
    activeColor: '#059669',
    delta: 0.032,
    range: 'Últimos 7 dias',
  },
};

export const MaximoFixo: Story = {
  name: 'Máximo fixo (escala comum)',
  args: {
    title: 'Acessos ao portal',
    rows: acessosPorHorario,
    columns: horas,
    max: 120,
    delta: -0.018,
    range: 'Últimos 7 dias',
  },
};

export const RotulosEspacados: Story = {
  name: 'Rótulos de coluna espaçados',
  args: {
    title: 'Atendimentos por região',
    rows: atendimentosPorRegiao,
    columns: meses,
    columnLabelEvery: 3,
    headline: 18420,
    delta: 0.074,
    range: 'Ano de 2026',
  },
};

export const FormatoEmPorcentagem: Story = {
  name: 'Formato personalizado (ocupação)',
  args: {
    title: 'Ocupação das salas',
    rows: [
      { label: 'Sala A', values: [92, 88, 75, 64] },
      { label: 'Sala B', values: [70, 82, 90, 58] },
      { label: 'Sala C', values: [40, 55, 62, 35] },
    ],
    columns: ['Manhã', 'Tarde', 'Noite', 'Madrugada'],
    max: 100,
    headline: 68,
    delta: 0.045,
    range: 'Esta semana',
    format: (n: number) => `${n}%`,
  },
};

const periodos: HeatmapRange[] = [
  { id: 'semana', label: 'Esta semana', rows: acessosPorHorario, columns: horas, delta: 0.032 },
  {
    id: 'mes',
    label: 'Este mês',
    columns: horas,
    rows: acessosPorHorario.map((r) => ({ label: r.label, values: r.values.map((v) => v * 4) })),
    delta: 0.091,
  },
  {
    id: 'trimestre',
    label: 'Último trimestre',
    columns: horas,
    rows: acessosPorHorario.map((r) => ({ label: r.label, values: r.values.map((v) => v * 12) })),
    delta: -0.027,
  },
];

export const ComPeriodosSelecionaveis: Story = {
  name: 'Com períodos selecionáveis',
  args: {
    title: 'Acessos ao portal',
    ranges: periodos,
    defaultRange: 'mes',
  },
};
