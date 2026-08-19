import { useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { FieldWrapper, type FieldSize } from '../Field/Field';
import '../Field/Field.css';
import './AutoComplete.css';

/**
 * AutoComplete (Figma CitieOne, página 6728:52564).
 * Variantes do arquivo: o conjunto `autocomplete` tem State (Idle | Open),
 * Dropdown (False | True) e Multiple (False | True); `autocomplete-option` tem
 * State (Default | Hover / Focus | Highlight) e Group; `autocomplete-chip` tem
 * State (Default | Focus); `autocomplete-input-multiple` traz Size
 * (Normal | Small | Large), Invalid, Disabled, Filled, rótulo e helper.
 *
 * Diferente do Select, aqui o usuário digita para filtrar: o painel é uma lista
 * de sugestões e o foco nunca sai do campo, só o destaque anda
 * (`aria-activedescendant`).
 */

export interface OpcaoAutoComplete {
  value: string;
  label: string;
  /** Cabeçalho do bloco na lista, para a variante Group do arquivo. */
  grupo?: string;
}

export interface AutoCompleteProps {
  /** Substantivo que nomeia o dado, sem verbo ("Município de destino"). */
  label: string;
  opcoes: OpcaoAutoComplete[];
  size?: FieldSize;
  placeholder?: string;
  helper?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  filled?: boolean;
  /** Variante Dropdown: botão que abre a lista inteira sem digitar nada. */
  comDropdown?: boolean;
  /** Variante Multiple: escolhas viram fichas dentro do campo. */
  multiplo?: boolean;
  defaultValue?: string[];
  onChange?: (valores: string[]) => void;
}

export function AutoComplete({
  label,
  opcoes,
  size = 'normal',
  placeholder = 'Digite para buscar',
  helper,
  error,
  required = false,
  disabled = false,
  filled = false,
  comDropdown = false,
  multiplo = false,
  defaultValue = [],
  onChange,
}: AutoCompleteProps) {
  const uid = useId();
  const campoRef = useRef<HTMLInputElement>(null);

  const [aberto, setAberto] = useState(false);
  const [termo, setTermo] = useState(() => {
    if (multiplo || defaultValue.length === 0) return '';
    return opcoes.find((opcao) => opcao.value === defaultValue[0])?.label ?? '';
  });
  const [selecionados, setSelecionados] = useState<string[]>(defaultValue);
  const [destaque, setDestaque] = useState(-1);
  /** O clique no botão de dropdown mostra tudo; digitar volta a filtrar. */
  const [ignorarFiltro, setIgnorarFiltro] = useState(false);

  const listaId = `${uid}-lista`;
  const idDaOpcao = (indice: number) => `${uid}-opcao-${indice}`;

  const visiveis = useMemo(() => {
    const restantes = multiplo
      ? opcoes.filter((opcao) => !selecionados.includes(opcao.value))
      : opcoes;
    if (ignorarFiltro || termo.trim() === '') return restantes;
    const alvo = termo.trim().toLowerCase();
    return restantes.filter((opcao) => opcao.label.toLowerCase().includes(alvo));
  }, [opcoes, selecionados, termo, multiplo, ignorarFiltro]);

  const temGrupo = visiveis.some((opcao) => opcao.grupo);

  const blocos = useMemo(() => {
    const acumulado: { nome: string; itens: { opcao: OpcaoAutoComplete; indice: number }[] }[] = [];
    visiveis.forEach((opcao, indice) => {
      const nome = opcao.grupo ?? 'Outros';
      const ultimo = acumulado[acumulado.length - 1];
      if (ultimo && ultimo.nome === nome) ultimo.itens.push({ opcao, indice });
      else acumulado.push({ nome, itens: [{ opcao, indice }] });
    });
    return acumulado;
  }, [visiveis]);

  const rotuloDe = (valor: string) =>
    opcoes.find((opcao) => opcao.value === valor)?.label ?? valor;

  const abrir = () => {
    if (disabled) return;
    setAberto(true);
    setDestaque(-1);
  };

  const fechar = () => {
    setAberto(false);
    setDestaque(-1);
    setIgnorarFiltro(false);
  };

  const escolher = (opcao: OpcaoAutoComplete) => {
    const proximos = multiplo ? [...selecionados, opcao.value] : [opcao.value];
    setSelecionados(proximos);
    onChange?.(proximos);

    if (multiplo) {
      setTermo('');
      setDestaque(-1);
      setIgnorarFiltro(false);
    } else {
      setTermo(opcao.label);
      fechar();
    }
    campoRef.current?.focus();
  };

  const remover = (valor: string) => {
    const proximos = selecionados.filter((item) => item !== valor);
    setSelecionados(proximos);
    onChange?.(proximos);
    campoRef.current?.focus();
  };

  const aoDigitar = (evento: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return;

    switch (evento.key) {
      case 'ArrowDown': {
        evento.preventDefault();
        if (!aberto) {
          abrir();
          return;
        }
        if (visiveis.length === 0) return;
        setDestaque((atual) => (atual + 1) % visiveis.length);
        return;
      }
      case 'ArrowUp': {
        evento.preventDefault();
        if (!aberto || visiveis.length === 0) return;
        setDestaque((atual) => (atual <= 0 ? visiveis.length - 1 : atual - 1));
        return;
      }
      case 'Enter': {
        if (!aberto || destaque < 0) return;
        evento.preventDefault();
        escolher(visiveis[destaque]);
        return;
      }
      case 'Escape': {
        if (!aberto) return;
        evento.preventDefault();
        fechar();
        return;
      }
      case 'Backspace': {
        // No modo múltiplo, apagar com o campo vazio tira a última ficha.
        if (multiplo && termo === '' && selecionados.length > 0) {
          remover(selecionados[selecionados.length - 1]);
        }
        return;
      }
      default:
    }
  };

  const classesCampo = [
    'citie-autocomplete__campo',
    `citie-autocomplete__campo--${size}`,
    filled ? 'citie-autocomplete__campo--filled' : null,
    error ? 'citie-autocomplete__campo--invalido' : null,
    disabled ? 'citie-autocomplete__campo--desabilitado' : null,
  ]
    .filter(Boolean)
    .join(' ');

  const renderOpcao = (opcao: OpcaoAutoComplete, indice: number) => {
    const escolhida = selecionados.includes(opcao.value);
    return (
      <div
        key={opcao.value}
        id={idDaOpcao(indice)}
        role="option"
        aria-selected={escolhida}
        className={[
          'citie-autocomplete__opcao',
          indice === destaque ? 'citie-autocomplete__opcao--destacada' : null,
          escolhida ? 'citie-autocomplete__opcao--escolhida' : null,
        ]
          .filter(Boolean)
          .join(' ')}
        // O foco fica no campo; o ponteiro só move o destaque.
        onMouseEnter={() => setDestaque(indice)}
        onMouseDown={(evento) => evento.preventDefault()}
        onClick={() => escolher(opcao)}
      >
        <span className="citie-autocomplete__marca" aria-hidden="true">
          {escolhida ? '✓' : ''}
        </span>
        {opcao.label}
      </div>
    );
  };

  return (
    <div className="citie-autocomplete">
      <FieldWrapper label={label} required={required} helper={helper} error={error}>
        {({ id, describedBy, invalid }) => (
          <div className="citie-autocomplete__ancora">
            <div className={classesCampo}>
              {multiplo && selecionados.length > 0 ? (
                <span className="citie-autocomplete__chips">
                  {selecionados.map((valor) => (
                    <span key={valor} className="citie-autocomplete__chip">
                      {rotuloDe(valor)}
                      <button
                        type="button"
                        className="citie-autocomplete__chip-remover"
                        aria-label={`Remover ${rotuloDe(valor)}`}
                        disabled={disabled}
                        onClick={() => remover(valor)}
                      >
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          aria-hidden="true"
                        >
                          <path d="M6 6 18 18M18 6 6 18" strokeLinecap="round" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </span>
              ) : null}

              <input
                ref={campoRef}
                id={id}
                type="text"
                className="citie-autocomplete__entrada"
                role="combobox"
                aria-expanded={aberto}
                aria-controls={listaId}
                aria-autocomplete="list"
                aria-activedescendant={
                  aberto && destaque >= 0 ? idDaOpcao(destaque) : undefined
                }
                aria-required={required || undefined}
                aria-invalid={invalid || undefined}
                aria-describedby={describedBy}
                autoComplete="off"
                placeholder={placeholder}
                value={termo}
                disabled={disabled}
                onChange={(evento) => {
                  setTermo(evento.target.value);
                  setIgnorarFiltro(false);
                  setDestaque(-1);
                  setAberto(true);
                }}
                onKeyDown={aoDigitar}
                onBlur={fechar}
              />

              {comDropdown ? (
                <button
                  type="button"
                  className="citie-autocomplete__dropdown"
                  aria-label={`Mostrar todas as opções de ${label.toLowerCase()}`}
                  disabled={disabled}
                  onMouseDown={(evento) => evento.preventDefault()}
                  onClick={() => {
                    if (aberto && ignorarFiltro) {
                      fechar();
                    } else {
                      setIgnorarFiltro(true);
                      abrir();
                    }
                    campoRef.current?.focus();
                  }}
                >
                  <svg
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
              ) : (
                <span className="citie-autocomplete__lupa" aria-hidden="true">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <path d="m16.5 16.5 4 4" strokeLinecap="round" />
                  </svg>
                </span>
              )}
            </div>

            {aberto ? (
              <div className="citie-autocomplete__painel">
                {visiveis.length === 0 ? (
                  // Sem itens o container perde o papel de listbox: um texto solto
                  // dentro de `listbox` invalidaria a estrutura exigida pelo axe.
                  <div id={listaId} className="citie-autocomplete__vazio">
                    Nenhuma opção corresponde ao que você digitou
                  </div>
                ) : (
                  <div
                    id={listaId}
                    role="listbox"
                    aria-label={label}
                    className="citie-autocomplete__lista"
                    // Região rolável precisa ser alcançável por teclado.
                    tabIndex={0}
                  >
                    {temGrupo
                      ? blocos.map((bloco, ordem) => {
                          // Índice em vez do nome: nome de grupo com espaço ou
                          // acento não serve como id.
                          const tituloId = `${uid}-grupo-${ordem}`;
                          return (
                            <div
                              key={tituloId}
                              role="group"
                              aria-labelledby={tituloId}
                              className="citie-autocomplete__grupo"
                            >
                              <div id={tituloId} className="citie-autocomplete__grupo-titulo">
                                {bloco.nome}
                              </div>
                              {bloco.itens.map((item) => renderOpcao(item.opcao, item.indice))}
                            </div>
                          );
                        })
                      : visiveis.map((opcao, indice) => renderOpcao(opcao, indice))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        )}
      </FieldWrapper>
    </div>
  );
}
