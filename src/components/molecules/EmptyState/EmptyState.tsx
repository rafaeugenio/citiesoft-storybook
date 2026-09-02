import { useEffect, useRef, type ReactNode } from 'react';
import { Button } from '../../atoms/Button/Button';
import './EmptyState.css';

export type SituacaoVazia = 'primeiro-uso' | 'busca-sem-resultado' | 'erro' | 'permissao';

/**
 * O desenho do estado vazio mostra o objeto que falta, nunca um glifo genérico.
 *
 * - `tabela`, `formulario`, `cards` e `grafico` são fantasmas estruturais: a
 *   anatomia real do conteúdo, esmaecida, montada com os tokens de superfície.
 *   Eles ensinam que estrutura vai aparecer ali quando houver dado.
 * - `simbolo` fica para as situações em que não existe objeto a mostrar (busca
 *   sem correspondência, falha de carga, falta de permissão), e aí o símbolo é
 *   específico da situação, no peso de traço do sistema.
 * - `nenhuma` serve ao widget minúsculo em que qualquer desenho viraria ruído.
 */
export type IlustracaoVazia = 'tabela' | 'formulario' | 'cards' | 'grafico' | 'simbolo' | 'nenhuma';

export interface EmptyStateProps {
  /** Explica a causa com o vocabulário do domínio, nunca "Sem dados". */
  titulo: string;
  descricao: string;
  situacao?: SituacaoVazia;
  /**
   * Sem valor explícito, `primeiro-uso` desenha o fantasma de tabela (a maioria
   * das coleções deste produto é listagem) e as demais situações desenham o
   * símbolo específico delas. Passe `formulario`, `cards` ou `grafico` quando o
   * conteúdo ausente tiver outra anatomia.
   */
  ilustracao?: IlustracaoVazia;
  size?: 'sm' | 'md' | 'lg';
  /**
   * `centro` para estado vazio de página inteira ou região larga. `inicio`
   * para dentro de card estreito ou coluna, onde o eixo centrado briga com o
   * alinhamento à esquerda de todo o resto da tela.
   */
  alinhamento?: 'centro' | 'inicio';
  /**
   * Moldura do bloco, as quatro variantes do Empty do UI Kit. `nenhuma`
   * (padrão) quando o vazio ocupa a região inteira e o contêiner em volta já
   * é o card ou a tabela. `contorno` quando o vazio precisa de limite próprio
   * numa página sem card. `preenchida` para recuar o bloco do fundo branco de
   * um cartão. `tracejada` para lugar ainda por preencher: área de soltar
   * arquivo, primeiro item de uma coleção.
   */
  moldura?: 'nenhuma' | 'contorno' | 'preenchida' | 'tracejada';
  /** No máximo duas ações visíveis. */
  acaoPrimaria?: { rotulo: string; onClick?: () => void };
  acaoSecundaria?: { rotulo: string; onClick?: () => void };
  /**
   * Caminho de ajuda, discreto abaixo das ações: aprender a fazer é diferente
   * de fazer, e o estado vazio de primeiro uso é onde a dúvida mora.
   */
  ajuda?: { rotulo: string; href?: string; onClick?: () => void };
  /** Código técnico, discreto abaixo da descrição. */
  codigoErro?: string;
  /** Filtros aplicados exibidos como chips, para reforçar a causa. */
  filtrosAplicados?: ReactNode;
}

const LARGURAS_DE_COLUNA = ['32%', '24%', '26%', '14%'] as const;

/**
 * Fantasma de tabela: cabeçalho mais firme e três linhas de célula que
 * esmaecem para baixo, com as proporções de coluna desiguais de uma listagem
 * real. Desenho puramente decorativo: estático e escondido do leitor de tela.
 */
function FantasmaTabela() {
  return (
    <div className="citie-empty__fantasma citie-empty__fantasma--tabela" data-fantasma="tabela" aria-hidden="true">
      <div className="citie-empty__fantasma-cabecalho">
        {LARGURAS_DE_COLUNA.map((largura, indice) => (
          <span key={indice} className="citie-empty__fantasma-celula" style={{ width: largura }} />
        ))}
      </div>
      {[0, 1, 2].map((linha) => (
        <div key={linha} className="citie-empty__fantasma-linha">
          {LARGURAS_DE_COLUNA.map((largura, indice) => (
            <span
              key={indice}
              className="citie-empty__fantasma-celula"
              style={{ width: largura }}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

/** Fantasma de formulário: pares rótulo + campo, o segundo já esmaecendo. */
function FantasmaFormulario() {
  return (
    <div className="citie-empty__fantasma citie-empty__fantasma--formulario" data-fantasma="formulario" aria-hidden="true">
      {['46%', '34%'].map((larguraDoRotulo, indice) => (
        <div key={indice} className="citie-empty__fantasma-grupo">
          <span className="citie-empty__fantasma-rotulo" style={{ width: larguraDoRotulo }} />
          <span className="citie-empty__fantasma-campo" />
        </div>
      ))}
    </div>
  );
}

/** Fantasma de grade: três cards com título e linha de apoio, esmaecendo. */
function FantasmaCards() {
  return (
    <div className="citie-empty__fantasma citie-empty__fantasma--cards" data-fantasma="cards" aria-hidden="true">
      {[0, 1, 2].map((indice) => (
        <div key={indice} className="citie-empty__fantasma-card">
          <span className="citie-empty__fantasma-rotulo" style={{ width: '70%' }} />
          <span className="citie-empty__fantasma-rotulo" style={{ width: '45%' }} />
        </div>
      ))}
    </div>
  );
}

/**
 * Fantasma de gráfico: eixo firme e barras esmaecidas de altura desigual.
 * Extremidade do dado arredondada só no topo, nunca na aresta que encosta no
 * eixo (regra 8 da gramática estrutural).
 */
function FantasmaGrafico() {
  return (
    <div className="citie-empty__fantasma citie-empty__fantasma--grafico" data-fantasma="grafico" aria-hidden="true">
      {['40%', '72%', '55%', '90%', '30%', '64%'].map((altura, indice) => (
        <span key={indice} className="citie-empty__fantasma-barra" style={{ height: altura }} />
      ))}
    </div>
  );
}

/**
 * Símbolos específicos da situação, todos no traço 1.5 do sistema. O glifo de
 * documento genérico foi removido: situação com objeto ausente usa fantasma
 * estrutural, e as três abaixo descrevem eventos sem objeto a desenhar.
 */
function Simbolo({ situacao }: { situacao: SituacaoVazia }) {
  const comum = {
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.5,
    'aria-hidden': true as const,
  };

  if (situacao === 'erro') {
    // Recarga interrompida: o arco de "tentar novamente" aberto, com o ponto de
    // exclamação no centro. Aponta direto para a ação que acompanha o erro.
    return (
      <svg {...comum} data-simbolo="erro">
        <path d="M20 12a8 8 0 1 1-2.34-5.66" strokeLinecap="round" />
        <path d="M17.8 2.8v3.6h3.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M12 8.5v4" strokeLinecap="round" />
        <circle cx="12" cy="15.5" r="0.6" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (situacao === 'permissao') {
    // Cadeado fechado: a coleção existe, o acesso é que não.
    return (
      <svg {...comum} data-simbolo="permissao">
        <rect x="5" y="10.5" width="14" height="9" rx="1.5" />
        <path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" strokeLinecap="round" />
        <path d="M12 14v2" strokeLinecap="round" />
      </svg>
    );
  }

  // Busca sem correspondência: a lupa sobre duas linhas de resultado que não
  // se completaram.
  return (
    <svg {...comum} data-simbolo="busca">
      <path d="M4 6.5h7" strokeLinecap="round" />
      <path d="M4 11h4.5" strokeLinecap="round" />
      <path d="M4 15.5h5" strokeLinecap="round" />
      <circle cx="15" cy="12.5" r="4.5" />
      <path d="m18.3 15.8 2.7 2.7" strokeLinecap="round" />
    </svg>
  );
}

function Ilustracao({ ilustracao, situacao }: { ilustracao: IlustracaoVazia; situacao: SituacaoVazia }) {
  if (ilustracao === 'nenhuma') return null;
  if (ilustracao === 'tabela') return <FantasmaTabela />;
  if (ilustracao === 'formulario') return <FantasmaFormulario />;
  if (ilustracao === 'cards') return <FantasmaCards />;
  if (ilustracao === 'grafico') return <FantasmaGrafico />;
  return (
    <div className="citie-empty__ilustracao">
      <Simbolo situacao={situacao} />
    </div>
  );
}

/**
 * Estado vazio (empty-state.md). A causa muda o desenho, o título e a ação:
 * primeiro uso e busca sem resultado nunca compartilham o mesmo conteúdo.
 * Primeiro uso mostra o objeto que falta em fantasma estrutural; busca, erro e
 * permissão mostram o símbolo específico do evento.
 */
export function EmptyState({
  titulo,
  descricao,
  situacao = 'primeiro-uso',
  ilustracao,
  size = 'lg',
  alinhamento = 'centro',
  moldura = 'nenhuma',
  acaoPrimaria,
  acaoSecundaria,
  ajuda,
  codigoErro,
  filtrosAplicados,
}: EmptyStateProps) {
  const primariaRef = useRef<HTMLDivElement>(null);
  const desenho = ilustracao ?? (situacao === 'primeiro-uso' ? 'tabela' : 'simbolo');

  useEffect(() => {
    // No tamanho lg em página completa, o botão primário recebe foco, e só nas
    // situações em que a página inteira é o destino da atenção (primeiro uso e
    // erro). Vazio causado por filtro nunca rouba o foco: o usuário está com o
    // cursor no controle de filtro que disparou a atualização, muitas vezes em
    // plena digitação.
    if (size === 'lg' && (situacao === 'primeiro-uso' || situacao === 'erro')) {
      primariaRef.current?.querySelector('button')?.focus();
    }
  }, [size, situacao]);

  return (
    <div
      className={[
        'citie-empty',
        `citie-empty--${size}`,
        `citie-empty--${alinhamento}`,
        moldura === 'nenhuma' ? null : `citie-empty--moldura-${moldura}`,
      ]
        .filter(Boolean)
        .join(' ')}
      // Anunciado ao aparecer depois de um carregamento, sem interromper a leitura.
      role="status"
      aria-live="polite"
    >
      {filtrosAplicados ? <div className="citie-empty__filtros">{filtrosAplicados}</div> : null}

      <Ilustracao ilustracao={desenho} situacao={situacao} />

      <h2 className="citie-empty__titulo">{titulo}</h2>
      <p className="citie-empty__descricao">{descricao}</p>
      {codigoErro ? <p className="citie-empty__codigo">{codigoErro}</p> : null}

      {acaoPrimaria || acaoSecundaria ? (
        <div className="citie-empty__acoes" ref={primariaRef}>
          {acaoPrimaria ? (
            <Button variant="primary" onClick={acaoPrimaria.onClick}>
              {acaoPrimaria.rotulo}
            </Button>
          ) : null}
          {acaoSecundaria ? (
            <Button variant="secondary" onClick={acaoSecundaria.onClick}>
              {acaoSecundaria.rotulo}
            </Button>
          ) : null}
        </div>
      ) : null}

      {ajuda ? (
        <p className="citie-empty__ajuda">
          {ajuda.href ? (
            <a href={ajuda.href} onClick={ajuda.onClick}>
              {ajuda.rotulo}
            </a>
          ) : (
            <button type="button" onClick={ajuda.onClick}>
              {ajuda.rotulo}
            </button>
          )}
        </p>
      ) : null}
    </div>
  );
}
