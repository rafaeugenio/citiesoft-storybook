import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import './Toolbar.css';

/**
 * Toolbar — página do Figma CitieOne `6738:49741` (❖ Toolbar).
 *
 * O arquivo traz um único componente `toolbar` (322:13288): faixa horizontal
 * com `space-between` e três áreas em ordem fixa — grupo de botões de ícone no
 * início, campo de busca no centro e ação principal no fim. Os eixos portados
 * são justamente essas áreas (`inicio`, `centro`, `fim`), mais a orientação,
 * que o Figma desenha só na horizontal mas o papel ARIA exige declarar.
 *
 * Equivalente PrimeNG: `p-toolbar` (slots `start`, `center`, `end`).
 *
 * A toolbar não desenha controle próprio: ela agrupa `Button`, `ToggleButton`
 * e `Search` já existentes no design system.
 */
export interface ToolbarProps {
  /** Nome acessível da barra, dizendo sobre o que ela age: "Ações da lista de processos". */
  rotulo: string;
  orientacao?: 'horizontal' | 'vertical';
  /** Ações de criação e de manipulação do conjunto. */
  inicio?: ReactNode;
  /** Busca ou filtro que reduz o que está listado abaixo. */
  centro?: ReactNode;
  /** Ação principal do contexto e ações de saída (exportar, imprimir). */
  fim?: ReactNode;
  className?: string;
}

/**
 * Controles que entram no anel de setas. Campo de texto fica de fora de
 * propósito: as setas pertencem ao cursor dentro dele, e mantê-lo como parada
 * normal de Tab evita que o teclado precise adivinhar como chegar à busca.
 */
const SELETOR_DE_CONTROLES = [
  'button:not([disabled])',
  'a[href]',
  'select:not([disabled])',
  'input[type="checkbox"]:not([disabled])',
  'input[type="radio"]:not([disabled])',
].join(', ');

export function Toolbar({
  rotulo,
  orientacao = 'horizontal',
  inicio,
  centro,
  fim,
  className,
}: ToolbarProps) {
  const referencia = useRef<HTMLDivElement>(null);
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  const listarControles = () =>
    referencia.current
      ? Array.from(referencia.current.querySelectorAll<HTMLElement>(SELETOR_DE_CONTROLES))
      : [];

  // Roda a cada render de propósito: o botão de limpar da busca aparece e some,
  // então a lista de controles muda sem que a toolbar seja notificada.
  useEffect(() => {
    const controles = listarControles();
    if (controles.length === 0) return;
    const ativo = Math.min(indiceAtivo, controles.length - 1);
    controles.forEach((controle, posicao) => {
      controle.tabIndex = posicao === ativo ? 0 : -1;
    });
  });

  const mover = (destino: number) => {
    const controles = listarControles();
    if (controles.length === 0) return;
    const posicao = (destino + controles.length) % controles.length;
    setIndiceAtivo(posicao);
    controles[posicao].focus();
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>) => {
    const alvo = evento.target as HTMLElement;
    if (alvo instanceof HTMLInputElement && alvo.type !== 'checkbox' && alvo.type !== 'radio') {
      return;
    }

    const anterior = orientacao === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const proximo = orientacao === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    const controles = listarControles();
    const atual = controles.indexOf(alvo);

    if (evento.key === proximo) {
      evento.preventDefault();
      mover(atual + 1);
    } else if (evento.key === anterior) {
      evento.preventDefault();
      mover(atual - 1);
    } else if (evento.key === 'Home') {
      evento.preventDefault();
      mover(0);
    } else if (evento.key === 'End') {
      evento.preventDefault();
      mover(controles.length - 1);
    }
  };

  const classes = [
    'citie-toolbar',
    `citie-toolbar--${orientacao}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      ref={referencia}
      role="toolbar"
      aria-label={rotulo}
      aria-orientation={orientacao}
      className={classes}
      onKeyDown={aoTeclar}
      onFocus={(evento) => {
        // Clique também move o anel, senão a próxima seta salta do lugar errado.
        const posicao = listarControles().indexOf(evento.target as HTMLElement);
        if (posicao >= 0) setIndiceAtivo(posicao);
      }}
    >
      {inicio ? <div className="citie-toolbar__area citie-toolbar__area--inicio">{inicio}</div> : null}
      {centro ? <div className="citie-toolbar__area citie-toolbar__area--centro">{centro}</div> : null}
      {fim ? <div className="citie-toolbar__area citie-toolbar__area--fim">{fim}</div> : null}
    </div>
  );
}

export interface SeparadorDeToolbarProps {
  /** Perpendicular à barra: vertical na toolbar horizontal e vice-versa. */
  orientacao?: 'horizontal' | 'vertical';
}

/**
 * Divide grupos de ação com significado diferente dentro da mesma área.
 * O Figma agrupa por espaçamento, sem traço; o separador é um acréscimo para
 * quando a área acumula ações de naturezas distintas.
 */
export function SeparadorDeToolbar({ orientacao = 'vertical' }: SeparadorDeToolbarProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientacao}
      className={`citie-toolbar__separador citie-toolbar__separador--${orientacao}`}
    />
  );
}
