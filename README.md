# Citiesoft Storybook

Documentação executável do Design System Citiesoft. Mostra os componentes funcionando e traz as fundações (cores, tipografia, medidas) para qualquer tecnologia: HTML, CSS, Angular, React, Tailwind, SCSS e apps nativos.

## O que tem aqui

| Seção | Conteúdo |
|---|---|
| Marca | Estratégia, voz e tom, logo, cores e tipografia da marca (do brandbook da Citiesoft) |
| Fundação | Introdução, Tokens e instalação, Cores, Tipografia, Espaçamento, Raios, Sombras, Layout e grid, Movimento, Ícones, Biblioteca de ícones (3.229 ícones), Modo escuro e Acessibilidade |
| Base | 31 componentes simples: botão, campo, seleção, tabela, abas e outros |
| Blocos | 34 composições: moldura de sistema, listagem com filtros, drawer, diálogos, menu flutuante, login simples, formulários, wizard, detalhe, calendário, composer e outros |
| Charts | 19 cards de gráfico |
| Templates | 22 telas completas: 12 de sistemas Citiesoft (TFD, administrativo) e 10 de uso geral |

## Comandos

```bash
npm run storybook          # http://localhost:6006
npm run build-storybook    # build estático
npm run gerar-tokens       # regenera os tokens e os arquivos de download
npm run test-storybook     # roda toda story no Chromium (interação e acessibilidade)
npm run gate               # lint, tipos, build e testes nos dois temas
```

Se o download do Chromium do Playwright falhar, use o Chrome instalado: `CITIE_PW_CHANNEL=chrome npm run test-storybook`.

## Tokens

A fonte dos tokens é `styles/theme.css` e `styles/typography.css`. O comando `npm run gerar-tokens` resolve tudo no Chrome e escreve:

- `tokens/citiesoft.tokens.json`: base das páginas de Fundação
- `public/tokens/`: arquivos para download (CSS, SCSS, JSON no formato W3C Design Tokens, classes de texto e tema para Tailwind v4)

Depois de mudar um token, rode o comando e republique `public/tokens/`.

## Estrutura

```
components/base/          componentes simples
components/application/   blocos, charts e templates
components/application/telas/   telas de sistemas Citiesoft e seus dados de exemplo
components/foundations/   direção (RTL), cópia de template e ícones de base
styles/                   tema, tipografia e estilos globais
stories/                  uma pasta por seção do Storybook
stories/fundacao/_ui/     componentes e snippets das páginas de documentação
tokens/                   tokens gerados
public/tokens/            arquivos de tokens para download
.storybook/shims/         substitutos de next/link, next/image e next/navigation
```

## Escrever uma story

1. Crie `stories/<seção>/<Nome>.stories.tsx` com `title: '<Seção>/<Nome>'` e `tags: ['autodocs']`.
2. Importe o componente por `@/components/...`.
3. Hooks só dentro de `render: function Render(args) {...}`.
4. Rode `npm run test-storybook`. O gate de acessibilidade falha em violação, e uma story com problema conhecido do componente recebe `parameters: { a11y: { test: 'todo' } }` com o motivo no comentário.

## Páginas de Fundação

Cada página é um arquivo MDX em `stories/fundacao/`. Trechos de código ficam em `stories/fundacao/_ui/snippets/*.ts` e entram na página por `<CodeTabs abas={...} />`, porque o MDX remove a indentação de código dentro de atributos.

## iCloud

O projeto fica em uma pasta sincronizada pelo iCloud, que corrompe `node_modules`. As dependências ficam em `node_modules.nosync/node_modules`, e `node_modules` é um link para lá. O subdiretório `node_modules` dentro do `.nosync` importa: o `react-docgen` do Storybook ignora arquivos cujo caminho contém `node_modules/`, e sem isso ele analisa pacotes inteiros (como os 3.227 componentes do Remix Icon) e o build leva mais de 30 minutos em vez de 4.

Se o `node_modules` sumir ou quebrar:

```bash
rm -rf node_modules node_modules.nosync
mkdir -p node_modules.nosync/node_modules
ln -s node_modules.nosync/node_modules node_modules
npm install
```

O iCloud também pode criar cópias como `node_modules 2` ou `arquivo 2.ts`. Apague as cópias, elas não são usadas.

Para encerrar um build ou servidor travado use `kill -9 <pid>`: o Storybook trata `SIGTERM` pelo laço de eventos, que fica bloqueado enquanto o processo trava.
