# Guia de port: Figma CitieOne para o Storybook Citiesoft

Leia isto por inteiro antes de escrever qualquer linha. Ele existe para que 38
componentes portados por gente diferente saiam com a mesma cara.

## A regra que governa tudo

Duas fontes, papéis diferentes:

- **Figma CitieOne** (`fileKey B6fM1Aig3uPIvQ6amLObZC`) manda na **estrutura**:
  quais variantes existem, quais estados são obrigatórios, o que compõe o
  componente.
- **Vault Citiesoft** manda na **marca**: cor, tipografia, espaçamento, raio.

O CitieOne é o kit PrimeNG comprado e ainda carrega os tokens do PrimeOne/Aura
(`primary` lá é `#3b82f6`, azul Tailwind). **Nunca copie cor do Figma.** Toda cor
sai dos tokens em `src/tokens/tokens.css`. Se o Figma mostra azul, você usa
`var(--citie-brand-primary)`, que é o Citie Blue `#1261E4`.

**Não altere o arquivo do Figma.** Só leitura.

## Como ler a estrutura no Figma

```
mcp__plugin_figma_figma__use_figma com skillNames "figma-use", somente leitura:

const page = await figma.getNodeByIdAsync('<ID DA PÁGINA>');
await figma.setCurrentPageAsync(page);
const sets = page.findAllWithCriteria({ types: ['COMPONENT_SET'] });
return sets.map((s) => ({
  nome: s.name,
  props: Object.fromEntries(
    Object.entries(s.componentPropertyDefinitions).map(([k, v]) => [k, v.variantOptions ?? v.type]),
  ),
}));
```

Isso devolve os eixos de variante de forma compacta. Se precisar ver o desenho,
use `get_screenshot` no nó da página. Evite `get_metadata` na página inteira: a
saída é enorme.

## Arquivos que você escreve

Só dentro da sua pasta:

```
src/components/<NomeDoComponente>/
  <NomeDoComponente>.tsx
  <NomeDoComponente>.css
  <NomeDoComponente>.stories.tsx
```

**Não edite** `src/tokens/tokens.css`, `.storybook/*`, `README.md` nem componente
de outra pessoa. Precisa de um token que não existe? Use o mais próximo da lista
abaixo e deixe um comentário no CSS explicando a escolha.

Pode **importar** de componentes existentes (`../Button/Button`,
`../Field/Field`, `../Badge/Badge`, `../Skeleton/Skeleton`) quando fizer sentido
compor em vez de duplicar.

## Tokens disponíveis

Marca: `--citie-brand-primary` `--citie-brand-hover` `--citie-brand-active`
`--citie-brand-subtle` `--citie-brand-contrast`

Superfície: `--citie-background-default` `--citie-background-surface`
`--citie-background-subtle`

Texto: `--citie-text-primary` `--citie-text-base` `--citie-text-secondary`
`--citie-text-inverse` `--citie-text-placeholder`

Borda: `--citie-border-default` `--citie-border-strong` `--citie-border-danger`

Feedback: `--citie-success-emphasis` `--citie-success-strong`
`--citie-success-background` · idem para `warning`, `danger` (mais
`--citie-danger-foreground`) e `info` (`--citie-info-emphasis`
`--citie-info-text` `--citie-info-background`)

Estado: `--citie-state-focus-ring` `--citie-state-disabled-background`
`--citie-state-disabled-text` `--citie-state-selected`
`--citie-state-hover-overlay`

Formulário: `--citie-form-field-border` `--citie-form-helper`
`--citie-loading-spinner`

Raio: `--citie-radius-sm` (4) `--citie-radius-md` (6, padrão de controle)
`--citie-radius-lg` (8) `--citie-radius-xl` (12) `--citie-radius-full`

Espaçamento: `--citie-spacing-1` a `--citie-spacing-5` (4, 8, 12, 16, 20)

Tipografia: `--citie-font-ui` (Inter) `--citie-font-display` (Red Hat Display)
`--citie-font-size-body-sm` (13) `--citie-font-size-body-md` (14)
`--citie-font-size-body-lg` (16) `--citie-font-weight-action` (500)

Controle: `--citie-control-height-small` (32) `--citie-control-height-normal`
(40) `--citie-control-height-large` (48)

Elevação: `--citie-shadow-card` `--citie-shadow-overlay`

Utilitário global já disponível: `.citie-visualmente-oculto`.

## Convenções de código

- Nomes de classe em BEM com prefixo `citie-`: `.citie-menubar__item--ativo`.
- Props, variáveis e comentários **em português**. Tipos exportados também.
- JSDoc no topo do componente citando a página do Figma e as variantes do
  arquivo que você respeitou.
- Comentário só onde o "porquê" não é óbvio. Nada de comentário que repete o
  código.
- Sem biblioteca nova. Só React, SVG inline e CSS.
- `prefers-reduced-motion: reduce` desliga toda animação que você criar.

## Convenções de story

- Título: `'<Seção>/<Componente>'`. Seções em uso: `Formulário`, `Ação`, `Dados`,
  `Feedback`, `Overlay`, `Layout`, `Navegação`, `Mídia`.
- `tags: ['autodocs']` e uma `docs.description.component` citando a página do
  Figma, as variantes e o equivalente PrimeNG.
- **Uma story por estado**, não uma story com muitos controles. Nome da story
  descreve o estado: `'Estado · inválido'`, `'Variante · chips'`.
- Conteúdo do domínio real da Citiesoft (B2G): processo `2025/0481`, servidor
  `Maria de Fátima Souza`, secretarias, TFD, diária, competência, benefício.
  Nunca "Lorem ipsum" nem "Item 1".
- `play` function com asserções de comportamento nas stories que têm
  comportamento: foco, teclado, estado ARIA, contagem. Importe de
  `storybook/test`.
- Overlay (qualquer coisa que abra por cima) **começa fechado, com um gatilho**.
  `dialog` modal sobe para a top layer e cobre a página de docs inteira se
  abrir sozinho.

## Acessibilidade: o gate roda em modo `error`

A suíte reprova o build. Estas são as armadilhas que já custaram retrabalho aqui:

1. **`role="group"` não é permitido em `<li>`.** Listbox com grupos: monte em
   `div` com papéis explícitos (`div role="listbox"` → `div role="group"` →
   `div role="option"`), nunca `ul`/`li`.
2. **Filho sem papel dentro de `listbox`, `menu`, `tablist` etc. quebra
   `aria-required-parent`.** Mensagem de vazio dentro de um `role="listbox"`
   invalida a estrutura: troque o papel do container quando não há itens.
3. **Região com `overflow` precisa de `tabindex="0"`**, inclusive quando o
   componente está desabilitado. `aria-disabled` comunica o estado sem tirar o
   foco.
4. **Contraste de texto mínimo 4,5:1** contra o fundo em que ele aparece. Texto
   auxiliar usa `--citie-text-secondary`; nunca `--citie-state-disabled-text`
   para texto que precisa ser lido.
5. **Ícone sozinho exige nome acessível** (`aria-label`) e alvo de clique de no
   mínimo 24x24, mesmo que o desenho seja menor.
6. **Cor nunca é o único indicador** de estado: acompanhe de ícone, texto ou
   posição.
7. **Anel de foco obrigatório** em tudo que recebe foco:
   `box-shadow: var(--citie-state-focus-ring)` no `:focus-visible`, e
   `outline: none` só junto com ele.
8. **`aria-expanded`, `aria-selected` e afins só valem em papéis que os
   suportam.** Em `input` de texto simples ou `button` solto, o axe reprova.

## Como validar

Rode **apenas** o typecheck, que é barato e não conflita:

```bash
./node_modules/.bin/tsc --noEmit -p tsconfig.app.json
```

**Não rode `npm run test-storybook`.** A suíte roda no navegador e várias
execuções ao mesmo tempo se atrapalham. Quem integra roda a suíte completa
depois e conserta o que sobrar.

## O que devolver

No fim, um resumo curto: arquivos criados, variantes do Figma cobertas, decisões
que precisaram de inferência (o Figma não documenta tudo) e qualquer divergência
que você encontrou entre o Figma e a marca Citiesoft.
