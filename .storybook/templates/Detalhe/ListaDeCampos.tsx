import { Tag } from '../../../src';
import './ListaDeCampos.css';

/**
 * Auxiliar de demonstração, não é componente da biblioteca.
 *
 * Exibe pares rótulo/valor em lista de definição. A biblioteca ainda não tem um
 * componente de "descrição de registro" (gap registrado no relatório do
 * template de detalhe), então o par vive aqui, em `.storybook`, e nunca em
 * `src`. O selo de campo imutável usa o `Tag` do sistema.
 */

export interface CampoExibido {
  rotulo: string;
  valor: string;
  /** Campo que não pode ser alterado depois da criação (padrão CRUD). */
  somenteLeitura?: boolean;
}

export function ListaDeCampos({ campos }: { campos: CampoExibido[] }) {
  return (
    <dl className="tpl-detalhe-campos">
      {campos.map((campo) => (
        <div key={campo.rotulo} className="tpl-detalhe-campos__par">
          <dt className="tpl-detalhe-campos__rotulo">{campo.rotulo}</dt>
          <dd className="tpl-detalhe-campos__valor">
            {campo.valor}
            {campo.somenteLeitura ? <Tag label="Somente leitura" size="sm" /> : null}
          </dd>
        </div>
      ))}
    </dl>
  );
}
