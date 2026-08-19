# Gauntlet — bancada de trabalho

Registro objetivo das rodadas de revisão. Cada achado vira tarefa rastreável
aqui. Quem implementa não julga o próprio trabalho.

## Baseline mensurável

| Medida | Antes | Depois |
| --- | --- | --- |
| Entradas no índice | 655 | a medir no build final |
| Stories | 584 | 676 |
| Arquivos de story | 71 | 103 |
| Títulos de catálogo | 71 | 104 |
| Grupos de primeiro nível | 9 funcionais | 7 atômicos |
| Templates | 0 | 6 |
| Páginas de produto | 0 | 5 |
| Ponto único de exportação | não existia | 70 módulos |
| Testes verdes | 584/584 | 676/676 |
| Achados do DS documentados | 6 | 8 |

## Barra concreta de excelência

Um resultado apenas correto volta para implementação. Para `IMPRESSIONOU`, o
trabalho precisa demonstrar, com evidência verificável:

1. **Composição visível.** O catálogo mostra a cadeia Fundação → Página com um
   exemplo real percorrido, não com uma definição abstrata de Atomic Design.
2. **Rastreabilidade total.** Todo título antigo tem destino verificável e a
   verificação é executável, não uma afirmação em prosa.
3. **Decisão documentada onde houve julgamento.** Cada desvio de classificação
   traz o motivo e a evidência de dependência.
4. **Descoberta, não só reorganização.** A reestruturação precisa ter revelado
   defeito que a organização anterior escondia.
5. **Zero cópia de implementação** em templates e páginas.
6. **Estados reais, não felizes.** Cada página cobre carregando, vazio de
   primeiro uso, vazio por filtro, erro e sem permissão, com a distinção entre
   os dois vazios preservada.
7. **Acessibilidade provada.** Gate em modo `error`, teclado verificado por
   `play` function, e contraste conferido por cálculo.

## Referências de excelência

Escolhidas por serem catálogos públicos, atuais e comparáveis, com o aspecto
específico que cada uma serve de régua:

| Referência | O que será comparado |
| --- | --- |
| **GOV.UK Design System** | O análogo B2G mais próximo. Régua para "quando usar e quando não usar", linguagem simples e evidência de acessibilidade por componente. |
| **IBM Carbon Design System** | Régua para profundidade documental: tokens, estados, densidade e a ligação entre fundação e componente. |
| **Shopify Polaris** | Régua para documentação de API de componente e diretrizes de conteúdo em microcopy. |

O Storybook Citiesoft precisa empatar ou vencer nos aspectos acima, adequados ao
contexto B2G. As referências são régua, não modelo de cópia: nada de marca,
código, identidade ou conteúdo delas entra aqui.

## Evidências mínimas por gate

- inventário executável do catálogo (`index.json` do build);
- verificação de cobertura dos 71 títulos com saída de órfãos;
- resultado de `tsc -b --force`, da suíte e dos dois builds;
- cálculo de contraste para toda decisão de cor;
- URL publicada com HTTP 200 e sidebar carregando.

## Rodadas

### Rodada 1 — implementação

| Bloco | Executor | Estado |
| --- | --- | --- |
| Auditoria e classificação | orquestrador | concluído |
| Reorganização física e barrel | orquestrador | concluído |
| Desmembramento de 13 documentações | 12 agentes | concluído |
| Visão geral, ordem do sidebar | orquestrador | concluído |
| 6 templates e 5 páginas | 6 agentes | concluído |
| Correção das 22 falhas da integração | 5 agentes + orquestrador | concluído |

Achados corrigidos nesta rodada, todos com evidência:

| Achado | Evidência | Correção |
| --- | --- | --- |
| Tema escuro nunca exercitado pelo gate | AppShell em escuro reprovou com 3 violações | Story de tema escuro no template |
| Item ativo da Sidebar no escuro: 4,39:1 | cálculo de contraste | Texto passa a usar `brand.hover` (6,47:1) |
| Inicial do Avatar sobre superfície colorida: 1,90:1 | cálculo de contraste | Avatar compõe fundo opaco no escuro (8,11:1) |
| `heading-order` em tela composta | axe no template de Detalhe | Hierarquia corrigida no template |
| 2 colisões de nome entre componentes | erro do barrel | Renomeadas na origem |
| `storySort` em constante quebra o índice | erro de indexação do Storybook | Literal inline com o motivo documentado |
| Import de CSS não reescrito na mudança de pasta | Vite falhou onde `tsc` passou | Regex corrigida para import de efeito colateral |

### Rodada 2 — revisão cega

Pendente. Críticos com instância nova, sem acesso à autoavaliação do
implementador.
