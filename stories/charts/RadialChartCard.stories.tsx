import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RadialChartCard,
  type RadialChartCardProps,
  type RadialDatum,
  type RadialRange,
} from '@/components/application/charts/radial-chart-card';

const meta = {
  title: 'Charts/RadialChartCard',
  component: RadialChartCard as ComponentType<RadialChartCardProps>,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: {
      control: 'select',
      options: ['rings', 'labels', 'grid', 'gauge', 'solid', 'stacked'],
    },
    tiles: { control: 'boolean' },
    title: { control: 'text' },
    centerCaption: { control: 'text' },
  },
  render: (args) => (
    <div className="w-[560px]">
      <RadialChartCard {...args} />
    </div>
  ),
} satisfies Meta<RadialChartCardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const canais: RadialDatum[] = [
  { label: 'Outros', value: 120 },
  { label: 'E-mail', value: 210 },
  { label: 'Indicação', value: 260 },
  { label: 'Redes sociais', value: 340 },
  { label: 'Busca orgânica', value: 480 },
];

const canaisPorPeriodo: RadialRange[] = [
  { id: '7d', label: 'Últimos 7 dias', data: canais, delta: 0.052 },
  {
    id: '30d',
    label: 'Últimos 30 dias',
    data: [
      { label: 'Outros', value: 540 },
      { label: 'E-mail', value: 880 },
      { label: 'Indicação', value: 1010 },
      { label: 'Redes sociais', value: 1390 },
      { label: 'Busca orgânica', value: 2050 },
    ],
    delta: 0.081,
  },
  {
    id: '90d',
    label: 'Últimos 90 dias',
    data: [
      { label: 'Outros', value: 1620 },
      { label: 'E-mail', value: 2480 },
      { label: 'Indicação', value: 3100 },
      { label: 'Redes sociais', value: 4210 },
      { label: 'Busca orgânica', value: 6380 },
    ],
    delta: -0.024,
  },
];

export const Aneis: Story = {
  name: 'Anéis (padrão)',
  args: { variant: 'rings', title: 'Visitantes por canal' },
};

export const AneisComRotulos: Story = {
  name: 'Anéis com rótulos',
  args: { variant: 'labels', title: 'Visitantes por canal', data: canais, range: 'Últimos 7 dias', delta: 0.052 },
};

export const AneisComGrade: Story = {
  name: 'Anéis com grade circular',
  args: { variant: 'grid', title: 'Visitantes por canal', data: canais, range: 'Últimos 7 dias' },
};

export const AneisComPeriodos: Story = {
  name: 'Seletor de período',
  args: { variant: 'rings', title: 'Visitantes por canal', ranges: canaisPorPeriodo, defaultRange: '30d' },
};

export const AneisComBlocos: Story = {
  name: 'Anéis com blocos de estatística',
  args: { variant: 'rings', title: 'Visitantes por canal', data: canais, range: 'Últimos 7 dias', tiles: true },
};

export const MedidorFino: Story = {
  name: 'Medidor (gauge)',
  args: {
    variant: 'gauge',
    title: 'Meta de matrículas',
    data: [{ label: 'Matrículas', value: 1260 }],
    max: 2000,
    centerCaption: 'da meta',
    range: 'Ano letivo 2026',
    delta: 0.052,
  },
};

export const MedidorSolido: Story = {
  name: 'Medidor sólido',
  args: {
    variant: 'solid',
    title: 'Atendimentos concluídos',
    data: [{ label: 'Atendimentos', value: 3640 }],
    max: 5000,
    centerCaption: 'da meta mensal',
    range: 'Outubro de 2026',
    delta: 0.081,
  },
};

export const MedidorComPeriodos: Story = {
  name: 'Medidor com períodos',
  args: {
    variant: 'gauge',
    title: 'Arrecadação',
    format: (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
    ranges: [
      { id: 'mes', label: 'Este mês', data: [{ label: 'Arrecadado', value: 182000 }], max: 250000, delta: 0.064 },
      { id: 'tri', label: 'Este trimestre', data: [{ label: 'Arrecadado', value: 497500 }], max: 750000, delta: 0.031 },
    ],
  },
};

export const SemicirculoEmpilhado: Story = {
  name: 'Semicírculo empilhado',
  args: {
    variant: 'stacked',
    title: 'Acessos por dispositivo',
    data: [
      { label: 'Computador', value: 1260 },
      { label: 'Celular', value: 570 },
    ],
    max: 2000,
    range: 'Últimos 7 dias',
    delta: 0.052,
  },
};

export const SemicirculoComPeriodos: Story = {
  name: 'Semicírculo com períodos',
  args: {
    variant: 'stacked',
    title: 'Acessos por dispositivo',
    ranges: [
      {
        id: '7d',
        label: 'Últimos 7 dias',
        data: [
          { label: 'Computador', value: 1260 },
          { label: 'Celular', value: 570 },
          { label: 'Tablet', value: 140 },
        ],
        delta: 0.052,
      },
      {
        id: '30d',
        label: 'Últimos 30 dias',
        data: [
          { label: 'Computador', value: 4820 },
          { label: 'Celular', value: 2410 },
          { label: 'Tablet', value: 520 },
        ],
        delta: 0.081,
      },
    ],
  },
};

export const SemicirculoComBlocos: Story = {
  name: 'Semicírculo com blocos',
  args: {
    variant: 'stacked',
    title: 'Acessos por dispositivo',
    data: [
      { label: 'Computador', value: 1260 },
      { label: 'Celular', value: 570 },
      { label: 'Tablet', value: 140 },
    ],
    range: 'Últimos 7 dias',
    tiles: true,
  },
};

export const CoresPersonalizadas: Story = {
  name: 'Cores personalizadas',
  args: {
    variant: 'rings',
    title: 'Atendimentos por unidade',
    data: [
      { label: 'UBS Centro', value: 320, color: 'var(--color-chart-1)', activeColor: 'var(--color-chart-1-active)' },
      { label: 'UBS Norte', value: 260, color: 'var(--color-chart-3)', activeColor: 'var(--color-chart-3-active)' },
      { label: 'UBS Sul', value: 190, color: 'var(--color-chart-5)', activeColor: 'var(--color-chart-5-active)' },
    ],
    range: 'Outubro de 2026',
  },
};
