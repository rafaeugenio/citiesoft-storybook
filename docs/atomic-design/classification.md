# Classificação atômica

Os dados desta classificação vivem em `classificacao.json`, que é a fonte usada
para gerar o inventário e o mapa legado. Este documento explica o critério e
registra as decisões que não são óbvias.

## Como cada peça foi classificada

A classificação não partiu do nome nem da categoria do PrimeNG. Partiu do
**grafo de composição extraído do código**: para cada componente, quais outros
componentes do catálogo ele importa.

| Nível | Critério |
| --- | --- |
| Fundação | Decisão visual ou sistêmica consumida pelos componentes. Não é componente. |
| Átomo | Peça indivisível. Não depende de outro componente do catálogo, ou depende apenas por composição opcional de slot. |
| Molécula | Resolve uma tarefa única e reconhecível combinando átomos. |
| Organismo | Seção autônoma com responsabilidade funcional própria, estado complexo ou dado tabular. |
| Template | Estrutura de tela sem conteúdo de domínio. |
| Página | Instância de um template com conteúdo e estado realistas. |

Resultado: **18 átomos, 34 moléculas e 37 organismos**, a partir de 70 pastas de
componente e 71 títulos anteriores.

## Os desvios, e por que eles existem

O mapa de hipótese sugerido classificava algumas peças de um jeito que o código
não sustenta. Cada desvio abaixo tem evidência de dependência.

### Input, Textarea e Select são moléculas, não átomos

No código, os três compõem o `FieldWrapper`, que monta rótulo, marcação de
obrigatório, texto de ajuda e mensagem de erro com ícone. Eles não são
indivisíveis: são **campo completo**, e campo completo é justamente o exemplo
que o próprio mapa de hipótese dá para molécula. Treze componentes consomem esse
primitivo.

O `Field` ficou em `src/components/primitives/`, porque é infraestrutura interna
e não aparece no catálogo como componente.

### RadioGroup é molécula, enquanto Checkbox, Switch e ToggleButton são átomos

Os três primeiros são controles indivisíveis. O RadioGroup compõe vários rádios
sob uma legenda e resolve a tarefa de escolha única em grupo, com navegação por
setas entre as opções.

### Sidebar é organismo, Breadcrumb e Stepper são moléculas

Os três viviam no mesmo arquivo; hoje a Sidebar tem pasta própria em
`organisms/Sidebar/` e o `Navigation/` das moléculas ficou com Breadcrumb e
Stepper. A Sidebar é chrome de aplicação, com seções,
sub-itens expansíveis, skip link, estado colapsado e a regra de que item sem
permissão não é renderizado. Breadcrumb e Stepper resolvem uma tarefa única cada.

### Sparkline é átomo, os demais gráficos são organismos

O Sparkline é uma linha de tendência indivisível, sem eixo, legenda, tooltip nem
tabela alternativa. BarChart, LineChart e DonutChart trazem moldura, legenda,
estados de carga, vazio e erro, e a alternância para a tabela acessível.

### AvatarGroup e as composições de Skeleton sobem de nível

`Avatar` e `Skeleton` são átomos. `AvatarGroup` empilha avatares com limite e
contador de excedente; `SkeletonParagrafo`, `SkeletonLista` e
`SkeletonFormulario` montam padrões de tela a partir do bloco. Todos resolvem uma
tarefa própria, então são moléculas, e cada um tem pasta própria em
`molecules/`.

### MeterGroup é molécula, não organismo

Resolve uma tarefa única, a distribuição proporcional com legenda, e depende
apenas da paleta categórica. Não tem estado complexo nem dado tabular. A paleta
mora em `src/tokens/paletas.ts`, como fundação: assim a molécula não precisa
importar nada do organismo de gráficos.

## O que a reclassificação encontrou

### Onze agrupamentos, não nove

A auditoria do código encontrou dois agrupamentos além dos previstos:
`Dados/Gráficos` documentava quatro componentes e `Formulário/Select`
documentava dois. Ambos entraram no desmembramento.

### Duas colisões de nome entre componentes independentes

O ponto único de exportação revelou que `ItemDoMenu` existia em `Navigation` e em
`TieredMenu`, e `NoDaArvore` em `Tree` e em `TreeTable`. Enquanto cada um vivia
isolado na sua pasta, a colisão era invisível.

Foram resolvidas **na origem**, renomeando para `ItemDoTieredMenu` e
`NoDaTreeTable`, em vez de mascaradas com apelido no barrel: o problema era de
nomenclatura, não de exportação.

## Compatibilidade

Nenhum componente sumiu. Os 71 títulos anteriores foram mapeados um a um em
`legacy-story-map.json`, com ação (`manter`, `mover` ou `dividir`), destino e
justificativa. A verificação de cobertura roda contra o inventário real e acusa
órfãos: hoje são **zero órfãos e zero destinos inventados**.

O total de stories é a invariante que prova que o desmembramento redistribuiu
documentação sem perder nada: **584 antes, 584 depois**, antes da adição de
templates e páginas.

Os imports ficaram estáveis por `src/index.ts`, que reexporta todos os módulos.
Se amanhã um átomo virar molécula, o arquivo muda de pasta e nenhum consumidor
quebra — foi exatamente o que aconteceu com `Sparkline` (para `atoms/`),
`RadioGroup`, `AvatarGroup` e as três composições de Skeleton (para
`molecules/`) e `Sidebar` (para `organisms/`), sem uma exportação pública sequer
mudar de nome.
