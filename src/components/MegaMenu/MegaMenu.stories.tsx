import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { MegaMenu, type ItemDeTopo } from './MegaMenu';

const MODULOS: ItemDeTopo[] = [
  {
    id: 'pessoas',
    rotulo: 'Pessoas',
    colunas: [
      {
        id: 'servidores',
        titulo: 'Servidores',
        itens: [
          { id: 'cadastro', rotulo: 'Cadastro de servidor' },
          { id: 'vinculos', rotulo: 'Vínculos e matrículas' },
          { id: 'ferias', rotulo: 'Férias e afastamentos' },
        ],
      },
      {
        id: 'beneficios',
        titulo: 'Benefícios',
        itens: [
          { id: 'concessao', rotulo: 'Concessão de benefício' },
          { id: 'vencimentos', rotulo: 'Vencimentos a renovar', descricao: '12 vencem em julho' },
          { id: 'historico', rotulo: 'Histórico por servidor' },
        ],
      },
      {
        id: 'lotacoes',
        titulo: 'Lotações',
        itens: [
          { id: 'secretarias', rotulo: 'Secretarias' },
          { id: 'unidades', rotulo: 'Unidades de saúde' },
          { id: 'remanejamento', rotulo: 'Remanejamento' },
        ],
      },
    ],
  },
  {
    id: 'processos',
    rotulo: 'Processos',
    colunas: [
      {
        id: 'tfd',
        titulo: 'TFD',
        itens: [
          { id: 'solicitacoes', rotulo: 'Solicitações de TFD' },
          { id: 'diarias', rotulo: 'Diárias e ajudas de custo' },
          { id: 'encerramento', rotulo: 'Encerramento de processo', descricao: 'Processo 2025/0481' },
        ],
      },
      {
        id: 'licitacao',
        titulo: 'Licitação',
        itens: [
          { id: 'editais', rotulo: 'Editais publicados' },
          { id: 'contratos', rotulo: 'Contratos vigentes' },
          { id: 'empenhos', rotulo: 'Empenhos por competência' },
        ],
      },
    ],
  },
  {
    id: 'relatorios',
    rotulo: 'Relatórios',
    colunas: [
      {
        id: 'gerenciais',
        titulo: 'Gerenciais',
        itens: [
          { id: 'folha', rotulo: 'Folha por secretaria' },
          { id: 'tfd-mensal', rotulo: 'TFD por competência' },
        ],
      },
      {
        id: 'auditoria',
        titulo: 'Auditoria',
        itens: [
          { id: 'trilha', rotulo: 'Trilha de alterações' },
          { id: 'acessos', rotulo: 'Acessos por perfil' },
        ],
      },
    ],
  },
];

const meta = {
  title: 'Navegação/MegaMenu',
  component: MegaMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Barra de módulos com painel de várias colunas agrupadas por categoria. Port da página `❖ MegaMenu` do Figma CitieOne (6738:52938). Variantes do arquivo: `Orientation` (Horizontal | Vertical) e `Overlay` (True | False) no set `megamenu`; `State` (Idle | Hover | Focus | Active), `Show Icon` e `Show Submenu Icon` no set `megamenu-item`. Equivalente PrimeNG: `p-megamenu`.',
      },
    },
  },
  args: {
    label: 'Menu de módulos',
    itens: MODULOS,
  },
} satisfies Meta<typeof MegaMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fechado: Story = {
  name: 'Estado · fechado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('menubar', { name: 'Menu de módulos' });
    await expect(barra).toHaveAttribute('aria-orientation', 'horizontal');

    const pessoas = canvas.getByRole('menuitem', { name: /Pessoas/ });
    await expect(pessoas).toHaveAttribute('aria-haspopup', 'true');
    await expect(pessoas).toHaveAttribute('aria-expanded', 'false');
    // Painel fechado não deixa item de coluna acessível.
    await expect(canvas.queryByRole('group')).toBeNull();
  },
};

export const PainelAberto: Story = {
  name: 'Estado · painel aberto',
  parameters: {
    docs: {
      description: {
        story:
          'O painel é um `role="menu"` e cada coluna um `role="group"` nomeado pelo próprio título. O título fica dentro do group, e não solto como filho direto do menu, onde ficaria sem papel válido.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pessoas = canvas.getByRole('menuitem', { name: /Pessoas/ });
    await userEvent.click(pessoas);

    await expect(pessoas).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getAllByRole('group')).toHaveLength(3);
    await expect(canvas.getByRole('group', { name: 'Benefícios' })).toBeVisible();
    await expect(canvas.getByRole('menuitem', { name: /Vencimentos a renovar/ })).toBeVisible();
  },
};

export const Vertical: Story = {
  name: 'Orientação · vertical',
  args: { orientacao: 'vertical' },
  parameters: {
    docs: {
      description: {
        story:
          'Na barra vertical o eixo de navegação inverte: seta para cima e para baixo andam na barra, e a seta para a direita entra no painel, que abre ao lado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('menubar', { name: 'Menu de módulos' });
    await expect(barra).toHaveAttribute('aria-orientation', 'vertical');

    const processos = canvas.getByRole('menuitem', { name: /Processos/ });
    processos.focus();
    await userEvent.keyboard('{ArrowRight}');

    await waitFor(async () => {
      await expect(canvas.getByRole('menuitem', { name: /Solicitações de TFD/ })).toHaveFocus();
    });
  },
};

export const Embutido: Story = {
  name: 'Overlay · painel embutido',
  args: { sobreposto: false, abertoInicial: 'processos' },
  parameters: {
    docs: {
      description: {
        story:
          '`Overlay: False` do Figma: o painel entra no fluxo e empurra o conteúdo abaixo, em vez de flutuar sobre ele. Útil em página de índice de módulo, onde o menu é o próprio conteúdo.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'TFD' })).toBeVisible();
    await expect(canvas.getByRole('group', { name: 'Licitação' })).toBeVisible();
    await expect(canvas.getByRole('menuitem', { name: /Processos/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  },
};

export const TecladoNaBarra: Story = {
  name: 'Teclado · setas na barra',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pessoas = canvas.getByRole('menuitem', { name: /Pessoas/ });
    pessoas.focus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('menuitem', { name: /Processos/ })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('menuitem', { name: /Relatórios/ })).toHaveFocus();

    // A barra é circular: da última posição a seta volta para a primeira.
    await userEvent.keyboard('{ArrowRight}');
    await expect(pessoas).toHaveFocus();

    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('menuitem', { name: /Relatórios/ })).toHaveFocus();
  },
};

export const TecladoNoPainel: Story = {
  name: 'Teclado · entrar no painel e sair com Escape',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pessoas = canvas.getByRole('menuitem', { name: /Pessoas/ });
    pessoas.focus();

    await userEvent.keyboard('{ArrowDown}');
    await waitFor(async () => {
      await expect(canvas.getByRole('menuitem', { name: /Cadastro de servidor/ })).toHaveFocus();
    });

    // Dentro do painel, baixo anda na coluna e direita troca de coluna.
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('menuitem', { name: /Vínculos e matrículas/ })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('menuitem', { name: /Vencimentos a renovar/ })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('group')).toBeNull();
    await expect(pessoas).toHaveFocus();
  },
};
