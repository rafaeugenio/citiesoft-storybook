# Refinamento estrutural dos componentes

Especificação derivada de quatro referências de design fornecidas pelo Rafael, mais
o protótipo TFD como base de arquétipo de tela.

## Regra que governa tudo

**Cor e tipografia não mudam.** As referências entram apenas como gramática de
estrutura: espaçamento, arredondamento, elevação, alinhamento, hierarquia de
tamanho e ritmo de movimento. Nenhum hexadecimal, nenhuma família de fonte e
nenhum peso vem delas.

Onde a referência usa roxo, nós usamos o azul da marca. Onde ela usa a fonte
dela, nós usamos Red Hat Display e Inter. O que copiamos é a **anatomia**.

## O diagnóstico que motivou o trabalho

O relato foi de falta de espaçamento correto, alinhamento, hierarquia e controles
ausentes, comparando com o protótipo TFD. A medição confirma a causa raiz, e ela
é a mesma dos achados anteriores do design system: **onde falta token, o
componente improvisa**.

| Lacuna medida | Consequência |
| --- | --- |
| A escala de espaçamento para em `spacing-5: 20px` | Não existe respiro interno de card. Cada card escolhe o próprio padding, e eles divergem. |
| A escala de sombra tem dois degraus, com 3px e 12px de desfoque | Não existe elevação suave. Card e overlay usam praticamente a mesma sombra, então a hierarquia de profundidade não se lê. |
| Não existem tokens de motion (achado nº 13) | Cada componente repete `120ms ease-out` ou inventa o próprio tempo. |
| Não existe anatomia de métrica | Cada widget monta rótulo e número do seu jeito, com tamanhos diferentes. |

## Gramática extraída das referências

### 1. Elevação suave e ampla, não dura e curta

As quatro referências usam sombra de desfoque grande e opacidade baixa, quase
sempre em duas camadas: uma sombra de contato curta e uma sombra ambiente longa.
Isso é o que faz o card "flutuar" sem parecer recortado.

Hoje temos `0 1px 3px rgba(16,24,40,0.08)` para card, que é sombra de contato
sozinha. Falta a camada ambiente.

**Escala nova**, em quatro degraus com papel definido:

| Degrau | Papel | Anatomia |
| --- | --- | --- |
| `flat` | Superfície ao nível do fundo. Linha de tabela, item de lista. | sem sombra, apenas borda |
| `raised` | Card em repouso, widget, painel. | contato curta + ambiente longa, opacidade baixa |
| `overlay` | Menu, popover, tooltip, dropdown. | ambiente mais longa, opacidade média |
| `dialog` | Diálogo modal, drawer. | ambiente muito longa, opacidade mais alta |

Regra de uso: **um elemento sobe no máximo um degrau ao receber hover**, e nunca
dois. Card em repouso é `raised` e vai a `overlay` no hover apenas quando ele é
clicável inteiro.

### 2. Respiro interno proporcional ao contêiner

As referências usam padding interno de card bem maior do que o nosso máximo
atual de 20px, e o padding cresce com o tamanho do contêiner.

| Contêiner | Padding interno |
| --- | --- |
| Chip, tag, badge | `spacing-1` / `spacing-2` |
| Controle (campo, botão) | `spacing-2` / `spacing-3` |
| Item de lista, linha de menu | `spacing-2` vertical, `spacing-3` horizontal |
| Card compacto, widget | `spacing-4` |
| Card padrão | `spacing-5` |
| Card de destaque, painel, diálogo | `spacing-6` (24px, **token novo**) |
| Seção de página | `spacing-8` (32px, **token novo**) |

O `gap` entre cards de um grid segue `spacing-5`, e entre seções segue
`spacing-8`.

### 3. Arredondamento por camada, e não por gosto

A regra que as referências seguem com consistência: **o contêiner externo tem
raio maior que o interno**. Um card de raio 16 com um card aninhado de raio 12 e
um controle de raio 8 lê como profundidade. Todos com o mesmo raio lê como
adesivo colado.

| Camada | Raio |
| --- | --- |
| Controle pequeno, chip, checkbox | `radius-sm` 4 |
| Campo, botão, item de menu | `radius-md` 6 a `radius-lg` 8 |
| Card aninhado, célula de widget | `radius-xl` 12 |
| Card externo, painel, diálogo | `radius-2xl` 16 (**token novo**) |
| Pílula, avatar, indicador de tendência | `radius-full` |

### 4. Anatomia de métrica

É o padrão mais repetido nas referências, e o que mais falta hoje. Toda métrica
tem três partes, nesta ordem vertical:

```
RÓTULO EM MAIÚSCULA MICRO     ← caption, letter-spacing largo, cor secundária
1.486                          ← display, peso alto, entrelinha apertada
↑ 8,2% no mês                  ← pílula de tendência
```

Regras fixas:

- O rótulo vem **acima** do número, nunca abaixo, e nunca do lado.
- O número usa `font-variant-numeric: tabular-nums`, para que a coluna de
  números continue alinhada quando o valor muda.
- A entrelinha do número é apertada (1.1), porque número grande com entrelinha
  de corpo abre um buraco visual acima e abaixo.
- A tendência é **pílula**, com ícone circular de seta e o texto ao lado. Ela
  carrega o significado por ícone e por texto, nunca por cor sozinha, que é
  exigência de acessibilidade e não escolha estética.
- O período comparado aparece em texto, não só no ícone: "no mês", "na semana".

### 5. Anatomia de linha

Toda linha de lista, item de menu, linha de tabela e opção de seleção segue a
mesma anatomia horizontal:

```
[ líder 20-40px ] gap-3 [ conteúdo, cresce ] gap-3 [ trilha, não encolhe ]
```

- **Líder**: ícone 20px, avatar 32px, ou caixa de ícone arredondada 40px.
- **Conteúdo**: uma ou duas linhas. Quando duas, a primeira é o nome em peso de
  ação e a segunda é o apoio em cor secundária e corpo menor.
- **Trilha**: chip de atalho, contador, seta, controle ou ação. Alinhada à
  direita e com `flex-shrink: 0`.
- Altura mínima de 40px em densidade normal e 32px em compacta, que é o alvo
  mínimo confortável sem quebrar a densidade que um sistema B2G exige.

### 6. Controle segmentado como pílula

As referências usam o segmentado como trilho de raio total, fundo levemente
recuado, e o segmento ativo como pílula de superfície com elevação `raised`. É
mais legível que o segmentado de borda que temos, porque o ativo se lê por
profundidade e não só por cor.

### 7. Grupo de avatares com anel de superfície

Avatares sobrepostos precisam de anel na cor da superfície que está atrás, e não
de borda branca fixa: no tema escuro a borda branca vira um traço luminoso. O
anel usa `box-shadow` de 2px na cor da superfície.

### 8. Extremidade de dado arredondada

Barra de progresso, barra de gráfico e arco de rosca terminam arredondados nas
referências. Regra: raio 4px na extremidade do dado, ancorado na linha de base,
e nunca arredondar a extremidade que encosta no eixo.

## Motion

Não existem tokens de motion hoje (achado nº 13). A gramática abaixo fecha isso.

| Token | Valor | Uso |
| --- | --- | --- |
| `motion-instantaneo` | 80ms | Realimentação de pressão, troca de cor de estado |
| `motion-rapido` | 140ms | Hover, foco, troca de ícone |
| `motion-padrao` | 220ms | Abrir e fechar de acordeão, popover, chip |
| `motion-lento` | 320ms | Drawer, diálogo, transição de rota |

| Curva | Valor | Uso |
| --- | --- | --- |
| `easing-saida` | `cubic-bezier(0.4, 0, 1, 1)` | Elemento saindo da tela |
| `easing-entrada` | `cubic-bezier(0, 0, 0.2, 1)` | Elemento entrando |
| `easing-padrao` | `cubic-bezier(0.4, 0, 0.2, 1)` | Movimento dentro da tela |

Regras:

1. **Entrada é mais lenta que saída.** O que entra precisa ser percebido, o que
   sai já foi decidido pelo usuário.
2. **Nada anima posição em lista longa.** Reordenar 50 linhas com transição
   custa quadro e atrapalha leitura.
3. **Todo componente com transição respeita `prefers-reduced-motion: reduce`**,
   zerando a duração. Isso já é prática do repositório e continua obrigatório.
4. **Movimento nunca é a única pista de mudança de estado.** Ele acompanha uma
   mudança que também é legível parada.

## O que fica de fora, de propósito

- **Glow colorido** ao redor de card. As referências usam sombra neutra; o brilho
  colorido que aparece em algumas telas vem da cor de marca delas, e importar
  isso mudaria a leitura de cor do nosso sistema.
- **Ilustração e avatar ilustrado.** São conteúdo, não estrutura.
- **Raio acima de 16px em card.** Acima disso a densidade de um sistema de
  processo administrativo sofre, porque o canto come área útil de tabela.
