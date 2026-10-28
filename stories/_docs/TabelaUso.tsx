import type { ReactNode } from 'react';

/** Tabela simples para mapear token a uso. Células aceitam texto ou nós; o que vai entre crases vira código. */
export function TabelaUso({ colunas, linhas }: { colunas: string[]; linhas: ReactNode[][] }) {
  const celula = (c: ReactNode) =>
    typeof c === 'string'
      ? c.split('`').map((parte, i) =>
          i % 2 ? <code key={i} className="rounded-sm bg-background-primary-hover px-1 font-mono text-caption-1-medium">{parte}</code> : parte,
        )
      : c;
  return (
    <div className="overflow-x-auto rounded-2xl border border-border-button-default">
      <table className="w-full min-w-[520px] border-collapse text-body-regular">
        <thead>
          <tr className="border-b border-border-button-default bg-background-secondary-default text-caption-1-semibold text-text-secondary">
            {colunas.map((h) => <th key={h} scope="col" className="px-3 py-2 text-start font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => (
            <tr key={i} className="border-b border-border-button-default last:border-b-0">
              {l.map((c, j) => <td key={j} className={`px-3 py-2 align-top ${j === 0 ? 'text-body-medium' : 'text-text-secondary'}`}>{celula(c)}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
