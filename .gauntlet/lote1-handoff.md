# Lote 1: ações na pele do UI Kit Citiesoft

Branch `revisao`, sem commit. Tocados: `atoms/Button`, `atoms/Link`, `atoms/Badge` (Badge, Tag e a escala de Status; Chip só mudou de comentário), `atoms/Kbd`, `molecules/ButtonGroup`, `molecules/SplitButton`, mais o bloco `/* Lote 1 */` nos dois temas de `src/tokens/tokens.css`. Capturas nos dois temas em `.gauntlet/capturas-lote1/` (40 arquivos, gerados do `storybook-static` por Playwright).

## Anatomia, com o valor do kit ao lado

- **Button** (kit: 24/32/36/40/48, padding 8/12/16/24/32, gap 6/6/8/8/8, raio 10): `size` ganhou `mini` e `xl`; a story `Tamanhos` mede altura, padding, gap e raio por degrau. Prop nova `rounded` (Roundness = Round). Variante nova `outline`; `text` virou a pele Ghost (rótulo `text-base`, hover `accent`); `secondary` virou a pele Secondary (fundo `--citie-secondary`). Pele preenchida compartilhada por primary, success, danger, warn, info e contrast: traço de 1px em gradiente num `::before` com máscara (a `--citie-aresta-preenchimento` que já existia vira o topo do traço), anel de 1px na matiz a 80% por `color-mix` e brilho `0 2 4` na tinta `*-background` da família. Hover sólido: o traço some por opacidade e transiciona. Foco: `ring, elevação`, e a story `FocoEmTodasAsVariantes` cobre as nove variantes com a sonda `anelDoSistema` intacta.
- **Badge e Tag** (kit: 20, padding 2×8, gap 4, raio 10, SemiBold 12/16): escala de marcador 16/20/24 (era 24/28/32), `line-height` em `--citie-linha-mini`, raio `lg`. Prop nova `pele`: `tonal` (padrão, a pele da casa), `preenchida`, `contorno`, `fantasma`, com `--sev-preenchimento`, `--sev-rotulo` e `--sev-contorno` no mapa de severidade. Chip segue em 24/28/32 porque é controle com alvo de remoção de 24.
- **Kbd**: fundo `--citie-secondary`, borda 1px, raio `md` (6), mono 12, `--citie-sombra-da-tecla` por baixo.
- **ButtonGroup**: pontas em raio 10, `isolation: isolate`, e o traço em gradiente recortado por `clip-path` na aresta de junção (senão dois aros somavam na emenda).
- **SplitButton**: gatilho quadrado (medido nos cinco degraus), pontas em raio 10. Divisor: nas peles preenchidas é o próprio anel de 1px do gatilho, que pinta por cima da ação; nas sem anel (secondary, outline, text) é `border-strong` por dentro do gatilho. Primeira versão somava os dois e a captura mostrou linha dupla; corrigido e recapturado.
- **Link**: `identificador` em Red Hat Mono com dígitos tabulares e sublinhado só no hover e foco; `discreto` em `text-secondary`, corpo 13, mesmo sublinhado. **`padrao` mantém o sublinhado permanente**, divergência declarada do kit: WCAG 1.4.1 (G183) só dispensa o traço com 3:1 contra o texto vizinho, e `brand-primary` mede 2,03:1 contra `text-base` e 2,99:1 contra `text-primary`.

## Tokens criados (bloco Lote 1, claro / escuro)

`--citie-secondary-hover` #e8eaed / #34343a; `--citie-anel-do-botao` 80%; `--citie-sombra-do-contorno` (anel neutro 16% / 24% mais 0 2 4 preta 10% / 45%); `--citie-sombra-da-tecla` 0 1 0 `border-strong`. Não entraram nas fundações: os arquivos de `src/fundacoes/` estão sendo editados por outros lotes em paralelo, e o briefing limitou o token novo ao bloco em `tokens.css`. Fica para quem fechar as fundações.

## Medições (script em `$CLAUDE_JOB_DIR/tmp/contraste.mjs`, WCAG relativa)

Rótulos: primary 5,45 / 5,63; secondary 14,94 / 14,37 (hover 13,52 / 11,35); outline 16,29 / 15,94; ghost 11,03 / 11,60 (hover sobre accent 10,07 / 9,87); danger 4,83; info 5,45 / 8,29; contrast 16,29 / 14,95. Badge: as 24 combinações de pele por severidade estão no cabeçalho de `Badge.css`; só success e warn preenchidas no claro reprovam (3,30 e 3,19), que é o achado aberto do DS já documentado em `tokens.css`, marcado `a11y: todo` na story `Peles`, sem piorar nada que passava (Tag e Status seguem tonais). Kbd 10,11 / 10,46. Link discreto 4,94 e 4,53 (zebra) / 6,39 e 5,76. Anel do botão primary #0e4eb6 7,54 contra o branco e 1,39 contra o preenchimento; escuro #3e6fca 3,58 contra #1a1a1d.

## Gates

| Gate | Resultado |
| --- | --- |
| `npm run lint` | verde (avisos pré-existentes) |
| `tsc -b --force` | verde |
| `npm run build-storybook` + `verificar-catalogo` | verde, 100 componentes, todas as invariantes |
| `test-storybook` (claro) | 787 / 792 na rodada completa sob carga; as 5 falhas (Formulário drawer, ScrollPanel ×2, Tree, InputGroup) são timeout de 15s de arquivos de outros lotes e **passam isoladas (41 / 41)**. Os 9 arquivos do lote: 59 / 59 |
| `test-storybook:dark` | **60 falhas em 13 arquivos** (baseline 62 em 14). Nenhuma no lote; os 9 arquivos do lote no escuro: 59 / 59 |

## Fora do lote, com motivo

1. Fundações (`Cores`, `Elevacao`) sem as linhas dos quatro tokens novos: arquivos em edição por outros lotes.
2. `userEvent.hover` na suíte não produz `:hover` de CSS (a cor do link nem mudou), então o sublinhado de `identificador` e `discreto` é provado pelo foco de teclado, que usa a mesma regra.
3. Achado do revisor do Lote 0 resolvido aqui: o texto do Button dizia "nunca abaixo de 32" e contradizia `--citie-control-height-mini`. A nota da prop `size` e a story `Tamanhos` agora dizem onde cada piso vale: `mini` (24) é pele legítima do kit em contexto denso de mouse e teclado (célula de tabela, barra de filtro, badge de ação) e coincide com o mínimo 24 × 24 da WCAG 2.5.8; `small` (32) é o piso em formulário e barra de ferramentas; cidadão e mobile somam `touchTarget="comfortable"` (44, `--citie-touch-target-comfortable`, inalterado).
4. A `--citie-aresta-preenchimento` a 28% / 40% ficou como estava; o kit usa brand-300 (mais claro). Se o revisor achar o topo do traço tímido, é ajuste desse token, do Kafka.

## Adendo após o veredito do Gojo (`vereditos/lote1-acoes.yaml`)

- **MAIOR fechado.** O cabeçalho de `Badge.css` escrevia 7,82 para primary e info tonais no escuro, que é #84aefd sobre #1a1a1d sem o véu. Medido com o véu de 14% composto: info 6,47 na superfície e 6,93 no canvas; primary com `brand-primary` **4,39** e 4,70, abaixo de AA. A tinta do primary tonal no escuro subiu para `--citie-brand-hover` (#84aefd) pela regra `[data-theme='dark'] .citie-sev--primary`, mesmo padrão de `Avatar.css`: **6,47:1 sobre #1a1a1d e 6,93:1 sobre #141414**, registrados no cabeçalho e na regra. Story nova `Tema · tonal primary e info sobre superfície escura` (globals dark, Tag sobre `background-surface`) prova a tinta pela sonda de `brand-hover`. Sabotagem feita: com a tinta antiga a story reprova (`rgb(77, 139, 252)` recebido contra `rgb(132, 174, 253)` esperado); restaurada em seguida.
- **TXT-002 fechado.** As quatro apontadas (Badge.css, Button.stories, Kbd.css, tokens.css) e mais sete da forma "X, e não Y" herdadas nos arquivos do lote foram reescritas em afirmação direta; a varredura passou a cobrir "não é X, é Y", "X, e não Y" e "não X, mas Y", com zero ocorrência nos seis componentes.
- A regra do escuro leva `:not(.citie-sev--pele-preenchida)`: a primeira versão, mais específica que a pele preenchida, trocou o rótulo do badge preenchido primary por `brand-hover` sobre o preenchimento, e o axe da story `Anatomia` reprovou no escuro. Corrigido e rerodado.
- Testes isolados do lote depois do adendo: claro 60 / 60 em 9 arquivos; escuro 59 / 59 nos outros 8 mais Badge 12 / 12 após a correção. `tsc` verde. Fundações não tocadas, conforme instrução.

Anti-slop: rota produto B2G, tese "o kit dá a pele, os tokens da casa dão a cor". Auditado em código (zero hex fora de `tokens.css`, zero travessão, zero negação paralela nos textos novos) e em captura nos dois temas. Veredito do lote: **PASSOU**.
