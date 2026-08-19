import { useId, useState } from 'react';
import { AlertIcon } from '../Field/Field';
import './Listbox.css';

/**
 * Listbox (Figma CitieOne, página ❖ Listbox).
 * Variantes do arquivo: State (Idle | Invalid | Disabled) e Show Filter; a opção
 * tem State (Default | Hover / Focus | Highlight), Group e Checkmark.
 *
 * Lista sempre visível, sem overlay. Usa `role="listbox"` com opções navegáveis
 * por setas, Home e End.
 */

export interface OpcaoDaLista {
  value: string;
  label: string;
  /** Agrupa opções sob um cabeçalho, como a variante Group do arquivo. */
  grupo?: string;
  disabled?: boolean;
}

export interface ListboxProps {
  label: string;
  opcoes: OpcaoDaLista[];
  /** Marca mais de uma opção, com checkmark por item. */
  multiplo?: boolean;
  /** Campo de filtro no topo do painel. */
  comFiltro?: boolean;
  disabled?: boolean;
  error?: string;
  defaultValue?: string[];
  altura?: number;
  onChange?: (valores: string[]) => void;
}

export function Listbox({
  label,
  opcoes,
  multiplo = false,
  comFiltro = false,
  disabled = false,
  error,
  defaultValue = [],
  altura = 220,
  onChange,
}: ListboxProps) {
  const uid = useId();
  const [selecionados, setSelecionados] = useState<string[]>(defaultValue);
  const [ativo, setAtivo] = useState<string>(opcoes[0]?.value ?? '');
  const [termo, setTermo] = useState('');

  const visiveis = termo
    ? opcoes.filter((opcao) => opcao.label.toLowerCase().includes(termo.toLowerCase()))
    : opcoes;

  const habilitadas = visiveis.filter((opcao) => !opcao.disabled);

  const alternar = (valor: string) => {
    const proximos = multiplo
      ? selecionados.includes(valor)
        ? selecionados.filter((item) => item !== valor)
        : [...selecionados, valor]
      : [valor];
    setSelecionados(proximos);
    onChange?.(proximos);
  };

  const mover = (passo: number) => {
    const indice = habilitadas.findIndex((opcao) => opcao.value === ativo);
    const destino = habilitadas[Math.min(habilitadas.length - 1, Math.max(0, indice + passo))];
    if (destino) setAtivo(destino.value);
  };

  // Agrupa preservando a ordem de entrada.
  const grupos = visiveis.reduce<{ nome: string | undefined; itens: OpcaoDaLista[] }[]>(
    (acumulado, opcao) => {
      const ultimo = acumulado[acumulado.length - 1];
      if (ultimo && ultimo.nome === opcao.grupo) ultimo.itens.push(opcao);
      else acumulado.push({ nome: opcao.grupo, itens: [opcao] });
      return acumulado;
    },
    [],
  );

  return (
    <div className="citie-listbox-bloco">
      <span className="citie-listbox__label" id={`${uid}-label`}>
        {label}
      </span>

      <div
        className={`citie-listbox${error ? ' citie-listbox--invalido' : ''}${
          disabled ? ' citie-listbox--desabilitado' : ''
        }`}
      >
        {comFiltro ? (
          <div className="citie-listbox__filtro">
            <input
              type="search"
              className="citie-listbox__filtro-campo"
              placeholder="Filtrar"
              aria-label={`Filtrar ${label.toLowerCase()}`}
              value={termo}
              disabled={disabled}
              onChange={(evento) => setTermo(evento.target.value)}
            />
          </div>
        ) : null}

        {/*
          Estrutura em div com papéis explícitos, não em ul/li: `role="group"`
          não é permitido em `li`, e um `li` sem papel dentro do listbox quebra
          a cadeia listbox → group → option.
        */}
        <div
          className="citie-listbox__lista"
          style={{ maxHeight: altura }}
          // Sem nenhuma opção o papel de listbox seria inválido (exige filhos
          // option), então o container vira região de status com a mensagem.
          role={visiveis.length === 0 ? 'status' : 'listbox'}
          aria-labelledby={`${uid}-label`}
          aria-multiselectable={visiveis.length > 0 && multiplo ? true : undefined}
          aria-disabled={disabled || undefined}
          // A região rola, então precisa de acesso por teclado mesmo desabilitada:
          // `aria-disabled` comunica o estado sem tirar o foco.
          tabIndex={0}
          onKeyDown={(evento) => {
            const acoes: Record<string, () => void> = {
              ArrowDown: () => mover(1),
              ArrowUp: () => mover(-1),
              Home: () => setAtivo(habilitadas[0]?.value ?? ''),
              End: () => setAtivo(habilitadas[habilitadas.length - 1]?.value ?? ''),
              Enter: () => alternar(ativo),
              ' ': () => alternar(ativo),
            };
            const acao = acoes[evento.key];
            if (acao) {
              evento.preventDefault();
              acao();
            }
          }}
        >
          {visiveis.length === 0 ? (
            <p className="citie-listbox__vazio">Nenhuma opção para o filtro aplicado</p>
          ) : (
            grupos.map((grupo) => {
              const itens = grupo.itens.map((opcao) => {
                const marcado = selecionados.includes(opcao.value);
                return (
                  <div
                    key={opcao.value}
                    role="option"
                    aria-selected={marcado}
                    aria-disabled={opcao.disabled || undefined}
                    className={[
                      'citie-listbox__opcao',
                      marcado ? 'citie-listbox__opcao--selecionada' : null,
                      opcao.value === ativo ? 'citie-listbox__opcao--ativa' : null,
                      opcao.disabled ? 'citie-listbox__opcao--desabilitada' : null,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onClick={() => {
                      if (opcao.disabled || disabled) return;
                      setAtivo(opcao.value);
                      alternar(opcao.value);
                    }}
                  >
                    {multiplo ? (
                      <span className="citie-listbox__marca" aria-hidden="true">
                        {marcado ? '✓' : ''}
                      </span>
                    ) : null}
                    {opcao.label}
                  </div>
                );
              });

              // A cadeia precisa ser listbox → group → option, sem elemento sem
              // papel no meio: um `li` neutro quebra `aria-required-parent`.
              if (!grupo.nome) return itens;

              return (
                <div key={grupo.nome} role="group" aria-label={grupo.nome}>
                  <span className="citie-listbox__grupo" role="presentation">
                    {grupo.nome}
                  </span>
                  {itens}
                </div>
              );
            })
          )}
        </div>
      </div>

      {error ? (
        <p className="citie-listbox__erro">
          <AlertIcon />
          {error}
        </p>
      ) : null}
    </div>
  );
}
