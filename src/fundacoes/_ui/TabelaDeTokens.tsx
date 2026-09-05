import { useEffect, useRef, useState, type ReactNode } from 'react';
import './TabelaDeTokens.css';

/**
 * Tabela de referência de token, no formato que os desenvolvedores pediram:
 * nome, amostra, valor e **uso**.
 *
 * A coluna de uso é a razão de a página existir. Uma lista de token sem ela
 * obriga o desenvolvedor a adivinhar qual token serve para quê, e adivinhar é
 * como nasce a improvisação que este design system vem corrigindo.
 *
 * O valor é lido do CSS em tempo de execução, com `getComputedStyle`, e nunca
 * copiado para cá. Valor copiado envelhece em silêncio: alguém ajusta o token e
 * a documentação passa a mentir sem que nada acuse. Se o token deixar de
 * existir, a linha declara a ausência, com a coluna de valor vazia.
 */

export type EspecieDeAmostra =
  | 'cor'
  | 'superficie'
  | 'texto'
  | 'borda'
  | 'espaco'
  | 'raio'
  | 'sombra'
  | 'motion'
  | 'foco'
  | 'nenhuma';

export interface TokenDocumentado {
  /** Nome sem o prefixo `--citie-`. A tabela o acrescenta. */
  nome: string;
  /** Para que serve, em linguagem de quem vai escolher o token. */
  uso: string;
  /** Quando NÃO usar, quando houver confusão frequente com um vizinho. */
  evitar?: string;
  /** Sobre qual token de fundo a amostra deve ser desenhada. */
  sobre?: string;
}

interface TabelaDeTokensProps {
  tokens: TokenDocumentado[];
  especie: EspecieDeAmostra;
  /** Rótulo da coluna de amostra. O padrão descreve a espécie. */
  tituloDaAmostra?: string;
  legenda: string;
}

const AUSENTE = '(não definido)';

/**
 * Lê o token no próprio elemento da tabela, onde o tema já está resolvido. O
 * tema vive no container do decorador (`[data-theme]`), e a raiz nunca o
 * recebe: lida na raiz, a coluna Valor mostrava `#eff5ff` no tema escuro
 * enquanto a amostra ao lado pintava `#202838`. Propriedade personalizada é
 * herdada já computada, então o elemento da tabela carrega o valor do tema
 * em que ele está.
 */
export function lerValor(nome: string, referencia: Element | null): string {
  if (typeof window === 'undefined' || !referencia) return '';
  const bruto = getComputedStyle(referencia).getPropertyValue(`--citie-${nome}`).trim();
  return bruto || AUSENTE;
}

/** Amostra visual por espécie. Cada uma mostra o que aquele token de fato faz. */
function Amostra({ nome, especie, sobre }: { nome: string; especie: EspecieDeAmostra; sobre?: string }) {
  const variavel = `var(--citie-${nome})`;
  const fundo = sobre ? `var(--citie-${sobre})` : undefined;

  switch (especie) {
    case 'cor':
    case 'superficie':
      return <span className="citie-amostra citie-amostra--cor" style={{ background: variavel }} />;
    case 'texto':
      return (
        <span className="citie-amostra citie-amostra--texto" style={{ color: variavel, background: fundo }}>
          Texto de exemplo
        </span>
      );
    case 'borda':
      return <span className="citie-amostra citie-amostra--borda" style={{ borderColor: variavel }} />;
    case 'espaco':
      return <span className="citie-amostra citie-amostra--espaco" style={{ inlineSize: variavel }} />;
    case 'raio':
      return <span className="citie-amostra citie-amostra--raio" style={{ borderRadius: variavel }} />;
    case 'sombra':
      return <span className="citie-amostra citie-amostra--sombra" style={{ boxShadow: variavel }} />;
    case 'foco':
      return <span className="citie-amostra citie-amostra--foco" style={{ boxShadow: variavel }} />;
    case 'motion':
      return <AmostraDeMotion nome={nome} />;
    default:
      return null;
  }
}

/**
 * Movimento não se mostra parado. A amostra percorre a distância usando a
 * duração ou a curva do próprio token, em laço, para o autor comparar dois
 * tokens lado a lado e sentir a diferença.
 *
 * Respeita `prefers-reduced-motion`: com movimento reduzido, a barra fica no
 * lugar e o valor continua legível na coluna ao lado.
 */
function AmostraDeMotion({ nome }: { nome: string }) {
  const ehCurva = nome.startsWith('easing-');
  const duracao = ehCurva ? 'var(--citie-motion-lento)' : `var(--citie-${nome})`;
  const curva = ehCurva ? `var(--citie-${nome})` : 'linear';

  return (
    <span className="citie-amostra citie-amostra--motion">
      <span
        className="citie-amostra__pulso"
        style={{ animationDuration: duracao, animationTimingFunction: curva }}
      />
    </span>
  );
}

export function TabelaDeTokens({ tokens, especie, tituloDaAmostra, legenda }: TabelaDeTokensProps) {
  const [valores, setValores] = useState<Record<string, string>>({});
  const tabela = useRef<HTMLTableElement>(null);

  // A leitura acontece depois da montagem porque depende do CSS já aplicado,
  // e roda de novo quando o tema muda, já que o mesmo token tem valor diferente
  // no claro e no escuro.
  useEffect(() => {
    const ler = () =>
      setValores(
        Object.fromEntries(tokens.map((token) => [token.nome, lerValor(token.nome, tabela.current)])),
      );
    ler();

    const observador = new MutationObserver(ler);
    observador.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    // O decorador de tema marca o container da story; a raiz segue no tema claro.
    document.querySelectorAll('[data-theme]').forEach((no) => {
      observador.observe(no, { attributes: true, attributeFilter: ['data-theme'] });
    });
    return () => observador.disconnect();
  }, [tokens]);

  return (
    <table ref={tabela} className="citie-tabela-tokens" aria-label={legenda}>
      <thead>
        <tr>
          <th scope="col">Token</th>
          {especie === 'nenhuma' ? null : <th scope="col">{tituloDaAmostra ?? 'Amostra'}</th>}
          <th scope="col">Valor</th>
          <th scope="col">Uso</th>
        </tr>
      </thead>
      <tbody>
        {tokens.map((token) => {
          const valor = valores[token.nome] ?? '';
          const ausente = valor === AUSENTE;
          return (
            <tr key={token.nome}>
              <th scope="row">
                <code>--citie-{token.nome}</code>
              </th>
              {especie === 'nenhuma' ? null : (
                <td className="citie-tabela-tokens__amostra">
                  {ausente ? null : <Amostra nome={token.nome} especie={especie} sobre={token.sobre} />}
                </td>
              )}
              <td>
                <code className={ausente ? 'citie-tabela-tokens__ausente' : undefined}>
                  {valor || '…'}
                </code>
              </td>
              <td>
                {token.uso}
                {token.evitar ? (
                  <span className="citie-tabela-tokens__evitar">
                    <strong>Evite:</strong> {token.evitar}
                  </span>
                ) : null}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

/**
 * Bloco de recomendação por contexto, no formato da segunda tabela do design
 * system do TFD: o desenvolvedor chega com uma situação de tela na mão,
 * então a entrada da tabela precisa ser a situação.
 */
export function TabelaDeContexto({
  linhas,
  legenda,
  colunaDoValor = 'Valor',
}: {
  linhas: { contexto: string; valor: string; exemplo: ReactNode }[];
  legenda: string;
  colunaDoValor?: string;
}) {
  return (
    <table className="citie-tabela-tokens citie-tabela-tokens--contexto" aria-label={legenda}>
      <thead>
        <tr>
          <th scope="col">Contexto</th>
          <th scope="col">{colunaDoValor}</th>
          <th scope="col">Onde aparece</th>
        </tr>
      </thead>
      <tbody>
        {linhas.map((linha) => (
          <tr key={linha.contexto}>
            <th scope="row">
              <code>{linha.contexto}</code>
            </th>
            <td>{linha.valor}</td>
            <td>{linha.exemplo}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/** Cabeçalho de bloco dentro de uma página de fundação. */
export function Bloco({
  titulo,
  descricao,
  children,
}: {
  titulo: string;
  descricao?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="citie-bloco-fundacao">
      <h3 className="citie-bloco-fundacao__titulo">{titulo}</h3>
      {descricao ? <p className="citie-bloco-fundacao__descricao">{descricao}</p> : null}
      {children}
    </section>
  );
}

/**
 * Aviso de achado aberto. Existe porque a documentação honesta precisa mostrar
 * também o que está errado ou incompleto, ao lado da parte pronta.
 */
export function AchadoAberto({ children }: { children: ReactNode }) {
  return (
    <p className="citie-achado-aberto" role="note">
      <strong>Achado aberto.</strong> {children}
    </p>
  );
}
