# ADR 001 — Catálogo em React, produto em Angular

- **Status**: aceito
- **Data**: 19 de agosto de 2026
- **Contexto desta decisão**: reorganização do catálogo em Atomic Design

## Contexto

Existe uma assimetria real entre onde o design system é documentado e onde ele é
consumido, e ela precisa ficar registrada para não ser redescoberta a cada
sprint.

**O catálogo** roda em React com Vite. Foi construído assim, tem 584 stories,
testes de interação no Chromium e gate de acessibilidade com axe em modo `error`.
Está publicado e é a referência viva do design system.

**Os produtos** Citiesoft rodam predominantemente em **Angular com PrimeNG**,
sobre a linhagem `sakai-ng`. É lá que o código chega ao servidor público.

**A fonte de estrutura** é o Figma **CitieOne**, que é o kit PrimeNG que a
empresa comprou. Ele ainda carrega os tokens padrão do PrimeOne/Aura: `primary`
lá é o azul Tailwind `#3b82f6`, e não o Citie Blue `#1261E4` do brandbook.

## Decisão

**Manter o catálogo em React** e tratá-lo como referência normativa de
comportamento, estado e acessibilidade, não como biblioteca de produção Angular.

Cada componente do catálogo documenta o seu **equivalente PrimeNG**, para que o
handoff seja direto: o desenvolvedor Angular lê o comportamento e o contrato de
acessibilidade aqui e implementa no `p-*` correspondente.

**A marca vem do vault, a estrutura vem do Figma.** Nenhum valor de cor é
copiado do CitieOne.

## Alternativas consideradas

**Migrar o catálogo para Angular.** Descartada. O custo é reescrever 70
componentes e 584 stories, e o ganho seria paridade de framework com o produto.
Só que o valor do catálogo não está no framework: está na especificação de
comportamento, nos estados documentados e no gate de acessibilidade, que são
independentes de renderer. Migrar destruiria o ativo para reconstruir o mesmo
ativo.

**Manter dois catálogos, React e Angular.** Descartada. Duas implementações da
mesma especificação divergem, e a divergência silenciosa é pior do que a
assimetria declarada. O custo de manutenção dobra e a confiança cai.

**Adotar os tokens do CitieOne como verdade.** Descartada. Contraria o brandbook,
que é explícito sobre o Citie Blue, e deixaria metade da biblioteca em azul
Tailwind.

## Consequências

**Positivas.** O catálogo continua evoluindo sem custo de migração. A
especificação fica em um só lugar. O gate de acessibilidade roda de verdade, com
teste automatizado, o que não existiria numa documentação estática.

**Negativas, e é preciso ser honesto sobre elas.** Não existe garantia
automatizada de que o componente Angular do produto siga o que o catálogo
especifica: a conformidade depende de revisão humana no handoff. E o
desenvolvedor Angular precisa traduzir o exemplo React, o que adiciona um passo.

**Mitigações adotadas.** Todo componente cita o equivalente PrimeNG na
documentação. Os estados obrigatórios e o contrato de teclado estão escritos em
prosa, não apenas em código React. As páginas do catálogo mostram telas completas
para revisão de design sem depender de back-end nem de framework.

## Quando revisitar

Esta decisão deve ser reaberta se acontecer qualquer um destes:

1. A Citiesoft passar a construir produto novo em React, o que tornaria o
   catálogo consumível diretamente.
2. O kit CitieOne receber os tokens da marca, o que removeria a etapa manual de
   troca de cor.
3. Surgir divergência recorrente entre o catálogo e o produto Angular, sinal de
   que a referência não está sendo respeitada e de que o custo da assimetria
   passou a ser real.
