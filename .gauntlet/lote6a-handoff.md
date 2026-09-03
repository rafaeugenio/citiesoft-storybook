# Lote 6a: quatro peças novas do kit, sem par anterior no catálogo

Branch `revisao`, sem commit. Tocados: `molecules/Item`, `molecules/Command`,
`molecules/ToggleGroup` (todos novos), `organisms/AlertDialog` (novo), mais o
bloco `/* Lote 6a */` em `tokens.css` (dois tokens dimensionais, sem redeclaração
no escuro), `docs/atomic-design/classificacao.json` (quatro entradas) e um
parágrafo novo em `.storybook/docs/VisaoGeral.mdx`.

## Anatomia, com o valor do kit ao lado

- **Item** (kit: sem medida própria, mencionado só como conjunto): a mídia em
  ícone reaproveita a caixa do hub do `Card` (`--citie-hub-caixa-de-icone` 36,
  `--citie-hub-raio-da-caixa` 8, Lote 3); avatar, imagem e pilha reaproveitam
  `Avatar`/`AvatarGroup`. Três variantes (`default`, `outline` borda 1px raio
  10, `muted` fundo `background-subtle`), dois tamanhos. Botão desabilitado
  mantém o papel de controle (`<button disabled>`), não colapsa para `<div>`:
  a primeira versão colapsava, e o teste que pedia `getByRole('button')`
  reprovou porque o elemento sumia da árvore de acessibilidade em vez de
  aparecer desabilitado.
- **ToggleGroup** (kit: 24/32/36, raio 10, peles outlined/ghost): segmentos na
  junção do `ButtonGroup` (Lote 1), raio só nas pontas, borda compartilhada na
  pele `outlined`; `ghost` sem borda nenhuma (`border: none` explícito, a
  primeira versão só zerava a cor e a borda continuava com `border-style:
  solid` transparente, e o teste de anatomia mede `borderStyle`). Ativo em
  `accent-forte` + `text-primary` (Lote 0). `tipo="unica"` publica
  `radiogroup` com roving tabindex e as setas selecionam ao mover; `tipo=
  "multipla"` publica `group` com `aria-pressed`, todo item tabulável, e as
  setas só movem o foco.
- **Command** (kit: campo de busca na pele do controle, item de 32 raio 6,
  ícone 16): campo `role="combobox"` com `aria-activedescendant`, lista
  `role="listbox"` sempre visível e filtrada em tempo real (sem acento, sem
  caixa). Vazio usa `EmptyState` `size="sm"` como irmã da listbox, nunca
  filha: `role="listbox"` só aceita `option` (ou grupo de `option`) por
  `aria-required-children`, e a primeira versão colocava o `EmptyState`
  (`role="status"`) dentro dela, reprovado pelo axe. Item desabilitado usa
  `pointer-events: none` no CSS, e a guarda em JavaScript
  (`if (!item.desabilitado) onSelect(...)`) é o que o teste prova disparando
  o clique via `fireEvent`, porque o clique real do `userEvent` já é barrado
  pelo CSS antes de chegar ao componente. Story `DentroDeDialog` compõe o
  `Dialog` do `Overlay` (Lote 3) como paleta modal com gatilho `Ctrl+K`.
- **AlertDialog** (briefing: 480, raio 10, sombra `dialog`, caixa de ícone 40
  com ícone 20): organismo novo com `<dialog>` nativo próprio, sem importar
  de `Overlay.tsx` porque o arquivo está em edição pelo Lote 3 na mesma
  árvore. Caixa de severidade usa `.citie-sev--danger`/`--warn` de
  `tokens/severidade.css` (Lote 1), a mesma fonte de cor do `Badge` e do
  `Toast`. `severidade="destrutiva"` mapeia para ícone de lixeira e botão
  `danger`; `severidade="critica"` para ícone de alerta e botão `primary`
  (crítico mas reversível, como enviar para aprovação). Foco inicial em
  "Cancelar", `role="alertdialog"` com `aria-describedby`.

## Tokens criados (bloco `/* Lote 6a */`, só em `:root`, dimensionais)

`--citie-alert-dialog-caixa-de-icone` 40px, `--citie-alert-dialog-icone` 20px,
`--citie-largura-alert-dialog` 480px. Os três vêm do briefing do lote, não do
dossiê medido do Figma (`AlertDialog` não tem anatomia própria lá). Não
entraram na fundação `Raio e dimensões`: nenhum dos quatro componentes tem
story própria na fundação ainda, e o briefing não pediu essa varredura para
o Lote 6a.

## Achado corrigido em teste, não em produto

Todo achado abaixo apareceu ao rodar a suíte, e a causa foi diferença entre
evento sintético e evento confiável do navegador, não bug de produto:

1. `AlertDialog`: `userEvent.keyboard('{Escape}')` não disparava o `cancel`
   nativo do `<dialog>`, porque o Chromium só aciona esse cancelamento para
   eventos `isTrusted`. A story `EscapeCancela` passou a disparar o `cancel`
   diretamente com `fireEvent`, que testa a mesma cadeia (`preventDefault` +
   `onClose` + efeito que fecha), documentado como a mesma limitação de
   `:hover` já registrada no Lote 1.
2. `Item`: a story testava foco com `click` seguido de `tab()`, que move o
   foco PARA FORA do botão recém-clicado. Corrigido para verificar o foco
   logo após o clique, que em Chromium já vai para o `<button>` nativo.

## Gates

| Gate | Resultado |
| --- | --- |
| `tsc -b --force` | verde |
| `oxlint` (4 pastas do lote) | 0 erros |
| `storybook build` (pasta privada `$CLAUDE_JOB_DIR/tmp/static-lote6a`) + `verificar-catalogo` | verde, 104 componentes em `classificacao.json`, cadeia narrada da Visão Geral intacta |
| `test-storybook` claro, isolado (4 arquivos) | 25/25 |
| `test-storybook:dark` isolado (4 arquivos) | 25/25 |
| `test-storybook:dark` suíte inteira (823 stories, árvore com Lote 5 em curso) | 37 falhas em 10 arquivos, **nenhuma nos quatro do lote**; todas em CascadeSelect, MultiSelect, TreeSelect, AutoComplete, Search, ContextMenu, Sidebar, Terminal, Dashboard, PainelDeTFD e `fundacoes/Cores`, a mesma dívida já registrada nos Lotes 2 e 4 |

`storybook-static/` foi symlinkado para a pasta privada só durante a checagem
do catálogo e restaurado ao original logo em seguida, para não atropelar o
build de outros lotes rodando em paralelo.

## Composição narrada na Visão Geral

Novo parágrafo em `VisaoGeral.mdx`, fora da `CADEIA_NARRADA` verificada pelo
script (que só cobre Button/DataView/Listagem/ConsultaDeProcessos), mas
conferido manualmente contra o código: `Item` importa `Avatar` e
`AvatarGroup`; `AlertDialog` importa `Button` e `tokens/severidade.css`;
`Command` **não** importa `Item` (anatomia de linha diferente, ícone de 16
sem caixa contra a caixa de 36 do `Item`), o texto foi escrito para não
afirmar essa composição depois de eu ter cogitado forçá-la e desistir.

## Fora do lote, com motivo

1. `Item`, `Command`, `ToggleGroup` e `AlertDialog` não entraram na fundação
   `Raio e dimensões` nem em `Elevacao.stories.tsx`: o briefing do Lote 6a não
   pediu essa varredura, e ela está reservada à tarefa 15 (varredura final das
   fundações).
2. `ConfirmDialog` (Overlay, Lote 3) não foi alterado nem unificado com
   `AlertDialog`: são duas peças do catálogo com propósito parecido e anatomia
   diferente (com e sem caixa de ícone), e o mapa do kit já os lista como
   pares distintos.

Anti-slop: rota produto B2G, tese "peça nova reaproveita token e anatomia já
publicada em vez de inventar valor". Zero hex fora de `tokens.css`, zero
travessão, zero negação paralela nos textos novos, conferido em código e nas
descrições de story. Veredito do lote: **aguardando revisão cega.**

## Adendo após o veredito do Tanjiro (`vereditos/lote6a-novos.yaml`)

Reprovado com um BLOQUEADOR e dois MAIOR. Os três, fechados:

1. **BLOQUEADOR + MAIOR (foco não preso + duplicação).** `useDialogModal`
   (`Overlay.tsx`) ganhou um terceiro efeito: keydown de Tab/Shift+Tab nos
   elementos focáveis do `dialog`, reciclando do último para o primeiro e do
   primeiro para o último. É o mesmo hook que `Dialog`, `ConfirmDialog` e
   `Drawer` já usavam, então os três ganharam a prisão de foco de graça.
   `AlertDialog.tsx` apagou os dois efeitos duplicados (`showModal`/`close` e
   o listener de `cancel`) e passou a chamar `useDialogModal`, agora
   exportado. O comentário de `Overlay.tsx` e a story `DentroDeDialog` do
   `Command`, que afirmavam "o dialog nativo já entrega prisão de foco" sem
   prova, foram reescritos para descrever o que o nativo entrega (inerte no
   fundo, Escape, devolução de foco ao gatilho) separado do que o hook
   adiciona (o ciclo de Tab). Stories novas `CicloDeTab` em
   `AlertDialog.stories.tsx` e `ConfirmDialog.stories.tsx` medem Cancelar →
   Tab → Confirmar → Tab → Cancelar (recicla) → Shift+Tab → Confirmar
   (recicla). Sabotagem própria: comentado o `addEventListener('keydown', ...)`
   no hook, as duas stories reprovaram (`Received element with focus: <body>`
   implícito, falha de `toHaveFocus` em Cancelar); restaurado e reconfirmado.
2. **MAIOR (Home/End no Command).** `aoTeclar` ganhou os branches `Home`
   (vai para o primeiro item habilitado) e `End` (vai para o último), no
   mesmo padrão do `ToggleGroup`. A story `NavegacaoPorTeclado` passou a
   cobrir os dois: depois do `ArrowDown`, `End` vai para o último item
   habilitado ("Sair" fica de fora por estar desabilitado) e `Home` volta
   para o primeiro, com `Enter` selecionando `novo-processo`.

## Gates depois do adendo

| Gate | Resultado |
| --- | --- |
| `tsc -b --force` | verde |
| `oxlint` (Item, Command, ToggleGroup, AlertDialog, Overlay) | 0 erros, 1 aviso novo de `react/only-export-components` em `Overlay.tsx` por exportar o hook ao lado dos componentes, mesma classe dos avisos pré-existentes que não derrubam o gate |
| `storybook build` + `verificar-catalogo` | verde |
| `test-storybook` claro, isolado (7 arquivos: os 4 do lote + `Dialog`, `Drawer`, `ConfirmDialog` do Overlay) | 35/35 |
| `test-storybook:dark` isolado (mesmos 7 arquivos) | 35/35 |

`Dialog` e `Drawer` não regrediram: as duas suítes de story deles seguem
100% depois da mudança no hook compartilhado.
