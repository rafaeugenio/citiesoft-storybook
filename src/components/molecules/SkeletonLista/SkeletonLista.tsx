import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import './SkeletonLista.css';

export interface SkeletonListaProps {
  itens?: number;
}

/**
 * Lista em carregamento (skeleton-loading.md). Repete a dupla avatar + linhas de
 * cada registro seguindo a anatomia de linha da gramática estrutural: líder de
 * 32px, conteúdo que cresce, trilha que não encolhe, altura mínima de 40px.
 * Skeleton que mente a medida produz salto de layout quando o dado chega.
 * Embrulhe sempre em `SkeletonRegion` com um rótulo específico do módulo
 * ("Carregando lista de processos").
 */
export function SkeletonLista({ itens = 5 }: SkeletonListaProps) {
  return (
    <div className="citie-skeleton-lista">
      {Array.from({ length: itens }, (_, indice) => (
        <div key={indice} className="citie-skeleton-lista__item">
          <Skeleton forma="circulo" width="32px" height="32px" />
          <div className="citie-skeleton-lista__textos">
            <Skeleton forma="linha" width="45%" />
            <Skeleton forma="linha" width="70%" />
          </div>
          <Skeleton forma="linha" width="80px" />
        </div>
      ))}
    </div>
  );
}
