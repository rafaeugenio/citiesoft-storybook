# UI Kit Citiesoft no Figma: inventário e mapa de conversão

Fonte: `Citiesoft-Design-System` (fileKey `1jv6RI1HBUmG8Q3RVMiIds`), biblioteca publicada
"Citiesoft shadcn/ui kit", versão 1.6.0. É um fork do Obra shadcn/ui kit. Lido em
2026-09-01 via API de plugin, em modo somente leitura.

Referência de composição, e só isso: três páginas do Sismental (fileKey
`5YmNvgFbemWy8ipLoqC9iW`): `4185:3037` fluxo de acesso, `4185:3462` prontuários,
`4255:2485` administração. As outras páginas do Sismental ficam fora.

## Decisão de marca

O kit tem um único modo de marca, chamado `sismental`. As cores de marca
(`brand-shades/*`) apontam para a rampa teal do Governo do Maranhão, a tipografia
é DM Sans e o anel de foco é `#0f8f8f`. O Storybook adota a **estrutura** do kit
(vagas semânticas, escalas, anatomia de componente) e preenche o modo Citiesoft
com o azul e a tipografia oficiais que já estão em `tokens.css`. Sismental entra
como referência de composição de tela, nunca de cor.

Pendência do Rafael: DM Sans como fonte da casa ou manter Inter + Red Hat Display.
É troca de token, sem custo de refazer componente.

## Coleções de variáveis

| Coleção | Modos | Qtde | O que é |
|---|---|---|---|
| raw colors | 1 | 255 | Paleta Tailwind completa (neutral, slate, gray, zinc, stone, red, orange, amber, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose) mais `sismental/*` |
| brand colors | sismental | 28 | `brand-neutrals/50..950` → neutral; `brand-shades/50..950` → sismental; 3 combinações marca/foreground |
| semantic colors | sismental, sismental-dark | 54 | Vagas do shadcn (abaixo) |
| alpha | shadcn | 34 | white/alpha-N e black/alpha-N |
| chart colors | shadcn, shadcn-dark | 11 | categorical/chart 1..5, sentiment, shades |
| spacing (absolute) | shadcn | 37 | escala de 4: 0, 2, 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 80, 96 ... 384, 9999 |
| spacing | shadcn | 27 | apelidos 3xs=2, 2xs=4, xs=8, sm=12, md=16, lg=20, xl=24, 2xl=32, 3xl=40, 4xl=48, 5xl=64, 6xl=80, 7xl=96, 8xl=112, 9xl=128, 10xl=144 |
| border radii (absolute) | shadcn | 10 | radius-2, 4, 6, 8, 10, 12, 16, 24, 32, infinite |
| border radii | sismental | 10 | rounded-none 0, xs 2, sm 4, md 6, lg 8, **radius 10**, xl 12, 2xl 16, 3xl 24, full |
| typography | sismental | 58 | DM Sans / DM Mono; escala abaixo |
| shadows | sismental | 51 | 2xs, xs, sm, md, lg, xl, 2xl (Tailwind) |

### Vagas semânticas (modo claro → escuro)

```
background          white            → neutral-950
foreground          neutral-950      → neutral-50
primary             brand-700        → neutral-100      (no escuro o primário vira quase branco)
primary foreground  white            → neutral-950
secondary           neutral-100      → neutral-800
secondary fg        neutral-900      → neutral-100
accent              brand-100        → neutral-900      (hover de aba, linha, item de menu e sidebar)
accent foreground   brand-900        → neutral-100
muted               neutral-100      → neutral-900
muted foreground    neutral-500      → neutral-400
destructive         red-600          → #9e4042
border              neutral-200      → neutral-700
input               white            → white/5%
card                white            → neutral-900
popover             black            → white            (tooltip invertido)
focus/ring          brand-600        → neutral-700
focus/ring error    red-300          → #6d2e2f
sidebar             neutral-50       → neutral-950
sidebar foreground  neutral-700      → neutral-300
sidebar accent      brand-100        → neutral-900
sidebar primary     brand-700        → neutral-50
sidebar border      neutral-200      → neutral-800
unofficial/primary hover    brand-800   → neutral-300
unofficial/secondary hover  neutral-50  → neutral-900
unofficial/ghost hover      black/5%    → white/10%
unofficial/outline          white/10%   → white/5%
unofficial/outline hover    black/3%    → white/10%
unofficial/accent 2         neutral-200 → neutral-800   (linha selecionada, item ativo)
unofficial/border 3/4       neutral-300/400 (borda de campo em foco)
unofficial/destructive border red-500, text red-600/400, subtle red-50/950
unofficial/backdrop         black/60%
```

### Tipografia (estilos de texto do kit)

```
heading 1  SemiBold 48/48  ls -1.5
heading 2  SemiBold 30/30  ls -1
heading 3  SemiBold 24/28.8 ls -1
heading 4  SemiBold 20/24
paragraph large 18/27 · regular 16/24 · small 14/20 · mini 12/16   (Regular, Medium, SemiBold)
caption    Regular 14/21  ls +1.5
monospaced DM Mono 16/24
```

### Sombras (estilos de efeito)

```
shadow-2xs  0 1 0 0 rgba(0,0,0,.05)
shadow-xs   0 1 2 0 rgba(0,0,0,.05)                        ← campo, select, textarea
shadow-sm   0 1 3 0 .10 + 0 1 2 -1 .10                     ← card, aba ativa
shadow-md   0 4 6 -1 .10 + 0 2 4 -2 .10
shadow-lg   0 10 15 -3 .10 + 0 4 6 -4 .10                  ← diálogo
shadow-xl   0 20 25 -5 .10 + 0 8 10 -6 .10
shadow-2xl  0 25 50 -12 .10
focus ring  0 0 0 3 brand-600 (opaco)
focus ring error 0 0 0 3 red-300
```

## Anatomia medida dos componentes

Valores lidos das variantes `Roundness=Default`, tema claro. `{nome}` é a variável
ligada no Figma.

### Button (200 variantes: 5 variantes × 5 tamanhos × 2 raios × 4 estados)

| Tamanho | Altura | Padding | Gap | Texto |
|---|---|---|---|---|
| Mini | 24 | 3 × 8 {xs} | 6 | Medium 12/16 |
| Small | 32 | 6 × 12 {sm} | 6 | Medium 14/20 |
| Default | 36 | 8 × 16 {md} | 8 {xs} | Medium 14/20 |
| Large | 40 | 10 × 24 {xl} | 8 | Medium 14/20 |
| Extra Large | 48 | 12 × 32 {2xl} | 8 | Medium 16/24 |

Raio 10 {radius} em todos; `Roundness=Round` vira pílula.

| Variante | Preenchimento | Traço 1px | Efeitos |
|---|---|---|---|
| Primary | brand sólido | gradiente brand-300 → brand (aresta clara em cima) | anel 0 0 0 1 brand-700 a 80% + brilho 0 2 4 brand-100 |
| Primary hover | {unofficial/primary hover} brand-800 | nenhum | nenhum |
| Primary focus | brand | nenhum | anel 0 0 0 3 ring |
| Secondary | #f4f4f4 | gradiente #fdfdfd → neutral-300 a 70% | nenhum |
| Outline | neutral a 10% {unofficial/outline} | gradiente #fdfdfd → #f1f1f1 | 0 0 0 1 slate a 16% + 0 2 4 preto a 10% |
| Ghost | nenhum | nenhum | texto {unofficial/ghost foreground} neutral-700 |
| Destructive | red-600 sólido | gradiente red-400 → red-600 | anel 0 0 0 1 #8f0f0f a 80% + brilho red |

Icon Button: 24 / 32 / 36 / 40 quadrado, padding 4 / 8 / 8 / 10, mesma pele.

### Input (56 variantes) e Select (40)

| Tamanho | Altura | Padding | Texto |
|---|---|---|---|
| Mini | 24 | 4 × 6 | Regular 12/16 |
| Small | 32 | 5.5 × 8 | Regular 14/20 |
| Regular | 36 | 7.5 × 12 {sm} | Regular 14/20 |
| Large | 40 | 9.5 × 16 {md} | Regular 14/20 |

Raio 10. Fundo {general/input}. Borda 1px slate-200 no Input e {general/border} no
Select. Sombra xs em repouso. Placeholder slate-500 / {muted foreground}; valor
slate-700 / {foreground}.

- Focus: borda {unofficial/border 4} neutral-400 + anel 3px {focus/ring}, sombra xs some.
- Error: borda {unofficial/destructive border} red-500, sem anel.
- Error Focus: borda red-500 + anel 3px {focus/ring error} red-300.
- Disabled: igual ao repouso (a opacidade está no wrapper).
- Textarea: 320 × 76, mesma pele.
- Decoração à esquerda e à direita (ícone), prefixo e sufixo de texto como booleanos.

### Checkbox 16 × 16 · Radio 16 × 16 · Switch 33 × 18

Estados Default, Focus (anel 3px), Error, Error Focus, Disabled; Indeterminate no
checkbox. Rich Checkbox / Radio / Switch Group: cartão com linha 1 e linha 2.

### Badge (20)

Altura 20, padding 2 × 8, gap 4, raio 10, SemiBold 12/16. Primary preenchido,
Secondary {secondary} com texto slate-600, Outline 1px slate-200, Ghost, Destructive.

### Card · Dialog · Alert · Tooltip

- Card: raio 10, fundo {card}, borda 1px {border}, shadow-sm. Slots header / main / footer.
- Dialog: 640 × 480, raio 10, fundo {background}, borda {border}, shadow-lg. Header com
  fechar; footer com 2 botões à direita ou largura total.
- Alert: padding 12 × 16, gap 16, raio 10, fundo {card}, borda {border}, Medium 14/20;
  tipo Error troca o texto para {destructive text}.
- Tooltip: padding 6 × 8, raio 10, fundo {popover} preto, texto branco 12/16.

### Tabs (segmentado)

Trilho: fundo {accent}, padding 3, raio 10. Aba: padding 4 × 8, raio 10, Medium 14/20.
Ativa: fundo {background} + shadow-sm. Hover inativa: {accent}. Foco: anel 3px.
Tamanhos Small / Regular / Large, conteúdo Label / Icon / Icon + Label, contador.

### Table (Data Table)

Célula 44 de altura, padding 12, gap 8, texto Regular 14/20 slate-700. Cabeçalho
Medium 14/20, sortable com fundo {unofficial/accent 0}. Hover de linha {accent},
ativa e selecionada {unofficial/accent 2} neutral-200. Conteúdos de célula: texto 1
ou 2 linhas, ações, checkbox, badge, botões, avatar, avatar + nome, input.
Basic Table: célula 38, zebra par em {accent}, texto 16/24.

### Sidebar · Menu

- Item de sidebar: 32 de altura, padding 4 × 12, raio 6 {rounded-md}, Regular 14/20
  {sidebar foreground}; ativo {sidebar accent}; foco anel 3px. Fundo da sidebar
  {sidebar} neutral-50. Tipos Base / Expanded / Collapsed / Dropdown / Badge, 2 níveis.
- Item de menu: 32 de altura, padding 5.5 × 8, raio 6, hover {accent}, ativo e
  selecionado {accent 2}, tipo Destructive.

### Demais conjuntos do kit

Accordion (com e sem borda), Alert Dialog, Avatar (4 tamanhos, quadrado ou
redondo) e Avatar Stack, Breadcrumb, Button Group, Carousel, Charts (line, area,
bar, pie, donut, tooltips, eixos), Command, Date Picker e Calendar, Drawer, Empty
(4 variantes), Field vertical e horizontal, Hover Card, Input File, Input OTP,
Item, Kbd, Label, Link Button, Loading Button, Navigation Menu, Pagination,
Popover, Progress, Resizable, Scroll Area, Separator, Sheet, Skeleton, Slider,
Sonner (toast, 3 níveis de pilha), Spinner, Switch, Textarea, Toggle e Toggle
Group. 1603 ícones Lucide na página Icons.

## Mapa: variável do Figma → token do Storybook

A regra é manter o nome `--citie-*` existente quando o papel é o mesmo, e criar
token novo só onde o kit introduz um papel que não existia.

| Figma | Token atual | Ação |
|---|---|---|
| general/background | `--citie-background-default` | manter; valor vai para branco puro no claro |
| general/foreground | `--citie-text-primary` | manter |
| general/primary | `--citie-brand-primary` | manter |
| general/primary foreground | `--citie-brand-contrast` | manter |
| unofficial/primary hover | `--citie-brand-hover` | manter |
| general/secondary / fg | novo `--citie-secondary` / `--citie-secondary-foreground` | criar (botão e badge Secondary) |
| general/accent / fg | `--citie-state-hover-overlay` + `--citie-state-selected` | trocar o véu translúcido por `--citie-accent` sólido (brand-100) e `--citie-accent-foreground` |
| unofficial/accent 2 | novo `--citie-accent-forte` | criar (linha selecionada, item ativo) |
| general/muted / fg | `--citie-background-subtle` / `--citie-text-secondary` | manter |
| general/destructive | `--citie-danger-emphasis` | manter |
| general/border | `--citie-border-default` | manter |
| unofficial/border 3 e 4 | `--citie-form-field-border-hover` | manter a regra de contraste 3:1 já medida; o kit usa 200 no repouso, que reprova 1.4.11, então o repouso continua em `#8f8f8f` |
| general/input | `--citie-background-surface` | manter |
| card/card | `--citie-background-surface` | manter |
| popover/popover / fg | novo `--citie-popover` / `--citie-popover-foreground` | criar (tooltip invertido) |
| focus/ring | `--citie-state-focus-ring` | manter anatomia 3px; o kit usa anel opaco, avaliar 0.4 vs 1.0 medindo |
| focus/ring error | `--citie-state-focus-ring-danger` | manter |
| sidebar/* | novo `--citie-sidebar-*` (7 tokens) | criar |
| radius | `--citie-radius-lg` 8 → **10** | **mudar**: controle, campo, card, badge, aba e tooltip passam a 10; `--citie-radius-md` 6 fica para item aninhado |
| rounded-md 6 | `--citie-radius-md` | manter |
| spacing | `--citie-spacing-*` | manter escala de 4; adicionar `-0-5` 2px e `-1-5` 6px, que o kit usa em padding de Small e Mini |
| shadow-xs | `--citie-shadow-controle` | alinhar valor: 0 1 2 rgba(0,0,0,.05) |
| shadow-sm | `--citie-shadow-raised` | alinhar às duas camadas do Tailwind |
| shadow-lg | `--citie-shadow-dialog` | alinhar |
| shadow-md, xl, 2xl | `--citie-shadow-overlay` cobre md | manter |
| heading 1..4 | `--citie-font-size-display/title-*` | manter tamanhos; peso 600 já é o dominante |
| paragraph small 14/20 | `--citie-font-size-body-md` + `--citie-linha-da-celula` 20 | já batem |
| paragraph mini 12/16 | `--citie-font-size-body-xs` | manter |
| chart colors | `--citie-chart-cat-*` | manter a paleta própria já validada |
| alturas 24/32/36/40/48 | `--citie-control-height-*` 32/40/48 | **mudar**: normal 40 → 36, e criar `-mini` 24 e `-xl` 48 |

## O que muda de cara no Storybook

1. Raio 10 em todo controle e superfície de primeiro nível.
2. Altura padrão de controle 36 (era 40), com tabela de 44 por linha.
3. Hover de navegação e de tabela em tom de marca (`accent`), não em cinza.
4. Botão primário com aresta em gradiente, anel de 1px na matiz escura e brilho curto.
5. Campo com sombra xs de repouso, e foco com borda mais forte além do anel.
6. Tabs segmentadas com trilho accent e aba ativa branca elevada.
7. Tooltip invertido: fundo preto, texto branco.
8. Sidebar com fundo neutral-50 e item ativo em accent, raio 6.
9. Badge de 20px, SemiBold 12, raio 10.

## Composição de tela: o que o Sismental ensina

Capturas em `docs/referencias/sismental/`. Só composição e ritmo; cor teal e
gradiente do Governo do Maranhão ficam de fora. Ids do Figma para recorte novo:
listagem `4185:3465`, identificação `4185:5620`, evolução `4249:1670`, hub
`4255:2486`, profissionais `4279:11152`, drawer `4279:11641`, acesso `4185:3037`.

**Shell** (`sis-listagem-prontuarios.png`, `sis-form-identificacao.png`)
- Barra superior de 52px, fundo branco, borda inferior 1px: logo do cliente à
  esquerda com botão de recolher a sidebar; breadcrumb com ícone de casa; à direita
  dois botões de ícone de 30px (busca, notificações), divisor vertical e avatar de 32.
- Sidebar de 257px, fundo neutro 50: no topo um seletor de unidade em cartão
  (ícone em caixa 28px com tinta de marca, rótulo, chevron duplo); grupos com rótulo
  pequeno em negrito (Visão Geral, Atendimento, Análise, Administração) e itens de
  32px com ícone de 16 e texto 14; item ativo com fundo accent; "Sair" em vermelho
  ancorado no rodapé.
- Área de conteúdo: nas telas de formulário e de administração o conteúdo vive num
  cartão branco grande, raio 16, com margem de 8px do fundo cinza da página. Na
  listagem simples o conteúdo fica direto sobre o fundo. Rodapé "Desenvolvido por
  Citiesoft @ 2026" com a marca em azul, separado por linha fina.

**Cabeçalho de página**: título 24 SemiBold, subtítulo 16 muted logo abaixo, ação
primária alinhada à direita na mesma linha. Ou uma faixa de abas sublinhadas
(hub de administração) logo abaixo do subtítulo.

**Listagem** (`sis-listagem-prontuarios.png`, `sis-lista-profissionais.png`)
- Barra de filtro: busca larga com ícone de lupa à esquerda e um select de escopo
  à direita, ambos com 36px.
- Tabela em cartão (raio 10, borda, sombra sm): cabeçalho 14 Medium com ícone de
  ordenação; linhas de 60px na listagem de prontuários; identificador em duas
  linhas (nome 14 + CPF em mono 12 muted); badge outline para status; datas em
  mono; ação por linha como ícone de olho ou botão outline pequeno "Editar" com
  ícone de lápis; coluna de status com switch + texto; linha inativa em cinza.
- Variante em cartão com cabeçalho: título 16 Medium + subtítulo muted à esquerda,
  botão primário à direita; linha de filtro dentro do cartão; paginação embaixo à
  esquerda (Anterior, 1 2 3 4 … 10, Próximo, página atual em outline) e "Mostrando
  1 a 10 de 98 profissionais" à direita.
- Acima do cartão pode haver uma faixa de abas em pílula com ícone (Profissionais,
  Unidades, Medicamentos, Comorbidades) e um link "← Voltar".

**Formulário longo** (`sis-form-identificacao.png`, `sis-evolucao-registro.png`)
- Navegação de seções em coluna à esquerda (lista vertical de 8 rótulos, o ativo em
  cor de marca), conteúdo à direita com o título da seção em 20 Medium.
- Cada bloco de campos é um cartão (raio 10, borda 1px, sem sombra) com título 16
  Medium e grade de 2 a 4 colunas; rótulo 14 Medium com asterisco vermelho no
  obrigatório e ícone de informação quando há ajuda; campos de 36px; texto de ajuda
  12 muted abaixo do campo; data com ícone de calendário; telefone dividido em
  DDD + número; select com chevron.
- Barra de ações fixa no rodapé do cartão: "Voltar" secundário à esquerda; "Salvar
  seção" secundário e "Salvar e Avançar" primário à direita.
- Registro em linha do tempo: marcador circular vazado, título em cor de marca,
  autoria 12, carimbo "transcrito em" em mono à direita, corpo em cartão de citação,
  link "Remover" discreto à direita.

**Hub de cards** (`sis-admin-hub-cards.png`): grade de 3 colunas de cartões
326 × 72 com ícone de 20 em caixa de 36 com tinta de marca, título 14 Medium e
subtítulo 12 muted. Abas sublinhadas acima da grade.

**Drawer lateral** (`sis-drawer-cadastro.png`): 591px à direita, raio 16 nos
cantos, título 24 e botão de fechar no topo, blocos de campos em cartão, ação
primária dentro do bloco quando é uma consulta (Consultar CNES) com explicação em
prosa abaixo.

**Acesso** (`sis-fluxo-acesso.png`): cartão dividido com margem de 10px da tela;
painel branco à esquerda com logo no topo esquerdo e "Não tem uma conta? Cadastre-se"
no topo direito; ícone em círculo com anel de marca, título 24, subtítulo, campos
com ícone à esquerda, ação primária de largura total; painel de marca à direita;
rodapé Citiesoft. Cinco telas: entrar, criar conta, recuperar senha, verificar
e-mail com OTP, criar nova senha.

## Componentes do Storybook sem par no kit

Estes seguem os mesmos tokens e a mesma anatomia, sem referência direta:
AutoComplete, CascadeSelect, ColorPicker, ConfirmPopup, Dock, Editor, Fieldset,
FloatLabel, Galleria, IftaLabel, ImageCompare, Inplace, Knob, Listbox, MegaMenu,
Menubar, MeterGroup, MultiSelect, OrderList, OrganizationChart, PanelMenu,
PickList, Rating, ScrollTop, SpeedDial, SplitButton, Splitter, Terminal,
TieredMenu, Timeline, Tree, TreeSelect, TreeTable, Upload, ValorMonetario,
PrazoIndicador, Widget, Sparkline.

## Componentes do kit sem par no Storybook

Command, Item, Input File, Input OTP (temos InputOtp), Resizable (temos
Splitter), Scroll Area (temos ScrollPanel), Sheet (temos Sidebar/drawer),
Sonner (temos Toast em Feedback), Loading Button, Toggle e Toggle Group (temos
SelectButton), Alert Dialog (temos ConfirmPopup e Overlay), Aspect Ratio.
Candidatos a criar: Command, Item, Toggle Group, Alert Dialog.

## Dívida aberta depois da varredura de fundações

Registrada na varredura que consolidou os blocos de lote de `tokens.css`
(`.gauntlet/varredura-fundacoes.md`). Cada item tem dono declarado, para
nenhum deles ficar esperando que alguém se lembre.

**Paleta de gráfico sem página de fundação.** Os dezesseis tokens
`--citie-chart-cat-*`, `--citie-chart-alt-*`, `--citie-chart-grade` e
`--citie-chart-meta` são os únicos do arquivo sem linha de tabela em
`src/fundacoes/`. Quem escolhe cor de série hoje lê `src/tokens/paletas.ts`, que
é código, ou copia do `Chart`. A ordem categórica, a alternativa para daltonismo
e a regra de quando trocar de família precisam de página própria, com a mesma
coluna de uso e de evitar das outras fundações. Trabalho de uma rodada de
fundação de visualização de dados, fora do escopo de repaginada de componente.

**`--citie-text-placeholder` reprova AA no tema escuro.** O valor escuro é
`#6b7177` e mede **3,51:1** sobre `#1a1a1d`, abaixo dos 4,5:1 que a WCAG 1.4.3
exige de texto normal. É a causa da falha de eixo escuro em
`Fundações/Cores > Texto`, e ela é anterior a esta varredura. O comentário do
token em `tokens.css` documenta apenas o achado do tema claro.
Corrigir exige escolher um degrau mais claro da família de neutros, o que é
decisão de token do DesignOps.

**A verificação do catálogo passou a ter oito invariantes.** A oitava confere que
todo arquivo de componente que escreve classe de folha compartilhada importa a
folha (hoje `src/tokens/severidade.css`). O achado L3-08 mostrou que o runner do
Storybook injeta o CSS de todas as stories no mesmo documento, então um
componente sem o import continua pintado no teste e aparece sem pele quando
montado sozinho. A checagem foi sabotada removendo o import de
`src/components/atoms/Avatar/Avatar.tsx`, e ela reprovou com mensagem nomeando o
arquivo. `scripts/verificar-catalogo.mjs` também aceita agora `CITIE_STATIC`, para
apontar a checagem para um build construído em pasta privada.
