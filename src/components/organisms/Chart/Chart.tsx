import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '../../atoms/Button/Button';
import { PALETA_OFICIAL } from '../../../tokens/paletas';
import './Chart.css';

/** Largura usada até a primeira medição. Só vale para o primeiro quadro. */
const LARGURA_PADRAO = 640;

/**
 * Raio da extremidade do dado, em unidade de usuário do SVG.
 *
 * Espelha `--citie-radius-sm` (4px). Geometria de `path` não aceita variável
 * CSS, então o valor vive aqui como constante nomeada em vez de literal solto
 * espalhado pelo desenho. Como o viewBox passou a ser medido em pixel real
 * (ver `useLarguraMedida`), 4 unidades são 4px na tela em qualquer largura.
 */
const RAIO_DO_DADO = 4;

/** Respiro entre fatias da rosca, para que duas cores vizinhas não encostem. */
const RESPIRO_ENTRE_FATIAS = 2;

/**
 * Mede a largura real do SVG para que o viewBox seja declarado em pixel de
 * tela, e não em unidade arbitrária.
 *
 * O motivo é tipográfico. Com viewBox fixo de 640 e `width: 100%`, todo o
 * desenho era escalado pelo navegador, texto incluído: o mesmo
 * `font-size: 12px` rendia 11,3px num gráfico de 605px de largura e 23,9px num
 * de 1276px, duas escalas tipográficas 2x diferentes na mesma tela. Com o
 * viewBox igual à largura medida a escala é sempre 1, e o rótulo tem o tamanho
 * que o token declara em qualquer moldura.
 */
function useLarguraMedida() {
  const referencia = useRef<SVGSVGElement>(null);
  const [largura, setLargura] = useState(LARGURA_PADRAO);

  useLayoutEffect(() => {
    const alvo = referencia.current;
    if (!alvo) return;

    const medir = () => {
      const medida = Math.round(alvo.getBoundingClientRect().width);
      if (medida > 0) setLargura(medida);
    };

    medir();
    if (typeof ResizeObserver === 'undefined') return;
    const observador = new ResizeObserver(medir);
    observador.observe(alvo);
    return () => observador.disconnect();
  }, []);

  return [referencia, largura] as const;
}

/**
 * Barra com a extremidade do dado arredondada e a base reta.
 *
 * Seção 8 da spec estrutural: o topo termina com raio, e a extremidade que
 * encosta no eixo nunca arredonda, porque canto arredondado sobre a linha de
 * base solta a barra do eixo e falseia a leitura de onde o valor começa.
 */
function caminhoDaBarra(x: number, y: number, largura: number, altura: number) {
  const raio = Math.min(RAIO_DO_DADO, largura / 2, altura);
  if (altura <= 0) return '';
  return [
    `M ${x} ${y + altura}`,
    `L ${x} ${y + raio}`,
    `Q ${x} ${y} ${x + raio} ${y}`,
    `L ${x + largura - raio} ${y}`,
    `Q ${x + largura} ${y} ${x + largura} ${y + raio}`,
    `L ${x + largura} ${y + altura}`,
    'Z',
  ].join(' ');
}

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
  const [referencia, largura] = useLarguraMedida();
  const margem = { topo: 16, base: 32, esquerda: 48, direita: 8 };
  const areaLargura = largura - margem.esquerda - margem.direita;
  const areaAltura = altura - margem.topo - margem.base;
  const grupoLargura = areaLargura / categorias.length;
  // 2px de respiro entre barras adjacentes, conforme a spec de marcas.
  const barraLargura = Math.max(4, (grupoLargura - 12) / series.length - 2);

  return (
    <ChartCard {...props}>
      <svg
        ref={referencia}
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
                <path
                  key={serie.rotulo}
                  className="citie-chart__barra"
                  d={caminhoDaBarra(
                    x,
                    margem.topo + areaAltura - alturaBarra,
                    barraLargura,
                    alturaBarra,
                  )}
                  fill={paleta[indiceSerie % paleta.length]}
                >
                  <title>{`${serie.rotulo} · ${categoria}: ${formatar(valor)}`}</title>
                </path>
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
  const [referencia, largura] = useLarguraMedida();
  const margem = { topo: 16, base: 32, esquerda: 48, direita: 64 };
  const areaLargura = largura - margem.esquerda - margem.direita;
  const areaAltura = altura - margem.topo - margem.base;

  const posX = (indice: number) =>
    margem.esquerda + (areaLargura / Math.max(1, categorias.length - 1)) * indice;
  const posY = (valor: number) => margem.topo + areaAltura * (1 - valor / maximo);

  return (
    <ChartCard {...props}>
      <svg
        ref={referencia}
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
              <path
                className="citie-chart__serie"
                d={caminho}
                fill="none"
                stroke={cor}
                strokeWidth="2"
                strokeLinejoin="round"
                /* Extremidade de dado arredondada, seção 8 da spec estrutural. */
                strokeLinecap="round"
              />
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
            /* Fatia única fecha o anel: sem corte, não há extremidade a arredondar. */
            if (finais.length === 1) {
              return (
                <circle
                  key={fatia.rotulo}
                  cx="100"
                  cy="100"
                  r={raio}
                  fill="none"
                  stroke={paleta[indice % paleta.length]}
                  strokeWidth={espessura}
                >
                  <title>{`${fatia.rotulo}: ${formatar(fatia.valor)}`}</title>
                </circle>
              );
            }
            const arco = circunferencia * fracao;
            /**
             * Com `stroke-linecap: round` o traço cresce meia espessura para
             * cada lado, então o dash é encurtado pela espessura inteira e o
             * início é empurrado meia espessura à frente. Sem isso as fatias
             * avançariam umas sobre as outras.
             *
             * Fatia menor que a própria espessura não comporta a ponta
             * arredondada: só o cap já ocuparia mais arco que o dado, e a fatia
             * apareceria maior do que é. Nesse caso a extremidade fica reta,
             * porque proporção correta vem antes de acabamento.
             */
            const cabeAPonta = arco > espessura + RESPIRO_ENTRE_FATIAS;
            const visivel = cabeAPonta
              ? arco - espessura - RESPIRO_ENTRE_FATIAS
              : Math.max(0.01, arco - RESPIRO_ENTRE_FATIAS);
            const offset =
              circunferencia * acumulado +
              RESPIRO_ENTRE_FATIAS / 2 +
              (cabeAPonta ? espessura / 2 : 0);
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
                strokeLinecap={cabeAPonta ? 'round' : 'butt'}
                strokeDasharray={`${visivel} ${circunferencia - visivel}`}
                strokeDashoffset={-offset}
                transform="rotate(-90 100 100)"
              >
                <title>{`${fatia.rotulo}: ${formatar(fatia.valor)}`}</title>
              </circle>
            );
          })}
          {/* Anatomia de métrica, seção 4: rótulo micro acima, número abaixo. */}
          <text x="100" y="90" className="citie-chart__donut-rotulo" textAnchor="middle">
            No total
          </text>
          <text x="100" y="116" className="citie-chart__donut-valor" textAnchor="middle">
            {formatar(total)}
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
