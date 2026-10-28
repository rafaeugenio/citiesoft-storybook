import { Copiar } from './Copiar';
import { token } from './dados';

const BORDA = 'border border-border-button-default';

export const ESTILOS = [
  'large-title', 'display-1', 'display-2', 'display-3', 'display-4',
  'title-1', 'title-2', 'title-3', 'headline', 'body', 'body-2', 'caption-1', 'caption-2',
] as const;
export const PESOS = [
  ['regular', 400, 'Regular'],
  ['medium', 500, 'Medium'],
  ['semibold', 600, 'Semibold'],
  ['bold', 700, 'Bold'],
] as const;

const rem = (v?: string) => (v?.endsWith('rem') ? parseFloat(v) * 16 : v ? parseFloat(v) : NaN);
const px = (v?: string) => (Number.isFinite(rem(v)) ? `${+rem(v).toFixed(2)}px` : (v ?? ''));

/** Medidas de um estilo de texto, lidas dos tokens. */
export function medidas(estilo: string, peso = 'regular') {
  const id = `${estilo}-${peso}`;
  const tamanho = token(`--text-${id}`)?.claro;
  const linha = token(`--text-${id}--line-height`)?.claro;
  const tracking = token(`--text-${id}--letter-spacing`)?.claro ?? '0';
  const font = token(`--text-${id}--font-weight`)?.claro;
  return { id, tamanho, linha, tracking, font };
}

export const cssDoEstilo = (estilo: string, peso: string) => {
  const m = medidas(estilo, peso);
  return `font-family: var(--font-sans);\nfont-size: ${m.tamanho}; /* ${px(m.tamanho)} */\nline-height: ${m.linha}; /* ${px(m.linha)} */\nletter-spacing: ${m.tracking};\nfont-weight: ${m.font};`;
};

/** Escala completa: um cartão por estilo, com os quatro pesos e as medidas em px e rem. */
export function EscalaTipografica({ exemplo = 'Sistema de Informação Citiesoft' }: { exemplo?: string }) {
  return (
    <div className="flex flex-col gap-4">
      {ESTILOS.map((estilo) => {
        const base = medidas(estilo);
        return (
          <section key={estilo} className={`rounded-2xl p-4 ${BORDA}`} aria-label={estilo}>
            <header className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-body-medium text-text-primary">{estilo}</h3>
              <p className="font-mono text-caption-1-medium text-text-secondary">
                {px(base.tamanho)} / {px(base.linha)} · {base.tamanho} / {base.linha} · tracking {base.tracking}
              </p>
            </header>
            <div className="flex flex-col gap-1">
              {PESOS.map(([peso, numero, rotulo]) => {
                const m = medidas(estilo, peso);
                return (
                  <div key={peso} className="grid grid-cols-[88px_1fr] items-baseline gap-3 border-t border-separator-border pt-1 first:border-t-0 first:pt-0">
                    <Copiar texto={`text-${m.id}`} className="font-mono text-caption-2-medium text-text-secondary">
                      {rotulo} {numero}
                    </Copiar>
                    <span
                      className="truncate text-text-primary"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: `var(--text-${m.id})`,
                        lineHeight: `var(--text-${m.id}--line-height)`,
                        letterSpacing: `var(--text-${m.id}--letter-spacing)`,
                        fontWeight: `var(--text-${m.id}--font-weight)`,
                      }}
                    >
                      {exemplo}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

/** Resumo em tabela: uma linha por estilo, para consulta rápida. */
export function TabelaTipografica() {
  return (
    <div className={`overflow-x-auto rounded-2xl ${BORDA}`}>
      <table className="w-full min-w-[560px] border-collapse text-body-regular">
        <thead>
          <tr className="border-b border-border-button-default bg-background-secondary-default text-caption-1-semibold text-text-secondary">
            {['Estilo', 'Tamanho', 'Altura de linha', 'Tracking', 'Classe CSS'].map((h) => (
              <th key={h} scope="col" className="px-3 py-2 text-start font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ESTILOS.map((estilo) => {
            const m = medidas(estilo);
            return (
              <tr key={estilo} className="border-b border-border-button-default last:border-b-0">
                <td className="px-3 py-2 text-body-medium">{estilo}</td>
                <td className="px-3 py-2 font-mono text-caption-1-medium">{px(m.tamanho)} ({m.tamanho})</td>
                <td className="px-3 py-2 font-mono text-caption-1-medium">{px(m.linha)} ({m.linha})</td>
                <td className="px-3 py-2 font-mono text-caption-1-medium">{m.tracking}</td>
                <td className="px-3 py-2"><code className="font-mono text-caption-1-medium">.text-{estilo}-regular</code></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Famílias de fonte com amostra, pilha completa de fallback e pesos. */
export function Familias() {
  const itens = [
    { nome: 'Display (títulos e marca)', variavel: '--font-display', amostra: 'Aa Bb Cc 0123456789', pesos: PESOS.slice(1) },
    { nome: 'Sans (corpo e interface)', variavel: '--font-sans', amostra: 'Aa Bb Cc 0123456789', pesos: PESOS },
    { nome: 'Mono (código e dados)', variavel: '--font-mono', amostra: 'const total = 1.250,00; // R$', pesos: PESOS.slice(0, 2) },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {itens.map((f) => (
        <div key={f.variavel} className={`rounded-2xl p-4 ${BORDA}`}>
          <p className="text-caption-1-semibold text-text-secondary">{f.nome}</p>
          <p className="mt-2 text-title-3-medium text-text-primary" style={{ fontFamily: `var(${f.variavel})` }}>
            {f.amostra}
          </p>
          <div className="mt-3 flex flex-wrap gap-3" style={{ fontFamily: `var(${f.variavel})` }}>
            {f.pesos.map(([, numero, rotulo]) => (
              <span key={numero} className="text-body-regular text-text-primary" style={{ fontWeight: numero }}>
                {rotulo}
              </span>
            ))}
          </div>
          <Copiar texto={token(f.variavel)?.claro ?? ''} className="mt-3 block w-full">
            <code className="block break-words font-mono text-caption-2-medium text-text-secondary">
              {f.variavel}: {token(f.variavel)?.claro}
            </code>
          </Copiar>
        </div>
      ))}
    </div>
  );
}
