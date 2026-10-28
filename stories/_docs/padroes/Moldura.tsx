import type { ReactNode } from 'react';
import { Texto } from '../Layout';

const BORDA = 'border border-border-button-default';

/** Moldura de demonstração: fundo da página, borda e legenda curta. */
export function Moldura({ legenda, children, largura }: { legenda?: string; children: ReactNode; largura?: number }) {
  return (
    <figure className={`overflow-hidden rounded-2xl bg-background-full ${BORDA}`}>
      <div className="p-4 sm:p-6" style={largura ? { maxWidth: largura } : undefined}>{children}</div>
      {legenda ? (
        <figcaption className="border-t border-border-button-default bg-background-secondary-default px-3 py-2 text-caption-1-medium text-text-secondary">
          <Texto>{legenda}</Texto>
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Lista de blocos e telas prontos que implementam o padrão. */
export function Prontos({ itens }: { itens: { nome: string; uso: string }[] }) {
  return (
    <ul className="grid gap-3 md:grid-cols-2">
      {itens.map((i) => (
        <li key={i.nome} className={`rounded-2xl p-4 ${BORDA}`}>
          <p className="font-mono text-caption-1-semibold text-text-primary">{i.nome}</p>
          <p className="mt-1 text-caption-1-medium text-text-secondary"><Texto>{i.uso}</Texto></p>
        </li>
      ))}
    </ul>
  );
}
