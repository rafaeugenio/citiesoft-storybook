import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Sparkline } from './Chart';

const meta = {
  title: 'Átomos/Gráficos/Sparkline',
  component: Sparkline,
  tags: ['autodocs', 'atom', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Sparkline. Spec: `03-components/charts-data-viz.md` v2.0.0.',
          'Átomo: é uma linha de tendência indivisível, sem eixo, legenda, tooltip, moldura, estados de carga ou tabela alternativa. Por isso o nome acessível é obrigatório: a prop `label` vira o `<title>` do SVG e é a única leitura possível do dado.',
          'Quando usar em vez dos irmãos: sparkline serve para tendência embutida num KPI, ao lado do número, quando não há espaço nem intenção de leitura precisa. Assim que o usuário precisar comparar valores exatos, promova para um organismo: `Organismos/Gráficos/LineChart` para série temporal, `Organismos/Gráficos/BarChart` para comparação por categoria com até 12 categorias, `Organismos/Gráficos/DonutChart` para composição de 3 a 6 fatias com excedente agrupado em "Outros".',
          'A validação de daltonismo da paleta oficial vale para este gráfico também e está documentada em `Organismos/Gráficos/BarChart`, na story "Paleta · validação".',
        ].join(' '),
      },
    },
  },
  args: {
    valores: [12, 18, 15, 24, 22, 31, 28, 36],
    label: 'Tendência de solicitações nos últimos 8 meses',
  },
} satisfies Meta<typeof Sparkline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const MiniGrafico: Story = {
  name: 'Sparkline',
  render: (args) => (
    <div style={{ width: 200 }}>
      <Sparkline {...args} />
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
