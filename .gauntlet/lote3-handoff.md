# Lote 3: superfícies e feedback

Branch `revisao`, sem commit. Tese visual: superfície do kit, branco de superfície com borda de 1px no degrau padrão, raio 10 em tudo que é de primeiro nível e 16 só na moldura que envolve a tela (drawer), shadow-sm em card, shadow-lg em diálogo, overlay no que flutua; a severidade sai do fundo e mora no ícone e na aresta, e só o erro tinge o texto. Tese de interação: tempos e curvas dos tokens existentes, só `transform` e `opacity` animados, pilha de toasts com recuo de escala por profundidade, `prefers-reduced-motion` zera tudo. O briefing prescritivo valeu como aprovação das teses.

## Componentes tocados e decisões (valor do kit ao lado)

- **Card** (`Card.css`, `Card.tsx`, stories): raio 10 (kit `radius`), borda `border-default` + `shadow-raised` (shadow-sm); título 16 Medium e subtítulo 14 muted; cabeçalho, corpo e rodapé sem fio, respiro em custom property por densidade (24/16/12). Card aninhado em raio 6 sem sombra. Nova `variante="hub"` com `icone`: 72px, caixa de 36 com fundo accent e raio 8, ícone 20, título 14 Medium, subtítulo 12 muted (hub do Sismental). Stories `Hub` e `Anatomia` medem altura 72, caixa 36, raio 10/8, pesos e tamanhos.
- **Panel**: pele do Card (raio 10, borda, shadow-raised), cabeçalho na superfície sem fundo recuado, título 16 Medium; aninhado em raio 6. **Fieldset**: raio 10, borda, sem sombra (bloco de campos do Sismental é cartão sem sombra); legenda 16 Medium. A divergência aberta de raio saiu de `tokens.css` e da fundação Raio.
- **Dialog**: 640 de largura (kit 640×480, `box-sizing: border-box` para medir 640 e não 642), raio 10, borda 1px, shadow-dialog (shadow-lg), título 20, subtítulo 14 muted, cabeçalho sem fio, botão de fechar de 30px com raio 6, rodapé com fio (o corpo rola por baixo dele) e dois botões à direita; rodapé de um botão só vira largura total via `:has(> :only-child)`. `md` passou de 560 para 640 e `lg` de 720 para 800. Story `Anatomia` mede tudo; `Obrigatorio` mede a largura total.
- **Drawer**: 591px (Sismental) na posição `right-md`, flutuando a 8px das bordas com raio 16 nos quatro cantos, título 24, fechar em 44 (alvo de dedo, teste existente). `lg` 720, `xl` 880 para caber com a margem.
- **ConfirmPopup, HoverCard, Popover**: raio 16 para 10. **Tooltip**: fundo `--citie-popover`, texto `--citie-popover-foreground` 12/16, padding 6×8, raio 10, seta de 6px na mesma tinta nas quatro posições; o corte em 2 linhas foi para um filho, porque no balão a terceira linha aparecia pela metade no padding. Story `Anatomia` mede cada valor.
- **Message** (Alert do kit): padding 12×16, gap 16, raio 10, fundo de superfície, borda 1px na aresta tonal existente, ícone 16 alinhado à primeira linha, título Medium 14/20, descrição muted; erro troca texto e ícone para `--citie-danger-foreground`. `outlined` usa a tinta da severidade na borda; `contrast` continua invertido. Story `MessageAnatomia` mede padding, gap, raio, fundo, ícone e as cores de aviso e de erro.
- **Toast** (Sonner): superfície branca com aresta tonal, ícone 16 na tinta da severidade, título Medium 14 (dobra até 2 linhas), descrição 14 muted, ação à direita como botão Mini de 24 em `secondary`, fechar à direita; a barra lateral de 4px saiu (LAY-004). Pilha: entrada com translate e escala, profundidade em escala (1 / 0,97 / 0,94) via `:nth-last-child(n of :not(.saindo))`, que reorganiza no mesmo quadro da saída e preserva a coreografia; `medirSaidaDaPilha` e o parse de tempo intactos, e a story `ToastEmpilhado` passou a conferir as três escalas. Feedback.tsx importa `Badge.css` porque o mapa `.citie-sev--*` mora lá e o build estático divide CSS por story (medido: ícone e aresta caíam na tinta de texto).
- **EmptyState**: prop `moldura` com as quatro variantes do kit (`nenhuma`, `contorno`, `preenchida`, `tracejada`), raio 10, padding lateral 24; tracejada em `border-strong` porque o traço interrompido some no degrau padrão. Story `Molduras` mede borda, estilo, fundo e raio.
- **Skeleton**: base `--citie-secondary`, raio 6 nas linhas e 10 em campo e card, ciclo do token mantido. SkeletonFormulario, SkeletonLista e SkeletonParagrafo não precisaram de mudança.

## Tokens criados (bloco `/* Lote 3 */` no fim de `:root`; nada no bloco escuro, são todos dimensionais)

`--citie-hub-altura` 72px, `--citie-hub-caixa-de-icone` 36px, `--citie-hub-icone` 20px, `--citie-hub-raio-da-caixa` 8px, `--citie-botao-fechar` 30px, `--citie-largura-drawer` 591px, `--citie-linha-mini` 16px, `--citie-toast-recuo-de-escala` 0.03. Todos na tabela de dimensões da fundação `Raio e dimensões`, com `uso` e `evitar`; o comentário de `--citie-radius-2xl` foi reescrito (moldura da tela) e a tabela de contexto de raio atualizada.

## Medições

Contrastes reaproveitados de `tokens.css`: ícone do hub `#1261e4` sobre accent `#eff5ff` 4,97:1 (escuro `#4d8bfc` sobre `#202838` 4,51:1); tooltip 16,29:1 claro e 16,91:1 escuro; texto de erro `#b91c1c` sobre `#ffffff` 6,47:1 e `#fca5a5` sobre `#1a1a1d` 9,15:1. Borda de card `#e8eaed` sobre superfície 1,21:1: decorativa, a sombra fecha a caixa, valor do kit. Alturas medidas por teste: hub 72, caixa 36, dialog 640, fechar 30, drawer fechar 44.

## Gates

`npm run gate`: lint só com avisos pré-existentes, `tsc` verde, build verde, catálogo com todas as invariantes, **claro 792/792 verdes** (782 antes, 10 stories novas). `npm run test-storybook:dark`: **63 falhas em 16 arquivos** contra 62 em 14 no baseline do Lote 0. Diferença por linha: 4 do baseline resolvidas por outros lotes (Button ×2, Table, TreeTable) e 3 linhas fora do baseline (Listbox idle, DonutChart, SkeletonFormulario por timeout de 15s) que **passam isoladas** nos dois temas, ou seja, timeouts da suíte inteira rodando junto com os outros lotes. Zero falha nova atribuível a este lote.

Evidência: `.gauntlet/capturas-lote3/` (73 capturas em 320/375/414/768/1280, claro e escuro, mais diálogo, drawer, tooltip, popup e pilha abertos), geradas por `.gauntlet/shoot-lote3.mjs` a partir de um build privado, porque `storybook-static/` é reescrito pelos gates paralelos e ficou com `index.json` e assets de builds diferentes.

## Fora do lote, com motivo

Registro de linha do tempo do Sismental é composição do Lote 5. Widget, Chart, Table e TreeTable continuam em raio 16 e 8 até o lote deles (registrado na fundação Raio). Fundo `#fafafa` da página contra o branco puro do kit é token do Lote 0. `.gauntlet/capturas-lote1/` na árvore não é deste lote.

Anti-slop: rota produto B2G, kit como estrutura; greps de travessão, hex fora de tokens, `transition: all` e negação paralela limpos nos arquivos reescritos; LAY-004 (barra lateral do toast) removido; LAY-005 fechado em raio 10/6/16 por token. Veredito: **PASSOU**.
