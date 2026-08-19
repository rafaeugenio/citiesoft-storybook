import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { TreeSelect, type NoArvore } from './TreeSelect';

const ESTRUTURA: NoArvore[] = [
  {
    chave: 'ses',
    rotulo: 'Secretaria de Estado da Saúde',
    filhos: [
      {
        chave: 'dep-atencao',
        rotulo: 'Departamento de Atenção Básica',
        filhos: [
          { chave: 'set-esf', rotulo: 'Setor de Estratégia Saúde da Família' },
          { chave: 'set-imunizacao', rotulo: 'Setor de Imunização' },
        ],
      },
      {
        chave: 'dep-regulacao',
        rotulo: 'Departamento de Regulação',
        filhos: [
          { chave: 'set-tfd', rotulo: 'Setor de TFD' },
          { chave: 'set-auditoria', rotulo: 'Setor de Auditoria Assistencial' },
        ],
      },
      {
        chave: 'dep-administrativo',
        rotulo: 'Departamento Administrativo',
        filhos: [
          { chave: 'set-diarias', rotulo: 'Setor de Diárias' },
          { chave: 'set-pessoal', rotulo: 'Setor de Recursos Humanos' },
        ],
      },
    ],
  },
];

const NOME_DO_CAMPO = 'Lotação do servidor';

const meta = {
  title: 'Moléculas/Campos/TreeSelect',
  component: TreeSelect,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Escolha de um nó dentro de uma hierarquia, para quando a lista plana esconderia a relação entre os itens (secretaria, departamento, setor). Origem: Figma CitieOne, página `6738:46436` — `treeselect` (State: Idle | Open | Selected | Hover), `treeselect-input` (State, Invalid, Disabled, Filled, Size, Helper, Label, Clear Icon) e `treeselect-input-content` (Text Config: Placeholder | Text | Chip, com até 3 fichas). Os exemplos da página cobrem Basic, Checkbox, Float Label, Filter, Invalid e Disabled. Float label não foi portado: no DS Citiesoft o rótulo fica sempre acima do controle, via `FieldWrapper`. Teclado: setas cima/baixo andam entre os nós visíveis, direita expande ou entra, esquerda colapsa ou sobe, Enter escolhe, Escape fecha. Equivalente PrimeNG: `p-treeselect`.\n\n**Quando não usar:** lista plana, ou hierarquia de um nível só, porque a seta de expandir vira um passo sem função e quem abre o painel pela primeira vez o fecha achando que a lista está vazia; use `Moléculas/Campos/Select` ou `Moléculas/Campos/MultiSelect`. Hierarquia que o servidor precisa enxergar inteira, comparar e manipular (expandir vários ramos, marcar em lote, conferir a estrutura) pede `Organismos/Hierarquia/Tree`, com a árvore sempre visível na tela em vez de escondida num painel que fecha a cada escolha. Quando cada nó carrega colunas de dado (código, responsável, situação), a leitura só funciona em `Organismos/Tabelas/TreeTable`. Para busca por digitação numa base grande onde a hierarquia não muda a decisão, `Moléculas/Campos/AutoComplete` chega ao mesmo resultado com menos navegação. E quando o usuário sempre escolhe uma folha conhecida, exibir a árvore inteira só acrescenta níveis intermediários que ele precisa atravessar toda vez.',
      },
    },
  },
  args: {
    label: NOME_DO_CAMPO,
    nos: ESTRUTURA,
    placeholder: 'Selecione o setor de lotação',
  },
} satisfies Meta<typeof TreeSelect>;

export default meta;
type Story = StoryObj<typeof meta>;

const abrir = async (canvasElement: HTMLElement) => {
  const canvas = within(canvasElement);
  await userEvent.click(canvas.getByRole('button', { name: NOME_DO_CAMPO }));
  return canvas.getByRole('tree', { name: NOME_DO_CAMPO });
};

const chaveAtiva = (arvore: HTMLElement) => arvore.getAttribute('aria-activedescendant') ?? '';

export const Idle: Story = {
  name: 'State · idle',
  play: async ({ canvasElement }) => {
    const gatilho = within(canvasElement).getByRole('button', { name: NOME_DO_CAMPO });

    await expect(gatilho).toHaveAttribute('aria-haspopup', 'tree');
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Aberto: Story = {
  name: 'State · open',
  args: { chavesExpandidas: ['ses'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const arvore = await abrir(canvasElement);

    await expect(canvas.getByRole('button', { name: NOME_DO_CAMPO })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    // Raiz aberta mais os três departamentos, com os setores ainda fechados.
    await expect(within(arvore).getAllByRole('treeitem')).toHaveLength(4);

    const raiz = within(arvore).getByRole('treeitem', { name: 'Secretaria de Estado da Saúde' });
    await expect(raiz).toHaveAttribute('aria-expanded', 'true');
    await expect(raiz).toHaveAttribute('aria-level', '1');

    const departamento = within(arvore).getByRole('treeitem', {
      name: 'Departamento de Regulação',
    });
    await expect(departamento).toHaveAttribute('aria-level', '2');
    await expect(departamento).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Selecionado: Story = {
  name: 'State · selected',
  args: { chavesExpandidas: ['ses', 'dep-regulacao'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const arvore = await abrir(canvasElement);

    await userEvent.click(within(arvore).getByRole('treeitem', { name: 'Setor de TFD' }));

    // Escolha única fecha o painel e devolve o foco ao gatilho.
    const gatilho = canvas.getByRole('button', { name: NOME_DO_CAMPO });
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await expect(gatilho).toHaveFocus();
    await expect(canvas.getByText('Setor de TFD')).toBeVisible();
  },
};

export const ExpandirNo: Story = {
  name: 'Comportamento · expandir nó',
  play: async ({ canvasElement }) => {
    const arvore = await abrir(canvasElement);
    const raiz = () =>
      within(arvore).getByRole('treeitem', { name: 'Secretaria de Estado da Saúde' });

    await expect(raiz()).toHaveAttribute('aria-expanded', 'false');
    await expect(within(arvore).getAllByRole('treeitem')).toHaveLength(1);

    await userEvent.keyboard('{ArrowRight}');

    await expect(raiz()).toHaveAttribute('aria-expanded', 'true');
    await expect(within(arvore).getAllByRole('group')).toHaveLength(1);
  },
};

export const Teclado: Story = {
  name: 'Comportamento · teclado',
  args: { chavesExpandidas: ['ses'] },
  parameters: {
    docs: {
      description: {
        story:
          'A árvore é um único ponto de tabulação e aponta o nó corrente com `aria-activedescendant`, em vez de espalhar foco por dezenas de nós.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const arvore = await abrir(canvasElement);

    await expect(arvore).toHaveFocus();
    await expect(chaveAtiva(arvore)).toContain('no-ses');

    await userEvent.keyboard('{ArrowDown}');
    await expect(chaveAtiva(arvore)).toContain('no-dep-atencao');

    await userEvent.keyboard('{ArrowRight}');
    await expect(
      within(arvore).getByRole('treeitem', { name: 'Departamento de Atenção Básica' }),
    ).toHaveAttribute('aria-expanded', 'true');

    await userEvent.keyboard('{ArrowRight}');
    await expect(chaveAtiva(arvore)).toContain('no-set-esf');

    await userEvent.keyboard('{ArrowLeft}');
    await expect(chaveAtiva(arvore)).toContain('no-dep-atencao');

    await userEvent.keyboard('{Enter}');
    await expect(canvas.getByRole('button', { name: NOME_DO_CAMPO })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  },
};

export const FecharComEscape: Story = {
  name: 'Comportamento · Escape fecha',
  args: { chavesExpandidas: ['ses'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await abrir(canvasElement);

    await userEvent.keyboard('{Escape}');

    const gatilho = canvas.getByRole('button', { name: NOME_DO_CAMPO });
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await expect(gatilho).toHaveFocus();
  },
};

export const Checkbox: Story = {
  name: 'Variante · checkbox (seleção múltipla)',
  args: {
    modo: 'checkbox',
    chavesExpandidas: ['ses', 'dep-administrativo'],
    placeholder: 'Selecione os setores',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Marcar um departamento marca os setores dele; marcar parte deles deixa o pai em seleção parcial, anunciada por texto além do traço no desenho.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const arvore = await abrir(canvasElement);

    await expect(arvore).toHaveAttribute('aria-multiselectable', 'true');

    await userEvent.click(within(arvore).getByRole('treeitem', { name: 'Setor de Diárias' }));

    await expect(
      within(arvore).getByRole('treeitem', { name: 'Setor de Diárias' }),
    ).toHaveAttribute('aria-selected', 'true');
    // Só um dos dois setores: o departamento fica parcial, não marcado.
    await expect(
      within(arvore).getByRole('treeitem', { name: /Departamento Administrativo/ }),
    ).toHaveAttribute('aria-selected', 'false');
    // A parcialidade sobe toda a linhagem: com um setor marcado, o departamento
    // e a secretaria acima dele ficam os dois em seleção parcial.
    const parciais = within(arvore).getAllByRole('treeitem', { name: /seleção parcial/ });
    await expect(parciais).toHaveLength(2);
    await expect(parciais[0]).toHaveAccessibleName(/Secretaria/);
  },
};

export const CheckboxPropagando: Story = {
  name: 'Variante · checkbox propagando para os filhos',
  args: {
    modo: 'checkbox',
    chavesExpandidas: ['ses', 'dep-regulacao'],
    placeholder: 'Selecione os setores',
  },
  play: async ({ canvasElement }) => {
    const arvore = await abrir(canvasElement);

    await userEvent.click(
      within(arvore).getByRole('treeitem', { name: 'Departamento de Regulação' }),
    );

    await expect(within(arvore).getByRole('treeitem', { name: 'Setor de TFD' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    await expect(
      within(arvore).getByRole('treeitem', { name: 'Setor de Auditoria Assistencial' }),
    ).toHaveAttribute('aria-selected', 'true');
    // A ficha do campo resume pelo nó de topo marcado, não por cada setor.
    await expect(canvasElement.querySelector('.citie-treeselect__ficha')).toHaveTextContent(
      'Departamento de Regulação',
    );
  },
};

export const ComFiltro: Story = {
  name: 'Comportamento · filtro no painel',
  args: { comFiltro: true },
  parameters: {
    docs: {
      description: {
        story:
          'Durante o filtro a árvore abre inteira: um ramo que casou escondido atrás de um nó fechado devolveria um painel aparentemente vazio.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const arvore = await abrir(canvasElement);

    await userEvent.type(
      canvas.getByRole('searchbox', { name: `Filtrar ${NOME_DO_CAMPO.toLowerCase()}` }),
      'diárias',
    );

    // Secretaria → Departamento Administrativo → Setor de Diárias.
    await expect(within(arvore).getAllByRole('treeitem')).toHaveLength(3);
    await expect(within(arvore).getByRole('treeitem', { name: 'Setor de Diárias' })).toBeVisible();
  },
};

export const FiltroSemResultado: Story = {
  name: 'Comportamento · filtro sem resultado',
  args: { comFiltro: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await abrir(canvasElement);

    await userEvent.type(
      canvas.getByRole('searchbox', { name: `Filtrar ${NOME_DO_CAMPO.toLowerCase()}` }),
      'procuradoria',
    );

    // Sem nó nenhum o papel `tree` sairia sem filho válido; vira texto comum.
    await expect(canvas.queryByRole('tree')).not.toBeInTheDocument();
    await expect(canvas.getByText('Nenhum item para o filtro aplicado')).toBeVisible();
  },
};

export const ComLimpar: Story = {
  name: 'Variante · ícone de limpar',
  args: { comLimpar: true, chavesSelecionadas: ['set-tfd'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: `Limpar ${NOME_DO_CAMPO.toLowerCase()}` }));

    await expect(canvas.getByText('Selecione o setor de lotação')).toBeVisible();
  },
};

export const Invalido: Story = {
  name: 'Estado · inválido',
  args: {
    required: true,
    error: 'Escolha o setor de lotação do servidor para concluir o cadastro.',
  },
  play: async ({ canvasElement }) => {
    const gatilho = within(canvasElement).getByRole('button', { name: NOME_DO_CAMPO });

    await expect(gatilho).toHaveAttribute('aria-invalid', 'true');
    await expect(gatilho).toHaveAccessibleDescription(
      'Escolha o setor de lotação do servidor para concluir o cadastro.',
    );
  },
};

export const ComHelper: Story = {
  name: 'Estado · com helper',
  args: { helper: 'A lotação define quais processos de TFD o servidor enxerga.' },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true, chavesSelecionadas: ['set-tfd'] },
};

export const Filled: Story = {
  name: 'Variante · filled',
  args: { filled: true },
};

export const Tamanhos: Story = {
  name: 'Size · 32 / 40 / 48px',
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <TreeSelect {...args} size="small" label="Lotação (small)" />
      <TreeSelect {...args} size="normal" label="Lotação (normal)" />
      <TreeSelect {...args} size="large" label="Lotação (large)" />
    </div>
  ),
};
