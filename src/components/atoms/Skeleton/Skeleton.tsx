import type { ReactNode } from 'react';
import './Skeleton.css';

export type FormaSkeleton = 'linha' | 'titulo' | 'campo' | 'card' | 'circulo';

export interface SkeletonProps {
  forma?: FormaSkeleton;
  width?: string;
  height?: string;
}

/**
 * Skeleton (skeleton-loading.md). Não tem tamanho próprio: replica a forma e a
 * medida do conteúdo real que vai substituir, para eliminar salto de layout.
 * Nunca recebe foco e nunca exibe texto de carregamento dentro do bloco.
 */
export function Skeleton({ forma = 'linha', width, height }: SkeletonProps) {
  return (
    <span
      className={`citie-skeleton citie-skeleton--${forma}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}

export interface SkeletonRegionProps {
  /** Específico ao módulo: "Carregando lista de processos", nunca genérico. */
  label: string;
  children: ReactNode;
}

/** Container que sinaliza o estado ocupado enquanto o skeleton está visível. */
export function SkeletonRegion({ label, children }: SkeletonRegionProps) {
  return (
    <div className="citie-skeleton-region" role="status" aria-busy="true" aria-label={label}>
      {children}
    </div>
  );
}

export interface SkeletonParagrafoProps {
  linhas?: number;
}

/** A última linha usa largura reduzida para verossimilhança. */
export function SkeletonParagrafo({ linhas = 3 }: SkeletonParagrafoProps) {
  return (
    <div className="citie-skeleton-stack">
      {Array.from({ length: linhas }, (_, indice) => (
        <Skeleton key={indice} forma="linha" width={indice === linhas - 1 ? '65%' : '100%'} />
      ))}
    </div>
  );
}

export interface SkeletonListaProps {
  itens?: number;
}

export function SkeletonLista({ itens = 5 }: SkeletonListaProps) {
  return (
    <div className="citie-skeleton-stack">
      {Array.from({ length: itens }, (_, indice) => (
        <div key={indice} className="citie-skeleton-item">
          <Skeleton forma="circulo" width="28px" height="28px" />
          <div className="citie-skeleton-stack citie-skeleton-stack--flex">
            <Skeleton forma="linha" width="45%" />
            <Skeleton forma="linha" width="70%" />
          </div>
          <Skeleton forma="linha" width="80px" />
        </div>
      ))}
    </div>
  );
}

export interface SkeletonFormularioProps {
  campos?: number;
}

export function SkeletonFormulario({ campos = 3 }: SkeletonFormularioProps) {
  return (
    <div className="citie-skeleton-stack citie-skeleton-stack--largo">
      {Array.from({ length: campos }, (_, indice) => (
        <div key={indice} className="citie-skeleton-stack">
          <Skeleton forma="linha" width="120px" />
          <Skeleton forma="campo" />
        </div>
      ))}
    </div>
  );
}
