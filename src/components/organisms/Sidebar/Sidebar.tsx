import { useState, type ReactNode } from 'react';
import './Sidebar.css';

export interface ItemDoMenu {
  id: string;
  rotulo: string;
  icone?: ReactNode;
  contagem?: number;
  filhos?: { id: string; rotulo: string }[];
}

export interface SecaoDoMenu {
  rotulo: string;
  itens: ItemDoMenu[];
}

export interface SidebarProps {
  secoes: SecaoDoMenu[];
  ativo: string;
  colapsada?: boolean;
  /**
   * `drawer` é a navegação original, barra fina com borda de estado ativo.
   * `fixa` é a navegação de shell do kit (medida no Sismental): 257px, fundo
   * `sidebar`, item de 32 em `sidebar-accent`.
   */
  variante?: 'drawer' | 'fixa';
  /** Cartão de contexto no topo da variante fixa: unidade, cliente ou escopo ativo. */
  cabecalho?: ReactNode;
  /** Item ancorado no rodapé da variante fixa, por exemplo "Sair". */
  rodape?: ReactNode;
}

/**
 * Menu principal (navigation-sidebar-header.md).
 * Item sem permissão nunca é renderizado, para não expor a existência de
 * funcionalidade não autorizada. Colapso é sempre ação explícita.
 */
export function Sidebar({
  secoes,
  ativo,
  colapsada = false,
  variante = 'drawer',
  cabecalho,
  rodape,
}: SidebarProps) {
  const [expandidos, setExpandidos] = useState<string[]>([]);

  return (
    <nav
      className={`citie-sidebar citie-sidebar--${variante}${
        colapsada ? ' citie-sidebar--colapsada' : ''
      }`}
      aria-label="Menu principal"
    >
      <a className="citie-sidebar__skip" href="#conteudo">
        Pular para o conteúdo
      </a>

      {variante === 'fixa' && cabecalho ? (
        <div className="citie-sidebar__cabecalho">{cabecalho}</div>
      ) : null}

      {secoes.map((secao) => (
        <div key={secao.rotulo} className="citie-sidebar__secao">
          {!colapsada ? <p className="citie-sidebar__categoria">{secao.rotulo}</p> : null}
          <ul className="citie-sidebar__lista">
            {secao.itens.map((item) => {
              const selecionado = item.id === ativo;
              const aberto = expandidos.includes(item.id);

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`citie-sidebar__item${
                      selecionado ? ' citie-sidebar__item--ativo' : ''
                    }`}
                    aria-current={selecionado ? 'page' : undefined}
                    aria-expanded={item.filhos ? aberto : undefined}
                    // Em modo colapsado o ícone sozinho é ambíguo, então o rótulo
                    // sobrevive como nome acessível.
                    aria-label={colapsada ? item.rotulo : undefined}
                    title={colapsada ? item.rotulo : undefined}
                    onClick={() =>
                      item.filhos
                        ? setExpandidos((atual) =>
                            atual.includes(item.id)
                              ? atual.filter((id) => id !== item.id)
                              : [...atual, item.id],
                          )
                        : undefined
                    }
                  >
                    {item.icone ? (
                      <span className="citie-sidebar__icone" aria-hidden="true">
                        {item.icone}
                      </span>
                    ) : null}
                    {!colapsada ? <span className="citie-sidebar__rotulo">{item.rotulo}</span> : null}
                    {!colapsada && item.contagem ? (
                      <span className="citie-sidebar__contagem">{item.contagem}</span>
                    ) : null}
                    {!colapsada && item.filhos ? (
                      <span
                        className={`citie-sidebar__seta${aberto ? ' citie-sidebar__seta--aberta' : ''}`}
                        aria-hidden="true"
                      >
                        ›
                      </span>
                    ) : null}
                  </button>

                  {item.filhos && aberto && !colapsada ? (
                    <ul className="citie-sidebar__sublista">
                      {item.filhos.map((filho) => (
                        <li key={filho.id}>
                          <button type="button" className="citie-sidebar__subitem">
                            {filho.rotulo}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      {variante === 'fixa' && rodape ? (
        <div className="citie-sidebar__rodape">{rodape}</div>
      ) : null}
    </nav>
  );
}
