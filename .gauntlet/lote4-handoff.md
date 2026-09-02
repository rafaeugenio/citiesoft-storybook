# Lote 4: navegação, no estilo do kit

Tocados: `molecules/Tabs`, `molecules/Navigation` (Breadcrumb),
`organisms/Sidebar`, `Menu`, `Menubar`, `TieredMenu`, `ContextMenu`,
`PanelMenu`, `MegaMenu`, `molecules/SpeedDial`, `Pagination`. Dock não mudou:
já usava `control-height-normal` (36), `radius-lg` (10) e
`state-hover-overlay` (resolve para `accent` desde o Lote 0).

## Decisões de anatomia (valor do kit ao lado)

- Tabs segmentado (`pill`): trilho `accent` com `radius-lg` (kit: raio 10;
  padding em `spacing-1` 4px, degrau mais próximo do 3 medido, não existe
  token de 3px). Ativa em `background-surface` + `shadow-raised` (shadow-sm),
  hover inativa em `accent-forte`. Tamanhos sm/md/lg migrados de 32/40/48
  fixos para `control-height-small/normal/large`. Novo conteúdo Icon e
  Icon+Label: `icone` e `somenteIcone` em `AbaProps`.
- Item de menu (Menu, TieredMenu, ContextMenu, MegaMenu, submenu do Menubar):
  32 de altura, padding `spacing-1-5 x spacing-2` (6x8, kit mede 5,5x8), raio
  6. Painel flutuante em `radius-lg` (10), era `radius-2xl` (16). Ativo e
  selecionado (TieredMenu aberto, Menubar ativo, MegaMenu ativo, PanelMenu
  ativo) migrado de `brand-primary`/`brand-subtle` para `accent-forte` com
  `text-primary`: brand-primary sobre accent-forte reprova 3,95:1, Lote 0.
  Menubar mantém item de barra em 36, como o briefing especifica.
- PanelMenu: cabeçalho 40, corpo 32.
- Sidebar ganhou `variante` (`drawer` padrão, preserva o comportamento atual;
  `fixa` nova). Fixa: 257px, fundo `sidebar`, borda `sidebar-border`, item 32
  padding 4x12 raio 6, ativo em `sidebar-accent`/`sidebar-accent-foreground`
  sem barra lateral, fundo já marca o estado. Slots `cabecalho` e `rodape`
  (cartão de contexto, item ancorado). Colapsada vira ícone de 36 centrado,
  tooltip pelo `title` já existente.
- Breadcrumb: item em `text-secondary` (era `text-base`), atual em
  `text-primary`, separador virou chevron SVG de 16 (era "/"), ícone de casa
  no primeiro nível.
- Pagination: botão 36 raio 10 (era raio 6), página ativa em outline
  `brand-primary` + `shadow-controle` (shadow-xs), não mais preenchimento
  sólido. "Anterior"/"Próximo" com texto na variante completa. Resumo virou
  "Mostrando X a Y de Z registros". Alvo ampliado 44px ficou literal (WCAG
  2.5.8, fora da escala de controle).
- SpeedDial: hover da ação de `brand-subtle`/`brand-primary` para
  `accent`/`accent-forte`/`accent-foreground`, a pele dos itens de menu.

Nenhum token novo; `spacing-1-5` (Lote 0) virou padding vertical do item.

## Gates (isolado no lote, árvore com 4 lotes em curso)

| Gate | Resultado |
| --- | --- |
| `tsc -b --force` | verde |
| `oxlint`, 12 arquivos | 0 erros, 4 avisos pré-existentes fora do lote |
| `verificar-catalogo` | verde, 792 stories |
| `build-storybook` | verde |
| `test-storybook` claro, isolado (14 arquivos) | 86/86 |
| `test-storybook:dark` isolado (14 arquivos) | 86/86 |
| `test-storybook:dark` suíte inteira | 58 falhas em 12 arquivos, todos fora do lote (CascadeSelect, MultiSelect, TreeSelect, AutoComplete, Search, Filters, Terminal, Dashboard, Listagem, PainelDeTFD, ConsultaDeProcessos, `fundacoes/Cores`), trabalho em curso de outros lotes |

Ajustes por medir literal antigo: `Pagination.stories.tsx`, três asserções do
resumo; `TieredMenu.tsx`, `ALTURA_ITEM` 40 → 32 (contrato com o CSS).

## O que ficou fora

1. Menu, ContextMenu e MegaMenu não ganharam estado "selecionado" novo: a API
   só tinha hover, desabilitado e destrutivo, sem pedido explícito para mais.
2. Dock ficou como está: "item de 32" do briefing parece descrever a dupla
   acionador/ação do SpeedDial; Dock não tem essa dupla e já cumpria "36,
   raio 10" como pele de ícone. Sinalizado para revisão.
3. Sidebar fixa reaproveita o `title` nativo no colapsado, sem componente de
   tooltip novo, fora do escopo do lote.

## Anti-slop

Tese: item de menu tem uma anatomia única (32/6/accent-forte) reaproveitada
em cinco organismos, sem reinventar por componente. Nenhum hex fora de
`tokens.css`, nenhum travessão, nenhuma negação paralela nos textos novos.
Veredito: **PASSOU**, com os três itens acima registrados para a próxima
rodada.
