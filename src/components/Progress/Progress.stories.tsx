import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ProgressBar, Spinner } from './Progress';

const meta = {
  title: 'Feedback/Progresso',
  component: ProgressBar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Barra de progresso e spinner. Spec: `03-components/progress-indicators.md` v2.0.0. Regra dura: nunca exibir a barra sem mensagem descritiva, e a mensagem nomeia o artefato em processamento.',
      },
    },
  },
  args: {
    rotulo: 'Importando lançamentos',
    valor: 39,
    mensagem: '47 de 120 registros processados',
  },
} satisfies Meta<typeof ProgressBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Determinada: Story = {
  name: 'Estado · em progresso',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('progressbar', { name: 'Importando lançamentos' });

    await expect(barra).toHaveAttribute('aria-valuenow', '39');
    await expect(barra).toHaveAttribute('aria-valuemin', '0');
    await expect(barra).toHaveAttribute('aria-valuemax', '100');
    // O texto complementar traduz o percentual quando o número não basta.
    await expect(barra).toHaveAttribute('aria-valuetext', '47 de 120 registros processados');
  },
};

export const Indeterminada: Story = {
  name: 'Estado · indeterminada',
  args: {
    valor: undefined,
    rotulo: 'Consultando o SIGEP',
    mensagem: 'Buscando o histórico do processo 2025/0481',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Sem duração conhecida o valor atual é omitido para o leitor de tela. Nunca manter esse estado por mais de 30 segundos sem atualizar a mensagem.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('progressbar', { name: 'Consultando o SIGEP' });
    await expect(barra).not.toHaveAttribute('aria-valuenow');
  },
};

export const Concluida: Story = {
  name: 'Estado · concluída',
  args: {
    valor: 100,
    estado: 'concluido',
    mensagem: '120 registros importados com sucesso',
  },
};

export const ConcluidaComPendencias: Story = {
  name: 'Estado · concluída com pendências',
  args: {
    valor: 100,
    estado: 'concluido-com-pendencias',
    mensagem: '118 registros importados, 2 exigiram atenção',
  },
};

export const Erro: Story = {
  name: 'Estado · erro',
  args: {
    valor: 62,
    estado: 'erro',
    mensagem: 'A importação parou na linha 74. Tente novamente.',
  },
};

export const ComEtapas: Story = {
  name: 'Variante · etapas nomeadas',
  args: {
    valor: 66,
    etapa: { atual: 2, total: 3 },
    rotulo: 'Fechamento da competência',
    mensagem: 'Conferindo os lançamentos de março de 2025',
  },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText(/Fechamento da competência · etapa 2 de 3/),
    ).toBeVisible();
  },
};

export const Alturas: Story = {
  name: 'Alturas · 4 / 8 / 12px',
  parameters: {
    docs: {
      description: {
        story: '4px em faixa global de página, 8px dentro de modal ou card, 12px em tela dedicada.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'grid', gap: 24 }}>
      <ProgressBar {...args} altura={4} rotulo="Faixa de página" />
      <ProgressBar {...args} altura={8} rotulo="Dentro de card" />
      <ProgressBar {...args} altura={12} rotulo="Tela dedicada" />
    </div>
  ),
};

export const SpinnerTamanhos: Story = {
  name: 'Spinner · tamanhos',
  render: () => (
    <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
      <Spinner label="Carregando a lista de processos" size="sm" />
      <Spinner label="Carregando o cadastro do servidor" size="md" />
      <Spinner label="Carregando o relatório de diárias" size="lg" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // O nome descreve a operação, nunca "Carregando" solto.
    await expect(canvas.getByRole('status', { name: 'Carregando a lista de processos' })).toBeVisible();
  },
};
