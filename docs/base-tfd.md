# Base TFD: mapa estrutural das telas do protótipo

Levantamento das telas do protótipo TFD para servir de base ao design system Citiesoft.

- **Repositório de origem:** `/Users/rafaeleugenio/Documents/Cursor/Repositorios/tfd-prototype`
- **Branch:** `fluxo-v2-mvp`
- **Raiz das telas:** `src/app/fluxo-v2/`
- **Data do levantamento:** 19/08/2026
- **Catálogo comparado:** `citiesoft-storybook`, pastas `src/components/{atoms,molecules,organisms,primitives}` e `.storybook/templates`

Todos os caminhos citados abaixo são relativos à raiz do `tfd-prototype`, salvo quando indicado.

---

## Correções de premissa

Quatro pontos precisam ficar registrados antes do mapa, porque contrariam o enunciado que originou este levantamento.

**1. O fluxo v2 lê do Supabase.** `src/app/fluxo-v2/_state/FluxoV2Provider.tsx:367-448` instancia `createClient()` e carrega em paralelo as tabelas `solicitacoes`, `regionais_saude_municipios` e `despesas_funerarias`. O array `seedFluxoV2` (`src/core/mocks/fluxo-v2-v3-seed.ts:992`) não é importado por nenhum arquivo fora do próprio mock, o que foi verificado por busca em toda a pasta `src`. O papel atual do arquivo de seed é fornecer tipos (`SolicitacaoMock`, `StatusGlobalV2`), rótulos (`STATUS_LABEL:1545`, `TIPO_CALCULO_AJUDA_LABEL:414`) e funções de cálculo (`calcularAjudaCustoTipo:744`). Outras partes da tela também consultam o Supabase diretamente: `AnexosTab.tsx:38-50` busca despachos, `LinhaDoTempoTab.tsx:14-23` busca autores via `logs.service`, e `solicitacoes/[id]/relatorio-tfd/page.tsx` monta o relatório inteiro a partir de consultas próprias.

**2. Não existe nenhum gráfico em todo o `fluxo-v2`.** Busca por `recharts`, `chart`, `Chart`, `canvas` e `svg` de dados na pasta não retorna nenhuma ocorrência de visualização de dados. Indicador no protótipo significa número em texto. A seção de gráficos deste documento registra a ausência.

**3. `financeiro/` deixou de ser tela.** `src/app/fluxo-v2/financeiro/page.tsx:9-11` é um `redirect('/fluxo-v2/passagens')`, e `financeiro/[id]/page.tsx` redireciona para `solicitacoes/[id]?tab=financeiro`. O comentário em `financeiro/page.tsx:3-8` explica que a fila única de Financeiro foi partida em Passagens e Ajuda de Custo pela PBI 13237. O que restou de Financeiro é uma aba do detalhe.

**4. Existe uma sétima rota fora do enunciado:** `aprovacoes/`, mapeada abaixo. `regulacao/[id]/page.tsx` também é apenas redirecionamento para o detalhe unificado.

**Inventário final de rotas reais:** 6 listagens, 1 detalhe com 5 abas, 1 relatório de impressão, 3 redirecionamentos.

---

## 1. Solicitações

**Arquivo:** `src/app/fluxo-v2/solicitacoes/page.tsx` (459 linhas)
**Rota:** `/fluxo-v2/solicitacoes`

### Arquétipo
Listagem mestra com barra de filtros e faixa de indicadores clicáveis. É a única listagem que não pré-filtra por status: percorre todas as solicitações (`L86`).

### Anatomia por zonas, na ordem real

| Ordem | Zona | Linhas |
|---|---|---|
| 1 | `PageHeader` com breadcrumb automático, título "Solicitações", subtítulo e slot `actions` à direita | `L149-163` |
| 2 | `StatsRow` com 8 células de indicador | `L165-219` |
| 3 | Barra de filtros, `div.flex.flex-wrap.gap-3.mb-4` | `L222-263` |
| 4 | Card branco contendo `<table>` e, no rodapé interno, `Pagination` | `L266-391` |
| 5 | Drawers e modais fora do fluxo do documento | `L393-445` |

### Controles, com o rótulo exato

| Controle | Rótulo real | Linhas |
|---|---|---|
| Busca livre | `Buscar por nome, CPF ou número...` | `L231-236`; filtra nome, CPF e número em `L90-97` |
| Filtro de status | `Todos os status` e os 7 rótulos de `STATUS_LABEL` | `L238-252` |
| Filtro em cascata | `RegiaoRegionalMunicipioFilter`, três selects encadeados | `L253-257` |
| Filtro de responsável | `Todos os responsáveis`, mais `Sem responsável` quando aplicável | `L258-262` |
| Ordenação | `SortTh` em 5 colunas | `L275-279` |
| Paginação e tamanho de página | `Page N of M`, seletor `25 rows`, contador `N solicitações` | `L383-390` |
| Drill-down | Clique na célula do `StatsRow` aplica e remove o filtro de status | `L171-209` |
| Ação primária | `Nova solicitação`, protegida por `Can action="solicitacoes.criar"` | `L153-161` |

Não há alternância de visão, exportação, seleção em massa nem ação em lote.

### Anatomia da tabela

| Coluna | Ordenável | Observação |
|---|---|---|
| Número | sim (`numero`) | **Coluna de identificação.** `SolicitacaoNumeroCell`, fonte mono; vira link externo para o SEI quando existe `seiUrl`, com ícone `ExternalLink` e tooltip de resumo |
| Paciente | sim (`paciente`) | `PacienteHoverCell` com tooltip de dados cadastrais |
| Município / Regional | sim (`municipio`) | Duas linhas: município em 12px e `código · regional` em 10,5px; sem regional exibe travessão cinza (`L319-328`) |
| Status | sim (`status`) | `StatusV2Badge` |
| Última atualização | sim (`atualizacao`) | Tempo relativo com `title` contendo a data completa (`L330-338`) |
| Responsável | não | `ResponsavelAvatar` |
| Ações | não, alinhada à direita | `RowActions` e `BotaoEnvio` |

- **Seleção:** inexistente. Nenhuma coluna de checkbox, nenhuma ação em lote.
- **Ações por linha:** `Editar solicitação` (ícone `Pencil`) e `Encerrar solicitação` (ícone `Archive`, tom `danger`), ambas desabilitáveis com o tooltip vindo de `tooltipLocked` (`L344-365`); mais `Enviar para outro setor` (`BotaoEnvio`) exibido apenas quando `setorAtual(s) === 'dados_basicos'` e o usuário tem `tramitacao.tramitar` (`L367-375`).
- **Linha inteira clicável** navega para o detalhe (`L311`). Toda célula que contém controle chama `stopPropagation`.
- **Densidade:** fixa. Padding `px-4 py-3.5` codificado em cada `<td>`, sem prop de densidade.
- **Linha sem dado:** travessão em `#9CA3AF` ou `#CBD5E1`, definido caso a caso dentro da célula.

### Cards e widgets de indicador

`StatsRow` (`src/shared/components/stats-row/StatsRow.tsx`). Anatomia da célula, `L148-190`:

1. Topo: rótulo em caixa alta, 12px, peso 600, `letter-spacing: 0.06em`.
2. Meio: número grande em fonte mono, 17px, peso 600, `font-variant-numeric: tabular-nums`.
3. Base: `hint` opcional em 12px cinza.

Estados: `onClick` transforma a célula em `<button>` com hover `#F8FAFC` e `focus-visible` com contorno azul; `active` pinta o rótulo de azul e acende uma borda superior de 2px em `#146BFA`. A borda de 2px fica sempre reservada em transparente para evitar deslocamento do layout ao alternar o filtro (`L144-147`). Divisor vertical de 1px entre células, que vira horizontal abaixo de 768px (`L89-100`).

Não existe variação percentual, tendência, meta nem gráfico embutido em nenhum indicador do protótipo.

Os 8 indicadores desta tela: Total, Em Dados Básicos, Em Regulação, Em Passagens, Em Ajuda de Custo, Em Acompanhamento, Encerradas no mês (hint `do mês corrente`), Taxa de aprovação (hint `deferidos / total`). Os seis do meio funcionam como filtro; os dois extremos são apenas leitura.

### Estados

| Estado | Existe | Evidência |
|---|---|---|
| Carregando | sim | 6 linhas de `Skeleton` com larguras variando por índice de coluna, `L285-295` |
| Vazio | sim, genérico | `Nenhuma solicitação encontrada.` em `colSpan=7`, `L296-302` |
| Vazio de primeiro uso versus vazio por filtro | **falta** | Mesma frase para os dois casos, sem ação de limpar filtros |
| Erro | **falta** | O provider registra `console.warn` e mantém a lista vazia (`FluxoV2Provider.tsx:396-399, 443-445`); a tela mostra o vazio genérico |
| Sem permissão | parcial e fora da tela | `src/layout/AppLayout.tsx:38-45` exibe skeleton e executa `router.replace('/dashboard')`; não há tela de acesso negado |

### Observação de inconsistência
O modal `Encerrar solicitação` desta tela (`L413-445`) é construído à mão com `div.fixed.inset-0`, sem usar o `Drawer` compartilhado nem o `ConfirmarExclusaoModal`. A mesma ação, nas telas de Aprovações e Acompanhamento, usa o componente `Drawer`. São três implementações da mesma decisão.

---

## 2. Regulação

**Arquivo:** `src/app/fluxo-v2/regulacao/page.tsx` (898 linhas)
**Rota:** `/fluxo-v2/regulacao`

### Arquétipo
Fila de trabalho. Base filtrada por `status === 'em_regulacao'` (`L110-113`). É a listagem mais densa do protótipo.

### Anatomia por zonas
`PageHeader` sem ação primária (`L191-194`) → `StatsRow` com 7 células (`L196-212`) → barra com 5 filtros (`L215-268`) → card com tabela de 9 colunas e paginação (`L270-426`) → 4 drawers controlados por estado único (`L429-465`).

### Controles

| Controle | Rótulo real | Linhas |
|---|---|---|
| Busca livre | `Buscar por nome, CPF ou número...` | `L224-229` |
| Filtro de carimbo | `Todos os carimbos`, `APROVADO DIRETO`, `CNRAC`, `CET`, `SAAS`, `AGENDAMENTO`, `Sem carimbo` | `L60-68`, `L231-243` |
| Filtro de status do parecer | `aria-label="Filtrar por status do parecer"`, rótulos em `STATUS_PARECER_FILTRO_LABEL` | `L244-257` |
| Cascata Região, Regional, Município | | `L258-262` |
| Filtro de responsável | | `L263-267` |
| Ordenação | 5 colunas | `L279-285` |
| Paginação | | `L418-425` |
| Drill-down | 5 células de carimbo alternam `carimboFiltro` | `L204-210` |

### Anatomia da tabela

| Coluna | Ordenável | Observação |
|---|---|---|
| Número | sim | Identificação. `SolicitacaoNumeroCell` com slot `trailing` para o badge `Chegou há Xh` e o `TramitacaoInfoPopover` (`L332-342`) |
| Paciente | sim | |
| Município | sim | |
| Resumo | não | Célula composta `ResumoRegulacao`, `L494-655` |
| CID | não | Célula composta `CidCell`, `L668-735` |
| Carimbo | sim | Célula composta `CarimboCell`, `L741-813` |
| Tempo | sim | Dias no setor, sufixo `d` |
| Responsável | não | |
| Ações | não, à direita | |

Três células compostas merecem detalhe, porque são o que há de mais específico no protótipo:

- **`ResumoRegulacao`** monta duas linhas de resumo. Cada linha tem ícone dentro de quadrado de 22px com fundo tintado, contagem em negrito, informação secundária em fonte mono precedida de ponto médio, e um chip inline com bolinha quando o estado exige atenção (`Sem agendamento`, `Sem parecer`). Cada linha tem `HoverTooltip` próprio: o de agendamento lista todos os agendamentos confirmados ordenados por data, com procedimento, data, hora, unidade, contato e observações de chegada (`L514-566`); o de parecer mostra decisão colorida, médico, CRM, data, histórico e um trecho da observação truncado em 220 caracteres (`L569-606`).
- **`CidCell`** mostra o CID principal em mono roxo e o secundário em cinza menor. As descrições vêm do snapshot embutido no parecer ou de um lookup em lote via `useCidLookup` (`L163-175`). Quando a descrição não resolve, o tooltip escreve `descrição não disponível` em itálico em vez de omitir.
- **`CarimboCell`** exibe a sigla abreviada (`APR`, `AGND`, `SAAS`, `CNRAC`, `CET`) num chip cinza, com tooltip trazendo o nome por extenso, a unidade e a forma de contato quando o carimbo é `AGENDAMENTO`, e a observação da enfermeira truncada em 240 caracteres.

- **Seleção:** inexistente.
- **Ações por linha:** `Parecer rápido`, `Definir carimbo` ou `Editar carimbo` conforme o estado, `Agendamento rápido` com visibilidade condicional (`visivel: podeAgendar`, apenas CNRAC ou CET sem tentativa confirmada, `L310-311`), e `Enviar para outro setor`.
- **Destaque de linha:** devolução recente pinta uma barra lateral com `boxShadow: inset 3px 0 0 0 #94A3B8` (`L325`), preservando o hover e o zebrado.
- **Densidade:** fixa.

### Indicadores
Aguardando parecer, Aguardando agendamento (com `title` explicando a regra), Aprovado direto, CNRAC, CET, SAAS, Agendamento. Os cinco últimos são filtros. Mesma anatomia de célula descrita na tela 1.

### Estados
Carregando com skeleton de 9 colunas (`L291-301`). Vazio com `Nenhuma solicitação na fila de regulação.` (`L302-308`). Faltam: estado de erro, distinção entre vazio de primeiro uso e vazio por filtro, e tela de sem permissão.

---

## 3. Aprovações

**Arquivo:** `src/app/fluxo-v2/aprovacoes/page.tsx` (459 linhas)
**Rota:** `/fluxo-v2/aprovacoes`

### Arquétipo
Fila de trabalho com base `status === 'em_aprovacao'` (`L86-89`). O comentário `L58-66` registra a particularidade: Aprovação não tem posição fixa na cadeia e pode receber de qualquer um dos cinco setores operacionais, o que obriga a solicitação a guardar o setor de origem e a observação do pedido.

### Anatomia por zonas
`PageHeader` (`L184-187`) → `StatsRow` com 3 células (`L189-210`) → barra de filtros com 4 controles mais um botão condicional (`L212-267`) → card com tabela de 8 colunas e paginação (`L269-387`) → `EnviarParaSetorDrawer` e `Drawer` de encerramento (`L389-445`).

### Controles

| Controle | Rótulo real | Linhas |
|---|---|---|
| Busca livre | `Buscar por nome, CPF ou número...` | `L221-226` |
| Filtro de setor de origem | `Todos os setores` mais os 5 rótulos de `SETOR_LABEL`, `aria-label="Filtrar por setor de origem"` | `L229-243` |
| Cascata de região | | `L245-249` |
| Filtro de responsável | | `L251-255` |
| Limpar filtro | `Limpar setor`, botão de texto que só aparece com o filtro ativo | `L257-266` |
| Ordenação | 5 colunas | `L273-276` |
| Paginação | | `L379-386` |

`Limpar setor` é a única ação explícita de limpar filtro em toda a listagem do protótipo.

### Anatomia da tabela

| Coluna | Ordenável | Observação |
|---|---|---|
| Número | sim | Identificação, `SolicitacaoNumeroCell` |
| Paciente | sim | |
| Município / Regional | sim | |
| Setor de origem | sim | `StatusDot` com `dotColor` livre vindo de `SETOR_ORIGEM_DOT_COLOR`, porque os 6 tons fixos não cobrem os 5 setores (`L326-332`) |
| Observação para aprovação | não | Parágrafo com `maxWidth: 320`, `whiteSpace: pre-wrap` e `overflowWrap: break-word`; sem dado escreve `Sem observação` (`L334-342`) |
| Status | não | `StatusV2Badge` |
| Responsável | não | |
| Ações | não, à direita | |

- **Seleção:** inexistente.
- **Ações por linha:** `Ver solicitação` (ícone `Eye`), `Tramitar` e `Encerrar solicitação` (ícone `LogOut`), as duas últimas protegidas por `Can action="tramitacao.tramitar"` (`L351-372`).
- **Densidade:** fixa.

### Indicadores
Em aprovação (hint `solicitações`), Tramitadas no mês (hint `passaram por Aprovação`), Encerradas no mês (hint `finalizadas`). O comentário `L92-99` registra a limitação do próprio indicador: o modelo guarda apenas `ultimaTramitacao`, então um envio posterior para outro setor sobrescreve o dado e a contagem fica aproximada.

### Estados
Carregando com skeleton de 8 colunas (`L284-294`). Vazio com `Nenhuma solicitação em aprovação.` (`L295-301`). Erro de carga: falta. Validação do formulário de encerramento é feita por toast (`toast.error('Campo obrigatório', ...)`, `L170-171`), sem erro inline no campo.

---

## 4. Passagens

**Arquivo:** `src/app/fluxo-v2/passagens/page.tsx` (470 linhas)
**Rota:** `/fluxo-v2/passagens`. Recebe também o redirecionamento de `/fluxo-v2/financeiro`.

### Arquétipo
Fila de trabalho com base `status === 'em_passagens'` (`L106-109`).

### Anatomia por zonas
`PageHeader` (`L195-198`) → `StatsRow` com 3 células (`L200-221`) → barra com 4 filtros (`L223-262`) → card com tabela de 9 colunas e paginação (`L264-430`) → drawers de tramitação, passagem e adicional (`L432-456`).

### Controles

| Controle | Rótulo real | Linhas |
|---|---|---|
| Busca livre | `Buscar por nome, CPF ou número...` | `L232-237` |
| Filtro de situação | `Todas`, `Sem viagem agendada`, `Com adicional pendente` | `L37-41`, `L239-251` |
| Cascata de região | | `L252-256` |
| Filtro de responsável | | `L257-261` |
| Ordenação | 6 colunas, incluindo uma alinhada à direita | `L268-274` |
| Paginação | | `L422-429` |

### Anatomia da tabela

| Coluna | Ordenável | Observação |
|---|---|---|
| Número | sim | Identificação, com badge `Chegou há Xh` em variante azul quando a tramitação é recente (`L326-336`) |
| Paciente | sim | |
| Origem | sim (`municipio`) | Mesmo bloco de duas linhas das demais telas |
| Tipo de viagem | não | Derivado das viagens ativas: `Ida e volta`, `Ida`, `Volta`, `Transfer` (`L65-74`); sem viagem escreve `Sem viagem` |
| Próxima viagem | sim (`proxima`) | Data em cima, trecho `Origem → Destino` embaixo; sem viagem escreve `Sem viagem` |
| Total passagens | sim (`total`), alinhada à direita | Ícone `Plane` em quadrado azul de 22px mais valor em mono 14px peso 600 (`L368-381`) |
| Aguardando há | sim (`tempo`) | Dias, sufixo `d` |
| Responsável | não | |
| Ações | não, à direita | |

- **Seleção:** inexistente.
- **Ações por linha:** `Adicionar passagem` (ícone `Plane`), `Adicionar adicional` (ícone `PlusCircle`), ambas desabilitadas com tooltip de lock quando aplicável, e `Enviar para outro setor` (`L390-414`).
- **Densidade:** fixa.

### Indicadores
Aguardando emissão (hint `sem passagem`), Emitidas no mês (hint `passagens`), Valor emitido no mês (hint `líquido de reembolso`). O terceiro é o único indicador monetário de listagem, formatado por `formatBRL`.

### Estados
Carregando com skeleton (`L280-290`). Vazio com `Nenhuma solicitação aguardando ação em Passagens.` (`L291-297`). Erro: falta.

---

## 5. Ajuda de Custo

**Arquivo:** `src/app/fluxo-v2/ajuda-custo/page.tsx` (473 linhas)
**Rota:** `/fluxo-v2/ajuda-custo`

### Arquétipo
Fila de trabalho com base `status === 'em_ajuda_custo'` (`L127-130`). Gêmea estrutural de Passagens, conforme o comentário `L105-110`.

### Anatomia por zonas
Idêntica à de Passagens: `PageHeader` (`L211-214`) → `StatsRow` com 3 células (`L216-237`) → 4 filtros (`L239-278`) → card com tabela de 9 colunas e paginação (`L280-441`) → drawers (`L443-459`).

### Controles

| Controle | Rótulo real | Linhas |
|---|---|---|
| Busca livre | `Buscar por nome, CPF ou número...` | `L248-253` |
| Filtro de situação | `Todas`, `Sem ajuda de custo`, `Com adicional pendente` | `L42-46`, `L255-267` |
| Cascata de região | | `L268-272` |
| Filtro de responsável | | `L273-277` |
| Ordenação | 5 colunas | `L284-290` |
| Paginação | | `L433-440` |

### Anatomia da tabela

| Coluna | Ordenável | Observação |
|---|---|---|
| Número | sim | Identificação, com badge de tramitação recente |
| Paciente | sim | |
| Origem | sim | |
| Período lançado | não | `dd/mm/aaaa → dd/mm/aaaa` mais `StatusDot` com o tipo de cálculo, e uma segunda linha `N períodos ao todo` quando há mais de um; sem lançamento escreve `Sem ajuda` (`L366-384`) |
| Próximo período | não | Data mais explicação da base do cálculo: `a partir do último período` ou `a partir do início da viagem`; sem base escreve `Sem base para calcular` (`L385-396`) |
| Total previsto | sim (`total`), à direita | Valor mono 14px peso 600 |
| Aguardando há | sim | |
| Responsável | não | |
| Ações | não, à direita | |

A coluna `Próximo período` é o melhor exemplo de estado vazio explicado do protótipo inteiro: em vez de travessão, ela informa por que o sistema não consegue calcular.

- **Seleção:** inexistente.
- **Ação por linha:** `Adicionar ajuda de custo` (ícone `Wallet`) e `Enviar para outro setor` (`L408-425`).
- **Densidade:** fixa.

### Indicadores
Aguardando lançamento (hint `sem ajuda`), Ajudas emitidas (hint `aguardando conclusão`), Total em diárias mês (hint `ajudas concluídas`).

### Estados
Carregando com skeleton (`L296-306`). Vazio com `Nenhuma solicitação aguardando ação em Ajuda de Custo.` (`L307-313`). Erro: falta.

---

## 6. Acompanhamento

**Arquivo:** `src/app/fluxo-v2/acompanhamento/page.tsx` (549 linhas)
**Rota:** `/fluxo-v2/acompanhamento`

### Arquétipo
Fila de trabalho com base `status === 'em_acompanhamento'` (`L148-151`), acrescida de um semáforo de prazo. É a única tela do protótipo com urgência codificada em cor.

### Anatomia por zonas
`PageHeader` (`L244-247`) → `StatsRow` com 4 células (`L249-276`) → barra com apenas 3 filtros (`L278-304`) → card com tabela de 9 colunas e paginação (`L306-477`) → `EnviarParaSetorDrawer` e `Drawer` de encerramento (`L479-535`).

### Controles

| Controle | Rótulo real | Linhas |
|---|---|---|
| Busca livre | `Buscar por nome, CPF ou número...` | `L287-292` |
| Cascata de região | | `L294-298` |
| Filtro de responsável | | `L299-303` |
| Ordenação | 5 colunas | `L310-316` |
| Paginação | | `L469-476` |

É a fila com menos filtros: não possui select de domínio próprio.

### Anatomia da tabela

| Coluna | Ordenável | Observação |
|---|---|---|
| Número | sim | Identificação |
| Paciente | sim | |
| Origem | sim | |
| Passagem | não | Bloco de duas linhas, Ida e Volta. Cada linha tem ícone `Plane` (o da volta espelhado por `scaleX(-1)`), `StatusDot` do status da viagem e data em mono. Sem viagem alguma escreve `Sem passagem`; sem volta escreve `Não garantido` (`L370-401`) |
| Ajuda de custo | não | Ícone `Wallet`, `StatusDot` do status, período e valor em mono; sem lançamento escreve `Sem ajuda de custo` (`L402-417`) |
| Data limite | sim (`limite`) | Data em mono com a cor do semáforo, mais linha explicando a base e a urgência; sem base escreve `Sem data definida` (`L418-431`) |
| Tempo na etapa | sim | Dias |
| Responsável | não | |
| Ações | não, à direita | |

**Semáforo de prazo** (`urgenciaLimite`, `L115-121`): atraso pinta `#DC2626` com texto `Atrasado Nd`; hoje pinta `#DC2626` com `Hoje`; até 2 dias pinta `#DC2626`; até 7 dias pinta `#D97706`; acima disso pinta `#64748B`. A base do prazo é declarada no rótulo abaixo da data: `Retorno previsto` quando existe viagem de volta, `Data do agendamento` quando existe apenas agendamento confirmado (`L91-105`).

- **Seleção:** inexistente.
- **Ações por linha:** `Ver solicitação`, `Enviar para outro setor` e `Encerrar solicitação` (`L440-461`).
- **Densidade:** fixa.

### Indicadores
Em acompanhamento (hint `solicitações`), Viagens em curso (hint `confirmadas`), Tempo médio na etapa (valor `Nd`, hint `dias`), Encerradas no mês (hint `finalizadas`). O terceiro é o único indicador de média do protótipo, e o comentário `L136-140` do detalhe reconhece que a métrica é um proxy: não existe carimbo de tempo de entrada no setor atual no modelo, então o cálculo usa a data de criação da solicitação.

### Estados
Carregando com skeleton (`L322-332`). Vazio com `Nenhuma solicitação em acompanhamento.` (`L333-339`). Erro: falta. Validação do encerramento por toast (`L230-231`).

---

## 7. Detalhe da solicitação

**Arquivo:** `src/app/fluxo-v2/solicitacoes/[id]/page.tsx` (795 linhas)
**Rota:** `/fluxo-v2/solicitacoes/[id]`, com `?tab=` e `?from=`

### Arquétipo
Página de detalhe com cabeçalho em ficha e conteúdo em abas.

### Anatomia por zonas

| Ordem | Zona | Linhas |
|---|---|---|
| 1 | Link de retorno `Voltar para {origem}`, com a origem resolvida do parâmetro `?from=` por `resolverOrigem` | `L64-65`, `L144-146` |
| 2 | Card de cabeçalho, linha proeminente: nome do paciente como link azul de 20px, idade e CPF em mono; à direita, `Enviar para setor` (secundário) e `Encerrar solicitação` (danger) | `L159-198` |
| 3 | Bloco de 3 grupos de detalhe lado a lado a partir de 1024px, com divisor vertical | `L206-343` |
| 4 | Painel de encerramento em vermelho, exibido em todas as abas quando a solicitação está encerrada | `L347-469` |
| 5 | Abas com sublinhado azul | `L472-496` |
| 6 | Conteúdo da aba com animação `fadeIn` de 180ms | `L499-513` |
| 7 | Modais de encerrar e reabrir, drawers de tramitação e despesa funerária | `L516-679` |

Os três grupos do bloco de detalhe:

- **Situação da solicitação:** Status (`StatusV2Badge`), Número (mono), Criada em (mais `Nd aguardando`), Processo SEI. O campo SEI tem três variantes explícitas: link externo com ícone quando há `seiUrl`, texto mono com ícone `FileText` quando há número sem URL, e chip `Sem vínculo SEI` com ícone `FileX` quando não há vínculo (`L223-258`).
- **Dados clínicos e operacionais:** Contato (link `tel:` e link `mailto:` truncado), Regional e município, Data e origem do laudo (condicional), Anexos (contador clicável que troca de aba, `AnexosCounter`, `L754-785`).
- **Acompanhantes:** lista de cards com nome, badge `Doador` quando aplicável, vínculo e idade; vazio escreve `Sem acompanhante. O paciente segue sozinho nesta solicitação.` (`L306-342`).

O painel de encerramento traz motivo, data e observação em grade de 3 colunas, o botão `Reabrir solicitação` protegido por `Can action="solicitacoes.reabrir"`, e, quando o motivo é óbito, um sub-bloco de despesas de funerária com lista, remoção por linha e subtotal (`L391-467`).

### Abas
`Linha do tempo` (padrão), `Regulação`, `Financeiro`, `Anexos`, `Observações` (`L31-37`). O estado da aba vive na URL: `timeline` remove o parâmetro, as demais escrevem `?tab=` (`L89-95`). Há redirecionamento da aba legada `?tab=dados` (`L41`, `L68-75`).

### Anatomia de tabela
A página em si não tem tabela. As tabelas vivem nas abas Financeiro e Anexos, descritas abaixo.

### Cards e indicadores
A página não usa `StatsRow`. As abas Regulação e Financeiro reimplementam a mesma faixa de indicadores localmente, com componentes internos chamados `Stat` e `FinStat`.

### Estados

| Estado | Existe | Evidência |
|---|---|---|
| Carregando | sim | `DetailPageSkeleton tabs={5}` em `L98-100` |
| Não encontrado | sim | Texto `Solicitação não encontrada.` mais botão `Voltar`, `L101-108` |
| Erro de carga | **falta** | Falha do Supabase resulta em `getById` sem retorno, o que renderiza o mesmo "não encontrada" |
| Sem permissão | fora da tela | Gate de rota no `AppLayout` |

### Observação de inconsistência
Os modais `Encerrar solicitação` (`L516-548`) e `Reabrir solicitação` (`L569-679`) são construídos à mão. O de reabertura usa um padrão próprio: grade de radio cards de 1, 2 ou 3 colunas, cada card com título, descrição e uma bolinha de rádio desenhada com `border` variável (`L603-647`). O mesmo padrão aparece no `EnviarParaSetorDrawer`.

---

### 7.1 Aba Linha do tempo

**Arquivo:** `src/app/fluxo-v2/_components/LinhaDoTempoTab.tsx` (103 linhas)

Card com cabeçalho contendo título `Linha do tempo`, subtítulo `do mais antigo ao mais recente` e contador `N eventos` (`L55-73`), seguido de uma `<ol>` de `EventoLinhaTempo`. Os eventos são derivados por `derivarEventos` e os autores resolvidos de forma assíncrona a partir de `log_auditoria` (`L14-23`), com fallback imediato enquanto a busca não retorna.

Estado vazio: card tracejado com `Sem eventos registrados ainda.` (`L30-43`). Estado de carregamento próprio: não existe; a lista renderiza com os autores de fallback.

---

### 7.2 Aba Regulação

**Arquivo:** `src/app/fluxo-v2/_components/RegulacaoTab.tsx` (755 linhas)

Zonas na ordem: banner âmbar de devolução pendente do Financeiro com `role="alert"`, repetido por devolução (`L119-144`); banner tracejado cinza `Modo somente leitura` quando a solicitação está travada em outro setor (`L147-163`); faixa de 3 indicadores locais, Total de pareceres, Deferidos e Indeferidos, cada um com `dotTone` (`L166-180`); seção `Parecer médico` (`L183-315`); seção `Carimbo de regulação` (`L323-418`); seção `Agendamento e Tentativas` (`L426-609`).

A seção de parecer inclui um banner interno de segundo deferimento com `role="status"`, que explica a exigência da controladoria da SES e instrui a ação seguinte (`L199-221`), e um botão `Exportar` por parecer que abre a versão de impressão (`L239`). Estado vazio de cada seção é um parágrafo cinza de 12px: `Nenhum parecer registrado ainda.`, `Nenhum carimbo de regulação definido ainda.`, `Sem tentativas registradas`.

---

### 7.3 Aba Financeiro

**Arquivo:** `src/app/fluxo-v2/_components/FinanceiroTab.tsx` (799 linhas)

Zonas na ordem: banner de somente leitura em Acompanhamento, que explica exatamente o que continua editável (`L184-200`); faixa de 4 indicadores locais `FinStat`, Viagens, Ajuda de custo, Funerária (condicional a valor maior que zero) e Total geral com `emphasis` (`L202-243`); seção `Viagens` (`L246-397`); seção `Ajuda de custo` (`L400-558`); drawers e modais (`L560` em diante).

**Tabela de viagens** (`L277-339`), 9 colunas: `#` (largura 56, com `OrdinalBadge`), `Trecho` (com `BeneficiarioBadge` inline), `Data`, `Modal`, `Companhia` (travessão quando ausente), `Tipo`, `Status` (`ViagemStatusBadge`), `Valor` (à direita, mono) e `Ações` (largura 64). Sem coluna de seleção. Ações por linha via `ItemRowActions`. Valor de item cancelado recebe `line-through` e cor cinza, com uma segunda linha `−R$ X reemb.` em âmbar quando há reembolso (`L317-323`). Estado vazio: `Nenhuma passagem registrada ainda.`

Abaixo da tabela, sub-bloco `Adicionais` em lista, separado por borda tracejada, exibido apenas quando existem adicionais (`L346-396`).

A seção de ajuda de custo usa lista em vez de tabela (`L437-535`), com rolagem interna limitada a `max-h-[380px]`. Cada item traz período, beneficiário, dias, chip `+ Pernoite`, valor com reembolso, status, tipo de cálculo, sufixo do id, ações, memória de cálculo em mono de 10,5px e link para o processo SEI daquele período ou o texto `Sem processo SEI`. Acima da lista há um chip de saldo do paciente que troca de cor conforme o sinal, verde para positivo, vermelho para negativo, neutro para zero (`L423-435`). Abaixo, `DadosBancariosBlock` e, apenas quando o setor atual é Ajuda de Custo, `FechamentoSolicitacaoCard`.

---

### 7.4 Aba Anexos

**Arquivo:** `src/app/fluxo-v2/_components/AnexosTab.tsx` (273 linhas)

Zonas: barra de ferramentas própria (`L83-136`) e lista em grade (`L139-170`).

A barra tem dois controles que não aparecem em nenhuma outra tela:

- **Chips de filtro por origem com contagem embutida** (`L91-119`): `Todos`, mais os rótulos de `ORIGEM_ANEXO_LABEL` filtrados para exibir apenas os que têm contagem maior que zero (`L75-78`). O chip ativo fica azul sólido com o número em branco translúcido.
- **Alternador de ordenação com rótulo textual** (`L121-135`): `Mais recente primeiro` e `Mais antigo primeiro`, com `title` explicando a direção.

A lista usa `display: grid` com `gridTemplateColumns: 'minmax(0,2fr) minmax(0,1.4fr) 130px 130px 40px'` e cabeçalho falso em `<div>`: `Documento`, `Tipo`, `Origem`, `Data` e uma coluna sem rótulo. Não é `<table>`, o que significa que não há semântica de tabela nem ordenação por coluna.

Estado vazio: componente `EmptyState` local com ícone (`L255-272`), disparado quando não há nenhum anexo antes de qualquer filtro (`L71-73`). Falta o vazio por filtro: como as origens sem contagem são omitidas dos chips, o caso não chega a ocorrer, o que é uma solução válida e vale registrar.

A aba é somente leitura. O upload continua nos drawers de origem, conforme o comentário `L21-23`.

---

### 7.5 Aba Observações

**Arquivo:** `src/app/fluxo-v2/_components/ObservacoesTab.tsx` (265 linhas)

Feed de mensagens em formato de conversa, com avatares sempre em cinza neutro (`L11`), campo de composição com `placeholder="Registre conversas paralelas, decisões em chamada, alinhamentos ..."` (`L143`) e `EmptyState` local com o texto `Nenhuma observação registrada ainda` (`L232-248`).

---

## 8. Relatório TFD

**Arquivo:** `src/app/fluxo-v2/solicitacoes/[id]/relatorio-tfd/page.tsx`
**Rota:** `/fluxo-v2/solicitacoes/[id]/relatorio-tfd`

Documento para impressão. Usa uma família de componentes própria, importada de `src/app/relatorios/_shared/`: `ReportHero`, `TableCard`, `PrintButton`, `ReportPrintStyles` e `ReportTable` com o tipo `ReportColumn` (`L10-13`). Busca os dados direto do Supabase em consultas próprias, sem passar pelo `FluxoV2Provider`. Formatação por `fmtBRL`, `fmtDataBR` e `valorPorExtenso`.

Esta tela não compartilha nenhum componente com o restante do `fluxo-v2`. Registrar isso importa: existem duas famílias paralelas de UI no mesmo protótipo, a de tela operacional e a de documento impresso.

---

## 9. Gráficos

**Não existe nenhum gráfico no `fluxo-v2`.** Verificado por busca em toda a pasta: nenhuma importação de biblioteca de visualização, nenhum `<canvas>`, nenhum SVG que represente dado. Todo indicador é número em texto dentro do `StatsRow`, do `FinStat` ou do `Stat` local.

Consequências para o design system, registradas como lacuna e não preenchidas por suposição:

- Não há tipo de gráfico a padronizar a partir do TFD.
- Não há legenda, tooltip de gráfico, estado vazio de gráfico nem tabela alternativa a padronizar a partir do TFD.
- Não existe nenhum painel de indicadores autônomo dentro do `fluxo-v2`. A rota `/dashboard` fica fora desta pasta e não foi mapeada aqui.

Se o design system precisar de diretriz de gráfico, ela terá de nascer de outra fonte. O catálogo já traz `organisms/Chart` e `atoms/Sparkline`, ainda sem nenhum consumidor no TFD.

---

## 10. Componentes locais de `_components/`

28 arquivos em `src/app/fluxo-v2/_components/`, mais 15 drawers na subpasta `drawers/`.

### Células e marcadores de tabela

| Componente | O que resolve |
|---|---|
| `SolicitacaoNumeroCell.tsx` (84 L) | Número em mono com tooltip de resumo (número, SEI, status, criação, laudo) e link externo para o SEI quando existe `seiUrl`; expõe slot `trailing` para badges |
| `PacienteHoverCell.tsx` (101 L) | Nome do paciente com tooltip dos dados cadastrais |
| `StatusDot.tsx` (80 L) | Primitivo de badge de todo o fluxo: pílula cinza neutra com ponto colorido de 7px. Seis tons semânticos mais `dotColor` livre. É o único portador de cor semântica do sistema |
| `StatusV2Badge.tsx` (18 L) | Mapeia os 7 status globais para o tom do `StatusDot` |
| `TramitacaoBadge.tsx` (211 L) | Badge `Chegou há Xh` com três variantes de cor por destino, mais o `TramitacaoInfoPopover`. Re-renderiza a cada 60 segundos para expirar sozinho após 24h |
| `OrdinalBadge.tsx` (31 L) | Marcador `#N` em mono para itens numerados dentro das abas |
| `ResponsavelAvatar.tsx` (95 L) | Avatares sobrepostos, até 3 visíveis mais círculo `+N`, tooltip com todos os nomes. Estado sem responsável usa círculo tracejado neutro, decisão explicada no comentário `L26` para não parecer erro |
| `badges/LaudoValidadeBadge.tsx` (44 L) | Validade do laudo em quatro estados: sem laudo, vencido, vencendo em até 90 dias, válido com a data limite |

### Ações

| Componente | O que resolve |
|---|---|
| `RowActions.tsx` (72 L) | Grupo de botões de ícone de 28px na coluna Ações, com `title`, tons `default`, `danger` e `amber`, `disabled` e `visivel` |
| `ItemRowActions.tsx` (137 L) | Ações de item dentro das abas: Editar, Recalcular, Reembolsar e Excluir, com rótulos configuráveis e `disabledEditar` independente |
| `BotaoEnvio.tsx` (89 L) | Botão de tramitação de 32px, variante neutra azul acinzentada por padrão e variante colorida por destino |

### Filtros

| Componente | O que resolve |
|---|---|
| `RegiaoRegionalMunicipioFilter.tsx` (141 L) | Cascata de três selects, Região, Regional e Município, com as opções derivadas da base não filtrada para que não desapareçam quando outro filtro reduz a lista (comentário `L16-19`) |
| `ResponsavelFilter.tsx` (75 L) | Select de responsável com opção `Sem responsável` condicional e botão `X` de limpar |
| `ResponsavelMultiSelect.tsx` (162 L) | Seleção múltipla de responsáveis com chips removíveis acima de um dropdown com checkbox por pessoa |

### Sobreposições

| Componente | O que resolve |
|---|---|
| `HoverTooltip.tsx` (142 L) | Tooltip rico renderizado por `createPortal` no `document.body`, requisito para escapar do `overflow: hidden` das tabelas. Atraso de 200ms, largura máxima configurável, inversão automática entre topo e base conforme o espaço disponível. Exporta também `TooltipKV`, que renderiza pares chave e valor com opção `mono` |
| `ConfirmarExclusaoModal.tsx` (147 L) | Modal centrado de confirmação de exclusão, reutilizado por pareceres, tentativas, passagens, ajudas e adicionais. O comentário justifica o modal em vez do drawer: confirmação é decisão rápida |
| `ReembolsoModal.tsx` (180 L) | Registro de reembolso parcial de item |
| `RecalcularVoltaAjudaModal.tsx` (187 L) | Recalcula um período de ajuda pela data real de volta e trata os três desfechos de saldo, documentados no cabeçalho do arquivo |

### Blocos de conteúdo

| Componente | O que resolve |
|---|---|
| `SnapshotPaciente.tsx` (217 L) | Mini card de contexto do paciente no topo de todo drawer de ação rápida, para o operador confirmar que está no paciente certo sem abrir o detalhe. Exporta o helper `snapshotFromSolicitacao` |
| `EventoLinhaTempo.tsx` (218 L) | Item da linha do tempo, com 5 categorias neutras que substituíram 13 cores anteriores |
| `LinhaDoTempoTab.tsx` (103 L) | Aba de linha do tempo |
| `ObservacoesTab.tsx` (265 L) | Aba de observações em formato de conversa |
| `AnexosTab.tsx` (273 L) | Aba de anexos com chips de filtro por origem e alternador de ordenação |
| `RegulacaoTab.tsx` (755 L) | Aba de regulação com banners, indicadores e três seções |
| `FinanceiroTab.tsx` (799 L) | Aba financeira com indicadores, tabela de viagens e lista de ajudas |
| `DadosBancariosBlock.tsx` (338 L) | Bloco de dados bancários da solicitação dentro da aba financeira |
| `FechamentoSolicitacaoCard.tsx` (296 L) | Sub-bloco com os dois documentos de fechamento, despacho financeiro e recibo de ajuda de custo |
| `AgendamentoProcedimentosField.tsx` (197 L) | Campo composto de unidade mais lista repetível de procedimentos, extraído para ser usado tanto na abertura quanto na regulação |
| `ParecerLinkList.tsx` (139 L) | Lista compacta de pareceres como hyperlinks para a versão de impressão, usada dentro dos drawers |

### Drawers, `_components/drawers/`

15 arquivos. Os maiores: `NewEditarSolicitacaoDrawer` (946 L), `NewPassagemDrawer` (856 L), `NewAjudaCustoDrawer` (744 L), `NewParecerDrawer` (715 L), `NewTentativaDrawer` (387 L), `EnviarParaSetorDrawer` (354 L), `NewAdicionalDrawer` (325 L), `RegistrarAgendamentoDrawer` (283 L), `CarimboRegulacaoDrawer` (262 L), `NewDespesaFunerariaDrawer` (170 L), `NewAgendamentoDrawer` (125 L), `DevolverParaRegulacaoDrawer` (103 L), `PedirAjusteParecerDrawer` (89 L), `EncaminharParaFinanceiroDrawer` (86 L). Todos são formulários longos com rolagem; **nenhum é assistente em etapas**.

### Componente órfão

`MiniDashboardCard.tsx` (103 L) não é importado por nenhum arquivo. Foi substituído pelo `StatsRow`, e o próprio cabeçalho do arquivo documenta a migração do padrão colorido para o neutro. Candidato a remoção no protótipo, e sinal de que a decisão de indicador já foi tomada uma vez e revista.

---

# Síntese

## Arquétipos que se repetem

| Arquétipo | Telas | Quais |
|---|---|---|
| Fila de trabalho filtrada por status | **5** | Regulação, Aprovações, Passagens, Ajuda de Custo, Acompanhamento |
| Listagem mestra | **1** | Solicitações |
| Detalhe com abas | **1** | `solicitacoes/[id]` |
| Aba de conteúdo em seções | **5** | Linha do tempo, Regulação, Financeiro, Anexos, Observações |
| Formulário longo em drawer lateral | **15** | Toda a pasta `_components/drawers/` |
| Modal centrado de confirmação | **6 ocorrências, 3 implementações diferentes** | `ConfirmarExclusaoModal` nas abas; `Drawer` compartilhado em Aprovações e Acompanhamento; modal artesanal em Solicitações e no detalhe |
| Documento de impressão | **1** | Relatório TFD, com família de componentes própria |
| Painel de indicadores autônomo | **0** | Não existe no `fluxo-v2` |
| Formulário em etapas | **0** | Nenhum drawer é assistente |

O achado estrutural: as 6 listagens são a mesma tela seis vezes, variando colunas, select de domínio e ações de linha. Existe um template de fila implícito no protótipo que nunca foi formalizado. O catálogo já tem `.storybook/templates/Listagem/Listagem.tsx`, que é o candidato natural a absorver esse padrão.

## Controles presentes em mais de uma tela

| Controle | Em quantas telas | Situação no protótipo |
|---|---|---|
| Campo de busca com ícone `Search` | 6 de 6 | **Copiado e colado 6 vezes**, com o mesmo estilo em linha (`height: 36`, `minWidth: 280`, `borderRadius: 8`) e o mesmo placeholder |
| Select de filtro de domínio | 5 de 6 | **Estilo em linha duplicado 5 vezes**, sem componente |
| Célula Município e Regional em duas linhas | 6 de 6 | Duplicada literalmente nas seis páginas |
| Helper `Th` de cabeçalho não ordenável | 6 de 6 | **Redeclarado no rodapé de cada `page.tsx`**, corpo idêntico nas seis |
| `fmtBRL` e `fmtDataBR` | 4 ou mais | Redeclarados localmente por arquivo, em vez de importados de `shared/utils` |
| Faixa de indicadores | 6 de 6 mais 2 abas | `StatsRow` compartilhado nas listagens, reimplementado como `Stat` e `FinStat` dentro das abas |
| `PageHeader` | 6 de 6 | Já compartilhado |
| `Pagination` | 6 de 6 | Já compartilhado |
| `SortTh` | 6 de 6 | Já compartilhado |
| Coluna de ações com `RowActions`, `BotaoEnvio` e `Can` | 6 de 6 | Já componentizado |
| `HoverTooltip` e `TooltipKV` | 6 de 6, através das células | Já componentizado |
| `StatusDot` | onipresente | Já componentizado, é o átomo mais reaproveitado do protótipo |

## Controles que existem no TFD e faltam no nosso design system

Esta é a seção operacional do documento. Para cada item: onde aparece, o que resolve, e o componente do catálogo `citiesoft-storybook` que mais se aproxima hoje.

### 1. Célula de resumo com ícone tintado, contagem e chip inline
**Onde:** Regulação, coluna `Resumo` (`regulacao/page.tsx:822-898`); mesma forma na coluna `Total passagens` de Passagens (`passagens/page.tsx:368-381`) e nos itens da aba Financeiro.
**Resolve:** condensar um agregado inteiro (quantos agendamentos, qual o último, qual o estado que exige atenção) dentro de uma célula de tabela, sem obrigar o operador a abrir o detalhe.
**Mais perto no catálogo:** `molecules/Card`. Chega perto no invólucro e não cobre nada da composição interna (quadrado de ícone de 22px, contagem em negrito, informação secundária em mono, chip de estado inline). **Lacuna real.**

### 2. Tooltip rico com pares chave e valor, renderizado em portal
**Onde:** as 6 listagens, através de `SolicitacaoNumeroCell`, `PacienteHoverCell`, `CidCell`, `CarimboCell` e `ResumoRegulacao`.
**Resolve:** entregar um mini painel de dados no hover, com seções, divisores, valores em mono e trechos de texto truncados, escapando do `overflow: hidden` da tabela através de `createPortal`.
**Mais perto no catálogo:** `molecules/Tooltip`. Aceita apenas `conteudo: string` (`Tooltip.tsx:10`), o que exclui qualquer estrutura. O `Popover` do mesmo arquivo aceita `ReactNode` e é controlado por clique, com props `aberto` e `onClose`, sem comportamento de hover com atraso. **Lacuna real:** falta uma variante de tooltip com conteúdo estruturado e um primitivo equivalente ao `TooltipKV`.

### 3. Célula de indicador que também é filtro
**Onde:** Solicitações (6 das 8 células) e Regulação (5 das 7).
**Resolve:** transformar a leitura do indicador em ação de filtro, com estado ativo persistente e sem deslocamento de layout, graças à borda de 2px reservada em transparente.
**Mais perto no catálogo:** `organisms/Widget/KpiWidget`. Tem `onDrillDown`, `variacao`, `meta`, `grafico` e `estado`, e **não tem** o par `active` mais alternância de filtro. O `KpiWidget` é mais rico no conteúdo e mais pobre no comportamento de seleção. **Lacuna real:** falta o estado `ativo` e a semântica de filtro no KPI.

### 4. Faixa de KPIs com divisor, em contêiner único
**Onde:** as 6 listagens, mais duas reimplementações locais nas abas.
**Resolve:** apresentar de 3 a 8 indicadores como uma linha tipográfica única, com divisor de 1px que vira horizontal abaixo de 768px, em vez de cards soltos em grade.
**Mais perto no catálogo:** `.storybook/templates/Dashboard/Dashboard.tsx` e `organisms/Widget`. O catálogo trata KPI como card individual; o TFD trata como faixa contínua. **Lacuna real:** falta o contêiner de faixa, com sua regra de responsividade.

### 5. Filtro em cascata de três níveis derivado dos dados
**Onde:** as 6 listagens, via `RegiaoRegionalMunicipioFilter`.
**Resolve:** encadear Região, Regional e Município, derivando as opções da base não filtrada para que nenhuma opção desapareça quando outro filtro já reduziu a lista.
**Mais perto no catálogo:** `molecules/CascadeSelect`. É um controle único com `opcoes: OpcaoCascata[]` em árvore e um valor `string[]`, ou seja, um seletor de caminho. O TFD usa três selects independentes visíveis simultaneamente, cada um filtrável em separado, com botão de limpar. **Lacuna parcial:** o `CascadeSelect` cobre a seleção hierárquica e não cobre o padrão de três selects paralelos com derivação de opções.

### 6. Grupo de avatares com estado vazio deliberado
**Onde:** as 6 listagens, coluna Responsável.
**Resolve:** mostrar de 1 a N responsáveis simultâneos com sobreposição, contagem `+N` e tooltip com todos os nomes; e, sobretudo, representar "sem responsável" com círculo tracejado neutro, decisão registrada em comentário para não parecer erro.
**Mais perto no catálogo:** `molecules/AvatarGroup`, que tem `pessoas`, `max` e `onOverflowClick`. **Lacuna pequena e específica:** falta o estado vazio neutro, e falta o tooltip agregado com a lista completa de nomes.

### 7. Badge temporal que expira sozinho
**Onde:** Regulação, Passagens e Ajuda de Custo, coluna Número (`TramitacaoBadge.tsx`).
**Resolve:** sinalizar "chegou há X horas" com três variantes de cor por tipo de tramitação, atualizando o texto a cada 60 segundos e desaparecendo após 24 horas sem recarregar a página.
**Mais perto no catálogo:** `atoms/Badge/Tag`. É estático. **Lacuna real:** falta a variante temporal com atualização e expiração.

### 8. Ação de linha desabilitada que explica o motivo
**Onde:** as 6 listagens e as abas Regulação e Financeiro, através de `isLocked` e `tooltipLocked` (`src/app/fluxo-v2/_utils/lock.ts`).
**Resolve:** a regra de nunca esconder a ação indisponível. O botão continua visível, fica desabilitado e o `title` explica por que, geralmente informando em qual setor a solicitação está travada.
**Mais perto no catálogo:** `atoms/Button` com `disabled`, mais `molecules/Tooltip`. A combinação existe e não está documentada como padrão. **Lacuna de diretriz:** o comportamento precisa virar regra escrita do design system, com o cuidado de acessibilidade que um botão desabilitado não recebe foco nem dispara tooltip por teclado.

### 9. Destaque de linha por barra lateral
**Onde:** Regulação (`L325`), Passagens (`L319`), Ajuda de Custo (`L334`).
**Resolve:** destacar uma linha que exige atenção usando `boxShadow: inset 3px 0 0 0`, o que preserva o zebrado e o hover, ao contrário do fundo colorido.
**Mais perto no catálogo:** `organisms/Table`, que tem `zebra`, `densidade`, `selecionavel` e `headerFixo`, sem nenhuma prop de destaque por linha. **Lacuna real:** falta destaque de linha por estado.

### 10. Chips de filtro com contagem embutida
**Onde:** aba Anexos (`AnexosTab.tsx:91-119`).
**Resolve:** filtrar por categoria mostrando de antemão quantos itens cada categoria tem, e omitir do conjunto as categorias vazias, o que elimina o vazio por filtro.
**Mais perto no catálogo:** `organisms/Filters/FilterBar`, cujo `FiltroAtivo` representa filtros já aplicados e removíveis, com `onRemover` e `onLimparTudo`. Modelo diferente: o `FilterBar` mostra o que foi escolhido, o chip do TFD mostra o que é escolhível. `atoms/Badge/Chip` cobre a forma visual e não a contagem nem a seleção. **Lacuna real:** falta um grupo de chips de escolha com contagem.

### 11. Alternador binário de ordenação com rótulo textual
**Onde:** aba Anexos (`AnexosTab.tsx:121-135`).
**Resolve:** ordenar por data em listas sem cabeçalho de tabela, escrevendo a direção por extenso (`Mais recente primeiro`) em vez de depender de uma seta.
**Mais perto no catálogo:** `atoms/Choice/ToggleButton`. Cobre a mecânica e não o padrão de ordenação com rótulo textual. **Lacuna pequena.**

### 12. Banner de contexto no topo do conteúdo, em três variantes
**Onde:** aba Regulação (devolução em âmbar com `role="alert"`, `L119-144`; somente leitura tracejado, `L147-163`), aba Financeiro (somente leitura em Acompanhamento, `L184-200`), detalhe (encerramento em vermelho com ações, `L347-469`).
**Resolve:** explicar por que a tela está em determinado estado, e o que o operador pode fazer a respeito, sem interromper com modal.
**Mais perto no catálogo:** `molecules/Feedback/Message`. Cobre o alerta em linha. **Lacuna parcial:** falta a variante de somente leitura com borda tracejada, e falta a variante de painel de estado com ações internas, que é o caso do bloco de encerramento com botão de reabertura e sub-bloco de despesas.

### 13. Semáforo de prazo
**Onde:** Acompanhamento, coluna `Data limite` (`L115-121`, `L418-431`).
**Resolve:** priorizar a fila por urgência, com quatro faixas de cor e texto que muda de forma conforme a faixa (`Atrasado Nd`, `Hoje`, `Faltam Nd`), sempre acompanhado do rótulo que declara a base do prazo.
**Mais perto no catálogo:** `atoms/Badge/StatusIndicator`, que trabalha com o dicionário fixo `ESTADOS_DE_FLUXO` (Rascunho, Enviado, Aprovado, Devolvido, Vencido e outros). Não cobre urgência calculada a partir de uma data. **Lacuna real.**

### 14. Célula de valor monetário
**Onde:** Passagens, Ajuda de Custo e aba Financeiro.
**Resolve:** apresentar dinheiro em mono, com `tabular-nums`, alinhado à direita, aplicando `line-through` e cinza quando o item está cancelado, e uma segunda linha em âmbar com o reembolso descontado.
**Mais perto no catálogo:** nada. `organisms/Table/Coluna` tem `alinhamento: 'direita'` e `render` livre, o que resolve o alinhamento e deixa toda a formatação por conta do consumidor: a story de referência formata dinheiro com um helper local `reais` declarado no próprio arquivo (`Table.stories.tsx:26-27`), do mesmo jeito que o TFD redeclara `fmtBRL` em cada tela. Vale notar que o catálogo já formalizou o caso análogo de CPF com `mascararCPF` (`Table.tsx:247-250`). **Lacuna real:** falta a célula monetária com seus estados de cancelamento e reembolso.

### 15. Seção com ícone, título, subtítulo e slot de ação
**Onde:** aba Regulação (3 seções) e aba Financeiro (2 seções). O componente `Section` está **duplicado dentro dos dois arquivos**, nunca foi extraído.
**Resolve:** agrupar conteúdo dentro de uma aba, com a ação primária da seção alinhada à direita do título.
**Mais perto no catálogo:** `organisms/Panel`, que tem `titulo`, `acoes`, `rodape` e `colapsavel`. Chega bem perto. **Lacuna pequena:** falta o ícone à esquerda do título e o subtítulo como `ReactNode` (a aba Financeiro passa JSX no subtítulo, `FinanceiroTab.tsx:403-408`).

### 16. Radio cards em grade
**Onde:** modal de reabertura do detalhe (`L603-647`) e `EnviarParaSetorDrawer`.
**Resolve:** escolher um destino entre 5 opções quando cada opção precisa de uma frase de explicação, o que um select não comporta.
**Mais perto no catálogo:** `molecules/RadioGroup`. Provavelmente sem variante de card com descrição, o que precisa ser confirmado antes de decidir construir. **Lacuna provável, a confirmar.**

### 17. Estado vazio que explica a causa
**Onde:** Ajuda de Custo (`Sem base para calcular`, `L394`), Acompanhamento (`Não garantido` para volta ausente, `L396`; `Sem data definida`, `L429`), detalhe (chip `Sem vínculo SEI`, `L244-256`), aba Financeiro (`Sem processo SEI`, `L524-527`).
**Resolve:** a regra de que o vazio de célula informa por que está vazio, em vez de exibir travessão.
**Mais perto no catálogo:** `SemRegistro`, exportado de `organisms/Table/Table.tsx:243-245`, que já cobre a forma (`<SemRegistro texto="Não informado" />`, usado em `Table.stories.tsx:48`). `molecules/EmptyState` trata o vazio de página inteira. **Lacuna de diretriz e não de componente:** o componente existe, e falta a regra escrita de que o texto do `SemRegistro` deve declarar a causa (`Sem base para calcular`, `Não garantido`) em vez de repetir um genérico.

### 18. Contêiner de aba com estado na URL
**Onde:** detalhe (`L89-95`), incluindo redirecionamento de aba legada (`L41`, `L68-75`).
**Resolve:** deixar a aba compartilhável por link e permitir que uma fila abra o detalhe já na aba certa (`?tab=regulacao&from=regulacao`).
**Mais perto no catálogo:** `molecules/Tabs`. Cobre a apresentação. **Lacuna de diretriz:** falta o padrão documentado de sincronizar aba com a URL e de tratar rótulo de aba obsoleto.

### 19. Navegação de retorno com origem declarada
**Onde:** detalhe (`L64-65`, `L144-146`), alimentado pelo parâmetro `?from=` que as 6 listagens escrevem ao navegar.
**Resolve:** o botão voltar leva de volta à fila de onde o usuário veio, nomeando-a no rótulo (`Voltar para Regulação`), em vez de recorrer ao histórico do navegador.
**Mais perto no catálogo:** `molecules/Navigation/Breadcrumb`. Resolve a hierarquia, e não a origem real da navegação. **Lacuna real.**

### 20. Coluna de identificação com destino condicional
**Onde:** as 6 listagens, via `SolicitacaoNumeroCell.tsx`.
**Resolve:** o número do processo é o identificador da linha e, ao mesmo tempo, um link para um sistema externo (o SEI) que existe em apenas parte dos registros. Com `seiUrl` vira link azul com ícone `ExternalLink` e `target="_blank"`; sem `seiUrl` vira texto mono sem afordância de link, e o tooltip informa `Sem link cadastrado`.
**Mais perto no catálogo:** `atoms/Link` com `papel="identificador"` e `novaAba`, já adotado como padrão da coluna de identificação em `organisms/Table/Table.stories.tsx:37-41`. Cobre bem os dois lados. **Lacuna de diretriz:** falta a regra do caso em que o destino não existe, ou seja, quando o identificador deve deixar de ser link sem deixar de ser identificador.

### Lacunas de estado, que é o que mais falta

| Lacuna | Alcance | Evidência |
|---|---|---|
| **Estado de erro** | **6 de 6 listagens, mais o detalhe** | Falha de carga vira `console.warn` em `FluxoV2Provider.tsx:396-399, 443-445` e a tela mostra vazio genérico. O catálogo já tem `EstadoDoWidget = 'erro'` no `KpiWidget` e não tem equivalente para tabela ou página. **É a maior lacuna funcional do levantamento.** |
| **Vazio por filtro distinto do vazio de primeiro uso** | 6 de 6 listagens | Frase única, sem ação de limpar filtros. `organisms/Table` aceita `semConteudo: ReactNode`, um único slot, o que não permite os dois casos |
| **Tela de sem permissão** | todo o app | `AppLayout.tsx:38-45` redireciona silenciosamente para `/dashboard`, exibindo skeleton no intervalo. Não existe página de acesso negado |
| **Skeleton de listagem reimplementado** | 6 de 6 listagens | O mesmo `Array.from({ length: 6 })` com larguras codificadas por índice de coluna aparece nas seis páginas, embora exista `src/shared/components/skeleton` e o catálogo tenha `molecules/SkeletonLista` |
| **Seleção em massa e ação em lote** | inexistente em todas | `organisms/Table` já oferece `selecionavel` e `acoesEmMassa`, sem consumidor no TFD |
| **Exportação de listagem** | inexistente | O único `Exportar` do fluxo é impressão de parecer (`RegulacaoTab.tsx:239`) |
| **Alternância de visão** | inexistente | Nenhuma listagem oferece tabela versus cartões |
| **Densidade configurável** | inexistente | Padding fixo em todas. `organisms/Table` já tem `densidade`, sem consumidor |
| **Validação inline de formulário** | inexistente nas confirmações | Aprovações e Acompanhamento validam por toast (`aprovacoes/page.tsx:170-171`, `acompanhamento/page.tsx:230-231`), sem erro junto ao campo |

## Convenções de layout que o protótipo segue de forma consistente

### Ordem das zonas
Invariável nas 6 listagens: `PageHeader` → `StatsRow` → barra de filtros → card branco contendo tabela e, dentro dele no rodapé, a paginação → sobreposições. Nenhuma listagem inverte essa ordem.

### Posição da ação primária
Sempre no canto superior direito, dentro do `PageHeader` pelo slot `actions` (`PageHeader.tsx:106-116`). Apenas Solicitações tem ação primária de página (`Nova solicitação`). As 5 filas não têm: a ação delas vive na linha da tabela, porque a operação é sempre sobre um caso específico. No detalhe, as ações de página ficam no canto superior direito do card de cabeçalho, com `Encerrar solicitação` em vermelho como última da fila.

### Largura e contêiner
Nenhuma listagem define `max-width`. A página ocupa toda a largura disponível. O contêiner é o `<main className="px-5 pb-8 sm:px-8">` do `AppLayout` (`AppLayout.tsx:126-136`), com `paddingTop` de `2rem` em desktop e `0.5rem` em mobile, e `marginLeft` igual à largura da barra lateral, que varia em três faixas: 0 abaixo de 768px, `var(--tfd-sidebar-w-sm)` entre 768px e 1280px, e `var(--tfd-sidebar-w)` acima de 1280px (`AppLayout.tsx:11-12, 50-77`).

### Métricas recorrentes

| Elemento | Valor |
|---|---|
| Altura dos controles de filtro | `36px` |
| Raio dos controles de filtro | `8px` |
| Largura mínima do campo de busca | `280px` |
| Largura mínima dos selects de domínio | `168px` |
| Raio dos cards | `10px` ou `var(--tfd-radius-lg)` |
| Borda dos cards | `1px solid #E2E8F0` ou `var(--tfd-surface-border)` |
| Sombra dos cards | `0 1px 0 rgba(15,23,42,0.02)` |
| Cabeçalho de tabela | fundo `#F8FAFC`, texto 12px em caixa alta, `letter-spacing: 0.06em`, cor `#64748B` |
| Célula de tabela | `px-4 py-3.5`, texto base 13px |
| Hover de linha | `#F8FAFC` |
| Espaçamento entre filtros | `gap-3`, com `mb-4` até a tabela |
| Espaçamento do `PageHeader` até o conteúdo | `mb-8` |

### Comportamento da tabela em tela estreita
**Registrado como lacuna, não como convenção.** Nenhuma das 6 listagens define comportamento responsivo para a tabela: são `<table className="w-full">` dentro de um `div` com `overflow: hidden`, sem `overflow-x: auto`, sem colunas ocultáveis, sem transformação em cartões. Em tela estreita, uma tabela de 9 colunas comprime as células até o texto quebrar. O único componente do fluxo com regra responsiva explícita é o `StatsRow`, que empilha abaixo de 768px (`StatsRow.tsx:89-100`), e o bloco de detalhe do cabeçalho, que passa de coluna para linha a partir de 1024px (`solicitacoes/[id]/page.tsx:692-711`). O `organisms/Table` do catálogo terá de decidir esse comportamento sem referência no TFD.

### Paginação
Padrão de 25 itens por página, opções 10, 25, 50, 100 e 200 (`Pagination.tsx:19`). Sempre no rodapé interno do card, nunca solta abaixo. As 6 listagens executam `setPage(1)` em um `useEffect` disparado por qualquer mudança de filtro ou de ordenação, com o comentário explicando o motivo em `solicitacoes/page.tsx:102-103`. A paginação some por completo quando `total === 0` (`Pagination.tsx:43`), o que deixa o estado vazio sem rodapé.

### Navegação para o detalhe
Linha inteira clicável, com `?from=<origem>` para o botão voltar e `?tab=` quando a fila tem aba correspondente (por exemplo `?tab=regulacao&from=regulacao` em `regulacao/page.tsx:329`). Toda célula que contém controle chama `stopPropagation` no `onClick` do `<td>`.

### Uso de cor
Fundo e borda são sempre neutros. A cor semântica entra em três lugares apenas: no ponto de 7px do `StatusDot`, no ícone tintado dentro de quadrado de 22px, e no texto do semáforo de prazo. O azul `#146BFA` é reservado a link, ação primária e estado ativo. Essa disciplina é consistente nas seis telas e vale ser preservada no design system.

### Contra-convenção a registrar
Praticamente todo o estilo do `fluxo-v2` é `style={{}}` em linha com valores hexadecimais literais. `#E2E8F0`, `#64748B`, `#94A3B8`, `#146BFA` e `#F8FAFC` aparecem centenas de vezes, misturados a classes utilitárias arbitrárias do Tailwind (`text-[13px]`, `py-3.5`) e a um uso esporádico de variáveis CSS (`var(--tfd-surface-border)`, `var(--tfd-radius-lg)`, `var(--tfd-primary-500)`). Não existe uma camada de token consistente. Ao portar qualquer padrão daqui para o design system, a tradução para token precisa ser feita de forma deliberada, porque o protótipo não oferece um mapa pronto de valor para token.
