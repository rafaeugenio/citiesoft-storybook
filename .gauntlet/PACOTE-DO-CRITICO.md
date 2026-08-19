# Pacote do crítico

Você é um revisor independente. Não implementou nada disto e não deve implementar
nada agora. Sua tarefa é **avaliar e produzir um veredito com evidência**.

## O que foi pedido

Reorganizar o catálogo de componentes do design system Citiesoft com a
metodologia **Atomic Design** (Brad Frost), preservando o trabalho existente, e
acrescentar templates e páginas derivados da biblioteca de telas do design
system.

Requisitos que a demanda estabeleceu:

1. Sidebar na ordem: Visão geral, Fundações, Átomos, Moléculas, Organismos,
   Templates, Páginas.
2. Os 71 títulos anteriores mapeados, sem nenhum componente perdido.
3. Agrupamentos que documentavam mais de um componente desmembrados.
4. Templates reconstruídos com componentes reais do sistema, sem cópia de
   implementação.
5. Páginas demonstrando estados e fluxos críticos.
6. APIs e exports preservados, ou migração compatível documentada.
7. Acessibilidade, testes, typecheck e build passando.
8. Classificação por papel e dependência de composição, não pelo nome ou pela
   categoria original do PrimeNG.

## Onde avaliar

- **Código**: `/Users/rafaeleugenio/Documents/Cursor/Repositorios/citiesoft-storybook`
- **Build navegável**: `http://localhost:6100` (já está servindo)
- **Índice do catálogo**: `http://localhost:6100/index.json`
- **Documentação da entrega**: `docs/atomic-design/`
- **Guias usados pela implementação**: `docs/PORT-GUIDE.md`,
  `docs/atomic-design/GUIA-DESMEMBRAMENTO.md`,
  `docs/atomic-design/GUIA-TEMPLATES.md`

Comandos disponíveis para verificação:

```bash
./node_modules/.bin/tsc -b --force      # typecheck
npm run test-storybook                   # suíte no Chromium (demora; use com parcimônia)
npm run test-storybook -- <caminho>      # suíte de um recorte
npm run lint                             # oxlint
```

Se for rodar a suíte completa, rode **uma vez só**: ela usa navegador e
execuções simultâneas se atrapalham.

## Baseline anterior à mudança

| Medida | Valor |
| --- | --- |
| Entradas no índice | 655 |
| Stories | 584 |
| Títulos | 71 |
| Grupos | 9 funcionais (Ação, Dados, Feedback, Formulário, Fundações, Layout, Mídia, Navegação, Overlay) |
| Templates e páginas | nenhum |

## Referências de excelência

Use como régua, no aspecto indicado. Não é para copiar nada delas:

| Referência | Aspecto |
| --- | --- |
| GOV.UK Design System | Análogo B2G. "Quando usar e quando não usar", linguagem simples, evidência de acessibilidade. |
| IBM Carbon | Profundidade documental: tokens, estados, densidade, ligação fundação ↔ componente. |
| Shopify Polaris | Documentação de API de componente e diretrizes de microcopy. |

## Formato obrigatório da sua resposta

```yaml
revisor: <sua especialidade>
artefato_avaliado: <commit, build ou URL>
veredito: REPROVADO | APROVADO | IMPRESSIONOU
nota_media_0_a_4: <número>
criterios_criticos:
  - criterio: <nome>
    nota_0_a_4: <número>
    evidencia: <arquivo, linha, saída de comando ou observação no build>
comparacao_com_referencias:
  resultado: PERDE | EMPATA | VENCE
  evidencia: <comparação específica, não genérica>
achados:
  - severidade: BLOQUEADOR | MAIOR | MENOR | POLIMENTO
    descricao: <problema observável>
    evidencia: <local exato>
    correcao_exigida: <resultado esperado>
qualidades_surpreendentes:
  - <qualidade específica com evidência>
  - <segunda qualidade específica com evidência>
motivo_do_veredito: <síntese objetiva>
```

## Regras do veredito

- **REPROVADO**: falha de critério, regressão, achado bloqueador ou maior, ou o
  resultado perde da referência no aspecto comparado.
- **APROVADO**: os critérios passam, mas falta acabamento, coesão, profundidade
  ou clareza.
- **IMPRESSIONOU**: todos os gates passam, nenhum achado em escopo permanece, a
  média é pelo menos 3,75 de 4, todos os critérios críticos recebem 4, o
  resultado empata ou vence as referências, e você consegue nomear **duas
  qualidades surpreendentes específicas com evidência**.

Se você não conseguir nomear duas qualidades surpreendentes de forma concreta, o
veredito máximo permitido é `APROVADO`.

**Seja duro.** Um resultado apenas correto não é `IMPRESSIONOU`. Procure o que
está errado antes de procurar o que está bom. Não elogie de forma genérica.
