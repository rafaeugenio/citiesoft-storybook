# Baseline antes da reorganização em Atomic Design

Medição do catálogo publicado em `https://citiesoft-storybook.vercel.app` antes
de qualquer alteração desta entrega, obtida do `index.json` do build e conferida
contra o código-fonte.

## Números

| Medida | Valor |
| --- | --- |
| Entradas no índice | 655 |
| Stories | 584 |
| Páginas de documentação (autodocs) | 71 |
| Títulos de catálogo | 71 |
| Pastas de componente | 70 |
| Stories com `play` function | 434 |
| Builder | Vite |
| Renderer | React |

Os números do código bateram exatamente com os do site publicado, o que confirma
que o baseline medido é o mesmo que está no ar.

## Taxonomia anterior

Nove grupos funcionais, próximos da organização do catálogo PrimeNG:

| Grupo | Títulos |
| --- | --- |
| Formulário | 21 |
| Dados | 16 |
| Layout | 8 |
| Navegação | 7 |
| Feedback | 6 |
| Overlay | 4 |
| Mídia | 4 |
| Ação | 3 |
| Fundações | 2 |

A organização era funcional e cobria bem variantes, estados e acessibilidade,
mas não tornava visível a cadeia de composição: nada no catálogo dizia que a
`Table` é feita de `Checkbox`, `StatusIndicator` e `Skeleton`, nem que trocar um
token muda uma tela inteira.

## Agrupamentos multifuncionais encontrados

A auditoria do código, e não apenas da navegação, encontrou **onze** arquivos que
documentavam mais de um componente independente sob um único título. Dois deles
não constavam do escopo inicial e foram descobertos na leitura dos exports:
`Dados/Gráficos` e `Formulário/Select`.

| Título anterior | Componentes exportados |
| --- | --- |
| Dados/Marcadores | Badge · Tag · StatusIndicator · Chip |
| Formulário/Escolha | Checkbox · RadioGroup · Switch · ToggleButton |
| Feedback/Toast e Message | Toast · ToastStack · Message |
| Feedback/Progresso | ProgressBar · Spinner |
| Layout/Navegação | Breadcrumb · Stepper · Sidebar |
| Layout/Tabs e Accordion | Tabs · Accordion |
| Overlay/Dialog e Drawer | Dialog · ConfirmDialog · Drawer |
| Overlay/Tooltip e Popover | Tooltip · Popover |
| Dados/Widgets de dashboard | KpiWidget · ListaResumoWidget |
| Dados/Gráficos | BarChart · LineChart · DonutChart · Sparkline |
| Formulário/Select | Select · SelectButton |

Somando os dois arquivos que separam um átomo da sua composição (`Avatar` e
`Skeleton`), são **13 desmembramentos**.

## Grafo de composição medido

Extraído dos imports relativos entre componentes, não da intuição:

- 34 componentes **não dependem** de nenhum outro componente do catálogo;
- 36 componentes dependem de ao menos um;
- a dependência mais comum é o primitivo `Field` (13 componentes o consomem),
  seguido de `Button` (11) e `Skeleton` (4);
- a cadeia mais profunda é `DataView`, que compõe `Card`, `EmptyState`,
  `Pagination`, `Select` e `Skeleton`.

Esse grafo é o que sustenta a classificação atômica desta entrega. O critério e
os desvios estão em `classification.md`.

## Estado técnico no baseline

| Verificação | Resultado |
| --- | --- |
| `tsc -b --force` | limpo |
| `npm run test-storybook` | 584 de 584 |
| `npm run build` | sem erro |
| `npm run build-storybook` | sem erro |
| Violações críticas de axe | nenhuma |

Havia quatro stories com violação de contraste **deliberadamente** em modo aviso,
por serem achado aberto do design system e não defeito de implementação. Estão
listadas no `README` com a correção proposta.

## Riscos registrados antes de editar

1. Mover 70 pastas quebra imports relativos: mitigado por reescrita programática
   e por um ponto único de exportação em `src/index.ts`.
2. Desmembrar documentação pode perder story: mitigado por contagem antes e
   depois, com o total de 584 como invariante.
3. Os wireframes de tela vivem no vault, não neste repositório, o que cria uma
   dependência externa para regenerar templates. Registrado em
   `template-inventory.md`.
