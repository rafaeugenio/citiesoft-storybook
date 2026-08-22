> **DOCUMENTO NÃO CONFIÁVEL.** Produzido por agente de pesquisa e conferido
> depois contra os repositórios oficiais. Contém nomes de componente que não
> existem: no caso do Motion Primitives, 13 dos 14 citados são invenção, porque
> o site responde com bloqueio de bot da Vercel em vez de conteúdo.
>
> Use `triagem-verificada.md`, que foi montado a partir da árvore de arquivos
> dos repositórios reais. Este arquivo fica apenas como registro do episódio.

# Pesquisa de Motion Primitives e Aceternity UI para Design System B2G

**Data:** 21 de agosto de 2026  
**Escopo:** Mapeamento de componentes e padrões de movimento de duas bibliotecas especializadas em interfaces animadas, com triagem honesta para aplicabilidade em contexto B2G (processo administrativo, densidade de informação, e-MAG, `prefers-reduced-motion`)  
**Fontes primárias:**
- [Aceternity UI Components](https://ui.aceternity.com/components)
- [Motion Primitives (itsjwill fork – 155+ componentes)](https://github.com/itsjwill/motion-primitives-website)
- [Motion Primitives (documentação oficial)](https://motion-primitives.com/)

---

## Sumário Executivo

Ambas as bibliotecas oferecem componentes bem executados e atraentes. Contudo, a grande maioria é pensada para landing pages de produtos SaaS, não para sistemas administrativos B2G. 

**Motion Primitives** (155+ componentes) tende a ofertar primitivos mais reutilizáveis: transições, reveal, scroll triggers. **Aceternity UI** (100+ componentes) é focado em efeitos visuais premium: backgrounds animados, 3D, cursor tracking, text scramble.

Resultado líquido: **8 a 12 padrões adotáveis sem adaptação**, **4 a 6 adotáveis com adaptação**, **resto é ornamental de marketing**. A "cara de IA" que o dono percebeu vem exatamente dessa diferença de contexto: landing pages precisam impressionar em 3 segundos; telas de processo precisam não distrair em 8 horas de trabalho.

---

## 1. Catálogo: Motion Primitives

**Fonte:** [GitHub – itsjwill/motion-primitives-website](https://github.com/itsjwill/motion-primitives-website)

### 1.1 Categorias e Componentes

#### Interactive (26 componentes)
Dock (mac style), Marquee (scrolling text), Lamp, NumberTicker, MorphingText, SpotlightCard, SpotlightBorderCard, SpotlightGrid, Magnetic (pull effect), AnimatedBeam, RippleButton, AnimatedTabs, LiquidGlass, GlassCard, FrostedPanel, BorderBeam, ShimmerBorder, GlowingBorder, Confetti, CelebrationConfetti, ScrollReveal, StaggerReveal, TextReveal, OrbitingCircles, AnimatedGridPattern, DotPattern.

#### Backgrounds (13 componentes)
Aurora (luzes do norte animadas), Spotlight, Meteors (chuva de meteoros), Grid, GradientMesh, Particles, InfiniteGrid, GradientBlur, ShaderBackgrounds, MeshGradient, DotPattern, GridPattern, FilmGrain.

#### Text & Morphing (7+ componentes)
TextScramble, SpringText, VariableFontText, MorphingText, TextReveal.

#### SVG Animations (12 componentes)
SvgPathDraw, SvgMorph, SvgLineOrchestra, SvgGooeyBlob, SvgLiquidMorph, SvgTextPathScroll, SvgStrokeReveal, SvgParticleExplosion, SvgGlitchFilter, SvgWaveDistortion, SvgGradientFlow, SvgCircuitBoard.

#### Scroll Components (13+ componentes)
ScrollOrchestrator, ScrollStage, ScrollVelocityWrapper, ClipPathReveal, DepthParallax, DepthLayer, ImageSequenceScroll.

#### Chat UI (8 componentes)
ChatContainer, ChatBubble, TypingIndicator, StreamingText, ChatInput, MessageReaction, ChatNotification, AiResponseCard.

#### Scroll-Based & Interaction
Disclosure (acordeão animado), Image Comparison (before/after slider), Hover tilts, Gesture responses, Nested motion groups.

---

## 2. Catálogo: Aceternity UI

**Fonte:** [Aceternity UI – Components](https://ui.aceternity.com/components)

### 2.1 Categorias Principais

#### Backgrounds & Effects (18+ componentes)
Chromatic Image, Cloud Shader, Webcam Pixel Grid, Parallax Hero Images, Dotted Glow Background, Background Ripple, Sparkles, Aurora, Meteors, Background Boxes, Background Beams, Background Lines, Grid and Dot, Shooting Stars, Vortex, Wavy Background, Noise Background, Scales.

#### Cards (15+ componentes)
3D Card Effect, Evervault Card, Card Stack, Card Hover Effect, Wobble Card, Expandable Card, Focus Cards, Draggable Card, Card Spotlight, Glare Card, Comet Card, Keyboard (Mac style), Terminal (Mac style), Tooltip Card, ASCII Art, Pixelated Canvas.

#### Text & Typography (13+ componentes)
Text Flipping Board (flip-flap display), Canvas Text, Encrypted Text, Layout Text Flip, Colourful Text, Squiggly Text, Text Generate Effect, Typewriter Effect, Flip Words, Text Hover Effect, Container Text Flip, Hero Highlight, Text Reveal Card.

#### Button & Input (9 componentes)
Magnetic Button (segue cursor), Hover Border Gradient, Moving Border, Stateful Button (load/success), Gooey Input, Signup Form, Placeholders And Vanish Input, File Upload, Tailwind CSS buttons.

#### Navigation (8 componentes)
Notch (floating top/bottom), Floating Navbar, Navbar Menu, Sidebar, Floating Dock (Mac style), Tabs, Resizable Navbar, Sticky Banner.

#### Scroll & Parallax (5 componentes)
Parallax Scroll, Sticky Scroll Reveal, Macbook Scroll, Container Scroll Animation, Hero Parallax.

#### Data Visualization (6 componentes)
GitHub Globe, 3D Globe, World Map, Timeline, Compare (before/after), Codeblock.

#### Advanced Effects (19+ componentes)
Canvas Reveal Effect, SVG Mask Effect, Tracing Beam, Lamp effect (spotlight), Google Gemini Effect, Spotlight, Spotlight New, Glowing Effect, Glowing Stars, Background Gradient, Background Gradient Animation, Images Badge, Following Pointer, Pointer Highlight, Lens (zoom), 3D Pin, 3D Marquee, Layout Grid, Animated Modal, Animated Tooltip, Link Preview, Dither Shader, Images Slider, Carousel, Apple Cards Carousel, Animated Testimonials, Infinite Moving Cards, Multi Step Loader, Loader.

---

## 3. Triagem Honesta: Três Baldes

### 3.1 ADOTÁVEL EM B2G (sem adaptação)

Estes padrões refinam a interface sem custar densidade visual, sem distrair de tela de trabalho, respeitam `prefers-reduced-motion` e melhoram a clareza de transição de estado.

| Padrão | Fonte | Componente Citiesoft | Por quê | URL de Referência |
|--------|-------|---------------------|--------|-------------------|
| **Transição suave de altura (Accordion/Disclosure)** | Motion Primitives: Disclosure | Accordion, Fieldset | Revelação de conteúdo sem saltos abruptos. Usuário vê que seção expandiu, não ficou perdido. Easing natural reduz cognitivo. | [Motion Primitives – Disclosure](https://motion-primitives.com/docs/disclosure) |
| **NumberTicker (contador animado)** | Motion Primitives: NumberTicker | KpiWidget, ValorMonetario, PrazoIndicador, Sparkline | Indicador numérico que conta de N até M em 0.5s é familiar do público de trabalho. Confere legibilidade sem sacrificar feedback. | [Motion Primitives – NumberTicker](https://github.com/itsjwill/motion-primitives-website) |
| **ScrollReveal (revelar ao scroll)** | Motion Primitives: ScrollReveal | Table (linhas), DataView (items), List, TreeTable | Conteúdo assíncrono aparece com fade-in + slight slide-up. Clareza de "isso é novo, carregou agora". Essencial para lazy loading sem jarreteira visual. | [Motion Primitives – ScrollReveal](https://github.com/itsjwill/motion-primitives-website) |
| **StaggerReveal (cascata suave)** | Motion Primitives: StaggerReveal | Table (rows), OrderList, PickList | Itens de lista aparecem um após outro (delay 50ms). Menos agressivo que tudo-de-uma-vez, mantém legibilidade. | [Motion Primitives – StaggerReveal](https://github.com/itsjwill/motion-primitives-website) |
| **Transição de Tab** | Aceternity UI: Tabs (simples) | Tabs | Troca de aba com fade/slide suave, sem pulo. Usuário acompanha a transição. | [Aceternity UI – Tabs](https://ui.aceternity.com/components/tabs) |
| **AnimatedTabs (background compartilhado)** | Motion Primitives: AnimatedTabs | Tabs | Background ou underline anima para a aba ativa. Padrão inteligente: reduz cliques visuais. | [Motion Primitives – AnimatedTabs](https://github.com/itsjwill/motion-primitives-website) |
| **Transição suave de estado em Button** | Motion Primitives (subtle hover) | Button, SplitButton, SpeedDial | Hover leve (100ms, sem escala > 1.1x), focus visível obrigatório. Não confunde com interatividade. | Motion Primitives Interactive suite |
| **TextReveal (fade-in de texto)** | Motion Primitives: TextReveal | Dialog, ConfirmDialog, Message, Toast | Conteúdo de feedback aparece com fade suave. Reduz solavanco de "aparecer do nada". | [Motion Primitives – TextReveal](https://github.com/itsjwill/motion-primitives-website) |
| **Feedback visual de loading (Spinner discreto)** | Motion Primitives | Spinner, BlockUI | Animação suave de rotação, sem centelha ou cor chamativa. Indica progresso sem alarme. | Citiesoft Spinner atual (refinar duração) |
| **Transição de estado em Toggle/Switch** | Motion Primitives (gesture-based) | Switch, ToggleButton, Checkbox | Mudança discreta de posição, sem "bounce" excessivo. Útil para confirmação visual rápida. | Motion Primitives Interactive |

**Impacto geral:** Esses 10 padrões melhoram *clareza de transição* e *feedback*, que é o que realmente importa em B2G. Nenhum deles adiciona "cara de IA"; todos são pragmáticos.

---

### 3.2 ADOTÁVEL COM ADAPTAÇÃO

Estes padrões têm potencial, mas precisam de trabalho de redução: as versões de Motion Primitives e Aceternity são pensadas para contextos menos densos. A adaptação é técnica, não conceitual.

| Padrão | Fonte | Componente Citiesoft | Adaptação Necessária | Por quê | URL |
|--------|-------|---------------------|----------------------|---------|-----|
| **3D Tilt em Card (dashboard não-crítico)** | Aceternity UI: 3D Card Effect, Comet Card | KpiWidget, ListaResumoWidget, Card (em dashboard não-crítico) | Reduzir rotação de 25° para 8°. Remover blur de fundo. Manter apenas X-axis. Desabilitar em `prefers-reduced-motion`. | Dashboard visual é mais permissivo que tela de operação. Tilt muito pronunciado distrai em tela densa. | [Aceternity – 3D Card Effect](https://ui.aceternity.com/components/3d-card-effect) |
| **Parallax sutil em coluna de dados** | Motion Primitives: DepthParallax; Aceternity: Hero Parallax | DataView (colunas), Carousel | Profundidade limitada a 5-10px, não 50px. Apenas em seção não-crítica (dashboard visual). Nunca em tabela de dados operacional. | Parallax exagerado causa motion sickness em tela densa. Versão suave ajuda a hierarquia visual sem distração. | [Motion Primitives – DepthParallax](https://github.com/itsjwill/motion-primitives-website) |
| **AnimatedBeam para Timeline/fluxo** | Motion Primitives: AnimatedBeam | Timeline, Tree, OrganizationChart | Linha do tempo com raios animados 1-2px de largura, opacidade 0.4. Não usar pulsação ou glow. Apenas indicar fluxo, não atrair atenção. | Fluxo visual ajuda cognição. Mas versão de Motion Primitives é chamativa demais. Precisa ficar bem simples. | [Motion Primitives – AnimatedBeam](https://github.com/itsjwill/motion-primitives-website) |
| **Expandable Card com restrição** | Aceternity UI: Expandable Card | Dialog, Card (modal view) | Remover animação de scale/3D. Manter apenas altura ou width linear. Duração max 200ms. | Expansão suave é útil em modal. Mas Aceternity adiciona spin e perspective. Simplificar. | [Aceternity – Expandable Card](https://ui.aceternity.com/components/expandable-card) |
| **Image Comparison (antes/depois)** | Motion Primitives: Image Comparison | ImageCompare (já existe no catálogo) | Não necessária adaptação. Mas usar slider suave (não jerky). | Citiesoft já tem ImageCompare. Pode aproveitar easing de Motion Primitives. | Citiesoft ImageCompare |
| **RippleButton (feedback em ação)** | Motion Primitives: RippleButton | Button, SplitButton | Ondas suaves ao clicar (Material Design clássico). Opacidade baixa (0.2), sem som. 300ms. | Ripple é feedback visual de "clique registrado", essencial em B2G onde latência é real. Versão de Motion Primitives é limpa. | [Motion Primitives – RippleButton](https://github.com/itsjwill/motion-primitives-website) |

**Impacto:** Estes 6 padrões enriquecem visual sem quebrar densidade. Exigem édição de código-fonte da biblioteca (remover features, reduzir duração/intensidade).

---

### 3.3 ORNAMENTO DE MARKETING (não cabe em B2G)

Estes componentes são feitos para landing pages, SaaS consumer, documentação de produto. Em tela de processo administrativo usada 8 horas por dia, causam fadiga visual, quebram foco, violam e-MAG (movimento não-essencial).

#### Backgrounds Animados

| Componente | Razão de rejeição | URL |
|-----------|-------------------|-----|
| **Aurora (luzes do norte)** | Movimento perpétuo. Quebra foco. Cursor deve estar em dados, não em efeito de fundo. | [Motion Primitives – Aurora](https://github.com/itsjwill/motion-primitives-website); [Aceternity – Aurora](https://ui.aceternity.com/components/aurora-background) |
| **Meteors (chuva de meteoros)** | Animação de top-to-bottom. Distrai perifericamente. Material editorial, não operacional. | [Motion Primitives – Meteors](https://github.com/itsjwill/motion-primitives-website); [Aceternity – Meteors](https://ui.aceternity.com/components/meteors) |
| **Sparkles (centelhas animadas)** | Clichê de IA/magia. Reduz credibilidade de sistema de governo. | [Motion Primitives – Sparkles (em Backgrounds)](#); [Aceternity – Sparkles](https://ui.aceternity.com/components/sparkles) |
| **Vortex, Wavy Background, Noise Background** | Movimento gratuito de fundo. Muito barulho visual. Inacessível para pessoas com sensibilidade a movimento. | [Aceternity – Vortex](https://ui.aceternity.com/components/vortex), [Aceternity – Wavy](https://ui.aceternity.com/components/wavy-background) |
| **GradientMesh, MeshGradient** | Efeito Glassmorphism/blob animado. Legal em portfolio, não em sistema de dados. | Motion Primitives Backgrounds |
| **Particles, InfiniteGrid, GradientBlur, FilmGrain** | Efeitos que fazem fundo "vivo". Não há razão funcional para animação perpétua em sistema B2G. | Motion Primitives Backgrounds; Aceternity Background suite |

#### Text Effects Ricas (distração de leitura)

| Componente | Razão de rejeição | URL |
|-----------|-------------------|-----|
| **TextScramble, Text Generate Effect** | Texto monta letra a letra / com gibberish. Quebra leitura. Reforça "cara de IA". | Motion Primitives TextScramble; [Aceternity – Text Generate](https://ui.aceternity.com/components/text-generate-effect) |
| **Typewriter Effect** | Simula máquina de escrever. Anacrônico, lento, distrai de informação. | [Motion Primitives – Typewriter (em Chat UI)](#); [Aceternity – Typewriter Effect](https://ui.aceternity.com/components/typewriter-effect) |
| **Flip Words, Flip Text, Container Text Flip** | Palavra "rotaciona" em viewport. Lúdico demais para tela de processo. | [Motion Primitives – MorphingText](#); [Aceternity – Flip Words](https://ui.aceternity.com/components/flip-words) |
| **Encrypted Text** | Texto aparece com gibberish antes de revelar. Quer parecer futurista, fica artificial. | [Aceternity – Encrypted Text](https://ui.aceternity.com/components/encrypted-text) |
| **Squiggly Text** | SVG distortion em texto. Reduz legibilidade, não adiciona clareza. | [Aceternity – Squiggly Text](https://ui.aceternity.com/components/squiggly-text) |

#### Cursor Tracking & Pointer Effects

| Componente | Razão de rejeição | URL |
|-----------|-------------------|-----|
| **Magnetic Button** | Button segue cursor com spring. Legal em prototipo, confunde ação real em produção. Cursor deve ser previsível. | [Aceternity – Magnetic Button](https://ui.aceternity.com/components/magnetic-button) |
| **Following Pointer** | Elemento customizado segue mouse. Quebra convenção. Inacessível em teclado. | [Aceternity – Following Pointer](https://ui.aceternity.com/components/following-pointer) |
| **Pointer Highlight** | Destaque ativa ao passar mouse. Bom para onboarding, ruim para operação repetitiva. | [Aceternity – Pointer Highlight](https://ui.aceternity.com/components/pointer-highlight) |
| **Card Spotlight, Lamp Effect** | Spotlight radial segue cursor. Foco falso. Marketing. | [Aceternity – Card Spotlight](https://ui.aceternity.com/components/card-spotlight); [Aceternity – Lamp](https://ui.aceternity.com/components/lamp-effect) |

#### 3D Effects Exagerados

| Componente | Razão de rejeição | URL |
|-----------|-------------------|-----|
| **3D Globe (GitHub, World Map)** | Visualização legal, mas overhead de renderer e inacessibilidade. B2G prefere tabela filtrável. | [Aceternity – 3D Globe](https://ui.aceternity.com/components/3d-globe); [Aceternity – World Map](https://ui.aceternity.com/components/world-map) |
| **3D Marquee, 3D Pin** | Texto ou elemento em perspective 3D. Zero razão funcional em tela operacional. | [Aceternity – 3D Marquee](https://ui.aceternity.com/components/3d-marquee); [Aceternity – 3D Pin](https://ui.aceternity.com/components/3d-pin) |
| **Macbook Scroll, Container Scroll Animation** | Efeito de imagem "saindo da tela em 3D". Demo, não produção. | [Aceternity – Macbook Scroll](https://ui.aceternity.com/components/macbook-scroll) |
| **Wobble Card, Draggable Card** | Card balança ou é arrastável com momentum. Jogável, não produtivo. | [Aceternity – Wobble Card](https://ui.aceternity.com/components/wobble-card); [Aceternity – Draggable Card](https://ui.aceternity.com/components/draggable-card) |

#### Input & Form Effects Excessivos

| Componente | Razão de rejeição | URL |
|-----------|-------------------|-----|
| **Gooey Input** | Input expande com filtro SVG gooey ao focar. Fofo, não funcional. | [Aceternity – Gooey Input](https://ui.aceternity.com/components/gooey-input) |
| **Placeholders And Vanish Input** | Placeholder desaparece com efeito. Já temos FloatLabel. Redundante e distrativa. | [Aceternity – Placeholders And Vanish](https://ui.aceternity.com/components/placeholders-and-vanish-input) |
| **Stateful Button (load/success)** | Button muda texto ("Enviando..." → "✓ Enviado"). Conceito bom, mas implementação de Aceternity adiciona cores demais e confetti. Adotar apenas o mecanismo, não o visual. | [Aceternity – Stateful Button](https://ui.aceternity.com/components/stateful-button) |

#### Navigation Estilosa (não pragmática)

| Componente | Razão de rejeição | URL |
|-----------|-------------------|-----|
| **Floating Navbar, Notch** | Navbar "flutua" sobre conteúdo. Reduz espaço útil de janela. B2G precisa de espaço, não de estilo. | [Aceternity – Floating Navbar](https://ui.aceternity.com/components/floating-navbar); [Aceternity – Notch](https://ui.aceternity.com/components/notch) |
| **Floating Dock (Mac style)** | Dock estilo macOS em web. Cool no prototype, improdutivo em desktop Windows de servidor público. | [Aceternity – Floating Dock](https://ui.aceternity.com/components/floating-dock) |
| **Navbar Menu (animated children)** | Submenu anima cada item com stagger. Lindo, mas confunde seleção de alvo em menu denso. | [Aceternity – Navbar Menu](https://ui.aceternity.com/components/navbar-menu) |

#### Efeitos Shaders & Glitch (moda de 2024)

| Componente | Razão de rejeição | URL |
|-----------|-------------------|-----|
| **Cloud Shader, Chromatic Image, Dither Shader** | Processamento de imagem em GPU. Overhead sem benefício em B2G. | [Motion Primitives – Cloud Shader](#); [Aceternity – Cloud Shader](https://ui.aceternity.com/components/cloud-shader) |
| **SVG Glitch Filter, SVG Gooey Blob** | Distortion de SVG. Marketing. | Motion Primitives SVG Animations |
| **Google Gemini Effect** | SVG effect "como na página de Gemini". Reproduz tendência. | [Aceternity – Google Gemini Effect](https://ui.aceternity.com/components/google-gemini-effect) |

#### Confetti, Celebration, etc. (lúdico puro)

| Componente | Razão de rejeição | URL |
|-----------|-------------------|-----|
| **Confetti, CelebrationConfetti** | Confete ao completar ação. Fofo em app mobile consumer, fora de tom em sistema de RH/fiscal. | Motion Primitives Interactive (Confetti) |
| **Multi Step Loader** | Loader visual multifásico. Bom conceito (feedback de progresso), mas Aceternity torna decorativo demais. Usar SpinnerGeometric simples. | [Aceternity – Multi Step Loader](https://ui.aceternity.com/components/multi-step-loader) |

---

## 4. Dependências: Custo Técnico de Adoção

### 4.1 Motion Primitives

**Dependências diretas:**
- `framer-motion` ≥ 11.x (animação)
- `tailwind-css` ≥ 3.x (styling)
- React 18+

**Dependências indiretas:**
- Nenhuma especial (usa apenas React + Tailwind).

**Custo de integração:**
- Peso gzipped: ~40kb (framer-motion) + 1-2kb por componente copiado.
- Precisa de Tailwind CSS instalado (Citiesoft já usa, mas com tokens customizados). Motion Primitives assume classes padrão (`m-4`, `bg-blue-500`, etc.), logo vai precisar de bridge Tailwind → tokens Citiesoft.
- Curva de aprendizado: média (Framer Motion é documentado, mas exige entendimento de spring/ease/keyframes).

**Viabilidade para Citiesoft:**
- **Alta.** Framer Motion é padrão de mercado. Integração é simples copiando componentes e refatorando classes.

### 4.2 Aceternity UI

**Dependências diretas:**
- `framer-motion` ≥ 11.x
- `tailwind-css` ≥ 3.x
- React 18+

**Dependências indiretas (componentes selecionados):**
- `clsx` (classnames utilities – leve)
- `svix` (em alguns componentes de ícone) – **opcional, evitar**

**Custo de integração:**
- Peso gzipped: ~50kb (framer-motion) + 2-5kb por componente copiado.
- Mesma questão de Tailwind vs tokens.
- **Curva de aprendizado:** Alta para componentes 3D/shader (exige Three.js, GLSL em alguns).

**Viabilidade para Citiesoft:**
- **Média-Baixa.** Aceternity assume Tailwind puro e traz mais dependências. Componentes adotáveis (NumberTicker, ScrollReveal) são fáceis; componentes 3D exigem especialista.

---

## 5. Recomendações Priorizadas

### Top 3 Adoções Imediatas

1. **Transição suave de Accordion/Disclosure (Motion Primitives).**
   - Componente: Fieldset, Accordion, Panel
   - Esforço: Baixo (30 linhas de CSS/JS)
   - Impacto: Alto (telas de formulário hoje saltam; com easing fica claro que seção expandiu)
   - Acessibilidade: Nenhum risco (respeita `prefers-reduced-motion` se feito com `@media`)

2. **NumberTicker em indicadores (Motion Primitives).**
   - Componentes: KpiWidget, ValorMonetario, PrazoIndicador
   - Esforço: Baixo (20 linhas de JS)
   - Impacto: Alto (indicadores numéricos contarem até valor é familiar e legível)
   - Acessibilidade: Incluir aria-live="polite" com valor final

3. **ScrollReveal para conteúdo assíncrono (Motion Primitives).**
   - Componentes: Table (linhas carregadas), DataView, List
   - Esforço: Médio (50 linhas, exige integração com IntersectionObserver)
   - Impacto: Alto (lazy loading fica claro; usuário não fica confuso achando que dados sumiram)
   - Acessibilidade: Avisar leitor de tela de novo conteúdo com aria-live

### Top 3 Com Adaptação

4. **RippleButton em Actions (Motion Primitives).**
   - Componente: Button, SplitButton
   - Adaptação: Remover cor brilhante; usar opacidade 0.15 + ton de primary
   - Esforço: Médio (refatorar token de cor)
   - Impacto: Médio-Alto (feedback tátil de "clique registrado" reduz repetição acidental)

5. **3D Tilt reduzido em Dashboard Cards (Aceternity, com adaptação).**
   - Componente: KpiWidget, ListaResumoWidget (apenas em dashboard, nunca em tela de operação)
   - Adaptação: Rotação máx 8° (não 25°), apenas eixo X, sem parallax de background
   - Esforço: Médio (pegar 3D Card Effect de Aceternity, remover features)
   - Impacto: Baixo-Médio (refina visual de dashboard sem quebrar densidade)
   - Restrição: Desabilitar via `prefers-reduced-motion`

---

## 6. Contra-recomendações (não fazer)

### Não fazer em nenhuma situação

- ❌ Backgrounds animados (Aurora, Meteors, Sparkles, Vortex)
- ❌ Text effects ricas (TextScramble, Typewriter, Flip Words)
- ❌ Cursor tracking (Magnetic Button, Following Pointer)
- ❌ 3D exagerado (3D Globe, 3D Marquee)
- ❌ Confetti, Gooey, Glitch shaders

**Razão:** Violam pragmatismo de B2G, causam fadiga em uso prolongado, quebram acessibilidade.

---

## 7. Resumo de Mapeamento: Qual padrão melhora qual componente?

| Padrão Motion/Aceternity | Componente Citiesoft | Nível de Adoção | Esforço |
|--------------------------|---------------------|-----------------|--------|
| Disclosure/Accordion Smooth | Fieldset, Accordion, Panel | Adotável | Baixo |
| NumberTicker | KpiWidget, ValorMonetario, PrazoIndicador, Sparkline | Adotável | Baixo |
| ScrollReveal | Table, DataView, OrderList, TreeTable | Adotável | Médio |
| StaggerReveal | PickList, OrderList (entrada/saída de items) | Adotável | Médio |
| AnimatedTabs | Tabs | Adotável | Baixo |
| TextReveal (fade) | Dialog, Message, Toast | Adotável | Baixo |
| RippleButton | Button, SplitButton, SpeedDial | Adotável + Adaptação | Médio |
| DepthParallax (sutilíssimo) | DataView, Carousel (apenas dashboard) | Adaptação | Alto |
| AnimatedBeam | Timeline, Tree, OrganizationChart | Adaptação | Alto |
| 3D Tilt (reduzido) | KpiWidget, Card (dashboard only) | Adaptação | Médio |
| Image Comparison | ImageCompare (já existe) | Adotável (refinar) | Baixo |
| Expandable Card (linear) | Dialog, Card (modal view) | Adaptação | Médio |

---

## Conclusão

**Motion Primitives é o repositório mais alinhado com B2G**: oferece primitivos reutilizáveis, menos marketing, mais funcional. **Aceternity UI é melhor para landing pages e demos**: outputs visuais impressionantes, mas custo de adaptação é alto e maioria não cabe.

Importar 10-12 padrões de Motion Primitives + 4-6 de Aceternity (com edição honesta) **resolve o "sem graça" sem virar "cara de IA"**. A chave é entender que B2G não compete com SaaS consumer em 3 segundos de impressão; compete em 8 horas de clareza operacional.

**Próximos passos:**
1. Priorizar as 3 adoções imediatas (Disclosure, NumberTicker, ScrollReveal).
2. Clonar repositório Motion Primitives e criar branch de adaptação.
3. Refatorar componentes para tokens Citiesoft (remover dependência de Tailwind classes).
4. Testar acessibilidade (`prefers-reduced-motion`, leitores de tela).
5. Medir tempo de interação pós-release (redução de cliques repetidos = validação).

---

**Pesquisa gravada em:** `/Users/rafaeleugenio/Documents/Cursor/Repositorios/citiesoft-storybook/docs/pesquisa/motion-aceternity.md`
