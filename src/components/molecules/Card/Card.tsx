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
  /**
   * Card inteiro navegável.
   *
   * Com `titulo`, quem carrega o `href` é o título, e a área de clique dele é
   * esticada até as bordas do card por um pseudo-elemento. Ver o comentário do
   * `.citie-card__link` em `Card.css`: é o que permite haver ação no rodapé de
   * um card navegável sem aninhar botão dentro de link, e é o que faz o nome
   * anunciado ao leitor de tela ser o título sozinho.
   *
   * Sem `titulo` não há texto para dar nome ao destino, então o card inteiro
   * vira o link. Nessa forma o rodapé com ação é proibido: qualquer botão ali
   * ficaria dentro do `<a>`, que é aninhamento inválido e alvo ambíguo. O
   * componente faz a regra valer: o rodapé é descartado e o desenvolvimento
   * recebe aviso no console, com o caminho de saída, que é dar `titulo` ao
   * card.
   */
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
  // Com título, o link vive no título e a área dele é esticada por CSS. Sem
  // título não há nome para o destino, e aí o card inteiro é que vira o link.
  const linkEsticado = Boolean(href && titulo);

  // Na forma sem título o card inteiro é um `<a>`, e qualquer ação de rodapé
  // cairia dentro dele. O componente recusa o rodapé nessa combinação em vez de
  // devolver botão dentro de link: a regra vale no runtime, e quem consome
  // descobre pelo componente, com o caminho de saída dito no aviso.
  const rodapeProibido = Boolean(href && !titulo && rodape);

  if (import.meta.env.DEV && rodapeProibido) {
    console.warn(
      '[Citiesoft/Card] Rodapé ignorado: card navegável sem `titulo` vira um `<a>` inteiro, e a ação do rodapé ficaria dentro do link, que é aninhamento inválido. Dê um `titulo` ao card para o link ir para ele e o rodapé voltar a valer.',
    );
  }

  const rodapeRenderizavel = rodapeProibido ? null : rodape;

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
              {linkEsticado ? (
                <a className="citie-card__link" href={href}>
                  {titulo}
                </a>
              ) : (
                titulo
              )}
            </h3>
            {subtitulo ? <p className="citie-card__subtitulo">{subtitulo}</p> : null}
          </div>
        </header>
      ) : null}

      <div className="citie-card__corpo">{children}</div>

      {rodapeRenderizavel ? (
        <footer className="citie-card__rodape">{rodapeRenderizavel}</footer>
      ) : null}
    </>
  );

  if (href && !linkEsticado) {
    return (
      <a className={classes} href={href}>
        {conteudo}
      </a>
    );
  }

  return <section className={classes}>{conteudo}</section>;
}
