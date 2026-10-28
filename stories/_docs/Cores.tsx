import { Copiar } from './Copiar';
import { contraste, nivel } from './contraste';
import { FAMILIAS, comPrefixo, ehPrimitiva, token, tokens, valor, type Token } from './dados';

const BORDA = 'border border-border-button-default';

function Quadro({ hex, className = 'size-9' }: { hex: string; className?: string }) {
  return <span className={`${className} shrink-0 rounded-lg ${BORDA}`} style={{ background: hex }} />;
}

/** Uma linha por família da paleta primitiva, com hex e nome do token em cada passo. */
export function EscalasDeCor({ familias = [...FAMILIAS] }: { familias?: string[] }) {
  return (
    <div className="flex flex-col gap-6">
      {familias.map((f) => {
        const passos = tokens.filter((t) => new RegExp(`^--color-${f}-\\d+$`).test(t.nome));
        if (!passos.length) return null;
        return (
          <div key={f}>
            <h3 className="mb-2 text-body-medium capitalize text-text-primary">{f}</h3>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(88px,1fr))] gap-2">
              {passos.map((t) => {
                const passo = t.nome.split('-').pop();
                return (
                  <Copiar key={t.nome} texto={t.claro} className="flex flex-col gap-1.5">
                    <span className={`h-12 w-full rounded-lg ${BORDA}`} style={{ background: t.claro }} />
                    <span className="text-caption-1-semibold text-text-primary">{passo}</span>
                    <span className="font-mono text-caption-2-medium text-text-secondary">{t.claro}</span>
                  </Copiar>
                );
              })}
            </div>
          </div>
        );
      })}
      <div>
        <h3 className="mb-2 text-body-medium text-text-primary">Branco e preto</h3>
        <div className="flex gap-3">
          {['--color-white', '--color-black'].map((n) => {
            const t = token(n);
            return t ? (
              <Copiar key={n} texto={t.claro} className="flex items-center gap-2">
                <Quadro hex={t.claro} />
                <span className="flex flex-col">
                  <code className="text-caption-1-semibold">{n}</code>
                  <span className="font-mono text-caption-2-medium text-text-secondary">{t.claro}</span>
                </span>
              </Copiar>
            ) : null;
          })}
        </div>
      </div>
    </div>
  );
}

const Selo = ({ razao }: { razao: number }) => {
  const n = nivel(razao);
  const cor = n === 'reprova' ? 'text-text-error-primary' : 'text-text-secondary';
  return (
    <span className={`font-mono text-caption-2-medium ${cor}`}>
      {razao.toFixed(1)}:1 {n}
    </span>
  );
};

type Contra = 'fundo' | false;

/**
 * Tabela de tokens semânticos. Mostra o valor nos dois temas, a origem na paleta e,
 * quando `contra="fundo"`, o contraste do token sobre o fundo padrão de cada tema.
 */
export function TabelaSemantica({
  prefixos,
  contra = false,
  descricoes = {},
}: {
  prefixos: string[];
  contra?: Contra;
  descricoes?: Record<string, string>;
}) {
  const lista: Token[] = comPrefixo(...prefixos.map((p) => `--color-${p}`)).filter((t) => !ehPrimitiva(t.nome));
  const fundoClaro = token('--color-background-primary-default')?.claro ?? '#ffffff';
  const fundoEscuro = valor(token('--color-background-primary-default')!, 'escuro');
  return (
    <div className={`overflow-x-auto rounded-2xl ${BORDA}`}>
      <table className="w-full min-w-[640px] border-collapse text-start text-body-regular">
        <thead>
          <tr className="border-b border-border-button-default bg-background-secondary-default text-caption-1-semibold text-text-secondary">
            <th scope="col" className="px-3 py-2 text-start font-semibold">Token</th>
            <th scope="col" className="px-3 py-2 text-start font-semibold">Claro</th>
            <th scope="col" className="px-3 py-2 text-start font-semibold">Escuro</th>
          </tr>
        </thead>
        <tbody>
          {lista.map((t) => {
            const claro = valor(t, 'claro');
            const escuro = valor(t, 'escuro');
            const alias = /^var\((--[\w-]+)\)$/.exec(t.declarado)?.[1];
            const aliasEscuro = t.declaradoEscuro && /^var\((--[\w-]+)\)$/.exec(t.declaradoEscuro)?.[1];
            return (
              <tr key={t.nome} className="border-b border-border-button-default last:border-b-0 align-top">
                <td className="px-3 py-2.5">
                  <Copiar texto={t.nome}>
                    <code className="text-caption-1-semibold text-text-primary">{t.nome}</code>
                  </Copiar>
                  {descricoes[t.nome] ? <p className="mt-0.5 max-w-[44ch] text-caption-1-medium text-text-secondary">{descricoes[t.nome]}</p> : null}
                </td>
                <td className="px-3 py-2.5">
                  <Copiar texto={claro} className="flex items-center gap-2">
                    <Quadro hex={claro} className="size-7" />
                    <span className="flex flex-col">
                      <span className="font-mono text-caption-1-medium">{claro}</span>
                      <span className="font-mono text-caption-2-medium text-text-secondary">{alias?.replace('--color-', '') ?? ''}</span>
                    </span>
                  </Copiar>
                  {contra ? <Selo razao={contraste(claro, fundoClaro)} /> : null}
                </td>
                <td className="px-3 py-2.5">
                  <Copiar texto={escuro} className="flex items-center gap-2">
                    <Quadro hex={escuro} className="size-7" />
                    <span className="flex flex-col">
                      <span className="font-mono text-caption-1-medium">{escuro}</span>
                      <span className="font-mono text-caption-2-medium text-text-secondary">{(aliasEscuro || alias || '').toString().replace('--color-', '')}</span>
                    </span>
                  </Copiar>
                  {contra ? <Selo razao={contraste(escuro, fundoEscuro)} /> : null}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/** Quantidade de tokens semânticos por prefixo, para a visão geral. */
export function ResumoDeTokens() {
  const prim = tokens.filter((t) => t.tipo === 'color' && ehPrimitiva(t.nome)).length;
  const sem = tokens.filter((t) => t.tipo === 'color' && !ehPrimitiva(t.nome)).length;
  const escuro = tokens.filter((t) => t.escuro !== undefined).length;
  const itens = [
    [String(prim), 'cores primitivas'],
    [String(sem), 'cores semânticas'],
    [String(escuro), 'tokens com tema escuro'],
    [String(tokens.length), 'tokens no total'],
  ];
  return (
    <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {itens.map(([n, r]) => (
        <div key={r} className={`rounded-2xl p-4 ${BORDA}`}>
          <dt className="text-caption-1-medium text-text-secondary">{r}</dt>
          <dd className="mt-1 text-title-2-semibold text-text-primary">{n}</dd>
        </div>
      ))}
    </dl>
  );
}
