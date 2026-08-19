import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Button } from '../../atoms/Button/Button';
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
  const comum = {
    width: 20,
    height: 20,
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
        {acao ? (
          <button type="button" className="citie-toast__acao" onClick={acao.onClick}>
            {acao.rotulo}
          </button>
        ) : null}
      </div>

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

export function ToastStack({ toasts, onDismiss, max = 3 }: ToastStackProps) {
  const visiveis = toasts.slice(-max);
  return (
    <div className="citie-toast-stack">
      {visiveis.map((toast) => (
        <Toast key={toast.id} {...toast} onDismiss={onDismiss} />
      ))}
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
            {excedente > 0 ? <li>e mais {excedente} erros</li> : null}
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
