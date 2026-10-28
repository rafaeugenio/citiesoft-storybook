import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentLimitsCard } from '@/components/application/agent-limits/agent-limits-card';

const meta = {
  title: 'Blocos/AgentLimitsCard',
  component: AgentLimitsCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    defaultExpanded: { control: 'boolean' },
    plan: { control: 'text' },
  },
  render: (args) => (
    <div className="w-[380px]">
      <AgentLimitsCard {...args} />
    </div>
  ),
} satisfies Meta<typeof AgentLimitsCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Expandido: Story = { args: { defaultExpanded: true } };

export const ComLinkDoPlano: Story = {
  args: { plan: 'Equipe', planHref: '#plano' },
};

export const JanelaQuaseCheia: Story = {
  args: {
    defaultExpanded: true,
    plan: 'Equipe',
    context: {
      max: 200_000,
      segments: [
        { label: 'Mensagens', tokens: 128_000 },
        { label: 'Ferramentas do sistema', tokens: 24_000 },
        { label: 'Ferramentas MCP', tokens: 18_500 },
        { label: 'Prompt do sistema', tokens: 9_500 },
        { label: 'Arquivos de memória', tokens: 8_000 },
        { label: 'Ferramentas MCP (adiadas)', tokens: 12_300, deferred: true },
      ],
      groups: [
        {
          label: 'Ferramentas MCP',
          tokens: 30_800,
          items: [
            { label: 'navegador', tokens: 14_200 },
            { label: 'agenda', tokens: 9_100 },
            { label: 'planilhas', tokens: 7_500 },
          ],
        },
        {
          label: 'Arquivos de memória',
          tokens: 8_000,
          items: [
            { label: 'MEMORIA.md', tokens: 5_300 },
            { label: 'convencoes-do-projeto.md', tokens: 2_700 },
          ],
        },
      ],
    },
    limits: [
      { label: 'Limite de 5 horas', used: 0.92, resets: 'Reinicia em 48 min' },
      { label: 'Semanal · todos os modelos', used: 0.67, resets: 'Reinicia ter 15:00' },
    ],
  },
};

export const SemGrupos: Story = {
  args: {
    defaultExpanded: true,
    context: {
      max: 100_000,
      segments: [
        { label: 'Mensagens', tokens: 31_000 },
        { label: 'Prompt do sistema', tokens: 6_000 },
        { label: 'Habilidades', tokens: 4_000 },
      ],
    },
    limits: [{ label: 'Limite diário', used: 0.12, resets: 'Reinicia em 9 h 20 min' }],
  },
};
