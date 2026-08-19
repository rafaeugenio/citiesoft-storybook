import { useId, useState, type ReactNode } from 'react';
import { Button } from '../../atoms/Button/Button';
import './Chart.css';

/** Ordem oficial da spec. Nunca pular cor, nunca reatribuir entre telas. */
export const PALETA_OFICIAL = [
  'var(--citie-chart-cat-1)',
  'var(--citie-chart-cat-2)',
  'var(--citie-chart-cat-3)',
  'var(--citie-chart-cat-4)',
  'var(--citie-chart-cat-5)',
  'var(--citie-chart-cat-6)',
  'var(--citie-chart-cat-7)',
  'var(--citie-chart-cat-8)',
];

/** Proposta aprovada na validação de daltonismo e contraste. */
export const PALETA_PROPOSTA = [
  'var(--citie-chart-alt-1)',
  'var(--citie-chart-alt-2)',
  'var(--citie-chart-alt-3)',
  'var(--citie-chart-alt-4)',
  'var(--citie-chart-alt-5)',
  'var(--citie-chart-alt-6)',
];

export interface Serie {
  rotulo: string;
  valores: number[];
}

export type EstadoDoGrafico = 'default' | 'carregando' | 'vazio' | 'erro';

export interface ChartProps {
  titulo: string;
  /** Período coberto pelos dados. */
  subtitulo?: string;
  categorias: string[];
  series: Serie[];
  paleta?: string[];
  estado?: EstadoDoGrafico;
  formatar?: (valor: number) => string;
  altura?: number;
  children?: ReactNode;
}

const formatarPadrao = (valor: number) => valor.toLocaleString('pt-BR');

/** Moldura comum: título, legenda, alternância para tabela e estados. */
function ChartCard({
  titulo,
  subtitulo,
  categorias,
  series,
  paleta = PALETA_OFICIAL,
  estado = 'default',
  formatar = formatarPadrao,
  children,
}: ChartProps) {
  const [verTabela, setVerTabela] = useState(false);

  if (estado === 'carregando') {
    return (
      <div className="citie-chart" role="status" aria-busy="true" aria-label={`Carregando ${titulo}`}>
        <div className="citie-chart__skeleton citie-chart__skeleton--titulo" />
        <div className="citie-chart__skeleton citie-chart__skeleton--area" />
      </div>
    );
  }

  return (
    <figure className="citie-chart">
      <figcaption className="citie-chart__cabecalho">
        <div>
          <h3 className="citie-chart__titulo">{titulo}</h3>
          {subtitulo ? <p className="citie-chart__subtitulo">{subtitulo}</p> : null}
        </div>
        <Button variant="text" size="small" onClick={() => setVerTabela(!verTabela)}>
          {verTabela ? 'Ver gráfico' : 'Ver tabela'}
        </Button>
      </figcaption>

      {estado === 'vazio' ? (
        <p className="citie-chart__mensagem" role="status">
          Nenhum dado encontrado para o período selecionado
        </p>
      ) : estado === 'erro' ? (
        <div className="citie-chart__mensagem" role="alert">
          <p>Não foi possível carregar os dados</p>
          <Button variant="secondary" size="small">
            Tentar novamente
          </Button>
        </div>
      ) : verTabela ? (
        // Tabela alternativa: a leitura do dado nunca depende do gráfico.
        <table className="citie-chart__tabela">
          <thead>
            <tr>
              <th scope="col">Categoria</th>
              {series.map((serie) => (
                <th key={serie.rotulo} scope="col">
                  {serie.rotulo}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categorias.map((categoria, indice) => (
              <tr key={categoria}>
                <th scope="row">{categoria}</th>
                {series.map((serie) => (
                  <td key={serie.rotulo}>{formatar(serie.valores[indice])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        children
      )}

      {/* Com 2 séries ou mais a legenda é obrigatória: identidade nunca só por cor. */}
      {series.length > 1 && estado === 'default' && !verTabela ? (
        <ul className="citie-chart__legenda">
          {series.map((serie, indice) => (
            <li key={serie.rotulo}>
              <span
                className="citie-chart__marcador"
                style={{ backgroundColor: paleta[indice % paleta.length] }}
                aria-hidden="true"
              />
              {serie.rotulo}
            </li>
          ))}
        </ul>
      ) : null}
    </figure>
  );
}

/* ------------------------------------------------------------------ */
/* Barras verticais                                                    */
/* ------------------------------------------------------------------ */

export function BarChart(props: ChartProps) {
  const { categorias, series, paleta = PALETA_OFICIAL, formatar = formatarPadrao, altura = 240 } = props;
  const maximo = Math.max(...series.flatMap((serie) => serie.valores), 1);
  const largura = 640;
  const margem = { topo: 16, base: 32, esquerda: 48, direita: 8 };
  const areaLargura = largura - margem.esquerda - margem.direita;
  const areaAltura = altura - margem.topo - margem.base;
  const grupoLargura = areaLargura / categorias.length;
  // 2px de respiro entre barras adjacentes, conforme a spec de marcas.
  const barraLargura = Math.max(4, (grupoLargura - 12) / series.length - 2);

  return (
    <ChartCard {...props}>
      <svg
        className="citie-chart__area"
        viewBox={`0 0 ${largura} ${altura}`}
        role="img"
        aria-label={`${props.titulo}. Consulte a tabela alternativa para os valores exatos.`}
      >
        {[0, 0.25, 0.5, 0.75, 1].map((fracao) => {
          const y = margem.topo + areaAltura * (1 - fracao);
          return (
            <g key={fracao}>
              <line
                x1={margem.esquerda}
                x2={largura - margem.direita}
                y1={y}
                y2={y}
                className="citie-chart__grade"
              />
              <text x={margem.esquerda - 8} y={y + 4} className="citie-chart__eixo" textAnchor="end">
                {formatar(Math.round(maximo * fracao))}
              </text>
            </g>
          );
        })}

        {categorias.map((categoria, indiceCategoria) => (
          <g key={categoria}>
            {series.map((serie, indiceSerie) => {
              const valor = serie.valores[indiceCategoria];
              const alturaBarra = (valor / maximo) * areaAltura;
              const x =
                margem.esquerda +
                grupoLargura * indiceCategoria +
                6 +
                indiceSerie * (barraLargura + 2);

              return (
                <rect
                  key={serie.rotulo}
                  x={x}
                  y={margem.topo + areaAltura - alturaBarra}
                  width={barraLargura}
                  height={alturaBarra}
                  rx="4"
                  fill={paleta[indiceSerie % paleta.length]}
                >
                  <title>{`${serie.rotulo} · ${categoria}: ${formatar(valor)}`}</title>
                </rect>
              );
            })}
            <text
              x={margem.esquerda + grupoLargura * (indiceCategoria + 0.5)}
              y={altura - 10}
              className="citie-chart__eixo"
              textAnchor="middle"
            >
              {categoria}
            </text>
          </g>
        ))}
      </svg>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* Linha                                                               */
/* ------------------------------------------------------------------ */

export function LineChart(props: ChartProps) {
  const { categorias, series, paleta = PALETA_OFICIAL, formatar = formatarPadrao, altura = 240 } = props;
  const maximo = Math.max(...series.flatMap((serie) => serie.valores), 1);
  const largura = 640;
  const margem = { topo: 16, base: 32, esquerda: 48, direita: 64 };
  const areaLargura = largura - margem.esquerda - margem.direita;
  const areaAltura = altura - margem.topo - margem.base;

  const posX = (indice: number) =>
    margem.esquerda + (areaLargura / Math.max(1, categorias.length - 1)) * indice;
  const posY = (valor: number) => margem.topo + areaAltura * (1 - valor / maximo);

  return (
    <ChartCard {...props}>
      <svg
        className="citie-chart__area"
        viewBox={`0 0 ${largura} ${altura}`}
        role="img"
        aria-label={`${props.titulo}. Consulte a tabela alternativa para os valores exatos.`}
      >
        {[0, 0.5, 1].map((fracao) => {
          const y = margem.topo + areaAltura * (1 - fracao);
          return (
            <g key={fracao}>
              <line
                x1={margem.esquerda}
                x2={largura - margem.direita}
                y1={y}
                y2={y}
                className="citie-chart__grade"
              />
              <text x={margem.esquerda - 8} y={y + 4} className="citie-chart__eixo" textAnchor="end">
                {formatar(Math.round(maximo * fracao))}
              </text>
            </g>
          );
        })}

        {series.map((serie, indiceSerie) => {
          const cor = paleta[indiceSerie % paleta.length];
          const caminho = serie.valores
            .map((valor, indice) => `${indice === 0 ? 'M' : 'L'} ${posX(indice)} ${posY(valor)}`)
            .join(' ');

          return (
            <g key={serie.rotulo}>
              {/* Linha de 2px, nunca 1px nem acima de 3px. */}
              <path d={caminho} fill="none" stroke={cor} strokeWidth="2" strokeLinejoin="round" />
              {serie.valores.map((valor, indice) => (
                <circle
                  key={`${serie.rotulo}-${indice}`}
                  cx={posX(indice)}
                  cy={posY(valor)}
                  r="4"
                  fill={cor}
                >
                  <title>{`${serie.rotulo} · ${categorias[indice]}: ${formatar(valor)}`}</title>
                </circle>
              ))}
              {/* Rótulo direto: com até 4 séries a identidade não depende da legenda. */}
              {series.length <= 4 ? (
                <text
                  x={posX(serie.valores.length - 1) + 8}
                  y={posY(serie.valores[serie.valores.length - 1]) + 4}
                  className="citie-chart__rotulo-direto"
                >
                  {serie.rotulo}
                </text>
              ) : null}
            </g>
          );
        })}

        {categorias.map((categoria, indice) => (
          <text
            key={categoria}
            x={posX(indice)}
            y={altura - 10}
            className="citie-chart__eixo"
            textAnchor="middle"
          >
            {categoria}
          </text>
        ))}
      </svg>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* Donut                                                               */
/* ------------------------------------------------------------------ */

export interface DonutProps extends Omit<ChartProps, 'series' | 'categorias'> {
  /** De 3 a 6 fatias; o excedente é agrupado em "Outros". */
  fatias: { rotulo: string; valor: number }[];
}

export function DonutChart({ fatias, ...resto }: DonutProps) {
  const paleta = resto.paleta ?? PALETA_OFICIAL;
  const formatar = resto.formatar ?? formatarPadrao;

  const ordenadas = [...fatias].sort((a, b) => b.valor - a.valor);
  const principais = ordenadas.slice(0, 5);
  const excedente = ordenadas.slice(5);
  const finais =
    excedente.length > 0
      ? [
          ...principais,
          { rotulo: 'Outros', valor: excedente.reduce((soma, item) => soma + item.valor, 0) },
        ]
      : principais;

  const total = finais.reduce((soma, fatia) => soma + fatia.valor, 0);
  const raio = 70;
  const espessura = 26;
  const circunferencia = 2 * Math.PI * raio;
  let acumulado = 0;

  return (
    <ChartCard
      {...resto}
      categorias={finais.map((fatia) => fatia.rotulo)}
      series={[{ rotulo: 'Total', valores: finais.map((fatia) => fatia.valor) }]}
    >
      <div className="citie-chart__donut-bloco">
        <svg
          className="citie-chart__area citie-chart__area--donut"
          viewBox="0 0 200 200"
          role="img"
          aria-label={`${resto.titulo}. Consulte a tabela alternativa para os valores exatos.`}
        >
          {finais.map((fatia, indice) => {
            const fracao = fatia.valor / total;
            const dash = circunferencia * fracao;
            const offset = circunferencia * acumulado;
            acumulado += fracao;

            return (
              <circle
                key={fatia.rotulo}
                cx="100"
                cy="100"
                r={raio}
                fill="none"
                stroke={paleta[indice % paleta.length]}
                strokeWidth={espessura}
                // 2px de respiro entre fatias.
                strokeDasharray={`${Math.max(0, dash - 2)} ${circunferencia - dash + 2}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 100 100)"
              >
                <title>{`${fatia.rotulo}: ${formatar(fatia.valor)}`}</title>
              </circle>
            );
          })}
          <text x="100" y="96" className="citie-chart__donut-valor" textAnchor="middle">
            {formatar(total)}
          </text>
          <text x="100" y="116" className="citie-chart__donut-rotulo" textAnchor="middle">
            no total
          </text>
        </svg>

        <ul className="citie-chart__legenda citie-chart__legenda--coluna">
          {finais.map((fatia, indice) => (
            <li key={fatia.rotulo}>
              <span
                className="citie-chart__marcador"
                style={{ backgroundColor: paleta[indice % paleta.length] }}
                aria-hidden="true"
              />
              {fatia.rotulo}
              <span className="citie-chart__legenda-valor">{formatar(fatia.valor)}</span>
            </li>
          ))}
        </ul>
      </div>
    </ChartCard>
  );
}

/* ------------------------------------------------------------------ */
/* Sparkline                                                           */
/* ------------------------------------------------------------------ */

export interface SparklineProps {
  valores: number[];
  /** Nome acessível: o sparkline nunca fica sem descrição. */
  label: string;
  cor?: string;
}

export function Sparkline({ valores, label, cor = 'var(--citie-chart-cat-1)' }: SparklineProps) {
  const id = useId();
  const maximo = Math.max(...valores, 1);
  const minimo = Math.min(...valores, 0);
  const amplitude = maximo - minimo || 1;

  const pontos = valores
    .map((valor, indice) => {
      const x = (100 / Math.max(1, valores.length - 1)) * indice;
      const y = 40 - ((valor - minimo) / amplitude) * 36;
      return `${indice === 0 ? 'M' : 'L'} ${x} ${y}`;
    })
    .join(' ');

  return (
    <svg
      className="citie-chart__sparkline"
      viewBox="0 0 100 44"
      preserveAspectRatio="none"
      role="img"
      aria-labelledby={id}
    >
      <title id={id}>{label}</title>
      <path d={pontos} fill="none" stroke={cor} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
