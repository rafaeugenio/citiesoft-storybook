import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import './SkeletonParagrafo.css';

export interface SkeletonParagrafoProps {
  linhas?: number;
}

/**
 * Bloco de texto em carregamento (skeleton-loading.md). A última linha usa
 * largura reduzida (60 a 70%) para verossimilhança. Embrulhe sempre em
 * `SkeletonRegion` com um rótulo específico do módulo.
 */
export function SkeletonParagrafo({ linhas = 3 }: SkeletonParagrafoProps) {
  return (
    <div className="citie-skeleton-paragrafo">
      {Array.from({ length: linhas }, (_, indice) => (
        <Skeleton key={indice} forma="linha" width={indice === linhas - 1 ? '65%' : '100%'} />
      ))}
    </div>
  );
}
