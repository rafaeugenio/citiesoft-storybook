import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import * as Icones from '@remixicon/react';
import type { RemixiconComponentType } from '@remixicon/react';
import catalogo from '../../tokens/remixicon.json';
import { Copiar } from './Copiar';

type Item = { nome: string; componente: string; categoria: string; estilo: 'line' | 'fill' | 'unico' };
type Estilo = 'todos' | 'line' | 'fill';

const TODOS: Item[] = catalogo.icones as Item[];
const POR_PARTE = 240;
const TAMANHOS = [16, 20, 24, 32];
const componentes = Icones as unknown as Record<string, RemixiconComponentType | undefined>;
const urlSvg = (i: Item) => `icons/svg/${encodeURIComponent(i.categoria)}/${i.nome}.svg`;

const campo = 'rounded-lg border border-border-button-default bg-background-primary-default px-3 py-2 text-body-regular text-text-primary outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring';

/** Ícone pelo componente do pacote; cai para o SVG do arquivo quando o pacote não exporta. */
function Glifo({ item, tamanho }: { item: Item; tamanho: number }) {
  const Componente = componentes[item.componente];
  if (Componente) return <Componente style={{ width: tamanho, height: tamanho }} aria-hidden />;
  return <img src={urlSvg(item)} width={tamanho} height={tamanho} alt="" />;
}

function Painel({ item, onFechar }: { item: Item; onFechar: () => void }) {
  const [svg, setSvg] = useState('');
  useEffect(() => {
    let ativo = true;
    fetch(urlSvg(item))
      .then((r) => (r.ok ? r.text() : ''))
      .then((t) => ativo && setSvg(t))
      .catch(() => ativo && setSvg(''));
    return () => {
      ativo = false;
    };
  }, [item]);

  const botao = 'w-full rounded-lg border border-border-button-default px-3 py-2 text-caption-1-semibold text-text-primary hover:bg-background-secondary-default';
  return (
    <aside aria-label={`Detalhes de ${item.nome}`} className="rounded-2xl border border-border-button-default bg-background-secondary-default p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-all font-mono text-body-medium text-text-primary">{item.nome}</h3>
          <p className="text-caption-1-medium text-text-secondary">{item.categoria}</p>
        </div>
        <button type="button" onClick={onFechar} aria-label="Fechar detalhes" className="cursor-pointer rounded-lg border border-border-button-default px-3 py-1.5 text-caption-1-semibold text-text-primary outline-none hover:bg-background-primary-hover focus-visible:ring-2 focus-visible:ring-border-focus-ring">
          Fechar
        </button>
      </div>
      <div className="mt-4 flex flex-wrap items-end gap-6 rounded-xl bg-background-primary-default p-4 text-foreground-icon-primary">
        {TAMANHOS.map((t) => (
          <figure key={t} className="m-0 flex flex-col items-center gap-2">
            <Glifo item={item} tamanho={t} />
            <figcaption className="font-mono text-caption-2-medium text-text-secondary">{t}px</figcaption>
          </figure>
        ))}
      </div>
      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4 [&_button]:w-full">
        <Copiar texto={`import { ${item.componente} } from '@remixicon/react';\n\n<${item.componente} />`} className={`${botao} text-center`}>Copiar JSX React</Copiar>
        <Copiar texto={`<i class="ri-${item.nome}"></i>`} className={`${botao} text-center`}>Copiar classe webfont</Copiar>
        <Copiar texto={svg} className={`${botao} text-center ${svg ? '' : 'pointer-events-none opacity-50'}`}>Copiar SVG inline</Copiar>
        <a href={urlSvg(item)} download={`${item.nome}.svg`} className={`${botao} block text-center outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring`}>Baixar SVG</a>
      </div>
      <p className="mt-3 break-all font-mono text-caption-2-medium text-text-secondary">{item.componente} · ri-{item.nome}</p>
    </aside>
  );
}

/** Catálogo completo do Remix Icon com busca, filtros e renderização por partes. */
export function CatalogoDeIcones() {
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [estilo, setEstilo] = useState<Estilo>('todos');
  const [parte, setParte] = useState({ chave: '', limite: POR_PARTE });
  const [aberto, setAberto] = useState<Item | null>(null);
  const termo = useDeferredValue(busca.trim().toLowerCase());

  const filtrados = useMemo(
    () =>
      TODOS.filter(
        (i) =>
          (!categoria || i.categoria === categoria) &&
          (estilo === 'todos' || i.estilo === estilo) &&
          (!termo || i.nome.includes(termo.replace(/\s+/g, '-'))),
      ),
    [termo, categoria, estilo],
  );
  const chave = `${termo}|${categoria}|${estilo}`;
  const limite = parte.chave === chave ? parte.limite : POR_PARTE;
  const visiveis = filtrados.slice(0, limite);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="flex min-w-[220px] flex-1 flex-col gap-1 text-caption-1-semibold text-text-secondary">
          Buscar por nome
          <input type="search" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="arrow, user, calendar" className={campo} />
        </label>
        <label className="flex flex-col gap-1 text-caption-1-semibold text-text-secondary">
          Categoria
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className={campo}>
            <option value="">Todas</option>
            {catalogo.categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>
        <div role="group" aria-label="Estilo" className="flex gap-1 rounded-xl border border-border-button-default p-1">
          {([['todos', 'Todos'], ['line', 'Line'], ['fill', 'Fill']] as const).map(([v, r]) => (
            <button
              key={v}
              type="button"
              aria-pressed={estilo === v}
              onClick={() => setEstilo(v)}
              className={`cursor-pointer rounded-lg px-3 py-1.5 text-caption-1-semibold outline-none focus-visible:ring-2 focus-visible:ring-border-focus-ring ${
                estilo === v ? 'bg-background-primary-default text-text-primary shadow-xs' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <p className="text-caption-1-medium text-text-secondary" role="status" aria-live="polite">
        {filtrados.length} de {catalogo.total} ícones
      </p>

      {aberto ? <Painel key={aberto.nome} item={aberto} onFechar={() => setAberto(null)} /> : null}

      {filtrados.length === 0 ? (
        <p className="rounded-2xl border border-border-button-default p-6 text-center text-body-regular text-text-secondary">Nenhum ícone encontrado.</p>
      ) : (
        <ul className="m-0 grid list-none grid-cols-[repeat(auto-fill,minmax(112px,1fr))] gap-2 p-0">
          {visiveis.map((i) => (
            <li key={`${i.categoria}/${i.nome}`}>
              <button
                type="button"
                onClick={() => setAberto(i)}
                aria-label={`Ver detalhes de ${i.nome}`}
                aria-pressed={aberto?.nome === i.nome && aberto.categoria === i.categoria}
                className="flex h-full w-full cursor-pointer flex-col items-center gap-2 rounded-2xl border border-border-button-default bg-background-primary-default p-3 text-text-primary outline-none hover:bg-background-secondary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring aria-pressed:bg-background-secondary-default"
              >
                <span className="text-foreground-icon-primary"><Glifo item={i} tamanho={24} /></span>
                <span className="break-all text-center font-mono text-caption-2-medium">{i.nome}</span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {limite < filtrados.length ? (
        <div className="text-center">
          <button type="button" onClick={() => setParte({ chave, limite: limite + POR_PARTE })} className="cursor-pointer rounded-lg border border-border-button-default px-4 py-2 text-caption-1-semibold text-text-primary outline-none hover:bg-background-secondary-default focus-visible:ring-2 focus-visible:ring-border-focus-ring">
            Mostrar mais ({filtrados.length - limite} restantes)
          </button>
        </div>
      ) : null}

      <p className="text-caption-2-medium text-text-secondary">Remix Icon {catalogo.versao}, licença Apache-2.0.</p>
    </div>
  );
}
