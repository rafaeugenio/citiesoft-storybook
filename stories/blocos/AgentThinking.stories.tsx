import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentThinking } from '@/components/application/agent-thinking/agent-thinking';

const meta = {
  title: 'Blocos/AgentThinking',
  component: AgentThinking,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { label: 'Pensando' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['wave', 'spin', 'stars', 'infinity'] },
    tone: { control: 'inline-radio', options: ['subtle', 'default', 'primary', 'accent'] },
    shimmer: { control: 'boolean' },
    showTimer: { control: 'boolean' },
  },
} satisfies Meta<typeof AgentThinking>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const Variantes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-5">
      {(['wave', 'spin', 'stars', 'infinity'] as const).map((variant) => (
        <AgentThinking key={variant} {...args} variant={variant} label={`Variante ${variant}`} />
      ))}
    </div>
  ),
};

export const Tons: Story = {
  render: (args) => (
    <div className="flex flex-col gap-5">
      {(['subtle', 'default', 'primary', 'accent'] as const).map((tone) => (
        <AgentThinking key={tone} {...args} tone={tone} label={`Tom ${tone}`} />
      ))}
    </div>
  ),
};

export const BuscandoNaDocumentacao: Story = {
  args: { variant: 'infinity', label: 'Buscando na documentação', tone: 'accent' },
};

export const SemTemporizador: Story = { args: { variant: 'stars', showTimer: false } };

export const SemBrilho: Story = { args: { shimmer: false, label: 'Analisando o contrato' } };
