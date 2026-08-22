import { useId, useState, type ReactNode } from 'react';
import './Panel.css';

/**
 * Panel: página `6738:49736` do Figma CitieOne (component set `panel`).
 *
 * Eixos do arquivo respeitados:
 * - `Toggleable` (False/True) → prop `colapsavel`
 * - `Toggle Status` (Expanded/Collapsed/N/A) → prop `aberto` / `abertoInicial`
 * - `Show Footer` (False/True) → prop `rodape`
 * - `Custom Icon` (False/True) → prop `acoes`, a área de ações do cabeçalho
 * - `Header` / `Content` / `Footer` (texto) → `titulo` / `children` / `rodape`
 *
 * Equivalente PrimeNG: `p-panel`. É um painel único; para várias seções
 * empilhadas use o `Accordion` de `../Tabs/Tabs`.
 *
 * Cor, raio e tipografia vêm dos tokens Citiesoft, nunca do CitieOne.
 */
export interface PanelProps {
  /** Substantivo ou sintagma nominal, sem verbo: "Dados do processo". */
  titulo: string;
  children: ReactNode;
  /** Conteúdo do rodapé. Ausente equivale a `Show Footer = False`. */
  rodape?: ReactNode;
  /** Habilita o gatilho de recolher/expandir no cabeçalho. */
  colapsavel?: boolean;
  /** Estado inicial quando o componente controla a si mesmo. */
  abertoInicial?: boolean;
  /** Estado controlado pelo pai. Quando informado, exige `onAlternar`. */
  aberto?: boolean;
  onAlternar?: (aberto: boolean) => void;
  /**
   * Ações do cabeçalho, à esquerda do gatilho. Use `Button` com `iconOnly`
   * e `aria-label`; no máximo 2 para o cabeçalho continuar legível.
   */
  acoes?: ReactNode;
}

export function Panel({
  titulo,
  children,
  rodape,
  colapsavel = false,
  abertoInicial = true,
  aberto,
  onAlternar,
  acoes,
}: PanelProps) {
  const uid = useId();
  const tituloId = `citie-panel-titulo-${uid}`;
  const corpoId = `citie-panel-corpo-${uid}`;

  const [abertoInterno, setAbertoInterno] = useState(abertoInicial);
  const controlado = aberto !== undefined;
  // Painel não colapsável não tem estado: o corpo está sempre visível.
  const estaAberto = colapsavel ? (controlado ? aberto : abertoInterno) : true;

  const alternar = () => {
    const proximo = !estaAberto;
    if (!controlado) setAbertoInterno(proximo);
    onAlternar?.(proximo);
  };

  const classes = ['citie-panel', estaAberto ? null : 'citie-panel--recolhido']
    .filter(Boolean)
    .join(' ');

  return (
    <section className={classes}>
      <div className="citie-panel__cabecalho">
        <h3 className="citie-panel__titulo" id={tituloId}>
          {titulo}
        </h3>

        {acoes || colapsavel ? (
          <div className="citie-panel__acoes">
            {acoes}
            {colapsavel ? (
              <button
                type="button"
                className="citie-panel__gatilho"
                aria-expanded={estaAberto}
                aria-controls={corpoId}
                aria-label={`${estaAberto ? 'Recolher' : 'Expandir'} painel ${titulo}`}
                onClick={alternar}
              >
                <IconeAlternar aberto={estaAberto} />
              </button>
            ) : null}
          </div>
        ) : null}
      </div>

      {/**
        * Disclosure: o colapso transita da altura real do conteúdo via
        * `grid-template-rows` (0fr para 1fr). Dois mecanismos com papéis
        * distintos: `inert` sai do React e corta foco e árvore de
        * acessibilidade NO MESMO QUADRO do clique de recolher, para um Tab
        * durante o fechamento nunca aterrissar em conteúdo que está sumindo;
        * `visibility: hidden`, atrasada no CSS, só encerra a pintura quando a
        * altura termina de fechar, para a transição continuar visível.
        */}
      <div
        id={corpoId}
        role="region"
        aria-labelledby={tituloId}
        className={`citie-panel__conteudo${estaAberto ? ' citie-panel__conteudo--aberto' : ''}`}
        inert={!estaAberto}
      >
        <div className="citie-panel__clip">
          <div className="citie-panel__corpo">{children}</div>
          {rodape ? <footer className="citie-panel__rodape">{rodape}</footer> : null}
        </div>
      </div>
    </section>
  );
}

/** Menos/mais, como no Figma: a forma sozinha já distingue o estado, sem depender de cor. */
function IconeAlternar({ aberto }: { aberto: boolean }) {
  return (
    <svg
      className="citie-panel__icone"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M2 7h10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {aberto ? null : (
        <path d="M7 2v10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  );
}
