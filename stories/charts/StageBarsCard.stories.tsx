import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RiCustomerService2Line,
  RiFileList3Line,
  RiHandCoinLine,
  RiMailSendLine,
  RiUserSearchLine,
} from '@remixicon/react';
import {
  StageBarsCard,
  type StageBar,
  type StageBarsCardProps,
  type StageBarsRange,
} from '@/components/application/charts/stage-bars-card';

const ICON = 'size-3.5 shrink-0 text-neutral-950';

const ETAPAS: StageBar[] = [
  { label: 'Contatos', value: 3200, icon: <RiMailSendLine className={ICON} aria-hidden /> },
  { label: 'Qualificados', value: 1840, icon: <RiUserSearchLine className={ICON} aria-hidden /> },
  { label: 'Atendimento', value: 960, icon: <RiCustomerService2Line className={ICON} aria-hidden /> },
  { label: 'Proposta', value: 410, icon: <RiFileList3Line className={ICON} aria-hidden /> },
  { label: 'Contrato', value: 150, icon: <RiHandCoinLine className={ICON} aria-hidden /> },
];

const semIcones: StageBar[] = ETAPAS.map(({ label, value }) => ({ label, value }));

const PERIODOS: StageBarsRange[] = [
  {
    id: '7d',
    label: 'Últimos 7 dias',
    stages: ETAPAS.map((e, i) => ({ ...e, value: [740, 420, 215, 96, 34][i] })),
    delta: 0.018,
  },
  { id: '30d', label: 'Últimos 30 dias', stages: ETAPAS, delta: 0.064 },
  {
    id: '90d',
    label: 'Últimos 90 dias',
    stages: ETAPAS.map((e, i) => ({ ...e, value: [9800, 5600, 2870, 1210, 460][i] })),
    delta: -0.021,
  },
];

const meta = {
  title: 'Charts/StageBarsCard',
  component: StageBarsCard as ComponentType<StageBarsCardProps>,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    mono: { control: 'boolean' },
    showIcons: { control: 'boolean' },
    delta: { control: { type: 'number', step: 0.001 } },
  },
} satisfies Meta<StageBarsCardProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const Frame = ({ children }: { children: React.ReactNode }) => <div className="w-[560px]">{children}</div>;

export const PeriodosPadrao: Story = {
  name: 'Dados padrão (com períodos)',
  render: (args) => (
    <Frame>
      <StageBarsCard {...args} />
    </Frame>
  ),
};

export const FunilDeVendas: Story = {
  args: {
    title: 'Funil comercial',
    stages: ETAPAS,
    headline: 3200,
    delta: 0.064,
    range: 'Últimos 30 dias',
  },
  render: (args) => (
    <Frame>
      <StageBarsCard {...args} />
    </Frame>
  ),
};

export const ComSeletorDePeriodo: Story = {
  args: { title: 'Funil comercial', ranges: PERIODOS, defaultRange: '30d' },
  render: (args) => (
    <Frame>
      <StageBarsCard {...args} />
    </Frame>
  ),
};

export const DeltaNegativo: Story = {
  args: { title: 'Funil comercial', ranges: PERIODOS, defaultRange: '90d' },
  render: (args) => (
    <Frame>
      <StageBarsCard {...args} />
    </Frame>
  ),
};

export const Monocromatico: Story = {
  args: { title: 'Funil comercial', stages: ETAPAS, mono: true, range: 'Últimos 30 dias', delta: 0.064 },
  render: (args) => (
    <Frame>
      <StageBarsCard {...args} />
    </Frame>
  ),
};

export const SemIcones: Story = {
  args: { title: 'Funil comercial', stages: ETAPAS, showIcons: false, range: 'Últimos 30 dias', delta: 0.064 },
  render: (args) => (
    <Frame>
      <StageBarsCard {...args} />
    </Frame>
  ),
};

export const EtapasSemIconeNosDados: Story = {
  args: { title: 'Triagem de chamados', stages: semIcones, range: 'Este mês' },
  render: (args) => (
    <Frame>
      <StageBarsCard {...args} />
    </Frame>
  ),
};

export const CoresPersonalizadas: Story = {
  args: {
    title: 'Cadastros por etapa',
    range: 'Este mês',
    stages: [
      { label: 'Iniciados', value: 1200, color: '#146BFA', activeColor: '#0B4DC0' },
      { label: 'Documentos', value: 860, color: '#7C3AED', activeColor: '#5B21B6' },
      { label: 'Análise', value: 520, color: '#F59E0B', activeColor: '#B45309' },
      { label: 'Aprovados', value: 410, color: '#16A34A', activeColor: '#166534' },
    ],
  },
  render: (args) => (
    <Frame>
      <StageBarsCard {...args} />
    </Frame>
  ),
};

export const FormatoMoeda: Story = {
  args: {
    title: 'Receita por etapa',
    range: 'Último trimestre',
    delta: 0.092,
    stages: [
      { label: 'Pipeline', value: 482000 },
      { label: 'Negociação', value: 268000 },
      { label: 'Fechado', value: 131500 },
    ],
    format: (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }),
  },
  render: (args) => (
    <Frame>
      <StageBarsCard {...args} />
    </Frame>
  ),
};

export const PoucasEtapas: Story = {
  args: {
    title: 'Inscrições',
    range: 'Esta semana',
    stages: [
      { label: 'Inscritos', value: 640 },
      { label: 'Confirmados', value: 380 },
      { label: 'Presentes', value: 295 },
    ],
  },
  render: (args) => (
    <Frame>
      <StageBarsCard {...args} />
    </Frame>
  ),
};
