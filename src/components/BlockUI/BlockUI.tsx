import { useEffect, useRef, type ReactNode } from 'react';
import { ProgressBar, Spinner } from '../Progress/Progress';
import './BlockUI.css';

/**
 * BlockUI · página `6738:55108` do Figma CitieOne (equivalente PrimeNG `p-blockUI`).
 *
 * O Figma traz um único desenho: uma máscara escura cobrindo por inteiro o
 * container (lá, um `panel` com header e content), no mesmo raio do container,
 * em Light e Dark. Não há eixos de variante no arquivo.
 *
 * Duas coisas foram acrescentadas por exigência de acessibilidade e da marca:
 *
 * 1. O conteúdo bloqueado recebe `inert`, então sai da ordem de tabulação e da
 *    árvore de acessibilidade. Cobrir visualmente não basta: sem `inert`, quem
 *    navega por teclado continua entrando nos campos por baixo da máscara.
 * 2. A máscara do Figma é vazia. Bloqueio mudo é armadilha, então ela sempre
 *    carrega o indicador de `../Progress/Progress` com uma mensagem que nomeia o
 *    artefato em processamento, num cartão de superfície para o texto manter o
 *    contraste mínimo sobre a máscara nos dois temas.
 */

export type EscopoDoBloqueio = 'regiao' | 'tela';

export interface BlockUIProps {
  /** Conteúdo que fica coberto e inerte enquanto a operação acontece. */
  children: ReactNode;
  bloqueado: boolean;
  /**
   * Nomeia o que está acontecendo e sobre qual artefato. Obrigatória: máscara
   * sem mensagem deixa quem espera sem saber o que espera.
   */
  mensagem: string;
  /**
   * `regiao` cobre só o container envolvido. `tela` estica a máscara pela
   * viewport inteira; a inércia continua valendo apenas para o conteúdo
   * envolvido, então nesse escopo envolva a casca da aplicação.
   */
  escopo?: EscopoDoBloqueio;
  /** Percentual conhecido. Omitido, a máscara usa o spinner indeterminado. */
  valor?: number;
  /** Nome da operação exibido junto do percentual. Só vale com `valor`. */
  rotulo?: string;
}

export function BlockUI({
  children,
  bloqueado,
  mensagem,
  escopo = 'regiao',
  valor,
  rotulo,
}: BlockUIProps) {
  const conteudoRef = useRef<HTMLDivElement>(null);
  const mascaraRef = useRef<HTMLDivElement>(null);
  const ultimoFocoRef = useRef<HTMLElement | null>(null);
  const bloqueioAnteriorRef = useRef(bloqueado);

  // Guarda o último foco de dentro da região para devolvê-lo no desbloqueio.
  useEffect(() => {
    const conteudo = conteudoRef.current;
    if (!conteudo) return;

    const aoFocar = (evento: FocusEvent) => {
      ultimoFocoRef.current = evento.target as HTMLElement;
    };

    conteudo.addEventListener('focusin', aoFocar);
    return () => conteudo.removeEventListener('focusin', aoFocar);
  }, []);

  useEffect(() => {
    if (bloqueado === bloqueioAnteriorRef.current) return;
    bloqueioAnteriorRef.current = bloqueado;

    // `inert` joga o foco para o body. Só reposicionamos quem estava dentro.
    if (bloqueado) {
      if (ultimoFocoRef.current) mascaraRef.current?.focus();
      return;
    }

    ultimoFocoRef.current?.focus();
  }, [bloqueado]);

  return (
    <div className="citie-blockui" aria-busy={bloqueado}>
      <div className="citie-blockui__conteudo" ref={conteudoRef} inert={bloqueado}>
        {children}
      </div>

      {bloqueado ? (
        <div
          className={`citie-blockui__mascara citie-blockui__mascara--${escopo}`}
          ref={mascaraRef}
          tabIndex={-1}
        >
          <div className="citie-blockui__cartao">
            {valor === undefined ? (
              <>
                {/* O `role="status"` do spinner é a região viva que anuncia a
                    mensagem sem interromper a leitura em andamento. O parágrafo
                    é o gêmeo visual e fica fora da árvore para não duplicar. */}
                <Spinner label={mensagem} size="lg" />
                <p className="citie-blockui__mensagem" aria-hidden="true">
                  {mensagem}
                </p>
              </>
            ) : (
              <ProgressBar rotulo={rotulo ?? mensagem} valor={valor} mensagem={mensagem} />
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
