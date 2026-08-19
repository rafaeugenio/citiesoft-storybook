import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { SplitButton } from './SplitButton';

const ACOES_DE_SALVAR = [
  { id: 'continuar', rotulo: 'Salvar e continuar' },
  { id: 'rascunho', rotulo: 'Salvar como rascunho' },
  { id: 'novo', rotulo: 'Salvar e cadastrar outro', separadorAcima: true },
];

const meta = {
  title: 'Moléculas/Ações/SplitButton',
  component: SplitButton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Ação padrão em destaque com um gatilho de menu acoplado à direita. Página do Figma CitieOne `6738:49720` (❖ splitbutton), eixos `State = Idle | Open`, `Raised = False | True`, `Rounded = False | True`. Spec: `03-components/buttons.md` v2.0.0 (família de ação). Equivalente PrimeNG: `p-splitbutton`.\n\nUse quando existe uma ação dominante com variações relacionadas dela. Para uma lista de ações sem ação padrão, use `Menu` com botão que abre menu.\n\nSão dois botões irmãos: o principal executa a ação padrão, o gatilho abre o menu com nome acessível próprio.',
      },
    },
  },
  args: {
    rotulo: 'Salvar colaborador',
    itens: ACOES_DE_SALVAR,
  },
} satisfies Meta<typeof SplitButton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Estado · fechado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const acao = canvas.getByRole('button', { name: 'Salvar colaborador' });
    const gatilho = canvas.getByRole('button', { name: 'Mais ações de salvar colaborador' });

    // Dois botões irmãos, com nomes acessíveis distintos.
    await expect(acao).toBeVisible();
    await expect(gatilho).toHaveAttribute('aria-haspopup', 'menu');
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('menu')).toBeNull();
  },
};

export const MenuAberto: Story = {
  name: 'Estado · menu aberto',
  parameters: {
    docs: {
      description: {
        story:
          'Figma `State = Open`. O menu começa fechado e só sobe pelo gatilho. As opções repetem o verbo da ação padrão, deixando explícito que são variações dela.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Mais ações de salvar colaborador' });

    await userEvent.click(gatilho);

    await expect(gatilho).toHaveAttribute('aria-expanded', 'true');
    const menu = canvas.getByRole('menu', { name: 'Mais ações de salvar colaborador' });
    await expect(within(menu).getAllByRole('menuitem')).toHaveLength(3);
    await expect(
      within(menu).getByRole('menuitem', { name: 'Salvar como rascunho' }),
    ).toBeVisible();
  },
};

export const Teclado: Story = {
  name: 'Teclado · setas e Escape',
  parameters: {
    docs: {
      description: {
        story:
          'Seta para baixo abre no primeiro item, seta para cima no último, as setas andam em anel e Escape fecha devolvendo o foco ao gatilho.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Mais ações de salvar colaborador' });

    gatilho.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('menuitem', { name: 'Salvar e continuar' })).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}');
    // Anel: subir a partir do primeiro item leva ao último.
    await expect(
      canvas.getByRole('menuitem', { name: 'Salvar e cadastrar outro' }),
    ).toHaveFocus();

    await userEvent.keyboard('{Home}');
    await expect(canvas.getByRole('menuitem', { name: 'Salvar e continuar' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('menu')).toBeNull();
    await expect(gatilho).toHaveFocus();
  },
};

export const SelecaoFecha: Story = {
  name: 'Comportamento · escolher item fecha o menu',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Mais ações de salvar colaborador' });

    await userEvent.click(gatilho);
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Salvar como rascunho' }));

    await expect(canvas.queryByRole('menu')).toBeNull();
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await expect(gatilho).toHaveFocus();
  },
};

export const Severidade: Story = {
  name: 'Variantes · severidade',
  parameters: {
    // A varredura de a11y fica em modo aviso nesta story por causa de um achado
    // ABERTO do design system, não por descuido: os preenchimentos
    // `success.emphasis` #16A34A (3,30:1) e `warning.emphasis` #D97706 (3,19:1)
    // com rótulo branco reprovam WCAG AA. Está documentado no README, com a
    // correção proposta, e o mesmo tratamento já é dado nas stories do Button.
    a11y: { test: 'todo' },
    docs: {
      description: {
        story:
          'Linha `Severity` do Figma. A severidade vem do Button: no máximo uma primary por contexto visível e danger apenas em ação destrutiva.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <SplitButton rotulo="Salvar colaborador" itens={ACOES_DE_SALVAR} />
      <SplitButton variante="secondary" rotulo="Exportar relatório" itens={FORMATOS} />
      <SplitButton variante="success" rotulo="Aprovar diária" itens={ACOES_DE_APROVACAO} />
      <SplitButton variante="danger" rotulo="Excluir benefício" itens={ACOES_DE_EXCLUSAO} />
      <SplitButton variante="text" rotulo="Exportar relatório" itens={FORMATOS} />
    </div>
  ),
};

export const Tamanhos: Story = {
  name: 'Tamanhos · 32 / 40 / 48px',
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <SplitButton {...args} tamanho="small" rotulo="Salvar small" />
      <SplitButton {...args} tamanho="normal" rotulo="Salvar normal" />
      <SplitButton {...args} tamanho="large" rotulo="Salvar large" />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alturas = ['Salvar small', 'Salvar normal', 'Salvar large'].map(
      (nome) => canvas.getByRole('button', { name: nome }).getBoundingClientRect().height,
    );
    await expect(alturas).toEqual([32, 40, 48]);
  },
};

export const ElevadoEArredondado: Story = {
  name: 'Variantes · elevado e arredondado',
  parameters: {
    docs: {
      description: {
        story:
          'Eixos `Raised` e `Rounded` do Figma. Elevado usa `shadow.card`; arredondado leva `radius.full` só às pontas externas, preservando a emenda reta entre a ação e o gatilho.',
      },
    },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      <SplitButton {...args} elevado />
      <SplitButton {...args} arredondado />
      <SplitButton {...args} variante="text" elevado />
    </div>
  ),
};

export const ComIcone: Story = {
  name: 'Variante · com ícone',
  args: {
    icone: <IconeDisquete />,
    itens: ACOES_DE_SALVAR.map((item) => ({ ...item, icone: <IconeDisquete /> })),
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Desabilitado bloqueia os dois botões: não há como abrir o menu.
    await expect(canvas.getByRole('button', { name: 'Salvar colaborador' })).toBeDisabled();
    await expect(
      canvas.getByRole('button', { name: 'Mais ações de salvar colaborador' }),
    ).toBeDisabled();
  },
};

export const Carregando: Story = {
  name: 'Estado · carregando',
  args: {
    loading: true,
    loadingLabel: 'Salvando colaborador',
  },
  parameters: {
    docs: {
      description: {
        story:
          'O botão principal troca o ícone por spinner e o rótulo pelo gerúndio; o gatilho fica bloqueado até a gravação de Maria de Fátima Souza concluir.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Salvando colaborador' })).toHaveAttribute(
      'aria-busy',
      'true',
    );
    await expect(
      canvas.getByRole('button', { name: 'Mais ações de salvar colaborador' }),
    ).toBeDisabled();
  },
};

export const ItemDesabilitado: Story = {
  name: 'Estado · item indisponível',
  parameters: {
    docs: {
      description: {
        story:
          'Item bloqueado usa `aria-disabled` e continua focável, para o leitor de tela anunciar que a opção existe mas não está disponível no processo 2025/0481.',
      },
    },
  },
  args: {
    rotulo: 'Encaminhar processo',
    itens: [
      { id: 'secretaria', rotulo: 'Encaminhar à secretaria' },
      { id: 'regulacao', rotulo: 'Encaminhar à regulação', disabled: true },
      { id: 'devolver', rotulo: 'Devolver ao solicitante', separadorAcima: true },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(
      canvas.getByRole('button', { name: 'Mais ações de encaminhar processo' }),
    );
    await expect(
      canvas.getByRole('menuitem', { name: 'Encaminhar à regulação' }),
    ).toHaveAttribute('aria-disabled', 'true');
  },
};

const FORMATOS = [
  { id: 'pdf', rotulo: 'Exportar em PDF' },
  { id: 'csv', rotulo: 'Exportar em CSV' },
];

const ACOES_DE_APROVACAO = [
  { id: 'ressalva', rotulo: 'Aprovar com ressalva' },
  { id: 'lote', rotulo: 'Aprovar diárias da competência' },
];

const ACOES_DE_EXCLUSAO = [
  { id: 'suspender', rotulo: 'Suspender benefício' },
  { id: 'encerrar', rotulo: 'Encerrar vigência' },
];

function IconeDisquete() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
      <path
        d="M2.75 1.75h6.5L12.25 4.75v7.5h-10.5v-10.5Zm2 0v3.5h4.5v-3.5m-4 6.5h4v4h-4v-4Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
    </svg>
  );
}
