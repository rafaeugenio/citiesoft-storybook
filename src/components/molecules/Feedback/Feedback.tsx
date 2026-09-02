import { useCallback, useEffect, useRef, useState, type ReactNode, type TransitionEvent } from 'react';
import { Button } from '../../atoms/Button/Button';
import { MOTION_RAPIDO_NOMINAL_MS, tempoCssEmMs } from './tempoCss';
/**
 * O mapa de severidade (`.citie-sev--*`, que define `--sev-fg` e `--sev-bg`)
 * vive em Badge.css. No build estático o CSS é dividido por story, e uma
 * página que só carrega Feedback ficava sem o mapa: o ícone e a aresta caíam
 * na tinta de texto. A importação garante o mapa onde o Toast e a Message
 * forem usados sozinhos.
 */
import '../../atoms/Badge/Badge.css';
import './Feedback.css';

export type SeveridadeFeedback =
  | 'success'
  | 'info'
  | 'warn'
  | 'error'
  | 'secondary'
  | 'contrast';

/** Temporizador padrão por severidade. `error` nunca some sozinho. */
export const DURACAO_POR_SEVERIDADE: Record<SeveridadeFeedback, number | null> = {
  success: 4000,
  info: 5000,
  warn: 6000,
  error: null,
  secondary: 5000,
  contrast: 5000,
};

const CLASSE_SEVERIDADE: Record<SeveridadeFeedback, string> = {
  success: 'citie-sev--success',
  info: 'citie-sev--info',
  warn: 'citie-sev--warn',
  error: 'citie-sev--danger',
  secondary: 'citie-sev--secondary',
  contrast: 'citie-sev--contrast',
};

function IconeSeveridade({ severidade }: { severidade: SeveridadeFeedback }) {
  // Ícone de 16 do kit, alinhado à primeira linha do texto.
  const comum = {
    width: 16,
    height: 16,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    'aria-hidden': true as const,
  };

  if (severidade === 'success') {
    return (
      <svg {...comum}>
        <circle cx="12" cy="12" r="9" />
        <path d="m8 12 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if (severidade === 'error') {
    return (
      <svg {...comum}>
        <circle cx="12" cy="12" r="9" />
        <path d="M9 9l6 6M15 9l-6 6" strokeLinecap="round" />
      </svg>
    );
  }

  if (severidade === 'warn') {
    return (
      <svg {...comum}>
        <path d="M12 4 2.5 20h19L12 4Z" strokeLinejoin="round" />
        <path d="M12 10v4" strokeLinecap="round" />
        <circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg {...comum}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v6" strokeLinecap="round" />
      <circle cx="12" cy="7.5" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Toast                                                               */
/* ------------------------------------------------------------------ */

export interface DadosDoToast {
  id: string;
  severidade: SeveridadeFeedback;
  /** Ação e resultado: "Diária lançada com sucesso", nunca "Operação realizada". */
  titulo: string;
  mensagem?: string;
  /** Verbo no imperativo específico: "Desfazer", nunca "OK". */
  acao?: { rotulo: string; onClick?: () => void };
}

export interface ToastProps extends DadosDoToast {
  onDismiss?: (id: string) => void;
}

export function Toast({ id, severidade, titulo, mensagem, acao, onDismiss }: ToastProps) {
  const [pausado, setPausado] = useState(false);
  const duracao = DURACAO_POR_SEVERIDADE[severidade];

  useEffect(() => {
    if (duracao === null || pausado) return;
    const temporizador = setTimeout(() => onDismiss?.(id), duracao);
    return () => clearTimeout(temporizador);
  }, [duracao, pausado, id, onDismiss]);

  // `error` é crítico e interrompe a leitura; as demais severidades não.
  const critico = severidade === 'error';

  return (
    <div
      className={`citie-toast citie-sev ${CLASSE_SEVERIDADE[severidade]}`}
      role={critico ? 'alert' : 'status'}
      aria-live={critico ? 'assertive' : 'polite'}
      // O temporizador pausa com o cursor ou o foco sobre o toast.
      onMouseEnter={() => setPausado(true)}
      onMouseLeave={() => setPausado(false)}
      onFocus={() => setPausado(true)}
      onBlur={() => setPausado(false)}
    >
      <span className="citie-toast__icone">
        <IconeSeveridade severidade={severidade} />
      </span>

      <div className="citie-toast__conteudo">
        <p className="citie-toast__titulo">{titulo}</p>
        {mensagem ? <p className="citie-toast__mensagem">{mensagem}</p> : null}
      </div>

      {/* Ação à direita do texto, como no Sonner, na altura do controle Mini. */}
      {acao ? (
        <button type="button" className="citie-toast__acao" onClick={acao.onClick}>
          {acao.rotulo}
        </button>
      ) : null}

      {/* Fechar é obrigatório na severidade error e opcional nas demais. */}
      <button
        type="button"
        className="citie-toast__fechar"
        aria-label="Fechar notificação"
        onClick={() => onDismiss?.(id)}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
          <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}

export interface ToastStackProps {
  toasts: DadosDoToast[];
  onDismiss?: (id: string) => void;
  /** Máximo de 3 visíveis: o mais antigo sai quando um quarto chega. */
  max?: number;
}

/** Sob movimento reduzido a pilha reorganiza sem transição, direto no estado final. */
function movimentoReduzido() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * A pilha é dona da coreografia de saída. Dispensar um toast (temporizador,
 * botão de fechar ou excedente do `max`) primeiro o marca como "saindo": o
 * cartão esmaece e o item colapsa de altura, então os toasts abaixo sobem em
 * movimento contínuo em vez de saltar para a nova posição. O `onDismiss` do
 * chamador só é acionado quando a transição de altura termina, para o nó sair
 * do DOM sem salto residual. Sob movimento reduzido não existe fase de saída:
 * a dispensa é imediata.
 */
export function ToastStack({ toasts, onDismiss, max = 3 }: ToastStackProps) {
  const [saindo, setSaindo] = useState<readonly string[]>([]);

  const iniciarSaida = useCallback(
    (id: string) => {
      if (movimentoReduzido()) {
        onDismiss?.(id);
        return;
      }
      // A marca de saída entra depois de um quadro pintado com o item na
      // altura cheia; sem isso, um item recém-entrado em cena receberia `0fr`
      // já no primeiro estilo computado e a transição nunca aconteceria.
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setSaindo((atual) => (atual.includes(id) ? atual : [...atual, id]));
        });
      });
    },
    [onDismiss],
  );

  const concluirSaida = useCallback(
    (id: string) => {
      setSaindo((atual) => atual.filter((outro) => outro !== id));
      onDismiss?.(id);
    },
    [onDismiss],
  );

  // O chamador pode remover um toast por conta própria no meio da saída; a
  // marca de "saindo" de um id que já não existe é ignorada aqui, derivada em
  // render, e o resíduo no estado se limpa quando a saída conclui.
  const emSaida = saindo.filter((id) => toasts.some((toast) => toast.id === id));
  const chaveEmSaida = emSaida.join('\n');

  // O excedente além do `max` sai pela mesma coreografia da dispensa,
  // em vez de desaparecer de golpe como antes.
  useEffect(() => {
    const marcados = chaveEmSaida.split('\n');
    const abertos = toasts.filter((toast) => !marcados.includes(toast.id));
    const excedente = abertos.length - max;
    for (const toast of abertos.slice(0, Math.max(0, excedente))) iniciarSaida(toast.id);
  }, [toasts, chaveEmSaida, max, iniciarSaida]);

  /**
   * Rede de segurança: se a transição de altura não chegar a rodar (pilha
   * dentro de uma região oculta, por exemplo), o `transitionend` nunca dispara
   * e o toast ficaria preso no DOM, ainda anunciável ao leitor de tela. O
   * temporizador conclui a saída no dobro da duração da transição, lida do
   * próprio token para o tempo não existir em dois lugares. A leitura trata o
   * sufixo explicitamente, porque o valor chega como `140ms` no servidor de
   * desenvolvimento e como `.14s` no build minificado, e ainda respeita um piso
   * igual ao valor nominal do token: nenhuma reserialização futura do CSS pode
   * fazer o plano B virar o caminho principal.
   */
  useEffect(() => {
    if (!chaveEmSaida) return;
    const bruto = getComputedStyle(document.documentElement).getPropertyValue(
      '--citie-motion-rapido',
    );
    const duracao = tempoCssEmMs(bruto) ?? MOTION_RAPIDO_NOMINAL_MS;
    const espera = Math.max(duracao * 2, MOTION_RAPIDO_NOMINAL_MS);
    const pendentes = chaveEmSaida.split('\n');
    const temporizador = setTimeout(() => {
      for (const id of pendentes) concluirSaida(id);
    }, espera);
    return () => clearTimeout(temporizador);
  }, [chaveEmSaida, concluirSaida]);

  const ativos = toasts.filter((toast) => !emSaida.includes(toast.id));
  // O excedente permanece em cena até a marca de saída chegar, senão ele
  // sumiria de golpe antes de a coreografia começar.
  const excedentes = new Set(
    ativos.slice(0, Math.max(0, ativos.length - max)).map((toast) => toast.id),
  );
  const emCena = new Set(ativos.slice(-max).map((toast) => toast.id));

  return (
    <div className="citie-toast-stack">
      {toasts
        .filter(
          (toast) =>
            emCena.has(toast.id) || excedentes.has(toast.id) || emSaida.includes(toast.id),
        )
        .map((toast) => {
          const estaSaindo = emSaida.includes(toast.id);
          const aoTerminarTransicao = (evento: TransitionEvent<HTMLDivElement>) => {
            // Só o colapso de altura do próprio item conclui a saída; as
            // transições internas do toast (opacidade, deslocamento) não.
            if (
              estaSaindo &&
              evento.target === evento.currentTarget &&
              evento.propertyName === 'grid-template-rows'
            ) {
              concluirSaida(toast.id);
            }
          };
          return (
            <div
              key={toast.id}
              className={`citie-toast-stack__item${estaSaindo ? ' citie-toast-stack__item--saindo' : ''}`}
              onTransitionEnd={aoTerminarTransicao}
            >
              <div className="citie-toast-stack__janela">
                <Toast {...toast} onDismiss={iniciarSaida} />
              </div>
            </div>
          );
        })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Message                                                             */
/* ------------------------------------------------------------------ */

export interface MessageProps {
  severidade?: SeveridadeFeedback;
  /** Substantivo ou ação necessária: "Documentação pendente", nunca "Atenção!". */
  titulo?: string;
  children: ReactNode;
  tipo?: 'default' | 'simple' | 'outlined';
  /** Lista semântica de erros. Máximo 5 visíveis, excedente resumido. */
  erros?: string[];
  /** Até 2 botões, sempre discretos, para não competir com a ação primária da tela. */
  acoes?: { rotulo: string; onClick?: () => void }[];
  /** Bloqueio obrigatório nunca é dispensável. */
  dispensavel?: boolean;
  /** Move o foco para a mensagem, para quando ela resulta de uma ação do usuário. */
  focarAoAparecer?: boolean;
}

export function Message({
  severidade = 'info',
  titulo,
  children,
  tipo = 'default',
  erros,
  acoes,
  dispensavel = false,
  focarAoAparecer = false,
}: MessageProps) {
  const [visivel, setVisivel] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (focarAoAparecer) ref.current?.focus();
  }, [focarAoAparecer]);

  if (!visivel) return null;

  const critico = severidade === 'error';
  const visiveis = erros?.slice(0, 5) ?? [];
  const excedente = (erros?.length ?? 0) - visiveis.length;

  return (
    <div
      ref={ref}
      tabIndex={focarAoAparecer ? -1 : undefined}
      className={`citie-message citie-message--${tipo} citie-sev ${CLASSE_SEVERIDADE[severidade]}`}
      role={critico ? 'alert' : 'status'}
      aria-live={critico ? 'assertive' : 'polite'}
    >
      <span className="citie-message__icone">
        <IconeSeveridade severidade={severidade} />
      </span>

      <div className="citie-message__conteudo">
        {titulo ? <p className="citie-message__titulo">{titulo}</p> : null}
        <div className="citie-message__texto">{children}</div>

        {visiveis.length > 0 ? (
          <ul className="citie-message__lista">
            {visiveis.map((erro) => (
              <li key={erro}>{erro}</li>
            ))}
            {/* Concordância de número: com 6 erros o excedente é 1, e a linha
                precisa sair no singular. */}
            {excedente > 0 ? <li>e mais {excedente} {excedente === 1 ? 'erro' : 'erros'}</li> : null}
          </ul>
        ) : null}

        {acoes && acoes.length > 0 ? (
          <div className="citie-message__acoes">
            {acoes.slice(0, 2).map((acao) => (
              <Button key={acao.rotulo} variant="secondary" size="small" onClick={acao.onClick}>
                {acao.rotulo}
              </Button>
            ))}
          </div>
        ) : null}
      </div>

      {dispensavel ? (
        <button
          type="button"
          className="citie-message__fechar"
          aria-label="Dispensar aviso"
          onClick={() => setVisivel(false)}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        </button>
      ) : null}
    </div>
  );
}
