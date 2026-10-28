import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentCreator } from '@/components/application/multi-agent-chat/agent-editor';
import type { Agent } from '@/components/application/multi-agent-chat/data';
import { FOLD_CONFIG } from '@/components/application/agent-avatar/model';

const agenteBase: Agent = {
  id: 'atendimento',
  name: 'Assistente de atendimento',
  label: 'Atendimento',
  description: 'Responde dúvidas de cidadãos com clareza e encaminha cada caso para o setor certo.',
  avatar: { ...FOLD_CONFIG, hue: 220, saturation: 85, eyes: 'happy', seed: 21 },
};

const agenteNovo: Agent = {
  id: 'novo',
  name: '',
  label: '',
  description: '',
  avatar: { ...FOLD_CONFIG, hue: 259, saturation: 75, eyes: 'curious', seed: 7 },
};

const meta = {
  title: 'Blocos/AgentCreator',
  component: AgentCreator,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { agent: agenteBase, onChange: () => {} },
  render: function Render(args) {
    const [agent, setAgent] = useState<Agent>(args.agent);
    return (
      <div className="mx-auto h-[760px] w-[380px] border-x border-border-button-default">
        <AgentCreator {...args} agent={agent} onChange={setAgent} />
      </div>
    );
  },
} satisfies Meta<typeof AgentCreator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {};

export const NovoAgente: Story = { args: { agent: agenteNovo } };

export const ComBotaoFechar: Story = { args: { onClose: () => {} } };

export const CorPersonalizada: Story = {
  args: {
    agent: {
      ...agenteBase,
      id: 'pesquisa',
      name: 'Analista de pesquisa',
      label: 'Pesquisa',
      description: 'Organiza entrevistas e aponta padrões que merecem ser testados.',
      avatar: { ...FOLD_CONFIG, hue: 31, saturation: 89, eyes: 'thinking', seed: 44 },
    },
  },
};
