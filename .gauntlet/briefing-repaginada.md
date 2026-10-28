# Briefing comum: repaginada do Storybook para o UI Kit Citiesoft (shadcn)

Vale para todo produtor e todo revisor dos lotes 1 a 6. Leia inteiro antes de
abrir qualquer arquivo de componente.

## Onde as coisas estão

- Repositório: `/Users/rafaeleugenio/Documents/Cursor/Repositorios/citiesoft-storybook`, branch `revisao`. Não troque de branch e não faça commit; o orquestrador comita por lote.
- Spec da linguagem visual: `docs/figma-ui-kit.md`. Anatomia medida por componente, mapa de tokens e composição de tela do Sismental.
- Capturas de referência: `docs/referencias/kit/*.png` (o kit em si) e `docs/referencias/sismental/*.png` (composição de tela). Leia as imagens com a ferramenta Read.
- Tokens: `src/tokens/tokens.css`. Depois do Lote 0 ele já tem raio 10, alturas 24/32/36/40/48, accent, secondary, popover e sidebar. Componente consome token por nome, nunca valor literal. Se faltar um token, crie em `tokens.css` com comentário de papel e medição, e registre no handoff.
- Fundações: `src/fundacoes/*.stories.tsx`. Token novo entra na tabela da fundação certa com `uso` e `evitar`.
- Verificação do catálogo: `scripts/verificar-catalogo.mjs`, 7 invariantes.
- Rodadas anteriores: `.gauntlet/workbench.md` e `.gauntlet/vereditos/*.yaml`. O formato de veredito está lá.

## O que "repaginar" significa aqui

O Storybook é a referência visual de todos os sistemas Citiesoft, em qualquer
stack (React, Angular, Vue, Flutter). Por isso a entrega é linguagem visual em
CSS puro sobre tokens, sem Tailwind, sem Radix, sem CVA, sem biblioteca nova. A
API dos componentes (props, nomes, eventos) fica como está, salvo prop nova que a
anatomia do kit exige (tamanho `mini` e `xl`, por exemplo).

Marca: azul Citiesoft e tipografia de `tokens.css`. O teal e o gradiente do
Sismental são do Governo do Maranhão e ficam de fora. O que se copia do
Sismental é composição: ritmo, hierarquia, agrupamento, ordem de leitura.

## Critério de entrega (o mesmo das rodadas anteriores)

Produtor e revisor são agentes distintos. O revisor não viu o processo, só o
resultado, e escreve o veredito em `.gauntlet/vereditos/<lote>-<componente>.yaml`
no formato já usado: `veredito: REPROVADO|APROVADO|SURPREENDEU`,
`veredito_anti_slop`, `gate_tecnico`, `achados` com severidade (BLOQUEADOR, MAIOR,
MENOR, POLIMENTO) e `id_anti_slop` quando couber, `o_que_me_surpreendeu`,
`o_que_faltou_para_surpreender`.

SURPREENDEU exige duas ou mais decisões específicas com evidência medida, e
escopo limpo. O critério é o estado do componente hoje, e não a novidade em
relação à rodada anterior. O revisor sabota os testes novos (inverte a condição,
apaga o token) para provar que eles falham quando devem.

Medir vence afirmar: contraste em número, altura em pixel inteiro, anel de foco
visível por teclado nos dois temas.

Sabotagem nunca na árvore compartilhada: vários produtores editam ao mesmo tempo,
e um restauro de arquivo engole a escrita alheia. O revisor cria um worktree
próprio (`git worktree add /Users/rafaeleugenio/dev/citiesoft-storybook-revisao-<lote> revisao`,
copia os arquivos não commitados do lote para lá com `git diff | git apply`, e
usa o `node_modules` do repositório principal por symlink) e sabota lá. O
veredito é gravado no repositório principal.

Nota de ambiente do worktree: `node_modules` por symlink quebra o runner (o
addon-vitest resolve o setup-file pelo realpath e erra a URL do dev server, e a
suíte reporta "no tests"). Use hardlinks: `cp -al <repo>/node_modules
<worktree>/node_modules`. Se insistir no symlink, precisa de `server.fs.allow`
com o caminho do repositório principal no `vite.config.ts` do worktree, e essa
alteração não pode ir para o repositório principal. Toda regra de contraste já medida em
`tokens.css` é piso, não teto.

## Regras de texto, sem exceção

Em código, comentário, story, doc, veredito e handoff:
- Nunca travessão `—`. Vírgula, dois pontos, ponto.
- Nunca negação paralela: "não é X, é Y", "não X, mas Y", "em vez de X, Y" como
  figura retórica. Diga o que é.
- Português com acento e cedilha. Nomes de prop e classe seguem o padrão do
  repositório (`citie-*`, props em português).

## Gates

```
npm run gate                 # tema claro, obrigatório verde no que você tocou
npm run test-storybook:dark  # reporte a contagem antes e depois; zero falha nova
npm run verificar-catalogo
```

Dívida conhecida no escuro: 84 falhas em 15 arquivos de select e menu antes da
repaginada. Quem toca nesses arquivos tem que reduzir a contagem, nunca aumentar.

Build estático em pasta privada: com vários lotes rodando gate ao mesmo tempo,
`storybook-static/` é reescrito por cada um e fica com `index.json` e assets de
builds distintos. Para captura ou verificação, construa em
`$CLAUDE_JOB_DIR/tmp/static-<lote>` (`npx storybook build -o <pasta>`) e aponte o
script para lá.

## Handoff do produtor

`.gauntlet/<lote>-handoff.md`: componentes tocados, decisões de anatomia com o
valor do kit ao lado, tokens criados, medições, resultado dos gates com
contagens, e o que ficou fora com motivo. Até 40 linhas. O revisor lê o handoff
depois de formar a própria opinião, nunca antes.
