# Triagem verificada das bibliotecas de referência

> **Este documento substitui `shadcn-watermelon.md` e `motion-aceternity.md`.**
>
> Aqueles dois foram produzidos por agentes de pesquisa e **contêm invenção**. O
> site `motion-primitives.com` responde com um bloqueio de bot da Vercel
> ("Vercel Security Checkpoint") em vez do conteúdo, e o agente preencheu a
> lacuna com nomes plausíveis: **13 dos 14 componentes que ele citou não
> existem**. Ele chegou a rejeitar como "ornamento do Motion Primitives" efeitos
> que não estão naquela biblioteca.
>
> As conclusões daqueles documentos eram em boa parte razoáveis. A evidência era
> falsa, e construir sobre evidência falsa é a mesma falha de camada de verdade
> que já reprovou uma rodada inteira deste projeto. Eles ficam no repositório
> apenas como registro, marcados como não confiáveis.

## Método desta verificação

Nada aqui vem de página renderizada. Tudo vem da **árvore de arquivos do
repositório oficial**, lida pela API do GitHub, que não tem bloqueio de bot:

```bash
curl -s "https://api.github.com/repos/ibelick/motion-primitives/git/trees/main?recursive=1"
curl -s "https://api.github.com/repos/shadcn-ui/ui/git/trees/main?recursive=1"
```

Se um nome não aparece na árvore, ele não entra neste documento.

## Motion Primitives · 33 componentes reais

`accordion, animated-background, animated-group, animated-number, border-trail,
carousel, cursor, dialog, disclosure, dock, glow-effect, image-comparison,
in-view, infinite-slider, magnetic, morphing-dialog, morphing-popover,
progressive-blur, scroll-progress, sliding-number, spinning-text, spotlight,
text-effect, text-loop, text-morph, text-roll, text-scramble, text-shimmer,
text-shimmer-wave, tilt, toolbar-dynamic, toolbar-expandable, transition-panel`

### Adotável em B2G

| Componente real | O que resolve aqui | Nosso alvo |
| --- | --- | --- |
| `animated-background` | Realce que **desliza** entre o item anterior e o novo, em vez de sumir num lugar e aparecer noutro. O olho acompanha a mudança e não precisa reencontrar o estado ativo. | `SelectButton`, `Tabs`, `Sidebar` |
| `disclosure` | Transição de altura a partir da altura real do conteúdo, sem salto e sem altura fixa chutada. | `Accordion`, `Panel` colapsável, `Fieldset` |
| `animated-number` e `sliding-number` | Número que transita entre valores em vez de trocar de golpe. Em painel que muda de período, é o que evita o operador perder de vista qual indicador mudou. | `KpiWidget`, `KpiFaixa` |
| `in-view` | Dispara a entrada só quando o elemento chega à área visível. Serve para conteúdo assíncrono, e não para enfeitar rolagem. | `Table` em carga incremental, `DataView` |
| `animated-group` | Entrada em cascata com atraso pequeno entre itens. **Só vale em lista curta.** | `EmptyState`, `ListaResumoWidget` |
| `transition-panel` | Troca de conteúdo entre painéis irmãos com altura acompanhando. | `Tabs`, `Wizard` |
| `toolbar-expandable` | Barra que cresce ao ganhar contexto, útil para a barra de ação em massa que hoje aparece de golpe. | `Table` com `acoesEmMassa` |

### Recusado, com o motivo

`glow-effect`, `border-trail`, `spotlight`, `progressive-blur`, `tilt`,
`magnetic`, `cursor`, `spinning-text`, `text-scramble`, `text-shimmer`,
`text-shimmer-wave`, `text-roll`, `text-morph`, `infinite-slider`.

Motivo comum: são efeitos que **chamam atenção para si**, e não para o dado. Num
sistema que o servidor usa oito horas por dia, atenção é recurso escasso e
gasta-se com o processo, não com a moldura. Vários batem direto no catálogo
anti-slop da casa: `COR-009` para sombra com glow, `COR-010` para vidro,
`ICO-005` para movimento sem função de orientação.

`morphing-dialog` e `morphing-popover` ficam de fora por outro motivo: nosso
`Dialog` usa `<dialog>` nativo com `showModal()`, que traz gestão de foco e de
camada superior de graça. Trocar isso por um morph animado custaria acessibilidade
para ganhar espetáculo.

## shadcn/ui · 61 componentes reais

### 28 que nós também temos

`Accordion, Avatar, Badge, Breadcrumb, Button, Card, Carousel, Checkbox,
ContextMenu, Dialog, Drawer, Input, InputOtp, Menubar, Message, Pagination,
Popover, RadioGroup, Select, Sidebar, Skeleton, Slider, Spinner, Switch, Table,
Tabs, Textarea, Tooltip`

### O que eles têm e nos falta, com valor real para B2G

| shadcn | O que resolve | Por que importa aqui |
| --- | --- | --- |
| `hover-card` | Painel de dados no ponteiro, com estrutura interna, e não texto solto. | **Fecha a lacuna nº 2 do mapa do TFD.** Nosso `Tooltip` aceita apenas `string`, o que exclui qualquer estrutura, e o protótipo usa painel rico em cinco células diferentes. |
| `input-group` | Campo com adorno antes e depois: unidade, prefixo, ícone, botão de ação. | Formulário de processo é cheio de `R$`, `%`, `CPF`, busca com ícone e campo com ação ao lado. Hoje cada tela improvisa isso. |
| `button-group` | Botões emendados como um grupo, com cantos e bordas resolvidos nas junções. | Barra de ação de formulário e de detalhe. Hoje eles ficam soltos com `gap`. |
| `item` | Primitivo de linha: líder, conteúdo de duas linhas, trilha. | É exatamente a anatomia de linha da nossa spec estrutural, que hoje cada componente reimplementa. |
| `kbd` | Marcador de atalho de teclado. | Sistema denso vive de atalho, e anunciar o atalho na interface é o que faz alguém aprendê-lo. |
| `command` | Paleta de comando por teclado. | Discutível em B2G e **não** entra nesta rodada: exige inventário de comandos e decisão de produto, não de design system. |

### A diferença de arquitetura, e o que fazer com ela

shadcn compõe (`<Dialog><DialogTrigger/><DialogContent/></Dialog>`) enquanto nós
passamos props. Composição dá liberdade de arranjo; prop dá garantia de anatomia.

**Decisão para esta rodada: continuamos com prop, e não migramos.** O catálogo
existe para ser traduzido em handoff para times Angular, e prop mapeia direto
para `@Input()`. Composição em React vira um problema de tradução do outro lado.

A exceção são os primitivos novos, `InputGroup` e `ButtonGroup`, que só fazem
sentido compondo, porque o que eles resolvem é justamente a junção entre peças.

## Watermelon UI e Aceternity

Não entram nesta rodada, e o motivo é de contexto e não de qualidade.

Aceternity é biblioteca de landing page: aurora, meteoros, feixes, cartão com
inclinação 3D, texto que se monta letra a letra. Oito das 33 regras do catálogo
anti-slop da casa descrevem exatamente esse repertório. Importá-lo produziria
**mais** aparência de peça gerada por IA, que é o oposto do que foi pedido.

Watermelon fica pendente de verificação pela mesma razão que derrubou a pesquisa
de Motion Primitives: o levantamento que existe não foi confirmado contra a fonte
real, então ele não é base para decisão.

## O que esta rodada vai fazer

1. **Artesania de superfície**, que é o diagnóstico central e não vem de
   biblioteca nenhuma: aresta, âncora e resposta de pressão nos controles.
2. **Realce deslizante** em `SelectButton` e `Tabs`, do `animated-background`.
3. **Altura real** em `Accordion` e `Panel`, do `disclosure`.
4. **Número em transição** em `KpiWidget` e `KpiFaixa`.
5. **Componentes novos:** `HoverCard`, `InputGroup`, `ButtonGroup`, `Kbd`.
6. **Estado vazio que mostra o objeto ausente**, em vez de glifo genérico.
