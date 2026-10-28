import { Copiar } from './Copiar';
import { contraste, razao } from './dadosMarca';

const BORDA = 'border border-border-button-default';
const BRANCO = '#FAFAFA';

export type GradienteMarca = { nome: string; de: string; para: string; uso: string };

/** Gradientes de marca a 135°, com o contraste do texto branco nos dois extremos. */
export function Gradientes({ itens }: { itens: GradienteMarca[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {itens.map((g) => {
        const css = `linear-gradient(135deg, ${g.de} 0%, ${g.para} 100%)`;
        const ini = contraste(BRANCO, g.de);
        const fim = contraste(BRANCO, g.para);
        return (
          <figure key={g.nome} className={`overflow-hidden rounded-2xl ${BORDA}`}>
            <div className="flex min-h-40 flex-col justify-end p-5" style={{ background: css, color: BRANCO }}>
              <span style={{ fontFamily: "'Red Hat Display', Inter, system-ui, sans-serif", fontWeight: 700, fontSize: 28, lineHeight: 1.2, letterSpacing: '-0.01em' }}>
                {g.nome}
              </span>
              <span style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 16, lineHeight: 1.5 }}>Texto branco sobre a rampa</span>
            </div>
            <figcaption className="flex flex-col gap-1 p-4 text-caption-1-medium text-text-secondary">
              <span className="text-body-medium text-text-primary">{g.nome}</span>
              <span>{g.uso}</span>
              <span>
                Branco sobre {g.de}: {razao(ini)} ({ini >= 4.5 ? 'passa' : 'falha'} em texto normal). Sobre {g.para}: {razao(fim)} ({fim >= 4.5 ? 'passa' : 'falha'} em texto normal).
              </span>
              <Copiar texto={`background: ${css};`} className="font-mono text-caption-2-medium text-text-primary underline underline-offset-2">
                background: {css};
              </Copiar>
            </figcaption>
          </figure>
        );
      })}
    </div>
  );
}
