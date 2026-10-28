import { contraste, nivel } from './contraste';
import { token, valor } from './dados';

const BORDA = 'border border-border-button-default';

const PARES: [string, string][] = [
  ['--color-text-primary', '--color-background-primary-default'],
  ['--color-text-primary', '--color-background-secondary-default'],
  ['--color-text-primary', '--color-background-full'],
  ['--color-text-secondary', '--color-background-primary-default'],
  ['--color-text-secondary', '--color-background-secondary-default'],
  ['--color-text-tertiary', '--color-background-primary-default'],
  ['--color-text-placeholder', '--color-background-primary-default'],
  ['--color-text-error-primary', '--color-background-primary-default'],
  ['--color-foreground-icon-primary', '--color-background-primary-default'],
  ['--color-foreground-icon-secondary', '--color-background-primary-default'],
  ['--color-border-focus-ring', '--color-background-primary-default'],
  ['--color-border-focus-ring', '--color-background-full'],
];

function Celula({ texto, fundo, modo }: { texto: string; fundo: string; modo: 'claro' | 'escuro' }) {
  const a = token(texto);
  const b = token(fundo);
  if (!a || !b) return <td className="px-3 py-2 text-text-secondary">sem token</td>;
  const razao = contraste(valor(a, modo), valor(b, modo));
  const n = nivel(razao);
  const ok = n !== 'reprova';
  return (
    <td className="px-3 py-2">
      <span className="font-mono text-caption-1-semibold">{razao.toFixed(2).replace('.', ',')}:1</span>{' '}
      <span className={`text-caption-1-medium ${ok ? 'text-text-secondary' : 'text-text-error-primary'}`}>{n}</span>
    </td>
  );
}

/** Contraste dos pares de token mais usados, calculado a partir dos valores resolvidos nos dois temas. */
export function ParesDeContraste() {
  return (
    <div className={`overflow-x-auto rounded-2xl ${BORDA}`}>
      <table className="w-full min-w-[640px] border-collapse text-body-regular">
        <thead>
          <tr className="border-b border-border-button-default bg-background-secondary-default text-caption-1-semibold text-text-secondary">
            {['Primeiro plano', 'Fundo', 'Claro', 'Escuro'].map((h) => <th key={h} scope="col" className="px-3 py-2 text-start font-semibold">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {PARES.map(([t, f]) => (
            <tr key={t + f} className="border-b border-border-button-default last:border-b-0">
              <td className="px-3 py-2"><code className="font-mono text-caption-1-medium">{t}</code></td>
              <td className="px-3 py-2"><code className="font-mono text-caption-1-medium">{f}</code></td>
              <Celula texto={t} fundo={f} modo="claro" />
              <Celula texto={t} fundo={f} modo="escuro" />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
