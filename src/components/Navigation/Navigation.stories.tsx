import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Breadcrumb, Sidebar, Stepper } from './Navigation';

const meta = {
  title: 'Layout/Navegação',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Breadcrumb, Stepper e Sidebar. Specs: `03-components/breadcrumb-stepper.md` e `navigation-sidebar-header.md`, ambas v2.0.0. Equivalente PrimeNG: `p-breadcrumb`, `p-steps`, `p-panelmenu`.',
      },
    },
  },
  args: {
    niveis: [
      { rotulo: 'Início', href: '#inicio' },
      { rotulo: 'Processos', href: '#processos' },
      { rotulo: '2025/0481' },
    ],
  },
} satisfies Meta<typeof Breadcrumb>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Trilha: Story = {
  name: 'Breadcrumb · padrão',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('navigation', { name: 'Trilha de navegação' })).toBeVisible();
    // O item atual é página corrente, nunca link.
    const atual = canvas.getByText('2025/0481');
    await expect(atual).toHaveAttribute('aria-current', 'page');
    await expect(canvas.queryByRole('link', { name: '2025/0481' })).toBeNull();
  },
};

export const TrilhaColapsada: Story = {
  name: 'Breadcrumb · colapsada',
  args: {
    niveis: [
      { rotulo: 'Início', href: '#inicio' },
      { rotulo: 'Pessoas', href: '#pessoas' },
      { rotulo: 'Servidores', href: '#servidores' },
      { rotulo: 'Maria de Fátima Souza', href: '#maria' },
      { rotulo: 'Benefícios' },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Acima de 4 níveis os do meio colapsam. A raiz do módulo nunca é omitida, mesmo em trilha longa.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('link', { name: 'Início' })).toBeVisible();
    await expect(canvas.getByText('Benefícios')).toHaveAttribute('aria-current', 'page');
  },
};

export const Passos: Story = {
  name: 'Stepper · horizontal linear',
  render: () => (
    <Stepper
      label="Etapas da solicitação"
      etapas={[
        { id: '1', rotulo: 'Identificação', sublabel: 'Dados do servidor', estado: 'concluida' },
        { id: '2', rotulo: 'Deslocamento', sublabel: 'Destino e período', estado: 'concluida' },
        { id: '3', rotulo: 'Documentos', sublabel: 'Laudo e comprovantes', estado: 'atual' },
        { id: '4', rotulo: 'Revisão', sublabel: 'Conferência final', estado: 'pendente' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('list', { name: 'Etapas da solicitação' })).toBeVisible();
    await expect(canvas.getByRole('button', { name: /Documentos/ })).toHaveAttribute(
      'aria-current',
      'step',
    );
    // No modo linear, a etapa futura não é alcançável.
    await expect(canvas.getByRole('button', { name: /Revisão/ })).toBeDisabled();
    // O estado vai por texto, não só por cor.
    await expect(canvas.getAllByText('(concluída)')).toHaveLength(2);
  },
};

export const PassosComErro: Story = {
  name: 'Stepper · etapa com erro',
  render: () => (
    <Stepper
      label="Etapas da solicitação"
      linear={false}
      etapas={[
        { id: '1', rotulo: 'Identificação', estado: 'concluida' },
        { id: '2', rotulo: 'Deslocamento', estado: 'erro' },
        { id: '3', rotulo: 'Documentos', estado: 'atual' },
      ]}
    />
  ),
};

export const PassosVerticais: Story = {
  name: 'Stepper · vertical compacto',
  render: () => (
    <Stepper
      label="Etapas da solicitação"
      orientacao="vertical"
      compacto
      etapas={[
        { id: '1', rotulo: 'Identificação', sublabel: 'Oculto no compacto', estado: 'concluida' },
        { id: '2', rotulo: 'Documentos', sublabel: 'Oculto no compacto', estado: 'atual' },
        { id: '3', rotulo: 'Revisão', estado: 'pendente' },
      ]}
    />
  ),
  play: async ({ canvasElement }) => {
    // O sublabel some no modo compacto.
    await expect(within(canvasElement).queryByText('Oculto no compacto')).toBeNull();
  },
};

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
