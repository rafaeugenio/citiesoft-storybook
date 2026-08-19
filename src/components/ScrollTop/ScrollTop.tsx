import { useEffect, useState, type RefObject } from 'react';
import './ScrollTop.css';

/**
 * ScrollTop — botão flutuante que volta ao topo depois de um limiar de rolagem.
 *
 * Página do Figma CitieOne `6738:55112` (❖ ScrollTop).
 * Variantes respeitadas:
 * - `scrolltop` · `Type`: Window (flutua sobre a página inteira) e Element
 *   (ancorado ao canto de um container rolável).
 * - `Content`: no arquivo é uma propriedade de texto do botão; aqui ela é o
 *   nome acessível (`rotulo`), já que o botão é só ícone.
 *
 * O Figma desenha o botão em preto/branco do tema PrimeOne. A marca Citiesoft
 * usa o Citie Blue, então o círculo sai de `--citie-brand-primary`.
 *
 * Voltar ao topo aqui move a rolagem **e** o foco. Só rolar deixaria quem navega
 * por teclado parado no meio da página, com o botão sumindo debaixo do foco.
 *
 * Equivalente PrimeNG: `p-scrolltop` (`target`, `threshold`, `behavior`).
 */

export type TipoDoScrollTop = 'janela' | 'elemento';

export interface ScrollTopProps {
  /** `janela` acompanha a rolagem da página; `elemento` acompanha a de `alvo`. */
  tipo?: TipoDoScrollTop;
  /** Container rolável observado quando `tipo` é `elemento`. */
  alvo?: RefObject<HTMLElement | null>;
  /**
   * Elemento que recebe o foco depois de voltar ao topo. Sem ele, o foco vai
   * para o container rolável (`elemento`) ou para o `body` (`janela`), o que
   * reinicia a ordem de Tab mas não anuncia onde a pessoa chegou. Aponte para o
   * título da página ou para o cabeçalho da listagem sempre que possível.
   */
  alvoDeFoco?: RefObject<HTMLElement | null>;
  /** Rolagem em pixels a partir da qual o botão aparece. */
  limiar?: number;
  /** Nome acessível do botão só de ícone. */
  rotulo?: string;
  /** Aviso lido em região `polite` quando o botão entra, sem cortar a leitura. */
  anuncio?: string;
  onVoltarAoTopo?: () => void;
}

const TAGS_FOCAVEIS = ['A', 'BUTTON', 'INPUT', 'SELECT', 'TEXTAREA'];

function focarTopo(elemento: HTMLElement) {
  // Cabeçalho e container não são focáveis por natureza: tabindex -1 deixa o
  // foco por programa entrar sem criar uma parada extra de Tab.
  if (!elemento.hasAttribute('tabindex') && !TAGS_FOCAVEIS.includes(elemento.tagName)) {
    elemento.setAttribute('tabindex', '-1');
  }
  // `preventScroll` evita que o navegador dê um salto e atropele a rolagem suave.
  elemento.focus({ preventScroll: true });
}

function movimentoReduzido() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function ScrollTop({
  tipo = 'janela',
  alvo,
  alvoDeFoco,
  limiar = 200,
  rotulo = 'Voltar ao topo',
  anuncio = 'Botão para voltar ao topo disponível.',
  onVoltarAoTopo,
}: ScrollTopProps) {
  const [visivel, setVisivel] = useState(false);

  useEffect(() => {
    const container = tipo === 'elemento' ? alvo?.current : null;
    const observado: HTMLElement | Window = container ?? window;

    const avaliar = () => {
      const rolagem = container ? container.scrollTop : window.scrollY;
      setVisivel(rolagem > limiar);
    };

    avaliar();
    observado.addEventListener('scroll', avaliar, { passive: true });
    return () => observado.removeEventListener('scroll', avaliar);
  }, [tipo, alvo, limiar]);

  const voltarAoTopo = () => {
    const container = tipo === 'elemento' ? alvo?.current : null;
    const comportamento: ScrollBehavior = movimentoReduzido() ? 'auto' : 'smooth';

    if (container) {
      container.scrollTo({ top: 0, behavior: comportamento });
    } else {
      window.scrollTo({ top: 0, behavior: comportamento });
    }

    const destino = alvoDeFoco?.current ?? container ?? document.body;
    focarTopo(destino);
    onVoltarAoTopo?.();
  };

  return (
    <>
      {/* A região existe desde o começo: `polite` só anuncia mudança de conteúdo
          e nunca interrompe o que o leitor de tela estiver lendo. */}
      <div role="status" className="citie-visualmente-oculto">
        {visivel ? anuncio : null}
      </div>
      {visivel && (
        <button
          type="button"
          className={`citie-scrolltop citie-scrolltop--${tipo}`}
          aria-label={rotulo}
          onClick={voltarAoTopo}
        >
          <svg
            className="citie-scrolltop__icone"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M6 15l6-6 6 6" />
          </svg>
        </button>
      )}
    </>
  );
}
