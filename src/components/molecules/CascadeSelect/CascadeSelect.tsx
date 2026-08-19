import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { FieldWrapper, type FieldSize } from '../../primitives/Field/Field';
import '../../primitives/Field/Field.css';
import './CascadeSelect.css';

/**
 * CascadeSelect (Figma CitieOne, página 6738:22639).
 *
 * Variantes do arquivo respeitadas: `cascadeselect` (State: Idle | Open | Hover,
 * Hierarchy: 1 | 2 | 3), `cascadeselect-input` (⚙️ State, ❌ Invalid, 🚫 Disabled,
 * 🟦 Filled, 🤏 Size: Normal | Small | Large, 🏷️ Show Label, ℹ️ Show Helper,
 * ✖️ Show Clear Icon) e `cascadeselect-option` (State: Default | Hover / Focus |
 * Selected, Group: True | False).
 *
 * O painel abre em colunas: o item ativo de um nível define o conteúdo do nível
 * seguinte, até 3 níveis (Hierarchy do Figma). O campo mostra o caminho inteiro,
 * porque "Regulação" sozinho não identifica de qual secretaria o setor veio.
 */

export interface OpcaoCascata {
  value: string;
  label: string;
  /** Presença de filhos é o que torna o item um grupo (Group=True no Figma). */
  filhos?: OpcaoCascata[];
}

export interface CascadeSelectProps {
  label: string;
  opcoes: OpcaoCascata[];
  size?: FieldSize;
  placeholder?: string;
  filled?: boolean;
  disabled?: boolean;
  required?: boolean;
  helper?: string;
  error?: string;
  /** Caminho inicial, do primeiro nível até a folha. */
  defaultValue?: string[];
  /** Ícone de limpar dentro do campo (✖️ Show Clear Icon). */
  comLimpar?: boolean;
  /** Separador visual do caminho no campo. */
  separador?: string;
  onChange?: (caminho: OpcaoCascata[]) => void;
}

/** Colunas visíveis derivam dos itens ativos: cada ativo abre o nível seguinte. */
function calcularColunas(opcoes: OpcaoCascata[], ativos: number[]): OpcaoCascata[][] {
  const colunas: OpcaoCascata[][] = [opcoes];
  for (let nivel = 0; nivel < ativos.length - 1; nivel += 1) {
    const filhos = colunas[nivel]?.[ativos[nivel]]?.filhos;
    if (!filhos?.length) break;
    colunas.push(filhos);
  }
  return colunas;
}

function caminhoPorValores(opcoes: OpcaoCascata[], valores: string[]): OpcaoCascata[] {
  const caminho: OpcaoCascata[] = [];
  let nivel = opcoes;
  for (const valor of valores) {
    const achado = nivel.find((opcao) => opcao.value === valor);
    if (!achado) break;
    caminho.push(achado);
    nivel = achado.filhos ?? [];
  }
  return caminho;
}

export function CascadeSelect({
  label,
  opcoes,
  size = 'normal',
  placeholder = 'Selecione',
  filled = false,
  disabled = false,
  required = false,
  helper,
  error,
  defaultValue = [],
  comLimpar = false,
  separador = ' / ',
  onChange,
}: CascadeSelectProps) {
  const uid = useId();
  const [aberto, setAberto] = useState(false);
  const [ativos, setAtivos] = useState<number[]>([0]);
  const [nivelFoco, setNivelFoco] = useState(0);
  const [caminho, setCaminho] = useState<OpcaoCascata[]>(() =>
    caminhoPorValores(opcoes, defaultValue),
  );

  const gatilhoRef = useRef<HTMLButtonElement>(null);
  const colunasRef = useRef<Array<HTMLDivElement | null>>([]);

  const colunas = calcularColunas(opcoes, ativos);

  // O foco acompanha o nível corrente: entrar num subnível sem levar o foco
  // deixaria o teclado navegando uma coluna que já não é a da vez.
  useEffect(() => {
    if (!aberto) return;
    colunasRef.current[nivelFoco]?.focus();
  }, [aberto, nivelFoco]);

  const abrir = () => {
    setAtivos([0]);
    setNivelFoco(0);
    setAberto(true);
  };

  const fechar = (devolverFoco = true) => {
    setAberto(false);
    if (devolverFoco) gatilhoRef.current?.focus();
  };

  const entrarNoNivel = (nivel: number, indice: number) => {
    setAtivos([...ativos.slice(0, nivel), indice, 0]);
    setNivelFoco(nivel + 1);
  };

  const escolher = (nivel: number, item: OpcaoCascata) => {
    const anteriores = colunas
      .slice(0, nivel)
      .map((coluna, i) => coluna[ativos[i]])
      .filter(Boolean);
    const completo = [...anteriores, item];
    setCaminho(completo);
    onChange?.(completo);
    fechar();
  };

  const acionar = (nivel: number, indice: number) => {
    const item = colunas[nivel][indice];
    if (item.filhos?.length) entrarNoNivel(nivel, indice);
    else escolher(nivel, item);
  };

  /** Trunca os níveis à direita: mudar de pai invalida o subnível aberto. */
  const mover = (nivel: number, indice: number, focar = false) => {
    setAtivos([...ativos.slice(0, nivel), indice]);
    // O mouse destaca sem tomar o foco de quem está navegando por teclado.
    if (focar) setNivelFoco(nivel);
  };

  const aoTeclar = (evento: KeyboardEvent<HTMLDivElement>, nivel: number) => {
    const total = colunas[nivel].length;
    const atual = ativos[nivel] ?? 0;

    switch (evento.key) {
      case 'ArrowDown':
        evento.preventDefault();
        mover(nivel, (atual + 1) % total, true);
        break;
      case 'ArrowUp':
        evento.preventDefault();
        mover(nivel, (atual - 1 + total) % total, true);
        break;
      case 'Home':
        evento.preventDefault();
        mover(nivel, 0, true);
        break;
      case 'End':
        evento.preventDefault();
        mover(nivel, total - 1, true);
        break;
      case 'ArrowRight': {
        const item = colunas[nivel][atual];
        if (item.filhos?.length) {
          evento.preventDefault();
          entrarNoNivel(nivel, atual);
        }
        break;
      }
      case 'ArrowLeft':
        if (nivel > 0) {
          evento.preventDefault();
          setAtivos(ativos.slice(0, nivel));
          setNivelFoco(nivel - 1);
        }
        break;
      case 'Enter':
      case ' ':
        evento.preventDefault();
        acionar(nivel, atual);
        break;
      case 'Escape':
        evento.preventDefault();
        fechar();
        break;
      default:
        break;
    }
  };

  const limpar = () => {
    setCaminho([]);
    onChange?.([]);
    gatilhoRef.current?.focus();
  };

  const valorId = `${uid}-valor`;
  const temValor = caminho.length > 0;

  return (
    <FieldWrapper label={label} required={required} helper={helper} error={error}>
      {({ id, describedBy, invalid }) => (
        <div className="citie-cascadeselect">
          <div className="citie-cascadeselect__campo">
            <button
              id={id}
              ref={gatilhoRef}
              type="button"
              className={[
                'citie-cascadeselect__gatilho',
                `citie-cascadeselect__gatilho--${size}`,
                filled ? 'citie-cascadeselect__gatilho--filled' : null,
                invalid ? 'citie-cascadeselect__gatilho--invalido' : null,
                comLimpar && temValor ? 'citie-cascadeselect__gatilho--com-limpar' : null,
              ]
                .filter(Boolean)
                .join(' ')}
              aria-haspopup="listbox"
              aria-expanded={aberto}
              aria-invalid={invalid || undefined}
              // Sem `aria-required` aqui: o atributo não é válido em `button` e
              // o axe reprova. A obrigatoriedade é comunicada pelo asterisco no
              // rótulo, que o FieldWrapper já renderiza.
              // O rótulo nomeia o campo; o caminho escolhido entra como descrição
              // para o leitor anunciar os dois sem virar um nome quilométrico.
              aria-describedby={
                [describedBy, temValor ? valorId : null].filter(Boolean).join(' ') || undefined
              }
              disabled={disabled}
              onClick={() => (aberto ? fechar(false) : abrir())}
              onKeyDown={(evento) => {
                if (!aberto && (evento.key === 'ArrowDown' || evento.key === 'Enter')) {
                  evento.preventDefault();
                  abrir();
                }
              }}
            >
              <span className="citie-cascadeselect__valor" id={valorId}>
                {temValor ? (
                  caminho.map((item, indice) => (
                    <span key={item.value}>
                      {indice > 0 ? (
                        <span className="citie-cascadeselect__separador">{separador}</span>
                      ) : null}
                      {item.label}
                    </span>
                  ))
                ) : (
                  <span className="citie-cascadeselect__placeholder">{placeholder}</span>
                )}
              </span>

              <svg
                className={`citie-cascadeselect__seta${
                  aberto ? ' citie-cascadeselect__seta--aberta' : ''
                }`}
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {comLimpar && temValor && !disabled ? (
              <button
                type="button"
                className="citie-cascadeselect__limpar"
                aria-label={`Limpar ${label.toLowerCase()}`}
                onClick={limpar}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
                </svg>
              </button>
            ) : null}
          </div>

          {aberto ? (
            <div className="citie-cascadeselect__painel">
              {colunas.map((coluna, nivel) => {
                const pai = nivel === 0 ? null : colunas[nivel - 1][ativos[nivel - 1]];
                const ativo = ativos[nivel] ?? 0;
                return (
                  <div
                    key={pai ? pai.value : 'raiz'}
                    ref={(elemento) => {
                      colunasRef.current[nivel] = elemento;
                    }}
                    className="citie-cascadeselect__coluna"
                    role="listbox"
                    aria-label={pai ? pai.label : label}
                    aria-activedescendant={`${uid}-op-${nivel}-${ativo}`}
                    // Coluna rola e concentra a navegação por teclado do nível.
                    tabIndex={0}
                    onKeyDown={(evento) => aoTeclar(evento, nivel)}
                    onFocus={() => setNivelFoco(nivel)}
                  >
                    {coluna.map((item, indice) => {
                      const grupo = Boolean(item.filhos?.length);
                      const selecionado = caminho[nivel]?.value === item.value;
                      return (
                        <div
                          key={item.value}
                          id={`${uid}-op-${nivel}-${indice}`}
                          role="option"
                          aria-selected={selecionado}
                          className={[
                            'citie-cascadeselect__opcao',
                            indice === ativo && nivelFoco >= nivel
                              ? 'citie-cascadeselect__opcao--ativa'
                              : null,
                            selecionado ? 'citie-cascadeselect__opcao--selecionada' : null,
                          ]
                            .filter(Boolean)
                            .join(' ')}
                          onClick={() => acionar(nivel, indice)}
                          onMouseEnter={() => mover(nivel, indice)}
                        >
                          <span className="citie-cascadeselect__rotulo">{item.label}</span>
                          {grupo ? (
                            <>
                              {/* Papel de grupo sem aria-haspopup, que role="option" não suporta. */}
                              <span className="citie-visualmente-oculto">, abre subnível</span>
                              <svg
                                className="citie-cascadeselect__avanca"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                aria-hidden="true"
                              >
                                <path d="m9 6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                              </svg>
                            </>
                          ) : null}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
      )}
    </FieldWrapper>
  );
}
