import type { ReactNode } from 'react';
import { Copiar } from './Copiar';

const BORDA = 'border border-border-button-default';

const SUPERFICIES = ['background-full', 'background-secondary-default', 'background-primary-default', 'background-primary-hover'] as const;
const TEXTOS = ['text-primary', 'text-secondary', 'text-tertiary', 'text-error-primary'] as const;

/** Renderiza o conteúdo no tema escolhido: a classe `dark` troca os tokens sozinha. */
function Tema({ modo, children }: { modo: 'claro' | 'escuro'; children: ReactNode }) {
  return (
    <div className={modo === 'escuro' ? 'dark' : ''}>
      <div className={`rounded-2xl bg-background-full p-5 text-text-primary ${BORDA}`}>
        <p className="mb-4 text-caption-1-semibold text-text-secondary">{modo === 'escuro' ? 'Tema escuro' : 'Tema claro'}</p>
        {children}
      </div>
    </div>
  );
}

function Amostra({ modo }: { modo: 'claro' | 'escuro' }) {
  return (
    <Tema modo={modo}>
      <div className="grid grid-cols-2 gap-2">
        {SUPERFICIES.map((s) => (
          <div key={s} className={`rounded-xl p-3 ${BORDA}`} style={{ backgroundColor: `var(--color-${s})` }}>
            <p className="font-mono text-caption-2-medium text-text-primary">--color-{s}</p>
          </div>
        ))}
      </div>
      <div className={`mt-3 rounded-xl p-4 ${BORDA}`} style={{ backgroundColor: 'var(--color-background-primary-default)' }}>
        {TEXTOS.map((t) => (
          <p key={t} className="text-body-medium" style={{ color: `var(--color-${t})` }}>
            {t.replace('text-', 'Texto ')} <span className="font-mono text-caption-2-medium">--color-{t}</span>
          </p>
        ))}
      </div>
    </Tema>
  );
}

/** Superfícies e textos nos dois temas, lado a lado. */
export function ComparacaoDeTemas() {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Amostra modo="claro" />
      <Amostra modo="escuro" />
    </div>
  );
}

const REGRAS: [string, string][] = [
  ['Use token semântico', 'var(--color-text-primary), text-text-primary'],
  ['Nunca hex nem rgb', '#0a0a0a, rgb(10 10 10)'],
  ['Nunca dark: com cor crua', 'bg-white dark:bg-neutral-800'],
  ['Nunca família da paleta no componente', 'var(--color-neutral-950)'],
];

/** Pares de regra para consulta rápida. */
export function RegrasDeTema() {
  return (
    <ul className="grid gap-2 md:grid-cols-2">
      {REGRAS.map(([titulo, exemplo]) => (
        <li key={titulo} className={`rounded-2xl p-4 ${BORDA}`}>
          <p className="text-body-medium">{titulo}</p>
          <Copiar texto={exemplo} className="mt-1"><code className="font-mono text-caption-1-medium text-text-secondary">{exemplo}</code></Copiar>
        </li>
      ))}
    </ul>
  );
}
