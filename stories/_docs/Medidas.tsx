import { useEffect, useState } from 'react';
import { Copiar } from './Copiar';
import { comPrefixo, token } from './dados';

const BORDA = 'border border-border-button-default';
const remParaPx = (v: string) => (v.endsWith('rem') ? `${parseFloat(v) * 16}px` : v);

const PASSOS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16, 20, 24, 28, 32, 36, 40, 48, 56, 64, 72, 80, 96];

/** Escala de espaçamento: múltiplos de 4px (`--spacing`). */
export function Espacamento() {
  const base = parseFloat(token('--spacing')?.claro ?? '0.25rem') * 16;
  return (
    <div className={`overflow-x-auto rounded-2xl ${BORDA}`}>
      <table className="w-full min-w-[480px] border-collapse text-body-regular">
        <thead>
          <tr className="border-b border-border-button-default bg-background-secondary-default text-caption-1-semibold text-text-secondary">
            {['Passo', 'Valor', 'Tailwind', 'CSS', 'Escala'].map((h) => <th key={h} scope="col" className="px-3 py-2 text-start font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {PASSOS.map((n) => {
            const pxv = n * base;
            return (
              <tr key={n} className="border-b border-border-button-default last:border-b-0">
                <td className="px-3 py-1.5 font-mono text-caption-1-semibold">{n}</td>
                <td className="px-3 py-1.5 font-mono text-caption-1-medium">{pxv}px · {pxv / 16}rem</td>
                <td className="px-3 py-1.5"><code className="font-mono text-caption-1-medium">p-{n}</code></td>
                <td className="px-3 py-1.5"><code className="font-mono text-caption-1-medium">calc(var(--spacing) * {n})</code></td>
                <td className="px-3 py-1.5"><span className="block h-3 rounded-xs bg-accent-500" style={{ width: Math.min(pxv, 360) }} /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Raios de borda, com o valor em px e o token. */
export function Raios() {
  const lista = comPrefixo('--radius-').filter((t) => t.tipo === 'text');
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(132px,1fr))] gap-3">
      {lista.map((t) => (
        <Copiar key={t.nome} texto={`var(${t.nome})`} className="flex flex-col gap-2">
          <span className={`block h-20 w-full bg-background-secondary-default ${BORDA}`} style={{ borderRadius: `var(${t.nome})` }} />
          <span className="text-caption-1-semibold text-text-primary">{t.nome.replace('--radius-', '')}</span>
          <span className="font-mono text-caption-2-medium text-text-secondary">{remParaPx(t.claro)}</span>
        </Copiar>
      ))}
    </div>
  );
}

/** Sombras lado a lado nos dois temas: o contêiner `.dark` troca os tokens sozinho. */
export function Sombras() {
  const lista = comPrefixo('--shadow-').filter((t) => !t.nome.startsWith('--shadow-inset'));
  const Painel = ({ modo }: { modo: 'claro' | 'escuro' }) => (
    <div className={`${modo === 'escuro' ? 'dark' : ''}`}>
      <div className={`rounded-2xl bg-background-secondary-default p-5 text-text-primary ${BORDA}`}>
        <p className="mb-4 text-caption-1-semibold capitalize text-text-secondary">{modo}</p>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {lista.map((t) => (
            <Copiar key={t.nome} texto={`var(${t.nome})`} className="flex flex-col gap-2">
              <span className={`block h-16 w-full rounded-xl bg-background-primary-default ${BORDA}`} style={{ boxShadow: `var(${t.nome})` }} />
              <span className="text-caption-1-semibold">{t.nome.replace('--shadow-', '')}</span>
            </Copiar>
          ))}
        </div>
      </div>
    </div>
  );
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Painel modo="claro" />
      <Painel modo="escuro" />
    </div>
  );
}

export function Breakpoints() {
  const lista = comPrefixo('--breakpoint-');
  return (
    <div className={`overflow-x-auto rounded-2xl ${BORDA}`}>
      <table className="w-full border-collapse text-body-regular">
        <thead>
          <tr className="border-b border-border-button-default bg-background-secondary-default text-caption-1-semibold text-text-secondary">
            {['Nome', 'Largura mínima', 'Media query'].map((h) => <th key={h} scope="col" className="px-3 py-2 text-start font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {lista.map((t) => (
            <tr key={t.nome} className="border-b border-border-button-default last:border-b-0">
              <td className="px-3 py-2 text-body-medium">{t.nome.replace('--breakpoint-', '')}</td>
              <td className="px-3 py-2 font-mono text-caption-1-medium">{remParaPx(t.claro)} ({t.claro})</td>
              <td className="px-3 py-2"><code className="font-mono text-caption-1-medium">@media (min-width: {t.claro})</code></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Containers() {
  const lista = comPrefixo('--container-');
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2">
      {lista.map((t) => (
        <div key={t.nome} className={`rounded-xl p-3 ${BORDA}`}>
          <p className="text-caption-1-semibold">{t.nome.replace('--container-', '')}</p>
          <p className="font-mono text-caption-2-medium text-text-secondary">{remParaPx(t.claro)}</p>
        </div>
      ))}
    </div>
  );
}

/** Curvas de easing com pré-visualização animada que respeita `prefers-reduced-motion`. */
export function Easings() {
  const [reduz, setReduz] = useState(false);
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduz(m.matches);
    const f = () => setReduz(m.matches);
    m.addEventListener('change', f);
    return () => m.removeEventListener('change', f);
  }, []);
  const lista = comPrefixo('--ease-');
  return (
    <div className="grid gap-3 md:grid-cols-3">
      <style>{`@keyframes cs-doc-trilha{0%,15%{transform:translateX(0)}85%,100%{transform:translateX(calc(100% - 16px))}}`}</style>
      {lista.map((t) => (
        <div key={t.nome} className={`rounded-2xl p-4 ${BORDA}`}>
          <p className="text-body-medium">{t.nome.replace('--ease-', 'ease-')}</p>
          <code className="mt-1 block font-mono text-caption-2-medium text-text-secondary">{t.claro}</code>
          <div className="mt-4 h-4 rounded-full bg-background-secondary-default">
            <span
              className="block size-4 rounded-full bg-accent-500"
              style={reduz ? undefined : { animation: `cs-doc-trilha 1.8s var(${t.nome}) infinite alternate` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TokensDeMovimento() {
  const lista = [...comPrefixo('--motion-'), ...comPrefixo('--button-transition', '--input-transition'), ...comPrefixo('--animate-', '--default-')];
  return (
    <div className={`overflow-x-auto rounded-2xl ${BORDA}`}>
      <table className="w-full min-w-[520px] border-collapse text-body-regular">
        <tbody>
          {lista.map((t) => (
            <tr key={t.nome} className="border-b border-border-button-default last:border-b-0">
              <td className="px-3 py-2"><Copiar texto={t.nome}><code className="font-mono text-caption-1-semibold">{t.nome}</code></Copiar></td>
              <td className="px-3 py-2 font-mono text-caption-1-medium text-text-secondary">{t.claro}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
