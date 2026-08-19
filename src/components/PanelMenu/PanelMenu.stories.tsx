import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { PanelMenu, type SecaoDoPanelMenu } from './PanelMenu';

const IconePasta = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 7h6l2 2h10v10H3z" strokeLinejoin="round" />
  </svg>
);

const IconePessoas = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" strokeLinecap="round" />
  </svg>
);

const IconeRelatorio = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h8l5 5v13H6z" strokeLinejoin="round" />
    <path d="M14 3v5h5" />
  </svg>
);

const SECOES: SecaoDoPanelMenu[] = [
  {
    id: 'tfd',
    rotulo: 'TFD',
    icone: IconePasta,
    itens: [
      {
        id: 'solicitacoes',
        rotulo: 'Solicitações',
        href: '#solicitacoes',
        contagem: 12,
        descricaoDaContagem: 'solicitações aguardando análise',
      },
      { id: 'agendamentos', rotulo: 'Agendamentos', href: '#agendamentos' },
      { id: 'passagens', rotulo: 'Passagens e diárias', href: '#passagens' },
    ],
  },
  {
    id: 'pessoas',
    rotulo: 'Pessoas',
    icone: IconePessoas,
    itens: [
      { id: 'servidores', rotulo: 'Servidores', href: '#servidores', contagem: 148 },
      { id: 'beneficios', rotulo: 'Benefícios', href: '#beneficios' },
      { id: 'lotacoes', rotulo: 'Lotações por secretaria', href: '#lotacoes' },
    ],
  },
  {
    id: 'relatorios',
    rotulo: 'Relatórios',
    icone: IconeRelatorio,
    itens: [
      { id: 'competencia', rotulo: 'Fechamento por competência', href: '#competencia' },
      { id: 'diarias', rotulo: 'Diárias pagas', href: '#diarias' },
      {
        id: 'auditoria',
        rotulo: 'Trilha de auditoria',
        desabilitado: true,
      },
    ],
  },
];

const meta = {
  title: 'Navegação/PanelMenu',
  component: PanelMenu,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Menu em sanfona da página `6738:52939` do Figma CitieOne. Equivalente PrimeNG: `p-panelmenu`.',
          '',
          'Variantes do arquivo cobertas: `panelmenu-panel` (`Expand` False/True e quantidade variável de itens) e `panelmenu-item` (`Show Icon`, `Icon`, `Text`, `Show Submenu Icon`, `Chevron Icon`, `State` Idle/Hover/Focus).',
          '',
          'Diferença para a `Sidebar` de `Layout/Navegação`: a Sidebar é o chrome fixo da aplicação, com uma trilha ativa por vez e modo colapsado por ícone. O PanelMenu vive **dentro de painéis, drawers e filtros laterais**, permite **várias seções abertas ao mesmo tempo** e não tem estado colapsado.',
          '',
          'Não é `role="menu"`: por ser navegação persistente, a estrutura é `nav` + lista de links, com `aria-expanded`/`aria-controls` no cabeçalho e `aria-current="page"` no item corrente. Tab percorre todos os itens, sem roving tabindex.',
        ].join('\n'),
      },
    },
  },
  args: {
    label: 'Módulos do sistema',
    secoes: SECOES,
  },
} satisfies Meta<typeof PanelMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fechado: Story = {
  name: 'Expand · todas fechadas',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByRole('navigation', { name: 'Módulos do sistema' })).toBeVisible();
    const cabecalho = canvas.getByRole('button', { name: 'TFD' });
    await expect(cabecalho).toHaveAttribute('aria-expanded', 'false');
    // Painel fechado não expõe os links à navegação.
    await expect(canvas.queryByRole('link', { name: /Solicitações/ })).toBeNull();
  },
};

export const Aberto: Story = {
  name: 'Expand · seção aberta',
  args: { abertasPorPadrao: ['tfd'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const cabecalho = canvas.getByRole('button', { name: 'TFD' });
    const painel = canvas.getByRole('region', { name: 'TFD' });

    await expect(cabecalho).toHaveAttribute('aria-expanded', 'true');
    await expect(cabecalho).toHaveAttribute('aria-controls', painel.id);
    await expect(within(painel).getAllByRole('link')).toHaveLength(3);
  },
};

export const ItemAtivo: Story = {
  name: 'Estado · item corrente',
  args: { abertasPorPadrao: ['pessoas'], ativo: 'servidores' },
  parameters: {
    docs: {
      description: {
        story:
          'O item corrente é sinalizado por `aria-current="page"`, barra à esquerda e peso do texto. A cor sozinha nunca carrega o estado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const item = canvas.getByRole('link', { name: /Servidores/ });

    await expect(item).toHaveAttribute('aria-current', 'page');
    await expect(canvas.getByRole('link', { name: /Benefícios/ })).not.toHaveAttribute(
      'aria-current',
    );
  },
};

export const VariasAbertas: Story = {
  name: 'Variante · várias seções abertas',
  args: { abertasPorPadrao: ['tfd', 'relatorios'] },
  parameters: {
    docs: {
      description: {
        story:
          'Comportamento padrão e traço que separa o PanelMenu da Sidebar: abrir uma seção não fecha as demais.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Pessoas' }));

    for (const secao of ['TFD', 'Pessoas', 'Relatórios']) {
      await expect(canvas.getByRole('button', { name: secao })).toHaveAttribute(
        'aria-expanded',
        'true',
      );
    }
  },
};

export const Acordeao: Story = {
  name: 'Variante · acordeão (uma por vez)',
  args: { multiplos: false, abertasPorPadrao: ['tfd'] },
  parameters: {
    docs: {
      description: {
        story:
          'Com `multiplos={false}` o menu vira acordeão. Útil em drawer estreito, onde manter tudo aberto obriga a rolar.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole('button', { name: 'Relatórios' }));

    await expect(canvas.getByRole('button', { name: 'Relatórios' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
    await expect(canvas.getByRole('button', { name: 'TFD' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  },
};

export const ItemDesabilitado: Story = {
  name: 'Estado · item sem permissão',
  args: { abertasPorPadrao: ['relatorios'] },
  parameters: {
    docs: {
      description: {
        story:
          'Item indisponível vira botão desabilitado em vez de link, para não levar a uma rota que devolve 403. Item que o perfil sequer pode enxergar não é passado ao componente.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: 'Trilha de auditoria' })).toBeDisabled();
  },
};

export const SemIcone: Story = {
  name: 'Show Icon · sem ícone',
  args: {
    abertasPorPadrao: ['competencia'],
    secoes: [
      {
        id: 'competencia',
        rotulo: 'Competência 08/2026',
        itens: [
          { id: 'lancamentos', rotulo: 'Lançamentos', href: '#lancamentos', contagem: 37 },
          { id: 'conferencia', rotulo: 'Conferência', href: '#conferencia' },
        ],
      },
      {
        id: 'competencia-anterior',
        rotulo: 'Competência 07/2026',
        itens: [{ id: 'fechada', rotulo: 'Fechada em 05/08/2026', href: '#fechada' }],
      },
    ],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // A contagem é lida com unidade, não como número solto.
    await expect(canvas.getByRole('link', { name: /37 registros/ })).toBeVisible();
  },
};

export const Teclado: Story = {
  name: 'Comportamento · teclado',
  args: { abertasPorPadrao: [] },
  parameters: {
    docs: {
      description: {
        story:
          'Tab alcança cabeçalhos e itens na ordem do documento. Enter ou Espaço no cabeçalho alterna o painel; item de painel fechado fica fora da ordem de foco.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const cabecalho = canvas.getByRole('button', { name: 'TFD' });

    cabecalho.focus();
    await expect(cabecalho).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    await expect(cabecalho).toHaveAttribute('aria-expanded', 'true');

    await userEvent.tab();
    await expect(canvas.getByRole('link', { name: /Solicitações/ })).toHaveFocus();
  },
};
