import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { TieredMenu, type ItemDoTieredMenu } from './TieredMenu';

function IconePasta() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M1.5 3.5h3.5l1 1.5h6.5v6a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-7.5z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconePlanilha() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <rect
        x="1.75"
        y="2"
        width="10.5"
        height="10"
        rx="1"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path d="M1.75 5.5h10.5M5.5 5.5V12" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

const RELATORIOS: ItemDoTieredMenu[] = [
  {
    id: 'solicitacoes',
    label: 'Solicitações de TFD',
    icone: <IconePasta />,
    itens: [
      { id: 'analise', label: 'Em análise' },
      { id: 'autorizadas', label: 'Autorizadas' },
      { id: 'indeferidas', label: 'Indeferidas' },
    ],
  },
  {
    id: 'diarias',
    label: 'Diárias',
    icone: <IconePasta />,
    itens: [
      {
        id: 'competencia',
        label: 'Por competência',
        itens: [
          { id: 'comp-2025', label: 'Competência 2025' },
          { id: 'comp-2024', label: 'Competência 2024' },
        ],
      },
      { id: 'servidor', label: 'Por servidor' },
      { id: 'secretaria', label: 'Por secretaria' },
    ],
  },
  {
    id: 'passagens',
    label: 'Passagens emitidas',
    icone: <IconePasta />,
    separadorAcima: true,
  },
  {
    id: 'auditoria',
    label: 'Trilha de auditoria',
    icone: <IconePasta />,
    disabled: true,
  },
  {
    id: 'exportar',
    label: 'Exportar CSV do período',
    icone: <IconePlanilha />,
    separadorAcima: true,
  },
];

const meta = {
  title: 'Organismos/Menus/TieredMenu',
  component: TieredMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Menu com submenus em cascata, um painel por nível. Origem: Figma CitieOne, página ❖ TieredMenu (`tieredmenu` com Level 0 | 1 | 2, `tieredmenu-item` com State Idle | Hover | Focus | Active mais Show Icon e Show Submenu Icon, `tieredmenu-popup` com Menu True | False e `tieredmenu-separator`). Equivalente PrimeNG: `p-tieredMenu`. Cada nível é um `role="menu"` próprio: seta direita abre o submenu e foca o primeiro item, seta esquerda volta ao item pai, cima e baixo circulam no nível, Escape fecha tudo.',
          '',
          '**O padrão do DS Citiesoft para lista de comandos é o `Menu`, de um nível só.** O',
          'TieredMenu é exceção, para quando os comandos têm de fato uma hierarquia de duas ou três',
          'camadas que o usuário reconhece do próprio domínio: relatórios agrupados por assunto e',
          'depois por competência, por exemplo. Cada nível a mais é um painel que se abre por cima',
          'do anterior e cobre a tela atrás.',
          '',
          '**Quando não usar:** menos de sete comandos ou um nível só, caso do `Menu`; navegação',
          'permanente entre módulos do sistema, papel do `Menubar` na horizontal e do `PanelMenu`',
          'na coluna lateral, que mantém o caminho aberto e visível enquanto o servidor trabalha;',
          'catálogo largo de destinos que precisa ser visto de uma vez, com colunas e títulos de',
          'seção, papel do `MegaMenu`; ações sobre a linha ou o registro sob o cursor, papel do',
          '`ContextMenu`; escolha de um valor que vai ser gravado no processo, que é campo de',
          'formulário e pede `Select`, `CascadeSelect` ou `TreeSelect`, porque menu não guarda',
          'seleção nem mostra o que está escolhido; e passo a passo de um processo, papel do',
          '`Stepper`.',
          '',
          'Peso B2G: em cascata, o rótulo do nível anterior fica coberto assim que o submenu abre,',
          'então quem usa a tela de forma esporádica perde a referência de onde está. Acima de três',
          'níveis, prefira uma página de índice de relatórios com títulos de seção, que fica',
          'inteira na tela, é lida por leitor de tela na ordem natural e sobrevive ao zoom de 200%',
          'exigido pelo e-MAG e pela WCAG 2.2 AA.',
        ].join('\n'),
      },
    },
  },
  args: { itens: RELATORIOS, ariaLabel: 'Relatórios' },
} satisfies Meta<typeof TieredMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Nivel0: Story = {
  name: 'Level 0 · painel raiz',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('menu', { name: 'Relatórios' })).toBeVisible();
    await expect(canvas.getAllByRole('menuitem')).toHaveLength(5);
    await expect(canvas.getByRole('menuitem', { name: 'Diárias' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    // Item folha não anuncia submenu.
    await expect(canvas.getByRole('menuitem', { name: 'Passagens emitidas' })).not.toHaveAttribute(
      'aria-haspopup',
    );
  },
};

export const Nivel1: Story = {
  name: 'Level 1 · submenu aberto',
  parameters: {
    docs: {
      description: { story: 'Acionar um item com seta abre o segundo painel ao lado dele.' },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('menuitem', { name: 'Diárias' }));

    await waitFor(() => expect(canvas.getByRole('menu', { name: 'Diárias' })).toBeVisible());
    await expect(canvas.getByRole('menuitem', { name: 'Diárias' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(canvas.getByRole('menuitem', { name: 'Por servidor' })).toBeVisible();
  },
};

export const Nivel2: Story = {
  name: 'Level 2 · terceiro nível em cascata',
  parameters: {
    docs: {
      description: {
        story:
          'Relatórios → Diárias → Por competência: três painéis simultâneos, cada um com seu próprio `role="menu"`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('menuitem', { name: 'Diárias' }));
    await userEvent.click(canvas.getByRole('menuitem', { name: 'Por competência' }));

    await expect(canvas.getAllByRole('menu')).toHaveLength(3);
    await waitFor(() =>
      expect(canvas.getByRole('menu', { name: 'Por competência' })).toBeVisible(),
    );
    await expect(canvas.getByRole('menuitem', { name: 'Competência 2025' })).toBeVisible();
  },
};

export const Separador: Story = {
  name: 'Variante · separador e ícones',
  parameters: {
    docs: {
      description: {
        story:
          'O `tieredmenu-separator` agrupa relatórios operacionais, auditoria e exportação dentro do mesmo painel.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('separator')).toHaveLength(2);
  },
};

export const Desabilitado: Story = {
  name: 'State · item desabilitado',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByRole('menuitem', { name: 'Trilha de auditoria' });

    await expect(item).toHaveAttribute('aria-disabled', 'true');
    await userEvent.click(item);
    // Item desabilitado não abre nada nem muda o painel raiz.
    await expect(canvas.getAllByRole('menu')).toHaveLength(1);
  },
};

export const Teclado: Story = {
  name: 'A11y · teclado em cascata',
  parameters: {
    docs: {
      description: {
        story:
          'Roving tabindex por nível: baixo circula no painel atual, direita entra no submenu e foca o primeiro item, esquerda fecha e devolve o foco ao item pai, Escape fecha tudo.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    canvas.getByRole('menuitem', { name: 'Solicitações de TFD' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(canvas.getByRole('menuitem', { name: 'Diárias' })).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(canvas.getByRole('menuitem', { name: 'Por competência' })).toHaveFocus();
    await waitFor(() => expect(canvas.getByRole('menu', { name: 'Diárias' })).toBeVisible());

    await userEvent.keyboard('{ArrowLeft}');
    await expect(canvas.getByRole('menuitem', { name: 'Diárias' })).toHaveFocus();
    await expect(canvas.queryByRole('menu', { name: 'Diárias' })).toBeNull();

    await userEvent.keyboard('{ArrowRight}{Escape}');
    await expect(canvas.getAllByRole('menu')).toHaveLength(1);
  },
};

export const Popup: Story = {
  name: 'Menu · popup com gatilho',
  args: { popup: true, rotuloDoGatilho: 'Abrir relatórios' },
  parameters: {
    docs: {
      description: {
        story:
          'Variante Menu = True do `tieredmenu-popup`: começa fechado, abre pelo botão e devolve o foco a ele no Escape.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Abrir relatórios' });

    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.queryByRole('menu')).toBeNull();

    await userEvent.click(gatilho);
    await expect(gatilho).toHaveAttribute('aria-expanded', 'true');
    await expect(canvas.getByRole('menuitem', { name: 'Solicitações de TFD' })).toHaveFocus();

    await userEvent.keyboard('{Escape}');
    await expect(canvas.queryByRole('menu')).toBeNull();
    await expect(gatilho).toHaveFocus();
  },
};
