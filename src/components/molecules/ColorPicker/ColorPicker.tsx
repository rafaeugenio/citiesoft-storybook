import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import './ColorPicker.css';

/**
 * ColorPicker (Figma CitieOne, página ❖ ColorPicker).
 * Variantes do arquivo: Type (Inline | Overlay), Overlay (N/A | False | True,
 * isto é, painel fechado ou aberto) e State (Idle | Focus) do gatilho.
 *
 * Divergência deliberada com o desenho do Figma: o kit CitieOne desenha um
 * seletor HSV (área de saturação + faixa de matiz). Área contínua de cor é um
 * alvo impossível de operar por teclado ou leitor de tela sem virar um slider
 * duplo com valor sonoro sem sentido ("saturação 137"). Aqui a seleção é uma
 * paleta nomeada da marca Citiesoft (`radiogroup`) mais um campo hexadecimal,
 * que é o caminho acessível principal: todo valor alcançável pelo desenho é
 * alcançável pelo texto.
 */

export interface OpcaoDeCor {
  /** Nome legível, o que o leitor de tela anuncia: "Citie Blue". */
  nome: string;
  /** Valor hexadecimal gravado no formulário. */
  valor: string;
  /**
   * Token semântico do DS usado para pintar a amostra, quando existe. Permite
   * que a amostra acompanhe o tema claro/escuro sem mudar o valor gravado.
   */
  token?: string;
}

export interface ColorPickerProps {
  /** Nome do que está sendo colorido: "Cor da etiqueta do processo". */
  label: string;
  /** Inline mostra o painel sempre aberto; overlay abre a partir de um gatilho. */
  tipo?: 'inline' | 'overlay';
  paleta?: OpcaoDeCor[];
  /** Modo controlado. */
  valor?: string;
  valorInicial?: string;
  descricao?: string;
  desabilitado?: boolean;
  onChange?: (valor: string) => void;
}

/**
 * Paleta padrão: cores da marca e de feedback do DS Citiesoft. O hexadecimal é
 * o do tema claro em `tokens.css`; o `token` mantém a amostra coerente no tema
 * escuro.
 */
export const PALETA_CITIESOFT: OpcaoDeCor[] = [
  { nome: 'Citie Blue', valor: '#1261E4', token: '--citie-brand-primary' },
  { nome: 'Azul escuro', valor: '#0E4DB8', token: '--citie-brand-hover' },
  { nome: 'Azul profundo', valor: '#0B3C8F', token: '--citie-brand-active' },
  { nome: 'Verde deferido', valor: '#16A34A', token: '--citie-success-emphasis' },
  { nome: 'Âmbar pendente', valor: '#D97706', token: '--citie-warning-emphasis' },
  { nome: 'Vermelho indeferido', valor: '#DC2626', token: '--citie-danger-emphasis' },
  { nome: 'Cinza neutro', valor: '#6B7177', token: '--citie-text-secondary' },
  { nome: 'Grafite', valor: '#202020', token: '--citie-text-primary' },
];

/** Aceita `1261e4`, `#1261e4` e a forma curta `#18e`, sempre devolvendo 6 dígitos. */
function normalizarHex(texto: string): string | null {
  const limpo = texto.trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(limpo)) {
    const [r, g, b] = limpo;
    return `#${r}${r}${g}${g}${b}${b}`.toUpperCase();
  }
  if (/^[0-9a-fA-F]{6}$/.test(limpo)) return `#${limpo}`.toUpperCase();
  return null;
}

export function ColorPicker({
  label,
  tipo = 'inline',
  paleta = PALETA_CITIESOFT,
  valor,
  valorInicial = PALETA_CITIESOFT[0].valor,
  descricao,
  desabilitado = false,
  onChange,
}: ColorPickerProps) {
  const id = useId();
  const [valorInterno, setValorInterno] = useState(valorInicial);
  const corAtual = (valor ?? valorInterno).toUpperCase();

  const [aberto, setAberto] = useState(false);
  const gatilhoRef = useRef<HTMLButtonElement>(null);
  const painelRef = useRef<HTMLDivElement>(null);

  const nomeDaCor = paleta.find((opcao) => opcao.valor.toUpperCase() === corAtual)?.nome;
  const nomeAcessivel = nomeDaCor ? `${label}: ${nomeDaCor}, ${corAtual}` : `${label}: ${corAtual}`;

  const aplicar = (proximo: string) => {
    if (valor === undefined) setValorInterno(proximo);
    onChange?.(proximo);
  };

  const fechar = (devolverFoco: boolean) => {
    setAberto(false);
    if (devolverFoco) gatilhoRef.current?.focus();
  };

  // Escape em qualquer ponto do painel fecha e devolve o foco ao gatilho;
  // clique fora fecha sem roubar o foco de onde a pessoa clicou.
  useEffect(() => {
    if (!aberto) return;

    const aoTeclar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') {
        evento.stopPropagation();
        fechar(true);
      }
    };
    const aoApontar = (evento: PointerEvent) => {
      const alvo = evento.target as Node;
      if (painelRef.current?.contains(alvo) || gatilhoRef.current?.contains(alvo)) return;
      setAberto(false);
    };

    document.addEventListener('keydown', aoTeclar);
    document.addEventListener('pointerdown', aoApontar);
    return () => {
      document.removeEventListener('keydown', aoTeclar);
      document.removeEventListener('pointerdown', aoApontar);
    };
  }, [aberto]);

  const painel = (
    <PainelDeCor
      id={id}
      label={label}
      paleta={paleta}
      corAtual={corAtual}
      descricao={descricao}
      desabilitado={desabilitado}
      aplicar={aplicar}
      focarAoMontar={tipo === 'overlay'}
      ref={painelRef}
    />
  );

  if (tipo === 'inline') {
    return (
      <div className="citie-colorpicker citie-colorpicker--inline">
        <span className="citie-colorpicker__titulo" id={`${id}-titulo`}>
          {label}
        </span>
        {painel}
      </div>
    );
  }

  return (
    <div className="citie-colorpicker citie-colorpicker--overlay">
      <span className="citie-colorpicker__titulo" id={`${id}-titulo`}>
        {label}
      </span>

      <button
        type="button"
        ref={gatilhoRef}
        className="citie-colorpicker__gatilho"
        aria-haspopup="dialog"
        aria-expanded={aberto}
        aria-label={nomeAcessivel}
        aria-disabled={desabilitado || undefined}
        onClick={() => {
          if (desabilitado) return;
          setAberto((estava) => !estava);
        }}
      >
        <span
          className="citie-colorpicker__amostra citie-colorpicker__amostra--gatilho"
          style={{ background: corAtual }}
          aria-hidden="true"
        />
        {/* O valor em texto acompanha a amostra: cor sozinha não comunica. */}
        <span className="citie-colorpicker__valor" aria-hidden="true">
          {nomeDaCor ?? corAtual}
        </span>
      </button>

      {aberto && <div className="citie-colorpicker__flutuante">{painel}</div>}
    </div>
  );
}

interface PainelProps {
  id: string;
  label: string;
  paleta: OpcaoDeCor[];
  corAtual: string;
  descricao?: string;
  desabilitado: boolean;
  aplicar: (valor: string) => void;
  focarAoMontar: boolean;
  ref: RefObject<HTMLDivElement | null>;
}

function PainelDeCor({
  id,
  label,
  paleta,
  corAtual,
  descricao,
  desabilitado,
  aplicar,
  focarAoMontar,
  ref,
}: PainelProps) {
  const [texto, setTexto] = useState(corAtual);
  const [invalido, setInvalido] = useState(false);
  const campoRef = useRef<HTMLInputElement>(null);
  const opcoesRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    setTexto(corAtual);
    setInvalido(false);
  }, [corAtual]);

  useEffect(() => {
    if (focarAoMontar) campoRef.current?.focus();
  }, [focarAoMontar]);

  const indiceAtual = paleta.findIndex((opcao) => opcao.valor.toUpperCase() === corAtual);
  /** Sem cor da paleta selecionada, o primeiro item guarda a tabulação. */
  const indiceTabulavel = indiceAtual >= 0 ? indiceAtual : 0;

  const mover = (destino: number) => {
    const indice = (destino + paleta.length) % paleta.length;
    opcoesRef.current[indice]?.focus();
    aplicar(paleta[indice].valor.toUpperCase());
  };

  const confirmarTexto = () => {
    const normalizado = normalizarHex(texto);
    if (normalizado) {
      setInvalido(false);
      aplicar(normalizado);
      return;
    }
    setInvalido(true);
  };

  const conteudo = (
    <>
      <div
        className="citie-colorpicker__paleta"
        role="radiogroup"
        aria-label={`Paleta de cores para ${label}`}
        aria-disabled={desabilitado || undefined}
      >
        {paleta.map((opcao, indice) => {
          const selecionada = opcao.valor.toUpperCase() === corAtual;
          return (
            <button
              key={opcao.valor}
              type="button"
              role="radio"
              aria-checked={selecionada}
              aria-label={`${opcao.nome}, ${opcao.valor.toUpperCase()}`}
              aria-disabled={desabilitado || undefined}
              tabIndex={indice === indiceTabulavel ? 0 : -1}
              ref={(elemento) => {
                opcoesRef.current[indice] = elemento;
              }}
              className={`citie-colorpicker__opcao${selecionada ? ' citie-colorpicker__opcao--selecionada' : ''}`}
              onClick={() => {
                if (!desabilitado) aplicar(opcao.valor.toUpperCase());
              }}
              onKeyDown={(evento) => {
                if (desabilitado) return;
                const passos: Record<string, number> = {
                  ArrowRight: indice + 1,
                  ArrowDown: indice + 1,
                  ArrowLeft: indice - 1,
                  ArrowUp: indice - 1,
                  Home: 0,
                  End: paleta.length - 1,
                };
                const destino = passos[evento.key];
                if (destino !== undefined) {
                  evento.preventDefault();
                  mover(destino);
                }
              }}
            >
              <span
                className="citie-colorpicker__amostra"
                style={{ background: opcao.token ? `var(${opcao.token})` : opcao.valor }}
                aria-hidden="true"
              />
              {/* Marca de seleção: a diferença não pode ficar só na cor. */}
              {selecionada && (
                <svg
                  className="citie-colorpicker__marca"
                  viewBox="0 0 16 16"
                  aria-hidden="true"
                  focusable="false"
                >
                  <path
                    d="M3.5 8.5 6.5 11.5 12.5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      <div className="citie-colorpicker__campo">
        <label className="citie-colorpicker__campo-label" htmlFor={`${id}-hex`}>
          Código hexadecimal
        </label>
        <div className="citie-colorpicker__campo-linha">
          <span
            className="citie-colorpicker__amostra citie-colorpicker__amostra--previa"
            style={{ background: corAtual }}
            aria-hidden="true"
          />
          <input
            id={`${id}-hex`}
            ref={campoRef}
            className={`citie-colorpicker__entrada${invalido ? ' citie-colorpicker__entrada--invalida' : ''}`}
            type="text"
            inputMode="text"
            autoComplete="off"
            spellCheck={false}
            value={texto}
            disabled={desabilitado}
            aria-invalid={invalido || undefined}
            aria-describedby={`${id}-ajuda`}
            onChange={(evento) => setTexto(evento.target.value)}
            onBlur={confirmarTexto}
            onKeyDown={(evento) => {
              if (evento.key === 'Enter') {
                evento.preventDefault();
                confirmarTexto();
              }
            }}
          />
        </div>
        <p className="citie-colorpicker__ajuda" id={`${id}-ajuda`}>
          {invalido
            ? 'Informe um hexadecimal válido, como #1261E4.'
            : (descricao ?? 'Seis dígitos, com ou sem #. Exemplo: #1261E4.')}
        </p>
        {/* Só o texto do erro muda; a região viva evita anúncio duplicado do rótulo. */}
        <span className="citie-visualmente-oculto" role="status">
          {invalido ? '' : `Cor selecionada: ${corAtual}`}
        </span>
      </div>
    </>
  );

  if (!focarAoMontar) {
    return (
      <div className="citie-colorpicker__painel" ref={ref}>
        {conteudo}
      </div>
    );
  }

  return (
    <div
      className="citie-colorpicker__painel"
      role="dialog"
      aria-label={`Selecionar ${label}`}
      ref={ref}
    >
      {conteudo}
    </div>
  );
}

export { normalizarHex };
