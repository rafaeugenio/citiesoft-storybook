import './ValorMonetario.css';
// O mapa canônico de severidade mora em src/tokens/severidade.css. A linha de reembolso consome
// `--sev-fg` de lá em vez de repetir a escolha de cor aqui, para o âmbar de
// atenção continuar saindo de um lugar só.
import '../../../tokens/severidade.css';

const formatadorMoeda = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

const formatadorDecimal = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Formatação monetária oficial do catálogo, no mesmo espírito de `mascararCPF`
 * em `organisms/Table/Table.tsx`: a formatação vinha sendo redeclarada como
 * helper local em cada tela (`reais` na story de Table, `fmtBRL` em cada página
 * do TFD), e cada redeclaração é uma chance a mais de divergir na casa decimal
 * ou no separador. Sempre `Intl.NumberFormat`, nunca concatenação de string.
 */
export function formatarReais(valor: number): string {
  return formatadorMoeda.format(valor);
}

/**
 * Versão falada do valor. "R$" é lido de forma instável pelos leitores de tela,
 * e o sinal de menos costuma ser simplesmente omitido, o que transformaria uma
 * devolução em cobrança. Por isso o nome acessível diz a moeda por extenso e
 * diz "menos" quando o valor é negativo.
 */
function porExtenso(valor: number): string {
  const absoluto = formatadorDecimal.format(Math.abs(valor));
  return `${valor < 0 ? 'menos ' : ''}${absoluto} reais`;
}

export interface ValorMonetarioProps {
  /** Valor em reais. Aceita zero e negativo. */
  valor: number;
  /** O que o valor representa. Entra no nome acessível: "Passagem de ida". */
  descricao?: string;
  /**
   * Item cancelado. O risco sozinho não chega a quem usa leitor de tela, então
   * o cancelamento também é dito no nome acessível.
   */
  cancelado?: boolean;
  /** Parte já devolvida, exibida como segunda linha descontada do valor. */
  reembolso?: number;
  /** `sm` para tabela em densidade compacta. */
  size?: 'sm' | 'md';
}

/**
 * Célula de valor monetário (lacuna nº 14 do mapa do TFD). Resolve dinheiro em
 * coluna de tabela: `tabular-nums`, alinhamento à direita e os dois estados que
 * cada tela vinha improvisando, cancelamento e reembolso descontado.
 */
export function ValorMonetario({
  valor,
  descricao,
  cancelado = false,
  reembolso,
  size = 'md',
}: ValorMonetarioProps) {
  const temReembolso = reembolso !== undefined && reembolso !== 0;

  const partes = [
    ...(descricao ? [descricao] : []),
    porExtenso(valor),
    ...(cancelado ? ['valor cancelado'] : []),
    ...(temReembolso ? [`com reembolso de ${porExtenso(Math.abs(reembolso))} descontado`] : []),
  ];

  return (
    <span
      className={`citie-valor citie-valor--${size}${cancelado ? ' citie-valor--cancelado' : ''}`}
    >
      {/* O texto visível é compacto por causa da densidade da tabela; o nome
          acessível completo vive aqui, dito uma vez só. */}
      <span className="citie-visualmente-oculto">{`${partes.join(', ')}.`}</span>

      <span className="citie-valor__principal" aria-hidden="true">
        {formatarReais(valor)}
      </span>

      {temReembolso ? (
        <span className="citie-valor__reembolso citie-sev citie-sev--warn" aria-hidden="true">
          {`-${formatarReais(Math.abs(reembolso))} reembolsado`}
        </span>
      ) : null}
    </span>
  );
}
