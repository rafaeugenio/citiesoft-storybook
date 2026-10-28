import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { RiGlobalLine, RiMailLine, RiSearchLine, RiShareForwardLine, RiWhatsappLine } from '@remixicon/react';
import { BarListCard, type BarListItem, type BarListTab } from '@/components/application/charts/bar-list-card';

type BarListProps = NonNullable<Parameters<typeof BarListCard>[0]>;

const meta = {
  title: 'Charts/BarListCard',
  component: BarListCard as ComponentType<BarListProps>,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Lista ranqueada com barras de fundo proporcionais ao maior item. Aceita abas, valor em participação (%) ou bruto, modo monocromático e botão "ver mais" quando a lista passa de `limit`.',
      },
    },
  },
  argTypes: {
    metric: { control: 'inline-radio', options: ['share', 'value'] },
    mono: { control: 'boolean' },
    limit: { control: { type: 'number', min: 1, max: 12 } },
    color: { control: 'color' },
    metricLabel: { control: 'text' },
    title: { control: 'text' },
  },
} satisfies Meta<BarListProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const ICONE = 'size-4 text-text-secondary';

const canais: BarListItem[] = [
  { label: 'Busca orgânica', value: 12840, icon: <RiSearchLine className={ICONE} aria-hidden /> },
  { label: 'Direto', value: 8120, icon: <RiGlobalLine className={ICONE} aria-hidden /> },
  { label: 'WhatsApp', value: 5460, icon: <RiWhatsappLine className={ICONE} aria-hidden /> },
  { label: 'E-mail marketing', value: 3210, icon: <RiMailLine className={ICONE} aria-hidden /> },
  { label: 'Redes sociais', value: 2380, icon: <RiShareForwardLine className={ICONE} aria-hidden /> },
  { label: 'Indicação', value: 1190 },
  { label: 'Anúncios pagos', value: 760 },
  { label: 'Outros', value: 90 },
];

const estados: BarListItem[] = [
  { label: 'São Paulo', value: 9420 },
  { label: 'Rio de Janeiro', value: 5130 },
  { label: 'Minas Gerais', value: 3870 },
  { label: 'Paraná', value: 2240 },
  { label: 'Bahia', value: 1760 },
  { label: 'Rio Grande do Sul', value: 1490 },
  { label: 'Maranhão', value: 620 },
];

const abas: BarListTab[] = [
  { id: 'canais', label: 'Canais', items: canais },
  { id: 'estados', label: 'Estados', items: estados },
  {
    id: 'dispositivos',
    label: 'Dispositivos',
    items: [
      { label: 'Celular', value: 14200 },
      { label: 'Computador', value: 9800 },
      { label: 'Tablet', value: 1450 },
    ],
  },
];

export const Abas: Story = {
  name: 'Com abas (participação)',
  args: { tabs: abas, metricLabel: 'Visitantes' },
  render: (args) => (
    <div className="w-[560px]">
      <BarListCard {...args} />
    </div>
  ),
};

export const ListaUnica: Story = {
  name: 'Lista única',
  args: { items: canais.slice(0, 5), title: 'Origem do tráfego', metricLabel: 'Visitantes' },
  render: (args) => (
    <div className="w-[560px]">
      <BarListCard {...args} />
    </div>
  ),
};

export const ValorBruto: Story = {
  name: 'Valor bruto em vez de %',
  args: {
    items: estados.slice(0, 5),
    title: 'Pedidos por estado',
    metricLabel: 'Pedidos',
    metric: 'value',
    format: (n: number) => n.toLocaleString('pt-BR'),
  },
  render: (args) => (
    <div className="w-[560px]">
      <BarListCard {...args} />
    </div>
  ),
};

export const Monocromatico: Story = {
  name: 'Monocromático',
  args: { tabs: abas, mono: true },
  render: (args) => (
    <div className="w-[560px]">
      <BarListCard {...args} />
    </div>
  ),
};

export const CorPersonalizada: Story = {
  name: 'Cor personalizada',
  args: { items: canais.slice(0, 5), title: 'Origem do tráfego', color: '#14B8A6' },
  render: (args) => (
    <div className="w-[560px]">
      <BarListCard {...args} />
    </div>
  ),
};

export const CoresPorLinha: Story = {
  name: 'Cor por linha',
  args: {
    title: 'Situação dos processos',
    metricLabel: 'Processos',
    metric: 'value',
    items: [
      { label: 'Concluídos', value: 215, color: 'var(--color-chart-3)' },
      { label: 'Em análise', value: 97, color: 'var(--color-chart-2)' },
      { label: 'Pendentes', value: 64, color: 'var(--color-chart-4)' },
      { label: 'Cancelados', value: 12, color: 'var(--color-chart-1)' },
    ],
  },
  render: (args) => (
    <div className="w-[560px]">
      <BarListCard {...args} />
    </div>
  ),
};

export const LimiteCurto: Story = {
  name: 'Limite de 3 linhas (ver mais)',
  args: { items: canais, title: 'Origem do tráfego', limit: 3 },
  render: (args) => (
    <div className="w-[560px]">
      <BarListCard {...args} />
    </div>
  ),
};

export const AbaInicialDefinida: Story = {
  name: 'Aba inicial definida',
  args: { tabs: abas, defaultTab: 'estados' },
  render: (args) => (
    <div className="w-[560px]">
      <BarListCard {...args} />
    </div>
  ),
};

export const DadosPadrao: Story = {
  name: 'Dados padrão embutidos',
  render: (args) => (
    <div className="w-[560px]">
      <BarListCard {...args} />
    </div>
  ),
};
