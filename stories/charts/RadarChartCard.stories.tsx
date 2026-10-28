import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RadarChartCard,
  type RadarPoint,
  type RadarRange,
  type RadarSeries,
} from '@/components/application/charts/radar-chart-card';

const meta = {
  title: 'Charts/RadarChartCard',
  component: RadarChartCard as ComponentType<RadarChartCardProps>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Gráfico de radar com quatro variantes (preenchido, pontos, linhas e pontuação). Aceita várias séries, períodos selecionáveis, tiles de estatística e três posições de legenda.',
      },
    },
  },
  argTypes: {
    variant: { control: 'inline-radio', options: ['filled', 'dots', 'lines', 'score'] },
    legend: { control: 'inline-radio', options: ['bottom', 'top', 'overlay'] },
    tiles: { control: 'boolean' },
    radiusScale: { control: { type: 'range', min: 0.6, max: 1.2, step: 0.05 } },
    plotOffsetY: { control: { type: 'number', min: -40, max: 40 } },
  },
} satisfies Meta<RadarChartCardProps>;

type RadarChartCardProps = NonNullable<Parameters<typeof RadarChartCard>[0]>;

export default meta;
type Story = StoryObj<typeof meta>;

const canais: RadarPoint[] = [
  { label: 'Busca orgânica', visitas: 4820, campanhas: 3100 },
  { label: 'Redes sociais', visitas: 3650, campanhas: 4200 },
  { label: 'E-mail', visitas: 2140, campanhas: 2600 },
  { label: 'Indicação', visitas: 1780, campanhas: 900 },
  { label: 'Direto', visitas: 3320, campanhas: 1200 },
  { label: 'Anúncios', visitas: 2750, campanhas: 3900 },
];

const umaSerie: RadarSeries[] = [{ key: 'visitas', label: 'Visitas' }];

const duasSeries: RadarSeries[] = [
  { key: 'visitas', label: 'Visitas' },
  { key: 'campanhas', label: 'Campanhas' },
];

const pontuacao: RadarPoint[] = [
  { label: 'Foco', score: 92 },
  { label: 'Constância', score: 38 },
  { label: 'Metas', score: 88 },
  { label: 'Equilíbrio', score: 76 },
  { label: 'Trabalho profundo', score: 95 },
];

const periodos: RadarRange[] = [
  { id: 'sem1', label: '1º semestre', data: canais, series: duasSeries, delta: 0.064 },
  {
    id: 'sem2',
    label: '2º semestre',
    data: canais.map((c) => ({
      ...c,
      visitas: Math.round(Number(c.visitas) * 1.18),
      campanhas: Math.round(Number(c.campanhas) * 1.09),
    })),
    series: duasSeries,
    delta: 0.112,
  },
];

const caixa = (c: React.ReactNode) => <div className="w-[560px]">{c}</div>;

export const Preenchido: Story = {
  name: 'Preenchido (padrão)',
  args: { variant: 'filled', title: 'Visitas por canal', data: canais, series: umaSerie, delta: 0.052, range: 'Jan – Jun 2026' },
  render: (args) => caixa(<RadarChartCard {...args} />),
};

export const ComPontos: Story = {
  name: 'Com pontos nos vértices',
  args: { variant: 'dots', title: 'Visitas por canal', data: canais, series: umaSerie, delta: 0.052, range: 'Jan – Jun 2026' },
  render: (args) => caixa(<RadarChartCard {...args} />),
};

export const SoLinhas: Story = {
  name: 'Só linhas, duas séries',
  args: { variant: 'lines', title: 'Visitas e campanhas', data: canais, series: duasSeries, range: 'Jan – Jun 2026' },
  render: (args) => caixa(<RadarChartCard {...args} />),
};

export const Pontuacao: Story = {
  name: 'Pontuação com alerta',
  args: { variant: 'score', title: 'Pontuação semanal', data: pontuacao, series: [{ key: 'score', label: 'Pontuação' }], alertBelow: 50, range: 'Esta semana' },
  render: (args) => caixa(<RadarChartCard {...args} />),
};

export const PontuacaoLegendaPersonalizada: Story = {
  name: 'Pontuação com legenda própria',
  args: {
    variant: 'score',
    title: 'Pontuação semanal',
    data: pontuacao,
    series: [{ key: 'score', label: 'Pontuação' }],
    alertBelow: 50,
    scoreCaption: (s: number) => (s >= 80 ? 'Muito bom' : 'Em evolução'),
  },
  render: (args) => caixa(<RadarChartCard {...args} />),
};

export const MultiplosPeriodos: Story = {
  name: 'Períodos selecionáveis',
  args: { variant: 'filled', title: 'Visitas e campanhas', ranges: periodos, series: duasSeries },
  render: (args) => caixa(<RadarChartCard {...args} />),
};

export const DadosPadraoEmbutidos: Story = {
  name: 'Dados padrão embutidos',
  render: () => caixa(<RadarChartCard />),
};

export const LegendaNoTopo: Story = {
  name: 'Legenda no topo',
  args: { variant: 'lines', title: 'Visitas e campanhas', data: canais, series: duasSeries, legend: 'top', range: 'Jan – Jun 2026' },
  render: (args) => caixa(<RadarChartCard {...args} />),
};

export const LegendaSobreposta: Story = {
  name: 'Legenda sobreposta',
  args: { variant: 'filled', title: 'Visitas e campanhas', data: canais, series: duasSeries, legend: 'overlay', range: 'Jan – Jun 2026' },
  render: (args) => caixa(<RadarChartCard {...args} />),
};

export const ComTiles: Story = {
  name: 'Com tiles de estatística',
  args: { variant: 'dots', title: 'Visitas por canal', data: canais, series: umaSerie, tiles: true, delta: 0.052, range: 'Jan – Jun 2026' },
  render: (args) => caixa(<RadarChartCard {...args} />),
};

export const FormatoMonetario: Story = {
  name: 'Formato em reais e raio ampliado',
  args: {
    variant: 'filled',
    title: 'Receita por canal',
    data: canais.map((c) => ({ label: c.label, receita: Number(c.visitas) * 3.4 })),
    series: [{ key: 'receita', label: 'Receita', color: 'var(--color-chart-6)', activeColor: 'var(--color-chart-6-active)' }],
    format: (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
    radiusScale: 1.1,
    delta: -0.031,
  },
  render: (args) => caixa(<RadarChartCard {...args} />),
};
