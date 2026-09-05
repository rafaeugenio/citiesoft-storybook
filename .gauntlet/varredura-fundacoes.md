# Varredura final das fundações

Consolidação dos blocos `/* Lote N */` de `src/tokens/tokens.css` nas seções
temáticas, com abertura de linha de tabela em `src/fundacoes/` para cada token
movido. Branch `revisao`, sobre `d7bf4ad`. Sem commit.

## 1. As 55 linhas do agente anterior: aproveitadas

O diff em disco não movia token nenhum: ele **duplicava** sete tokens dos blocos
de lote nas seções temáticas, sem apagar o original. Como a duplicata ficava
antes do bloco de lote dentro do mesmo `:root`, a declaração do lote continuava
vencendo na cascata, com valor idêntico. Os sete: `veu-sobre-selecao`,
`secondary-hover`, `sombra-do-contorno`, `sombra-da-tecla`, `anel-do-botao`,
`linha-mini` e `toast-recuo-de-escala`.

As colocações eram boas, então elas ficaram e o que se apagou foi a cópia dentro
do bloco de lote. A redação do agente anterior também corrigia uma negação
paralela no comentário de `secondary-hover`, e essa versão é a que sobreviveu.

## 2. Onde cada token foi parar

| Origem | Tokens | Destino em `tokens.css` |
|---|---|---|
| Lote 1 | `secondary-hover` | Bloco de accent e secondary |
| Lote 1 | `anel-do-botao` | Bloco de aresta e proporção de mistura |
| Lote 1 | `sombra-do-contorno`, `sombra-da-tecla` | Escala de elevação |
| Lote 3 | `linha-mini` | Entrelinha, ao lado de `entrelinha-corpo` |
| Lote 3 | `toast-recuo-de-escala` | Ao lado de `largura-toast` |
| Lote 3 | `hub-raio-da-caixa` | Escala de raio |
| Lote 3 | `hub-altura`, `hub-caixa-de-icone`, `hub-icone`, `botao-fechar`, `largura-drawer` | Dimensões de componente |
| Lote 5 | `veu-sobre-selecao` | Bloco de accent e estado |
| Lote 5 | `icone-de-linha`, `largura-minima-do-card-de-grade`, `marcador-da-linha-do-tempo` | Dimensões de componente |
| Lote 6a | `alert-dialog-caixa-de-icone`, `alert-dialog-icone`, `largura-alert-dialog` | Dimensões de componente |
| Lote 6b | os sete tokens de barra, sidebar, avatar, margem e colunas | Dimensões de shell |

No bloco escuro, `secondary-hover` foi para junto de `secondary`,
`veu-sobre-selecao` para junto do accent, e as duas sombras para junto da escada
de sombra do escuro. As duas linhas que só diziam "Lote 6a e 6b são
dimensionais" viraram um parágrafo no fim do bloco, explicando que raio,
espaçamento, tipografia, motion e dimensão ficam fora dele por serem grandezas.

Nenhum bloco `/* Lote` sobrou no arquivo.

## 3. Prova de que nenhum valor mudou

`scripts/snapshot-tokens.mjs` abre a folha num Chromium, lê
`getComputedStyle` de todo nome `--citie-*` encontrado no arquivo, nos dois
temas, e grava JSON. O navegador resolve `var()` e `color-mix()` na hora de
computar, então a comparação pega valor literal e valor derivado.

| Momento | Tokens lidos | Divergências claro + escuro |
|---|---|---|
| Antes da consolidação | 172 | baseline |
| Depois da consolidação | 172 | 0 |
| Depois da varredura de texto | 172 | 0 |

**Sabotagem da própria prova.** Com `--citie-hub-altura` alterado de 72px para
73px, a comparação acusou a divergência nos dois temas e voltou a zero depois de
restaurar o arquivo. A prova falha quando deve.

## 4. Cobertura das tabelas de fundação

Antes: 65 dos 172 tokens sem linha de tabela. Depois: 16, todos da paleta de
gráfico, registrada como dívida em `docs/figma-ui-kit.md`.

Além dos tokens movidos, entraram nas tabelas os que já estavam em seção
temática e nunca tinham sido documentados: a rampa de preenchimento de feedback
(nove tokens), as quatro proporções de mistura, `veu-de-realce`,
`form-field-border-hover`, `form-helper`, `danger-foreground`,
`loading-spinner`, `shadow-poco`, `entrelinha-corpo`,
`motion-ciclo-varredura` e os sete da anatomia da linha de tabela.

Página nova: `src/fundacoes/Dimensoes.stories.tsx`, com três tabelas
(componente, linha de tabela, shell) e três guardas. A página de Raio devolveu
as medidas de peça e ficou com a escala de raio, a escada de altura de controle
e os dois alvos de toque. Stories novas em Cores (rampa de feedback, proporções)
e em Tipografia (entrelinha). O índice da Introdução ganhou a linha da página
nova.

Cada linha de tabela prova que o token existe, porque a `TabelaDeTokens` lê o
valor computado e escreve `(não definido)` quando o nome não encontra
declaração. Três das guardas novas conferem que essa marca não aparece.

## 5. Parágrafo da Introdução

`Fundações/Introdução` ganhou a seção "Como um token chega até aqui": lote grava
o token em bloco próprio no fim do arquivo para não disputar linha com os outros
lotes, e a varredura de consolidação move para a seção temática, prova por
medição que o valor não mudou e abre a linha na tabela. Token em bloco de lote é
token que a varredura ainda não alcançou.

## 6. Varredura de texto

Travessão: **zero** em `tokens.css` e em `src/fundacoes/`, antes e depois.

Negação paralela: 9 ocorrências em `tokens.css` e 32 em `src/fundacoes/`,
todas reescritas para dizer o que a coisa é. As três que sobraram no grep
ampliado são afirmação de limite ("sobe no máximo um degrau no hover, e nunca
dois") e conjunção de fato ("valem igual nos dois temas e não aparecem no bloco
escuro"), sem a figura retórica que o briefing proíbe.

## 7. Achado L3-08: invariante 7 do catálogo

Coube como passo simples, então foi implementado. `scripts/verificar-catalogo.mjs`
passou a conferir que todo `.tsx` de componente que escreve classe de folha
compartilhada importa a folha, direto ou pela folha de pele irmã. Arquivo de
story fica de fora, porque quem carrega a folha é o componente que ele renderiza.

**Sabotagem.** Removido o import de `src/tokens/severidade.css` de
`src/components/atoms/Avatar/Avatar.tsx`, a verificação reprovou nomeando o
arquivo e saiu com código 1. Restaurado o import, voltou a passar.

O script também aceita `CITIE_STATIC` para apontar a checagem para um build em
pasta privada, que é o que o briefing pede quando vários lotes constroem ao
mesmo tempo.

## 8. Gates

Rodados um a um, com o build estático em `$CLAUDE_JOB_DIR/tmp/static-varredura`
para não disputar `storybook-static/` com os outros lotes.

| Passo | Resultado |
|---|---|
| `oxlint` | 31 avisos, todos anteriores e em componente que esta varredura não tocou |
| `tsc -b --force` | limpo |
| `storybook build` | concluído |
| `verificar-catalogo` (8 invariantes) | todas passaram |
| Tema claro | 843 de 843, 125 arquivos |
| Tema escuro | 808 de 843, 35 falhas em 8 arquivos |

O escuro bate exatamente com a linha de base declarada. A única falha em arquivo
tocado por esta varredura é `Fundações/Cores > Texto`, e ela é anterior: o axe
reprova `--citie-text-placeholder` com **3,51:1** sobre `#1a1a1d`. Os dois
tokens que a varredura acrescentou àquela tabela passam AA no escuro
(`form-helper` e `danger-foreground`).

Uma guarda precisou de ajuste: a story `Texto` contava cinco amostras num número
solto, e agora conta `TEXTO.length`, para uma linha nova de tabela não obrigar a
corrigir um número escrito à mão.

## 9. O que fica aberto

1. **Paleta de gráfico sem fundação.** Dezesseis tokens sem tabela. Pede uma
   página de visualização de dados, com ordem categórica, alternativa para
   daltonismo e regra de troca de família.
2. **`text-placeholder` no escuro.** 3,51:1, abaixo de AA. Escolher outro degrau
   de neutro é decisão de token do DesignOps, e por isso a varredura parou aqui
   com o valor intacto.
3. **`Avatar` sem degrau de 32.** O shell aplica `--citie-avatar-da-barra`
   porque o átomo tem 28, 42 e 56. A lacuna está escrita na página de Dimensões.

## Veredito anti-slop

**PASSOU.** Nenhum valor de token mudou, e a prova foi sabotada. Toda linha nova
de tabela declara uso e evitar, com contraste em número onde há cor. As guardas
novas conferem existência de token pelo valor computado, e a invariante nova foi
sabotada. Texto sem travessão e sem negação paralela.
