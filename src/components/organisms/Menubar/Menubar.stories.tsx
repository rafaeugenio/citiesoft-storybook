import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { Button } from '../../atoms/Button/Button';
import { Menubar, type ItemDeMenubarProps } from './Menubar';

const MODULOS: ItemDeMenubarProps[] = [
  {
    id: 'pessoas',
    rotulo: 'Pessoas',
    submenu: [
      { id: 'servidores', rotulo: 'Servidores' },
      { id: 'beneficiarios', rotulo: 'Beneficiários' },
      { id: 'secretarias', rotulo: 'Secretarias' },
    ],
  },
  {
    id: 'processos',
    rotulo: 'Processos',
    submenu: [
      { id: 'em-analise', rotulo: 'Em análise' },
      { id: 'tfd', rotulo: 'Solicitações de TFD' },
      {
        id: 'arquivados',
        rotulo: 'Arquivados',
        submenu: [
          { id: 'arquivados-2025', rotulo: 'Competência 2025' },
          { id: 'arquivados-2024', rotulo: 'Competência 2024' },
        ],
      },
    ],
  },
  {
    id: 'lancamentos',
    rotulo: 'Lançamentos',
    submenu: [
      { id: 'diarias', rotulo: 'Diárias' },
      { id: 'beneficios', rotulo: 'Benefícios' },
      { id: 'folha', rotulo: 'Folha de competência' },
    ],
  },
  {
    id: 'relatorios',
    rotulo: 'Relatórios',
    submenu: [
      { id: 'por-secretaria', rotulo: 'Gastos por secretaria' },
      { id: 'auditoria', rotulo: 'Trilha de auditoria' },
    ],
  },
  { id: 'sistema', rotulo: 'Sistema' },
];

const meta = {
  title: 'Organismos/Menus/Menubar',
  component: Menubar,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Barra horizontal de módulos do sistema. Página do Figma CitieOne `6738:52937` (❖ Menubar). Variantes do arquivo: `menubar` com Submenu False|True e `menubar-item` com State Idle|Hover|Focus|Active mais Show Icon e Show Submenu Icon. Equivalente PrimeNG: `p-menubar`. Não confundir com a Sidebar de `Navigation`, que é o menu lateral do produto.',
      },
    },
  },
  args: { label: 'Módulos do sistema', itens: MODULOS },
} satisfies Meta<typeof Menubar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fechada: Story = {
  name: 'Estado · submenu fechado',
  parameters: {
    docs: {
      description: {
        story:
          'Variante Submenu = False do Figma. Todo item com filhos anuncia `aria-haspopup="menu"` e `aria-expanded="false"` enquanto está fechado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('menubar', { name: 'Módulos do sistema' });

    await expect(barra).toHaveAttribute('aria-orientation', 'horizontal');
    await expect(canvas.getAllByRole('menuitem')).toHaveLength(5);
    await expect(canvas.getByRole('menuitem', { name: /Pessoas/ })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
  },
};

export const SubmenuAberto: Story = {
  name: 'Estado · submenu aberto',
  parameters: {
    docs: {
      description: {
        story:
          'Variante Submenu = True. O suspenso é um `role="menu"` nomeado pelo módulo, com os comandos em `role="menuitem"`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('menuitem', { name: /Lançamentos/ }));

    const submenu = await canvas.findByRole('menu', { name: 'Lançamentos' });
    // A entrada do suspenso parte de opacity 0; espera o fim da animação.
    await waitFor(() => expect(submenu).toBeVisible());
    await expect(within(submenu).getByRole('menuitem', { name: 'Diárias' })).toBeVisible();
    await expect(canvas.getByRole('menuitem', { name: /Lançamentos/ })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  },
};

export const NavegacaoPorTeclado: Story = {
  name: 'A11y · navegação por teclado',
  parameters: {
    docs: {
      description: {
        story:
          'Só um módulo fica tabulável (roving tabindex). Setas esquerda e direita andam na barra em anel, seta para baixo abre o submenu e foca o primeiro comando, Escape fecha e devolve o foco ao módulo.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const pessoas = canvas.getByRole('menuitem', { name: /Pessoas/ });

    await userEvent.tab();
    await expect(pessoas).toHaveFocus();
    await expect(canvas.getByRole('menuitem', { name: /Processos/ })).toHaveAttribute(
      'tabindex',
      '-1',
    );

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('menuitem', { name: /Processos/ })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    const submenu = await canvas.findByRole('menu', { name: 'Processos' });
    await expect(within(submenu).getByRole('menuitem', { name: 'Em análise' })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    await expect(
      within(submenu).getByRole('menuitem', { name: 'Solicitações de TFD' }),
    ).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
    await expect(canvas.getByRole('menuitem', { name: /Processos/ })).toHaveFocus();
  },
};

export const SubmenuAninhado: Story = {
  name: 'Variante · submenu aninhado',
  parameters: {
    docs: {
      description: {
        story:
          'O item com a seta `angle-right` do Figma abre um segundo nível. Seta para a direita entra no aninhado; nos itens sem filhos, ela pula para o próximo módulo.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('menuitem', { name: /Processos/ }));
    const submenu = await canvas.findByRole('menu', { name: 'Processos' });
    await userEvent.click(within(submenu).getByRole('menuitem', { name: /Arquivados/ }));

    const aninhado = await canvas.findByRole('menu', { name: 'Arquivados' });
    await waitFor(() =>
      expect(within(aninhado).getByRole('menuitem', { name: 'Competência 2025' })).toBeVisible(),
    );
  },
};

export const ComLogotipoEAcoes: Story = {
  name: 'Composição · logotipo e ações',
  args: {
    inicio: 'Citiesoft',
    fim: (
      <>
        <Button variant="text" size="small">
          Notificações
        </Button>
        <Button variant="secondary" size="small">
          Maria de Fátima Souza
        </Button>
      </>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'As áreas de logotipo e de ações ficam fora do `role="menubar"`, para que o leitor de tela anuncie só os módulos como itens da barra.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('menubar', { name: 'Módulos do sistema' });

    await expect(within(barra).getAllByRole('menuitem')).toHaveLength(5);
    await expect(canvas.getByRole('button', { name: 'Notificações' })).toBeVisible();
  },
};

export const ItemDesabilitado: Story = {
  name: 'Estado · módulo indisponível',
  args: {
    itens: [
      ...MODULOS.slice(0, 4),
      { id: 'sistema', rotulo: 'Sistema', disabled: true, submenu: [{ id: 'perfis', rotulo: 'Perfis de acesso' }] },
    ],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Módulo sem permissão usa `aria-disabled` em vez de `disabled`: continua alcançável pelas setas, comunica o estado e não abre o submenu.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const sistema = canvas.getByRole('menuitem', { name: /Sistema/ });

    await expect(sistema).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(sistema);
    await expect(canvas.queryByRole('menu')).not.toBeInTheDocument();
  },
};
