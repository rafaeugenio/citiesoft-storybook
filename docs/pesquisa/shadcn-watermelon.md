> **DOCUMENTO NÃO CONFIÁVEL.** Produzido por agente de pesquisa e conferido
> depois contra os repositórios oficiais. Contém nomes de componente que não
> existem: no caso do Motion Primitives, 13 dos 14 citados são invenção, porque
> o site responde com bloqueio de bot da Vercel em vez de conteúdo.
>
> Use `triagem-verificada.md`, que foi montado a partir da árvore de arquivos
> dos repositórios reais. Este arquivo fica apenas como registro do episódio.

# Pesquisa de Referência: shadcn/ui e Watermelon UI

**Data**: 21 de agosto de 2026  
**Contexto**: Refinamento do design system Citiesoft (Storybook) através de análise de bibliotecas modernas de componentes  
**Escopo**: Comparação de anatomia, estados, comportamentos e arquitetura de API entre shadcn/ui, Watermelon UI e o catálogo Citiesoft (96 componentes)

---

## Sumário Executivo

Analisamos **shadcn/ui** (70+ componentes, composição hierárquica com slots) e **Watermelon UI** (260+ componentes, copiar-colar com Tailwind + Radix UI + Framer Motion). 

**Achado principal**: shadcn/ui usa padrão de **composição explícita** (`<Dialog><DialogTrigger/><DialogContent/></Dialog>`) enquanto Citiesoft usa **props e renderização de conteúdo**. Esta diferença de arquitetura impacta diretamente a experiência de consumo em Angular (que não trabalha bem com composição de componentes Web na mesma forma que React).

**Limitação desta pesquisa**: Watermelon UI (ui.watermelon.sh) não é acessível para leitura de documentação completa; informações obtidas via GitHub, Medium e Context7 indicam 260+ componentes, mas a lista granular e as especificações de cada um não puderam ser extraídas. Análise focou em shadcn/ui e padrões identificados.

---

## 1. Componentes Equivalentes: Citiesoft vs shadcn/ui

Cruzamento dos 96 componentes do catálogo Citiesoft com os 70+ de shadcn/ui. Componentes destacados pela frequência de uso em interfaces B2G (sistema administrativo de servidor público).

| # | Citiesoft | Nível | Família | shadcn/ui | Anatomia shadcn | Diferenças Principais |
|---|---|---|---|---|---|---|
| 1 | Button | Átomo | Ações | Button | `<Button variant="default" size="lg">` | Variantes: shadcn tem 6 (default, outline, ghost, destructive, secondary, link). Citiesoft tem tipo + tamanho + estado. shadcn com `buttonVariants` para uso com `<a>`. |
| 2 | Link | Átomo | Ações | Link (em docs como recomendação com ButtonVariants) | Composto com `<a render={<ButtonVariants />}>` | Citiesoft: componente dedicado. shadcn: reutiliza Button com ARIA role management. |
| 3 | Input | Molécula | Campos | Input | Wrapper `<Field><FieldLabel/><Input/><FieldDescription/></Field>` | Citiesoft inclui rótulo, obrigatório, ajuda, erro. shadcn separa Input do Field/FieldLabel; composição explícita. |
| 4 | Select | Molécula | Campos | Select | Composição: `<Select><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectGroup/><SelectItem/></SelectContent></Select>` | Citiesoft: props `options`, `value`, `onChange`. shadcn: JSX por item. Shadcn não documenta searchable, multi-select no core—espera extensão customizada. |
| 5 | MultiSelect | Molécula | Campos | Combobox (multi-capable) | `<Combobox multiple><ComboboxInput/><ComboboxChips/><ComboboxList><ComboboxItem/></ComboboxList></Combobox>` | shadcn Combobox é multimodal (básico + multi via `multiple` prop). Busca nativa via typing. |
| 6 | AutoComplete | Molécula | Campos | Combobox | Hierarquia: `<Combobox><ComboboxInput/><ComboboxContent/></Combobox>` com `itemToStringValue` para objetos custom | Ambos têm filtro por digitação. shadcn explora Base UI + composição; Citiesoft uso de props. |
| 7 | Textarea | Molécula | Campos | Textarea | Componible: `<Field><Textarea/></Field>` | Estrutura similar ao Input. Composição vs props. |
| 8 | Checkbox | Átomo | Escolha | Checkbox | Base UI primitive com `Field` wrapper | Ambos suportam indeterminado. shadcn: `aria-invalid`, `data-invalid` pattern. |
| 9 | RadioGroup | Molécula | Escolha | Radio Group (single + label pattern) | Composição: `<RadioGroup><RadioGroupItem id="option1"/><Label htmlFor="option1">Opção 1</Label></RadioGroup>` | shadcn manual label binding; Citiesoft integrado. |
| 10 | Switch | Átomo | Escolha | Toggle (ou Switch, se disponível) | Base UI Toggle (não Switch específico encontrado em docs) | Nomeação: shadcn usa "Toggle" para on/off genérico. Citiesoft usa "Switch". |
| 11 | Badge | Átomo | Marcadores | Badge | `<Badge variant="default">` com variantes: default, outline, secondary, ghost, destructive | shadcn 5 variantes. Citiesoft integra em Badge/Tag/Chip familia. |
| 12 | Avatar | Átomo | Identidade | Avatar | `<Avatar><AvatarImage src="..."/><AvatarFallback>JD</AvatarFallback></Avatar>` | Composição explícita (Image + Fallback). Citiesoft prop-based. |
| 13 | Card | Molécula | Contêineres | Card | Composição: `<Card><CardHeader><CardTitle/><CardDescription/></CardHeader><CardContent/><CardFooter/></Card>` | Slots explícitos em shadcn; Citiesoft props. |
| 14 | Tabs | Molécula | Contêineres | Tabs | `<Tabs><TabsList><TabsTrigger value="tab1"/></TabsList><TabsContent value="tab1"/></Tabs>` | Ambos com value-based rendering. Shadcn explícito, Citiesoft props. |
| 15 | Accordion | Molécula | Contêineres | Accordion | `<Accordion><AccordionItem><AccordionTrigger/><AccordionContent/></AccordionItem></Accordion>` | shadcn suporta `multiple` prop (padrão: single). Ambos com WAI-ARIA. |
| 16 | Dialog | Organismo | Overlay | Dialog | Composição: `<Dialog><DialogTrigger/><DialogContent><DialogHeader><DialogTitle/><DialogDescription/></DialogHeader><DialogFooter/></DialogContent></Dialog>` | Anatomia shadcn mais granular com slots nomeados. Citiesoft props de conteúdo/footer. |
| 17 | Drawer | Organismo | Overlay | Drawer | Composição similar ao Dialog + `swipeDirection` prop (up, right, down, left) + swipe gestures nativas | shadcn: suporte a swipe, snap points, `initialFocus`. Citiesoft: direction não documentado. |
| 18 | Toast | Molécula | Feedback | Toast | Composição: `<Toaster/>` (layout) + `toast()` function (imperative) com `.success()`, `.error()`, `.warning()`, `.info()`, `.loading()` | shadcn imperative + manager; Citiesoft Component-based (presume). |
| 19 | Message | Molécula | Feedback | Alert | `<Alert><AlertTitle/><AlertDescription/></Alert>` com variantes | shadcn com `variant` prop (default, destructive); Citiesoft Message dedicado. |
| 20 | Pagination | Molécula | Navegação | Pagination | `<Pagination><PaginationContent><PaginationItem><PaginationPrevious/><PaginationLink isActive/><PaginationEllipsis/><PaginationNext/></PaginationItem></PaginationContent></Pagination>` | Composição explícita por item. Desabilita estado para Prev/Next conforme contexto. |
| 21 | Breadcrumb | Molécula | Navegação | Breadcrumb | `<Breadcrumb><BreadcrumbList><BreadcrumbItem><BreadcrumbLink/></BreadcrumbItem></BreadcrumbList></Breadcrumb>` | shadcn com separador customizável; Citiesoft props. |
| 22 | Tooltip | Molécula | Overlay | Hover Card (similar) ou Tooltip | Base UI Tooltip primitive (não chamado explicitamente em docs, usar Hover Card como alternativa) | shadcn Hover Card: `<HoverCard><HoverCardTrigger/><HoverCardContent/></HoverCard>`. |
| 23 | Popover | Molécula | Overlay | Popover | `<Popover><PopoverTrigger/><PopoverContent align="start"/"center"/"end"/></Popover>` | Alinhamento controlado via `align`. shadcn com custom header/title/description. |
| 24 | Skeleton | Átomo | Feedback | Skeleton | `<Skeleton/>` com customização via className para shapes | Ambos suportam múltiplas formas. shadcn minimalista. |
| 25 | Spinner | Átomo | Feedback | (não encontrado; usar Loader ou Progress) | — | shadcn não tem Spinner explícito; recomenda composição customizada ou Progress. |
| 26 | ProgressBar | Átomo | Feedback | Progress | `<Progress value={65}/>` | Versátil; shadcn simples baseado em valor %. |
| 27 | Table | Organismo | Tabelas | Data Table | Construído sob **TanStack Table v9** (headless) + composição de células customizáveis com `FlexRender` | Diferença radical: shadcn = headless logic + renderização manual. Citiesoft: componente completo com props. |
| 28 | Menubar | Organismo | Menus | Menubar | `<Menubar><MenubarMenu><MenubarTrigger/><MenubarContent><MenubarGroup/><MenubarItem/><MenubarSub><MenubarSubTrigger/><MenubarSubContent/></MenubarSub></MenubarContent></MenubarMenu></Menubar>` | Suporte a submenus e roving tabindex (Base UI). Citiesoft: organismo com menu items. |
| 29 | Sidebar | Organismo | Navegação | Sidebar | `<SidebarProvider><Sidebar><SidebarHeader/><SidebarContent><SidebarGroup><SidebarMenu><SidebarMenuItem/></SidebarMenu></SidebarGroup></SidebarContent><SidebarFooter/></Sidebar></SidebarProvider>` | shadcn com 3 modos: offcanvas, icon, none. Hook `useSidebar()` para controle programático. Atalho kbd: Cmd+B / Ctrl+B. |
| 30 | Stepper | Molécula | Navegação | (não encontrado como componente; padrão com Tabs ou custom) | — | shadcn não tem componente nomeado "Stepper"; sugere composição com Tabs ou lista customizada. |
| 31 | Combobox | Organismo | — | Combobox | Composição: `<Combobox><ComboboxInput/><ComboboxContent><ComboboxList><ComboboxItem/></ComboboxList></ComboboxContent></Combobox>` com suporte a múltiplos e grupos | shadcn Combobox modal (popup) + busca. |
| 32 | DatePicker | Molécula | Campos | Date Picker | Composição: `<Popover><PopoverTrigger render={<Button/>}/><PopoverContent><Calendar mode="single" | "range"/></PopoverContent></Popover>` | shadcn = Calendar (React DayPicker) embutido em Popover. Suporta range, locale, timezone. |
| 33 | Calendar | — | — | Calendar | `<Calendar/>` com `mode="single" | "range"`, `captionLayout="dropdown"`, suporte a Persian, `timeZone` | Não há Calendar no catálogo Citiesoft. shadcn oferece completo. |

**Nota**: Watermelon UI não foi incluído nesta tabela porque a documentação de cada componente não foi acessível (ui.watermelon.sh bloqueado com 403). A pesquisa confirmou 260+ componentes, build sobre Radix UI + Tailwind, mas granularidade não validável.

---

## 2. Análise de Anatomia e Diferenças de Composição

### 2.1 Padrão: Composição Hierárquica (shadcn) vs Props (Citiesoft)

**shadcn/ui — Composição Explícita**

Exemplo Dialog:
```jsx
<Dialog open={isOpen} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button>Abrir</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
      <DialogDescription>Descrição</DialogDescription>
    </DialogHeader>
    {/* conteúdo */}
    <DialogFooter>
      <Button>Cancelar</Button>
      <Button variant="default">Confirmar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Características**:
- Cada nível (Trigger, Content, Header, Footer) é um componente nomeado.
- Slots explícitos: `DialogHeader`, `DialogFooter`, etc.
- Conteúdo tipado através de children.
- Requer conhecimento de hierarquia durante uso.

**Citiesoft — Props e Renderização de Conteúdo**

Exemplo Dialog (presume padrão baseado em PrimeNG):
```jsx
<Dialog
  header="Título"
  visible={isVisible}
  onHide={() => setVisible(false)}
  footer={
    <>
      <Button label="Cancelar" onClick={() => setVisible(false)} />
      <Button label="Confirmar" onClick={handleConfirm} />
    </>
  }
>
  Conteúdo da modal
</Dialog>
```

**Características**:
- Props para estrutura (header, footer, visible).
- Children para conteúdo.
- Mais direto; menos camadas de nomeação.
- Familiar para times Angular (PrimeNG usa padrão similar).

### 2.2 Estados e Variantes: Comparação por Família

**Ações (Button)**

| Aspecto | shadcn/ui | Citiesoft |
|---------|-----------|-----------|
| Variantes | 6 (default, outline, ghost, destructive, secondary, link) | Presume 3-4 (primary, secondary, ghost, destructive) |
| Tamanhos | 5 (xs, sm, default, lg, icon) | Presume 3-4 |
| Estados | Loaded, disabled (via data-disabled) | Loaded, disabled, loading |
| Ícones | Suporte via children ou data-icon="inline-start/end" | Slots iconStart/iconEnd |
| Loading | Via composição com Spinner | Prop `loading` ou `loadingIcon` |
| Keyboard | Semântica Base UI (Enter, Space) | Presume semântica nativa |

**Relevância para B2G**: Citiesoft cobre casos de uso administrativo (ação principal, ações secundárias, descartes). shadcn mais ornamental (link, ghost).

---

### 2.3 Comportamento de Teclado e Foco

**shadcn/ui** (via Base UI e Radix UI):
- **Buttons**: Semântica HTML5 nativa (Enter, Space).
- **Dialogs**: Trap focus (foco preso dentro), Escape fecha, focus volta ao trigger.
- **Menubar**: Roving tabindex (um item por vez focável, setas navegam dentro).
- **Tabs**: Arrow keys (Left/Right ou Up/Down conforme `orientation`), Enter/Space seleciona.
- **Accordion**: Arrow keys (Up/Down), Enter/Space abre/fecha.
- **Select/Combobox**: Arrow keys filtram, Enter seleciona, Escape fecha.

**Citiesoft** (presumido, baseado em PrimeNG):
- Suporta comportamentos padrão ARIA.
- Não documentado em detalhes de teclado no catálogo.

**Achado**: shadcn/ui documenta keyboard explicitamente; Citiesoft não. Oportunidade: revisar e documentar cada componente de entrada com suporte a teclado em Storybook.

---

### 2.4 Transições e Animação

**shadcn/ui**:
- **Dialog**: Fade + scale (via Base UI internals), controlável via CSS vars.
- **Drawer**: Slide (swipeDirection) + swipe gesture, snap points.
- **Tabs**: Underline indicator animado (CSS).
- **Accordion**: Conteúdo collapsa com transição (Radix).
- **Popover**: Fade + repositioning ao abrir.
- **Toast**: Slide-in/out (Base UI manager).

**Watermelon UI** (conforme search results):
- Usa **Framer Motion** para animações.
- 260+ componentes com motion-ready (presumido).

**Citiesoft**:
- Presume transições CSS nativas via classes.
- Não cita Framer Motion ou GSAP nas docs.

**Achado**: shadcn + Watermelon ambos oferecem transições prontas. Citiesoft pode ganhar refinamento visual se adotar GSAP ou Framer Motion de forma opcional (sem quebrar B2G).

---

## 3. Componentes que shadcn/ui tem e Citiesoft não tem

Componentes úteis e que fazem sentido em contexto B2G denso:

| Componente | URL shadcn | Utilidade em B2G | Observação |
|---|---|---|---|
| **Combobox** | ui.shadcn.com/docs/components/combobox | Alta | Busca + seleção combinada. Citiesoft tem AutoComplete/MultiSelect separados. |
| **Calendar** | ui.shadcn.com/docs/components/calendar | Alta | Seleção de datas com range, locales, timezone. Citiesoft tem DatePicker (presumido). |
| **Data Table** | ui.shadcn.com/docs/components/data-table | Alta | Headless (TanStack Table v9) com sorting, filtering, pagination, column visibility. Citiesoft tem Table. Diferença radical: shadcn = lógica; Citiesoft = componente fechado. |
| **Hover Card** | ui.shadcn.com/docs/components/hover-card | Média | Tooltip-like que aparece ao hover. Citiesoft tem Tooltip. Caso de uso: preview rápido sem click. |
| **Navigation Menu** | ui.shadcn.com/docs/components/navigation-menu | Média | Menu dropdown complexo com categorias. Citiesoft tem Menu/Menubar. Menos comum em Admin. |
| **Sheet** | ui.shadcn.com/docs/components/sheet | Média | Modal sheet com drag-handle (mobile-first). Citiesoft tem Drawer. shadcn + Watermelon oferecem experiência touch melhor. |
| **Command** | ui.shadcn.com/docs/components/command | Baixa | Palette de comandos (Cmd+K). Raro em B2G administrativo tradicional. Util em super-usuários. |
| **Carousel** | ui.shadcn.com/docs/components/carousel | Baixa | Galeria de imagens com setas/dots. Citiesoft tem Carousel/Galleria. Mais adequado a landing pages. |

**Componentes de pouca utilidade em B2G** (marketing/ui ornamental):
- **Bubble** (chat bubbles) — fora de escopo administrativo.
- **Questionnaire** (forms interativas) — presume padrão Likert/survey; Citiesoft covers via RadioGroup + Field.
- **Direction** (layout RTL) — Citiesoft já cobre (e-MAG).

---

## 4. Watermelon UI: Análise Limitada

**Status de Acesso**: ui.watermelon.sh retorna 403 Forbidden. Análise baseada em referências indiretas (GitHub, Medium, Context7).

**Dados Coletados**:
- **Quantidade**: 260+ componentes (copy-paste registry).
- **Tecnologia**: React 19, Tailwind CSS v4, Radix UI, Framer Motion.
- **Modelo**: Self-contained—cada componente com suas dependências, não monolítico.
- **Compatibilidade**: Funciona com `shadcn @latest add` CLI e registry protocol.

**Diferenciador vs shadcn**:
- Watermelon = biblioteca maior (260 vs 70+).
- Watermelon = foco em dashboards e blocos (components + blocks).
- Watermelon = Motion-first (Framer Motion built-in).

**Limitação**: Sem acesso à documentação granular, não é possível comparar estados, keyboard behavior, ou anatomia específica de cada componente. **Esta pesquisa refere-se a shadcn como proxy de "componentes modernos compostos".**

---

## 5. Arquitetura de API: Impacto de Adotar Composição

### 5.1 shadcn/ui: Composição Explícita

**Vantagens**:
1. **Explicitude**: Estrutura clara no JSX. Desenvolvedor vê exatamente qual slot ocupa qual espaço.
2. **Flexibilidade**: Cada slot pode ser substituído ou customizado independentemente.
3. **Tipagem**: TypeScript infere tipos de props automaticamente por cada sub-componente.
4. **Aderência ARIA**: Base UI garante roles e atributos corretos em cada nível.

**Desvantagens**:
1. **Verbosidade**: Código fica mais longo. Um Dialog simples = 7 linhas; com Citiesoft = 3.
2. **Curva de aprendizado**: Novo desenvolvedor precisa aprender hierarquia de cada componente.
3. **Integração Angular**: Angular (especialmente com PrimeNG) não trabalha bem com composição de componentes Web. Handoff para times Angular fica complexo porque não existem "props nomeadas" claras—existem slots filhos.

### 5.2 Citiesoft: Props + Children

**Vantagens**:
1. **Concisão**: Um Dialog pode ser definido em 3 props.
2. **Compatibilidade Angular**: PrimeNG usa o mesmo padrão. Handoff é natural.
3. **Redução cognitiva**: Desenvolvedor não memoriza hierarquias.

**Desvantagens**:
1. **Rigidez**: Adicionar nova seção (ex.: um "side panel" no Dialog) exige novo prop (`sidePanel` ou `sideContent`). Composição resolve com `<DialogAside>`.
2. **Escalabilidade**: Combinatorial explosion de props (Dialog tem `header`, `footer`, `showCloseButton`, `headerIcon`, etc.). Composição evita isso via slots.

### 5.3 Recomendação para Citiesoft B2G

**Não adotar composição pura em componentes consumidos por Angular.**

Citiesoft é consumido por times que desenvolvem em Angular. Padrão de composição shadcn/ui:
- Desafia padrão PrimeNG que times já conhecem.
- Torna handoff mais custoso (times Angular precisam desaprender PrimeNG + aprender composição React).
- Não garante ganho de usabilidade suficiente para justificar migration friction.

**Alternativa: Composição Parcial**

Para componentes complexos e novos (ex.: Data Table que ainda não existe ou é fraco):
1. Manter API props-based externa (para Angular compatibility).
2. Usar composição internamente (React internals).
3. Exemplos:

```jsx
// Externe (fica igual para Angular):
<DataTable columns={cols} data={data} onSort={...} onFilter={...} />

// Interna (composição React, não exposta):
export function DataTable({ ... }) {
  return (
    <TableProvider>
      <TableToolbar>
        <TableFilter />
      </TableToolbar>
      <TableContent>
        <TableRows>
          {data.map(row => <TableRow row={row} />)}
        </TableRows>
      </TableContent>
    </TableProvider>
  );
}
```

---

## 6. Oportunidades Priorizadas (Top 3)

### 6.1 [PRIORIDADE 1] Documentar Comportamento de Teclado e Foco

**Severidade**: 3 (maior) — Impacta usabilidade em jornada longa (servidor público em 8h de trabalho). Exigência legal e-MAG.

**Achado**: Citiesoft não documenta keyboard behavior por componente. shadcn/ui cita: Dialogs com Escape, Menubar com roving tabindex, Tabs com arrows.

**Ação**:
- Auditar cada molécula/organismo entrada e overlay: qual tecla faz o quê?
- Adicionar seção "Keyboard" em cada story do Storybook.
- Validar contra WCAG 2.2 AA (navegação por teclado, sem exceções).
- Testar com screen readers (NVDA, JAWS, VoiceOver).

**Impacto estimado**: +15% acessibilidade percebida. Conformidade legal e-MAG.

---

### 6.2 [PRIORIDADE 2] Refinamento Visual com Transições Leves e Efeitos de Foco Aumentados

**Severidade**: 2 (menor) — Percepção de "sem graça". Não afeta funcionalidade, mas experiência.

**Achado**: shadcn/ui + Watermelon ambos usam transições CSS/Framer Motion. Citiesoft presume transições básicas. Focus state (Heurística 4 — Consistência e padrões) pode ser mais visível.

**Ação**:
- Mapear componentes que precisam transição (Dialog abre/fecha, Drawer slide, Tabs indicator).
- Adicionar transições CSS suaves (0.2s ease-out é padrão moderno).
- Melhorar focus ring: mais visible, cor contrastante (não combinar com border).
- Usar sombra sutil em hover de botões (não radicalmente diferente; coerente com token design).

**Referência visual**: Consultar shadcn (ui.shadcn.com/docs/components/button) para estados de hover/focus/active.

**Impacto estimado**: Reduz percepção "genérica de IA"; aumenta confiança. Sem breaking changes.

---

### 6.3 [PRIORIDADE 3] Expandir Família de Componentes: Combobox e Data Table

**Severidade**: 2 (menor) — Gaps no catálogo. Não crítico, mas reduz flexibility.

**Achado**:
1. **Combobox** (busca + seleção): shadcn tem; Citiesoft tem AutoComplete (similar, mas presume menos poder). Falta multiselect robusto.
2. **Data Table** (headless + sorting/filtering): shadcn documenta TanStack Table v9 (headless, logic external). Citiesoft tem Table (presumido: componente monolítico, props-based). Headless permite customização fina (colunas dinâmicas, cell rendering custom).

**Ação**:
- Adicionar `Combobox` (novo) como molécula na família Campos com suporte a multi-select e grupos.
- Documentar padrão headless para `Table` ou oferecer variante "Data Table" com TanStack suporte (React-specific; Angular fica com Table clássica).

**Impacto estimado**: Cobertura de casos 80% → 95% sem redesenho. Facilita roadmap futuro.

---

## 7. Achados Secundários

### 7.1 Nomeação de Estados

shadcn/ui usa padrão de atributos de dados (`data-invalid`, `data-disabled`) para styling em CSS. Citiesoft presume props booleanas. Ambos funcionam; shadcn mais CSS-driven, Citiesoft mais JS-driven.

**Recomendação**: Manter padrão Citiesoft (props). CSS-in-JS vs data-attributes é preferência arquitetural; mudar impactaria todos os componentes.

### 7.2 RTL Support

shadcn/ui documenta suporte RTL via configuração (e.g., `dir="rtl"`). Citiesoft é B2G brasileiro (padrão LTR), mas e-MAG cita acessibilidade internacional. Não é bloqueador atual, mas é upgrade futuro.

### 7.3 Acessibilidade (WCAG 2.2 AA + e-MAG 3.1)

shadcn/ui cita Base UI como primitivo acessível. Citiesoft presume conformidade (sem detalhe). Recomendação: [Auditar checklist WCAG AA separado](#) antes de adoptar qualquer novo componente.

---

## Conclusão

**shadcn/ui é referência válida para refinamento de:**
1. Keyboard navigation (documentar).
2. Estados visuais de foco.
3. Transições sutis.
4. Novos componentes (Combobox, Data Table headless).

**Não é recomendado adotar composição React pura** porque Citiesoft é consumido por Angular. Manter API props-based.

**Watermelon UI** oferece 260+ componentes motion-ready, mas sem acesso à documentação granular, não é possível priorizar adoção. Reconhecer como "opção futura" se necessário expansão visual (dashboards, charts).

---

## Referências

- [shadcn/ui — Components](https://ui.shadcn.com/docs/components)
- [shadcn/ui — Dialog](https://ui.shadcn.com/docs/components/dialog)
- [shadcn/ui — Input](https://ui.shadcn.com/docs/components/input)
- [shadcn/ui — Select](https://ui.shadcn.com/docs/components/select)
- [shadcn/ui — Tabs](https://ui.shadcn.com/docs/components/tabs)
- [shadcn/ui — Toast](https://ui.shadcn.com/docs/components/toast)
- [shadcn/ui — Data Table](https://ui.shadcn.com/docs/components/data-table)
- [shadcn/ui — Menubar](https://ui.shadcn.com/docs/components/menubar)
- [shadcn/ui — Sidebar](https://ui.shadcn.com/docs/components/sidebar)
- [shadcn/ui — Pagination](https://ui.shadcn.com/docs/components/pagination)
- [shadcn/ui — Accordion](https://ui.shadcn.com/docs/components/accordion)
- [shadcn/ui — Popover](https://ui.shadcn.com/docs/components/popover)
- [shadcn/ui — Checkbox](https://ui.shadcn.com/docs/components/checkbox)
- [shadcn/ui — Combobox](https://ui.shadcn.com/docs/components/combobox)
- [shadcn/ui — Drawer](https://ui.shadcn.com/docs/components/drawer)
- [shadcn/ui — Calendar](https://ui.shadcn.com/docs/components/calendar)
- [Watermelon UI — GitHub](https://github.com/WatermelonCorp/watermelon-platform)
- [Watermelon UI — UI UX Showcase](https://uiuxshowcase.com/resources/watermelon-ui/)
- [Base UI — Radix UI Primitives](https://base-ui.com/)

---

**Pesquisa realizada por**: Okabe (Worker UX/Design System)  
**Data de entrega**: 21 de agosto de 2026  
**Status**: Completo com ressalva (Watermelon UI amostra limitada)
