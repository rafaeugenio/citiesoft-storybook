# Citiesoft Storybook

Documentação executável do design system Citiesoft. Serve para três coisas:
estudar Storybook a fundo, provar o valor dele na nossa operação e virar a
vitrine pública do DS.

## De onde vem cada coisa

Duas fontes, com papéis diferentes e sem empate:

| Fonte | O que manda |
|---|---|
| `Obsidian Vault/Citiesoft/Citiesoft-Design-System/` | **Marca**: cor, tipografia, espaçamento, raio, conteúdo e regras de uso. Divergiu, o vault ganha. |
| Figma **CitieOne** (`B6fM1Aig3uPIvQ6amLObZC`) | **Estrutura**: quais componentes existem, quais variantes cada um tem e quais estados são obrigatórios. |

O arquivo CitieOne é o kit PrimeNG que a Citiesoft comprou e ainda carrega os
tokens padrão do PrimeOne/Aura: `primary` lá é azul Tailwind `#3b82f6`, não o
Citie Blue `#1261E4`. A nossa biblioteca nasce dele com a marca trocada, então
aqui a estrutura vem do Figma e a cor vem do vault. **O arquivo do Figma não é
alterado por este repo.**

## iCloud

O projeto mora em `Repositorios/`, que é sincronizado pelo iCloud, e o iCloud
corrompe `node_modules`. Por isso as dependências ficam em `node_modules.nosync`
(sufixo que o iCloud ignora) com `node_modules` apontando pra lá por symlink.

Se em algum momento o `node_modules` sumir ou quebrar, refaça assim:

```bash
rm -rf node_modules node_modules.nosync
mkdir node_modules.nosync && ln -s node_modules.nosync node_modules
npm install
```

## Comandos

```bash
npm run storybook        # workshop em http://localhost:6006
npm run test-storybook   # roda toda story no Chromium (interação + a11y)
npm run build-storybook  # build estático em storybook-static/
npm run build            # typecheck + build Vite (sanity check)
```

## Cobertura

**Port do Figma CitieOne concluído.** 70 componentes, 71 arquivos de story,
**583 stories, todas verdes** no gate de interação e acessibilidade.

| Seção | Componentes |
|---|---|
| Fundações | Tokens (cor, tipografia, espaçamento, raio, elevação) · Marca (logo por fundo) |
| Ação | Button · SplitButton · SpeedDial |
| Formulário | Input · Textarea · Select e SelectButton · Checkbox, Radio, Switch e ToggleButton · DatePicker · Upload · Slider · Rating · InputOtp · Knob · Listbox · MultiSelect · AutoComplete · CascadeSelect · TreeSelect · ColorPicker · FloatLabel · IftaLabel · Editor · Fieldset · Inplace |
| Dados | Table · TreeTable · Tree · DataView · OrderList · PickList · OrganizationChart · Pagination · Search · Filtros · Marcadores (Badge, Tag, Chip, Status) · Avatar · Timeline e audit log · Gráficos · Widgets · MeterGroup |
| Feedback | Toast e Message · EmptyState · Skeleton · Progresso e Spinner · BlockUI · Terminal |
| Overlay | Dialog, ConfirmDialog e Drawer · ConfirmPopup · Tooltip e Popover · ContextMenu |
| Layout | Card · Panel · Tabs e Accordion · Divider · Toolbar · Splitter · ScrollPanel |
| Navegação | Breadcrumb · Stepper · Sidebar · Menu · Menubar · MegaMenu · TieredMenu · PanelMenu · Dock · ScrollTop |
| Mídia | Carousel · Galleria · Image · ImageCompare |

O guia usado no port está em **`docs/PORT-GUIDE.md`**: convenções, tokens
disponíveis e as armadilhas de acessibilidade que reprovam o build. É leitura
obrigatória antes de acrescentar componente novo.

## Regras deste repo

1. **Uma story por estado, não uma story com 8 controles.** Só estado nomeado
   entra no CI, no snapshot visual e na varredura de acessibilidade.
2. **Story nomeada pelo domínio real:** `Excluir benefício`, nunca `Story3`.
   Os rótulos usam o padrão de conteúdo do DS (verbo no infinitivo + objeto).
3. **Sem backend.** Dados mockados e determinísticos, senão o snapshot visual
   quebra sozinho e o time para de confiar no gate.
4. **Estados de erro e vazio existem.** É o que mais falta na doc textual atual.
5. **a11y roda em modo `error`.** Em B2G isso é gate legal (e-MAG / WCAG 2.2 AA),
   então quebra o CI desde o dia 1.
6. **Achado de acessibilidade não se silencia sem decisão de design.** Ver abaixo.

## Achados abertos do design system

Todos descobertos pelos próprios gates do repo ao portar as specs. Ficam
registrados como stories (o valor oficial ao lado da correção proposta) até o
time de Design decidir.

### 1. Contraste de botão (achado do gate de a11y)

| Token | Par | Contraste | Situação |
|---|---|---|---|
| `color.feedback.success.emphasis` #16A34A | rótulo branco 14px | **3,30:1** | Falha AA. Proposta: `success.text` #15803D (5,02:1). |
| `color.feedback.warning.emphasis` #D97706 | rótulo branco 14px | **3,19:1** | Falha AA. Proposta: `warning.text` #B45309 (5,02:1). |

Passam: `brand.primary` #1261E4 (5,45:1), `danger.emphasis` #DC2626 (4,83:1),
`info` #146BFA (4,65:1). A spec do botão afirma o limiar de 4,5:1 mas só validou
o par do primary, e foi assim que success e warn passaram batido.

### 2. Paleta categórica de gráfico (achado do validador de daltonismo)

A paleta oficial `chart.cat.1` a `chart.cat.8` reprova a validação:

- Com 4 séries, âmbar #F59E0B e verde #22C55E ficam a **ΔE 5,7 em protanopia**,
  abaixo do piso de 6 (que já exigiria codificação secundária).
- No conjunto de 8, verde #22C55E e teal #14B8A6 ficam a **ΔE 11,3 mesmo para
  visão tricromata**, ou seja, difíceis de distinguir para qualquer pessoa.
- Quatro cores ficam abaixo de 3:1 contra o fundo claro (#00B5F0, #22C55E,
  #F59E0B, #14B8A6).

Proposta de 6 slots que passa em todos os checks, em claro e escuro, mantendo o
azul de marca na primeira posição:

`#1261E4 · #B45309 · #7C3AED · #15803D · #0891B2 · #DC2626`

Está na story "Dados/Gráficos → Paleta · validação", com o mesmo gráfico
renderizado nas duas paletas. Para reproduzir o veredito:

```bash
node <skill dataviz>/scripts/validate_palette.js "#1261E4,#B45309,#7C3AED,#15803D,#0891B2,#DC2626" --mode light
```

### 3. Contraste do placeholder (achado do gate de a11y)

`color.text.placeholder` #A8ACB3 dá **2,27:1** sobre o fundo branco e reprova
WCAG AA para texto. É o mesmo valor de `color.text.disabled`, e usar cinza de
desabilitado como placeholder é um problema conhecido de acessibilidade.

Aqui o token usa `text.secondary` #6B7177 (4,63:1), que passa. Em `::placeholder`
nativo a varredura não acusa, porque o axe não inspeciona pseudo-elemento, mas o
contraste é o mesmo para quem precisa ler.

### 4. Divergência entre o Figma CitieOne e o vault

O kit do Figma nunca teve os tokens de marca substituídos. Enquanto isso não for
feito lá, todo componente portado a partir dele precisa da troca manual de cor.
Valores conferidos: `primary` #3b82f6 contra #1261E4, `primary/hover` #2563eb
contra #0E4DB8, `text` #334155 contra #3C3C3C, borda de campo #e2e8f0 contra
#E8EAED, padding de campo 10,5/7 contra 16/12.

### 5. Falta token de fonte monoespaçada

O vault define **Red Hat Mono** para referências técnicas que exigem alinhamento
caractere a caractere, mas não existe token equivalente em `02-tokens`. O
Terminal declara a pilha localmente e registra a lacuna. Proposta: criar
`--citie-font-mono` com `'Red Hat Mono', ui-monospace, Consolas, monospace`.

### 6. Lacunas de spec resolvidas por inferência

Valem decisão formal do time de Design:

- **Hover e active das variantes success, warn e contrast do botão** não existem
  como token. A spec só define o escurecimento da variante de marca.
- **`color.form.field.border`, `color.text.placeholder`, `color.form.helper`,
  `color.border.danger` e `color.state.loading.spinner`** são citados nas specs
  de campo mas não aparecem na tabela de tokens; aqui viraram aliases dos tokens
  equivalentes (`border.default`, `state.disabled.text`, `text.secondary`,
  `danger.emphasis`, `brand.primary`).

## Decisões de implementação que valem saber

- **`<dialog>` nativo** em Dialog, ConfirmDialog e Drawer: entrega prisão de foco,
  inerte no fundo e Escape sem reimplementação. O ConfirmDialog reposiciona o foco
  para "Cancelar" porque `showModal` o joga na ação destrutiva.
- **`<select>` nativo** no Select: teclado, papel de listbox e anúncio de seleção
  de graça. O MultiSelect é próprio, porque precisa de painel com filtro e chips.
- **Listbox em `div` com papéis explícitos**, não em `ul`/`li`: `role="group"`
  não é permitido em `li`, e um `li` sem papel dentro do listbox quebra a cadeia
  listbox → group → option.
- **Toda região rolável é focável.** Lista com `overflow` sem `tabindex` reprova
  no axe, inclusive quando o componente está desabilitado.
- **Clique de item em árvore vai no próprio `treeitem`**, com `stopPropagation`:
  é nele que o clique cai, e sem interromper o evento selecionar um filho
  marcaria os ancestrais junto.
- **`aria-required` não vale em `button`.** Em gatilho de campo, a
  obrigatoriedade fica no asterisco do rótulo.
- **Escape em `dialog` modal é ação padrão do navegador**, que emite `cancel`. O
  keydown sintético do `userEvent` não dispara ação padrão, então o teste emite o
  `cancel` diretamente. Vale a mesma coisa para as setas do `input[type=range]`.
- **Altura de célula de tabela** fica no `height` com o respiro vertical no
  container interno: em tabela o padding soma por cima do `height` (48+12+12+borda
  daria 73px).
- **Gráficos em SVG puro**, sem biblioteca, com tabela alternativa sempre
  disponível e rótulo direto com até 4 séries.

## Trilha de estudo

- **Etapa 1, modelo mental.** Abra `Button.stories.tsx` e entenda três conceitos:
  `args` (as props da story), `Meta`/`StoryObj` (formato CSF3) e decorators
  (`.storybook/preview.tsx`). Isso é 80% do Storybook.
- **Etapa 2 e 3, feitas.** Todos os componentes do DS portados com tokens reais.
- **Etapa 4, decisão de produção.** Vitrine pública do DS em React, ou Storybook
  dentro do repo Angular do produto (`@storybook/angular`, CSF3 com
  `moduleMetadata` para os providers do PrimeNG, e Compodoc gerando a tabela de
  `@Input`/`@Output` a partir do JSDoc).

## Regressão visual

O addon Chromatic já está instalado. Para ligar, crie o projeto em chromatic.com,
pegue o token e rode `npm exec -- chromatic --project-token=<token>`. Cada story
vira um snapshot e o diff aponta o pixel que mudou entre commits.
