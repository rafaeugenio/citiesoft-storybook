# Blocos e telas Citiesoft: contrato de construção

Data: 2026-10-21. Base: componentes Base, Blocos, Charts e Templates já existentes neste Storybook, mapeados para a marca Citiesoft.

## Intenção

Criar um segundo conjunto de blocos e telas pensado para os sistemas B2G da Citiesoft (TFD, administrativo, saúde), montado só com os componentes deste Storybook. O conjunto serve de ponto de partida para telas reais: o time copia a composição e troca os dados.

A origem das telas é a pasta de templates do Design System (`Obsidian Vault/Citiesoft/Citiesoft-Design-System/design-system/09-templates/tela-*.md`, benchmark Mobbin de julho 2026). Cada template dela define anatomia, regras fixas, estados e acessibilidade. Os blocos novos implementam essas regras e as telas novas as compõem, com blocagem inspirada nas referências do Mobbin abaixo.

## O que se quer

1. Blocos novos, configuráveis por props, que faltam hoje.
2. Telas completas (templates) que compõem esses blocos em contexto Citiesoft.
3. Tudo documentado em Storybook, passando no gate de acessibilidade nos dois temas.

## O que não se quer (anti-objetivos)

- Cópia de código ou imagem de terceiros. As referências do Mobbin orientam a organização dos elementos, e cada tela é desenhada aqui.
- Dado real. Todo dado é fictício, plausível e em português do Brasil. CPF sempre mascarado (`***.***.***-**` ou `123.***.***-45`).
- Texto de interface em inglês ou frases de marketing.
- Valor literal de cor, tamanho de fonte ou sombra. Só tokens semânticos e utilitários de texto compostos do tema.

## Referências de layout (Mobbin, para consulta)

| Padrão | Referência | O que levar |
|---|---|---|
| Listagem com filtros | Browserbase https://mobbin.com/screens/b3e74860-e1a1-471f-9180-ecd6f12b530a | Chips de filtro com "+" que abre menu com submenus, "Limpar filtros", ordenação à direita, rodapé com itens por página e intervalo exibido |
| Listagem com busca e chips | Meetup https://mobbin.com/screens/c9704a3c-644d-4aba-8780-128aabb8921b, Klaviyo https://mobbin.com/screens/91b3f8b8-d5ec-4597-8ac1-8e7af35f123b | Busca à esquerda, filtros em linha, chips ativos removíveis, avatar e nome na primeira coluna |
| Filtro por condições | Calendly https://mobbin.com/screens/a633760b-536f-4387-af06-8056089fa6cc | Popover "Onde [campo] [operador] [valor]", "Adicionar condição", "Redefinir" e "Aplicar" |
| Seleção em massa | AirOps https://mobbin.com/screens/17f662a0-af51-4281-943d-897d290f881f, Delphi https://mobbin.com/screens/59b7add5-68fb-4cfe-b561-5d76cc45bacf, Recraft https://mobbin.com/screens/29c43e5a-7643-4824-950b-c22d992a961f | Barra flutuante embaixo, contador, ações, botão de limpar; popover que abre para cima |
| Tabelas auxiliares | Canny https://mobbin.com/screens/f6a3164b-c401-4baf-96af-878ca422507e | Navegação lateral de configurações agrupada, lista de tabelas, tabela com descrição, alternância de ativo e ações de editar e excluir |
| Drawer de edição | Klaviyo https://mobbin.com/screens/af5e59cd-ff22-43a2-8336-d96ffb9f7b6d, Calendly https://mobbin.com/screens/2cb90a92-7689-4166-92ff-86607ae0a3ca | Painel à direita com cabeçalho (ícone, título, fechar), corpo rolável, rodapé fixo com Salvar e Cancelar |

## Contexto de domínio

Sistemas de saúde pública e administrativos. O exemplo principal é o TFD (Tratamento Fora de Domicílio): solicitações de pacientes de um município para atendimento em outro. Entidades úteis para dados de exemplo:

- Solicitação TFD: protocolo (`TFD-2026-004812`), paciente (nome fictício, CPF mascarado), município de origem, município de destino, especialidade, unidade de destino, tipo de transporte, data da consulta, status.
- Status: `Em análise`, `Aguardando documentos`, `Aprovada`, `Agendada`, `Concluída`, `Negada`.
- Tabelas auxiliares: municípios, unidades de saúde, especialidades, tipos de transporte, motivos de negativa, tipos de documento.
- Perfis de acesso: Solicitante, Analista, Regulador, Gestor, Administrador.

Há dados prontos em `.storybook/fixtures/` (`dominio-tfd.ts`, `solicitacao-tfd.ts`, `processos.ts`, `painel-tfd.ts`, `cadastro-servidor.ts`). Reaproveite nomes e estrutura, sem copiar dado que pareça pessoal; gere ou ajuste valores fictícios. As telas antigas em `git show HEAD:.storybook/pages/*.stories.tsx` e `git show HEAD:.storybook/templates/*/*.tsx` mostram a organização do conteúdo, mas usam componentes que não existem mais.

## Regras de construção

### Onde fica o quê

- Blocos novos: `components/application/<bloco>/` (um arquivo por componente exportado, nomes de arquivo em kebab-case).
- Telas: `components/application/telas/<nome>.tsx`, cada uma exportando `<Nome>Tela({ contained })` no mesmo molde dos shells existentes (veja `components/application/dashboard/dashboard-shell.tsx`), com dados em `components/application/telas/dados/<nome>.ts`.
- Stories de bloco: `stories/blocos/<Nome>.stories.tsx`, `title: 'Blocos/<Nome>'`.
- Stories de tela: `stories/templates/<Nome>.stories.tsx`, `title: 'Templates/<Nome>'`.
- Alias `@/` aponta para a raiz do repositório.

### Estilo

- Só tokens semânticos (`bg-background-primary-default`, `text-text-secondary`, `border-border-button-default`, `text-text-brand`) e utilitários de texto compostos (`text-body-medium`, `text-title-2-semibold`). Veja `AGENTS.md`.
- Geometria igual à dos templates existentes: moldura de página com 12px, espaço de 16px entre blocos, barra lateral de 260px, cartões com `rounded-3xl`, campos e botões nos raios dos componentes Base.
- Ícones de `@remixicon/react`, passados como referência de componente.
- Textos de interface em português do Brasil com acentos, impessoais em interface (sem "você"), sem travessão e sem negação paralela ("não é X, é Y").
- Movimento curto e interrompível; respeitar `prefers-reduced-motion`.

### Componentes

- Reuse os componentes Base e os Blocos existentes antes de escrever algo novo (`Button`, `Input`, `Select`, `Table`, `Tabs`, `Pagination`, `Dropdown`, `Breadcrumb`, `Badge`, `Chip`, `Avatar`, `Checkbox`, `Switch`, `DatePicker`, `DashboardSidebar`, `StatCards`, charts). Leia a story de cada um em `stories/base/` e `stories/blocos/` para ver props e uso.
- Para sobreposições use `react-aria-components` (`Modal`, `ModalOverlay`, `Dialog`, `Popover`, `Menu`), que já traz foco, teclado e rolagem.
- Nada de estado global ou dependência nova. Se faltar uma biblioteca, relate.

### Configurabilidade

Todo bloco novo deve funcionar com poucas props e permitir troca de conteúdo por props e slots: rótulos, ícones, colunas, filtros, ações, estados (`carregando`, `vazio`, `erro`), densidade e tamanho. Valores padrão em português. Exporte os tipos das props.

### Stories

- Hooks só dentro de `render: function Render(args) {...}` nomeada.
- Cada bloco tem: padrão, variações de configuração (props principais), estados (vazio, carregando, erro, desabilitado quando existirem) e mobile.
- Cada tela tem: `Padrao` (tela cheia, `layout: 'fullscreen'`), `Contido` (altura fixa) e `Mobile` (largura de 390px).
- Interação demonstrável quando fizer sentido (abrir o drawer, selecionar linhas, filtrar), com `play` simples onde ajudar.

### Acessibilidade (gate do projeto)

O `test-storybook` roda axe nos temas claro e escuro e falha em violação. Entregue sem `a11y: todo`. Pontos recorrentes: nome acessível em ícones e controles, `aria-sort` em colunas ordenáveis, `<nav>` com `aria-label` único por página, ordem de foco coerente, foco devolvido ao gatilho ao fechar overlays, contraste dos tokens (use `text-text-brand` para texto interativo).

## Blocos a criar

### Sobreposições e navegação flutuante

| Bloco | Papel | Configuração principal |
|---|---|---|
| `Drawer` | Painel lateral para cadastro, edição e detalhe | `isOpen`, `onOpenChange`, `title`, `description`, `icon`, `size` (`sm`, `md`, `lg`, `xl`), `side` (`end`, `start`), `footer`, corpo rolável com cabeçalho e rodapé fixos |
| `DrawerActions` | Rodapé padrão do drawer | Rótulos e tons dos botões, estado de carregamento, ação secundária e destrutiva opcional |
| `Dialog` | Modal central | `size`, `title`, `description`, `footer` |
| `ConfirmDialog` | Confirmação, inclusive destrutiva com número exato de registros afetados | `tone` (`neutral`, `danger`), `affectedCount`, rótulos |
| `ActionMenu` | Menu suspenso de ações (três pontos, "Mais ações") | `placement` (`bottom`, `top`, `end`), itens com ícone, atalho, tom destrutivo e separador |
| `DockBar` | Menu flutuante embaixo da tela, para acesso rápido e navegação móvel | Itens com ícone, rótulo e ativo; posição central ou estendida; recolhível |

### Listagem

| Bloco | Papel | Configuração principal |
|---|---|---|
| `PageHeader` | Cabeçalho de página | Trilha, título, descrição, metadados, ação primária, ações secundárias, abas |
| `FilterBar` | Busca e filtros | Busca com espera de 300ms, filtros por lista (simples e múltiplos), chips ativos removíveis, "Limpar filtros", filtro por condições (popover) |
| `DataListing` | Listagem completa | Colunas por configuração, seleção, ordenação, ações de linha, paginação com intervalo e itens por página, densidade, estados (`carregando`, `vazio`, `vazio por filtro`, `erro`) |
| `SelectionBar` | Barra flutuante de seleção em massa | Contador, ações (com tom), limpar, posição (viewport ou contêiner) |
| `EmptyState`, `ErrorState`, `TableSkeleton` | Estados de apoio | Ícone, título, texto, ação |

### Estrutura de tela

| Bloco | Papel | Configuração principal |
|---|---|---|
| `AppFrame` | Moldura de sistema: barra lateral Citiesoft, barra superior, conteúdo | Grupos de navegação, usuário, ações da barra superior, marca, `contained` |
| `SettingsLayout` | Configurações com navegação lateral agrupada | Grupos de itens, selecionado, conteúdo |
| `LoginSimples` | Entrada simples, sem login social | Campo de identificação (`email`, `cpf`, `texto`), senha com mostrar e ocultar, lembrar, esqueci a senha, erro, `layout` (`card`, `dividido`), slot de marca e de rodapé |
| `FormSection`, `FormGrid`, `FormActions` | Formulários de cadastro | Seções com título, grade de 1 a 3 colunas, validação, barra de ações fixa |
| `Stepper` | Etapas de wizard | Etapas, atual, concluídas, clicável |
| `Timeline`, `DetailHeader`, `KeyValueList` | Detalhe de registro com histórico | Eventos com ícone, data e autor; cabeçalho com status e ações; pares rótulo e valor |

## Telas a criar

Cada tela segue o template correspondente em `09-templates` (leia o `.md` antes) e as referências acima.

1. **Listagem de solicitações TFD**: cabeçalho com "Nova solicitação", `FilterBar`, `DataListing` com seleção em massa (`SelectionBar`), drawer de detalhe ao abrir uma linha.
2. **Tabelas auxiliares**: `SettingsLayout` com grupo "Tabelas auxiliares", lista de tabelas, tabela de registros com alternância de ativo, drawer de edição e confirmação de exclusão.
3. **Hub de configurações**: preferências de conta, sistema e segurança.
4. **Login simples** e fluxo de senha: login, esqueci a senha, redefinir senha, verificação em duas etapas.
5. **Formulário de cadastro**: em página e em drawer.
6. **Wizard**: nova solicitação em etapas.
7. **Detalhe de registro**: cabeçalho de status, dados, documentos e linha do tempo.
8. **Dashboard TFD**: indicadores, gráficos e tabela recente.
9. **Gestão de usuários e permissões**: lista, convites e matriz módulo por papel.
10. **Páginas de erro e estados**: 404, 403, 500, vazio e confirmação destrutiva.
11. **Painel com menu flutuante**: tela com `DockBar` e `ActionMenu` para ações rápidas.

## Critérios de pronto

- `./node_modules/.bin/tsc -p tsconfig.app.json --noEmit` sem erro (gravar a saída em arquivo e ler o arquivo: o RTK filtra a saída direta).
- `./node_modules/.bin/oxlint` sem erro nos arquivos novos.
- Testes de stories passando nos dois temas (`CITIE_PW_CHANNEL=chrome` com `VITE_CITIE_TEMA_PADRAO=dark` para o escuro), sem `a11y: todo`.
- Abrir cada tela no navegador e conferir: sem erro de console, foco por teclado funcional, drawer fecha com Esc e devolve o foco.

## Decisões adiadas

- Uso de dados vindos de API real: fora de escopo, tudo é mock local.
- Versão Angular/PrimeNG dos blocos: a documentação de uso por stack fica nas páginas de Guias.
