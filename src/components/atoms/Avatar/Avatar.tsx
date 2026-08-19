import { useState, type ReactNode } from 'react';
import type { Severidade } from '../../atoms/Badge/Badge';
import '../../atoms/Badge/Badge.css';
import './Avatar.css';

export type TamanhoAvatar = 'normal' | 'large' | 'x-large';

/** Paleta de fallback: pares fundo -50 / texto -700 do mapa de severidade. */
const PALETA: Severidade[] = ['primary', 'success', 'warn', 'danger', 'info', 'secondary'];

/**
 * Cor determinística por hash do nome: o mesmo servidor aparece sempre com a
 * mesma cor em qualquer tela do sistema.
 */
export function corDoNome(nome: string): Severidade {
  let hash = 0;
  for (const caractere of nome) hash = (hash * 31 + caractere.codePointAt(0)!) >>> 0;
  return PALETA[hash % PALETA.length];
}

// Preposições não entram nas iniciais.
const PREPOSICOES = ['de', 'da', 'do', 'das', 'dos', 'e'];

/** Duas letras, do primeiro e do último nome ("Maria de Fátima Souza" vira "MS"). */
export function iniciaisDoNome(nome: string): string {
  const partes = nome
    .trim()
    .split(/\s+/)
    .filter((parte) => parte.length > 0 && !PREPOSICOES.includes(parte.toLowerCase()));

  if (partes.length === 0) return '';

  const primeira = partes[0][0] ?? '';
  const ultima = partes.length > 1 ? (partes[partes.length - 1][0] ?? '') : '';
  return (primeira + ultima).toUpperCase();
}

export interface AvatarProps {
  /** Nome completo. Alimenta iniciais, cor determinística e nome acessível. */
  nome: string;
  src?: string;
  /** Circular para pessoas, quadrado arredondado para órgãos e integrações. */
  shape?: 'circle' | 'square';
  size?: TamanhoAvatar;
  /** Ação nomeada quando o avatar é clicável ("Ver perfil de Maria"). */
  onClick?: () => void;
  /**
   * Descrição da entidade, usada como nome acessível quando não há nome próprio
   * (fallback de ícone genérico). Sem ela o avatar ficaria sem nome acessível.
   */
  descricao?: string;
  /** Decorativo: o nome já aparece em texto ao lado, então o nome acessível fica vazio. */
  decorative?: boolean;
  loading?: boolean;
  disabled?: boolean;
  /** Composição com Badge (variante dot), nunca propriedade nativa do Avatar. */
  badge?: ReactNode;
}

export function Avatar({
  nome,
  src,
  shape = 'circle',
  size = 'normal',
  onClick,
  descricao,
  decorative = false,
  loading = false,
  disabled = false,
  badge,
}: AvatarProps) {
  const [imagemFalhou, setImagemFalhou] = useState(false);
  const iniciais = iniciaisDoNome(nome);
  const severidade = corDoNome(nome);

  const classes = [
    'citie-avatar',
    `citie-avatar--${size}`,
    `citie-avatar--${shape}`,
    'citie-sev',
    `citie-sev--${severidade}`,
    disabled ? 'citie-avatar--disabled' : null,
  ]
    .filter(Boolean)
    .join(' ');

  if (loading) {
    return (
      <span
        className={`citie-avatar citie-avatar--${size} citie-avatar--${shape} citie-avatar--loading`}
        role="status"
        aria-label={`Carregando ${nome}`}
      />
    );
  }

  // Fallback em cadeia: imagem → iniciais → ícone genérico.
  const conteudo =
    src && !imagemFalhou ? (
      <img
        className="citie-avatar__imagem"
        src={src}
        alt=""
        onError={() => setImagemFalhou(true)}
      />
    ) : iniciais ? (
      <span aria-hidden="true">{iniciais}</span>
    ) : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21c0-4 3.6-6 8-6s8 2 8 6" strokeLinecap="round" />
      </svg>
    );

  const identificacao = nome || descricao;
  const nomeAcessivel = decorative
    ? undefined
    : onClick
      ? `Ver perfil de ${identificacao}`
      : src && !imagemFalhou
        ? `Foto de ${identificacao}`
        : identificacao;

  const corpo = onClick ? (
    <button type="button" className={classes} onClick={onClick} disabled={disabled} aria-label={nomeAcessivel}>
      {conteudo}
    </button>
  ) : (
    <span className={classes} role={decorative ? undefined : 'img'} aria-label={nomeAcessivel}>
      {conteudo}
    </span>
  );

  if (!badge) return corpo;

  return (
    <span className="citie-avatar-anchor">
      {corpo}
      <span className="citie-avatar-anchor__badge">{badge}</span>
    </span>
  );
}

export interface AvatarGroupProps {
  /** Até 4 avatares empilhados; o excedente vira contador "+N". */
  pessoas: { nome: string; src?: string }[];
  size?: TamanhoAvatar;
  max?: number;
  onOverflowClick?: () => void;
}

export function AvatarGroup({ pessoas, size = 'normal', max = 4, onOverflowClick }: AvatarGroupProps) {
  const visiveis = pessoas.slice(0, max);
  const excedente = pessoas.length - visiveis.length;

  return (
    <span className="citie-avatar-group">
      {visiveis.map((pessoa) => (
        <Avatar key={pessoa.nome} nome={pessoa.nome} src={pessoa.src} size={size} />
      ))}
      {excedente > 0 ? (
        <button
          type="button"
          className={`citie-avatar citie-avatar--${size} citie-avatar--circle citie-avatar--overflow`}
          aria-label={`e mais ${excedente} responsáveis`}
          onClick={onOverflowClick}
        >
          +{excedente}
        </button>
      ) : null}
    </span>
  );
}
