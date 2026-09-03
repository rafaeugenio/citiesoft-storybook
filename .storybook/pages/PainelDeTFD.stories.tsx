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
  KpiFaixa,
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
import { CelulaDoDashboard, Dashboard, GradeDoHub } from '../templates/Dashboard/Dashboard';
import {
  dadosDoPainel,
  PERIODOS,
  PERIODO_SEM_DADO,
  type DadosDoPainel,
  type PeriodoId,
} from '../fixtures/painel-tfd';

/**
 * O indicador exibido é derivado do agregado calculado, e não de um número
 * digitado na asserção. É a mesma regra que fez o painel deixar de poder
 * contradizer a lista: se o total sai de conta sobre os registros, o teste
 * precisa sair da mesma conta.
 */
const RECEBIDOS_NO_MES = dadosDoPainel('mes').indicadores.find(
  (indicador) => indicador.id === 'recebidos',
)!.valor;

const RECEBIDOS_NO_TRIMESTRE = dadosDoPainel('trimestre').indicadores.find(
  (indicador) => indicador.id === 'recebidos',
)!.valor;

const INTERVALO_DO_MES = dadosDoPainel('mes').intervalo;
const INTERVALO_DO_TRIMESTRE = dadosDoPainel('trimestre').intervalo;

/**
 * Painel de TFD: instância do template `Templates/Dashboard/Painel de indicadores`
 * com dados fictícios do acompanhamento de Tratamento Fora do Domicílio.
 */

const IconeProcessos = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h8l5 5v13H6z" />
    <path d="M14 3v5h5M9 13h6M9 17h6" strokeLinecap="round" />
  </svg>
);

const IconePessoa = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" strokeLinecap="round" />
  </svg>
);

const IconeMoeda = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v10M9.5 9.5h3.75a1.75 1.75 0 0 1 0 3.5h-2.5a1.75 1.75 0 0 0 0 3.5H14.5" strokeLinecap="round" />
  </svg>
);

const IconeRelatorio = (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 20h16M7 16V9M12 16V5M17 16v-6" strokeLinecap="round" />
  </svg>
);

/**
 * Hub de atalhos do módulo, na composição da administração do Sismental: abas
 * sublinhadas e cards de hub de 72px. Cada card leva à listagem do domínio.
 */
function hubDoModulo(dados: DadosDoPainel) {
  const recebidos = dados.indicadores.find((indicador) => indicador.id === 'recebidos');
  return {
    label: 'Atalhos do módulo',
    abas: [
      {
        id: 'operacao',
        rotulo: 'Operação',
        conteudo: (
          <GradeDoHub>
            <Card
              variante="hub"
              icone={IconeProcessos}
              titulo="Solicitações"
              subtitulo={recebidos ? `${recebidos.valor} recebidas em ${dados.intervalo}` : 'Fila de regulação'}
              href="#/tfd/solicitacoes"
            />
            <Card
              variante="hub"
              icone={IconePessoa}
              titulo="Pacientes"
              subtitulo="Cadastro e histórico de viagens"
              href="#/tfd/pacientes"
            />
            <Card
              variante="hub"
              icone={IconeMoeda}
              titulo="Ajuda de custo"
              subtitulo="Lançamentos e empenhos"
              href="#/tfd/ajuda-de-custo"
            />
          </GradeDoHub>
        ),
      },
      {
        id: 'relatorios',
        rotulo: 'Relatórios',
        conteudo: (
          <GradeDoHub>
            <Card
              variante="hub"
              icone={IconeRelatorio}
              titulo="Viagens por município"
              subtitulo="Exportação mensal para a regulação"
              href="#/tfd/relatorios/municipios"
            />
          </GradeDoHub>
        ),
      },
    ],
  };
}

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

  const dados: DadosDoPainel = estado === 'vazio' ? PERIODO_SEM_DADO : dadosDoPainel(periodo);
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

  /*
   * Os indicadores vão dentro da `KpiFaixa`, e não soltos no template.
   *
   * A faixa é quem carrega a região viva que anuncia a troca de recorte a quem
   * usa leitor de tela (WCAG 2.2 4.1.3). Antes a página montava os `KpiWidget`
   * direto, e por isso a correção existia no componente sem nunca chegar à tela
   * que a motivou: quem enxerga percebia a mudança pelo movimento do valor, e
   * quem não enxerga não recebia nada.
   */
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
      hub={hubDoModulo(dados)}
      filtroDePeriodo={filtro}
      indicadores={
        <KpiFaixa titulo="Indicadores de TFD" recorte={dados.intervalo}>
          {indicadores}
        </KpiFaixa>
      }
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
          'Painel gerencial do TFD (Tratamento Fora do Domicílio) sobre o template `Templates/Dashboard/Painel de indicadores`. Anatomia de `design-system/09-templates/tela-dashboard.md`: hub de atalhos com abas sublinhadas (Lote 6b, composição do Sismental), filtro global de período, linha de stat cards, grid de gráficos em seções temáticas e drill-down em todo card e gráfico.',
          '',
          'O filtro de período vale para a tela inteira: trocar de Semana para Trimestre recarrega todos os indicadores e todos os gráficos juntos, sem exceção parcial silenciosa. Nada é editável daqui: cada drill-down leva à listagem filtrada correspondente, onde a escrita acontece.',
          '',
          '**Cor dos gráficos.** A paleta categórica oficial (`chart.cat.1` a `chart.cat.8`) **reprova a validação de daltonismo**: com 4 séries, âmbar #F59E0B e verde #22C55E ficam a ΔE 5,7 em protanopia, abaixo do piso de 6; no conjunto de 8, verde #22C55E e teal #14B8A6 ficam a ΔE 11,3 mesmo para visão tricromata; e quatro cores ficam abaixo de 3:1 contra o fundo claro. A proposta corrigida de 6 slots está documentada no `README.md` do repositório e exportada como `PALETA_PROPOSTA` (`#1261E4 · #B45309 · #7C3AED · #15803D · #0891B2 · #DC2626`). É ela que estes exemplos usam.',
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
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Hub de atalhos antes do filtro: abas sublinhadas e três cards de 72.
    const abas = canvas.getByRole('tablist', { name: 'Atalhos do módulo' });
    const filtro = canvas.getByRole('group', { name: 'Período dos indicadores' });
    await expect(abas.getBoundingClientRect().bottom).toBeLessThanOrEqual(filtro.getBoundingClientRect().top);
    const cards = canvasElement.querySelectorAll<HTMLElement>('[role="tabpanel"]:not([hidden]) .citie-card--hub');
    await expect(cards.length).toBe(3);
    await expect(Math.round(cards[0].getBoundingClientRect().height)).toBe(72);
    // O card de solicitações mostra o mesmo agregado do indicador.
    await expect(canvas.getByRole('link', { name: 'Solicitações' })).toBeVisible();
    await expect(canvas.getByText(`${RECEBIDOS_NO_MES} recebidas em ${INTERVALO_DO_MES}`)).toBeVisible();
    // A região viva da faixa continua única.
    await expect(canvasElement.querySelectorAll('[role="status"][aria-live="polite"]').length).toBe(1);
  },
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
    // O mesmo total aparece no indicador e no gráfico, que é o comportamento certo:
    // os dois saem do mesmo agregado calculado.
    await expect(canvas.getAllByText(RECEBIDOS_NO_MES).length).toBeGreaterThan(0);
    await expect(canvas.getAllByText(INTERVALO_DO_MES).length).toBeGreaterThan(0);

    await userEvent.click(canvas.getByRole('button', { name: 'Trimestre' }));

    // Indicadores e chip de período acompanham o filtro. O total aparece também
    // no centro da rosca, então a asserção aceita mais de uma ocorrência.
    await expect(canvas.getAllByText(RECEBIDOS_NO_TRIMESTRE).length).toBeGreaterThan(0);
    await expect(canvas.getAllByText(INTERVALO_DO_TRIMESTRE).length).toBeGreaterThan(0);

    /*
     * A troca de recorte precisa chegar a quem usa leitor de tela.
     *
     * Quem enxerga percebe a mudança pelo movimento do valor; sem uma região
     * viva, quem não enxerga não recebe nada, e o painel muda em silêncio.
     * Isto é WCAG 2.2 4.1.3 Status Messages, exigência legal neste produto.
     *
     * A asserção existe porque a correção chegou a ficar órfã: a prop que
     * carrega o anúncio existia no componente e nenhuma tela a passava.
     */
    const viva = canvasElement.querySelector('[role="status"][aria-live="polite"]');
    await expect(viva).toBeTruthy();
    await expect(viva?.textContent).toContain(INTERVALO_DO_TRIMESTRE);
    // Uma região só para a faixa inteira: oito anúncios simultâneos seriam
    // oito falas sobrepostas, que é pior do que o silêncio.
    await expect(canvasElement.querySelectorAll('[role="status"][aria-live="polite"]').length).toBe(1);

    // O recorte anterior não sobrevive em lugar nenhum da tela.
    await expect(canvas.queryByText(INTERVALO_DO_MES)).not.toBeInTheDocument();
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
