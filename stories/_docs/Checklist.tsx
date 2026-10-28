import { useId, useState } from 'react';
import { Texto } from './Layout';

type Item = string | { texto: string; severidade?: string };
export type GrupoChecklist = { titulo: string; descricao?: string; itens: Item[] };

const BORDA = 'border border-border-button-default';

/** Lista de verificação com caixas marcáveis. O estado vive só na página aberta e não é salvo. */
export function Checklist({ grupos }: { grupos: GrupoChecklist[] }) {
  const base = useId();
  const [marcados, setMarcados] = useState<Record<string, boolean>>({});
  const total = grupos.reduce((n, g) => n + g.itens.length, 0);
  const feitos = Object.values(marcados).filter(Boolean).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <p className="text-body-medium text-text-primary" role="status" aria-live="polite">
          {feitos} de {total} itens conferidos
        </p>
        <button
          type="button"
          onClick={() => setMarcados({})}
          className={`cursor-pointer rounded-lg px-3 py-1.5 text-caption-1-semibold text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring ${BORDA}`}
        >
          Limpar marcações
        </button>
      </div>
      {grupos.map((g, gi) => (
        <fieldset key={g.titulo} className={`m-0 rounded-2xl p-4 ${BORDA}`}>
          <legend className="px-1 text-body-medium text-text-primary">{g.titulo}</legend>
          {g.descricao ? <p className="mb-2 text-caption-1-medium text-text-secondary"><Texto>{g.descricao}</Texto></p> : null}
          <ul className="m-0 flex list-none flex-col gap-1 p-0">
            {g.itens.map((it, ii) => {
              const item = typeof it === 'string' ? { texto: it } : it;
              const id = `${base}-${gi}-${ii}`;
              return (
                <li key={id}>
                  <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-lg px-1 py-1.5 hover:bg-background-primary-hover">
                    <input
                      id={id}
                      type="checkbox"
                      checked={!!marcados[id]}
                      onChange={(e) => setMarcados((m) => ({ ...m, [id]: e.target.checked }))}
                      className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[var(--color-accent-500)]"
                    />
                    <span className="text-body-regular text-text-primary">
                      <Texto>{item.texto}</Texto>
                      {item.severidade ? (
                        <span className="ms-2 rounded-sm bg-background-primary-hover px-1.5 py-0.5 font-mono text-caption-2-medium text-text-secondary">{item.severidade}</span>
                      ) : null}
                    </span>
                  </label>
                </li>
              );
            })}
          </ul>
        </fieldset>
      ))}
    </div>
  );
}
