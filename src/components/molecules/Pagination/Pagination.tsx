import { useState } from 'react';
import './Pagination.css';

export type VariantePaginacao = 'completa' | 'compacta' | 'minima' | 'simples';

export interface PaginationProps {
  /** Contexto no nome acessível: "Paginação de servidores". */
  label: string;
  totalRegistros: number;
  itensPorPagina?: number;
  paginaInicial?: number;
  variant?: VariantePaginacao;
  /** Alvo de toque de 44px para portal do cidadão e mobile. */
  ampliado?: boolean;
  onPageChange?: (pagina: number) => void;
}

const RETICENCIAS = '…';

/**
 * Acima de 7 páginas mostra sempre a 1, a última e ±1 da ativa.
 * As reticências nunca colapsam a primeira nem a última página.
 */
export function janelaDePaginas(atual: number, total: number): (number | typeof RETICENCIAS)[] {
  if (total <= 7) return Array.from({ length: total }, (_, indice) => indice + 1);

  const paginas = new Set([1, total, atual, atual - 1, atual + 1]);
  const ordenadas = [...paginas].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);

  const resultado: (number | typeof RETICENCIAS)[] = [];
  ordenadas.forEach((pagina, indice) => {
    // Nunca duas reticências seguidas: só entra quando há salto real.
    if (indice > 0 && pagina - ordenadas[indice - 1] > 1) resultado.push(RETICENCIAS);
    resultado.push(pagina);
  });
  return resultado;
}

function formatarBR(valor: number) {
  return valor.toLocaleString('pt-BR');
}

export function Pagination({
  label,
  totalRegistros,
  itensPorPagina = 25,
  paginaInicial = 1,
  variant = 'completa',
  ampliado = false,
  onPageChange,
}: PaginationProps) {
  const [pagina, setPagina] = useState(paginaInicial);
  const totalPaginas = Math.max(1, Math.ceil(totalRegistros / itensPorPagina));

  // Com zero registros o paginador some por inteiro e a tabela mostra o empty state.
  if (totalRegistros === 0) return null;

  const primeiroDaPagina = (pagina - 1) * itensPorPagina + 1;
  const ultimoDaPagina = Math.min(pagina * itensPorPagina, totalRegistros);

  const irPara = (destino: number) => {
    const alvo = Math.min(Math.max(1, destino), totalPaginas);
    setPagina(alvo);
    onPageChange?.(alvo);
  };

  const classes = [
    'citie-pagination',
    `citie-pagination--${variant}`,
    ampliado ? 'citie-pagination--ampliado' : null,
  ]
    .filter(Boolean)
    .join(' ');

  const mostraNumeros = variant === 'completa' || variant === 'compacta';
  const mostraExtremos = variant === 'completa';
  const mostraTotal = variant !== 'simples';

  return (
    <nav className={classes} aria-label={label}>
      {mostraTotal ? (
        <span className="citie-pagination__total">
          Mostrando {formatarBR(primeiroDaPagina)} a {formatarBR(ultimoDaPagina)} de{' '}
          {formatarBR(totalRegistros)} registros
        </span>
      ) : null}

      <div className="citie-pagination__controles">
        {mostraExtremos ? (
          <button
            type="button"
            className="citie-pagination__botao"
            aria-label="Primeira página"
            disabled={pagina === 1}
            onClick={() => irPara(1)}
          >
            «
          </button>
        ) : null}

        <button
          type="button"
          className={`citie-pagination__botao${
            mostraExtremos ? ' citie-pagination__botao--rotulado' : ''
          }`}
          aria-label="Página anterior"
          disabled={pagina === 1}
          onClick={() => irPara(pagina - 1)}
        >
          <span aria-hidden="true">‹</span>
          {/* "Anterior" e "Próximo" com texto, como no kit, só na variante completa;
              o aria-label acima já cobre o nome acessível nas demais. */}
          {mostraExtremos ? <span aria-hidden="true">Anterior</span> : null}
        </button>

        {mostraNumeros
          ? janelaDePaginas(pagina, totalPaginas).map((item, indice) =>
              item === RETICENCIAS ? (
                <span
                  key={`reticencias-${indice}`}
                  className="citie-pagination__reticencias"
                  aria-hidden="true"
                >
                  {RETICENCIAS}
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  className={`citie-pagination__botao${
                    item === pagina ? ' citie-pagination__botao--ativa' : ''
                  }`}
                  aria-label={`Página ${item}`}
                  aria-current={item === pagina ? 'page' : undefined}
                  onClick={() => irPara(item)}
                >
                  {item}
                </button>
              ),
            )
          : null}

        {variant === 'minima' ? (
          <span className="citie-pagination__resumo">
            Pág. {pagina} de {totalPaginas}
          </span>
        ) : null}

        <button
          type="button"
          className={`citie-pagination__botao${
            mostraExtremos ? ' citie-pagination__botao--rotulado' : ''
          }`}
          aria-label="Próxima página"
          disabled={pagina === totalPaginas}
          onClick={() => irPara(pagina + 1)}
        >
          {mostraExtremos ? <span aria-hidden="true">Próximo</span> : null}
          <span aria-hidden="true">›</span>
        </button>

        {mostraExtremos ? (
          <button
            type="button"
            className="citie-pagination__botao"
            aria-label="Última página"
            disabled={pagina === totalPaginas}
            onClick={() => irPara(totalPaginas)}
          >
            »
          </button>
        ) : null}
      </div>

      {/* Anuncia a nova posição sem interromper a leitura em andamento. */}
      <span className="citie-visualmente-oculto" role="status" aria-live="polite">
        Página {pagina} de {totalPaginas}. Exibindo registros {formatarBR(primeiroDaPagina)} a{' '}
        {formatarBR(ultimoDaPagina)} de {formatarBR(totalRegistros)}
      </span>
    </nav>
  );
}
