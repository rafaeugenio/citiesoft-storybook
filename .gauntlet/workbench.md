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

Seis críticos independentes, instância nova, sem acesso à autoavaliação do
implementador. Cada veredito fica gravado em `.gauntlet/vereditos/`.

#### Placar da rodada 2

| Crítico | Veredito | Nota | Referências | Bloq. | Maiores |
| --- | --- | --- | --- | --- | --- |
| Atomic Design e arquitetura de DS | `REPROVADO` | 2,00 | PERDE | 2 | 5 |
| Produto B2G e conteúdo | `REPROVADO` | 2,20 | PERDE | 2 | 8 |
| DesignOps e governança | `REPROVADO` | 2,50 | PERDE | 2 | 3 |
| Acessibilidade (e-MAG / WCAG 2.2 AA) | `REPROVADO` | 2,60 | PERDE | 0 | 5 |
| Engenharia e testes | `REPROVADO` | 2,86 | PERDE | 1 | 2 |
| Design QA e fidelidade visual | `REPROVADO` | 1,80 | PERDE | 2 | 6 |

Seis de seis reprovaram e nenhum empatou com as referências. A média é **2,33 de
4**, contra os 3,75 que o protocolo exige para `IMPRESSIONOU`. Nove bloqueadores
e 29 achados maiores. Nenhum crítico viu a avaliação dos outros, e mesmo assim
três chegaram de forma independente ao mesmo defeito de rastreabilidade, o que é
o sinal mais forte de que o achado é real.

A convergência tem um significado que vale registrar: o que reprova não é a
arquitetura. É a distância entre o que a documentação afirma e o que o código faz,
e a ausência de token onde o sistema precisava de um.

#### Achados do design system revelados pela rodada 2

A revisão cega elevou o total de achados do DS de 8 para 12. Os quatro novos são
todos de ausência de token, e todos foram encontrados por composição, nunca por
inspeção de componente isolado:

| # | Achado | Evidência |
| --- | --- | --- |
| 9 | **Não existe escala tipográfica de título.** Os tokens param em `body-lg: 16px`, então todo título do sistema é px literal: 48 declarações em 24 arquivos, com 14 valores distintos. Consequência medida: quatro H1 diferentes em seis templates. | `tokens.css:94-96` |
| 10 | **Não existe átomo de link.** O identificador de processo, que é o principal alvo de navegação das duas telas mais importantes, é `<a>` cru no azul default do navegador `#0000EE`. Dá 1,67:1 no tema escuro e não é o Citie Blue em tema claro. | medido no DOM da Consulta e da Listagem |
| 11 | **Não existe token de véu (scrim).** Dois organismos repetem o mesmo literal e o template inventou um terceiro valor, divergente, na mesma tela. | `Overlay.css`, `BlockUI.css`, `AppShell.css:238` |
| 12 | **`radius-xl: 12px` não pertence à escala que o próprio arquivo declara oficial** (`sm 4 / md 6 / lg 8`), e virou o raio dominante de card, usado em 15 pontos. | `tokens.css:5` contra `tokens.css:81` |

| 13 | **Não existem tokens de motion.** Descoberto ao construir o átomo de link: não há token de duração nem de curva, então o `Button` fixa `120ms ease-out` como literal e cada componente novo repete o literal ou inventa o próprio. | `tokens.css` sem `--citie-motion-*`; `Button.css:29-32` |

O padrão dos cinco é o mesmo e merece virar regra de governança: **onde o token
falta, o sistema improvisa, e a improvisação diverge.** Nenhum deles apareceria
numa story de componente isolado.

O achado 13 foi encontrado do jeito mais direto possível: eu ia usar
`var(--citie-motion-rapido, 120ms)` no componente novo, e o fallback silencioso
teria escondido a ausência. Escrever o fallback é exatamente o vício que produz
os outros quatro achados, então o componente passou a repetir o literal do
`Button` com o achado anotado no CSS, em vez de inventar um token sozinho.

#### Componente criado nesta rodada

`Átomos/Ações/Link` não existia. O identificador de processo, principal alvo de
navegação das duas telas mais usadas, era `<a>` cru: o navegador aplicava o
próprio `#0000EE`, fora da marca no tema claro e a **1,67:1** contra a linha
zebrada no escuro. Com os tokens de marca, o mesmo link mede 5,45:1 no branco,
5,12:1 na zebra clara, 5,30:1 no fundo escuro e 4,78:1 na zebra escura, os
quatro passando AA. Traz story de regressão sobre linha zebrada nos dois temas,
para que a volta do defeito reprove o build.

#### Veredito 1 — Atomic Design e arquitetura de DS

`REPROVADO`, nota **2,0 de 4**, com 2 bloqueadores, 5 achados maiores, 3 menores
e 1 de polimento. Perde do GOV.UK e do IBM Carbon; empata com o Polaris.

Os cinco achados de maior peso foram conferidos por mim contra o código antes de
qualquer correção. **Todos procedem.** A síntese do crítico acerta o diagnóstico:
o trabalho de arquitetura é sólido, mas a camada de verdade não é.

| # | Sev | Achado | Estado |
| --- | --- | --- | --- |
| 1 | Bloqueador | `VisaoGeral.mdx` afirma cadeia de composição que o código desmente em 3 dos 4 elos | corrigir |
| 2 | Bloqueador | `Sparkline` publicado como átomo, definido dentro do organismo `Chart.tsx`, ausente das 2 fontes de verdade | fix-estrutura |
| 3 | Maior | Destino inventado no mapa legado: `Moléculas/Feedback/SkeletonComposicoes` | fix-estrutura |
| 4 | Maior | `Button.css` com 12 hex literais; hover de success, danger e warn não acompanha o tema escuro | fix-tokens |
| 5 | Maior | Composições de Skeleton: 3 componentes sob 1 título, props de só um | fix-estrutura |
| 6 | Maior | `npm run lint` vermelho (`rules-of-hooks` em `Panel.stories.tsx:169`) | **corrigido** |
| 7 | Maior | 4 componentes classificados num nível e implementados na pasta de outro | fix-estrutura |
| 8 | Menor | Não existe token de véu; `AppShell` inventou cor de scrim divergente | fix-tokens |
| 9 | Menor | `Moléculas/Navegação de dados` existe para hospedar só `Pagination` | fix-estrutura |
| 10 | Menor | Critério de átomo exclui o que `Avatar` e `Image` fazem | corrigir |
| 11 | Polimento | Paleta categórica exportada de dentro do organismo `Chart` | fix-estrutura |
| 12 | Comparação | Só 7 de 90 componentes dizem quando **não** usar; GOV.UK exige em 100% | 5 agentes |

#### Causa raiz do bloqueador de rastreabilidade

A documentação afirmava "zero órfãos e zero destinos inventados" com as duas
metades falsas, porque a verificação descrita **não rodava contra o índice
publicado**, e sim contra uma lista paralela mantida à mão.

Correção durável: `scripts/verificar-catalogo.mjs`, registrado como
`npm run verificar-catalogo`. Lê `storybook-static/index.json`, que é o que o
navegador de fato serve, e falha com código 1 em seis invariantes: ordem e
existência dos sete grupos, destino inventado no mapa legado, componente
publicado ausente da classificação, nível declarado contra a pasta real, nível
declarado contra o grupo publicado, e título alimentado por mais de um arquivo.

Rodado contra o estado reprovado, ele reproduz sozinho **os seis achados
estruturais do crítico**, o que é a prova de que a checagem é real. A afirmação
de rastreabilidade só volta para a documentação quando este comando sair verde.
