# Lote 2: campos, no estilo do kit

Componentes tocados: `primitives/Field` (base de Input, Select, Textarea, InputGroup),
`molecules/Input`, `InputGroup`, `Select`, `MultiSelect`, `AutoComplete`, `DatePicker`,
`InputOtp`, `FloatLabel`, `IftaLabel`, `atoms/Choice`, `atoms/Slider`. `Textarea` e
`RadioGroup` herdam o Field sem CSS próprio para o que mudou, sem edição adicional.

## Decisões de anatomia (valor do kit ao lado)

- Raio do campo: `radius-md` 6px para `radius-lg` 10px (`kit-input.png`), no primitivo
  Field, InputGroup e nos trilhos de MultiSelect e AutoComplete. Cantos concêntricos das
  peças na ponta recalculados (`raio - 1px`).
- Corpo de texto: Small/Regular/Large unificados em `body-md` 14/20; antes cada tamanho
  tinha corpo próprio (13/14/16). Só o Mini muda, para `body-xs` 12/16, tamanho novo
  adicionado ao `FieldSize` (`mini | small | normal | large`), altura 24, padding
  `spacing-1-5` (6px).
- Padding horizontal do campo: 8/12/16 (Small/Regular/Large), mapeado para
  `spacing-2/3/4`; antes usava `spacing-3/4/5` (12/16/20), um degrau acima do kit.
- Item de opção (MultiSelect, AutoComplete): 36px para 32px, padding `spacing-1-5 x
  spacing-2`, raio `sm` 4 para `md` 6. Hover em `accent`, selecionado em `accent-forte`
  com rótulo `text-primary` (brand-primary sobre accent-forte mede 3,95:1 e reprova o
  piso de 4,5:1, medição do Lote 0).
- Checkbox/Radio 18px para 16px; Switch 35x21 para 33x18, polegar 17 para 14; Slider
  marcador 20 para 16.
- DatePicker: dia do calendário `radius-sm` 4 para `radius-md` 6; contêiner do painel
  recalculado por `calc()` para manter a concentricidade sem token novo. Ícone de
  calendário migrado para a esquerda do campo (padrão Sismental); novo suporte a afixo
  inicial em `Field.css` (`--has-affix-start`, `__affix--start`).
- InputOtp: casas viram trilho de borda compartilhada, raio 10 só nas pontas, no mesmo
  padrão de concentricidade do InputGroup.

## Tokens

Nenhum token novo. Um `calc()` combina `radius-md` e `spacing-3` no DatePicker para o
raio 18 sem token próprio.

## Gates

- `test-storybook` (16 arquivos do lote, isolado): **117/117 verdes**.
- `test-storybook:dark` (mesmo isolamento): **9 falhas em 2 arquivos**, MultiSelect
  (`placeholder` e `chip` sobre fundo escuro). Nenhuma das duas regras foi tocada por
  este lote; é dívida documentada no briefing (MultiSelect/AutoComplete na dívida do
  escuro). Não reduzi por falta de orçamento de sessão; sinalizado para o próximo passe.
- `test-storybook:dark` (suíte inteira, árvore compartilhada com Lote 1 e 3 em curso):
  79 falhas em 31 arquivos. Número não isolável do trabalho paralelo; a fatia deste
  lote está nos 9 acima.
- `verificar-catalogo`: verde. `tsc -b --force`: verde.
- Ajustei um teste que media o raio antigo por literal: `InputGroup.stories.tsx`,
  junções de 6px para 10px (5px para 9px no canto concêntrico do controle).

## Adendo: correções do veredito do revisor

1. BLOQUEADOR corrigido: guarda de `Estado · inválido` em `Input.stories.tsx` trocou
   `indexOf('rgb') + slice` (degradava para comparar um caractere isolado quando o token
   virava `none`) por extração de cor via regex `rgba?\([^)]+\)`, que lança se não achar
   cor reconhecível, mais `expect(sombra).not.toBe('none')` explícito. Sabotado o token
   para `none`: reprova com erro de extração, não silenciosamente. Revertido após o teste.
2. MAIOR corrigido: novo `play` na story `Bordas` de `Cores.stories.tsx`, medindo
   `contraste(form-field-border, background-surface) >= 3` no tema ativo do container.
   Sabotado o token para `#e8eaed`: reprova em 1,21:1. Revertido após o teste.
3. MAIOR corrigido: `Slider.css` moveu o preenchimento do trilho para
   `::-webkit-slider-runnable-track`/`::-moz-range-track` (6px, anatomia do kit) e deu ao
   `<input>` a caixa cheia de `--citie-touch-target-min` (24px), horizontal e vertical; o
   trilho duplo (`trilho-duplo`, `--sobreposto`) acompanhou a mesma altura, com o traço
   pintado recentrado por `translate`. Dois testes novos em `Slider.stories.tsx` medem
   `getBoundingClientRect()` do próprio `<input>` (altura no horizontal, largura no
   vertical) `>= 24`. Sabotado para 16px: reprova. Revertido após o teste.

Gates após as três correções, escopo isolado (17 arquivos, incluindo `Cores.stories.tsx`
pela nova guarda): claro 126/126 verde. Escuro: 10 falhas em 3 arquivos. Nove são a
mesma dívida já registrada de MultiSelect/AutoComplete (placeholder e chip); a décima é
`Cores > Texto`, falha pré-existente de `text-placeholder` sobre `background-surface`
no escuro (3,51:1), que só apareceu porque este passe passou a incluir
`Cores.stories.tsx` no escopo isolado. Nenhuma das duas é regra tocada por este lote.
`tsc -b --force` verde.

## Fora do escopo

- Não recriei Radio como componente próprio: continua vivendo em `RadioGroup`,
  reaproveitando `.citie-choice__control` do átomo de escolha.
- Não removi as variantes Small/Large de InputOtp para forçar só o 36 do kit: o próprio
  arquivo documenta as três como variante Figma (Size), e story de regressão do Lote 0
  já mede as três alturas.
