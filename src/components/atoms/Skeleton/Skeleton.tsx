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
