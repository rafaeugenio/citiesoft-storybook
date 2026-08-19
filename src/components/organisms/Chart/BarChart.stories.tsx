import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { BarChart } from './Chart';
import { PALETA_OFICIAL, PALETA_PROPOSTA } from '../../../tokens/paletas';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

const SERIES = [
  { rotulo: 'Solicitações', valores: [120, 138, 164, 151, 178, 190] },
  { rotulo: 'Aprovações', valores: [98, 110, 130, 128, 149, 161] },
];

const meta = {
  title: 'Organismos/Gráficos/BarChart',
  component: BarChart,
  tags: ['autodocs', 'organism', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Barras verticais agrupadas. Spec: `03-components/charts-data-viz.md` v2.0.0. A paleta categórica é a fonte única de verdade das séries: nunca pular cor e nunca reatribuir cor entre telas do mesmo produto.',
          'Organismo: traz moldura com título e subtítulo, legenda obrigatória a partir de duas séries, estados de carregando, vazio e erro, e a alternância para tabela acessível.',
          'Quando usar em vez dos irmãos: barras servem para comparação por categoria, com até 12 categorias. Para série temporal use `Organismos/Gráficos/LineChart`; para composição de 3 a 6 fatias use `Organismos/Gráficos/DonutChart`; para tendência embutida num KPI use `Átomos/Gráficos/Sparkline`.',
          'A validação de daltonismo da paleta oficial vale para todos os gráficos e está documentada aqui, na story "Paleta · validação".',
        ].join(' '),
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
          'O achado vale para todos os gráficos do sistema, não só para as barras.',
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
