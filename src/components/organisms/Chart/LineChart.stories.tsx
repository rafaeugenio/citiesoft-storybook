import type { Meta, StoryObj } from '@storybook/react-vite';
import { LineChart } from './Chart';

const MESES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'];

const SERIES = [
  { rotulo: 'Solicitações', valores: [120, 138, 164, 151, 178, 190] },
  { rotulo: 'Aprovações', valores: [98, 110, 130, 128, 149, 161] },
];

const meta = {
  title: 'Organismos/Gráficos/LineChart',
  component: LineChart,
  tags: ['autodocs', 'organism', 'a11y'],
  parameters: {
    docs: {
      description: {
        component: [
          'Linha. Spec: `03-components/charts-data-viz.md` v2.0.0. A paleta categórica é a fonte única de verdade das séries: nunca pular cor e nunca reatribuir cor entre telas do mesmo produto.',
          'Organismo: compartilha a moldura dos demais gráficos, com título, legenda, estados de carregando, vazio e erro, e alternância para tabela acessível. Com até 4 séries o rótulo vai direto na ponta da linha, então a identidade não depende só da cor.',
          'Quando usar em vez dos irmãos: linha serve para série temporal, quando o que importa é a evolução ao longo do tempo. Para comparação por categoria, com até 12 categorias, use `Organismos/Gráficos/BarChart`; para composição de 3 a 6 fatias use `Organismos/Gráficos/DonutChart`; para tendência embutida num KPI use `Átomos/Gráficos/Sparkline`.',
          'A validação de daltonismo da paleta oficial vale para este gráfico também e está documentada em `Organismos/Gráficos/BarChart`, na story "Paleta · validação".',
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
} satisfies Meta<typeof LineChart>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Linha: Story = {
  name: 'Linha',
};
