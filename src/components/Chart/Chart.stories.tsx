import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  BarChart,
  DonutChart,
  LineChart,
  PALETA_OFICIAL,
  PALETA_PROPOSTA,
  Sparkline,
} from './Chart';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

const SERIES = [
  { rotulo: 'Solicitações', valores: [120, 138, 164, 151, 178, 190] },
  { rotulo: 'Aprovações', valores: [98, 110, 130, 128, 149, 161] },
];

const meta = {
  title: 'Dados/Gráficos',
  component: BarChart,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Gráficos. Spec: `03-components/charts-data-viz.md` v2.0.0. A paleta categórica é a fonte única de verdade das séries: nunca pular cor e nunca reatribuir cor entre telas do mesmo produto.',
      },
    },
  },
  args: {
    titulo: 'Solicitações de TFD por mês',
    subtitulo: 'Janeiro a junho de 2025',
    categorias: MESES,
    series: SERIES,
  },
} satisfies Meta<typeof BarChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Barras: Story = {
  name: 'Barras verticais',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Com 2 séries ou mais a legenda é obrigatória.
    await expect(canvas.getByText('Solicitações')).toBeVisible();
    await expect(canvas.getByText('Aprovações')).toBeVisible();
  },
};

export const Linha: Story = {
  name: 'Linha',
  render: (args) => <LineChart {...args} />,
};

export const VerTabela: Story = {
  name: 'A11y · alternar para tabela',
  parameters: {
    docs: {
      description: {
        story:
          'A leitura do dado nunca depende do gráfico: a tabela alternativa expõe todos os valores exatos.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Ver tabela' }));
    const tabela = canvas.getByRole('table');

    await expect(within(tabela).getByRole('columnheader', { name: 'Solicitações' })).toBeVisible();
    await expect(within(tabela).getByRole('rowheader', { name: 'Jan' })).toBeVisible();
    await expect(within(tabela).getByText('190')).toBeVisible();

    await userEvent.click(canvas.getByRole('button', { name: 'Ver gráfico' }));
    await expect(canvas.queryByRole('table')).toBeNull();
  },
};

export const Rosca: Story = {
  name: 'Donut',
  render: () => (
    <DonutChart
      titulo="Solicitações por situação"
      subtitulo="Março de 2025"
      fatias={[
        { rotulo: 'Aprovado', valor: 148 },
        { rotulo: 'Em Análise', valor: 96 },
        { rotulo: 'Devolvido', valor: 41 },
        { rotulo: 'Rascunho', valor: 22 },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('307')).toBeVisible();
  },
};

export const RoscaComExcedente: Story = {
  name: 'Donut · excedente em "Outros"',
  parameters: {
    docs: {
      description: {
        story: 'Composição de 3 a 6 fatias; o que passa disso é agrupado em "Outros".',
      },
    },
  },
  render: () => (
    <DonutChart
      titulo="Solicitações por especialidade"
      subtitulo="Março de 2025"
      fatias={[
        { rotulo: 'Cardiologia', valor: 82 },
        { rotulo: 'Oncologia', valor: 64 },
        { rotulo: 'Ortopedia', valor: 51 },
        { rotulo: 'Neurologia', valor: 33 },
        { rotulo: 'Oftalmologia', valor: 28 },
        { rotulo: 'Dermatologia', valor: 12 },
        { rotulo: 'Pneumologia', valor: 9 },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Outros')).toBeVisible();
  },
};

export const Vazio: Story = {
  name: 'Estado · vazio',
  args: { estado: 'vazio' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByText('Nenhum dado encontrado para o período selecionado'),
    ).toBeVisible();
  },
};

export const Erro: Story = {
  name: 'Estado · erro',
  args: { estado: 'erro' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('alert')).toHaveTextContent('Não foi possível carregar os dados');
    await expect(canvas.getByRole('button', { name: 'Tentar novamente' })).toBeVisible();
  },
};

export const Carregando: Story = {
  name: 'Estado · carregando',
  args: { estado: 'carregando' },
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('status', { name: /Carregando/ }),
    ).toHaveAttribute('aria-busy', 'true');
  },
};

export const MiniGrafico: Story = {
  name: 'Sparkline',
  render: () => (
    <div style={{ width: 200 }}>
      <Sparkline
        valores={[12, 18, 15, 24, 22, 31, 28, 36]}
        label="Tendência de solicitações nos últimos 8 meses"
      />
    </div>
  ),
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole('img', {
        name: 'Tendência de solicitações nos últimos 8 meses',
      }),
    ).toBeVisible();
  },
};

export const ValidacaoDaPaleta: Story = {
  name: 'Paleta · validação',
  parameters: {
    docs: {
      description: {
        story: [
          'A paleta categórica oficial da spec reprova a validação de daltonismo.',
          'Com 4 séries, âmbar #F59E0B e verde #22C55E ficam a ΔE 5,7 em protanopia (abaixo do piso de 6).',
          'No conjunto de 8, verde #22C55E e teal #14B8A6 ficam a ΔE 11,3 mesmo para visão tricromata.',
          'Quatro cores também ficam abaixo de 3:1 contra o fundo claro.',
          'A proposta abaixo passa em todos os checks, em claro e escuro, mantendo o azul de marca na primeira posição.',
        ].join(' '),
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 24, fontFamily: 'var(--citie-font-ui)' }}>
      <div>
        <h4 style={{ margin: '0 0 8px', fontSize: 14 }}>Oficial da spec (reprova)</h4>
        <div style={{ display: 'flex', gap: 4 }}>
          {PALETA_OFICIAL.map((cor) => (
            <span
              key={cor}
              style={{ width: 48, height: 32, borderRadius: 4, backgroundColor: cor }}
            />
          ))}
        </div>
      </div>
      <div>
        <h4 style={{ margin: '0 0 8px', fontSize: 14 }}>Proposta corrigida (aprova)</h4>
        <div style={{ display: 'flex', gap: 4 }}>
          {PALETA_PROPOSTA.map((cor) => (
            <span
              key={cor}
              style={{ width: 48, height: 32, borderRadius: 4, backgroundColor: cor }}
            />
          ))}
        </div>
      </div>
      <BarChart
        titulo="Mesmo gráfico com a paleta proposta"
        subtitulo="Janeiro a junho de 2025"
        categorias={MESES}
        series={SERIES}
        paleta={PALETA_PROPOSTA}
      />
    </div>
  ),
  play: async () => {
    await expect(PALETA_OFICIAL).toHaveLength(8);
    await expect(PALETA_PROPOSTA).toHaveLength(6);
  },
};
