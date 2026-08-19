import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import {
  BarChart,
  Button,
  Card,
  DonutChart,
  EmptyState,
  FilterBar,
  KpiWidget,
  LineChart,
  ListaResumoWidget,
  MeterGroup,
  PALETA_PROPOSTA,
  SelectButton,
  SkeletonLista,
  SkeletonRegion,
  Sparkline,
  StatusIndicator,
} from '../../src';
import { CelulaDoDashboard, Dashboard } from '../templates/Dashboard/Dashboard';
import {
  DADOS_POR_PERIODO,
  PERIODOS,
  PERIODO_SEM_DADO,
  type DadosDoPainel,
  type PeriodoId,
} from '../fixtures/painel-tfd';

/**
 * Painel de TFD — instância do template `Templates/Dashboard/Painel de indicadores`
 * com dados fictícios do acompanhamento de Tratamento Fora do Domicílio.
 */

type EstadoDaTela = 'default' | 'carregando' | 'vazio' | 'erro';

const formatarReais = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

/** Bloco de carregamento para os widgets que ainda não têm estado próprio. */
function BlocoCarregando({ titulo }: { titulo: string }) {
  return (
    <Card titulo={titulo}>
      <SkeletonRegion label={`Carregando ${titulo.toLowerCase()}`}>
        <SkeletonLista itens={4} />
      </SkeletonRegion>
    </Card>
  );
}

function BlocoComErro({ titulo }: { titulo: string }) {
  return (
    <Card titulo={titulo} erro>
      <EmptyState
        size="sm"
        situacao="erro"
        titulo="Não foi possível carregar este bloco"
        descricao="Os demais indicadores da tela continuam disponíveis."
        codigoErro="TFD-DASH-502"
        acaoPrimaria={{ rotulo: 'Tentar novamente' }}
      />
    </Card>
  );
}

interface PainelProps {
  estado?: EstadoDaTela;
  periodoInicial?: PeriodoId;
}

function PainelDeTFD({ estado = 'default', periodoInicial = 'mes' }: PainelProps) {
  const [periodo, setPeriodo] = useState<PeriodoId>(periodoInicial);

  const dados: DadosDoPainel = estado === 'vazio' ? PERIODO_SEM_DADO : DADOS_POR_PERIODO[periodo];
  const estadoDoWidget = estado === 'default' ? 'default' : estado;
  const totalRecebidas = dados.situacao.reduce((soma, fatia) => soma + fatia.valor, 0);

  const filtro = (
    <FilterBar
      controles={
        <SelectButton
          legend="Período dos indicadores"
          options={PERIODOS}
          defaultValue={[periodoInicial]}
          onChangeValue={(valores) => setPeriodo(valores[0] as PeriodoId)}
        />
      }
      filtros={[
        { id: 'periodo', rotulo: 'Período', valor: dados.intervalo, dimensao: 'data' },
        { id: 'secretaria', rotulo: 'Secretaria', valor: 'SES · Regulação', dimensao: 'select' },
      ]}
      resultado={{ total: totalRecebidas, substantivo: ['solicitação', 'solicitações'] }}
    />
  );

  const indicadores = dados.indicadores.map((indicador) => (
    <KpiWidget
      key={indicador.id}
      rotulo={indicador.rotulo}
      valor={indicador.valor}
      periodo={dados.intervalo}
      variacao={estado === 'default' ? indicador.variacao : undefined}
      estado={estadoDoWidget}
      grafico={
        estado === 'default' ? (
          <Sparkline
            valores={indicador.tendencia}
            label={`Tendência de ${indicador.rotulo.toLowerCase()} em ${dados.intervalo}`}
            cor="var(--citie-chart-alt-1)"
          />
        ) : undefined
      }
      onDrillDown={() => {}}
    />
  ));

  const secoes = [
    {
      id: 'fluxo',
      titulo: 'Fluxo de solicitações',
      descricao: 'Quanto entra na regulação e quanto sai autorizado no período filtrado.',
      graficos: (
        <>
          <CelulaDoDashboard drillDown={{ rotulo: 'Ver solicitações do período' }}>
            <LineChart
              titulo="Recebidas e autorizadas"
              subtitulo={dados.intervalo}
              categorias={dados.fluxo.categorias}
              series={dados.fluxo.series}
              paleta={PALETA_PROPOSTA}
              estado={estadoDoWidget}
            />
          </CelulaDoDashboard>

          <CelulaDoDashboard drillDown={{ rotulo: 'Ver solicitações por situação' }}>
            <DonutChart
              titulo="Solicitações por situação"
              subtitulo={dados.intervalo}
              fatias={dados.situacao}
              paleta={PALETA_PROPOSTA}
              estado={estadoDoWidget}
            />
          </CelulaDoDashboard>
        </>
      ),
    },
    {
      id: 'destino-custo',
      titulo: 'Destino e custo',
      descricao: 'Para onde o paciente viaja e quanto a ajuda de custo compromete no período.',
      graficos: (
        <>
          <CelulaDoDashboard drillDown={{ rotulo: 'Ver viagens por município' }}>
            <BarChart
              titulo="Viagens por município de destino"
              subtitulo={dados.intervalo}
              categorias={dados.destinos.categorias}
              series={dados.destinos.series}
              paleta={PALETA_PROPOSTA}
              estado={estadoDoWidget}
            />
          </CelulaDoDashboard>

          <CelulaDoDashboard drillDown={{ rotulo: 'Ver autorizações por especialidade' }}>
            {estado === 'carregando' ? (
              <BlocoCarregando titulo="Autorizações por especialidade" />
            ) : estado === 'erro' ? (
              <BlocoComErro titulo="Autorizações por especialidade" />
            ) : (
              <Card titulo="Autorizações por especialidade" subtitulo={dados.intervalo}>
                <MeterGroup
                  titulo="Distribuição por especialidade"
                  faixas={dados.especialidades}
                  paleta={PALETA_PROPOSTA}
                  unidade="autorizações"
                  espessura={8}
                />
              </Card>
            )}
          </CelulaDoDashboard>
        </>
      ),
    },
    {
      id: 'atencao',
      titulo: 'Fila de atenção',
      descricao: 'Processos com prazo curto na regulação, para agir antes do vencimento.',
      colunas: 2 as const,
      graficos: (
        <>
          <CelulaDoDashboard drillDown={{ rotulo: 'Ver processos com prazo crítico' }}>
            {estado === 'carregando' ? (
              <BlocoCarregando titulo="Processos com prazo crítico" />
            ) : estado === 'erro' ? (
              <BlocoComErro titulo="Processos com prazo crítico" />
            ) : dados.prazos.length === 0 ? (
              <Card titulo="Processos com prazo crítico">
                <EmptyState
                  size="sm"
                  situacao="busca-sem-resultado"
                  titulo="Nenhum processo com prazo crítico"
                  descricao={`Não há processo vencendo entre ${dados.intervalo}. Amplie o período para ver mais.`}
                />
              </Card>
            ) : (
              <ListaResumoWidget
                titulo="Processos com prazo crítico"
                alerta="warn"
                itens={dados.prazos.map((item) => ({
                  id: item.id,
                  principal: item.principal,
                  secundario: item.secundario,
                  marcador: <StatusIndicator estado={item.estado} size="sm" />,
                }))}
                onVerTudo={() => {}}
              />
            )}
          </CelulaDoDashboard>

          <CelulaDoDashboard drillDown={{ rotulo: 'Ver lançamentos de ajuda de custo' }}>
            {estado === 'carregando' ? (
              <BlocoCarregando titulo="Ajuda de custo por situação" />
            ) : estado === 'erro' ? (
              <BlocoComErro titulo="Ajuda de custo por situação" />
            ) : (
              <Card titulo="Ajuda de custo por situação" subtitulo={dados.intervalo}>
                <MeterGroup
                  titulo="Empenho por situação do lançamento"
                  faixas={
                    dados.situacao.length === 0
                      ? []
                      : [
                          { rotulo: 'Pago', valor: Math.round(totalRecebidas * 420) },
                          { rotulo: 'Empenhado', valor: Math.round(totalRecebidas * 180) },
                          { rotulo: 'Em conferência', valor: Math.round(totalRecebidas * 90) },
                        ]
                  }
                  paleta={PALETA_PROPOSTA}
                  formatar={formatarReais}
                  espessura={8}
                />
              </Card>
            )}
          </CelulaDoDashboard>
        </>
      ),
    },
  ];

  return (
    <Dashboard
      titulo="Painel de TFD"
      descricao="Acompanhamento das solicitações de Tratamento Fora do Domicílio na regulação estadual."
      acoes={
        <>
          <Button variant="secondary" size="small">
            Exportar painel
          </Button>
          <Button variant="text" size="small">
            Atualizar dados
          </Button>
        </>
      }
      filtroDePeriodo={filtro}
      indicadores={indicadores}
      secoes={secoes}
    />
  );
}

const meta = {
  title: 'Páginas/Processos/Painel de TFD',
  component: PainelDeTFD,
  tags: ['page'],
  parameters: {
    layout: 'fullscreen',
    viewport: {
      options: {
        d1366: { name: '1366 · notebook', styles: { width: '1366px', height: '900px' } },
        m375: { name: '375 · telefone', styles: { width: '375px', height: '812px' } },
      },
    },
    docs: {
      description: {
        component: [
          'Painel gerencial do TFD (Tratamento Fora do Domicílio) sobre o template `Templates/Dashboard/Painel de indicadores`. Anatomia de `design-system/09-templates/tela-dashboard.md`: filtro global de período, linha de stat cards, grid de gráficos em seções temáticas e drill-down em todo card e gráfico.',
          '',
          'O filtro de período vale para a tela inteira: trocar de Semana para Trimestre recarrega todos os indicadores e todos os gráficos juntos, sem exceção parcial silenciosa. Nada é editável daqui — cada drill-down leva à listagem filtrada correspondente, onde a escrita acontece.',
          '',
          '**Cor dos gráficos.** A paleta categórica oficial (`chart.cat.1` a `chart.cat.8`) **reprova a validação de daltonismo**: com 4 séries, âmbar #F59E0B e verde #22C55E ficam a ΔE 5,7 em protanopia, abaixo do piso de 6; no conjunto de 8, verde #22C55E e teal #14B8A6 ficam a ΔE 11,3 mesmo para visão tricromata; e quatro cores ficam abaixo de 3:1 contra o fundo claro. A proposta corrigida de 6 slots está documentada no `README.md` do repositório e exportada como `PALETA_PROPOSTA` — `#1261E4 · #B45309 · #7C3AED · #15803D · #0891B2 · #DC2626`. É ela que estes exemplos usam.',
          '',
          '**Dados fictícios e determinísticos** em `.storybook/fixtures/painel-tfd.ts`: sem `Math.random()`, sem data corrente e sem dado pessoal real.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof PainelDeTFD>;

export default meta;
type Story = StoryObj<typeof meta>;

export const ComDados: Story = {
  name: 'Padrão · com dados',
  args: { estado: 'default', periodoInicial: 'mes' },
};

export const TrocaDePeriodo: Story = {
  name: 'Padrão · troca do período global',
  args: { estado: 'default', periodoInicial: 'mes' },
  parameters: {
    docs: {
      description: {
        story:
          'O filtro global é a única fonte do recorte: ao trocar de Mês para Trimestre, os stat cards, os gráficos e a contagem da barra de filtros mudam juntos.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Estado inicial: julho de 2026.
    await expect(canvas.getByText('512')).toBeInTheDocument();
    await expect(canvas.getAllByText('Julho de 2026').length).toBeGreaterThan(0);

    await userEvent.click(canvas.getByRole('button', { name: 'Trimestre' }));

    // Indicadores e chip de período acompanham o filtro. O total aparece também
    // no centro da rosca, então a asserção aceita mais de uma ocorrência.
    await expect(canvas.getAllByText('1.486').length).toBeGreaterThan(0);
    await expect(canvas.getByText('R$ 962.150')).toBeInTheDocument();
    await expect(canvas.getAllByText('Maio a julho de 2026').length).toBeGreaterThan(0);

    // O recorte anterior não sobrevive em lugar nenhum da tela.
    await expect(canvas.queryByText('Julho de 2026')).not.toBeInTheDocument();
  },
};

export const Carregando: Story = {
  name: 'Carregando · todos os widgets em skeleton',
  args: { estado: 'carregando' },
  parameters: {
    docs: {
      description: {
        story:
          'Skeleton em cada stat card e em cada gráfico ao mesmo tempo, nunca spinner global cobrindo a tela. O filtro de período continua interativo, e nenhum widget mostra dado parcial enquanto os outros carregam.',
      },
    },
  },
};

export const VazioNoPeriodo: Story = {
  name: 'Vazio · sem dado no período selecionado',
  args: { estado: 'vazio' },
  parameters: {
    docs: {
      description: {
        story:
          'Vazio por filtro, não vazio de primeiro uso: existe cadastro no sistema, só não há registro no intervalo escolhido. Cada card e cada gráfico assume o próprio estado vazio, e o texto sugere ampliar o período.',
      },
    },
  },
};

export const ErroDeCarregamento: Story = {
  name: 'Erro de carregamento',
  args: { estado: 'erro' },
  parameters: {
    docs: {
      description: {
        story:
          'Cada card e cada gráfico exibe o próprio erro com ação de tentar novamente. A falha de um widget não bloqueia os demais nem derruba a tela.',
      },
    },
  },
};

export const Telefone: Story = {
  name: 'Responsivo · grid em coluna única',
  args: { estado: 'default', periodoInicial: 'semana' },
  globals: { viewport: { value: 'm375' } },
  parameters: {
    docs: {
      description: {
        story:
          'A 375px o grid recolhe para uma coluna: stat cards empilhados, um gráfico por linha e filtro deixando de grudar no topo para não comer altura útil.',
      },
    },
  },
};
