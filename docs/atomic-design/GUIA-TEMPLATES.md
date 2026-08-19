# Guia de templates e páginas

Leia inteiro antes de escrever. Este guia rege a Fase 4 (templates) e a Fase 5
(páginas) da reorganização em Atomic Design.

## A distinção que governa tudo

**Template** é a estrutura da tela **sem conteúdo de domínio**: regiões,
hierarquia, responsividade e slots. Ele não sabe se a listagem é de processos ou
de servidores. Recebe tudo por props e por slots.

**Página** é uma instância do template com **conteúdo e estado realistas** do
domínio B2G. É ela que sabe que a listagem é de solicitações de TFD e que mostra
o que acontece quando a busca não encontra nada.

Se você está escrevendo `<h1>Processos</h1>` dentro do template, parou de fazer
template. Isso é conteúdo, e vai na página.

## Onde cada coisa mora

```
.storybook/
  templates/<Nome>/<Nome>.tsx          o template
  templates/<Nome>/<Nome>.css          estilo de layout apenas
  templates/<Nome>/<Nome>.stories.tsx  stories do template
  pages/<Nome>.stories.tsx             as páginas
  fixtures/<assunto>.ts                dados fictícios determinísticos
```

Templates e páginas ficam em `.storybook` porque são artefatos de demonstração e
validação, não fazem parte da biblioteca distribuída. É a recomendação do Brad
Frost e a regra desta reorganização.

## Regra inegociável: zero cópia de implementação

Templates e páginas importam **do ponto único de exportação**:

```tsx
import { Table, Search, FilterBar, Pagination, Button } from '../../../src';
```

**Proibido**: recriar marcação de um componente, copiar CSS de componente,
escrever um botão à mão, refazer uma tabela. Se falta um componente, isso é um
gap do design system: registre no seu relatório final em vez de improvisar.

O CSS do template cobre **apenas layout**: grade, regiões, espaçamento entre
zonas e comportamento responsivo. Cor, tipografia, raio e sombra vêm dos tokens
em `src/tokens/tokens.css`, nunca de valor literal.

## Títulos

```
Templates/<Família>/<Nome do template>
Páginas/<Módulo>/<Nome da tela>
```

Exemplos: `Templates/Listagem/Listagem com filtros`,
`Páginas/Processos/Consulta de processos`.

## O que o template precisa entregar

1. **Regiões nomeadas por slot**, seguindo a Anatomia da spec de origem, na
   ordem exata que ela define. A ordem das zonas é regra fixa, não sugestão.
2. **Responsividade** nos breakpoints do projeto. Crie stories para 1920, 1366,
   768 e 375 usando o parâmetro `viewport` do Storybook.
3. **Marcos de acessibilidade do documento**: um `main` por tela, hierarquia de
   heading sem salto, landmarks nomeadas quando houver mais de uma navegação.
4. **Documentação de origem**: a `description.component` cita o arquivo de spec
   de onde a anatomia veio e lista os componentes do sistema que o template usa.

## O que a página precisa entregar

Uma story por estado, com nome que descreve o estado. Cubra os que se aplicarem:

- padrão com dados;
- carregando;
- vazio de primeiro uso (nada cadastrado ainda);
- vazio por filtro (a busca não encontrou);
- erro de carregamento;
- resposta parcial, quando fizer sentido;
- sem permissão, quando fizer sentido;
- conteúdo longo (nome grande, muitas linhas, texto que quebra layout);
- variação responsiva.

**Vazio de primeiro uso e vazio por filtro são estados diferentes**, com causa,
texto e ação diferentes. Confundir os dois é erro documentado do design system.

Fluxos críticos precisam de `play` function: buscar e limpar filtro, selecionar
linhas e agir em massa, abrir cadastro e validar campo, confirmar antes de ação
destrutiva, navegar entre etapas, abrir e fechar overlay devolvendo o foco.

## Conteúdo

Português do Brasil, domínio B2G plausível, **sem dado pessoal real**. Use os
nomes fictícios já usados no catálogo: processo `2025/0481`, servidora
`Maria de Fátima Souza`, `Dr. Carlos Andrade`, secretarias, TFD, diária,
competência, benefício, lotação. CPF sempre mascarado na listagem.

Fixtures determinísticas: **nada de `Math.random()` nem `new Date()` sem
argumento**, porque isso quebra o snapshot visual e deixa o teste instável.

## Acessibilidade: o gate roda em modo `error`

Vale tudo que já está em `docs/PORT-GUIDE.md`. Os pontos que mais aparecem em
tela composta:

- um `main` por página e headings sem salto de nível;
- overlay começa fechado nas stories, com gatilho, senão cobre a documentação;
- região rolável precisa de `tabindex`;
- contraste de 4,5:1 para texto;
- foco visível e devolvido ao gatilho quando um overlay fecha.

## Verificação

```bash
./node_modules/.bin/tsc --noEmit -p tsconfig.app.json
```

**Não rode `npm run test-storybook`**: a suíte roda no navegador e execuções
simultâneas se atrapalham. Quem integra roda a suíte completa depois.

## O que devolver

Arquivos criados, regiões do template mapeadas contra a Anatomia da spec,
componentes do sistema usados, estados cobertos nas páginas, e **os gaps reais
do design system** que você encontrou, ou seja, o que a spec pede e a biblioteca
ainda não tem.
