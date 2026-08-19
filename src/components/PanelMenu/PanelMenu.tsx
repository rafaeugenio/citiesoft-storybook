import { useId, useState, type ReactNode } from 'react';
import './PanelMenu.css';

export interface ItemDoPanelMenu {
  id: string;
  rotulo: string;
  /** Sem href o item vira botão: serve para filtro que não troca de rota. */
  href?: string;
  icone?: ReactNode;
  /** Número exibido à direita; sempre acompanha uma descrição para o leitor de tela. */
  contagem?: number;
  descricaoDaContagem?: string;
  desabilitado?: boolean;
}

export interface SecaoDoPanelMenu {
  id: string;
  rotulo: string;
  icone?: ReactNode;
  itens: ItemDoPanelMenu[];
}

export interface PanelMenuProps {
  /** Nome da navegação; obrigatório porque a página costuma ter mais de um nav. */
  label: string;
  secoes: SecaoDoPanelMenu[];
  /** Id do item corrente, marcado com aria-current="page". */
  ativo?: string;
  /** Seções abertas na primeira renderização. */
  abertasPorPadrao?: string[];
  /**
   * Falso transforma o menu em acordeão: abrir uma seção fecha as demais.
   * O padrão é verdadeiro, que é o que separa este componente da Sidebar.
   */
  multiplos?: boolean;
  /** Nível do título que envolve cada cabeçalho, para respeitar a hierarquia da página. */
  nivelDoTitulo?: 2 | 3 | 4 | 5;
  onSelecionar?: (id: string) => void;
}

const Chevron = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/**
 * PanelMenu — página 6738:52939 do Figma CitieOne.
 *
 * Variantes do arquivo cobertas: `panelmenu-panel` (Expand False/True, Show Item
 * 1/2) e `panelmenu-item` (Show Icon, Icon, Text, Show Submenu Icon, Chevron
 * Icon, State Idle/Hover/Focus). Cor e tipografia vêm dos tokens Citiesoft, não
 * do kit PrimeOne.
 *
 * Não é `role="menu"`: é navegação persistente dentro de painéis e drawers,
 * então a estrutura é `nav` + lista de links, sem roving tabindex.
 */
export function PanelMenu({
  label,
  secoes,
  ativo,
  abertasPorPadrao = [],
  multiplos = true,
  nivelDoTitulo = 3,
  onSelecionar,
}: PanelMenuProps) {
  const prefixo = useId();
  const [abertas, setAbertas] = useState<string[]>(abertasPorPadrao);

  const alternar = (id: string) => {
    setAbertas((atual) => {
      if (atual.includes(id)) return atual.filter((aberta) => aberta !== id);
      return multiplos ? [...atual, id] : [id];
    });
  };

  const Titulo = `h${nivelDoTitulo}` as 'h2' | 'h3' | 'h4' | 'h5';

  return (
    <nav className="citie-panelmenu" aria-label={label}>
      {secoes.map((secao) => {
        const aberta = abertas.includes(secao.id);
        const idDoBotao = `${prefixo}-cabecalho-${secao.id}`;
        const idDoPainel = `${prefixo}-painel-${secao.id}`;

        return (
          <div
            key={secao.id}
            className={`citie-panelmenu__secao${aberta ? ' citie-panelmenu__secao--aberta' : ''}`}
          >
            <Titulo className="citie-panelmenu__titulo">
              <button
                type="button"
                id={idDoBotao}
                className="citie-panelmenu__cabecalho"
                aria-expanded={aberta}
                aria-controls={idDoPainel}
                onClick={() => alternar(secao.id)}
              >
                <span
                  className={`citie-panelmenu__chevron${
                    aberta ? ' citie-panelmenu__chevron--aberto' : ''
                  }`}
                  aria-hidden="true"
                >
                  <Chevron />
                </span>
                {secao.icone ? (
                  <span className="citie-panelmenu__icone" aria-hidden="true">
                    {secao.icone}
                  </span>
                ) : null}
                <span className="citie-panelmenu__rotulo">{secao.rotulo}</span>
              </button>
            </Titulo>

            {/* `hidden` mantém o painel fora da ordem de foco quando fechado, sem
                desmontar, para que aria-controls sempre aponte para um elemento real. */}
            <div
              id={idDoPainel}
              role="region"
              aria-labelledby={idDoBotao}
              className="citie-panelmenu__painel"
              hidden={!aberta}
            >
              <ul className="citie-panelmenu__lista">
                {secao.itens.map((item) => {
                  const selecionado = item.id === ativo;
                  const classe = `citie-panelmenu__item${
                    selecionado ? ' citie-panelmenu__item--ativo' : ''
                  }`;

                  const conteudo = (
                    <>
                      {item.icone ? (
                        <span className="citie-panelmenu__icone" aria-hidden="true">
                          {item.icone}
                        </span>
                      ) : null}
                      <span className="citie-panelmenu__rotulo">{item.rotulo}</span>
                      {selecionado ? (
                        <span className="citie-visualmente-oculto">(página atual)</span>
                      ) : null}
                      {typeof item.contagem === 'number' ? (
                        <span className="citie-panelmenu__contagem">
                          {item.contagem}
                          <span className="citie-visualmente-oculto">
                            {` ${item.descricaoDaContagem ?? 'registros'}`}
                          </span>
                        </span>
                      ) : null}
                    </>
                  );

                  return (
                    <li key={item.id}>
                      {item.href && !item.desabilitado ? (
                        <a
                          href={item.href}
                          className={classe}
                          aria-current={selecionado ? 'page' : undefined}
                          onClick={() => onSelecionar?.(item.id)}
                        >
                          {conteudo}
                        </a>
                      ) : (
                        <button
                          type="button"
                          className={classe}
                          aria-current={selecionado ? 'page' : undefined}
                          disabled={item.desabilitado}
                          onClick={() => onSelecionar?.(item.id)}
                        >
                          {conteudo}
                        </button>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
