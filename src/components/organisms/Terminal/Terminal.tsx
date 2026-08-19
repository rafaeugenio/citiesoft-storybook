import { useCallback, useId, useLayoutEffect, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import './Terminal.css';

/**
 * Natureza de cada linha do histórico. `comando` é o que a pessoa digitou,
 * os demais são saída do sistema. `erro`, `aviso` e `sucesso` ganham ícone além
 * da cor, porque cor sozinha não comunica estado.
 */
export type TipoLinhaTerminal = 'comando' | 'saida' | 'erro' | 'aviso' | 'sucesso';

export interface LinhaTerminal {
  id: string;
  tipo: TipoLinhaTerminal;
  texto: string;
}

/** Retorno aceito de `aoEnviarComando`: texto puro vira linha de `saida`. */
export type SaidaTerminal = string | { tipo: Exclude<TipoLinhaTerminal, 'comando'>; texto: string };

export interface TerminalProps {
  /** Texto do prompt à esquerda do campo e das linhas de comando já executadas. */
  prompt?: string;
  /** Mensagem fixa exibida acima do histórico, como o "Welcome to Prime" do Figma. */
  boasVindas?: ReactNode;
  /** Histórico inicial no modo não controlado. */
  linhasIniciais?: LinhaTerminal[];
  /**
   * Histórico controlado. Quando informado, o componente não guarda estado
   * próprio: quem chama decide o que entra na lista.
   */
  linhas?: LinhaTerminal[];
  /**
   * Executa o comando. O retorno vira uma ou mais linhas de saída no modo não
   * controlado; no modo controlado só o efeito colateral de quem chama importa.
   */
  aoEnviarComando?: (comando: string) => SaidaTerminal | SaidaTerminal[] | void;
  /** Nome acessível do campo de comando. */
  rotuloCampo?: string;
  /** Nome acessível da região rolável do histórico. */
  rotuloHistorico?: string;
  /** Texto de apoio dentro do campo vazio. */
  placeholder?: string;
  /**
   * Bloqueia a digitação sem tirar o campo da ordem de tabulação: usa
   * `aria-disabled` e `readOnly`, para que o histórico continue alcançável.
   */
  desabilitado?: boolean;
  /** Altura da região de histórico. Aceita qualquer unidade CSS. */
  altura?: string;
  className?: string;
  style?: CSSProperties;
}

const ICONES: Partial<Record<TipoLinhaTerminal, { caminho: string; prefixo: string }>> = {
  erro: { caminho: 'M8 1.5 15 14H1L8 1.5Zm0 4.5v4m0 2.2v.1', prefixo: 'Erro:' },
  aviso: { caminho: 'M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm0 3v4m0 2.2v.1', prefixo: 'Aviso:' },
  sucesso: { caminho: 'M8 2a6 6 0 1 0 0 12A6 6 0 0 0 8 2Zm-2.4 6.1 1.8 1.8 3.4-3.6', prefixo: 'Sucesso:' },
};

let sequencia = 0;
function proximoId() {
  sequencia += 1;
  return `linha-${sequencia}`;
}

function normalizarSaida(saida: SaidaTerminal | SaidaTerminal[] | void): LinhaTerminal[] {
  if (saida === undefined || saida === null) return [];
  const lista = Array.isArray(saida) ? saida : [saida];
  return lista.map((item) =>
    typeof item === 'string'
      ? { id: proximoId(), tipo: 'saida' as const, texto: item }
      : { id: proximoId(), tipo: item.tipo, texto: item.texto },
  );
}

/**
 * Terminal — página `6738:55117` do Figma CitieOne (componente único
 * `terminal`, sem eixos de variante). O arquivo define a estrutura em três
 * partes: mensagem de boas-vindas, pares de `prompt`/`response` no histórico e
 * uma linha de prompt ativa no fim. Equivale ao `p-terminal` do PrimeNG.
 *
 * O Figma mostra dois modos (Light e Dark) e em ambos o terminal é uma
 * superfície da própria interface, não o console preto com verde neon do
 * estereótipo — por isso toda cor aqui sai de token e o contraste passa em
 * claro e escuro.
 *
 * A linha ativa é um `input` com rótulo associado, e não um `contenteditable`,
 * para funcionar com leitor de tela, autocorreção desligada e teclado virtual.
 */
export function Terminal({
  prompt = 'citie $',
  boasVindas,
  linhasIniciais = [],
  linhas,
  aoEnviarComando,
  rotuloCampo = 'Comando do terminal',
  rotuloHistorico = 'Histórico do terminal',
  placeholder,
  desabilitado = false,
  altura = '240px',
  className,
  style,
}: TerminalProps) {
  const controlado = linhas !== undefined;
  const [linhasInternas, setLinhasInternas] = useState<LinhaTerminal[]>(linhasIniciais);
  const linhasVisiveis = controlado ? linhas : linhasInternas;

  const [comando, setComando] = useState('');
  /** Comandos já enviados, do mais antigo ao mais recente, para as setas. */
  const enviadosRef = useRef<string[]>([]);
  const [indiceHistorico, setIndiceHistorico] = useState<number | null>(null);

  const campoRef = useRef<HTMLInputElement>(null);
  const historicoRef = useRef<HTMLDivElement>(null);
  const idCampo = useId();

  useLayoutEffect(() => {
    const regiao = historicoRef.current;
    if (regiao) regiao.scrollTop = regiao.scrollHeight;
  }, [linhasVisiveis]);

  const enviar = useCallback(() => {
    const texto = comando.trim();
    if (desabilitado || texto === '') return;

    enviadosRef.current = [...enviadosRef.current, texto];
    setIndiceHistorico(null);
    setComando('');

    const saida = aoEnviarComando?.(texto);
    if (!controlado) {
      setLinhasInternas((atuais) => [
        ...atuais,
        { id: proximoId(), tipo: 'comando', texto },
        ...normalizarSaida(saida),
      ]);
    }
  }, [aoEnviarComando, comando, controlado, desabilitado]);

  const aoTeclar = (evento: KeyboardEvent<HTMLInputElement>) => {
    if (evento.key === 'Enter') {
      evento.preventDefault();
      enviar();
      return;
    }

    const enviados = enviadosRef.current;
    if (enviados.length === 0) return;

    if (evento.key === 'ArrowUp') {
      evento.preventDefault();
      const proximo = indiceHistorico === null ? enviados.length - 1 : Math.max(0, indiceHistorico - 1);
      setIndiceHistorico(proximo);
      setComando(enviados[proximo]);
    }

    if (evento.key === 'ArrowDown') {
      evento.preventDefault();
      if (indiceHistorico === null) return;
      const proximo = indiceHistorico + 1;
      if (proximo >= enviados.length) {
        setIndiceHistorico(null);
        setComando('');
        return;
      }
      setIndiceHistorico(proximo);
      setComando(enviados[proximo]);
    }
  };

  /**
   * Clicar no vazio do terminal manda o foco para o campo, como num emulador
   * real. Cliques em cima de texto selecionável são preservados.
   */
  const aoClicar = (evento: MouseEvent<HTMLDivElement>) => {
    if (window.getSelection()?.toString()) return;
    if (evento.target instanceof HTMLElement && evento.target.closest('.citie-terminal__historico')) {
      return;
    }
    campoRef.current?.focus();
  };

  return (
    <div
      className={['citie-terminal', desabilitado && 'citie-terminal--desabilitado', className]
        .filter(Boolean)
        .join(' ')}
      style={{ ...style, ['--citie-terminal-altura' as string]: altura }}
      onClick={aoClicar}
    >
      {boasVindas && <p className="citie-terminal__boas-vindas">{boasVindas}</p>}

      <div
        ref={historicoRef}
        className="citie-terminal__historico"
        role="log"
        aria-live="polite"
        aria-label={rotuloHistorico}
        tabIndex={0}
      >
        {linhasVisiveis.map((linha) => {
          const icone = ICONES[linha.tipo];
          return (
            <p key={linha.id} className={`citie-terminal__linha citie-terminal__linha--${linha.tipo}`}>
              {linha.tipo === 'comando' && (
                <span className="citie-terminal__prompt" aria-hidden="true">
                  {prompt}
                </span>
              )}
              {icone && (
                <>
                  <svg
                    className="citie-terminal__icone"
                    viewBox="0 0 16 16"
                    width="14"
                    height="14"
                    aria-hidden="true"
                    focusable="false"
                  >
                    <path
                      d={icone.caminho}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="citie-visualmente-oculto">{icone.prefixo} </span>
                </>
              )}
              <span className="citie-terminal__texto">{linha.texto}</span>
            </p>
          );
        })}
      </div>

      <div className="citie-terminal__entrada">
        <label className="citie-terminal__rotulo" htmlFor={idCampo}>
          <span aria-hidden="true">{prompt}</span>
          <span className="citie-visualmente-oculto">{rotuloCampo}</span>
        </label>
        <input
          ref={campoRef}
          id={idCampo}
          className="citie-terminal__campo"
          type="text"
          value={comando}
          placeholder={placeholder}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          readOnly={desabilitado}
          aria-disabled={desabilitado || undefined}
          onChange={(evento) => setComando(evento.target.value)}
          onKeyDown={aoTeclar}
        />
      </div>
    </div>
  );
}
