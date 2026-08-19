import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { KpiWidget, type KpiProps } from './Widget';
import { Sparkline } from '../../atoms/Sparkline/Sparkline';

const meta = {
  title: 'Organismos/Painel/KpiWidget',
  component: KpiWidget,
  tags: ['autodocs', 'organism', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Widget de indicador do painel. Spec: `03-components/dashboard-widgets.md` v2.0.0. O valor principal nunca trunca, e a variação sempre traz ícone direcional mais número, nunca só cor.',
          '',
          '**Quando usar este e não o `ListaResumoWidget`:** o KPI responde "qual é o número agora". Ele mostra uma medida única do período, e toda variação vem acompanhada do período de comparação explícito ("12,4% acima de fevereiro"), nunca sinalizada só por cor. Se a pergunta do usuário não for um número, e sim "o que exige minha atenção agora" — uma fila nominal de 3 a 7 itens com link para ver tudo —, o componente certo é o `ListaResumoWidget`.',
          '',
          '**Quando não usar:** número que só significa alguma coisa junto da sua composição',
          '(solicitações abertas separadas por secretaria), porque o KPI mostra um valor só e o',
          'servidor fica sem saber de onde ele veio, caso do `BarChart` ou da `Table`; série',
          'histórica em que a forma da curva é a informação, papel do `LineChart` (o `Sparkline`',
          'dentro do KPI é apoio, e não substitui o gráfico com eixo e rótulo); progresso de uma',
          'operação em andamento, que é `ProgressBar`, já que a barra de meta do KPI descreve',
          'atingimento de alvo e não avanço de tarefa; situação de um processo específico, que é',
          '`StatusIndicator` ou `Tag` na linha da listagem; e valor único dentro de uma tela de',
          'detalhe ou de formulário, onde o cartão de painel rouba a hierarquia da tela e o certo é',
          'a lista de definições do `Card`.',
          '',
          '**Indicador que filtra e indicador que navega são coisas diferentes.** Com `onFiltrar`,',
          'o indicador aplica e retira o recorte na listagem que vem logo abaixo: o operador',
          'permanece na tela, o estado fica ligado, e por isso o cartão é um controle de',
          'alternância, com `aria-pressed`, anel de seleção e fundo recuado. Com `onDrillDown`, ele',
          'leva para outra tela: não sobra estado ligado, então é botão comum, sem `aria-pressed` e',
          'sem estado ativo. Marcar um indicador de navegação como pressionado prometeria um filtro',
          'que a tela não tem, e é a confusão que a separação das duas props existe para evitar.',
          '',
          'O anel de seleção é `inset` e fica reservado em transparente desde o repouso, então',
          'aplicar um filtro não desloca nada. Sem essa reserva, a faixa inteira de indicadores',
          'pula a cada clique do operador. Para a faixa contínua de 3 a 8 indicadores, use o',
          '`KpiFaixa`.',
          '',
          'Peso B2G: um número grande sem período vira decisão errada em reunião. O campo `periodo`',
          'é obrigatório de propósito, e `variacao` exige `comparadoA` pelo mesmo motivo. Se o',
          'painel tem filtro de competência ou de unidade, o recorte aplicado precisa aparecer no',
          '`rotulo` ou no `periodo`, senão dois servidores leem o mesmo cartão com números',
          'diferentes e nenhum dos dois percebe.',
        ].join('\n'),
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

/** Demonstração da alternância: o estado do filtro vive na tela que hospeda o indicador. */
function FiltroAlternavel(props: KpiProps) {
  const [ativo, setAtivo] = useState(false);
  return <KpiWidget {...props} ativo={ativo} onFiltrar={() => setAtivo((valor) => !valor)} />;
}

export const KpiComoFiltro: Story = {
  name: 'Estado · como filtro',
  args: {
    rotulo: 'Em análise',
    valor: '128',
    periodo: 'Fila atual',
  },
  parameters: {
    docs: {
      description: {
        story: [
          'Com `onFiltrar`, o indicador vira controle de alternância: clicar aplica o recorte na',
          'listagem logo abaixo e o cartão fica marcado como ativo; clicar de novo retira. Por isso',
          'ele declara `aria-pressed`, que o leitor de tela anuncia como "pressionado".',
          '',
          'O anel de seleção é `inset` e existe desde o repouso em transparente, então ativar o',
          'filtro não desloca nada. Sem essa reserva, a faixa inteira de indicadores pula a cada',
          'clique do operador.',
        ].join('\n'),
      },
    },
  },
  render: (args) => <FiltroAlternavel {...args} />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const indicador = canvas.getByRole('button', { name: /Em análise/ });
    await expect(indicador).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(indicador);
    await expect(indicador).toHaveAttribute('aria-pressed', 'true');
    await userEvent.click(indicador);
    await expect(indicador).toHaveAttribute('aria-pressed', 'false');
  },
};

export const FiltroContraNavegacao: Story = {
  name: 'Composição · filtro contra navegação',
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        story: [
          'Os dois comportamentos não podem se confundir, nem visualmente nem para o leitor de tela.',
          '',
          '`onFiltrar` é alternância: o operador permanece na tela, o recorte fica aplicado e o',
          'estado ligado se lê parado, por anel de seleção e fundo recuado, além de `aria-pressed`.',
          '',
          '`onDrillDown` é navegação: o operador sai para outra tela e não fica nada ligado atrás,',
          'então o cartão é botão comum, sem `aria-pressed` e sem estado ativo. Marcar um indicador',
          'de navegação como pressionado prometeria um filtro que a tela não tem.',
        ].join('\n'),
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', gap: 16, padding: 24 }}>
      <KpiWidget
        rotulo="Em análise"
        valor="128"
        periodo="Fila atual"
        ativo
        onFiltrar={() => {}}
      />
      <KpiWidget
        rotulo="Painel completo"
        valor="1.183"
        periodo="Março de 2025"
        onDrillDown={() => {}}
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /Em análise/ })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    // A navegação nunca declara estado ligado.
    await expect(canvas.getByRole('button', { name: /Painel completo/ })).not.toHaveAttribute(
      'aria-pressed',
    );
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
