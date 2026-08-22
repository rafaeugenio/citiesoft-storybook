import type { ReactNode } from 'react';
import { Button } from '../../atoms/Button/Button';
import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import { ValorEmTransicao } from './ValorEmTransicao';
import './Widget.css';

export type EstadoDoWidget = 'default' | 'carregando' | 'vazio' | 'erro';

export interface KpiProps {
  /** Nome do indicador. */
  rotulo: string;
  /** Valor principal; nunca trunca com reticências. */
  valor?: string;
  /** Período do dado, sempre explícito. */
  periodo: string;
  /** Direção mais número mais cor, nunca só cor. */
  variacao?: { percentual: number; comparadoA: string };
  meta?: { atual: number; alvo: number };
  compacto?: boolean;
  estado?: EstadoDoWidget;
  /** Sparkline ou mini-gráfico opcional. */
  grafico?: ReactNode;
  /**
   * Navegação: o indicador leva o operador para outra tela.
   *
   * Vira um botão comum, sem `aria-pressed`, porque quem aciona sai da tela e
   * não deixa nada ligado atrás de si.
   */
  onDrillDown?: () => void;
  /**
   * Filtro: o indicador aplica e retira o recorte correspondente na listagem
   * que está logo abaixo dele.
   *
   * Vira um controle de alternância, com `aria-pressed` refletindo `ativo`,
   * porque quem aciona permanece na tela e o estado continua ligado. Não
   * combine com `onDrillDown`: são dois contratos diferentes e, se os dois
   * vierem, o de filtro prevalece.
   */
  onFiltrar?: () => void;
  /** Indica que o filtro deste indicador está aplicado. Só faz sentido com `onFiltrar`. */
  ativo?: boolean;
}

export function KpiWidget({
  rotulo,
  valor,
  periodo,
  variacao,
  meta,
  compacto = false,
  estado = 'default',
  grafico,
  onDrillDown,
  onFiltrar,
  ativo = false,
}: KpiProps) {
  if (estado === 'carregando') {
    return (
      <div className="citie-widget" role="status" aria-busy="true" aria-label={`Carregando ${rotulo}`}>
        <Skeleton forma="linha" width="50%" />
        <Skeleton forma="titulo" width="70%" />
        <Skeleton forma="linha" width="40%" />
      </div>
    );
  }

  if (estado === 'erro') {
    return (
      <div className="citie-widget citie-widget--erro" role="alert">
        <p className="citie-widget__rotulo">{rotulo}</p>
        <p className="citie-widget__falha">
          <span aria-hidden="true">⚠</span> Falha ao carregar
        </p>
        <Button variant="secondary" size="small">
          Tentar novamente
        </Button>
      </div>
    );
  }

  const positiva = (variacao?.percentual ?? 0) >= 0;
  const Conteudo = (
    <>
      <p className="citie-widget__rotulo">{rotulo}</p>

      {estado === 'vazio' ? (
        <>
          <p className="citie-widget__valor">—</p>
          <p className="citie-widget__periodo">Nenhum dado disponível para o período</p>
        </>
      ) : (
        <>
          <p className={`citie-widget__valor${compacto ? ' citie-widget__valor--compacto' : ''}`}>
            {/*
              O valor transita entre estados em vez de trocar de golpe. No
              Painel de TFD, trocar o período muda oito indicadores ao mesmo
              tempo, e sem o movimento o operador não sabe qual deles mudou.
            */}
            <ValorEmTransicao valor={valor ?? ''} />
          </p>
          <p className="citie-widget__periodo">{periodo}</p>

          {variacao ? (
            /**
             * Pílula de tendência: ícone circular de seta mais texto.
             *
             * O significado vem por forma (a seta) e por palavra ("acima de
             * fevereiro"). A cor entra como terceira pista e nunca como única,
             * o que é exigência de acessibilidade e não escolha estética.
             */
            <p
              className={`citie-widget__tendencia${
                positiva ? ' citie-widget__tendencia--alta' : ' citie-widget__tendencia--baixa'
              }`}
            >
              <span className="citie-widget__tendencia-icone" aria-hidden="true">
                {positiva ? '▲' : '▼'}
              </span>
              <span className="citie-widget__tendencia-texto">
                {positiva ? '+' : ''}
                {variacao.percentual.toLocaleString('pt-BR')}%{' '}
                {positiva ? 'acima' : 'abaixo'} de {variacao.comparadoA}
              </span>
            </p>
          ) : null}

          {meta ? (
            <div className="citie-widget__meta">
              <div
                className="citie-widget__meta-trilho"
                role="progressbar"
                aria-label={`Atingimento da meta de ${rotulo}`}
                aria-valuenow={Math.round((meta.atual / meta.alvo) * 100)}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className="citie-widget__meta-preenchimento"
                  style={{ width: `${Math.min(100, (meta.atual / meta.alvo) * 100)}%` }}
                />
              </div>
              <p className="citie-widget__meta-texto">
                {Math.round((meta.atual / meta.alvo) * 100)}% da meta de{' '}
                {meta.alvo.toLocaleString('pt-BR')}
              </p>
            </div>
          ) : null}

          {grafico ? <div className="citie-widget__grafico">{grafico}</div> : null}
        </>
      )}
    </>
  );

  /**
   * Filtro e navegação não podem se confundir, nem para o olho nem para o
   * leitor de tela. O filtro é alternância, então declara `aria-pressed` e
   * ganha o anel de seleção; a navegação é botão comum e nunca declara estado
   * ligado, porque não existe estado ligado a manter depois de sair da tela.
   */
  if (onFiltrar) {
    return (
      <button
        type="button"
        className={`citie-widget citie-widget--clicavel citie-widget--filtro${
          ativo ? ' citie-widget--ativo' : ''
        }`}
        aria-pressed={ativo}
        onClick={onFiltrar}
      >
        {Conteudo}
      </button>
    );
  }

  if (onDrillDown) {
    return (
      <button type="button" className="citie-widget citie-widget--clicavel" onClick={onDrillDown}>
        {Conteudo}
      </button>
    );
  }

  return <div className="citie-widget">{Conteudo}</div>;
}

export interface ListaResumoProps {
  titulo: string;
  /** De 3 a 7 itens de uma fila que exige atenção. */
  itens: { id: string; principal: string; secundario: string; marcador?: ReactNode }[];
  /** Badge de atenção quando há item crítico na fila. */
  alerta?: 'warn' | 'danger';
  onVerTudo?: () => void;
}

export function ListaResumoWidget({ titulo, itens, alerta, onVerTudo }: ListaResumoProps) {
  return (
    <section className="citie-widget">
      <header className="citie-widget__cabecalho">
        <p className="citie-widget__rotulo">{titulo}</p>
        {alerta ? (
          <span className={`citie-widget__alerta citie-widget__alerta--${alerta}`}>Atenção</span>
        ) : null}
      </header>

      <ul className="citie-widget__lista">
        {itens.slice(0, 7).map((item) => (
          <li key={item.id} className="citie-widget__item">
            <span className="citie-widget__item-principal">{item.principal}</span>
            <span className="citie-widget__item-secundario">{item.secundario}</span>
            {item.marcador}
          </li>
        ))}
      </ul>

      {onVerTudo ? (
        <Button variant="text" size="small" onClick={onVerTudo}>
          Ver tudo
        </Button>
      ) : null}
    </section>
  );
}
