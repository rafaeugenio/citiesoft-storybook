# Guia de desmembramento de documentação

Este guia rege a divisão dos arquivos de story que hoje documentam mais de um
componente. Leia inteiro antes de editar.

## O que muda e o que não muda

**Muda**: a documentação. Cada componente com responsabilidade própria ganha o
seu arquivo `.stories.tsx` e o seu título no catálogo.

**Não muda**: a implementação. Os componentes continuam exportados do mesmo
arquivo `.tsx`, porque compartilham CSS e primitivos. Não mova, não renomeie e
não duplique implementação. Não altere nenhum `.tsx` de componente nem `.css`.

**Não muda**: o comportamento. Toda story existente precisa sobreviver, com o
mesmo nome, os mesmos `args`, a mesma `play` function e as mesmas
`parameters.docs.description`. Você está redistribuindo stories entre arquivos,
não reescrevendo-as.

## Regra de ouro

**Nenhuma story pode ser perdida.** Ao final, a soma das stories dos arquivos
novos tem que ser igual ao total do arquivo original. Conte antes e depois.

Se uma story demonstra dois componentes juntos (por exemplo, uma composição),
ela pertence ao componente principal da cena, e a descrição deve dizer que a
outra peça aparece por composição.

## Convenção de título

```
<Nível>/<Família>/<Componente>
```

Níveis: `Átomos`, `Moléculas`, `Organismos`. Use exatamente os títulos que a
tabela da sua tarefa indicar. Sem prefixo numérico, sem sigla.

## Estrutura de cada arquivo novo

```tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { NomeDoComponente } from './ArquivoDeImplementacao';

const meta = {
  title: '<Nível>/<Família>/<Componente>',
  component: NomeDoComponente,
  tags: ['autodocs', '<atom|molecule|organism>'],
  parameters: {
    docs: {
      description: {
        component: '…',
      },
    },
  },
  args: { … },
} satisfies Meta<typeof NomeDoComponente>;

export default meta;
type Story = StoryObj<typeof meta>;
```

Na `description.component`, preserve o que já existia e acrescente, quando a
informação existir no arquivo original: origem no Figma CitieOne, equivalente
PrimeNG e a regra de escolha que separa este componente do irmão que ficou no
outro arquivo. Essa regra de escolha é o conteúdo mais valioso do
desmembramento: diga **quando usar este e não o outro**.

## Tags

Acrescente ao `tags` do meta, além de `autodocs`:

- o nível: `atom`, `molecule` ou `organism`;
- `a11y` quando o componente tiver requisito de acessibilidade documentado;
- `play-fn` quando o arquivo tiver ao menos uma `play` function.

Preserve tags que já existirem, como `anti-padrao`.

## Verificação obrigatória antes de terminar

```bash
./node_modules/.bin/tsc --noEmit -p tsconfig.app.json
```

Conte as stories antes e depois:

```bash
grep -c '^export const' <arquivo antigo>
grep -c '^export const' <cada arquivo novo>
```

**Não rode `npm run test-storybook`**: a suíte roda no navegador e várias
execuções simultâneas se atrapalham. Quem integra roda a suíte completa depois.

## O que devolver

Arquivos criados, arquivo removido, contagem de stories antes e depois, e a
regra de escolha que você documentou entre os componentes irmãos.
