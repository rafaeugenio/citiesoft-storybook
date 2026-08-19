import { useId, useState } from 'react';
import { AlertIcon, type FieldSize } from '../Field/Field';
import './MultiSelect.css';

/**
 * MultiSelect (Figma CitieOne, página ❖ MultiSelect).
 * Variantes do arquivo: State (Idle | Open | Selected), Mode (Basic | Chips),
 * Size (Normal | Small | Large), Invalid, Disabled, Filled, ícone de limpar,
 * rótulo e float label. A opção tem State (Default | Hover / Focus | Highlight)
 * e Group.
 *
 * A spec do DS manda o modo Basic resumir por contagem ("3 selecionados") e o
 * modo Chips mostrar cada item, para conferência.
 */

export interface OpcaoMulti {
  value: string;
  label: string;
  grupo?: string;
}

export interface MultiSelectProps {
  label: string;
  opcoes: OpcaoMulti[];
  /** Basic resume por contagem; Chips mostra fichas dos escolhidos. */
  modo?: 'basic' | 'chips';
  size?: FieldSize;
  placeholder?: string;
  filled?: boolean;
  disabled?: boolean;
  error?: string;
  helper?: string;
  defaultValue?: string[];
  /** Campo de filtro no topo do painel, obrigatório com muitas opções. */
  comFiltro?: boolean;
  onChange?: (valores: string[]) => void;
}

export function MultiSelect({
  label,
  opcoes,
  modo = 'basic',
  size = 'normal',
  placeholder = 'Selecione',
  filled = false,
  disabled = false,
  error,
  helper,
  defaultValue = [],
  comFiltro = true,
  onChange,
}: MultiSelectProps) {
  const uid = useId();
  const [aberto, setAberto] = useState(false);
  const [selecionados, setSelecionados] = useState<string[]>(defaultValue);
  const [termo, setTermo] = useState('');

  const visiveis = termo
    ? opcoes.filter((opcao) => opcao.label.toLowerCase().includes(termo.toLowerCase()))
    : opcoes;

  const alternar = (valor: string) => {
    const proximos = selecionados.includes(valor)
      ? selecionados.filter((item) => item !== valor)
      : [...selecionados, valor];
    setSelecionados(proximos);
    onChange?.(proximos);
  };

  const rotuloDe = (valor: string) => opcoes.find((opcao) => opcao.value === valor)?.label ?? valor;

  const mensagemId = `${uid}-mensagem`;
  const listaId = `${uid}-lista`;

  return (
    <div className="citie-multiselect-bloco">
      <span className="citie-multiselect__label" id={`${uid}-label`}>
        {label}
      </span>

      <div className="citie-multiselect">
        <button
          id={`${uid}-gatilho`}
          type="button"
          className={[
            'citie-multiselect__gatilho',
            `citie-multiselect__gatilho--${size}`,
            filled ? 'citie-multiselect__gatilho--filled' : null,
            error ? 'citie-multiselect__gatilho--invalido' : null,
          ]
            .filter(Boolean)
            .join(' ')}
          aria-haspopup="listbox"
          // Nomeado pelo rótulo mais o conteúdo: o leitor anuncia o campo e a
          // seleção atual, em vez de só o nome do campo.
          aria-labelledby={`${uid}-label ${uid}-conteudo`}
          aria-expanded={aberto}
          aria-controls={listaId}
          aria-invalid={error ? true : undefined}
          aria-describedby={error || helper ? mensagemId : undefined}
          disabled={disabled}
          onClick={() => setAberto(!aberto)}
        >
          <span className="citie-multiselect__conteudo" id={`${uid}-conteudo`}>
            {selecionados.length === 0 ? (
              <span className="citie-multiselect__placeholder">{placeholder}</span>
            ) : modo === 'basic' ? (
              // Contagem em vez de rótulos concatenados, conforme a spec.
              `${selecionados.length} selecionado${selecionados.length > 1 ? 's' : ''}`
            ) : (
              <span className="citie-multiselect__chips">
                {selecionados.map((valor) => (
                  <span key={valor} className="citie-multiselect__chip">
                    {rotuloDe(valor)}
                  </span>
                ))}
              </span>
            )}
          </span>

          <svg
            className={`citie-multiselect__seta${aberto ? ' citie-multiselect__seta--aberta' : ''}`}
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

        {aberto ? (
          <div className="citie-multiselect__painel">
            {comFiltro ? (
              <input
                type="search"
                className="citie-multiselect__filtro"
                placeholder="Filtrar"
                aria-label={`Filtrar ${label.toLowerCase()}`}
                value={termo}
                onChange={(evento) => setTermo(evento.target.value)}
              />
            ) : null}

            <ul
              id={listaId}
              className="citie-multiselect__lista"
              role="listbox"
              aria-multiselectable="true"
              aria-labelledby={`${uid}-label`}
              // Região rolável exige acesso por teclado.
              tabIndex={0}
            >
              {visiveis.length === 0 ? (
                <li className="citie-multiselect__vazio" role="presentation">Nenhuma opção para o filtro aplicado</li>
              ) : (
                visiveis.map((opcao) => {
                  const marcado = selecionados.includes(opcao.value);
                  return (
                    <li
                      key={opcao.value}
                      role="option"
                      aria-selected={marcado}
                      className={`citie-multiselect__opcao${
                        marcado ? ' citie-multiselect__opcao--selecionada' : ''
                      }`}
                      onClick={() => alternar(opcao.value)}
                    >
                      <span className="citie-multiselect__marca" aria-hidden="true">
                        {marcado ? '✓' : ''}
                      </span>
                      {opcao.label}
                    </li>
                  );
                })
              )}
            </ul>
          </div>
        ) : null}
      </div>

      {error || helper ? (
        <p
          id={mensagemId}
          className={`citie-multiselect__mensagem${
            error ? ' citie-multiselect__mensagem--erro' : ''
          }`}
        >
          {error ? <AlertIcon /> : null}
          {error ?? helper}
        </p>
      ) : null}
    </div>
  );
}
