import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ProgressBar } from './Progress';

const meta = {
  title: 'Átomos/Feedback/ProgressBar',
  component: ProgressBar,
  tags: ['autodocs', 'atom', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Barra de progresso de operação com duração perceptível. Spec: `03-components/progress-indicators.md` v2.0.0. Regra dura: nunca exibir a barra sem mensagem descritiva, e a mensagem nomeia o artefato em processamento ("Processando..." isolado é inaceitável).\n\n**Quando usar esta e não o Spinner:** a barra serve quando a espera passa de 3 segundos **e** existe progresso mensurável ou etapa nomeada — o sistema sabe o percentual concluído (importação de planilha, geração de relatório) ou consegue nomear a fase atual do fluxo multifase. Vale também no modo indeterminado quando a operação claramente demora, como a sincronização com sistema externo. Se não há progresso algum a comunicar e a espera é uma ação pontual de 500ms a 3 segundos, o componente certo é o `Spinner`. Se a forma do conteúdo já é conhecida antes do dado chegar, o certo é Skeleton; se a leitura é analítica de proporções ou metas, sem operação em curso, é MeterGroup.',
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
