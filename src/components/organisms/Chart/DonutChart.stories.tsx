import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { DonutChart } from './Chart';

const meta = {
  title: 'Organismos/Gráficos/DonutChart',
  component: DonutChart,
  tags: ['autodocs', 'organism', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Donut. Spec: `03-components/charts-data-viz.md` v2.0.0. A paleta categórica é a fonte única de verdade das séries: nunca pular cor e nunca reatribuir cor entre telas do mesmo produto.',
          'Organismo: traz a moldura comum dos gráficos, com título, legenda em coluna com valor por fatia, estados de carregando, vazio e erro, e alternância para tabela acessível. O centro mostra o total.',
          'Quando usar em vez dos irmãos: donut serve para composição de 3 a 6 fatias, com o excedente agrupado em "Outros". Para série temporal use `Organismos/Gráficos/LineChart`; para comparação por categoria, com até 12 categorias, use `Organismos/Gráficos/BarChart`; para tendência embutida num KPI use `Átomos/Gráficos/Sparkline`.',
          'A validação de daltonismo da paleta oficial vale para este gráfico também e está documentada em `Organismos/Gráficos/BarChart`, na story "Paleta · validação".',
        ].join(' '),
      },
    },
  },
  args: {
    titulo: 'Solicitações por situação',
    subtitulo: 'Março de 2025',
    fatias: [
      { rotulo: 'Aprovado', valor: 148 },
      { rotulo: 'Em Análise', valor: 96 },
      { rotulo: 'Devolvido', valor: 41 },
      { rotulo: 'Rascunho', valor: 22 },
    ],
  },
} satisfies Meta<typeof DonutChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rosca: Story = {
  name: 'Donut',
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
  args: {
    titulo: 'Solicitações por especialidade',
    subtitulo: 'Março de 2025',
    fatias: [
      { rotulo: 'Cardiologia', valor: 82 },
      { rotulo: 'Oncologia', valor: 64 },
      { rotulo: 'Ortopedia', valor: 51 },
      { rotulo: 'Neurologia', valor: 33 },
      { rotulo: 'Oftalmologia', valor: 28 },
      { rotulo: 'Dermatologia', valor: 12 },
      { rotulo: 'Pneumologia', valor: 9 },
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByText('Outros')).toBeVisible();
  },
};
