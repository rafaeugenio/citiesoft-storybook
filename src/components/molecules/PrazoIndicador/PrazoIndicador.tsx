import './PrazoIndicador.css';
// Severidade sai do mapa canônico de src/tokens/severidade.css, o mesmo que StatusIndicator,
// Tag e Chip consomem. Nenhuma cor nova entra por aqui.
import '../../../tokens/severidade.css';

export type FaixaDePrazo = 'atrasado' | 'hoje' | 'proximo' | 'folgado';

/** Data aceita como `AAAA-MM-DD` ou como `Date`. */
export type EntradaDeData = string | Date;

const formatadorData = new Intl.DateTimeFormat('pt-BR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  timeZone: 'UTC',
});

const MS_POR_DIA = 86_400_000;

/**
 * Normaliza a data para a meia-noite UTC do dia civil que ela representa.
 *
 * A diferença entre dois prazos precisa ser contada em dias de calendário, e
 * não em intervalo de relógio: subtrair carimbos de tempo direto erra em um dia
 * inteiro na virada de horário de verão e sempre que uma das pontas carrega
 * hora. A string `AAAA-MM-DD` é lida por partes de propósito, porque `new Date`
 * a interpretaria como UTC e deslocaria o dia em fuso negativo, que é o do
 * Brasil.
 */
function paraDiaCivil(entrada: EntradaDeData): number {
  if (entrada instanceof Date) {
    return Date.UTC(entrada.getFullYear(), entrada.getMonth(), entrada.getDate());
  }
  const partes = /^(\d{4})-(\d{2})-(\d{2})/.exec(entrada);
  if (!partes) {
    throw new Error(`PrazoIndicador: data inválida "${entrada}". Use AAAA-MM-DD ou Date.`);
  }
  return Date.UTC(Number(partes[1]), Number(partes[2]) - 1, Number(partes[3]));
}

export interface CalculoDePrazo {
  /** Dias de calendário até o prazo. Negativo quando já venceu. */
  dias: number;
  faixa: FaixaDePrazo;
  /** Prazo formatado em pt-BR, como aparece no nome acessível. */
  dataFormatada: string;
}

/**
 * Deriva a faixa de urgência a partir do prazo e da data de referência. Exposto
 * porque a fila que ordena por urgência precisa do mesmo cálculo que o
 * indicador exibe, e duas contas paralelas divergiriam.
 */
export function calcularPrazo(
  prazo: EntradaDeData,
  referencia: EntradaDeData,
  limiteProximo = 3,
): CalculoDePrazo {
  const diaPrazo = paraDiaCivil(prazo);
  const dias = Math.round((diaPrazo - paraDiaCivil(referencia)) / MS_POR_DIA);

  const faixa: FaixaDePrazo =
    dias < 0 ? 'atrasado' : dias === 0 ? 'hoje' : dias <= limiteProximo ? 'proximo' : 'folgado';

  return { dias, faixa, dataFormatada: formatadorData.format(new Date(diaPrazo)) };
}

/**
 * Severidade de cada faixa.
 *
 * `folgado` fica em `secondary`, e não em `success`: verde numa coluna de prazo
 * é lido como "resolvido", e o que a faixa diz é apenas que ainda há tempo.
 */
const SEVERIDADE_POR_FAIXA = {
  atrasado: 'danger',
  hoje: 'warn',
  proximo: 'info',
  folgado: 'secondary',
} as const;

/**
 * Ícone próprio por faixa, com silhueta distinta entre si. Cor nunca carrega o
 * significado sozinha: quem não distingue matiz separa as faixas pelo desenho e
 * pelo texto.
 */
function Icone({ faixa }: { faixa: FaixaDePrazo }) {
  const comum = {
    viewBox: '0 0 16 16',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  };

  if (faixa === 'atrasado') {
    return (
      <svg {...comum}>
        <path d="M8 2.5 14.5 13.5h-13z" />
        <path d="M8 6.5v3" />
        <circle cx="8" cy="11.6" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (faixa === 'hoje') {
    return (
      <svg {...comum}>
        <circle cx="8" cy="8" r="5.75" />
        <path d="M8 5v3.4" />
        <circle cx="8" cy="10.8" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (faixa === 'proximo') {
    return (
      <svg {...comum}>
        <circle cx="8" cy="8" r="5.75" />
        <path d="M8 4.8V8l2.3 1.6" />
      </svg>
    );
  }

  return (
    <svg {...comum}>
      <rect x="2.5" y="3.5" width="11" height="10" rx="1.5" />
      <path d="M2.5 6.5h11M5.5 2.5v2M10.5 2.5v2" />
    </svg>
  );
}

function textoVisivel({ dias, faixa }: CalculoDePrazo): string {
  if (faixa === 'atrasado') return `Atrasado ${Math.abs(dias)}d`;
  if (faixa === 'hoje') return 'Hoje';
  return `Faltam ${dias}d`;
}

function nomeAcessivel(rotulo: string, calculo: CalculoDePrazo): string {
  const { dias, faixa, dataFormatada } = calculo;
  const emDias = (quantidade: number) => `${quantidade} ${quantidade === 1 ? 'dia' : 'dias'}`;

  if (faixa === 'atrasado') {
    return `${rotulo}: atrasado ${emDias(Math.abs(dias))}, venceu em ${dataFormatada}.`;
  }
  if (faixa === 'hoje') {
    return `${rotulo}: vence hoje, ${dataFormatada}.`;
  }
  return `${rotulo}: faltam ${emDias(dias)}, vence em ${dataFormatada}.`;
}

export interface PrazoIndicadorProps {
  /** Data limite, em `AAAA-MM-DD` ou `Date`. */
  prazo: EntradaDeData;
  /**
   * Data a partir da qual a urgência é contada, quase sempre o "hoje" da
   * aplicação. É prop de propósito: com `new Date()` interno a story mudaria de
   * resultado a cada dia e a suíte ficaria instável.
   */
  referencia: EntradaDeData;
  /** Declara a base do prazo: "Prazo para agendamento". Sempre visível. */
  rotulo: string;
  /** Último dia ainda contado como `proximo`. Acima disso, `folgado`. */
  limiteProximo?: number;
  /** `sm` para tabela em densidade compacta. */
  size?: 'sm' | 'md';
}

/**
 * Semáforo de prazo (lacuna nº 13 do mapa do TFD). Prioriza uma fila por
 * urgência em quatro faixas, com o texto mudando de forma conforme a faixa.
 *
 * Diferente de `StatusIndicator`, que trabalha com o dicionário fixo
 * `ESTADOS_DE_FLUXO`: aqui a faixa é derivada de uma data, então os dois
 * resolvem problemas distintos e seguem componentes distintos.
 */
export function PrazoIndicador({
  prazo,
  referencia,
  rotulo,
  limiteProximo = 3,
  size = 'md',
}: PrazoIndicadorProps) {
  const calculo = calcularPrazo(prazo, referencia, limiteProximo);
  const severidade = SEVERIDADE_POR_FAIXA[calculo.faixa];

  return (
    <span className={`citie-prazo citie-prazo--${size}`}>
      {/* O relativo sozinho é ambíguo para quem volta à tela depois, então o
          nome acessível carrega também a data absoluta. */}
      <span className="citie-visualmente-oculto">{nomeAcessivel(rotulo, calculo)}</span>

      <span
        className={`citie-prazo__pilula citie-sev citie-sev--${severidade}`}
        aria-hidden="true"
      >
        <Icone faixa={calculo.faixa} />
        {textoVisivel(calculo)}
      </span>

      <span className="citie-prazo__rotulo" aria-hidden="true">
        {rotulo}
      </span>
    </span>
  );
}
