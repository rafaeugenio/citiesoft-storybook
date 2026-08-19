# Inventário de templates

## De onde vieram

Os templates **não** foram inventados para preencher a taxonomia. Eles saíram da
biblioteca de telas do design system, em
`Obsidian Vault/Citiesoft/Citiesoft-Design-System/design-system/09-templates/`,
que documenta **48 telas** em Markdown mais um `templates.html` de 233 KB com os
wireframes renderizados.

Cada arquivo `tela-*.md` traz Anatomia por zonas, Componentes da biblioteca por
wikilink, Pontos de variação permitidos, Regras fixas e Estados. É uma fonte
melhor do que HTML solto, porque já declara a composição.

**Registro de dependência externa**: esses arquivos vivem no vault, não neste
repositório. Regenerar ou revisar um template exige acesso a essa pasta.

## O que foi construído

O guia da biblioteca define um **Núcleo operacional** de cinco telas, e essa
lista coincide com a que a demanda enumerou. Foram esses cinco mais o shell de
aplicação:

| Template | Origem | Título no catálogo |
| --- | --- | --- |
| Shell de aplicação | `03-components/navigation-sidebar-header.md` | `Templates/Estrutura/Shell de aplicação` |
| Listagem com filtros | `09-templates/tela-listagem.md` | `Templates/Listagem/Listagem com filtros` |
| Cadastro | `09-templates/tela-formulario-cadastro.md` | `Templates/Formulário/Cadastro` |
| Detalhe de registro | `09-templates/tela-detalhe-registro.md` | `Templates/Detalhe/Detalhe de registro` |
| Painel de indicadores | `09-templates/tela-dashboard.md` | `Templates/Dashboard/Painel de indicadores` |
| Fluxo em etapas | `09-templates/tela-wizard.md` | `Templates/Wizard/Fluxo em etapas` |

## Páginas derivadas

| Página | Template | Domínio |
| --- | --- | --- |
| `Páginas/Processos/Consulta de processos` | Listagem | Solicitações de TFD |
| `Páginas/Pessoas/Cadastro de servidor` | Cadastro | Cadastro de servidor |
| `Páginas/Processos/Detalhe do processo` | Detalhe | Processo 2025/0481 |
| `Páginas/Processos/Painel de TFD` | Dashboard | Indicadores de TFD |
| `Páginas/Processos/Nova solicitação de TFD` | Wizard | Solicitação em 4 etapas |

## As 43 telas não construídas

O restante da biblioteca fica mapeado como lastro, não como dívida silenciosa. A
regra adotada foi a da própria demanda: **não inventar template ausente apenas
para preencher a taxonomia**.

- **Autenticação e conta** (5): login, criar conta, esqueci a senha, redefinir
  senha, verificação em duas etapas.
- **Configurações e administração** (4): hub de configurações, gestão de
  usuários, papéis e permissões, notificações.
- **Estados de apoio e erro** (2): empty state com confirmação destrutiva,
  páginas de erro.
- **Onboarding e workspace** (4), **cobrança** (3), **comunicação e
  colaboração** (7), **conteúdo e visões de dados** (9), **plataforma e
  integrações** (6), **governança e histórico** (5).

Duas observações sobre priorização, para quando esse lastro for atacado:

1. As telas de **estados de apoio e erro** são transversais e provavelmente a
   próxima fatia de maior valor, porque os estados que elas definem já aparecem
   dentro dos cinco templates construídos.
2. Boa parte do bloco de **comunicação e colaboração** e de **conteúdo e visões
   de dados** descreve produto SaaS genérico, herdado do benchmark do Mobbin, e
   pode não ter uso previsto nos sistemas B2G da Citiesoft. Vale confirmar a
   demanda antes de construir.

## Regras que os templates seguem

- Zero cópia de implementação: todos importam do ponto único de exportação em
  `src/index.ts`.
- CSS de template cobre apenas layout. Cor, tipografia, raio e sombra vêm dos
  tokens.
- Ordem das zonas conforme a Anatomia da spec de origem, que é regra fixa.
- Stories nos quatro breakpoints, mais tema escuro onde faz diferença.
- Templates e páginas vivem em `.storybook/`, fora do pacote distribuído,
  seguindo a recomendação do Brad Frost.

## Gaps do design system encontrados na construção

Registrados aqui porque a construção de tela composta é o que revela o que falta:

1. **O tema escuro não era exercitado pelo gate.** Todas as stories de
   componente rodam em tema claro, então o axe nunca o inspecionou. A primeira
   tela composta em escuro reprovou com contraste. Dois defeitos reais saíram
   daí, ambos corrigidos: o item ativo da Sidebar (4,39:1) e a inicial do Avatar
   sobre superfície colorida (1,90:1).
2. **Hierarquia de heading é responsabilidade de composição.** Cada componente
   escolhe o próprio nível isoladamente, e a soma numa tela real pulava nível.
   Nenhuma story de componente pega isso.
3. **Falta token de fonte monoespaçada**, já registrado no `README`.
