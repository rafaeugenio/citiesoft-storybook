import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Menu, type ItemDeMenu } from './Menu';

const IconeOlho = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M1.5 8s2.4-4 6.5-4 6.5 4 6.5 4-2.4 4-6.5 4-6.5-4-6.5-4Z"
      stroke="currentColor"
      strokeWidth="1.3"
    />
    <circle cx="8" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.3" />
  </svg>
);

const IconeEncaminhar = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 8h11M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const IconeParecer = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M4 2h5l3 3v9H4V2Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" />
    <path d="M6 8h4M6 10.5h4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
  </svg>
);

const IconeLixeira = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5 5 13.5h6l.5-9"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ACOES_DO_PROCESSO: ItemDeMenu[] = [
  { tipo: 'acao', id: 'detalhe', rotulo: 'Ver detalhe', icone: <IconeOlho /> },
  {
    tipo: 'acao',
    id: 'encaminhar',
    rotulo: 'Encaminhar à regulação',
    icone: <IconeEncaminhar />,
  },
  { tipo: 'acao', id: 'parecer', rotulo: 'Emitir parecer', icone: <IconeParecer /> },
  { tipo: 'separador', id: 'divisor' },
  {
    tipo: 'acao',
    id: 'excluir',
    rotulo: 'Excluir processo',
    icone: <IconeLixeira />,
    destrutivo: true,
  },
];

const meta = {
  title: 'Navegação/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Lista de ações em orientação vertical. Origem: Figma CitieOne, página ❖ Menu — `menu` (Type: Basic | Popup, Show Menu, Show Button), `menu-item` (Show Icon, Icon, Text, State: Idle | Hover | Focus), `menu-submenu-label` e `menu-separator`. Item com atalho, item desabilitado e item destrutivo são extensões da marca, não desenhadas no arquivo. Equivalente PrimeNG: `p-menu`.',
      },
    },
  },
  args: {
    label: 'Ações do processo 2025/0481',
    itens: ACOES_DO_PROCESSO,
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: 'Type · basic',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menu = canvas.getByRole('menu', { name: 'Ações do processo 2025/0481' });

    await expect(menu).toBeVisible();
    await expect(canvas.getAllByRole('menuitem')).toHaveLength(4);
    await expect(canvas.getByRole('separator')).toBeVisible();
  },
};

export const Popup: Story = {
  name: 'Type · popup',
  args: { modo: 'popup', rotuloDoGatilho: 'Ações do processo' },
  parameters: {
    docs: {
      description: {
        story:
          'Começa fechado, com o gatilho visível. O botão declara `aria-haspopup="menu"` e o `aria-expanded` acompanha o estado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Ações do processo' });

    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await userEvent.click(gatilho);

    await expect(gatilho).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('menu')).toBeVisible();
    // O foco entra no primeiro item assim que o painel monta.
    await expect(canvas.getByRole('menuitem', { name: 'Ver detalhe' })).toHaveFocus();
  },
};

export const ComAtalho: Story = {
  name: 'menu-item · com atalho',
  args: {
    itens: [
      { tipo: 'acao', id: 'detalhe', rotulo: 'Ver detalhe', icone: <IconeOlho />, atalho: 'Ctrl+D' },
      {
        tipo: 'acao',
        id: 'parecer',
        rotulo: 'Emitir parecer',
        icone: <IconeParecer />,
        atalho: 'Ctrl+P',
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('menuitem', { name: /Ver detalhe/ })).toHaveTextContent('Ctrl+D');
  },
};

export const SemIcone: Story = {
  name: 'menu-item · Show Icon desligado',
  args: {
    itens: [
      { tipo: 'acao', id: 'detalhe', rotulo: 'Ver detalhe' },
      { tipo: 'acao', id: 'encaminhar', rotulo: 'Encaminhar à regulação' },
      { tipo: 'acao', id: 'parecer', rotulo: 'Emitir parecer' },
    ],
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getAllByRole('menuitem')).toHaveLength(3);
  },
};

export const ComGrupos: Story = {
  name: 'menu-submenu-label · grupos',
  args: {
    itens: [
      {
        tipo: 'grupo',
        id: 'consulta',
        rotulo: 'Consulta',
        itens: [{ tipo: 'acao', id: 'detalhe', rotulo: 'Ver detalhe', icone: <IconeOlho /> }],
      },
      { tipo: 'separador', id: 'divisor' },
      {
        tipo: 'grupo',
        id: 'tramitacao',
        rotulo: 'Tramitação',
        itens: [
          {
            tipo: 'acao',
            id: 'encaminhar',
            rotulo: 'Encaminhar à regulação',
            icone: <IconeEncaminhar />,
          },
          { tipo: 'acao', id: 'parecer', rotulo: 'Emitir parecer', icone: <IconeParecer /> },
        ],
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'O cabeçalho vira `role="group"` com `aria-labelledby`: um filho sem papel dentro do `role="menu"` quebraria `aria-required-parent` dos itens.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('group', { name: 'Consulta' })).toBeVisible();
    await expect(canvas.getByRole('group', { name: 'Tramitação' })).toBeVisible();
  },
};

export const Desabilitado: Story = {
  name: 'State · item desabilitado',
  args: {
    itens: [
      { tipo: 'acao', id: 'detalhe', rotulo: 'Ver detalhe', icone: <IconeOlho /> },
      {
        tipo: 'acao',
        id: 'parecer',
        rotulo: 'Emitir parecer',
        icone: <IconeParecer />,
        disabled: true,
      },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'O item desabilitado continua focável e anunciado por `aria-disabled`, mas Enter e clique não acionam.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByRole('menuitem', { name: 'Emitir parecer' });

    await expect(item).toHaveAttribute('aria-disabled', 'true');
    item.focus();
    await expect(item).toHaveFocus();
  },
};

export const RovingTabindex: Story = {
  name: 'A11y · roving tabindex',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const itens = canvas.getAllByRole('menuitem');

    const focaveis = itens.filter((item) => item.getAttribute('tabindex') === '0');
    await expect(focaveis).toHaveLength(1);
    await expect(focaveis[0]).toHaveAccessibleName('Ver detalhe');
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'A11y · setas, Home e End',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByRole('menuitem', { name: 'Ver detalhe' }).focus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('menuitem', { name: 'Encaminhar à regulação' })).toHaveFocus();

    await userEvent.keyboard('{End}');
    await expect(canvas.getByRole('menuitem', { name: 'Excluir processo' })).toHaveFocus();

    // Circula da última para a primeira.
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('menuitem', { name: 'Ver detalhe' })).toHaveFocus();

    await userEvent.keyboard('{Home}');
    await expect(canvas.getByRole('menuitem', { name: 'Ver detalhe' })).toHaveFocus();
  },
};

export const EscapeFechaPopup: Story = {
  name: 'A11y · Escape devolve o foco ao gatilho',
  args: { modo: 'popup', rotuloDoGatilho: 'Ações do processo' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Ações do processo' });

    await userEvent.click(gatilho);
    await userEvent.keyboard('{Escape}');

    await expect(canvas.queryByRole('menu')).toBeNull();
    await expect(gatilho).toHaveFocus();
  },
};
