import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar, Badge, Button, Menubar, Search } from '../../../src';
import { AppShell } from './AppShell';

/* ------------------------------------------------------------------ */
/* Breakpoints do projeto                                              */
/* ------------------------------------------------------------------ */

const BREAKPOINTS = {
  desktopLargo: { name: 'Desktop 1920', styles: { width: '1920px', height: '1080px' } },
  desktop: { name: 'Desktop 1366', styles: { width: '1366px', height: '768px' } },
  tablet: { name: 'Tablet 768', styles: { width: '768px', height: '1024px' } },
  celular: { name: 'Celular 375', styles: { width: '375px', height: '812px' } },
};

/* ------------------------------------------------------------------ */
/* Preenchimento dos slots                                             */
/* ------------------------------------------------------------------ */

const IconeProcessos = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 3h8l5 5v13H6z" />
    <path d="M14 3v5h5" />
  </svg>
);

const IconePessoas = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M3 20c0-3.3 2.7-5 6-5s6 1.7 6 5" strokeLinecap="round" />
  </svg>
);

const IconeEstoque = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M4 8l8-4 8 4v8l-8 4-8-4z" strokeLinejoin="round" />
    <path d="M4 8l8 4 8-4M12 12v8" />
  </svg>
);

const IconeSino = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9z" strokeLinejoin="round" />
    <path d="M10 18a2 2 0 0 0 4 0" strokeLinecap="round" />
  </svg>
);

/**
 * Seções do menu. O item de auditoria não aparece porque o perfil da sessão não
 * tem permissão: a Sidebar exige ausência do DOM, nunca ocultação por CSS.
 */
const SECOES = [
  {
    rotulo: 'Operação',
    itens: [
      { id: 'solicitacoes', rotulo: 'Solicitações', icone: IconeProcessos, contagem: 12 },
      {
        id: 'pessoas',
        rotulo: 'Pessoas',
        icone: IconePessoas,
        filhos: [
          { id: 'servidores', rotulo: 'Servidores' },
          { id: 'beneficios', rotulo: 'Benefícios' },
        ],
      },
      { id: 'estoque', rotulo: 'Estoque', icone: IconeEstoque },
    ],
  },
  {
    rotulo: 'Sistema',
    itens: [{ id: 'perfis', rotulo: 'Perfis de acesso' }],
  },
];

const TRILHA = [
  { rotulo: 'Início', href: '#' },
  { rotulo: 'Operação', href: '#' },
  { rotulo: 'Solicitações' },
];

const Busca = (
  <Search
    label="Buscar no sistema"
    placeholder="Buscar solicitações, servidores, documentos..."
  />
);

/**
 * Contagem de não lidas com severidade `contrast`, a única do mapa de 7 cujo
 * fundo é opaco (`text.primary` sobre `text.inverse`). As demais severidades
 * têm fundo translúcido e um anel da cor de `background.surface`: sobre a barra
 * pintada com o azul da marca, o fundo do badge compõe com o azul por baixo e o
 * texto reprova AA. Com fundo próprio o badge não depende da superfície.
 */
const AcoesDaBarra = (
  <Badge value={3} severity="contrast">
    <Button variant="text" iconOnly icon={IconeSino} aria-label="Notificações: 3 não lidas" />
  </Badge>
);

const Perfil = (
  <Avatar
    nome="Maria de Fátima Souza"
    descricao="Abrir menu de perfil"
    onClick={() => {}}
  />
);

const AcoesDaTrilha = (
  <Menubar
    label="Ações da tela"
    itens={[
      { id: 'exportar', rotulo: 'Exportar' },
      {
        id: 'periodo',
        rotulo: 'Competência',
        submenu: [
          { id: 'mes', rotulo: 'Mês atual' },
          { id: 'ano', rotulo: 'Ano corrente' },
        ],
      },
    ]}
  />
);

const RodapeDoMenu = <span style={{ fontSize: 'var(--citie-font-size-body-sm)' }}>versão 2.14.0</span>;

/** Marcador de área de conteúdo. O conteúdo real pertence às páginas. */
function AreaDeExemplo({ titulo, altura = 320 }: { titulo: string; altura?: number }) {
  return (
    <>
      <h1 style={{ margin: '0 0 var(--citie-spacing-4)' }}>{titulo}</h1>
      <div
        style={{
          blockSize: altura,
          borderRadius: 'var(--citie-radius-lg)',
          border: '1px dashed var(--citie-border-default)',
          background: 'var(--citie-background-subtle)',
        }}
      />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Meta                                                                */
/* ------------------------------------------------------------------ */

const meta = {
  title: 'Templates/Estrutura/Shell de aplicação',
  component: AppShell,
  tags: ['template', 'a11y'],
  parameters: {
    layout: 'fullscreen',
    viewport: { options: BREAKPOINTS },
    docs: {
      description: {
        component: [
          'Moldura persistente de toda tela autenticada dos sistemas internos Citiesoft. Anatomia tirada de `design-system/03-components/navigation-sidebar-header.md` v2.0.0 (seções Sidebar e Header). Os outros templates da biblioteca vivem dentro deste.',
          '',
          '**Regiões, na ordem da spec**',
          '',
          '| Região | Slot | Conteúdo esperado |',
          '|---|---|---|',
          '| Barra · início | interno + `moduloAtual` | gatilho de menu, marca oficial e nome do módulo atual |',
          '| Barra · centro | `busca` | busca global (`Search`) |',
          '| Barra · fim | `acoesDaBarra`, `perfil` | notificações e tema (`Button` + `Badge`), avatar (`Avatar`) |',
          '| Menu lateral | `secoes`, `itemAtivo`, `rodapeDoMenu` | `Sidebar` do sistema e o rodapé de perfil ou versão |',
          '| Trilha | `trilha`, `acoesDaTrilha` | `Breadcrumb` e ações de escopo da tela (`Button`, `Menubar`) |',
          '| Conteúdo | `children` | o único `main` do documento, com `id="conteudo"` |',
          '| Painel lateral direito | `painelLateral` + `rotuloDoPainelLateral` | detalhe, ajuda ou histórico; opcional |',
          '',
          '**Componentes do sistema usados**: `Sidebar`, `Breadcrumb` e `Button` dentro do template; `Search`, `Avatar`, `Badge` e `Menubar` preenchendo os slots nas stories.',
          '',
          '**Acessibilidade**: um único `main` por tela, alvo do skip link que a própria `Sidebar` publica. Navegação principal nomeada ("Menu principal") e trilha nomeada ("Trilha de navegação"), porque há mais de uma navegação na tela. O item ativo do menu carrega `aria-current="page"`, e item sem permissão não é renderizado. Nada disso é reimplementado aqui: pertence à `Sidebar`.',
          '',
          '**Colapso e drawer são estados diferentes.** O colapso para 64px é preferência de trabalho no desktop e só muda por clique no gatilho da barra, nunca por largura da viewport. Abaixo de 768px o menu vira drawer off-canvas, aberto pelo botão de menu da barra, com foco preso enquanto aberto, Escape para fechar e devolução do foco ao gatilho.',
          '',
          '**Marca**: SVGs oficiais de `public/marca/`. `fundoDaBarra="claro"` usa `LogoHorizontal3.svg`; `fundoDaBarra="escuro"` usa `LogoHorizontal2.svg` sobre o azul da marca.',
          '',
          '**Cuidado ao preencher os slots da barra com `fundoDaBarra="escuro"`.** A barra passa a ser superfície de marca, e não `background.surface`. As severidades do mapa canônico (`danger`, `success`, `warn`, `info`, `primary`) têm fundo translúcido e contam com um anel da cor de `background.surface` para se destacar: sobre o azul, o fundo compõe com o azul por baixo e o texto reprova AA. Nesse contexto use `contrast`, a única severidade de fundo opaco. A contagem de item de menu não tem esse problema: é a `contagem` nativa da `Sidebar`, sem `Badge` sobreposto.',
        ].join('\n'),
      },
    },
  },
  args: {
    moduloAtual: 'Solicitações',
    secoes: SECOES,
    itemAtivo: 'solicitacoes',
    trilha: TRILHA,
    busca: Busca,
    acoesDaBarra: AcoesDaBarra,
    perfil: Perfil,
    acoesDaTrilha: AcoesDaTrilha,
    rodapeDoMenu: RodapeDoMenu,
    children: <AreaDeExemplo titulo="Área de conteúdo da tela" />,
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Stories: os quatro breakpoints                                      */
/* ------------------------------------------------------------------ */

export const DesktopLargo: Story = {
  name: '1920 · desktop largo com painel',
  globals: { viewport: { value: 'desktopLargo' } },
  args: {
    painelLateral: <AreaDeExemplo titulo="Painel de apoio" altura={200} />,
    rotuloDoPainelLateral: 'Detalhes da seleção',
    children: <AreaDeExemplo titulo="Área de conteúdo da tela" />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Largura máxima: menu expandido em 260px, conteúdo e painel lateral direito lado a lado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Um único main na tela, e ele é o alvo do skip link da Sidebar.
    await expect(canvasElement.querySelectorAll('main')).toHaveLength(1);
    await expect(canvas.getByRole('main')).toHaveAttribute('id', 'conteudo');

    // Landmarks de navegação nomeadas, porque há mais de uma.
    await expect(canvas.getByRole('navigation', { name: 'Menu principal' })).toBeInTheDocument();
    await expect(
      canvas.getByRole('navigation', { name: 'Trilha de navegação' }),
    ).toBeInTheDocument();

    // Painel lateral é landmark complementar com nome.
    await expect(
      canvas.getByRole('complementary', { name: 'Detalhes da seleção' }),
    ).toBeInTheDocument();
  },
};

export const Desktop: Story = {
  name: '1366 · desktop padrão',
  globals: { viewport: { value: 'desktop' } },
  parameters: {
    docs: {
      description: {
        story: 'Resolução de trabalho diário do servidor público, sem painel lateral direito.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('button', { name: /Solicitações/ })).toHaveAttribute(
      'aria-current',
      'page',
    );
    // Item sem permissão não é renderizado, nem oculto por CSS.
    await expect(canvas.queryByRole('button', { name: 'Auditoria' })).not.toBeInTheDocument();
  },
};

export const Tablet: Story = {
  name: '768 · tablet',
  globals: { viewport: { value: 'tablet' } },
  parameters: {
    docs: {
      description: {
        story:
          'Em 768px o menu ainda é coluna fixa: o drawer só entra abaixo desse limite. O painel lateral direito, quando existe, empilha sob o conteúdo a partir de 1024px.',
      },
    },
  },
};

export const Celular: Story = {
  name: '375 · celular com menu off-canvas',
  globals: { viewport: { value: 'celular' } },
  parameters: {
    docs: {
      description: {
        story:
          'Abaixo de 768px o menu sai do fluxo e vira drawer, acionado pelo botão da barra superior. Enquanto fechado ele fica invisível para leitor de tela e fora da ordem de foco.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Abrir menu principal' });

    // O drawer começa fechado, para não cobrir a documentação.
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
  },
};

/* ------------------------------------------------------------------ */
/* Stories: variações de estado                                        */
/* ------------------------------------------------------------------ */

export const MenuColapsado: Story = {
  name: 'Menu colapsado',
  globals: { viewport: { value: 'desktop' } },
  args: { colapsadaInicial: true },
  parameters: {
    docs: {
      description: {
        story:
          'Menu em 64px icon-only, estado escolhido pelo usuário no gatilho da barra. O template nunca colapsa sozinho por largura da viewport; abaixo de 768px o menu vira drawer, que é outro estado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Expandir menu principal' });
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    // Ícone sozinho é ambíguo: o rótulo sobrevive como nome acessível.
    await expect(canvas.getByRole('button', { name: 'Solicitações' })).toHaveAttribute(
      'title',
      'Solicitações',
    );
  },
};

export const TemaEscuro: Story = {
  name: 'Tema escuro',
  globals: { theme: 'dark', viewport: { value: 'desktop' } },
  args: { fundoDaBarra: 'escuro' },
  parameters: {
    docs: {
      description: {
        story:
          'Barra superior sobre o azul da marca: a regra de fundo troca o logotipo para `LogoHorizontal2.svg`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByAltText('Citiesoft')).toHaveAttribute(
      'src',
      '/marca/LogoHorizontal2.svg',
    );
  },
};
