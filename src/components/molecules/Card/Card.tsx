import type { ReactNode } from 'react';
import { AlertIcon } from '../../primitives/Field/Field';
import './Card.css';

export type DensidadeCard = 'confortavel' | 'compacta' | 'ultracompacta';

export interface CardProps {
  /** Substantivo ou sintagma nominal, sem verbo: "Dados do servidor". */
  titulo?: string;
  /** Complemento contextual: data de atualização, identificação secundária. */
  subtitulo?: string;
  children: ReactNode;
  /** No máximo 3 ações, com a destrutiva fora do rodapé em listas densas. */
  rodape?: ReactNode;
  densidade?: DensidadeCard;
  /** Card inteiro navegável: vira link, nunca div com clique. */
  href?: string;
  selecionado?: boolean;
  erro?: boolean;
  midia?: ReactNode;
}

export function Card({
  titulo,
  subtitulo,
  children,
  rodape,
  densidade = 'confortavel',
  href,
  selecionado = false,
  erro = false,
  midia,
}: CardProps) {
  const classes = [
    'citie-card',
    `citie-card--${densidade}`,
    href ? 'citie-card--clicavel' : null,
    selecionado ? 'citie-card--selecionado' : null,
    erro ? 'citie-card--erro' : null,
  ]
    .filter(Boolean)
    .join(' ');

  const conteudo = (
    <>
      {midia ? <div className="citie-card__midia">{midia}</div> : null}

      {titulo ? (
        <header className="citie-card__cabecalho">
          <div>
            <h3 className="citie-card__titulo">
              {erro ? (
                <span className="citie-card__alerta">
                  <AlertIcon />
                </span>
              ) : null}
              {titulo}
            </h3>
            {subtitulo ? <p className="citie-card__subtitulo">{subtitulo}</p> : null}
          </div>
        </header>
      ) : null}

      <div className="citie-card__corpo">{children}</div>

      {rodape ? <footer className="citie-card__rodape">{rodape}</footer> : null}
    </>
  );

  if (href) {
    return (
      <a className={classes} href={href}>
        {conteudo}
      </a>
    );
  }

  return <section className={classes}>{conteudo}</section>;
}
