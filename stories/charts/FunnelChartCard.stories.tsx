import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FunnelChartCard,
  type FunnelChartCardProps,
  type FunnelRange,
  type FunnelStage,
} from '@/components/application/charts/funnel-chart-card';

const formatarReais = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

const meta = {
  title: 'Charts/FunnelChartCard',
  component: FunnelChartCard as ComponentType<FunnelChartCardProps>,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    shape: { control: 'inline-radio', options: ['curved', 'sharp'] },
    mono: { control: 'boolean' },
    title: { control: 'text' },
    delta: { control: { type: 'number', step: 0.001 } },
    headline: { control: 'number' },
    range: { control: 'text' },
    format: { control: false },
    ranges: { control: false },
    stages: { control: false },
    className: { control: false },
  },
  render: (args) => (
    <div className="w-[560px]">
      <FunnelChartCard {...args} />
    </div>
  ),
} satisfies Meta<FunnelChartCardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const etapasMatricula: FunnelStage[] = [
  { label: 'Visitas ao site', value: 4820 },
  { label: 'Cadastros', value: 1960 },
  { label: 'Documentos enviados', value: 1105 },
  { label: 'Matrículas', value: 642 },
];

const etapasVendas: FunnelStage[] = [
  { label: 'Leads', value: 1250 },
  { label: 'Qualificados', value: 780 },
  { label: 'Proposta enviada', value: 410 },
  { label: 'Negociação', value: 190 },
  { label: 'Fechados', value: 96 },
];

export const Padrao: Story = {
  name: 'Padrão (dados embutidos)',
};

export const Curvo: Story = {
  args: {
    shape: 'curved',
    title: 'Funil de matrículas',
    stages: etapasMatricula,
    delta: 0.067,
    range: 'Últimos 30 dias',
  },
};

export const Reto: Story = {
  args: {
    shape: 'sharp',
    title: 'Funil de matrículas',
    stages: etapasMatricula,
    delta: 0.067,
    range: 'Últimos 30 dias',
  },
};

export const Monocromatico: Story = {
  args: {
    mono: true,
    title: 'Funil de matrículas',
    stages: etapasMatricula,
    delta: 0.067,
    range: 'Últimos 30 dias',
  },
};

export const MonocromaticoReto: Story = {
  args: {
    mono: true,
    shape: 'sharp',
    title: 'Funil de matrículas',
    stages: etapasMatricula,
    delta: -0.021,
    range: 'Últimos 30 dias',
  },
};

export const CincoEtapasEmReais: Story = {
  name: 'Cinco etapas com valores em reais',
  args: {
    title: 'Pipeline comercial',
    stages: [
      { label: 'Oportunidades', value: 480000 },
      { label: 'Qualificadas', value: 312000 },
      { label: 'Proposta', value: 205000 },
      { label: 'Negociação', value: 128000 },
      { label: 'Contratos', value: 74000 },
    ],
    headline: 74000,
    delta: 0.112,
    range: 'Último trimestre',
    format: formatarReais,
  },
};

export const CoresPersonalizadas: Story = {
  args: {
    title: 'Funil de vendas',
    stages: etapasVendas.map((etapa, i) => ({
      ...etapa,
      color: ['#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316'][i],
    })),
    delta: 0.034,
    range: 'Últimos 90 dias',
  },
};

export const QuedaNoPeriodo: Story = {
  args: {
    title: 'Funil de inscrições',
    stages: [
      { label: 'Acessos', value: 3150 },
      { label: 'Inscrições iniciadas', value: 1240 },
      { label: 'Inscrições concluídas', value: 520 },
      { label: 'Pagas', value: 233 },
    ],
    delta: -0.083,
    range: 'Últimos 7 dias',
  },
};

const periodosMatricula: FunnelRange[] = [
  { id: '7d', label: 'Últimos 7 dias', stages: etapasMatricula.map((e) => ({ ...e, value: Math.round(e.value * 0.24) })), delta: 0.041 },
  { id: '30d', label: 'Últimos 30 dias', stages: etapasMatricula, delta: 0.067 },
  { id: '90d', label: 'Últimos 90 dias', stages: etapasMatricula.map((e) => ({ ...e, value: Math.round(e.value * 2.9) })), delta: -0.015 },
];

export const ComPeriodosSelecionaveis: Story = {
  name: 'Com períodos selecionáveis',
  args: {
    title: 'Funil de matrículas',
    ranges: periodosMatricula,
    defaultRange: '30d',
  },
};

export const PeriodosNoModoRetoMono: Story = {
  name: 'Períodos, reto e monocromático',
  args: {
    title: 'Funil de matrículas',
    shape: 'sharp',
    mono: true,
    ranges: periodosMatricula,
  },
};
