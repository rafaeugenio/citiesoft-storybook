import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AgentProgress } from '@/components/application/agent-progress/agent-progress';
import { Button } from '@/components/base/buttons/button';

const etapasMigracao = [
  'Ler os arquivos do projeto',
  'Mapear os campos da planilha antiga',
  'Criar as tabelas de cadastro',
  'Importar os registros de exemplo',
  'Rodar os testes e conferir os totais',
] as const;

const meta = {
  title: 'Blocos/AgentProgress',
  component: AgentProgress,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: { stepDuration: 1800 },
  argTypes: {
    stepDuration: { control: { type: 'number', min: 0, step: 200 } },
    completionDelay: { control: { type: 'number', min: 0, step: 200 } },
    paused: { control: 'boolean' },
  },
} satisfies Meta<typeof AgentProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  // As etapas animam a opacidade; o axe só mede depois que a transição termina.
  play: async () => {
    await new Promise((resolve) => setTimeout(resolve, 600));
  },
};

export const EtapasPersonalizadas: Story = { args: { steps: etapasMigracao } };

export const EtapasRapidas: Story = {
  args: { steps: ['Buscar o cadastro', 'Validar o CPF fictício', 'Salvar alterações'], stepDuration: 900 },
};

export const Pausado: Story = { args: { steps: etapasMigracao, paused: true } };

export const ComCallbackAoFinalizar: Story = {
  args: { steps: ['Preparar o relatório', 'Gerar o PDF'], stepDuration: 1200, completionDelay: 800 },
  render: function Render(args) {
    const [rodada, setRodada] = useState(0);
    const [concluido, setConcluido] = useState(false);
    return (
      <div className="flex flex-col items-center gap-4">
        <AgentProgress
          key={rodada}
          {...args}
          onFinished={() => setConcluido(true)}
        />
        <p className="text-body-regular text-text-secondary">
          {concluido ? 'Tarefa concluída.' : 'Tarefa em andamento...'}
        </p>
        <Button
          color="secondary"
          size="small"
          onClick={() => {
            setConcluido(false);
            setRodada((r) => r + 1);
          }}
        >
          Reiniciar
        </Button>
      </div>
    );
  },
};
