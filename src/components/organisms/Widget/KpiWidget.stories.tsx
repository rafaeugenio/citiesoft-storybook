import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { KpiWidget } from './Widget';
import { Sparkline } from '../../organisms/Chart/Chart';

const meta = {
  title: 'Organismos/Painel/KpiWidget',
  component: KpiWidget,
  tags: ['autodocs', 'organism', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Widget de indicador do painel. Spec: `03-components/dashboard-widgets.md` v2.0.0. O valor principal nunca trunca, e a variação sempre traz ícone direcional mais número, nunca só cor.\n\n**Quando usar este e não o `ListaResumoWidget`:** o KPI responde "qual é o número agora". Ele mostra uma medida única do período, e toda variação vem acompanhada do período de comparação explícito ("12,4% acima de fevereiro"), nunca sinalizada só por cor. Se a pergunta do usuário não for um número, e sim "o que exige minha atenção agora" — uma fila nominal de 3 a 7 itens com link para ver tudo —, o componente certo é o `ListaResumoWidget`.',
      },
    },
  },
  args: {
    rotulo: 'Solicitações no mês',
    valor: '1.183',
    periodo: 'Março de 2025',
  },
} satisfies Meta<typeof KpiWidget>;

export default meta;
type Story = StoryObj<typeof meta>;

export const KpiSimples: Story = {
  name: 'KPI · simples',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('1.183')).toBeVisible();
    await expect(canvas.getByText('Março de 2025')).toBeVisible();
  },
};

export const KpiComVariacao: Story = {
  name: 'KPI · com variação',
  args: { variacao: { percentual: 12.4, comparadoA: 'fevereiro' } },
  parameters: {
    docs: {
      description: {
        story: 'O período de comparação é sempre explícito, nunca só uma seta colorida.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/acima de fevereiro/)).toBeVisible();
  },
};

export const KpiEmQueda: Story = {
  name: 'KPI · variação negativa',
  args: {
    rotulo: 'Prazo médio de análise',
    valor: '4,2 dias',
    variacao: { percentual: -8.1, comparadoA: 'fevereiro' },
  },
};

export const KpiComMeta: Story = {
  name: 'KPI · com meta',
  args: { meta: { atual: 1183, alvo: 1500 } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('progressbar', {
      name: 'Atingimento da meta de Solicitações no mês',
    });
    await expect(barra).toHaveAttribute('aria-valuenow', '79');
  },
};

export const KpiComSparkline: Story = {
  name: 'KPI · com mini-gráfico',
  args: {
    variacao: { percentual: 12.4, comparadoA: 'fevereiro' },
    grafico: (
      <Sparkline
        valores={[820, 910, 870, 1020, 1090, 1183]}
        label="Tendência de solicitações nos últimos 6 meses"
      />
    ),
  },
};

export const KpiVazio: Story = {
  name: 'Estado · vazio',
  args: { estado: 'vazio', variacao: { percentual: 5, comparadoA: 'fevereiro' } },
  parameters: {
    docs: {
      description: {
        story: 'Valor vira traço e a variação some, porque não há base de comparação.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('—')).toBeVisible();
    await expect(canvas.queryByText(/acima de/)).toBeNull();
  },
};

export const KpiCarregando: Story = {
  name: 'Estado · carregando',
  args: { estado: 'carregando' },
};

export const KpiComErro: Story = {
  name: 'Estado · erro',
  args: { estado: 'erro' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('Falha ao carregar');
    await expect(canvas.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
  },
};

export const KpiComDrillDown: Story = {
  name: 'Estado · com drill-down',
  args: { onDrillDown: () => {}, variacao: { percentual: 12.4, comparadoA: 'fevereiro' } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Com ação, o widget inteiro é focável por teclado.
    await expect(canvas.getByRole('button', { name: /Solicitações no mês/ })).toBeVisible();
  },
};

export const Painel: Story = {
  name: 'Composição · grade de painel',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story:
          'Composição, não um componente próprio: vários `KpiWidget` lado a lado formam a grade do painel. Demonstra como os indicadores convivem na mesma faixa — variação, meta e forma compacta — e como a grade se reflui por `auto-fit`.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 16,
        padding: 24,
      }}
    >
      <KpiWidget rotulo="Solicitações no mês" valor="1.183" periodo="Março de 2025" variacao={{ percentual: 12.4, comparadoA: 'fevereiro' }} />
      <KpiWidget rotulo="Aprovadas" valor="864" periodo="Março de 2025" meta={{ atual: 864, alvo: 1000 }} />
      <KpiWidget rotulo="Prazo médio" valor="4,2 dias" periodo="Março de 2025" variacao={{ percentual: -8.1, comparadoA: 'fevereiro' }} />
      <KpiWidget rotulo="Devolvidas" valor="41" periodo="Março de 2025" compacto />
    </div>
  ),
};
