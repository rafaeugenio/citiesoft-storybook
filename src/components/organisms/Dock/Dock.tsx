import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import './Dock.css';

/**
 * Dock — barra flutuante de atalhos por ícone.
 *
 * Página do Figma CitieOne `6738:52935` (❖ Dock).
 * Variantes respeitadas:
 * - `dock` · `Location`: Bottom, Top, Left, Right (as quatro bordas da área).
 * - `dock-item` · `Focus`: False, True (item em destaque).
 *
 * O Figma desenha o item em destaque como ícone ampliado sobre o vizinho. Aqui a
 * ampliação é puramente decorativa: o alvo de clique não muda de tamanho, então
 * ninguém perde a mira do ponteiro nem a ordem de foco.
 *
 * Equivalente PrimeNG: `p-dock` (`model`, `position`).
 */

export type PosicaoDoDock = 'bottom' | 'top' | 'left' | 'right';

export interface ItemDoDock {
  id: string;
  /** Vira o nome acessível do botão e o texto da dica visível. */
  rotulo: string;
  icone: ReactNode;
  desabilitado?: boolean;
}

export interface DockProps {
  /** Nome acessível da barra: diga a que conjunto de atalhos ela pertence. */
  rotulo: string;
  itens: ItemDoDock[];
  posicao?: PosicaoDoDock;
  /** Desliga a ampliação no hover mesmo em quem não pediu menos movimento. */
  semAmpliacao?: boolean;
  onSelecionar?: (id: string) => void;
}

export function Dock({
  rotulo,
  itens,
  posicao = 'bottom',
  semAmpliacao = false,
  onSelecionar,
}: DockProps) {
  const referencias = useRef<(HTMLButtonElement | null)[]>([]);
  // Roving tabindex: só um item entra na ordem de Tab; as setas andam por dentro.
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  const vertical = posicao === 'left' || posicao === 'right';

  const focar = (indice: number) => {
    const total = itens.length;
    const alvo = ((indice % total) + total) % total;
    setIndiceAtivo(alvo);
    referencias.current[alvo]?.focus();
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLButtonElement>, indice: number) => {
    const anterior = vertical ? 'ArrowUp' : 'ArrowLeft';
    const proximo = vertical ? 'ArrowDown' : 'ArrowRight';

    if (evento.key === proximo) {
      evento.preventDefault();
      focar(indice + 1);
    } else if (evento.key === anterior) {
      evento.preventDefault();
      focar(indice - 1);
    } else if (evento.key === 'Home') {
      evento.preventDefault();
      focar(0);
    } else if (evento.key === 'End') {
      evento.preventDefault();
      focar(itens.length - 1);
    }
  };

  return (
    <div
      className={`citie-dock citie-dock--${posicao}${
        semAmpliacao ? ' citie-dock--sem-ampliacao' : ''
      }`}
    >
      <div
        className="citie-dock__barra"
        role="toolbar"
        aria-label={rotulo}
        aria-orientation={vertical ? 'vertical' : 'horizontal'}
      >
        {itens.map((item, indice) => (
          <div key={item.id} className="citie-dock__casa">
            <button
              type="button"
              ref={(elemento) => {
                referencias.current[indice] = elemento;
              }}
              className="citie-dock__item"
              // Ícone sozinho: o rótulo vira nome acessível e também dica visível.
              aria-label={item.rotulo}
              aria-disabled={item.desabilitado || undefined}
              tabIndex={indice === indiceAtivo ? 0 : -1}
              onKeyDown={(evento) => aoTeclar(evento, indice)}
              onFocus={() => setIndiceAtivo(indice)}
              onClick={() => {
                // Item desabilitado continua focável para não sumir do teclado.
                if (!item.desabilitado) onSelecionar?.(item.id);
              }}
            >
              <span className="citie-dock__icone" aria-hidden="true">
                {item.icone}
              </span>
            </button>
            <span className="citie-dock__dica" aria-hidden="true">
              {item.rotulo}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
