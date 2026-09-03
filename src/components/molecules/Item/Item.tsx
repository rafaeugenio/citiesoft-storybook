import type { ReactNode } from 'react';
import { Avatar } from '../../atoms/Avatar/Avatar';
import { AvatarGroup } from '../AvatarGroup/AvatarGroup';
import './Item.css';

/**
 * Item: linha de lista rica, a peça que o kit chama de "Item" e que aqui
 * reaproveita a anatomia de duas peças já existentes no catálogo, porque o
 * kit não mede uma anatomia própria para ela.
 *
 * A caixa de mídia em ícone usa a mesma medida do ícone de hub do Card
 * (`--citie-hub-caixa-de-icone` 36, `--citie-hub-raio-da-caixa` 8, fundo
 * accent, ícone na tinta de marca, Lote 3); avatar, imagem e pilha de
 * avatares reaproveitam `Avatar` e `AvatarGroup` já publicados. O Item não
 * é indivisível (compõe Avatar, AvatarGroup e Badge por slot), mas resolve
 * uma tarefa única, o que a `classificacao.json` já define como molécula.
 */

export type MidiaDoItem =
  | { tipo: 'icone'; icone: ReactNode }
  | { tipo: 'avatar'; nome: string; src?: string }
  | { tipo: 'imagem'; src: string; alt: string }
  | { tipo: 'pilha'; pessoas: { nome: string; src?: string }[] };

export type VarianteItem = 'default' | 'outline' | 'muted';
export type TamanhoItem = 'default' | 'small';

export interface ItemProps {
  midia?: MidiaDoItem;
  /** Verbo ou substantivo que nomeia a linha ("Relatório de ocupação, março"). */
  titulo: string;
  descricao?: string;
  /** Composição com `Badge`, nunca cor literal. */
  rotulo?: ReactNode;
  /** Ícone, `Button` ou botão de ícone à direita. */
  acao?: ReactNode;
  variante?: VarianteItem;
  tamanho?: TamanhoItem;
  /** Torna a linha inteira acionável: hover em `accent`, papel de botão. */
  aoSelecionar?: () => void;
  desabilitado?: boolean;
  /** `id` do `role="option"` quando o Item vive dentro de uma listbox (Command). */
  id?: string;
  /** Realce de teclado quando o Item vive dentro de uma listbox (Command). */
  realcado?: boolean;
}

function Midia({ midia, tamanho }: { midia: MidiaDoItem; tamanho: TamanhoItem }) {
  const tamanhoAvatar = tamanho === 'small' ? 'normal' : 'large';

  if (midia.tipo === 'icone') {
    return (
      <span className="citie-item__icone" aria-hidden="true">
        {midia.icone}
      </span>
    );
  }

  if (midia.tipo === 'avatar') {
    return <Avatar nome={midia.nome} src={midia.src} size={tamanhoAvatar} decorative />;
  }

  if (midia.tipo === 'imagem') {
    return <img className="citie-item__imagem" src={midia.src} alt={midia.alt} />;
  }

  return <AvatarGroup pessoas={midia.pessoas} size={tamanhoAvatar} max={3} />;
}

export function Item({
  midia,
  titulo,
  descricao,
  rotulo,
  acao,
  variante = 'default',
  tamanho = 'default',
  aoSelecionar,
  desabilitado = false,
  id,
  realcado = false,
}: ItemProps) {
  // O papel de botão se mantém mesmo desabilitado: a linha continua anunciada
  // como controle, só que indisponível, em vez de colapsar para texto estático.
  const interativo = Boolean(aoSelecionar);

  const classes = [
    'citie-item',
    `citie-item--${variante}`,
    `citie-item--${tamanho}`,
    interativo ? 'citie-item--interativo' : null,
    realcado ? 'citie-item--realcado' : null,
    desabilitado ? 'citie-item--desabilitado' : null,
  ]
    .filter(Boolean)
    .join(' ');

  const conteudo = (
    <>
      {midia ? <Midia midia={midia} tamanho={tamanho} /> : null}
      <span className="citie-item__corpo">
        <span className="citie-item__linha-titulo">
          <span className="citie-item__titulo">{titulo}</span>
          {rotulo ? <span className="citie-item__rotulo">{rotulo}</span> : null}
        </span>
        {descricao ? <span className="citie-item__descricao">{descricao}</span> : null}
      </span>
      {acao ? (
        <span className="citie-item__acao" onClick={(evento) => evento.stopPropagation()}>
          {acao}
        </span>
      ) : null}
    </>
  );

  if (interativo) {
    return (
      <button
        type="button"
        id={id}
        className={classes}
        disabled={desabilitado}
        onClick={aoSelecionar}
      >
        {conteudo}
      </button>
    );
  }

  return (
    <div id={id} className={classes}>
      {conteudo}
    </div>
  );
}
