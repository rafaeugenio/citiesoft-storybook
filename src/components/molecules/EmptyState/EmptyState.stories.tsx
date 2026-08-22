import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, waitFor, within } from 'storybook/test';
import { EmptyState } from './EmptyState';
import { Chip } from '../../atoms/Badge/Badge';

/**
 * Medição de órfã tipográfica. Percorre as palavras do parágrafo com Range e
 * agrupa pelos topos das caixas de linha: devolve quantas linhas o texto ocupou
 * e quantas palavras ficaram na última. Palavra órfã é última linha com uma só.
 */
function medirUltimaLinha(paragrafo: HTMLElement): { linhas: number; palavrasNaUltima: number } {
  const no = paragrafo.firstChild;
  if (!no || no.nodeType !== Node.TEXT_NODE) throw new Error('Parágrafo sem nó de texto direto.');
  const texto = no.textContent ?? '';
  const range = paragrafo.ownerDocument.createRange();

  const tops: number[] = [];
  for (const ocorrencia of texto.matchAll(/\S+/g)) {
    const inicio = ocorrencia.index ?? 0;
    range.setStart(no, inicio);
    range.setEnd(no, inicio + ocorrencia[0].length);
    tops.push(Math.round(range.getBoundingClientRect().top));
  }

  const linhas = new Set(tops).size;
  const topoDaUltima = tops[tops.length - 1];
  const palavrasNaUltima = tops.filter((topo) => topo === topoDaUltima).length;
  return { linhas, palavrasNaUltima };
}

const meta = {
  title: 'Moléculas/Feedback/EmptyState',
  component: EmptyState,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Estado vazio. Spec: `03-components/empty-state.md` v2.0.0. Regra central: primeiro uso e busca sem resultado nunca compartilham conteúdo, porque a causa é diferente.',
          '',
          '**O desenho mostra o objeto que falta.** Situação com objeto ausente recebe um fantasma estrutural: a anatomia real do conteúdo, esmaecida, montada com os tokens de superfície. Ele ensina que estrutura vai aparecer ali quando houver dado, coisa que um glifo genérico de documento nunca ensina. O repertório: `tabela` para listagem (padrão do primeiro uso), `formulario` para cadastro sem registro, `cards` para grade de `DataView`, `grafico` para painel sem dado no período. Busca sem resultado, erro e permissão descrevem eventos sem objeto a desenhar, então recebem símbolo específico da situação, no traço 1.5 do sistema. `nenhuma` serve ao widget minúsculo em que qualquer desenho viraria ruído.',
          '',
          'O fantasma reaproveita os tokens do `Skeleton` sem reaproveitar o componente: o Skeleton carrega o shimmer e significa "isto está chegando agora", enquanto o fantasma é estático e significa "esta estrutura existirá quando houver dado". Misturar os dois faria o vazio parecer carregamento eterno.',
          '',
          '**Alinhamento.** `centro` (padrão) para estado vazio de página inteira ou região larga, onde o bloco é o único conteúdo e o eixo central o destaca. `inicio` para dentro de card estreito ou coluna lateral, onde todo o resto da tela alinha à esquerda e o bloco centrado leria como corpo estranho.',
          '',
          '**Quando usar:** a região que deveria conter uma coleção ficou sem nenhum item, e a pessoa precisa entender a causa e o próximo passo. As quatro situações (`primeiro-uso`, `busca-sem-resultado`, `erro`, `permissao`) existem porque cada causa pede um texto e uma ação diferentes.',
          '',
          '**Quando não usar:**',
          '',
          '- **Enquanto os dados carregam.** O estado vazio afirma que não há nada, e durante o carregamento essa afirmação é falsa: o servidor vê "Nenhum lançamento registrado ainda" e sai da tela um instante antes da lista aparecer. Use `Átomos/Feedback/Skeleton` no formato do conteúdo esperado.',
          '- **Um campo do formulário ficou sem valor.** Isso é mensagem de erro do próprio campo, entregue pelo `error` do `Moléculas/Campos/Input` e dos demais campos.',
          '- **A operação falhou sem esvaziar a tela.** Quando a lista continua visível e o que quebrou foi a ação (salvar, enviar, aprovar), o aviso pertence a `Moléculas/Feedback/Message` ancorado à seção, ou a `Moléculas/Feedback/Toast` se for efêmero. O `situacao="erro"` daqui cobre o caso em que a coleção inteira não carregou.',
          '- **Uma célula ou um campo de detalhe está sem preenchimento.** Um bloco ilustrado dentro de uma linha de tabela ou de uma ficha estoura a densidade. Use `SemRegistro`, exportado de `Organismos/Tabelas/Table`, com a causa escrita ("Não informado", "Sem data definida"). A fronteira: `EmptyState` responde por uma coleção inteira ausente; `SemRegistro` responde por um valor ausente dentro de um registro que existe.',
          '- **Publicidade de recurso não contratado.** O estado vazio explica a ausência de dado. Convite para adquirir módulo é conteúdo de outra natureza e não deve ocupar esse espaço.',
          '',
          'Dois cuidados de implementação: o bloco tem `role="status"` com `aria-live="polite"`, então ele é anunciado quando aparece depois de um carregamento, e no tamanho `lg` o botão primário recebe foco automaticamente nas situações `primeiro-uso` e `erro`, em que a página inteira é o destino da atenção. Vazio por filtro (`busca-sem-resultado`) nunca recebe autofoco, porque o usuário está com o cursor no controle de filtro que disparou a atualização. Use `size="lg"` apenas quando o estado vazio ocupa a página inteira; dentro de um card ou de uma coluna lateral, prefira `sm` ou `md`, para não roubar o foco de outra área da tela.',
        ].join('\n'),
      },
    },
  },
  args: {
    titulo: 'Nenhum lançamento registrado ainda',
    descricao: 'Registre o primeiro lançamento de diária para acompanhar a prestação de contas.',
  },
} satisfies Meta<typeof EmptyState>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PrimeiroUso: Story = {
  name: 'Situação · primeiro uso',
  args: { acaoPrimaria: { rotulo: 'Registrar lançamento' } },
  parameters: {
    docs: {
      description: {
        story:
          'Primeiro uso de uma listagem desenha o fantasma de tabela por padrão: duas ou três linhas esmaecidas com a estrutura real de colunas, ensinando o que vai aparecer ali quando houver dado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const botao = canvas.getByRole('button', { name: 'Registrar lançamento' });
    // No tamanho lg em página completa, o botão primário recebe foco. O foco é
    // aplicado num efeito, então a asserção espera o efeito assentar.
    await waitFor(() => expect(botao).toHaveFocus());
    // O objeto ausente aparece em fantasma estrutural, sem glifo genérico.
    await expect(canvasElement.querySelector('.citie-empty__fantasma--tabela')).toBeInTheDocument();
    await expect(canvasElement.querySelector('.citie-empty__ilustracao svg')).toBeNull();
  },
};

export const BuscaSemResultado: Story = {
  name: 'Situação · busca sem resultado',
  args: {
    situacao: 'busca-sem-resultado',
    titulo: 'Nenhum resultado para os filtros aplicados',
    descricao: 'Ajuste o período ou a competência para ampliar a busca.',
    acaoPrimaria: { rotulo: 'Limpar filtros' },
    filtrosAplicados: (
      <>
        <Chip label="Março/2025" variant="read-only" size="sm" />
        <Chip label="São Luís" variant="read-only" size="sm" />
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Os filtros aplicados aparecem como chips acima do símbolo para reforçar a causa. Nunca culpar o usuário no texto. A ação é limpar os filtros; o botão de criar pertence ao primeiro uso, porque aqui o dado existe e o filtro é que o esconde.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Evento sem objeto a desenhar usa o símbolo específico da situação.
    await expect(canvasElement.querySelector('[data-simbolo="busca"]')).toBeInTheDocument();
    await expect(canvasElement.querySelector('.citie-empty__fantasma')).toBeNull();
    // A distinção entre os dois vazios: com filtro a ação é limpar, nunca criar.
    const limpar = canvas.getByRole('button', { name: 'Limpar filtros' });
    await expect(limpar).toBeVisible();
    await expect(canvas.queryByRole('button', { name: /Registrar/ })).toBeNull();
    // Vazio por filtro nunca rouba o foco de quem está filtrando, nem em lg.
    await expect(limpar).not.toHaveFocus();
  },
};

export const Erro: Story = {
  name: 'Situação · erro',
  args: {
    situacao: 'erro',
    titulo: 'Não foi possível carregar os lançamentos',
    descricao: 'Verifique sua conexão e tente novamente.',
    acaoPrimaria: { rotulo: 'Tentar novamente' },
    acaoSecundaria: { rotulo: 'Contatar suporte' },
    codigoErro: 'Código do erro: SIGEP-504',
  },
  parameters: {
    docs: {
      description: {
        story:
          '"Tentar novamente" está sempre presente, e o símbolo aponta para ela: o arco de recarga interrompido com o ponto de exclamação. O código técnico fica discreto abaixo da descrição, nunca em destaque.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('[data-simbolo="erro"]')).toBeInTheDocument();
    await expect(canvasElement.querySelector('.citie-empty__codigo')).toHaveTextContent(
      'SIGEP-504',
    );
  },
};

export const SemPermissao: Story = {
  name: 'Situação · sem permissão',
  args: {
    situacao: 'permissao',
    descricao:
      'Seu perfil não permite registrar lançamentos. Procure o gestor da sua unidade para solicitar acesso.',
  },
  parameters: {
    docs: {
      description: {
        story: 'Mesmo título do primeiro uso, com o botão de criação omitido e o cadeado no lugar do fantasma: a coleção existe, o acesso é que falta.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    // Sem permissão não oferece ação de criar.
    await expect(canvasElement.querySelector('.citie-empty__acoes')).toBeNull();
    await expect(canvasElement.querySelector('[data-simbolo="permissao"]')).toBeInTheDocument();
  },
};

export const FantasmaFormulario: Story = {
  name: 'Ilustração · fantasma de formulário',
  args: {
    ilustracao: 'formulario',
    titulo: 'Nenhum servidor cadastrado ainda',
    descricao: 'Cadastre o primeiro servidor para montar a folha da unidade.',
    acaoPrimaria: { rotulo: 'Cadastrar servidor' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cadastro sem registro mostra o par rótulo e campo esmaecendo: a anatomia do formulário que a pessoa vai preencher.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('.citie-empty__fantasma--formulario'),
    ).toBeInTheDocument();
    // O fantasma é desenho decorativo, escondido do leitor de tela.
    await expect(
      canvasElement.querySelector('.citie-empty__fantasma')?.getAttribute('aria-hidden'),
    ).toBe('true');
  },
};

export const FantasmaCards: Story = {
  name: 'Ilustração · fantasma de cards',
  args: {
    ilustracao: 'cards',
    size: 'md',
    titulo: 'Nenhuma unidade de saúde cadastrada',
    descricao: 'Cadastre a primeira unidade para distribuir os atendimentos.',
    acaoPrimaria: { rotulo: 'Cadastrar unidade' },
  },
  parameters: {
    docs: {
      description: {
        story: 'Para `DataView` em grade: três cards fantasmas dissolvendo para a direita, sugerindo a grade que vai existir.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.citie-empty__fantasma--cards')).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll('.citie-empty__fantasma-card')).toHaveLength(3);
  },
};

export const FantasmaGrafico: Story = {
  name: 'Ilustração · fantasma de gráfico',
  args: {
    ilustracao: 'grafico',
    size: 'md',
    titulo: 'Sem lançamentos no período',
    descricao: 'Nenhuma competência do intervalo selecionado tem lançamento para compor o gráfico.',
    acaoPrimaria: { rotulo: 'Ampliar período' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Painel sem dado no período mostra o eixo com barras esmaecidas. A extremidade do dado arredonda só no topo; a aresta que encosta no eixo fica reta, regra 8 da gramática estrutural.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(
      canvasElement.querySelector('.citie-empty__fantasma--grafico'),
    ).toBeInTheDocument();
    await expect(canvasElement.querySelectorAll('.citie-empty__fantasma-barra')).toHaveLength(6);
  },
};

export const ComAjuda: Story = {
  name: 'Conteúdo · caminho de ajuda',
  args: {
    acaoPrimaria: { rotulo: 'Registrar lançamento' },
    ajuda: { rotulo: 'Como funciona a prestação de contas', href: '#' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'O caminho de ajuda entra abaixo da ação primária, em corpo menor: aprender a fazer é diferente de fazer, e o primeiro uso é onde a dúvida mora. Ele nunca disputa peso com o botão.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('link', { name: 'Como funciona a prestação de contas' }),
    ).toBeVisible();
  },
};

export const AlinhamentoInicio: Story = {
  name: 'Composição · alinhado ao início',
  args: {
    size: 'md',
    alinhamento: 'inicio',
    titulo: 'Nenhum anexo enviado',
    descricao: 'Anexe o comprovante de despesa para concluir a prestação de contas do processo.',
    acaoPrimaria: { rotulo: 'Anexar comprovante' },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Dentro de card estreito ou coluna lateral, o resto da tela alinha à esquerda e o bloco centrado leria como corpo estranho. `alinhamento="inicio"` devolve o estado vazio ao eixo de leitura do contêiner.',
      },
    },
  },
  render: (args) => (
    <div
      style={{
        maxWidth: 360,
        border: '1px solid var(--citie-border-default)',
        borderRadius: 'var(--citie-radius-xl)',
        padding: 'var(--citie-spacing-5)',
      }}
    >
      <EmptyState {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const bloco = canvasElement.querySelector('.citie-empty');
    await expect(bloco).toHaveClass('citie-empty--inicio');
    await expect(getComputedStyle(bloco as Element).alignItems).toBe('flex-start');
  },
};

export const MedidaDeTexto: Story = {
  name: 'Acabamento · medida de texto',
  args: { acaoPrimaria: { rotulo: 'Registrar lançamento' } },
  parameters: {
    docs: {
      description: {
        story:
          'A descrição trava em `max-inline-size: 40ch` com `text-wrap: pretty`. O texto canônico de 80 caracteres quebrava aos 480px deixando "prestação de contas" órfão na segunda linha; nesta medida ele quebra em duas linhas de peso parecido. A play function mede de verdade: conta as palavras da última linha via `Range` e reprova se sobrar uma só.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const descricao = canvasElement.querySelector<HTMLElement>('.citie-empty__descricao');
    if (!descricao) throw new Error('Descrição ausente.');

    // A medida em ch precisa estar aplicada, senão a medição abaixo não vale.
    await expect(getComputedStyle(descricao).maxInlineSize).not.toBe('none');

    const { linhas, palavrasNaUltima } = medirUltimaLinha(descricao);
    // O texto canônico ocupa mais de uma linha nesta medida.
    await expect(linhas).toBeGreaterThan(1);
    // Nenhuma palavra órfã: a última linha carrega pelo menos três palavras.
    await expect(palavrasNaUltima).toBeGreaterThanOrEqual(3);
  },
};

export const Medio: Story = {
  name: 'Tamanho · md (painel lateral)',
  args: { size: 'md', acaoPrimaria: { rotulo: 'Registrar lançamento' } },
};

export const Pequeno: Story = {
  name: 'Tamanho · sm (widget)',
  args: {
    size: 'sm',
    ilustracao: 'nenhuma',
    titulo: 'Nenhum benefício vencendo',
    descricao: 'Nada exige ação nos próximos 30 dias.',
  },
  parameters: {
    docs: {
      description: {
        story:
          'No widget minúsculo o vazio é uma boa notícia, e qualquer desenho viraria ruído: `ilustracao="nenhuma"` deixa só o texto.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.querySelector('.citie-empty__fantasma')).toBeNull();
    await expect(canvasElement.querySelector('.citie-empty__ilustracao')).toBeNull();
  },
};
