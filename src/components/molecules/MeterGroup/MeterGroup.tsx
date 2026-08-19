import { useId, type CSSProperties, type ReactNode } from 'react';
import { PALETA_OFICIAL } from '../../../tokens/paletas';
import './MeterGroup.css';

/**
 * MeterGroup — barra de distribuição proporcional com legenda.
 *
 * Figma CitieOne, página `6738:55111` (❖ MeterGroup). Variantes do arquivo
 * respeitadas: `Type` (Basic · Multiple), `Orientation` (Horizontal · Vertical),
 * `Label Position` (End · Start), `Label Orientation` (Horizontal · Vertical) e o
 * part `metergroup-indicator` (`Type`: Marker · Icon).
 *
 * Cor: as faixas são séries categóricas, então a cor vem da paleta categórica já
 * definida em `tokens/paletas.ts`, nunca de valor solto. O default é a `PALETA_OFICIAL` da
 * spec; `PALETA_PROPOSTA` fica disponível como opção porque a oficial reprova a
 * validação de daltonismo (ver descrição da story).
 */

export interface FaixaDoMeter {
  rotulo: string;
  valor: number;
  /** Usado quando `indicador` é `icone`; sem ícone a faixa cai para o marcador. */
  icone?: ReactNode;
  /** Sobrescreve a cor da paleta em faixa com semântica própria (ex.: "Não informado"). */
  cor?: string;
}

export type OrientacaoDoMeter = 'horizontal' | 'vertical';
export type PosicaoDaLegenda = 'depois' | 'antes';
export type IndicadorDaLegenda = 'marcador' | 'icone';

export interface MeterGroupProps {
  /** Nome do conjunto. Obrigatório: é o nome acessível do grupo e do total. */
  titulo: string;
  faixas: FaixaDoMeter[];
  /**
   * Total de referência. Omitido, é a soma das faixas (o trilho fecha em 100%).
   * Informado e maior que a soma, a sobra aparece como trilho vazio.
   */
  total?: number;
  paleta?: string[];
  orientacao?: OrientacaoDoMeter;
  posicaoDaLegenda?: PosicaoDaLegenda;
  orientacaoDaLegenda?: OrientacaoDoMeter;
  indicador?: IndicadorDaLegenda;
  /** Unidade do total e das faixas, exibida ao lado do título. */
  unidade?: string;
  formatar?: (valor: number) => string;
  /** Espessura do trilho em px. 8 em card, 12 em tela dedicada. */
  espessura?: number;
}

const formatarPadrao = (valor: number) => valor.toLocaleString('pt-BR');

const formatarPorcentagem = (fracao: number) =>
  `${(fracao * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 })}%`;

export function MeterGroup({
  titulo,
  faixas,
  total,
  paleta = PALETA_OFICIAL,
  orientacao = 'horizontal',
  posicaoDaLegenda = 'depois',
  orientacaoDaLegenda = 'horizontal',
  indicador = 'marcador',
  unidade,
  formatar = formatarPadrao,
  espessura = 12,
}: MeterGroupProps) {
  const idTitulo = useId();
  const soma = faixas.reduce((acumulado, faixa) => acumulado + faixa.valor, 0);
  const totalEfetivo = Math.max(total ?? soma, soma);
  const vazio = faixas.length === 0 || totalEfetivo <= 0;

  const trilho = (
    <div
      className="citie-meter-group__trilho"
      style={{ '--meter-espessura': `${espessura}px` } as CSSProperties}
      // A barra é decorativa: rótulo, valor e percentual de cada faixa estão na
      // legenda em texto, que é o que o leitor de tela anuncia.
      aria-hidden="true"
    >
      {faixas.map((faixa, indice) => (
        <span
          key={faixa.rotulo}
          className="citie-meter-group__faixa"
          style={
            {
              '--meter-tamanho': `${(faixa.valor / totalEfetivo) * 100}%`,
              backgroundColor: faixa.cor ?? paleta[indice % paleta.length],
            } as CSSProperties
          }
        />
      ))}
    </div>
  );

  const legenda = (
    <ul
      className={`citie-meter-group__legenda citie-meter-group__legenda--${orientacaoDaLegenda}`}
    >
      {faixas.map((faixa, indice) => {
        const cor = faixa.cor ?? paleta[indice % paleta.length];

        return (
          <li key={faixa.rotulo} className="citie-meter-group__item">
            {indicador === 'icone' && faixa.icone ? (
              <span className="citie-meter-group__icone" style={{ color: cor }} aria-hidden="true">
                {faixa.icone}
              </span>
            ) : (
              <span
                className="citie-meter-group__marcador"
                style={{ backgroundColor: cor }}
                aria-hidden="true"
              />
            )}
            <span className="citie-meter-group__rotulo">{faixa.rotulo}</span>
            <span className="citie-meter-group__valor">
              {formatar(faixa.valor)}
              {unidade ? ` ${unidade}` : ''} ({formatarPorcentagem(faixa.valor / totalEfetivo)})
            </span>
          </li>
        );
      })}
    </ul>
  );

  return (
    <div
      className={`citie-meter-group citie-meter-group--${orientacao} citie-meter-group--legenda-${posicaoDaLegenda}`}
      role="group"
      aria-labelledby={idTitulo}
    >
      <div className="citie-meter-group__cabecalho">
        <h3 className="citie-meter-group__titulo" id={idTitulo}>
          {titulo}
        </h3>
        <p className="citie-meter-group__total">
          {vazio ? 'Sem dados' : `${formatar(totalEfetivo)}${unidade ? ` ${unidade}` : ''} no total`}
        </p>
      </div>

      {vazio ? (
        <p className="citie-meter-group__mensagem">
          Nenhum registro encontrado para o período selecionado
        </p>
      ) : (
        <div className="citie-meter-group__corpo">
          {posicaoDaLegenda === 'antes' ? legenda : null}
          {trilho}
          {posicaoDaLegenda === 'depois' ? legenda : null}
        </div>
      )}
    </div>
  );
}
