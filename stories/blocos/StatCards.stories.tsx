import type { ComponentType } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  RiBankCardLine,
  RiFileList3Line,
  RiGroupLine,
  RiHourglassLine,
  RiMoneyDollarCircleLine,
  RiShieldCheckLine,
} from '@remixicon/react';
import { StatCards, type Stat } from '@/components/application/dashboard/stat-cards';

type StatCardsProps = NonNullable<Parameters<typeof StatCards>[0]>;

const meta = {
  title: 'Blocos/StatCards',
  component: StatCards as ComponentType<StatCardsProps>,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['plain', 'footer'] },
    columns: { control: 'inline-radio', options: [1, 2, 4] },
    count: { control: { type: 'number', min: 1, max: 6 } },
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-5xl">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<StatCardsProps>;

export default meta;
type Story = StoryObj<typeof meta>;

const indicadoresSimples: Stat[] = [
  { icon: RiGroupLine, label: 'Servidores ativos', value: '1.284', delta: '+3,2%', deltaColor: 'lime' },
  { icon: RiFileList3Line, label: 'Processos abertos', value: '342', delta: '-4,8%', deltaColor: 'rose' },
  { icon: RiHourglassLine, label: 'Em análise', value: '97', delta: '0,00%', deltaColor: 'neutral' },
  { icon: RiShieldCheckLine, label: 'Concluídos no mês', value: '215', delta: '+11,6%', deltaColor: 'lime' },
];

const indicadoresRodape: Stat[] = [
  {
    icon: RiMoneyDollarCircleLine,
    label: 'Receita total',
    value: 'R$ 482.310,75',
    delta: '14%',
    deltaColor: 'lime',
    tone: 'blue',
    caption: 'Em relação ao mês anterior',
    hint: 'Valor bruto arrecadado no mês, antes dos estornos. A variação compara com os mesmos dias do mês anterior.',
  },
  {
    icon: RiFileList3Line,
    label: 'Contratos firmados',
    value: '128',
    delta: '9%',
    deltaColor: 'lime',
    tone: 'emerald',
    caption: 'Em relação ao mês anterior',
    hint: 'Contratos assinados por todas as partes no mês.',
  },
  {
    icon: RiGroupLine,
    label: 'Novos cadastros',
    value: '2.045',
    delta: '5,7%',
    deltaColor: 'lime',
    tone: 'purple',
    caption: 'Em relação ao mês anterior',
  },
  {
    icon: RiBankCardLine,
    label: 'Estornos',
    value: 'R$ 6.918,20',
    delta: '3,1%',
    deltaColor: 'rose',
    tone: 'pink',
    caption: 'Em relação ao mês anterior',
    hint: 'Valor devolvido no mês. Quando sobe, a variação aparece em vermelho.',
  },
];

export const Simples: Story = {
  args: { variant: 'plain', stats: indicadoresSimples },
};

export const ComRodape: Story = {
  args: { variant: 'footer', stats: indicadoresRodape },
};

export const TonsDoRodape: Story = {
  args: {
    variant: 'footer',
    columns: 2,
    stats: (['blue', 'orange', 'purple', 'pink', 'sky', 'emerald'] as const).map((tone, i) => ({
      icon: RiFileList3Line,
      label: `Indicador ${tone}`,
      value: String(100 + i * 37),
      delta: `${i + 2}%`,
      deltaColor: i % 3 === 1 ? ('rose' as const) : ('lime' as const),
      tone,
    })),
  },
};

export const QuantidadeLimitada: Story = {
  args: { variant: 'plain', stats: indicadoresSimples, count: 2, columns: 2 },
};

export const DuasColunas: Story = {
  args: { variant: 'footer', stats: indicadoresRodape, columns: 2 },
};

export const UmaColuna: Story = {
  args: { variant: 'plain', stats: indicadoresSimples, columns: 1 },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
};

export const ComDadosPadrao: Story = {
  args: { variant: 'plain' },
};
