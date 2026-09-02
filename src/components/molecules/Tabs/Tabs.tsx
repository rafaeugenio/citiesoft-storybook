import { useId, useState, type ReactNode } from 'react';
import { Badge } from '../../atoms/Badge/Badge';
import { useRealceDeslizante } from '../../primitives/RealceDeslizante/useRealceDeslizante';
import './Tabs.css';

export interface AbaProps {
  id: string;
  /** Substantivo conciso de 1 a 3 palavras, sem verbo: "Documentos". */
  rotulo: string;
  conteudo: ReactNode;
  /** Ícone à esquerda do rótulo (conteúdo Icon / Icon + Label do kit). */
  icone?: ReactNode;
  /** Esconde o rótulo visualmente; ele continua como nome acessível da aba. */
  somenteIcone?: boolean;
  /** Contagem à direita do rótulo; acima de 99 vira "99+". */
  contagem?: number;
  /** Sinaliza erro de validação dentro do painel, sem esconder o problema. */
  erro?: boolean;
  disabled?: boolean;
}

export interface TabsProps {
  label: string;
  abas: AbaProps[];
  variante?: 'line' | 'pill' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  abaInicial?: string;
}

/**
 * Abas (tabs-accordion.md). Máximo recomendado de 7 abas visíveis.
 * Teclado: setas em anel, Home e End nas pontas, Enter ou Espaço ativa.
 *
 * O indicador da aba ativa é um realce único que desliza da aba anterior para
 * a nova: sublinhado na variante `line`, barra lateral na `vertical` e pílula
 * de superfície na `pill`. Ele é decoração (`aria-hidden`); o estado continua
 * em `aria-selected` e na cor do rótulo.
 */
export function Tabs({ label, abas, variante = 'line', size = 'md', abaInicial }: TabsProps) {
  const [ativa, setAtiva] = useState(abaInicial ?? abas[0]?.id);
  const uid = useId();
  const { trilhoRef: listaRef, estilo } = useRealceDeslizante<HTMLDivElement>(ativa ?? null);

  const habilitadas = abas.filter((aba) => !aba.disabled);

  const moverFoco = (passo: number) => {
    const indice = habilitadas.findIndex((aba) => aba.id === ativa);
    // Navegação em anel: da última volta para a primeira.
    const destino = habilitadas[(indice + passo + habilitadas.length) % habilitadas.length];
    setAtiva(destino.id);
    listaRef.current
      ?.querySelector<HTMLButtonElement>(`#aba-${uid}-${destino.id}`)
      ?.focus();
  };

  return (
    <div className={`citie-tabs citie-tabs--${variante} citie-tabs--${size}`}>
      <div
        ref={listaRef}
        className="citie-tabs__lista"
        role="tablist"
        aria-label={label}
        aria-orientation={variante === 'vertical' ? 'vertical' : 'horizontal'}
        onKeyDown={(evento) => {
          const acoes: Record<string, () => void> = {
            ArrowRight: () => moverFoco(1),
            ArrowDown: () => moverFoco(1),
            ArrowLeft: () => moverFoco(-1),
            ArrowUp: () => moverFoco(-1),
            Home: () => setAtiva(habilitadas[0].id),
            End: () => setAtiva(habilitadas[habilitadas.length - 1].id),
          };
          const acao = acoes[evento.key];
          if (acao) {
            evento.preventDefault();
            acao();
          }
        }}
      >
        {estilo ? (
          <span className="citie-tabs__realce" aria-hidden="true" style={estilo} />
        ) : null}
        {abas.map((aba) => {
          const selecionada = aba.id === ativa;
          return (
            <button
              key={aba.id}
              id={`aba-${uid}-${aba.id}`}
              data-realce-id={aba.id}
              type="button"
              role="tab"
              className={`citie-tabs__aba${selecionada ? ' citie-tabs__aba--ativa' : ''}`}
              aria-selected={selecionada}
              aria-controls={`painel-${uid}-${aba.id}`}
              // Aba desabilitada não recebe foco, mas segue identificável.
              tabIndex={selecionada ? 0 : -1}
              disabled={aba.disabled}
              onClick={() => setAtiva(aba.id)}
            >
              {aba.erro ? (
                <span className="citie-tabs__erro" aria-label="com erro de preenchimento">
                  !
                </span>
              ) : null}
              {aba.icone ? (
                <span className="citie-tabs__icone" aria-hidden="true">
                  {aba.icone}
                </span>
              ) : null}
              {aba.somenteIcone ? (
                <span className="citie-visualmente-oculto">{aba.rotulo}</span>
              ) : (
                aba.rotulo
              )}
              {aba.contagem !== undefined ? (
                <Badge value={aba.contagem} severity="secondary" size="sm" />
              ) : null}
            </button>
          );
        })}
      </div>

      {abas.map((aba) => (
        <div
          key={aba.id}
          id={`painel-${uid}-${aba.id}`}
          role="tabpanel"
          aria-labelledby={`aba-${uid}-${aba.id}`}
          className="citie-tabs__painel"
          hidden={aba.id !== ativa}
          tabIndex={0}
        >
          {aba.conteudo}
        </div>
      ))}
    </div>
  );
}

export interface ItemDoAccordionProps {
  id: string;
  titulo: string;
  conteudo: ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  itens: ItemDoAccordionProps[];
  /** Permite mais de uma seção aberta ao mesmo tempo. */
  multiplo?: boolean;
  abertoInicial?: string[];
}

export function Accordion({ itens, multiplo = false, abertoInicial = [] }: AccordionProps) {
  const [abertos, setAbertos] = useState<string[]>(abertoInicial);
  const uid = useId();

  const alternar = (id: string) =>
    setAbertos((atual) =>
      atual.includes(id) ? atual.filter((item) => item !== id) : multiplo ? [...atual, id] : [id],
    );

  return (
    <div className="citie-accordion">
      {itens.map((item) => {
        const aberto = abertos.includes(item.id);
        return (
          <div key={item.id} className="citie-accordion__item">
            <h3 className="citie-accordion__cabecalho">
              <button
                type="button"
                id={`accordion-${uid}-${item.id}`}
                className="citie-accordion__gatilho"
                aria-expanded={aberto}
                aria-controls={`accordion-painel-${uid}-${item.id}`}
                disabled={item.disabled}
                onClick={() => alternar(item.id)}
              >
                <span className={`citie-accordion__seta${aberto ? ' citie-accordion__seta--aberta' : ''}`} aria-hidden="true">
                  ›
                </span>
                {item.titulo}
              </button>
            </h3>
            {/**
              * Disclosure: a altura transita da altura real do conteúdo via
              * `grid-template-rows` (0fr para 1fr), sem valor chutado. Dois
              * mecanismos com papéis distintos: `inert` sai do React e corta
              * foco e árvore de acessibilidade NO MESMO QUADRO do clique de
              * fechar, para um Tab durante o fechamento nunca aterrissar em
              * conteúdo que está sumindo; `visibility: hidden`, atrasada no
              * CSS, só encerra a pintura quando a altura termina de fechar.
              */}
            <div
              id={`accordion-painel-${uid}-${item.id}`}
              role="region"
              aria-labelledby={`accordion-${uid}-${item.id}`}
              className={`citie-accordion__painel${
                aberto ? ' citie-accordion__painel--aberto' : ''
              }`}
              inert={!aberto}
            >
              <div className="citie-accordion__clip">
                <div className="citie-accordion__conteudo">{item.conteudo}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
