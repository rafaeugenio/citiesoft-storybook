import { useEffect, useState } from 'react';

const BORDA = 'border border-border-button-default';

/** Lê a preferência do sistema e acompanha mudanças. */
function useMovimentoReduzido(): boolean {
  const [reduzido, setReduzido] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const consulta = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduzido(consulta.matches);
    const aoMudar = (e: MediaQueryListEvent) => setReduzido(e.matches);
    consulta.addEventListener('change', aoMudar);
    return () => consulta.removeEventListener('change', aoMudar);
  }, []);
  return reduzido;
}

/** Botão que alterna `ligado` e fica desativado com movimento reduzido. */
function Reproduzir({ onClick, desativado }: { onClick: () => void; desativado: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={desativado}
      className="cursor-pointer rounded-lg px-3 py-1.5 text-caption-1-semibold text-text-secondary outline-none hover:text-text-primary focus-visible:ring-2 focus-visible:ring-border-focus-ring disabled:cursor-not-allowed disabled:opacity-50"
    >
      Reproduzir
    </button>
  );
}

function AvisoReduzido() {
  return (
    <p className="rounded-xl bg-background-secondary-default p-3 text-caption-1-medium text-text-secondary">
      Seu sistema pede movimento reduzido. As amostras ficam paradas no estado final.
    </p>
  );
}

/** Uma barra por token de duração. O ponto percorre a trilha com a duração do token. */
export function DuracoesDeMotion({ itens }: { itens: { token: string; ms: number; uso: string }[] }) {
  const reduzido = useMovimentoReduzido();
  const [ligado, setLigado] = useState(false);
  const fim = reduzido || ligado;
  return (
    <div className={`overflow-hidden rounded-2xl bg-background-secondary-default ${BORDA}`}>
      <div className="flex items-center justify-between border-b border-border-button-default px-4 py-2">
        <p className="text-caption-1-semibold">Durações do tema</p>
        <Reproduzir desativado={reduzido} onClick={() => setLigado((v) => !v)} />
      </div>
      <ul className="m-0 list-none divide-y divide-border-button-default p-0">
        {itens.map((i) => (
          <li key={i.token} className="grid items-center gap-x-4 gap-y-1 px-4 py-3 sm:grid-cols-[13rem_1fr]">
            <div>
              <code className="font-mono text-caption-1-medium">{i.token}</code>
              <span className="ms-2 text-caption-1-medium text-text-secondary">{i.ms}ms</span>
            </div>
            <div>
              <div className="relative h-3 rounded-full bg-background-primary-hover" aria-hidden="true">
                <span
                  className="absolute top-0 size-3 rounded-full"
                  style={{
                    left: fim ? 'calc(100% - 0.75rem)' : '0',
                    backgroundColor: 'var(--color-accent-500, #1261e4)',
                    transition: reduzido ? 'none' : `left var(${i.token}, ${i.ms}ms) var(--ease-citie-out, cubic-bezier(0.16, 1, 0.3, 1))`,
                  }}
                />
              </div>
              <p className="mt-1 text-caption-1-medium text-text-secondary">{i.uso}</p>
            </div>
          </li>
        ))}
      </ul>
      {reduzido ? <div className="p-3"><AvisoReduzido /></div> : null}
    </div>
  );
}

/** Curva em SVG mais um ponto que percorre a trilha com a curva. */
export function CurvasDeMotion({ itens }: { itens: { token: string; curva: [number, number, number, number]; uso: string }[] }) {
  const reduzido = useMovimentoReduzido();
  const [ligado, setLigado] = useState(false);
  const fim = reduzido || ligado;
  return (
    <div className={`overflow-hidden rounded-2xl bg-background-secondary-default ${BORDA}`}>
      <div className="flex items-center justify-between border-b border-border-button-default px-4 py-2">
        <p className="text-caption-1-semibold">Curvas do tema, 480ms</p>
        <Reproduzir desativado={reduzido} onClick={() => setLigado((v) => !v)} />
      </div>
      <ul className="m-0 grid list-none gap-4 p-4 sm:grid-cols-2">
        {itens.map((i) => {
          const [a, b, c, d] = i.curva;
          const css = `cubic-bezier(${a}, ${b}, ${c}, ${d})`;
          return (
            <li key={i.token} className={`rounded-xl bg-background-full p-3 ${BORDA}`}>
              <svg viewBox="-0.1 -0.1 1.2 1.2" className="float-end ms-3 size-16" role="img" aria-label={`Curva ${i.token}`}>
                <rect x="0" y="0" width="1" height="1" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.015" />
                <path d={`M0 1 C ${a} ${1 - b}, ${c} ${1 - d}, 1 0`} fill="none" stroke="currentColor" strokeWidth="0.04" />
              </svg>
              <code className="font-mono text-caption-1-semibold">{i.token}</code>
              <p className="mt-1 font-mono text-caption-2-medium text-text-secondary">{css}</p>
              <p className="mt-1 text-caption-1-medium text-text-secondary">{i.uso}</p>
              <div className="relative mt-3 h-3 clear-both rounded-full bg-background-primary-hover" aria-hidden="true">
                <span
                  className="absolute top-0 size-3 rounded-full"
                  style={{
                    left: fim ? 'calc(100% - 0.75rem)' : '0',
                    backgroundColor: 'var(--color-accent-500, #1261e4)',
                    transition: reduzido ? 'none' : `left var(--motion-hero, 480ms) var(${i.token}, ${css})`,
                  }}
                />
              </div>
            </li>
          );
        })}
      </ul>
      {reduzido ? <div className="p-3 pt-0"><AvisoReduzido /></div> : null}
    </div>
  );
}
