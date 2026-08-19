import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import './SpeedDial.css';

/**
 * SpeedDial — leque de atalhos flutuantes.
 *
 * Página do Figma CitieOne `6738:49719` (❖ SpeedDial).
 * Variantes respeitadas do componente `speeddial`:
 * - `Display`: False, True → o leque fechado e o leque aberto (`aberto`).
 * - `Direction`: Down, Up, Left, Right, Up Right, Up Left, Down Right, Down Left
 *   → `direcao`, o leque linear em qualquer um dos oito rumos.
 * - `Circular` + `Circular Type`: Semi-Circle, Quarter-Circle, Full Circle
 *   → `circular`, que substitui o rumo linear pelo arco.
 *
 * A spec de botões da Citiesoft manda no resto: acionamento de 40px, ação
 * destrutiva nunca no leque e o estado aberto escurecendo o fundo ao redor
 * (`mascara`).
 *
 * Equivalente PrimeNG: `p-speeddial` (`model`, `direction`, `type`, `mask`).
 */

export type DirecaoDoSpeedDial =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'up-right'
  | 'up-left'
  | 'down-right'
  | 'down-left';

export type CircularDoSpeedDial = 'semi-circle' | 'quarter-circle' | 'full-circle';

export interface AcaoDoSpeedDial {
  id: string;
  /** Vira o nome acessível do botão e o texto da dica visível. */
  rotulo: string;
  icone: ReactNode;
  desabilitado?: boolean;
}

export interface SpeedDialProps {
  /** Nome acessível do acionamento: diga a que contexto os atalhos pertencem. */
  rotulo: string;
  acoes: AcaoDoSpeedDial[];
  /** Rumo do leque linear. Ignorado quando `circular` está definido. */
  direcao?: DirecaoDoSpeedDial;
  /** Troca o leque linear pelo arco do Figma (`Circular Type`). */
  circular?: CircularDoSpeedDial;
  /** Escurece o fundo ao redor enquanto o leque está aberto. */
  mascara?: boolean;
  /** Ícone do acionamento. O padrão é o "+" que gira para "×" quando abre. */
  iconeAcionador?: ReactNode;
  /** Controla o leque de fora. Sem ela, o componente guarda o próprio estado. */
  aberto?: boolean;
  onAlternar?: (aberto: boolean) => void;
  onSelecionar?: (id: string) => void;
}

/* Vetores unitários dos oito rumos do eixo `Direction`. O eixo Y cresce para
   baixo na tela, então "up" é -1. A diagonal usa √2/2 para que o atalho fique à
   mesma distância do acionamento em qualquer rumo. */
const DIAGONAL = Math.SQRT1_2;
const VETORES: Record<DirecaoDoSpeedDial, [number, number]> = {
  up: [0, -1],
  down: [0, 1],
  left: [-1, 0],
  right: [1, 0],
  'up-right': [DIAGONAL, -DIAGONAL],
  'up-left': [-DIAGONAL, -DIAGONAL],
  'down-right': [DIAGONAL, DIAGONAL],
  'down-left': [-DIAGONAL, DIAGONAL],
};

/* Acionamento de 40px + respiro de 8 + metade da ação de 32 = 44px até o centro
   do primeiro atalho; daí em diante, 32 de ação + 8 de respiro. */
const DISTANCIA_INICIAL = 44;
const PASSO = 40;

const GRAUS_DO_ARCO: Record<CircularDoSpeedDial, number> = {
  'full-circle': 360,
  'semi-circle': 180,
  'quarter-circle': 90,
};

/**
 * Ângulo de cada atalho no arco, em graus, com 0 apontando para a direita e o
 * negativo subindo na tela. O círculo cheio distribui as ações pelos 360 e não
 * repete a ponta; o semicírculo abre para cima (acionamento no rodapé) e o
 * quarto de círculo sobe e vai para a esquerda (acionamento no canto inferior
 * direito, que é onde ele aparece no arquivo do Figma).
 */
function anguloNoArco(tipo: CircularDoSpeedDial, indice: number, total: number) {
  if (tipo === 'full-circle') return -90 + (indice * 360) / total;

  const inicio = tipo === 'semi-circle' ? 0 : -90;
  const arco = -GRAUS_DO_ARCO[tipo];
  return inicio + (indice * arco) / Math.max(total - 1, 1);
}

/** Raio que garante `PASSO` de folga entre atalhos vizinhos no arco escolhido. */
function raioDoArco(tipo: CircularDoSpeedDial, total: number) {
  const necessario = (total * PASSO * 180) / (GRAUS_DO_ARCO[tipo] * Math.PI);
  return Math.max(76, necessario);
}

function IconeMais() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 5v14M5 12h14" strokeLinecap="round" />
    </svg>
  );
}

export function SpeedDial({
  rotulo,
  acoes,
  direcao = 'up',
  circular,
  mascara = false,
  iconeAcionador,
  aberto: abertoControlado,
  onAlternar,
  onSelecionar,
}: SpeedDialProps) {
  const idMenu = useId();
  const raiz = useRef<HTMLDivElement>(null);
  const acionador = useRef<HTMLButtonElement>(null);
  const referencias = useRef<(HTMLButtonElement | null)[]>([]);
  const [abertoInterno, setAbertoInterno] = useState(false);
  // Roving tabindex: o menu inteiro é uma parada de Tab, as setas andam dentro.
  const [indiceAtivo, setIndiceAtivo] = useState(0);

  const aberto = abertoControlado ?? abertoInterno;

  const alternar = useCallback(
    (proximo: boolean) => {
      if (abertoControlado === undefined) setAbertoInterno(proximo);
      onAlternar?.(proximo);
    },
    [abertoControlado, onAlternar],
  );

  const fecharEDevolverFoco = useCallback(() => {
    alternar(false);
    acionador.current?.focus();
  }, [alternar]);

  useEffect(() => {
    if (!aberto) return;

    // Padrão de botão de menu: ao abrir, o foco vai para o primeiro atalho.
    // O `onFocus` do próprio botão devolve o roving tabindex para o índice 0.
    referencias.current[0]?.focus();
  }, [aberto]);

  useEffect(() => {
    if (!aberto) return;

    const aoApontarFora = (evento: PointerEvent) => {
      if (!raiz.current?.contains(evento.target as Node)) alternar(false);
    };

    document.addEventListener('pointerdown', aoApontarFora);
    return () => document.removeEventListener('pointerdown', aoApontarFora);
  }, [aberto, alternar]);

  const focar = (indice: number) => {
    const total = acoes.length;
    const alvo = ((indice % total) + total) % total;
    setIndiceAtivo(alvo);
    referencias.current[alvo]?.focus();
  };

  const aoTeclarNoAcionador = (evento: KeyboardEvent<HTMLButtonElement>) => {
    // Enter e Espaço já chegam como clique no botão nativo; as setas abrem também.
    if (['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'].includes(evento.key) && !aberto) {
      evento.preventDefault();
      alternar(true);
    } else if (evento.key === 'Escape' && aberto) {
      evento.preventDefault();
      alternar(false);
    }
  };

  const aoTeclarNaAcao = (evento: KeyboardEvent<HTMLButtonElement>, indice: number) => {
    // O leque muda de eixo conforme o rumo, então as quatro setas andam na lista.
    if (evento.key === 'ArrowDown' || evento.key === 'ArrowRight') {
      evento.preventDefault();
      focar(indice + 1);
    } else if (evento.key === 'ArrowUp' || evento.key === 'ArrowLeft') {
      evento.preventDefault();
      focar(indice - 1);
    } else if (evento.key === 'Home') {
      evento.preventDefault();
      focar(0);
    } else if (evento.key === 'End') {
      evento.preventDefault();
      focar(acoes.length - 1);
    } else if (evento.key === 'Escape') {
      evento.preventDefault();
      fecharEDevolverFoco();
    } else if (evento.key === 'Tab') {
      alternar(false);
    }
  };

  const deslocamento = (indice: number): [number, number] => {
    if (circular) {
      const raio = raioDoArco(circular, acoes.length);
      const radianos = (anguloNoArco(circular, indice, acoes.length) * Math.PI) / 180;
      return [Math.cos(radianos) * raio, Math.sin(radianos) * raio];
    }

    const [x, y] = VETORES[direcao];
    const distancia = DISTANCIA_INICIAL + indice * PASSO;
    return [x * distancia, y * distancia];
  };

  const classes = [
    'citie-speeddial',
    circular ? `citie-speeddial--${circular}` : `citie-speeddial--${direcao}`,
    aberto ? 'citie-speeddial--aberto' : null,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} ref={raiz}>
      {aberto && mascara ? (
        <div
          className="citie-speeddial__mascara"
          aria-hidden="true"
          onClick={() => alternar(false)}
        />
      ) : null}

      <button
        type="button"
        ref={acionador}
        className="citie-speeddial__acionador"
        aria-haspopup="menu"
        aria-expanded={aberto}
        aria-controls={aberto ? idMenu : undefined}
        aria-label={rotulo}
        onClick={() => alternar(!aberto)}
        onKeyDown={aoTeclarNoAcionador}
      >
        <span className="citie-speeddial__icone" aria-hidden="true">
          {iconeAcionador ?? <IconeMais />}
        </span>
      </button>

      {aberto ? (
        <div className="citie-speeddial__acoes" id={idMenu} role="menu" aria-label={rotulo}>
          {acoes.map((acao, indice) => {
            const [dx, dy] = deslocamento(indice);

            return (
              /* `role="none"` porque só menuitem, group e separator podem ser
                 filhos de um menu; a casa existe apenas para ancorar a dica. */
              <div
                key={acao.id}
                role="none"
                className="citie-speeddial__casa"
                style={
                  {
                    '--citie-speeddial-dx': `${Math.round(dx)}px`,
                    '--citie-speeddial-dy': `${Math.round(dy)}px`,
                    '--citie-speeddial-atraso': `${indice * 40}ms`,
                  } as CSSProperties
                }
              >
                <button
                  type="button"
                  role="menuitem"
                  ref={(elemento) => {
                    referencias.current[indice] = elemento;
                  }}
                  className="citie-speeddial__acao"
                  // Ação só de ícone: o rótulo é nome acessível e dica visível.
                  aria-label={acao.rotulo}
                  aria-disabled={acao.desabilitado || undefined}
                  tabIndex={indice === indiceAtivo ? 0 : -1}
                  onKeyDown={(evento) => aoTeclarNaAcao(evento, indice)}
                  onFocus={() => setIndiceAtivo(indice)}
                  onClick={() => {
                    // Atalho indisponível segue focável, mas não dispara nada.
                    if (acao.desabilitado) return;
                    onSelecionar?.(acao.id);
                    fecharEDevolverFoco();
                  }}
                >
                  <span className="citie-speeddial__icone" aria-hidden="true">
                    {acao.icone}
                  </span>
                </button>
                <span className="citie-speeddial__dica" aria-hidden="true">
                  {acao.rotulo}
                </span>
              </div>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
