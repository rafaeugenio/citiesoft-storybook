import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, userEvent, waitFor, within } from 'storybook/test';
import { ContextMenu, type EntradaMenuContexto } from './ContextMenu';

/**
 * Toda story começa FECHADA. O menu abre pelo botão direito sobre a linha ou
 * pela alternativa de teclado (tecla de menu de contexto / Shift + F10), que é
 * como o servidor sem mouse chega às mesmas ações.
 */

const meta = {
  title: 'Organismos/Menus/ContextMenu',
  component: ContextMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Menu de contexto da linha de processo. Figma CitieOne, página `6738:52934`: `contextmenu` (painel), `contextmenu-item` (eixos Show Icon, Icon, Text, Show Submenu Icon e State Idle/Hover/Focus/Active) e `contextmenu-separator`. Equivalente PrimeNG: `p-contextmenu`. Atalho, ação destrutiva e item indisponível são inferência: o arquivo não os desenha, o produto precisa deles.\n\n**Quando não usar:** como único caminho para uma ação, porque o botão direito não é descoberto por quem abre a tela de forma esporádica e não existe em toque; toda entrada daqui precisa de um caminho visível equivalente, seja um `Átomos/Ações/Button` na linha, um `Moléculas/Ações/SplitButton` ou um `Organismos/Menus/Menu` no cabeçalho da listagem. A ação principal da tela também não pertence a este menu: ela merece botão em destaque, sempre à vista. Navegação permanente entre áreas do sistema é `Organismos/Menus/Menubar`, `Organismos/Menus/PanelMenu` ou `Organismos/Menus/TieredMenu`. Conteúdo de leitura, campo ou filtro dentro do painel exige `Moléculas/Overlay/Popover`, que abre como `dialog` e prende o foco; o papel `menu` daqui espera itens acionáveis e navegação por setas. E em `Organismos/Tabelas/Table` ou `Organismos/Coleções/DataView` com seleção múltipla, ação em lote fica em `Organismos/Layout/Toolbar` acima da lista, onde o alvo é único e visível para todos os registros marcados.',
      },
    },
  },
  args: { rotulo: 'Ações do processo 2025/0481', itens: [], children: null },
} satisfies Meta<typeof ContextMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const estiloLinha: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '140px 1fr 160px',
  gap: 16,
  alignItems: 'center',
  padding: '12px 16px',
  border: '1px solid var(--citie-border-default)',
  borderRadius: 'var(--citie-radius-md)',
  background: 'var(--citie-background-surface)',
  color: 'var(--citie-text-base)',
  fontFamily: 'var(--citie-font-ui)',
  fontSize: 'var(--citie-font-size-body-md)',
};

function LinhaProcesso({
  numero = '2025/0481',
  interessado = 'Maria de Fátima Souza',
  secretaria = 'Secretaria de Saúde',
}: {
  numero?: string;
  interessado?: string;
  secretaria?: string;
}) {
  return (
    <div style={estiloLinha}>
      <strong>{numero}</strong>
      <span>{interessado}</span>
      <span style={{ color: 'var(--citie-text-secondary)' }}>{secretaria}</span>
    </div>
  );
}

/** Área de respiro para o painel caber dentro do quadro da story. */
function Quadro({ children }: { children: ReactNode }) {
  return <div style={{ padding: 24, minHeight: 260 }}>{children}</div>;
}

const Icone = {
  abrir: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M14 3h7v7M21 3l-9 9M19 14v6H5V5h6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  encaminhar: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  baixar: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M12 4v11M7 11l5 5 5-5M5 20h14" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  excluir: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
};

const itensBasicos: EntradaMenuContexto[] = [
  { id: 'abrir', rotulo: 'Abrir processo', icone: Icone.abrir, atalho: 'Ctrl + O' },
  { id: 'encaminhar', rotulo: 'Encaminhar', icone: Icone.encaminhar },
  { id: 'anexos', rotulo: 'Baixar anexos', icone: Icone.baixar, atalho: 'Ctrl + B' },
  { id: 'sep-1', tipo: 'separador' },
  { id: 'excluir', rotulo: 'Excluir processo', icone: Icone.excluir, perigoso: true },
];

/** Abre o menu como o usuário de mouse abre: botão direito sobre a linha. */
async function abrirPorBotaoDireito(canvasElement: HTMLElement) {
  const alvo = canvasElement.querySelector<HTMLElement>('.citie-context-menu__alvo');
  await expect(alvo).not.toBeNull();
  fireEvent.contextMenu(alvo as HTMLElement, { clientX: 180, clientY: 120 });
  return alvo as HTMLElement;
}

export const BotaoDireito: Story = {
  name: 'Padrão · botão direito na linha',
  parameters: {
    docs: {
      description: {
        story:
          'O menu abre no ponto do cursor e traz as ações da linha, com ícone à esquerda e atalho à direita. O separador isola a ação destrutiva do resto.',
      },
    },
  },
  render: () => (
    <Quadro>
      <ContextMenu rotulo="Ações do processo 2025/0481" itens={itensBasicos}>
        <LinhaProcesso />
      </ContextMenu>
    </Quadro>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole('menu')).toBeNull();

    await abrirPorBotaoDireito(canvasElement);

    const menu = await canvas.findByRole('menu', { name: 'Ações do processo 2025/0481' });
    await expect(within(menu).getAllByRole('menuitem')).toHaveLength(4);
    await waitFor(() =>
      expect(within(menu).getByRole('menuitem', { name: /Abrir processo/ })).toHaveFocus(),
    );
    await expect(menu.querySelectorAll('[role="separator"]')).toHaveLength(1);
  },
};

export const Teclado: Story = {
  name: 'Teclado · Shift + F10 e setas',
  parameters: {
    docs: {
      description: {
        story:
          'Sem mouse: a linha recebe foco, Shift + F10 abre o menu ancorado nela, as setas circulam entre os itens e Escape fecha devolvendo o foco à linha.',
      },
    },
  },
  render: () => (
    <Quadro>
      <ContextMenu rotulo="Ações do processo 2025/0512" itens={itensBasicos}>
        <LinhaProcesso numero="2025/0512" interessado="João Batista Nunes" secretaria="Secretaria de Educação" />
      </ContextMenu>
    </Quadro>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const alvo = canvasElement.querySelector<HTMLElement>('.citie-context-menu__alvo') as HTMLElement;

    alvo.focus();
    await expect(alvo).toHaveFocus();

    await userEvent.keyboard('{Shift>}{F10}{/Shift}');
    const menu = await canvas.findByRole('menu');
    const itens = within(menu).getAllByRole('menuitem');
    await waitFor(() => expect(itens[0]).toHaveFocus());

    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(itens[1]).toHaveFocus());

    // Circula: da última volta para a primeira.
    await userEvent.keyboard('{End}');
    await waitFor(() => expect(itens[itens.length - 1]).toHaveFocus());
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(itens[0]).toHaveFocus());

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('menu')).toBeNull());
    await waitFor(() => expect(alvo).toHaveFocus());
  },
};

const itensComSubmenu: EntradaMenuContexto[] = [
  { id: 'abrir', rotulo: 'Abrir processo', icone: Icone.abrir, atalho: 'Ctrl + O' },
  {
    id: 'encaminhar',
    rotulo: 'Encaminhar',
    icone: Icone.encaminhar,
    submenu: [
      { id: 'saude', rotulo: 'Secretaria de Saúde' },
      { id: 'educacao', rotulo: 'Secretaria de Educação' },
      { id: 'fazenda', rotulo: 'Secretaria da Fazenda' },
    ],
  },
  { id: 'anexos', rotulo: 'Baixar anexos', icone: Icone.baixar, atalho: 'Ctrl + B' },
];

export const Submenu: Story = {
  name: 'Variante · submenu de secretarias',
  parameters: {
    docs: {
      description: {
        story:
          'Item com filhos mostra a seta do arquivo (`Show Submenu Icon`) e marca `aria-expanded`. Seta direita abre o segundo nível, seta esquerda volta e devolve o foco ao item pai.',
      },
    },
  },
  render: () => (
    <Quadro>
      <ContextMenu rotulo="Ações do processo 2025/0481" itens={itensComSubmenu}>
        <LinhaProcesso />
      </ContextMenu>
    </Quadro>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await abrirPorBotaoDireito(canvasElement);

    const menu = await canvas.findByRole('menu', { name: 'Ações do processo 2025/0481' });
    const encaminhar = within(menu).getByRole('menuitem', { name: /Encaminhar/ });
    await expect(encaminhar).toHaveAttribute('aria-expanded', 'false');
    // Só navega depois que o foco assentou no primeiro item.
    await waitFor(() => expect(within(menu).getAllByRole('menuitem')[0]).toHaveFocus());

    await userEvent.keyboard('{ArrowDown}{ArrowRight}');

    const submenu = await canvas.findByRole('menu', { name: 'Encaminhar' });
    await expect(encaminhar).toHaveAttribute('aria-expanded', 'true');
    await expect(within(submenu).getAllByRole('menuitem')).toHaveLength(3);
    await waitFor(() =>
      expect(within(submenu).getByRole('menuitem', { name: 'Secretaria de Saúde' })).toHaveFocus(),
    );

    await userEvent.keyboard('{ArrowLeft}');
    await waitFor(() => expect(canvas.queryByRole('menu', { name: 'Encaminhar' })).toBeNull());
    await waitFor(() => expect(encaminhar).toHaveFocus());
  },
};

const itensComRestricao: EntradaMenuContexto[] = [
  { id: 'abrir', rotulo: 'Abrir processo', icone: Icone.abrir, atalho: 'Ctrl + O' },
  { id: 'anexos', rotulo: 'Baixar anexos', icone: Icone.baixar, atalho: 'Ctrl + B' },
  { id: 'sep-1', tipo: 'separador' },
  {
    id: 'excluir',
    rotulo: 'Excluir processo',
    icone: Icone.excluir,
    perigoso: true,
    desabilitado: true,
  },
];

export const Indisponivel: Story = {
  name: 'Estado · ação sem permissão',
  parameters: {
    docs: {
      description: {
        story:
          'Servidor sem perfil de exclusão continua enxergando a ação, marcada com `aria-disabled` e sem resposta ao clique. O item segue focável para quem navega por teclado saber que ela existe.',
      },
    },
  },
  render: () => (
    <Quadro>
      <ContextMenu rotulo="Ações do processo 2025/0733" itens={itensComRestricao}>
        <LinhaProcesso numero="2025/0733" interessado="Antônio Carlos Ferreira" secretaria="Secretaria de Saúde" />
      </ContextMenu>
    </Quadro>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await abrirPorBotaoDireito(canvasElement);

    const menu = await canvas.findByRole('menu');
    const excluir = within(menu).getByRole('menuitem', { name: /Excluir processo/ });
    await expect(excluir).toHaveAttribute('aria-disabled', 'true');

    await userEvent.click(excluir);
    // Item indisponível não fecha o menu nem dispara ação.
    await expect(canvas.getByRole('menu')).toBeInTheDocument();
  },
};

export const FechaForaDoMenu: Story = {
  name: 'Comportamento · clique fora fecha',
  parameters: {
    docs: {
      description: {
        story: 'Clique fora do painel fecha o menu sem executar nada. A rolagem da página também fecha, porque a âncora presa ao ponto do cursor deixa de valer.',
      },
    },
  },
  render: () => (
    <Quadro>
      <ContextMenu rotulo="Ações do processo 2025/0481" itens={itensBasicos}>
        <LinhaProcesso />
      </ContextMenu>
      <p style={{ marginTop: 24, color: 'var(--citie-text-secondary)', fontFamily: 'var(--citie-font-ui)', fontSize: 14 }}>
        Clique com o botão direito sobre a linha para abrir as ações.
      </p>
    </Quadro>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await abrirPorBotaoDireito(canvasElement);
    await canvas.findByRole('menu');

    await userEvent.click(canvas.getByText('Clique com o botão direito sobre a linha para abrir as ações.'));
    await waitFor(() => expect(canvas.queryByRole('menu')).toBeNull());
  },
};

export const FechaAoRedimensionar: Story = {
  name: 'Comportamento · fecha ao rolar e ao redimensionar',
  parameters: {
    docs: {
      description: {
        story:
          'A âncora do menu é o ponto exato do cursor, então rolar a página ou redimensionar a janela invalida a posição e o menu fecha. Esta story existe como regressão: o mesmo handler atende os dois eventos, e no `resize` o alvo é o `window`, que não é um `Node`. Perguntar se o `window` está dentro do menu lançava TypeError e derrubava o componente.',
      },
    },
  },
  render: () => (
    <Quadro>
      <ContextMenu rotulo="Ações do processo 2025/0481" itens={itensBasicos}>
        <LinhaProcesso />
      </ContextMenu>
    </Quadro>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await abrirPorBotaoDireito(canvasElement);
    await canvas.findByRole('menu');

    // Alvo do evento é o `window`: é exatamente o caso que quebrava.
    fireEvent(window, new Event('resize'));
    await waitFor(() => expect(canvas.queryByRole('menu')).toBeNull());

    await abrirPorBotaoDireito(canvasElement);
    await canvas.findByRole('menu');

    // Na rolagem o alvo é o `document`, que é `Node`, e o caminho é outro.
    fireEvent.scroll(document, {});
    await waitFor(() => expect(canvas.queryByRole('menu')).toBeNull());
  },
};
