import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  SankeyChartCard,
  type SankeyChartCardProps,
  type SankeyLinkDatum,
  type SankeyNodeDatum,
  type SankeyRange,
} from '@/components/application/charts/sankey-chart-card';

const meta = {
  title: 'Charts/SankeyChartCard',
  component: SankeyChartCard as ComponentType<SankeyChartCardProps>,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    linkColor: { control: 'inline-radio', options: ['source', 'target'] },
    title: { control: 'text' },
  },
  render: (args) => (
    <div className="w-[560px]">
      <SankeyChartCard {...args} />
    </div>
  ),
} satisfies Meta<SankeyChartCardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const formatarReais = (n: number) =>
  n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

const nos: SankeyNodeDatum[] = [
  { name: 'Mensalidades', color: 'var(--color-chart-7)', activeColor: 'var(--color-chart-7-active)' },
  { name: 'Convênios', color: 'var(--color-chart-5)', activeColor: 'var(--color-chart-5-active)' },
  { name: 'Eventos', color: 'var(--color-chart-3)', activeColor: 'var(--color-chart-3-active)' },
  { name: 'Folha de pagamento', color: 'neutral' },
  { name: 'Infraestrutura', color: 'neutral' },
  { name: 'Material didático', color: 'neutral' },
  { name: 'Reserva', color: 'neutral' },
];

const fluxos = (v: number[]): SankeyLinkDatum[] => [
  { source: 'Mensalidades', target: 'Folha de pagamento', value: v[0] },
  { source: 'Mensalidades', target: 'Infraestrutura', value: v[1] },
  { source: 'Mensalidades', target: 'Material didático', value: v[2] },
  { source: 'Convênios', target: 'Folha de pagamento', value: v[3] },
  { source: 'Convênios', target: 'Infraestrutura', value: v[4] },
  { source: 'Convênios', target: 'Reserva', value: v[5] },
  { source: 'Eventos', target: 'Material didático', value: v[6] },
  { source: 'Eventos', target: 'Reserva', value: v[7] },
];

const fluxosBase = fluxos([62000, 24000, 18000, 38000, 12000, 10000, 9000, 6000]);

const periodos: SankeyRange[] = [
  { id: 'set', label: 'Setembro', nodes: nos, links: fluxosBase, delta: 0.043 },
  {
    id: 'out',
    label: 'Outubro',
    nodes: nos,
    links: fluxos([66000, 26000, 20000, 41000, 13000, 11000, 12000, 8000]),
    delta: 0.071,
  },
  {
    id: 'tri',
    label: 'Trimestre',
    nodes: nos,
    links: fluxos([190000, 74000, 55000, 118000, 37000, 31000, 33000, 21000]),
    delta: -0.012,
  },
];

export const Padrao: Story = {
  name: 'Dados padrão (com períodos)',
  args: {},
};

export const FluxoDeReceitas: Story = {
  name: 'Receitas para despesas (R$)',
  args: {
    title: 'Origem e destino dos recursos',
    nodes: nos,
    links: fluxosBase,
    format: formatarReais,
    range: 'Setembro de 2026',
    delta: 0.043,
  },
};

export const ComSeletorDePeriodo: Story = {
  name: 'Seletor de período',
  args: {
    title: 'Origem e destino dos recursos',
    ranges: periodos,
    defaultRange: 'out',
    format: formatarReais,
  },
};

export const CorDoDestino: Story = {
  name: 'Fitas na cor do destino',
  args: {
    title: 'Origem e destino dos recursos',
    nodes: [
      { name: 'Mensalidades', color: 'var(--color-chart-7)', activeColor: 'var(--color-chart-7-active)' },
      { name: 'Convênios', color: 'var(--color-chart-5)', activeColor: 'var(--color-chart-5-active)' },
      { name: 'Eventos', color: 'var(--color-chart-3)', activeColor: 'var(--color-chart-3-active)' },
      { name: 'Folha de pagamento', color: 'var(--color-chart-1)', activeColor: 'var(--color-chart-1-active)' },
      { name: 'Infraestrutura', color: 'var(--color-chart-2)', activeColor: 'var(--color-chart-2-active)' },
      { name: 'Material didático', color: 'var(--color-chart-4)', activeColor: 'var(--color-chart-4-active)' },
      { name: 'Reserva', color: 'var(--color-chart-6)', activeColor: 'var(--color-chart-6-active)' },
    ],
    links: fluxosBase,
    linkColor: 'target',
    format: formatarReais,
    range: 'Setembro de 2026',
  },
};

export const ComLegendasDeColuna: Story = {
  name: 'Legendas das colunas',
  args: {
    title: 'Origem e destino dos recursos',
    nodes: nos,
    links: fluxosBase,
    format: formatarReais,
    axisLabels: ['Origem', 'Destino'],
    range: 'Setembro de 2026',
  },
};

export const FluxoMenor: Story = {
  name: 'Fluxo enxuto (poucos nós)',
  args: {
    title: 'Funil de atendimentos',
    nodes: [
      { name: 'Protocolados', color: 'var(--color-chart-7)', activeColor: 'var(--color-chart-7-active)' },
      { name: 'Deferidos', color: 'neutral' },
      { name: 'Indeferidos', color: 'neutral' },
      { name: 'Em análise', color: 'neutral' },
    ],
    links: [
      { source: 'Protocolados', target: 'Deferidos', value: 410 },
      { source: 'Protocolados', target: 'Indeferidos', value: 95 },
      { source: 'Protocolados', target: 'Em análise', value: 135 },
    ],
    format: (n: number) => `${Math.round(n)}`,
    range: 'Outubro de 2026',
    delta: 0.12,
  },
};
