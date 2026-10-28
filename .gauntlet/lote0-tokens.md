# Lote 0: tokens do UI Kit Citiesoft em `tokens.css`

Branch `revisao`, sem commit. Spec: `docs/figma-ui-kit.md`, seção "Mapa".
Arquivos tocados: `src/tokens/tokens.css`, as cinco fundações (`Cores`,
`Raio`, `Espacamento`, `Elevacao`, `Fundacoes`), e os testes que mediam a
altura 40, o raio 8 ou a opacidade do anel por literal.

## Tokens criados

| Token | Claro | Escuro | Papel |
| --- | --- | --- | --- |
| `--citie-accent` | `#eff5ff` | `#202838` | Realce sólido de hover (aba, linha, item de menu e sidebar) |
| `--citie-accent-foreground` | `#0b3c8f` | `#d2d3d6` | Rótulo que se afirma por cima do accent |
| `--citie-accent-forte` | `#d6dce4` | `#29344b` | Linha selecionada e item ativo, destino de `state-selected` |
| `--citie-secondary` | `#f4f5f7` | `#232327` | Botão e badge Secondary |
| `--citie-secondary-foreground` | `#202020` | `#f5f5f6` | Rótulo do Secondary |
| `--citie-popover` | `#202020` | `#f5f5f6` | Fundo invertido do tooltip |
| `--citie-popover-foreground` | `#ffffff` | `#141414` | Texto do tooltip |
| `--citie-sidebar` | `#fafafa` | `#141414` | Fundo da barra lateral |
| `--citie-sidebar-foreground` | `#3c3c3c` | `#d2d3d6` | Item em repouso |
| `--citie-sidebar-accent` | `var(--citie-accent)` | `var(--citie-accent)` | Item em hover e ativo |
| `--citie-sidebar-accent-foreground` | `var(--citie-accent-foreground)` | `#f5f5f6` | Rótulo do item ativo |
| `--citie-sidebar-primary` | `var(--citie-brand-primary)` | `var(--citie-brand-primary)` | Botão primário da sidebar |
| `--citie-sidebar-primary-foreground` | `var(--citie-brand-contrast)` | `var(--citie-brand-contrast)` | Rótulo do primário |
| `--citie-sidebar-border` | `#e8eaed` | `#34343a` | Divisor decorativo |
| `--citie-control-height-mini` | `24px` | idem | Botão e campo em linha de tabela |
| `--citie-control-height-xl` | `48px` | idem | Tela de entrada e formulário de cidadão |
| `--citie-spacing-0-5` | `2px` | idem | Padding vertical do badge |
| `--citie-spacing-1-5` | `6px` | idem | Gap e padding do botão Mini e Small |

## Tokens alterados

| Token | Antes | Depois (claro / escuro) |
| --- | --- | --- |
| `--citie-radius-lg` | `8px` | `10px`, o `radius` do kit; comentário de papel reescrito para os cinco degraus |
| `--citie-control-height-normal` | `40px` | `36px` |
| `--citie-control-height-large` | `48px` | `40px` (o 48 virou `-xl`) |
| `--citie-state-hover-overlay` | `rgba(18,97,228,.08)` / `rgba(77,139,252,.14)` | `var(--citie-accent)` nos dois temas |
| `--citie-state-selected` | `#eff5ff` / `rgba(77,139,252,.14)` | `var(--citie-accent)` nos dois temas |
| `--citie-state-focus-ring` | `0 0 0 3px rgba(18,97,228,.4)` / `.5` | `0 0 0 3px rgb(18,97,228)` / `rgb(77,139,252)`, opaco |
| `--citie-state-focus-ring-danger` | `0 0 0 3px rgba(220,38,38,.4)` / `rgba(252,165,165,.5)` | `rgb(220,38,38)` / `rgb(252,165,165)`, opaco |
| `--citie-shadow-controle` | `0 1px 2px rgba(16,24,40,.1)` | `0 1px 2px rgba(0,0,0,.05)`; escuro mantido em `.45` |
| `--citie-shadow-raised` | contato + ambiente longa | `0 1px 3px 0 rgba(0,0,0,.1), 0 1px 2px -1px rgba(0,0,0,.1)` (shadow-sm); escuro em `.45` |
| `--citie-shadow-dialog` | `0 4px 8px .08 + 0 24px 56px -12px .22` | `0 10px 15px -3px rgba(0,0,0,.1), 0 4px 6px -4px rgba(0,0,0,.1)` (shadow-lg); escuro em `.6` |

`--citie-shadow-overlay` ficou como estava (cobre o shadow-md). `--citie-radius-md`
6px, `--citie-control-height-small` 32px e a família de neutros não mudaram.
Os 21 travessões que existiam nos comentários de `tokens.css` foram trocados por
dois pontos, vírgula ou ponto e vírgula.

## Medições de contraste

Calculadas pela fórmula de luminância relativa da WCAG (script em
`$CLAUDE_JOB_DIR/tmp/contraste.mjs`), com quatro dígitos e arredondadas a dois.

### Anel de foco: 0,4 contra opaco

| Par | Valor | Resultado |
| --- | --- | --- |
| Anel 40% de `#1261e4` composto sobre `#ffffff` (= `#a0c0f4`) | 1,85:1 | reprova 3:1 |
| Anel 50% de `#4d8bfc` composto sobre `#1a1a1d` (= `#34528d`) | 2,27:1 | reprova |
| Anel opaco `#1261e4` sobre `#ffffff` | 5,45:1 | passa |
| Anel opaco `#1261e4` sobre `#fafafa` | 5,22:1 | passa |
| Anel opaco `#4d8bfc` sobre `#1a1a1d` | 5,30:1 | passa |
| Anel opaco `#4d8bfc` sobre `#141414` | 5,63:1 | passa |
| Anel de perigo opaco `#dc2626` sobre `#ffffff` | 4,83:1 | passa |
| Anel de perigo opaco `#fca5a5` sobre `#1a1a1d` | 9,15:1 | passa |

Escolha: opaco nos dois temas, como no kit. O anel de perigo acompanhou para
manter a anatomia declarada no próprio comentário ("mesma anatomia e opacidade
do anel de marca").

### Accent e derivados

| Par | Valor | Resultado |
| --- | --- | --- |
| `text-primary` `#202020` / `accent` `#eff5ff` | 14,88:1 | passa |
| `text-base` `#3c3c3c` / `accent` `#eff5ff` | 10,07:1 | passa |
| `text-secondary` `#6b7177` / `accent` `#eff5ff` | 4,51:1 | passa |
| `brand-primary` `#1261e4` / `accent` `#eff5ff` | 4,97:1 | passa |
| `accent-foreground` `#0b3c8f` / `accent` `#eff5ff` | 9,32:1 | passa |
| `text-primary` `#f5f5f6` / `accent` escuro `#202838` | 13,55:1 | passa |
| `text-secondary` `#9a9da3` / `accent` escuro `#202838` | 5,43:1 | passa |
| `brand-primary` `#4d8bfc` / `accent` escuro `#202838` | 4,51:1 | passa |
| `brand-hover` `#84aefd` / `accent` escuro `#202838` | 6,65:1 | passa |
| `accent-foreground` `#d2d3d6` / `accent` escuro `#202838` | 9,87:1 | passa |
| `text-primary` `#202020` / `accent-forte` `#d6dce4` | 11,81:1 | passa |
| `accent-foreground` `#0b3c8f` / `accent-forte` `#d6dce4` | 7,40:1 | passa |
| `brand-primary` `#1261e4` / `accent-forte` `#d6dce4` | 3,95:1 | **reprova** |
| `text-secondary` `#6b7177` / `accent-forte` `#d6dce4` | 3,57:1 | **reprova** |
| `text-primary` `#f5f5f6` / `accent-forte` escuro `#29344b` | 11,42:1 | passa |
| `text-secondary` `#9a9da3` / `accent-forte` escuro `#29344b` | 4,58:1 | passa |
| `secondary-foreground` `#202020` / `secondary` `#f4f5f7` | 14,94:1 | passa |
| `secondary-foreground` `#f5f5f6` / `secondary` escuro `#232327` | 14,37:1 | passa |
| `popover-foreground` `#ffffff` / `popover` `#202020` | 16,29:1 | passa |
| `popover-foreground` `#141414` / `popover` escuro `#f5f5f6` | 16,91:1 | passa |
| `sidebar-foreground` `#3c3c3c` / `sidebar` `#fafafa` | 10,57:1 | passa |
| `sidebar-accent-foreground` `#0b3c8f` / `sidebar-accent` `#eff5ff` | 9,32:1 | passa |
| `sidebar-primary-foreground` `#ffffff` / `sidebar-primary` `#1261e4` | 5,45:1 | passa |
| `sidebar-foreground` `#d2d3d6` / `sidebar` escuro `#141414` | 12,31:1 | passa |
| `sidebar-accent-foreground` `#f5f5f6` / `sidebar-accent` escuro `#202838` | 13,55:1 | passa |
| `sidebar-primary-foreground` `#141414` / `sidebar-primary` escuro `#4d8bfc` | 5,63:1 | passa |
| `sidebar-border` `#e8eaed` / `sidebar` `#fafafa` | 1,15:1 | divisor decorativo, sem piso |

### Candidatos rejeitados, com o número que os rejeitou

| Candidato | Par que reprovou | Valor |
| --- | --- | --- |
| Accent claro `#e4edfd` (brand-100 do briefing) | `text-secondary` `#6b7177` sobre ele | 4,19:1 |
| Accent claro `#e8effd`, `#eaf1fe`, `#ecf2fe`, `#edf3fe`, `#eef4fe` | idem | 4,28 a 4,47:1 |
| Accent escuro `#232327` (neutro 900 do briefing) | igual a `background-subtle`, a zebra da tabela; guarda de Table e TreeTable reprovou | 1,00:1 entre os dois |
| `state-selected` apontando para `accent-forte` | 27 stories com rótulo `brand-primary` ou metadado `text-secondary` sobre `#d6dce4` | 3,95 e 3,57:1 |

## Resultado dos gates

Antes de rodar foi preciso `npx playwright install chromium-headless-shell`:
o navegador não estava instalado e a suíte inteira reportava zero testes.

| Gate | Antes | Depois |
| --- | --- | --- |
| `npm run lint` | verde | verde |
| `tsc -b --force` | verde | verde |
| `npm run build-storybook` | verde | verde |
| `npm run verificar-catalogo` | verde | verde |
| `npm run test-storybook` (claro) | 780 stories | **782 / 782 verdes** (duas stories novas em Cores: Accent e Sidebar) |
| `npm run test-storybook:dark` | **75 falhas em 18 arquivos** | **62 falhas em 14 arquivos** |

O briefing citava 84 falhas em 15 arquivos no escuro; a medição real antes de
qualquer mudança foi 75 em 18 (`$CLAUDE_JOB_DIR/tmp/dark-antes-falhas.txt`).
Diferença entre as listas antes e depois: zero falha nova. As três linhas que
o `comm` aponta como novas são as mesmas três stories de CascadeSelect,
MultiSelect e TreeSelect que já falhavam, renomeadas de `32 / 40 / 48px` para
`32 / 36 / 40px`. Treze falhas do escuro foram resolvidas de tabela pelo accent
sólido (Tree 4, Listbox 3, MegaMenu 3, TieredMenu 2, MultiSelect 1): eram
contrastes de rótulo sobre o antigo véu translúcido de seleção. As 62 que
permanecem já existiam e têm causa fora deste lote (select, menu, templates).

Testes ajustados porque mediam o valor antigo por literal, e não comportamento:

- Altura `[32, 40, 48]` → `[32, 36, 40]` em Button, FloatLabel, Input, InputOtp,
  Select e SplitButton, mais o nome das stories em doze arquivos e os rótulos
  "Normal 40px" e "Large 48px" do Button.
- InputOtp `Size · normal` e SkeletonFormulario esperavam 40 no controle normal;
  SkeletonLista esperava mínimo de 40 na linha. Os três passaram a 36.
- Input (quatro pontos) e InputGroup extraíam a tinta do anel com
  `indexOf('rgba')`; o anel opaco é serializado como `rgb()`, então o token foi
  escrito em `rgb()` e a busca passou a `indexOf('rgb')`.
- Elevação buscava `/--citie-state-focus-ring/`, que agora casa dois tokens.
- Raio contava um único `24px`; com `control-height-mini` são dois.

## Fundações

- `Cores`: bloco de estado reescrito, e duas stories novas: "Accent, secundário
  e popover" (com guarda de que hover e seleção resolvem para o accent) e
  "Sidebar" (sete tokens).
- `Raio e dimensões`: papel de `md` e `lg` reescrito, `mini` e `xl` na tabela,
  tabela de contexto com a linha "item aninhado", pilha de exemplo em 16/12/10.
- `Espaçamento`: `0-5` e `1-5` na escala, alturas corrigidas na coluna de uso.
- `Elevação e foco`: `shadow-controle` e `state-focus-ring-danger` nas tabelas,
  anatomia atualizada para o shadow-sm e shadow-lg.
- `Introdução`: bloco "A referência de produto" apontando para o UI Kit.

## O que ficou fora, e por quê

1. **`state-selected` não aponta para `accent-forte`.** Vinte e cinco componentes
   pintam o rótulo selecionado em `brand-primary` e o metadado em
   `text-secondary`; sobre `#d6dce4` isso dá 3,95 e 3,57:1, e o gate claro
   reprovou 27 stories quando o token foi ligado. Fica apontando para `accent`,
   e cada lote que migrar um componente troca o rótulo por `text-primary` ou
   `accent-foreground` no mesmo commit. O token `accent-forte` já existe para
   isso.
2. **Accent claro em `#eff5ff`, e não no `#e4edfd` do kit.** O degrau do kit
   derruba `text-secondary` para 4,19:1, e a varredura mostrou que só `#eff5ff`
   sustenta os três textos. Adotar o `#e4edfd` exige trocar o metadado da linha
   em hover por `text-base` ou escurecer `text-secondary`, decisão de token do
   DesignOps (Kafka), fora deste lote.
3. **Accent escuro na matiz de marca (`#202838`), e não no neutro 900.** O neutro
   900 é o mesmo valor da zebra; a alternativa de trocar a zebra é do Lote 5.
4. **Nenhum componente mudou de raio ou de padding.** Os que consomem
   `control-height-normal` e `radius-lg` acompanharam por `var()`; os que estão
   em `radius-md` continuam em 6px até o lote deles.
5. **Padding do Large e do Extra Large (24 e 32 no kit)** fica para o Lote 1;
   a fundação de espaçamento registra a divergência na própria linha.
6. **`@property --citie-veu-de-realce`** e a soma de hover sobre zebra em Table
   não foram tocados; com o hover sólido, a composição precisa ser revista no
   Lote 5.

## Anti-slop

Rota: produto B2G com o UI Kit Citiesoft como estrutura. Tese: o kit dá as
vagas e as escalas, os tokens da casa dão a cor. Auditoria em código e nos
números; nenhum hex fora de `tokens.css`, nenhum travessão, nenhuma negação
paralela nos textos novos. Veredito do lote: **PASSOU**, com os seis itens
acima como trabalho registrado dos próximos lotes.

## Adendo de 02/09: fechamento do veredito do Gojo

Veredito em `.gauntlet/vereditos/lote0-tokens.yaml`: APROVADO, com dois MAIOR,
um POLIMENTO e o anti-slop em VOLTA PARA REFINO. O que mudou:

1. **Guarda do accent (MAIOR).** A story `Cores > Accent, secundário e popover`
   agora lê os tokens no container `[data-theme]` do decorador, e afirma:
   accent diferente de `background-surface`, `background-subtle` e
   `background-default`; contraste mínimo de 4,5:1 de text-primary,
   text-secondary e accent-foreground sobre accent, de text-primary sobre
   accent-forte, de secondary-foreground sobre secondary e de
   popover-foreground sobre popover; e 3:1 de brand-primary sobre accent. O
   cálculo WCAG vive na própria story (`contraste`, `paraRgb`). A story
   `Sidebar` afirma sidebar-accent igual ao accent do tema e 4,5:1 nos três
   pares de sidebar. Sabotagens feitas e revertidas linha a linha, sem cópia
   de arquivo:
   | Sabotagem | Claro | Escuro |
   | --- | --- | --- |
   | accent claro `#ffffff` | reprova: accent igual a background-surface | passa (o bloco escuro redeclara) |
   | accent claro `#d6dce4` | reprova: text-secondary 3,58:1 | passa |
   | accent escuro `#1a1a1d` | passa | reprova: accent igual a background-surface |
   Antes da guarda, o accent branco deixava a suíte 782 de 782 verde.
2. **Tabela de tokens lê o container (MAIOR).** `TabelaDeTokens` ganhou um
   `ref` na própria tabela e `lerValor(nome, referencia)` lê o valor computado
   ali, onde o tema já está herdado. No escuro a coluna Valor passou a
   mostrar `#202838` ao lado da amostra `#202838`. A story `Marca` lia o
   literal `#1261e4` e agora lê `brand-primary` no container, então ela passou
   a rodar de verdade no gate escuro (`#4d8bfc`).
3. **`accent-forte` com `evitar` (POLIMENTO):** "usar como hover", mais o
   aviso de que o rótulo sobre ele precisa ser text-primary ou
   accent-foreground, com os 3,95 e 3,80 medidos.
4. **MENOR fechados de passagem:** par brand-primary 3,80:1 no comentário
   escuro do accent-forte; comentário em `sidebar-accent-foreground` escuro
   explicando por que sobe a text-primary; `AchadoAberto` na story Accent
   sobre os quatro tokens em `#eff5ff`; as quatro negações paralelas novas de
   `tokens.css` e as duas de Cores reescritas em afirmação direta.
5. **Asserções de Raio tornadas robustas.** O Lote 3 acrescentou tokens de hub
   e drawer à tabela de dimensões (um deles com 36px) e renomeou a linha
   "Contêiner externo de primeiro nível" na tabela de contexto. As duas
   guardas do Lote 0 passaram a contar presença mínima e a apontar para a
   linha "Controle de formulário e de ação".

Gate depois do adendo, com a árvore compartilhada em edição por três lotes:

| Etapa | Resultado |
| --- | --- |
| lint | verde |
| tsc | **reprova em `Badge.stories.tsx` (três imports sem uso), arquivo do Lote 1** |
| build-storybook + verificar-catalogo | verdes |
| claro | 790 de 792; as duas falhas são `Badge > Peles` e `Link > identificador de registro`, do Lote 1 |
| escuro | 65 falhas, das quais 5 são `Test timed out in 15000ms` em arquivos intocados (Divider, Kbd, ButtonGroup, Listbox, Raio); 60 reais, abaixo das 62 da rodada anterior |
| `src/fundacoes` isolado | claro 40 de 40; escuro 39 de 40, com `Cores > Texto` (placeholder 3,51:1) que é dívida anterior ao lote |

A sabotagem foi feita na árvore compartilhada por edição pontual da linha do
token e reversão imediata pela mesma ferramenta; nenhum arquivo foi copiado ou
restaurado por cima. A recomendação do Gojo de sabotar em worktree próprio
fica registrada para as próximas rodadas.
