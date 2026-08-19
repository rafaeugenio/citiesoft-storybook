import { Skeleton } from '../../atoms/Skeleton/Skeleton';
import './SkeletonFormulario.css';

export interface SkeletonFormularioProps {
  campos?: number;
}

/**
 * Formulário em carregamento (skeleton-loading.md). Repete a dupla rótulo +
 * campo. Embrulhe sempre em `SkeletonRegion` com um rótulo específico do módulo
 * ("Carregando cadastro do colaborador").
 */
export function SkeletonFormulario({ campos = 3 }: SkeletonFormularioProps) {
  return (
    <div className="citie-skeleton-formulario">
      {Array.from({ length: campos }, (_, indice) => (
        <div key={indice} className="citie-skeleton-formulario__campo">
          <Skeleton forma="linha" width="120px" />
          <Skeleton forma="campo" />
        </div>
      ))}
    </div>
  );
}
