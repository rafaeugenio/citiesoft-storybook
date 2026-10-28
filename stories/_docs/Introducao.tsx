const CAIXA = 'rounded-2xl border border-border-button-default p-4';

const CAMADAS = [
  ['1', 'Primitivo', 'Valor bruto, sem papel definido.', '--color-neutral-950'],
  ['2', 'Semântico', 'Papel na interface. É o que o código consome.', '--color-text-primary'],
  ['3', 'Componente', 'Papel dentro de um componente específico.', '--color-button-ghost-foreground'],
] as const;

/** As três camadas de token, em ordem de dependência. */
export function Camadas() {
  return (
    <ol className="grid gap-3 md:grid-cols-3">
      {CAMADAS.map(([n, nome, texto, exemplo]) => (
        <li key={n} className={CAIXA}>
          <p className="text-caption-1-medium text-text-secondary">Camada {n}</p>
          <p className="mt-1 text-headline-medium text-text-primary">{nome}</p>
          <p className="mt-1 text-body-regular text-text-secondary">{texto}</p>
          <code className="mt-3 block font-mono text-caption-1-medium text-text-primary">{exemplo}</code>
        </li>
      ))}
    </ol>
  );
}

const MAPA = [
  ['Fundação', 'Cores, tipografia e medidas. Aqui estão os tokens e o modo de instalar.'],
  ['Base', 'Componentes simples: botão, campo, seleção, tabela, aba.'],
  ['Blocos', 'Composições maiores, como tabela de dados, calendário e barra lateral.'],
  ['Charts', 'Cartões de gráfico, com séries e trilhas nas cores do tema.'],
  ['Templates', 'Telas completas, para ver os blocos juntos.'],
] as const;

/** Seções do Storybook e o que cada uma contém. */
export function MapaDoStorybook() {
  return (
    <dl className="grid gap-3 md:grid-cols-2">
      {MAPA.map(([nome, texto]) => (
        <div key={nome} className={CAIXA}>
          <dt className="text-headline-medium text-text-primary">{nome}</dt>
          <dd className="mt-1 text-body-regular text-text-secondary">{texto}</dd>
        </div>
      ))}
    </dl>
  );
}

const PASSOS = [
  ['Baixe', 'Pegue os arquivos de tokens na página Tokens e instalação.'],
  ['Carregue', 'Importe o arquivo da sua stack uma vez, na entrada do projeto.'],
  ['Use pelo papel', 'Escolha o token pelo que o elemento faz, nunca pela aparência.'],
  ['Valide nos dois temas', 'Alterne claro e escuro. Se algo quebrar, falta um token.'],
] as const;

/** Fluxo de uso em quatro passos. */
export function Passos() {
  return (
    <ol className="grid gap-3 md:grid-cols-2">
      {PASSOS.map(([titulo, texto], i) => (
        <li key={titulo} className={CAIXA}>
          <p className="text-caption-1-medium text-text-secondary">Passo {i + 1}</p>
          <p className="mt-1 text-headline-medium text-text-primary">{titulo}</p>
          <p className="mt-1 text-body-regular text-text-secondary">{texto}</p>
        </li>
      ))}
    </ol>
  );
}
