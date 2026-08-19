import type { AnchorHTMLAttributes, ReactNode } from 'react';
import './Link.css';

/**
 * Papel do link na tela, que define o peso visual.
 *
 * `padrao` é o link em fluxo de texto. `identificador` é o link que abre um
 * registro a partir de uma listagem (número de processo, matrícula, protocolo):
 * ele carrega o peso de destaque porque é o alvo principal de navegação da
 * tela, e não pode competir em cor com o texto vizinho da linha.
 */
export type PapelLink = 'padrao' | 'identificador' | 'discreto';

export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
  /** Destino. Um link sem destino não é link: para ação, use o `Button` com `variant="text"`. */
  href: string;
  /** Peso visual conforme o papel na tela. */
  papel?: PapelLink;
  /**
   * Abre em nova aba. O componente acrescenta `rel="noopener noreferrer"` e
   * anuncia a mudança de contexto para o leitor de tela, que é o que a WCAG 3.2.5
   * exige de qualquer link que tira o usuário da aba atual sem avisar.
   */
  novaAba?: boolean;
  children: ReactNode;
}

/**
 * Link de texto do sistema.
 *
 * Existe porque o catálogo não tinha átomo de link, e a consequência apareceu
 * só quando as telas compostas foram montadas: o identificador de processo, que
 * é o principal alvo de navegação das duas telas mais usadas, era um `<a>` cru.
 * O navegador então aplicava o próprio azul `#0000EE`, que não é o Citie Blue em
 * tema claro e chega a **1,67:1** contra a linha zebrada em tema escuro, um
 * valor ilegível que reprova a WCAG 1.4.3 por larga margem.
 *
 * Com os tokens de marca, o mesmo link mede 5,45:1 sobre o fundo branco, 5,12:1
 * sobre a zebra clara, 5,30:1 sobre o fundo escuro e 4,78:1 sobre a zebra
 * escura. Os quatro passam AA.
 *
 * O sublinhado é permanente por decisão de acessibilidade: cor sozinha não pode
 * ser o único meio de identificar um link dentro de um bloco de texto
 * (WCAG 1.4.1), e em sistema público não se pode assumir que o usuário vai
 * passar o mouse para descobrir o que é clicável.
 */
export function Link({
  href,
  papel = 'padrao',
  novaAba = false,
  className,
  children,
  ...rest
}: LinkProps) {
  const classes = ['citie-link', `citie-link--${papel}`, className].filter(Boolean).join(' ');

  return (
    <a
      className={classes}
      href={href}
      {...(novaAba ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
      {...rest}
    >
      {children}
      {novaAba ? (
        <>
          <svg
            className="citie-link__icone-externo"
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M4.5 1.5h6v6M10.5 1.5 5 7M8 8.5v2h-6.5V4h2"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Anuncia a mudança de contexto sem poluir o texto visível. */}
          <span className="citie-link__apenas-leitor"> (abre em nova aba)</span>
        </>
      ) : null}
    </a>
  );
}
