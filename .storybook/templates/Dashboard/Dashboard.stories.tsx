import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  BarChart,
  DonutChart,
  EmptyState,
  FilterBar,
  KpiWidget,
  LineChart,
  PALETA_PROPOSTA,
  SelectButton,
  Sparkline,
} from '../../../src';
import { CelulaDoDashboard, Dashboard } from './Dashboard';

/**
 * Conteúdo neutro de propósito. O template não conhece domínio: quem sabe que o
 * indicador é de TFD é a página em `Páginas/Processos/Painel de TFD`.
 */

const PERIODOS = [
  { value: 'a', label: 'Período A' },
  { value: 'b', label: 'Período B' },
  { value: 'c', label: 'Período C' },
];

const FILTRO = (
  <FilterBar
    controles={<SelectButton legend="Período dos indicadores" options={PERIODOS} defaultValue={['b']} />}
    filtros={[{ id: 'periodo', rotulo: 'Período', valor: 'Período B', dimensao: 'data' }]}
  />
);

const INDICADORES = [1, 2, 3, 4].map((numero) => (
  <KpiWidget
    key={numero}
    rotulo={`Indicador ${numero}`}
    valor={`${numero * 128}`}
    periodo="Período B"
    variacao={{ percentual: numero % 2 === 0 ? 6.4 : -3.1, comparadoA: 'período anterior' }}
    grafico={
      <Sparkline
        valores={[4, 7, 6, 9, 8, 11].map((valor) => valor * numero)}
        label={`Tendência do indicador ${numero} no período B`}
        cor="var(--citie-chart-alt-1)"
      />
    }
    onDrillDown={() => {}}
  />
));

const CATEGORIAS = ['Cat. 1', 'Cat. 2', 'Cat. 3', 'Cat. 4'];

const SECOES = [
  {
    id: 'evolucao',
    titulo: 'Seção temática 1',
    descricao: 'Cada seção agrupa os gráficos de um assunto do módulo.',
    graficos: (
      <>
        <CelulaDoDashboard drillDown={{ rotulo: 'Ver listagem da série A' }}>
          <LineChart
            titulo="Gráfico de linha"
            subtitulo="Período B"
            categorias={CATEGORIAS}
            series={[
              { rotulo: 'Série A', valores: [18, 26, 22, 31] },
              { rotulo: 'Série B', valores: [12, 15, 19, 21] },
            ]}
            paleta={PALETA_PROPOSTA}
          />
        </CelulaDoDashboard>

        <CelulaDoDashboard drillDown={{ rotulo: 'Ver listagem por categoria' }}>
          <DonutChart
            titulo="Gráfico de rosca"
            subtitulo="Período B"
            fatias={CATEGORIAS.map((categoria, indice) => ({
              rotulo: categoria,
              valor: 40 - indice * 8,
            }))}
            paleta={PALETA_PROPOSTA}
          />
        </CelulaDoDashboard>
      </>
    ),
  },
  {
    id: 'distribuicao',
    titulo: 'Seção temática 2',
    graficos: (
      <CelulaDoDashboard largo drillDown={{ rotulo: 'Ver listagem completa' }}>
        <BarChart
          titulo="Gráfico de barras"
          subtitulo="Período B"
          categorias={CATEGORIAS}
          series={[{ rotulo: 'Série A', valores: [38, 21, 14, 12] }]}
          paleta={PALETA_PROPOSTA}
        />
      </CelulaDoDashboard>
    ),
  },
];

const meta = {
  title: 'Templates/Dashboard/Painel de indicadores',
  component: Dashboard,
  tags: ['template'],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: {
        d1920: { name: '1920 · desktop largo', styles: { width: '1920px', height: '1080px' } },
        d1366: { name: '1366 · notebook', styles: { width: '1366px', height: '900px' } },
        t768: { name: '768 · tablet', styles: { width: '768px', height: '1024px' } },
        m375: { name: '375 · telefone', styles: { width: '375px', height: '812px' } },
      },
    },
    docs: {
      description: {
        component: [
          'Estrutura da tela de painel de indicadores. Anatomia de `design-system/09-templates/tela-dashboard.md`, na ordem que a spec fixa:',
          '',
          '1. **Filtro global de período**, no topo, aplicado a todos os indicadores e gráficos da tela, sem exceção parcial silenciosa.',
          '2. **Linha de stat cards** com os KPIs principais.',
          '3. **Grid de gráficos** abaixo, organizado em seções temáticas.',
          '4. **Drill-down** em todo card e gráfico, levando à listagem filtrada correspondente.',
          '',
          'A ordem entre 2 e 3 é regra, não preferência: o valor absoluto orienta a leitura da tendência que vem em seguida. Nenhum dado é editável a partir daqui — toda escrita acontece na listagem ou no formulário de destino.',
          '',
          '**Componentes do sistema usados:** `FilterBar` e `SelectButton` (filtro de período), `KpiWidget` e `Sparkline` (stat cards), `LineChart`, `BarChart`, `DonutChart` e `MeterGroup` (grid), `ListaResumoWidget` (fila de atenção), `Card`, `Skeleton`, `EmptyState`, `StatusIndicator` e `Button`.',
          '',
          '**Regiões por slot:** `filtroDePeriodo`, `indicadores`, `secoes[].graficos` e `vazio`. A célula do grid é `CelulaDoDashboard`, que acopla a ação de drill-down ao gráfico — os stat cards já resolvem isso pelo `onDrillDown` do próprio `KpiWidget`.',
          '',
          '**Colunas:** 2 a 4 em tela larga, conforme a spec. A 1366 o grid de gráficos cai para 2 colunas, a 900 para 1, e a 600 os stat cards também empilham.',
        ].join('\n'),
      },
    },
  },
  args: {
    titulo: 'Título da tela',
    descricao: 'Uma linha de contexto sobre o recorte exibido.',
    filtroDePeriodo: FILTRO,
    indicadores: INDICADORES,
    secoes: SECOES,
  },
} satisfies Meta<typeof Dashboard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Estrutura: Story = {
  name: 'Estrutura completa',
};

export const TresColunas: Story = {
  name: 'Grid em 3 colunas',
  args: { colunasDosIndicadores: 3, colunasDosGraficos: 3 },
};

export const SemDadoNoPeriodo: Story = {
  name: 'Sem dado no período inteiro',
  args: {
    vazio: (
      <EmptyState
        size="md"
        situacao="busca-sem-resultado"
        titulo="Nenhum registro no período selecionado"
        descricao="Amplie o intervalo do filtro para ver os indicadores."
      />
    ),
  },
};

export const DesktopLargo: Story = {
  name: 'Responsivo · 1920',
  globals: { viewport: { value: 'd1920' } },
};

export const Notebook: Story = {
  name: 'Responsivo · 1366',
  globals: { viewport: { value: 'd1366' } },
};

export const Tablet: Story = {
  name: 'Responsivo · 768',
  globals: { viewport: { value: 't768' } },
};

export const Telefone: Story = {
  name: 'Responsivo · 375',
  globals: { viewport: { value: 'm375' } },
};
