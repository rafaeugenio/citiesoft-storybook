import type { CSSProperties, ReactNode } from 'react';
import { Amostra } from './Conteudo';
import { Texto } from './Layout';

const BORDA = 'border border-border-button-default';

type Fundo = 'branco' | 'azul' | 'escuro' | 'cinza';
const FUNDOS: Record<Fundo, string> = { branco: '#ffffff', azul: '#1261E4', escuro: '#141414', cinza: '#F4F5F7' };

export type ItemLogo = { src: string; legenda: string; fundo?: Fundo; altura?: number };

/** Grade de logos, cada um sobre o fundo em que deve ser usado. */
export function Galeria({ itens, colunas = 3 }: { itens: ItemLogo[]; colunas?: 2 | 3 | 4 }) {
  const grade = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-2 xl:grid-cols-3', 4: 'md:grid-cols-2 xl:grid-cols-4' }[colunas];
  return (
    <div className={`grid gap-3 ${grade}`}>
      {itens.map((i) => (
        <Amostra key={i.src + i.legenda} src={i.src} legenda={i.legenda} fundo={i.fundo} altura={i.altura} />
      ))}
    </div>
  );
}

/** Mostra a área de respiro: moldura tracejada com `multiplo` vezes X ao redor do logo. X vem da altura do logo exibido. */
export function Respiro({ src, legenda, fundo = 'branco', altura = 56, multiplo = 1 }: { src: string; legenda: string; fundo?: Fundo; altura?: number; multiplo?: number }) {
  const x = altura * multiplo;
  const cor = fundo === 'azul' || fundo === 'escuro' ? '#ffffff' : '#555555';
  const rotulo: CSSProperties = { position: 'absolute', color: cor, fontSize: 12, fontWeight: 600, lineHeight: 1 };
  const nome = multiplo === 1 ? 'X' : `${String(multiplo).replace('.', ',')}X`;
  return (
    <figure className={`overflow-hidden rounded-2xl ${BORDA}`}>
      <div className="flex justify-center overflow-x-auto p-6" style={{ background: FUNDOS[fundo] }}>
        <div className="relative shrink-0 border border-dashed" style={{ padding: x, borderColor: cor }}>
          <img src={src} alt={legenda} style={{ height: altura, display: 'block' }} />
          <span aria-hidden style={{ ...rotulo, top: x / 2 - 6, left: '50%' }}>{nome}</span>
          <span aria-hidden style={{ ...rotulo, bottom: x / 2 - 6, left: '50%' }}>{nome}</span>
          <span aria-hidden style={{ ...rotulo, left: x / 2 - 4, top: '50%' }}>{nome}</span>
          <span aria-hidden style={{ ...rotulo, right: x / 2 - 4, top: '50%' }}>{nome}</span>
        </div>
      </div>
      <figcaption className="border-t border-border-button-default px-3 py-2 text-caption-1-medium text-text-secondary">{legenda}</figcaption>
    </figure>
  );
}

/** O mesmo logo em larguras diferentes, para conferir legibilidade. */
export function Escala({ src, fundo = 'branco', larguras, legenda }: { src: string; fundo?: Fundo; larguras: number[]; legenda: string }) {
  return (
    <figure className={`overflow-hidden rounded-2xl ${BORDA}`}>
      <div className="flex flex-wrap items-end gap-8 p-6" style={{ background: FUNDOS[fundo] }}>
        {larguras.map((l) => (
          <div key={l} className="flex flex-col gap-2">
            <img src={src} alt={`${legenda}, ${l} px de largura`} style={{ width: l, maxWidth: '100%' }} />
            <span className="font-mono text-caption-2-medium" style={{ color: fundo === 'azul' || fundo === 'escuro' ? '#ffffff' : '#555555' }}>{l} px</span>
          </div>
        ))}
      </div>
      <figcaption className="border-t border-border-button-default px-3 py-2 text-caption-1-medium text-text-secondary">{legenda}</figcaption>
    </figure>
  );
}

type Lado = { src: string; legenda: string; fundo?: Fundo; estilo?: CSSProperties };

function Lado({ lado, rotulo, erro }: { lado: Lado; rotulo: string; erro?: boolean }) {
  return (
    <figure className={`overflow-hidden rounded-2xl ${BORDA}`}>
      <div className="flex items-center justify-center overflow-hidden p-6" style={{ background: FUNDOS[lado.fundo ?? 'branco'], minHeight: 112 }}>
        <img src={lado.src} alt={lado.legenda} style={{ maxHeight: 48, maxWidth: '100%', ...lado.estilo }} />
      </div>
      <figcaption className="border-t border-border-button-default px-3 py-2 text-caption-1-medium text-text-secondary">
        <span className={erro ? 'text-caption-1-semibold text-text-error-primary' : 'text-caption-1-semibold text-text-primary'}>{rotulo}</span>
        {' '}
        <Texto>{lado.legenda}</Texto>
      </figcaption>
    </figure>
  );
}

/** Pares lado a lado: o arquivo certo e a mesma peça com o erro aplicado só para ilustrar. */
export function Comparativo({ itens }: { itens: { titulo: string; certo: Lado; errado: Lado }[] }) {
  return (
    <div className="flex flex-col gap-5">
      {itens.map((p) => (
        <div key={p.titulo}>
          <h3 className="mb-2 text-body-medium text-text-primary">{p.titulo}</h3>
          <div className="grid gap-3 md:grid-cols-2">
            <Lado lado={p.certo} rotulo="Faça." />
            <Lado lado={p.errado} rotulo="Evite." erro />
          </div>
        </div>
      ))}
    </div>
  );
}

export type ArquivoLogo = { arquivo: string; versao: string; fundo: string };

/** Todos os SVGs oficiais publicados em `/marca`. */
export const ARQUIVOS_LOGO: ArquivoLogo[] = [
  { arquivo: 'LogoHorizontal3.svg', versao: 'Horizontal positiva: símbolo azul e nome escuro', fundo: 'Branco e claros' },
  { arquivo: 'LogoHorizontal2.svg', versao: 'Horizontal negativa: símbolo e nome claros', fundo: 'Citie Blue, escuros e gradiente de marca' },
  { arquivo: 'LogoHorizontal1.svg', versao: 'Horizontal: símbolo azul e nome claro', fundo: 'Escuros (a confirmar, ver aviso na página)' },
  { arquivo: 'LogoAzul.svg', versao: 'Símbolo isolado azul', fundo: 'Branco e claros' },
  { arquivo: 'LogoBranca.svg', versao: 'Símbolo isolado claro', fundo: 'Citie Blue e escuros' },
  { arquivo: 'LogoNome1.svg', versao: 'Wordmark escuro', fundo: 'Branco e claros' },
  { arquivo: 'LogoNome2.svg', versao: 'Wordmark claro', fundo: 'Citie Blue e escuros' },
  { arquivo: 'logo-citiesoft-1.svg', versao: 'Família: horizontal, símbolo azul e nome branco', fundo: 'Escuros' },
  { arquivo: 'logo-citiesoft-2.svg', versao: 'Família: horizontal azul', fundo: 'Claros' },
  { arquivo: 'logo-citiesoft-3.svg', versao: 'Família: horizontal branco', fundo: 'Azul e escuros' },
  { arquivo: 'logo-citiesoft-4.svg', versao: 'Família: horizontal preto', fundo: 'Claros' },
  { arquivo: 'logo-citiesoft-5.svg', versao: 'Família: horizontal azul, padrão dos slides', fundo: 'Claros' },
  { arquivo: 'logo-citiesoft-6.svg', versao: 'Família: wordmark preto', fundo: 'Claros' },
  { arquivo: 'logo-citiesoft-7.svg', versao: 'Família: wordmark branco', fundo: 'Azul e escuros' },
  { arquivo: 'logo-citiesoft-8.svg', versao: 'Família: wordmark azul', fundo: 'Claros' },
  { arquivo: 'logo-citiesoft-9.svg', versao: 'Família: símbolo preto', fundo: 'Claros' },
  { arquivo: 'logo-citiesoft-10.svg', versao: 'Família: símbolo branco', fundo: 'Azul e escuros' },
  { arquivo: 'logo-citiesoft-11.svg', versao: 'Família: símbolo azul', fundo: 'Claros' },
];

/** Célula de tabela com link de download. */
export function LinkSvg({ arquivo }: { arquivo: string }): ReactNode {
  return (
    <a href={`marca/${arquivo}`} download className="font-mono text-caption-1-semibold text-text-primary underline underline-offset-2">
      {arquivo}
    </a>
  );
}
