import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from '../Button/Button';
import './EmptyState.css';

export type SituacaoVazia = 'primeiro-uso' | 'busca-sem-resultado' | 'erro' | 'permissao';

export interface EmptyStateProps {
  /** Explica a causa com o vocabulário do domínio, nunca "Sem dados". */
  titulo: string;
  descricao: string;
  situacao?: SituacaoVazia;
  size?: 'sm' | 'md' | 'lg';
  /** No máximo duas ações visíveis. */
  acaoPrimaria?: { rotulo: string; onClick?: () => void };
  acaoSecundaria?: { rotulo: string; onClick?: () => void };
  /** Código técnico, discreto abaixo da descrição. */
  codigoErro?: string;
  /** Filtros aplicados exibidos como chips, para reforçar a causa. */
  filtrosAplicados?: ReactNode;
}

function Ilustracao({ situacao }: { situacao: SituacaoVazia }) {
  const comum = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    'aria-hidden': true as const,
  };

  if (situacao === 'busca-sem-resultado') {
    return (
      <svg {...comum}>
        <circle cx="11" cy="11" r="6" />
        <path d="m16 16 4 4" strokeLinecap="round" />
      </svg>
    );
  }

  if (situacao === 'erro') {
    return (
      <svg {...comum}>
        <circle cx="12" cy="12" r="8" />
        <path d="M12 8v5" strokeLinecap="round" />
        <circle cx="12" cy="16" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  return (
    <svg {...comum}>
      <path d="M5 4h9l5 5v11a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" />
      <path d="M14 4v5h5" />
    </svg>
  );
}

/**
 * Estado vazio (empty-state.md). A causa muda o ícone, o título e a ação:
 * primeiro uso e busca sem resultado nunca compartilham o mesmo conteúdo.
 */
export function EmptyState({
  titulo,
  descricao,
  situacao = 'primeiro-uso',
  size = 'lg',
  acaoPrimaria,
  acaoSecundaria,
  codigoErro,
  filtrosAplicados,
}: EmptyStateProps) {
  const primariaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // No tamanho lg em página completa, o botão primário recebe foco.
    if (size === 'lg') primariaRef.current?.querySelector('button')?.focus();
  }, [size]);

  return (
    <div
      className={`citie-empty citie-empty--${size}`}
      // Anunciado ao aparecer depois de um carregamento, sem interromper a leitura.
      role="status"
      aria-live="polite"
    >
      {filtrosAplicados ? <div className="citie-empty__filtros">{filtrosAplicados}</div> : null}

      <div className="citie-empty__ilustracao">
        <Ilustracao situacao={situacao} />
      </div>

      <h2 className="citie-empty__titulo">{titulo}</h2>
      <p className="citie-empty__descricao">{descricao}</p>
      {codigoErro ? <p className="citie-empty__codigo">{codigoErro}</p> : null}

      {acaoPrimaria || acaoSecundaria ? (
        <div className="citie-empty__acoes" ref={primariaRef}>
          {acaoPrimaria ? (
            <Button variant="primary" onClick={acaoPrimaria.onClick}>
              {acaoPrimaria.rotulo}
            </Button>
          ) : null}
          {acaoSecundaria ? (
            <Button variant="secondary" onClick={acaoSecundaria.onClick}>
              {acaoSecundaria.rotulo}
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
