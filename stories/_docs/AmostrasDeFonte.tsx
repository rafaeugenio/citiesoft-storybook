import type { ReactNode } from 'react';
import { Texto } from './Layout';

const BORDA = 'border border-border-button-default';

export const FAMILIAS = {
  display: "'Red Hat Display', Inter, system-ui, sans-serif",
  inter: "Inter, system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'Red Hat Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
} as const;
export type Familia = keyof typeof FAMILIAS;

type Estilo = { familia: Familia; peso?: number; tamanho?: number; linha?: number; tracking?: number; caixaAlta?: boolean };

const css = (e: Estilo) => ({
  fontFamily: FAMILIAS[e.familia],
  fontWeight: e.peso ?? 400,
  fontSize: e.tamanho,
  lineHeight: e.linha,
  letterSpacing: e.tracking !== undefined ? `${e.tracking}em` : undefined,
  textTransform: e.caixaAlta ? ('uppercase' as const) : undefined,
});

/** Texto composto numa das famílias da marca, com medidas explícitas. */
export function TextoEm({ children, ...e }: Estilo & { children: ReactNode }) {
  return <span style={css(e)}>{children}</span>;
}

/** Cartão de família: amostra grande, alfabeto e uma linha por peso. */
export function Especime({ nome, familia, pesos, papel, amostra }: { nome: string; familia: Familia; pesos: [number, string][]; papel: string; amostra: string }) {
  return (
    <div className={`rounded-2xl p-5 ${BORDA}`}>
      <p className="text-caption-2-semibold uppercase tracking-wide text-text-secondary">{papel}</p>
      <h3 className="text-title-3-semibold text-text-primary">{nome}</h3>
      <p className="mt-3 text-text-primary" style={{ ...css({ familia, peso: familia === 'mono' ? 400 : 700, tamanho: 56, linha: 1.1, tracking: familia === 'display' ? -0.02 : 0 }) }} aria-hidden>
        Aa
      </p>
      <p className="mt-3 break-words text-text-primary" style={css({ familia, peso: 400, tamanho: 16, linha: 1.5 })}>
        {amostra}
      </p>
      <ul className="mt-4 flex flex-col gap-1">
        {pesos.map(([peso, rotulo]) => (
          <li key={peso} className="flex items-baseline justify-between gap-3 text-text-primary" style={css({ familia, peso, tamanho: 18, linha: 1.35 })}>
            <span>{rotulo}</span>
            <span className="font-mono text-caption-2-medium text-text-secondary">{peso}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

type NivelDaEscala = { nivel: string; familia: Familia; tamanho: number; peso: number; linha: number; tracking: number; uso: string; amostra: string; caixaAlta?: boolean };

/** Escala de produto: cada linha renderizada no tamanho real, com as medidas ao lado. */
export function EscalaDaMarca({ niveis }: { niveis: NivelDaEscala[] }) {
  return (
    <div className={`overflow-hidden rounded-2xl ${BORDA}`}>
      {niveis.map((n) => (
        <div key={n.nivel} className="grid gap-2 border-b border-border-button-default p-4 last:border-b-0 md:grid-cols-[200px_1fr]">
          <div className="text-caption-1-medium text-text-secondary">
            <p className="font-mono text-caption-1-semibold text-text-primary">{n.nivel}</p>
            <p>{n.tamanho}px · peso {n.peso}</p>
            <p>linha {n.linha} · espaçamento {n.tracking}em</p>
          </div>
          <div className="min-w-0">
            <p className="break-words text-text-primary" style={css({ familia: n.familia, peso: n.peso, tamanho: n.tamanho, linha: n.linha, tracking: n.tracking, caixaAlta: n.caixaAlta })}>
              {n.amostra}
            </p>
            <p className="mt-1 text-caption-1-medium text-text-secondary"><Texto>{n.uso}</Texto></p>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Mesmo parágrafo em duas larguras de linha, para mostrar o limite de leitura. */
export function MedidaDeLinha({ texto, bom, ruim }: { texto: string; bom: string; ruim: string }) {
  const estilo = css({ familia: 'inter', peso: 400, tamanho: 16, linha: 1.6 });
  return (
    <div className="grid gap-3 md:grid-cols-2">
      <div className={`rounded-2xl bg-background-secondary-default p-4 ${BORDA}`}>
        <p className="mb-2 text-caption-1-semibold text-text-primary">Faça: {bom}</p>
        <p className="text-text-primary" style={{ ...estilo, maxWidth: '68ch' }}>{texto}</p>
      </div>
      <div className={`overflow-x-auto rounded-2xl p-4 ${BORDA}`}>
        <p className="mb-2 text-caption-1-semibold text-text-error-primary">Evite: {ruim}</p>
        <p className="text-text-secondary" style={{ ...estilo, width: '118ch', maxWidth: 'none' }}>{texto}</p>
      </div>
    </div>
  );
}
