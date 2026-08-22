# Tese de refinamento visual

Documento exigido pelo passo 2 da política `citiesoft-anti-slop`: declarar a
intenção antes da primeira linha de código.

Rota enquadrada: **produto B2G**. A hierarquia da política vale, então exigência
de acessibilidade e PrimeOne vencem qualquer referência genérica, e a
consistência do design system vence variedade entre peças.

## O diagnóstico, formado olhando e não supondo

O relato foi de componentes "sem graça" e "com cara de IA". Capturei o Button e
o EmptyState renderizados antes de decidir qualquer coisa. O que se vê:

| Sintoma observado | O que ele revela |
| --- | --- |
| O botão primário é preenchimento chapado, sem definição de aresta, sem ancoragem e sem resposta ao clique | Ausência de trabalho de superfície. Lê como cor de marca aplicada ao botão padrão do navegador. |
| O estado vazio usa um glifo de documento em contorno fino, sem relação com o domínio | **É o sinal mais forte de "cara de IA" do catálogo.** Ícone genérico é o que qualquer gerador entrega. |
| Ícone, título, descrição e botão empilhados e centralizados, com espaçamento uniforme | A composição mais automática que existe. Nenhuma decisão foi tomada ali. |
| "prestação de contas" órfão sozinho na segunda linha | Medida de texto não controlada. Detalhe pequeno que denuncia falta de acabamento. |
| Nenhuma diferença de profundidade entre repouso e ponteiro | Estados intermediários ausentes. |

## A tese

**O que falta aos nossos componentes é artesania, e não brilho.**

Um botão parece projetado por três coisas que nada têm a ver com efeito:
definição de aresta na própria cor, uma âncora de sombra curta que o assenta na
superfície, e um deslocamento de 1px no clique que devolve a sensação de
pressão. Nenhuma delas aparece numa captura de tela parada, e todas as três
aparecem no uso.

Um estado vazio parece projetado quando o desenho **mostra o objeto que falta**,
e não um glifo genérico de documento. Para uma listagem de lançamentos, o
desenho certo é a própria tabela em fantasma, com duas ou três linhas esmaecidas,
porque isso ensina a estrutura que vai aparecer ali quando houver dado.

## Tese visual

Superfície com aresta e âncora. Todo preenchimento sólido ganha uma borda da
própria matiz, um degrau mais escura, e uma sombra de contato curta. Todo estado
de pressão desloca. Nenhum ganha brilho, gradiente ou véu de vidro.

## Tese de interação

Faixa de 80ms a 220ms, já definida na fundação de motion. Hover muda
profundidade em um degrau, nunca dois. Pressão desloca 1px e devolve. Entrada de
conteúdo assíncrono cresce da altura real, sem salto. Tudo respeita
`prefers-reduced-motion`.

**Vetado nesta rodada:** movimento que chama atenção sozinho, elemento que se
move sem o usuário ter agido, e qualquer animação em lista longa.

## Demonstração real

O refino é medido nas telas compostas que já existem: Consulta de processos,
Detalhe do processo, Painel de TFD, Cadastro de servidor e Nova solicitação. Um
componente só é considerado melhor quando a tela composta fica melhor.

## Risco desta peça

Os IDs do catálogo com maior chance de aparecer, dado que as referências
escolhidas pelo dono do projeto são bibliotecas de landing page:

| ID | Regra | Onde o risco entra |
| --- | --- | --- |
| `COR-007` | Aurora, blobs e fundo radial genérico | Aceternity usa isso como assinatura |
| `COR-009` | Sombra sem token, empilhada ou com glow | Watermelon e Aceternity abusam de glow |
| `COR-010` | Liquid glass e glassmorphism malfeitos | Presente em quase toda biblioteca nova |
| `COR-001` | Gradiente agressivo | Botão com gradiente é o clichê da categoria |
| `LAY-005` | Cantos excessivamente arredondados | A moda atual é raio 16 a 24 em tudo |
| `LAY-003` | Bento grid sem hierarquia real | Tentação ao redesenhar o painel |
| `ICO-003` | Sparkle e brilho como atalho de IA | Aparece em qualquer conjunto de ícones novo |
| `ICO-005` | Setas animadas sem função de orientação | Motion Primitives tem vários |

**Consequência prática:** a triagem das referências é obrigatória, e a maior
parte do Aceternity fica de fora. O valor vem do shadcn, que é acabamento e
composição, e do Motion Primitives, que é comportamento.

## O paradoxo que orienta a rodada

O dono do projeto pediu para usar bibliotecas modernas porque nossos
componentes parecem feitos por IA. Acontece que essas bibliotecas são a fonte de
oito das regras do catálogo anti-slop. Importá-las sem triagem produziria **mais**
cara de IA, não menos.

O que se colhe delas é o que elas fazem bem e é invisível: qualidade de estado,
composição de API, coreografia de entrada e saída, tratamento de foco. O que se
descarta é o espetáculo.

## Critério de pronto

Cada componente refinado passa por um revisor que não o produziu, e o veredito
precisa ser de espanto genuíno, não de aprovação. Junto disso, o gate técnico de
sempre: suíte verde nos dois temas, lint, typecheck, build e verificador de
catálogo.
