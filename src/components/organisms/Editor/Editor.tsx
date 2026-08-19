import {
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent as EventoDeTeclado,
  type ReactNode,
} from 'react';
import './Editor.css';

/** Comandos da barra, na ordem em que o Figma os desenha. */
export type ComandoDoEditor =
  | 'negrito'
  | 'italico'
  | 'sublinhado'
  | 'lista'
  | 'link'
  | 'imagem'
  | 'codigo';

export interface OpcaoDoEditor {
  valor: string;
  rotulo: string;
}

export interface EditorProps {
  /** Rótulo visível da área de edição, associado por `aria-labelledby`. */
  label: string;
  /** Nome acessível da barra de ferramentas. */
  rotuloDaBarra?: string;
  /** HTML inicial do documento. Componente não controlado, como o `pEditor`. */
  valorInicial?: string;
  /** Texto de apoio exibido enquanto o documento está vazio. */
  placeholder?: string;
  /** Texto auxiliar abaixo do editor, ligado por `aria-describedby`. */
  ajuda?: string;
  /** Mensagem de erro. Substitui a ajuda e marca `aria-invalid`. */
  erro?: string;
  desabilitado?: boolean;
  /** Documento visível e focável, mas não editável (processo já homologado). */
  somenteLeitura?: boolean;
  /** Subconjunto de comandos da barra. Padrão: os sete do Figma. */
  comandos?: ComandoDoEditor[];
  /** Liga os dois seletores da esquerda (estilo do bloco e fonte). */
  mostrarSeletores?: boolean;
  /** Estados de formatação já ativos na abertura, para documentar o visual. */
  estadosIniciais?: Partial<Record<ComandoDoEditor, boolean>>;
  /** Altura mínima da área de edição em pixels. Figma usa 210. */
  alturaDaArea?: number;
  onMudarConteudo?: (html: string) => void;
  /** Disparado por Link e Imagem, que em produção abrem um diálogo próprio. */
  onAcionarComando?: (comando: ComandoDoEditor) => void;
}

const COMANDOS_PADRAO: ComandoDoEditor[] = [
  'negrito',
  'italico',
  'sublinhado',
  'lista',
  'link',
  'imagem',
  'codigo',
];

/** Comandos que carregam estado ligado/desligado e por isso usam `aria-pressed`. */
const COMANDOS_ALTERNAVEIS = new Set<ComandoDoEditor>([
  'negrito',
  'italico',
  'sublinhado',
  'lista',
  'codigo',
]);

const ROTULOS: Record<ComandoDoEditor, string> = {
  negrito: 'Negrito',
  italico: 'Itálico',
  sublinhado: 'Sublinhado',
  lista: 'Lista com marcadores',
  link: 'Inserir link',
  imagem: 'Inserir imagem',
  codigo: 'Bloco de código',
};

/**
 * Nome do comando equivalente na API de edição do navegador. `codigo` fica de
 * fora porque não existe comando nativo para bloco de código.
 */
const COMANDO_NATIVO: Partial<Record<ComandoDoEditor, string>> = {
  negrito: 'bold',
  italico: 'italic',
  sublinhado: 'underline',
  lista: 'insertUnorderedList',
};

const BLOCOS: OpcaoDoEditor[] = [
  { valor: 'p', rotulo: 'Normal' },
  { valor: 'h2', rotulo: 'Título' },
  { valor: 'h3', rotulo: 'Subtítulo' },
  { valor: 'blockquote', rotulo: 'Citação' },
];

const FONTES: OpcaoDoEditor[] = [
  { valor: 'sans', rotulo: 'Sans Serif' },
  { valor: 'serif', rotulo: 'Serifada' },
  { valor: 'mono', rotulo: 'Monoespaçada' },
];

const ICONES: Record<ComandoDoEditor, ReactNode> = {
  negrito: (
    <path d="M4 2.5h4a2.75 2.75 0 0 1 0 5.5H4zM4 8h4.5a2.75 2.75 0 0 1 0 5.5H4z" />
  ),
  italico: <path d="M10 2.5H6.5m3 11H6m4.25-11-2.5 11" />,
  sublinhado: <path d="M4.5 2.5V8a3.5 3.5 0 0 0 7 0V2.5M3.5 14h9" />,
  lista: <path d="M6 4h7M6 8h7M6 12h7M3 4h.01M3 8h.01M3 12h.01" />,
  link: (
    <path d="M6.75 9.25a2.5 2.5 0 0 0 3.6.07l2-2a2.5 2.5 0 0 0-3.54-3.54l-1.1 1.1M9.25 6.75a2.5 2.5 0 0 0-3.6-.07l-2 2a2.5 2.5 0 0 0 3.54 3.54l1.1-1.1" />
  ),
  imagem: (
    <>
      <rect x="2.5" y="3" width="11" height="10" rx="1.5" />
      <circle cx="5.75" cy="6.25" r="1" />
      <path d="M3 11.5 6.5 8l3 3 2-1.75 2 1.75" />
    </>
  ),
  codigo: <path d="m5.5 5-3 3 3 3m5-6 3 3-3 3" />,
};

function Icone({ comando }: { comando: ComandoDoEditor }) {
  return (
    <svg
      className="citie-editor__icone"
      viewBox="0 0 16 16"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {ICONES[comando]}
    </svg>
  );
}

function Chevron() {
  return (
    <svg
      className="citie-editor__chevron"
      viewBox="0 0 16 16"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="m4 6 4 4 4-4" />
    </svg>
  );
}

/**
 * Editor — editor de texto com barra de formatação.
 *
 * Página do Figma CitieOne `6738:22643` (❖ Editor). O arquivo traz um
 * componente `editor` (barra + área de conteúdo, 563x252, área com 210 de
 * altura) e o conjunto `editor-toolbar-item` com dois eixos:
 * - `Type` = Bold | Italic | Underline | List | Link | Image | Code;
 * - `State` = Idle | Hover | Active.
 *
 * A barra do Figma começa com dois seletores, "Normal" (estilo do bloco) e
 * "Sans Serif" (fonte), ambos com chevron. Os rótulos das opções além dos dois
 * visíveis no arquivo são inferência: o Figma só desenha o estado fechado.
 *
 * ESCOPO. No PrimeNG o `p-editor` embrulha a biblioteca Quill, que resolve
 * seleção, histórico, colagem sanitizada, listas aninhadas e serialização em
 * Delta. Este pacote proíbe dependência nova, então aqui está a casca: a barra
 * fiel ao desenho, os tokens da marca e o contrato de acessibilidade. A
 * implementação de produção deve embrulhar o Quill exatamente como o PrimeNG
 * faz e reaproveitar esta barra apenas como camada de apresentação.
 *
 * API OBSOLETA. `document.execCommand` está formalmente descontinuado. Ele foi
 * aceito aqui porque é a única forma de aplicar formatação em `contenteditable`
 * sem trazer biblioteca, e porque o alvo é uma demonstração de acessibilidade,
 * não o editor de produção. Toda chamada é protegida por checagem de existência
 * e `try/catch`: onde o navegador não suportar, o botão ainda alterna o estado
 * visual e o `aria-pressed`, que é o que as stories verificam.
 *
 * Teclado (padrão APG para toolbar): setas esquerda e direita andam pelos
 * controles da barra em anel, Home e End vão às pontas, e só um controle da
 * barra fica na ordem de tabulação (roving tabindex). As setas para cima e para
 * baixo continuam abrindo e trocando o valor dos seletores nativos.
 */
export function Editor({
  label,
  rotuloDaBarra = 'Formatação do texto',
  valorInicial,
  placeholder = 'Escreva aqui.',
  ajuda,
  erro,
  desabilitado = false,
  somenteLeitura = false,
  comandos = COMANDOS_PADRAO,
  mostrarSeletores = true,
  estadosIniciais,
  alturaDaArea = 210,
  onMudarConteudo,
  onAcionarComando,
}: EditorProps) {
  const uid = useId();
  const rotuloId = `${uid}-rotulo`;
  const areaId = `${uid}-area`;
  const apoioId = `${uid}-apoio`;

  const barraRef = useRef<HTMLDivElement>(null);
  const areaRef = useRef<HTMLDivElement>(null);
  const [ativos, setAtivos] = useState<Partial<Record<ComandoDoEditor, boolean>>>(
    estadosIniciais ?? {},
  );
  const [indiceFoco, setIndiceFoco] = useState(0);
  const [vazio, setVazio] = useState(!valorInicial);

  const inerte = desabilitado || somenteLeitura;
  const editavel = !inerte;

  // Ordem dos controles da barra, usada pelo roving tabindex.
  const ordem: string[] = [
    ...(mostrarSeletores ? ['bloco', 'fonte'] : []),
    ...comandos,
  ];

  const conteudoInicial = useRef(valorInicial ?? '');
  useEffect(() => {
    const area = areaRef.current;
    if (area && area.innerHTML !== conteudoInicial.current) {
      area.innerHTML = conteudoInicial.current;
      setVazio(area.textContent?.trim().length === 0);
    }
  }, []);

  /**
   * Reflete no `aria-pressed` a formatação onde o cursor está. Só roda quando a
   * seleção pertence a esta área, para não reagir a outro editor da página.
   */
  useEffect(() => {
    if (!editavel) return;
    const sincronizar = () => {
      const area = areaRef.current;
      const ancora = document.getSelection()?.anchorNode ?? null;
      if (!area || !ancora || !area.contains(ancora)) return;
      if (typeof document.queryCommandState !== 'function') return;

      setAtivos((anterior) => {
        const proximo = { ...anterior };
        for (const comando of comandos) {
          const nativo = COMANDO_NATIVO[comando];
          if (!nativo) continue;
          try {
            proximo[comando] = document.queryCommandState(nativo);
          } catch {
            // Navegador sem suporte: preserva o que o clique já registrou.
          }
        }
        return proximo;
      });
    };

    document.addEventListener('selectionchange', sincronizar);
    return () => document.removeEventListener('selectionchange', sincronizar);
  }, [comandos, editavel]);

  const controlesDaBarra = () =>
    Array.from(
      barraRef.current?.querySelectorAll<HTMLElement>('[data-item-da-barra]') ?? [],
    );

  const aoTeclarNaBarra = (evento: EventoDeTeclado<HTMLDivElement>) => {
    const itens = controlesDaBarra();
    if (itens.length === 0) return;

    const atual = itens.findIndex((item) => item === document.activeElement);
    let alvo: number;
    if (evento.key === 'ArrowRight') alvo = (Math.max(atual, 0) + 1) % itens.length;
    else if (evento.key === 'ArrowLeft')
      alvo = (Math.max(atual, 0) - 1 + itens.length) % itens.length;
    else if (evento.key === 'Home') alvo = 0;
    else if (evento.key === 'End') alvo = itens.length - 1;
    else return;

    // Sem isto, o `select` nativo trocaria de valor com as setas laterais.
    evento.preventDefault();
    itens[alvo].focus();
    setIndiceFoco(alvo);
  };

  const executar = (comando: ComandoDoEditor) => {
    if (inerte) return;

    if (!COMANDOS_ALTERNAVEIS.has(comando)) {
      areaRef.current?.focus();
      onAcionarComando?.(comando);
      return;
    }

    const nativo = COMANDO_NATIVO[comando];
    let aplicado = false;
    if (nativo && typeof document.execCommand === 'function') {
      areaRef.current?.focus();
      try {
        aplicado = document.execCommand(nativo);
      } catch {
        aplicado = false;
      }
    }

    setAtivos((anterior) => {
      const proximo = { ...anterior, [comando]: !anterior[comando] };
      if (aplicado && typeof document.queryCommandState === 'function' && nativo) {
        try {
          proximo[comando] = document.queryCommandState(nativo);
        } catch {
          // Mantém o valor alternado acima.
        }
      }
      return proximo;
    });

    onAcionarComando?.(comando);
    if (areaRef.current) onMudarConteudo?.(areaRef.current.innerHTML);
  };

  const classesDaRaiz = [
    'citie-editor',
    desabilitado ? 'citie-editor--desabilitado' : null,
    somenteLeitura ? 'citie-editor--somente-leitura' : null,
    erro ? 'citie-editor--invalido' : null,
  ]
    .filter(Boolean)
    .join(' ');

  const tabIndexDoItem = (chave: string) => (ordem.indexOf(chave) === indiceFoco ? 0 : -1);

  const seletor = (
    chave: 'bloco' | 'fonte',
    rotulo: string,
    opcoes: OpcaoDoEditor[],
    largura: string,
  ) => (
    <span className="citie-editor__seletor" style={{ width: largura }}>
      <select
        className="citie-editor__select"
        aria-label={rotulo}
        data-item-da-barra=""
        tabIndex={tabIndexDoItem(chave)}
        disabled={inerte}
        onFocus={() => setIndiceFoco(ordem.indexOf(chave))}
        defaultValue={opcoes[0].valor}
      >
        {opcoes.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor}>
            {opcao.rotulo}
          </option>
        ))}
      </select>
      <Chevron />
    </span>
  );

  return (
    <div className={classesDaRaiz}>
      <span className="citie-editor__rotulo" id={rotuloId}>
        {label}
      </span>

      <div className="citie-editor__moldura">
        <div
          className="citie-editor__barra"
          role="toolbar"
          aria-label={rotuloDaBarra}
          aria-orientation="horizontal"
          aria-controls={areaId}
          ref={barraRef}
          onKeyDown={aoTeclarNaBarra}
        >
          {mostrarSeletores && seletor('bloco', 'Estilo do bloco', BLOCOS, '104px')}
          {mostrarSeletores && seletor('fonte', 'Fonte do texto', FONTES, '124px')}
          {mostrarSeletores && <span className="citie-editor__separador" aria-hidden="true" />}

          {comandos.map((comando) => {
            const alternavel = COMANDOS_ALTERNAVEIS.has(comando);
            const ativo = Boolean(ativos[comando]);
            return (
              <button
                key={comando}
                type="button"
                className={[
                  'citie-editor__botao',
                  ativo ? 'citie-editor__botao--ativo' : null,
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-label={ROTULOS[comando]}
                // Link e Imagem abrem diálogo: são ação, não estado. Marcar
                // `aria-pressed` neles anunciaria um estado que não existe.
                aria-pressed={alternavel ? ativo : undefined}
                data-item-da-barra=""
                data-comando={comando}
                tabIndex={tabIndexDoItem(comando)}
                disabled={inerte}
                onFocus={() => setIndiceFoco(ordem.indexOf(comando))}
                onClick={() => executar(comando)}
              >
                <Icone comando={comando} />
              </button>
            );
          })}
        </div>

        <div
          id={areaId}
          className="citie-editor__area"
          style={{ minHeight: `${alturaDaArea}px` }}
          role="textbox"
          aria-multiline="true"
          aria-labelledby={rotuloId}
          aria-describedby={ajuda || erro ? apoioId : undefined}
          aria-invalid={erro ? true : undefined}
          aria-readonly={somenteLeitura || undefined}
          aria-disabled={desabilitado || undefined}
          data-placeholder={placeholder}
          data-vazio={vazio ? '' : undefined}
          contentEditable={editavel}
          suppressContentEditableWarning
          // A área rola: mantém o foco de teclado mesmo desabilitada, senão o
          // conteúdo fica inalcançável para quem navega sem mouse.
          tabIndex={0}
          ref={areaRef}
          onInput={(evento) => {
            const alvo = evento.currentTarget;
            setVazio(alvo.textContent?.trim().length === 0);
            onMudarConteudo?.(alvo.innerHTML);
          }}
        />
      </div>

      {(erro || ajuda) && (
        <p
          className={[
            'citie-editor__apoio',
            erro ? 'citie-editor__apoio--erro' : null,
          ]
            .filter(Boolean)
            .join(' ')}
          id={apoioId}
        >
          {erro ?? ajuda}
        </p>
      )}
    </div>
  );
}
