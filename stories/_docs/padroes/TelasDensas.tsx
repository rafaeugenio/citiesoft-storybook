import { ListagemTFD } from '../../blocos/_apoio-listagem';
import { Moldura } from './Moldura';

/** Listagem completa em densidade compacta, com filtros expostos, seleção em massa e paginação. */
export function ListagemDensaDemo() {
  return (
    <Moldura legenda="Marque linhas para ver a barra de seleção. A densidade muda a altura da linha sem recarregar.">
      <div className="max-h-[640px] overflow-auto rounded-xl">
        <ListagemTFD densidadeInicial="compacta" posicaoSelecao="container" porPagina={10} />
      </div>
    </Moldura>
  );
}
