import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Sidebar } from './Sidebar';

const IconePessoas = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" strokeLinecap="round" />
  </svg>
);

const IconeProcessos = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h8l5 5v13H6z" />
    <path d="M14 3v5h5" />
  </svg>
);

const SECOES = [
  {
    rotulo: 'Operação',
    itens: [
      { id: 'processos', rotulo: 'Processos', icone: IconeProcessos, contagem: 12 },
      {
        id: 'pessoas',
        rotulo: 'Pessoas',
        icone: IconePessoas,
        filhos: [
          { id: 'servidores', rotulo: 'Servidores' },
          { id: 'beneficios', rotulo: 'Benefícios' },
        ],
      },
    ],
  },
  {
    rotulo: 'Sistema',
    itens: [{ id: 'perfis', rotulo: 'Perfis de acesso' }],
  },
];

const meta = {
  title: 'Organismos/Navegação/Sidebar',
  component: Sidebar,
  tags: ['autodocs', 'organism', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Menu principal do App Shell: a moldura persistente de navegação dos sistemas internos Citiesoft, sempre visível enquanto o servidor público circula entre módulos. Spec: `03-components/navigation-sidebar-header.md` v2.0.0. Equivalente PrimeNG: `p-panelmenu` (grupos expansíveis) ou `p-menu` (lista simples sem sub-nível).',
          '',
          '**Quando usar**: em todo sistema interno Citiesoft com mais de um módulo navegável, e sempre que a hierarquia de navegação tiver 2 ou mais níveis com necessidade de acesso rápido e constante.',
          '',
          '**Quando não usar**: portal do cidadão com navegação linear simples (topnav ou breadcrumb); wizards e fluxos de etapas, onde a navegação lateral provoca saída acidental do fluxo; telas de login, erro ou manutenção.',
          '',
          '**Por que organismo, e não molécula**: a Sidebar é chrome de aplicação, não um elemento de uma tarefa. Agrupa itens em seções, mantém estado de sub-itens expansíveis, carrega o skip link do documento, tem variante colapsada icon-only e aplica regra de permissão: item sem permissão fica ausente do DOM, nunca apenas oculto por CSS, para não expor a existência de funcionalidade não autorizada. Breadcrumb e Stepper, ao lado, resolvem uma tarefa única cada um e por isso permanecem como moléculas.',
          '',
          '**Sidebar ou Menubar?** Sidebar é a navegação principal do sistema. Menubar serve apenas a navegação horizontal secundária dentro de um módulo, com até 6 itens de raiz e no máximo 2 níveis, e nunca substitui a Sidebar em sistemas com muitos módulos.',
        ].join('\n'),
      },
    },
  },
  args: {
    secoes: SECOES,
    ativo: 'processos',
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Menu: Story = {
  name: 'Sidebar · expandida',
  render: () => <Sidebar secoes={SECOES} ativo="processos" />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('navigation', { name: 'Menu principal' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Processos/ })).toHaveAttribute(
      'aria-current',
      'page',
    );
    // Skip link é o primeiro elemento do DOM da navegação.
    await expect(canvas.getByRole('link', { name: 'Pular para o conteúdo' })).toBeInTheDocument();
  },
};

export const Fixa: Story = {
  name: 'Sidebar · fixa (shell)',
  parameters: {
    docs: {
      description: {
        story:
          'Navegação de shell do kit, medida no Sismental: 257px, fundo `sidebar`, item de 32 com fundo `sidebar-accent` no ativo. Cartão de contexto no topo e item ancorado no rodapé.',
      },
    },
  },
  render: () => (
    <Sidebar
      secoes={SECOES}
      ativo="processos"
      variante="fixa"
      cabecalho={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: 'var(--citie-accent)',
              color: 'var(--citie-accent-foreground)',
            }}
            aria-hidden="true"
          >
            {IconePessoas}
          </span>
          <span style={{ fontSize: 14, fontWeight: 500 }}>CAPS AD III</span>
        </div>
      }
      rodape={
        <button
          type="button"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '8px 12px',
            background: 'none',
            border: 'none',
            color: 'var(--citie-danger-foreground)',
            cursor: 'pointer',
          }}
        >
          Sair
        </button>
      }
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('navigation', { name: 'Menu principal' })).toBeVisible();
    await expect(canvas.getByText('CAPS AD III')).toBeVisible();
    await expect(canvas.getByRole('button', { name: 'Sair' })).toBeVisible();
  },
};

export const MenuColapsado: Story = {
  name: 'Sidebar · colapsada',
  parameters: {
    docs: {
      description: {
        story:
          'Em modo colapsado o ícone sozinho é ambíguo, então cada item mantém nome acessível e tooltip.',
      },
    },
  },
  render: () => <Sidebar secoes={SECOES} ativo="processos" colapsada />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByRole('button', { name: 'Processos' });
    await expect(item).toHaveAttribute('title', 'Processos');
  },
};
