import { useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Kbd } from '../../atoms/Kbd/Kbd';
import { EmptyState } from '../EmptyState/EmptyState';
import './Command.css';

export interface ItemDoCommand {
  valor: string;
  rotulo: string;
  icone?: ReactNode;
  /** Sequência do `Kbd` ("['⌘', 'K']"). */
  atalho?: string[];
  desabilitado?: boolean;
}

export interface GrupoDoCommand {
  rotulo: string;
  itens: ItemDoCommand[];
}

export interface CommandProps {
  /** Nome acessível da paleta ("Paleta de comandos", "Buscar processo"). */
  rotulo: string;
  placeholder?: string;
  grupos: GrupoDoCommand[];
  vazio?: { titulo: string; descricao: string };
  onSelect: (valor: string) => void;
  /** Escape chama isto; quem envolve a paleta num `Dialog` fecha por aqui. */
  onClose?: () => void;
}

/** Compara sem acento e sem caixa: "prontuario" acha "Abrir prontuário". */
function normalizar(texto: string) {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase();
}

/**
 * Command: paleta de comandos do kit.
 *
 * `role="combobox"` no campo de busca com `role="listbox"` sempre visível
 * abaixo, o padrão ARIA de combobox de lista persistente (a lista não é um
 * popup que abre e fecha; ela é o próprio corpo da paleta). O item realçado
 * pelo teclado é anunciado por `aria-activedescendant`, sem mover o foco do
 * DOM para fora do campo, então digitar e navegar continuam no mesmo
 * elemento.
 */
export function Command({
  rotulo,
  placeholder = 'Digite um comando ou busque…',
  grupos,
  vazio,
  onSelect,
  onClose,
}: CommandProps) {
  const [busca, setBusca] = useState('');
  const [indiceRealcado, setIndiceRealcado] = useState(0);
  const idBase = useId();
  const listaId = `${idBase}-lista`;
  const inputRef = useRef<HTMLInputElement>(null);

  const gruposFiltrados = useMemo(() => {
    const termo = normalizar(busca.trim());
    if (!termo) return grupos;
    return grupos
      .map((grupo) => ({
        ...grupo,
        itens: grupo.itens.filter((item) => normalizar(item.rotulo).includes(termo)),
      }))
      .filter((grupo) => grupo.itens.length > 0);
  }, [grupos, busca]);

  const itensAchatados = useMemo(
    () => gruposFiltrados.flatMap((grupo) => grupo.itens),
    [gruposFiltrados],
  );

  const indiceValido = itensAchatados.length
    ? Math.min(indiceRealcado, itensAchatados.length - 1)
    : -1;
  const itemRealcado = indiceValido >= 0 ? itensAchatados[indiceValido] : undefined;

  function irPara(indice: number) {
    setIndiceRealcado(indice);
  }

  function aoTeclar(evento: KeyboardEvent<HTMLInputElement>) {
    const habilitados = itensAchatados
      .map((item, indice) => ({ item, indice }))
      .filter(({ item }) => !item.desabilitado);
    if (habilitados.length === 0) {
      if (evento.key === 'Escape') onClose?.();
      return;
    }

    if (evento.key === 'ArrowDown') {
      evento.preventDefault();
      const posicao = habilitados.findIndex(({ indice }) => indice === indiceValido);
      irPara(habilitados[(posicao + 1) % habilitados.length].indice);
    } else if (evento.key === 'ArrowUp') {
      evento.preventDefault();
      const posicao = habilitados.findIndex(({ indice }) => indice === indiceValido);
      irPara(habilitados[(posicao - 1 + habilitados.length) % habilitados.length].indice);
    } else if (evento.key === 'Home') {
      evento.preventDefault();
      irPara(habilitados[0].indice);
    } else if (evento.key === 'End') {
      evento.preventDefault();
      irPara(habilitados[habilitados.length - 1].indice);
    } else if (evento.key === 'Enter') {
      evento.preventDefault();
      if (itemRealcado && !itemRealcado.desabilitado) onSelect(itemRealcado.valor);
    } else if (evento.key === 'Escape') {
      onClose?.();
    }
  }

  return (
    <div className="citie-command">
      <div className="citie-command__busca">
        <svg
          className="citie-command__lupa"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="6" />
          <path d="m16 16 4 4" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="citie-command__campo"
          role="combobox"
          aria-expanded="true"
          aria-controls={listaId}
          aria-autocomplete="list"
          aria-label={rotulo}
          aria-activedescendant={itemRealcado ? `${idBase}-${itemRealcado.valor}` : undefined}
          placeholder={placeholder}
          value={busca}
          onChange={(evento) => {
            setBusca(evento.target.value);
            setIndiceRealcado(0);
          }}
          onKeyDown={aoTeclar}
        />
      </div>

      {/*
       * `role="listbox"` só aceita `option` (ou grupo de `option`) como filho
       * direto (aria-required-children): o estado vazio vive fora dela, como
       * irmã, para o axe não acusar o `EmptyState` (role="status") dentro de
       * uma listbox sem opção nenhuma.
       */}
      <div className="citie-command__lista" role="listbox" id={listaId} aria-label={rotulo}>
        {itensAchatados.length > 0
          ? gruposFiltrados.map((grupo) => (
            <div
              className="citie-command__grupo"
              key={grupo.rotulo}
              role="group"
              aria-label={grupo.rotulo}
            >
              <div className="citie-command__rotulo-grupo" aria-hidden="true">
                {grupo.rotulo}
              </div>
              {grupo.itens.map((item) => {
                const indiceGlobal = itensAchatados.indexOf(item);
                const realcado = indiceGlobal === indiceValido;
                return (
                  <div
                    key={item.valor}
                    id={`${idBase}-${item.valor}`}
                    role="option"
                    aria-selected={realcado}
                    aria-disabled={item.desabilitado || undefined}
                    className={[
                      'citie-command__item',
                      realcado ? 'citie-command__item--ativo' : null,
                      item.desabilitado ? 'citie-command__item--desabilitado' : null,
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    onMouseEnter={() => {
                      if (!item.desabilitado) irPara(indiceGlobal);
                    }}
                    onClick={() => {
                      if (!item.desabilitado) onSelect(item.valor);
                    }}
                  >
                    {item.icone ? (
                      <span className="citie-command__icone" aria-hidden="true">
                        {item.icone}
                      </span>
                    ) : null}
                    <span className="citie-command__rotulo">{item.rotulo}</span>
                    {item.atalho ? <Kbd teclas={item.atalho} /> : null}
                  </div>
                );
              })}
            </div>
          ))
          : null}
      </div>

      {itensAchatados.length === 0 ? (
        <div className="citie-command__vazio">
          <EmptyState
            size="sm"
            alinhamento="centro"
            ilustracao="simbolo"
            situacao="busca-sem-resultado"
            titulo={vazio?.titulo ?? 'Nenhum resultado'}
            descricao={
              vazio?.descricao ?? `Nenhum comando corresponde a "${busca}". Tente outro termo.`
            }
          />
        </div>
      ) : null}
    </div>
  );
}
