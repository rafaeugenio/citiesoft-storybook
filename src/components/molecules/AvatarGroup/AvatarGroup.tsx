import { Avatar, type TamanhoAvatar } from '../../atoms/Avatar/Avatar';
import './AvatarGroup.css';

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
