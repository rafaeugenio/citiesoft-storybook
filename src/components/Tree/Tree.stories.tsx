import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Tree, type NoDaArvore } from './Tree';

const IconePasta = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path
      d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"
      strokeLinejoin="round"
    />
  </svg>
);

const IconeSetor = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 20V8l8-4 8 4v12" strokeLinejoin="round" />
    <path d="M10 20v-5h4v5" strokeLinejoin="round" />
  </svg>
);

const ESTRUTURA: NoDaArvore[] = [
  {
    chave: 'ses',
    rotulo: 'Secretaria de Estado da Saúde',
    icone: <IconePasta />,
    filhos: [
      {
        chave: 'dep-atencao',
        rotulo: 'Departamento de Atenção Básica',
        icone: <IconePasta />,
        filhos: [
          { chave: 'set-esf', rotulo: 'Setor de Estratégia Saúde da Família', icone: <IconeSetor /> },
          { chave: 'set-imunizacao', rotulo: 'Setor de Imunização', icone: <IconeSetor /> },
        ],
      },
      {
        chave: 'dep-regulacao',
        rotulo: 'Departamento de Regulação',
        icone: <IconePasta />,
        filhos: [
          { chave: 'set-tfd', rotulo: 'Setor de TFD', icone: <IconeSetor /> },
          { chave: 'set-auditoria', rotulo: 'Setor de Auditoria Assistencial', icone: <IconeSetor /> },
        ],
      },
      {
        chave: 'dep-administrativo',
        rotulo: 'Departamento Administrativo',
        icone: <IconePasta />,
        filhos: [
          { chave: 'set-diarias', rotulo: 'Setor de Diárias', icone: <IconeSetor /> },
          { chave: 'set-pessoal', rotulo: 'Setor de Recursos Humanos', icone: <IconeSetor /> },
        ],
      },
    ],
  },
];

const ROTULO = 'Estrutura organizacional';

const meta = {
  title: 'Dados/Tree',
  component: Tree,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Hierarquia navegável para quando a relação entre os itens é a informação principal: secretaria, departamento e setor. Origem: Figma CitieOne, página `6738:49728` — `tree` (filtro opcional acima de `root-children`, com `node-children` aninhado sob o nó que os abriu), `tree-treenode` (State: Idle | Hover | Highlight, Selection, Show Checkbox, Show Toggle Button, Show Icon + Icon) e `tree-node-toggle-button` (State, Toggle, Selected). Os exemplos desenhados são Basic, Checkbox e Filter; seleção múltipla sem caixa e carregamento sob demanda vieram do comportamento do componente equivalente. Teclado: setas cima e baixo andam entre os nós visíveis, direita expande ou entra, esquerda colapsa ou sobe ao pai, Home e End vão às pontas, Enter seleciona. Equivalente PrimeNG: `p-tree`.',
      },
    },
  },
  args: {
    rotulo: ROTULO,
    nos: ESTRUTURA,
  },
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

const arvoreDe = (canvasElement: HTMLElement) =>
  within(canvasElement).getByRole('tree', { name: ROTULO });

const chaveAtiva = (arvore: HTMLElement) => arvore.getAttribute('aria-activedescendant') ?? '';

export const Basico: Story = {
  name: 'Variante · básico com ícone',
  args: { chavesExpandidas: ['ses'] },
  play: async ({ canvasElement }) => {
    const arvore = arvoreDe(canvasElement);

    // Raiz aberta mais os três departamentos, com os setores ainda fechados.
    await expect(within(arvore).getAllByRole('treeitem')).toHaveLength(4);

    const raiz = within(arvore).getByRole('treeitem', { name: 'Secretaria de Estado da Saúde' });
    await expect(raiz).toHaveAttribute('aria-level', '1');
    await expect(raiz).toHaveAttribute('aria-expanded', 'true');

    const departamento = within(arvore).getByRole('treeitem', { name: 'Departamento de Regulação' });
    await expect(departamento).toHaveAttribute('aria-level', '2');
    await expect(departamento).toHaveAttribute('aria-expanded', 'false');
  },
};

export const Fechado: Story = {
  name: 'Estado · tudo colapsado',
  play: async ({ canvasElement }) => {
    const arvore = arvoreDe(canvasElement);

    await expect(within(arvore).getAllByRole('treeitem')).toHaveLength(1);
    await expect(within(arvore).queryAllByRole('group')).toHaveLength(0);
  },
};

export const SelecaoUnica: Story = {
  name: 'Seleção · única',
  args: { chavesExpandidas: ['ses', 'dep-regulacao'] },
  play: async ({ canvasElement }) => {
    const arvore = arvoreDe(canvasElement);

    await userEvent.click(within(arvore).getByRole('treeitem', { name: 'Setor de TFD' }));

    await expect(within(arvore).getByRole('treeitem', { name: 'Setor de TFD' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    // Clicar no filho não arrasta o ancestral junto: o evento para no nó.
    await expect(
      within(arvore).getByRole('treeitem', { name: 'Departamento de Regulação' }),
    ).toHaveAttribute('aria-selected', 'false');

    await userEvent.click(within(arvore).getByRole('treeitem', { name: 'Setor de Auditoria Assistencial' }));

    // Modo único troca a escolha em vez de acumular.
    await expect(within(arvore).getByRole('treeitem', { name: 'Setor de TFD' })).toHaveAttribute(
      'aria-selected',
      'false',
    );
  },
};

export const SelecaoMultipla: Story = {
  name: 'Seleção · múltipla',
  args: { modoSelecao: 'multipla', chavesExpandidas: ['ses', 'dep-administrativo'] },
  parameters: {
    docs: {
      description: {
        story:
          'Cada clique liga ou desliga um nó, sem propagar para a subárvore: serve para escolher setores soltos de departamentos diferentes.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const arvore = arvoreDe(canvasElement);

    await expect(arvore).toHaveAttribute('aria-multiselectable', 'true');

    await userEvent.click(within(arvore).getByRole('treeitem', { name: 'Setor de Diárias' }));
    await userEvent.click(within(arvore).getByRole('treeitem', { name: 'Setor de Recursos Humanos' }));

    await expect(
      within(arvore).getAllByRole('treeitem', { selected: true }),
    ).toHaveLength(2);
  },
};

export const SelecaoCheckbox: Story = {
  name: 'Seleção · checkbox com propagação',
  args: { modoSelecao: 'checkbox', chavesExpandidas: ['ses', 'dep-regulacao'] },
  parameters: {
    docs: {
      description: {
        story:
          'Marcar um departamento marca os setores dele; marcar parte deles deixa a linhagem em seleção parcial, anunciada por texto além do traço no desenho.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const arvore = arvoreDe(canvasElement);

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
    // A secretaria tem outros departamentos vazios: ela fica parcial, não marcada.
    await expect(
      within(arvore).getByRole('treeitem', { name: /Secretaria de Estado da Saúde/ }),
    ).toHaveAccessibleName(/seleção parcial/);
  },
};

export const SemSelecao: Story = {
  name: 'Seleção · nenhuma (só navegação)',
  args: { modoSelecao: 'nenhuma', chavesExpandidas: ['ses'] },
  play: async ({ canvasElement }) => {
    const arvore = arvoreDe(canvasElement);
    const raiz = within(arvore).getByRole('treeitem', { name: 'Secretaria de Estado da Saúde' });

    await userEvent.click(raiz);

    // Sem modo de seleção o papel não anuncia estado que não existe.
    await expect(raiz).not.toHaveAttribute('aria-selected');
  },
};

export const ExpandirNo: Story = {
  name: 'Comportamento · expandir nó',
  play: async ({ canvasElement }) => {
    const arvore = arvoreDe(canvasElement);
    const raiz = () => within(arvore).getByRole('treeitem', { name: 'Secretaria de Estado da Saúde' });

    await expect(raiz()).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(raiz().querySelector('.citie-tree__alternador') as HTMLElement);

    await expect(raiz()).toHaveAttribute('aria-expanded', 'true');
    await expect(within(arvore).getAllByRole('group')).toHaveLength(1);
    // Abrir pelo chevron não escolhe o nó.
    await expect(raiz()).toHaveAttribute('aria-selected', 'false');
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
    const arvore = arvoreDe(canvasElement);

    await userEvent.tab();
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

    await userEvent.keyboard('{End}');
    await expect(chaveAtiva(arvore)).toContain('no-dep-administrativo');

    await userEvent.keyboard('{Home}');
    await expect(chaveAtiva(arvore)).toContain('no-ses');

    await userEvent.keyboard('{Enter}');
    await expect(
      within(arvore).getByRole('treeitem', { name: 'Secretaria de Estado da Saúde' }),
    ).toHaveAttribute('aria-selected', 'true');
  },
};

export const ComFiltro: Story = {
  name: 'Comportamento · filtro',
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

    await userEvent.type(
      canvas.getByRole('searchbox', { name: `Filtrar ${ROTULO.toLowerCase()}` }),
      'diárias',
    );

    // Secretaria → Departamento Administrativo → Setor de Diárias.
    const arvore = arvoreDe(canvasElement);
    await expect(within(arvore).getAllByRole('treeitem')).toHaveLength(3);
    await expect(within(arvore).getByRole('treeitem', { name: 'Setor de Diárias' })).toBeVisible();
  },
};

export const FiltroSemResultado: Story = {
  name: 'Comportamento · filtro sem resultado',
  args: { comFiltro: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.type(
      canvas.getByRole('searchbox', { name: `Filtrar ${ROTULO.toLowerCase()}` }),
      'procuradoria',
    );

    // Sem nó nenhum o papel `tree` sairia sem filho válido; vira texto comum.
    await expect(canvas.queryByRole('tree')).not.toBeInTheDocument();
    await expect(canvas.getByText('Nenhum item para o filtro aplicado')).toBeVisible();
  },
};

const SETORES_DA_REGULACAO: NoDaArvore[] = [
  { chave: 'set-tfd', rotulo: 'Setor de TFD', icone: <IconeSetor /> },
  { chave: 'set-auditoria', rotulo: 'Setor de Auditoria Assistencial', icone: <IconeSetor /> },
];

/** Busca os setores de um departamento só quando ele é aberto pela primeira vez. */
function ArvoreSobDemanda() {
  const [carregando, setCarregando] = useState<string[]>([]);
  const [setores, setSetores] = useState<NoDaArvore[]>([]);

  const nos: NoDaArvore[] = [
    {
      chave: 'ses',
      rotulo: 'Secretaria de Estado da Saúde',
      icone: <IconePasta />,
      filhos: [
        {
          chave: 'dep-regulacao',
          rotulo: 'Departamento de Regulação',
          icone: <IconePasta />,
          carregaSobDemanda: true,
          filhos: setores.length ? setores : undefined,
        },
      ],
    },
  ];

  return (
    <Tree
      rotulo={ROTULO}
      nos={nos}
      chavesExpandidas={['ses']}
      chavesCarregando={carregando}
      aoCarregarFilhos={(no) => {
        setCarregando([no.chave]);
        window.setTimeout(() => {
          setSetores(SETORES_DA_REGULACAO);
          setCarregando([]);
        }, 400);
      }}
    />
  );
}

export const SobDemanda: Story = {
  name: 'Comportamento · carregamento sob demanda',
  parameters: {
    docs: {
      description: {
        story:
          'O departamento anuncia que tem setores antes de conhecê-los: abrir dispara a busca, o chevron vira indicador de carga e o estado é anunciado por texto, não só pelo giro.',
      },
    },
  },
  render: () => <ArvoreSobDemanda />,
  play: async ({ canvasElement }) => {
    const arvore = arvoreDe(canvasElement);
    const departamento = () =>
      within(arvore).getByRole('treeitem', { name: /Departamento de Regulação/ });

    await expect(departamento()).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(departamento().querySelector('.citie-tree__alternador') as HTMLElement);

    await expect(departamento()).toHaveAccessibleName(/carregando/);
    await expect(
      await within(arvore).findByRole('treeitem', { name: 'Setor de TFD' }),
    ).toBeVisible();
  },
};
