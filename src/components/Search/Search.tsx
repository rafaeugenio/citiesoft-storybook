import { useState, type ReactNode } from 'react';
import { Spinner } from '../Progress/Progress';
import './Search.css';

export const MINIMO_DE_CARACTERES = 3;

export interface SearchProps {
  /** Informa o escopo: "Buscar por nome, CPF ou matrícula". */
  placeholder: string;
  /** Nome acessível do campo, com o escopo. */
  label: string;
  size?: 'sm' | 'md' | 'lg';
  carregando?: boolean;
  disabled?: boolean;
  error?: string;
  /** Sugestões do autocomplete, no máximo 8 itens. */
  sugestoes?: string[];
  /** Contagem no plural correto, exibida com o resultado. */
  resultado?: { total: number; substantivo: [string, string] };
  valorInicial?: string;
  onSearch?: (termo: string) => void;
}

/** Destaca o trecho correspondente com fundo de marca, nunca só negrito. */
function destacar(texto: string, termo: string): ReactNode {
  const posicao = texto.toLowerCase().indexOf(termo.toLowerCase());
  if (!termo || posicao < 0) return texto;

  return (
    <>
      {texto.slice(0, posicao)}
      <mark className="citie-search__destaque">{texto.slice(posicao, posicao + termo.length)}</mark>
      {texto.slice(posicao + termo.length)}
    </>
  );
}

export function Search({
  placeholder,
  label,
  size = 'md',
  carregando = false,
  disabled = false,
  error,
  sugestoes,
  resultado,
  valorInicial = '',
  onSearch,
}: SearchProps) {
  const [termo, setTermo] = useState(valorInicial);

  const curto = termo.length > 0 && termo.length < MINIMO_DE_CARACTERES;
  const visiveis = (sugestoes ?? [])
    .filter((item) => item.toLowerCase().includes(termo.toLowerCase()))
    .slice(0, 8);

  const contagem = resultado
    ? `${resultado.total} ${resultado.total === 1 ? resultado.substantivo[0] : resultado.substantivo[1]} ${
        resultado.total === 1 ? 'encontrado' : 'encontrados'
      }`
    : null;

  return (
    <div className="citie-search-bloco">
      <search>
        <div
          className={`citie-search citie-search--${size}${error ? ' citie-search--erro' : ''}${
            disabled ? ' citie-search--desabilitada' : ''
          }`}
        >
          {/* Spinner substitui o ícone de busca; nunca os dois ao mesmo tempo.
              O ícone é decorativo, mas o spinner precisa ser anunciado. */}
          {carregando ? (
            <span className="citie-search__icone">
              <Spinner label="Buscando" size="sm" />
            </span>
          ) : (
            <span className="citie-search__icone" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="6" />
                <path d="m16 16 4 4" strokeLinecap="round" />
              </svg>
            </span>
          )}

          <input
            type="search"
            role="searchbox"
            className="citie-search__campo"
            aria-label={label}
            aria-invalid={error ? true : undefined}
            placeholder={placeholder}
            value={termo}
            disabled={disabled}
            onChange={(evento) => {
              setTermo(evento.target.value);
              onSearch?.(evento.target.value);
            }}
          />

          {termo ? (
            <button
              type="button"
              className="citie-search__limpar"
              aria-label="Limpar busca"
              onClick={() => {
                setTermo('');
                onSearch?.('');
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          ) : null}
        </div>
      </search>

      {visiveis.length > 0 && termo.length >= MINIMO_DE_CARACTERES ? (
        <ul className="citie-search__sugestoes" aria-label="Sugestões de busca">
          {visiveis.map((item) => (
            <li key={item}>
              <button type="button" className="citie-search__sugestao" onClick={() => setTermo(item)}>
                {destacar(item, termo)}
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {/* A contagem e a mensagem de vazio são anunciadas sem interromper a leitura. */}
      <div className="citie-search__estado" aria-live="polite" aria-busy={carregando || undefined}>
        {error ? (
          <p className="citie-search__erro">{error}</p>
        ) : curto ? (
          <p className="citie-search__dica">
            Digite ao menos {MINIMO_DE_CARACTERES} caracteres para buscar
          </p>
        ) : resultado && resultado.total === 0 && termo ? (
          <p className="citie-search__dica">
            Nenhum resultado para "{termo}". Verifique a grafia ou tente um termo mais amplo.
          </p>
        ) : contagem ? (
          <p className="citie-search__contagem">{contagem}</p>
        ) : null}
      </div>
    </div>
  );
}
