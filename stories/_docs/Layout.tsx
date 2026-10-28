import { useState, type ReactNode } from 'react';
import { Unstyled } from '@storybook/addon-docs/blocks';
import { Copiar } from './Copiar';

/** Todo bloco de documentação vive dentro de `Unstyled` para o CSS do Storybook não interferir. */
export function Doc({ children }: { children: ReactNode }) {
  return (
    <Unstyled>
      <div className="font-sans text-text-primary [&_*]:box-border">{children}</div>
    </Unstyled>
  );
}

/** Texto corrido com `trechos` entre crases renderizados como código. */
export function Texto({ children }: { children: ReactNode }) {
  if (typeof children !== 'string') return <>{children}</>;
  return (
    <>
      {children.split('`').map((parte, i) =>
        i % 2 ? (
          <code key={i} className="rounded-sm bg-background-primary-hover px-1 font-mono text-caption-1-medium">{parte}</code>
        ) : (
          parte
        ),
      )}
    </>
  );
}

export function Secao({ titulo, descricao, children }: { titulo: string; descricao?: ReactNode; children: ReactNode }) {
  return (
    <section className="mt-12 first:mt-0">
      <h2 className="text-title-3-semibold text-text-primary">{titulo}</h2>
      {descricao ? <p className="mt-1 max-w-[68ch] text-body-regular text-text-secondary"><Texto>{descricao}</Texto></p> : null}
      <div className="mt-5 [&>*+*]:mt-5">{children}</div>
    </section>
  );
}

export function Callout({ titulo, children }: { titulo?: string; children: ReactNode }) {
  return (
    <aside className="rounded-2xl border border-border-button-default bg-background-secondary-default p-4 text-body-regular">
      {titulo ? <p className="mb-1 text-body-medium">{titulo}</p> : null}
      <div className="max-w-[72ch] [&_code]:rounded-sm [&_code]:bg-background-primary-hover [&_code]:px-1 [&_code]:font-mono [&_code]:text-caption-1-medium">{children}</div>
    </aside>
  );
}

/** Código de uma tecnologia. Os snippets vivem em `_ui/snippets/*.ts`, fora do MDX, para manter a indentação. */
export type Abas = Record<string, { codigo: string; linguagem?: string }>;

/** Abas de código para a mesma tarefa em várias stacks. */
export function CodeTabs({ abas }: { abas: Abas }) {
  const nomes = Object.keys(abas);
  const [atual, setAtual] = useState(nomes[0]);
  const aba = abas[atual] ?? abas[nomes[0]];
  return (
    <div className="overflow-hidden rounded-2xl border border-border-button-default bg-background-secondary-default">
      <div role="tablist" aria-label="Tecnologia" className="flex flex-wrap gap-1 border-b border-border-button-default p-1.5">
        {nomes.map((n) => (
          <button
            key={n}
            role="tab"
            type="button"
            aria-selected={n === atual}
            onClick={() => setAtual(n)}
            className={`cursor-pointer rounded-lg px-3 py-1.5 text-caption-1-semibold outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring ${
              n === atual ? 'bg-background-primary-default text-text-primary shadow-xs' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {n}
          </button>
        ))}
        <Copiar texto={aba.codigo} className="ms-auto px-3 py-1.5 text-caption-1-semibold text-text-secondary hover:text-text-primary">
          Copiar
        </Copiar>
      </div>
      <pre className="m-0 max-h-[420px] overflow-auto p-4 font-mono text-caption-1-medium leading-5 text-text-primary" tabIndex={0}>
        <code>{aba.codigo}</code>
      </pre>
    </div>
  );
}

export function Pagina({ titulo, resumo, children }: { titulo: string; resumo: ReactNode; children: ReactNode }) {
  return (
    <Doc>
      <header className="mb-10 border-b border-separator-border pb-6">
        <h1 className="text-title-1-semibold text-text-primary">{titulo}</h1>
        <p className="mt-2 max-w-[68ch] text-body-regular text-text-secondary"><Texto>{resumo}</Texto></p>
      </header>
      {children}
    </Doc>
  );
}

const ARQUIVOS = [
  ['citiesoft.tokens.css', 'Variáveis CSS, tema claro e escuro. Serve a qualquer stack.'],
  ['citiesoft.tokens.scss', 'Variáveis SCSS e mapa do tema escuro.'],
  ['citiesoft.tokens.json', 'Formato W3C Design Tokens, para Style Dictionary, Figma e apps nativos.'],
  ['citiesoft.text.css', 'Classes de estilo de texto para HTML puro.'],
  ['citiesoft.tailwind-theme.css', 'Tema para projetos Tailwind CSS v4.'],
  ['citiesoft.tailwind-typography.css', 'Escala tipográfica para projetos Tailwind CSS v4.'],
] as const;

/** Lista de arquivos de tokens para download. */
export function Downloads() {
  return (
    <ul className="grid gap-2 md:grid-cols-2">
      {ARQUIVOS.map(([arquivo, descricao]) => (
        <li key={arquivo} className="rounded-2xl border border-border-button-default p-4">
          <a href={`tokens/${arquivo}`} download className="font-mono text-caption-1-semibold text-text-primary underline underline-offset-2">
            {arquivo}
          </a>
          <p className="mt-1 text-caption-1-medium text-text-secondary">{descricao}</p>
        </li>
      ))}
    </ul>
  );
}
