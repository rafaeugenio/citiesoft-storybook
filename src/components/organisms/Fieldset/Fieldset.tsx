import { useId, useState, type ReactNode } from 'react';
import './Fieldset.css';

export interface FieldsetProps {
  /** Nome do grupo de campos. Vai no `<legend>` e é anunciado junto de cada campo interno. */
  legend: string;
  /** Colapsável: a legenda vira gatilho com ícone de mais/menos e `aria-expanded`. */
  toggleable?: boolean;
  /** Só vale com `toggleable`. Começa recolhido quando `true`. */
  defaultCollapsed?: boolean;
  onToggle?: (recolhido: boolean) => void;
  children: ReactNode;
}

/**
 * Agrupamento semântico de campos de formulário.
 *
 * Figma CitieOne, página `6738:49735`. O arquivo define dois sets:
 * `fieldset` (Toggleable False/True × Collapsed N/A/False/True) e
 * `fieldset-legend` (Toggleable, Hover, Expanded). Os eixos Hover e Expanded da
 * legenda são estado de interação, resolvidos aqui em CSS e no `aria-expanded`.
 *
 * Usa `<fieldset>`/`<legend>` de verdade: o leitor de tela repete a legenda ao
 * anunciar cada campo interno, o que nenhum `div role="group"` entrega de graça.
 * Na variante colapsável o gatilho é um `<button>` dentro da legend, porque
 * `aria-expanded` só é válido em papel que o suporta.
 */
export function Fieldset({
  legend,
  toggleable = false,
  defaultCollapsed = false,
  onToggle,
  children,
}: FieldsetProps) {
  const [recolhido, setRecolhido] = useState(toggleable && defaultCollapsed);
  const conteudoId = `fieldset-conteudo-${useId()}`;

  const alternar = () => {
    const proximo = !recolhido;
    setRecolhido(proximo);
    onToggle?.(proximo);
  };

  return (
    <fieldset
      className={`citie-fieldset${toggleable ? ' citie-fieldset--colapsavel' : ''}${
        recolhido ? ' citie-fieldset--recolhido' : ''
      }`}
    >
      <legend className="citie-fieldset__legenda">
        {toggleable ? (
          <button
            type="button"
            className="citie-fieldset__gatilho"
            aria-expanded={!recolhido}
            aria-controls={conteudoId}
            onClick={alternar}
          >
            <ToggleIcon recolhido={recolhido} />
            {legend}
          </button>
        ) : (
          legend
        )}
      </legend>

      <div id={conteudoId} className="citie-fieldset__conteudo" hidden={recolhido}>
        {children}
      </div>
    </fieldset>
  );
}

/** Mais quando recolhido, menos quando aberto: o estado não fica só na cor. */
function ToggleIcon({ recolhido }: { recolhido: boolean }) {
  return (
    <svg
      className="citie-fieldset__icone"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M5 12h14" />
      {recolhido ? <path d="M12 5v14" /> : null}
    </svg>
  );
}
