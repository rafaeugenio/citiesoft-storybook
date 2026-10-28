import type { ReactNode } from 'react';
import { Copiar } from './Copiar';
import { Texto } from './Layout';

const BORDA = 'border border-border-button-default';

/** Tabela genérica. Cada célula pode ser texto (com `crases` para código) ou um nó React. */
export function Tabela({ colunas, linhas, larguraMinima = 560 }: { colunas: string[]; linhas: ReactNode[][]; larguraMinima?: number }) {
  return (
    <div className={`overflow-x-auto rounded-2xl ${BORDA}`}>
      <table className="w-full border-collapse text-body-regular" style={{ minWidth: larguraMinima }}>
        <thead>
          <tr className="border-b border-border-button-default bg-background-secondary-default text-caption-1-semibold text-text-secondary">
            {colunas.map((c) => (
              <th key={c} scope="col" className="px-3 py-2 text-start font-semibold">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {linhas.map((l, i) => (
            <tr key={i} className="border-b border-border-button-default align-top last:border-b-0">
              {l.map((c, j) => (
                <td key={j} className={`px-3 py-2.5 ${j === 0 ? 'text-body-medium text-text-primary' : 'text-text-secondary'}`}>
                  <Texto>{c}</Texto>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Grade de cartões com título e texto curto. `rotulo` aparece pequeno acima do título. */
export function Cartoes({ itens, colunas = 3 }: { itens: { titulo: string; texto: ReactNode; rotulo?: string }[]; colunas?: 2 | 3 | 4 }) {
  const grade = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-2 xl:grid-cols-3', 4: 'md:grid-cols-2 xl:grid-cols-4' }[colunas];
  return (
    <ul className={`grid gap-3 ${grade}`}>
      {itens.map((c) => (
        <li key={c.titulo} className={`rounded-2xl p-4 ${BORDA}`}>
          {c.rotulo ? <p className="text-caption-2-semibold uppercase tracking-wide text-text-secondary">{c.rotulo}</p> : null}
          <h3 className="text-body-medium text-text-primary">{c.titulo}</h3>
          <p className="mt-1 text-caption-1-medium text-text-secondary"><Texto>{c.texto}</Texto></p>
        </li>
      ))}
    </ul>
  );
}

/** Pares de prática certa e errada, lado a lado. */
export function CertoErrado({ itens }: { itens: { certo: ReactNode; errado: ReactNode; motivo?: ReactNode }[] }) {
  return (
    <div className="flex flex-col gap-3">
      {itens.map((p, i) => (
        <div key={i} className="grid gap-3 md:grid-cols-2">
          <div className={`rounded-2xl bg-background-secondary-default p-4 ${BORDA}`}>
            <p className="text-caption-1-semibold text-text-primary">Faça</p>
            <p className="mt-1 text-body-regular text-text-primary"><Texto>{p.certo}</Texto></p>
          </div>
          <div className={`rounded-2xl p-4 ${BORDA}`}>
            <p className="text-caption-1-semibold text-text-error-primary">Evite</p>
            <p className="mt-1 text-body-regular text-text-secondary"><Texto>{p.errado}</Texto></p>
            {p.motivo ? <p className="mt-2 text-caption-1-medium text-text-secondary"><Texto>{p.motivo}</Texto></p> : null}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Faixa de cores: nome, hex copiável e uso. Os valores vêm do texto de origem, em hex. */
export function Paleta({ cores }: { cores: { nome: string; hex: string; uso?: string }[] }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-3">
      {cores.map((c) => (
        <Copiar key={c.nome + c.hex} texto={c.hex} className="flex flex-col gap-2">
          <span className={`h-16 w-full rounded-xl ${BORDA}`} style={{ background: c.hex }} />
          <span className="text-caption-1-semibold text-text-primary">{c.nome}</span>
          <span className="font-mono text-caption-2-medium text-text-secondary">{c.hex}</span>
          {c.uso ? <span className="text-caption-2-medium text-text-secondary">{c.uso}</span> : null}
        </Copiar>
      ))}
    </div>
  );
}

/** Lista numerada de passos curtos. */
export function Passos({ itens }: { itens: { titulo: string; texto?: ReactNode }[] }) {
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {itens.map((p, i) => (
        <li key={p.titulo} className={`rounded-2xl p-4 ${BORDA}`}>
          <p className="text-caption-1-semibold text-text-secondary">Passo {i + 1}</p>
          <h3 className="text-body-medium text-text-primary">{p.titulo}</h3>
          {p.texto ? <p className="mt-1 text-caption-1-medium text-text-secondary"><Texto>{p.texto}</Texto></p> : null}
        </li>
      ))}
    </ol>
  );
}

/** Imagem de logo ou ilustração sobre um fundo escolhido, com legenda. */
export function Amostra({ src, legenda, fundo = 'branco', altura = 96 }: { src: string; legenda: string; fundo?: 'branco' | 'azul' | 'escuro' | 'cinza'; altura?: number }) {
  const bg = { branco: '#ffffff', azul: '#1261E4', escuro: '#141414', cinza: '#F4F5F7' }[fundo];
  return (
    <figure className={`overflow-hidden rounded-2xl ${BORDA}`}>
      <div className="flex items-center justify-center p-6" style={{ background: bg, minHeight: altura + 48 }}>
        <img src={src} alt={legenda} style={{ maxHeight: altura, maxWidth: '100%' }} />
      </div>
      <figcaption className="border-t border-border-button-default px-3 py-2 text-caption-1-medium text-text-secondary">{legenda}</figcaption>
    </figure>
  );
}
