import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Avatar, Badge, Menubar } from '../../../src';
import { AppShell, BotaoDaBarra, SeletorDeContexto } from './AppShell';

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

const IconePainel = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="4" y="4" width="6" height="6" rx="1" />
    <rect x="14" y="4" width="6" height="6" rx="1" />
    <rect x="4" y="14" width="6" height="6" rx="1" />
    <rect x="14" y="14" width="6" height="6" rx="1" />
  </svg>
);

const IconeEscudo = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" strokeLinejoin="round" />
  </svg>
);

const IconePredio = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="5" y="3" width="14" height="18" rx="1" />
    <path d="M9 7h2M13 7h2M9 11h2M13 11h2M9 15h2M13 15h2M10 21v-3h4v3" strokeLinecap="round" />
  </svg>
);

const IconeLupa = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="6" />
    <path d="m20 20-4.5-4.5" strokeLinecap="round" />
  </svg>
);

const IconeSino = (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9z" strokeLinejoin="round" />
    <path d="M10 18a2 2 0 0 0 4 0" strokeLinecap="round" />
  </svg>
);

/**
 * Seções do menu, nos grupos do Sismental (Visão Geral, Operação, Análise,
 * Administração). O item de auditoria não aparece porque o perfil da sessão
 * não tem permissão: a Sidebar exige ausência do DOM, nunca ocultação por CSS.
 */
const SECOES = [
  {
    rotulo: 'Visão Geral',
    itens: [{ id: 'painel', rotulo: 'Painel Inicial', icone: IconePainel }],
  },
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
    rotulo: 'Administração',
    itens: [{ id: 'perfis', rotulo: 'Perfis e Permissões', icone: IconeEscudo }],
  },
];

const TRILHA = [
  { rotulo: 'Início', href: '#' },
  { rotulo: 'Operação', href: '#' },
  { rotulo: 'Solicitações' },
];

const Contexto = (
  <SeletorDeContexto
    rotulo="Secretaria de Saúde"
    icone={IconePredio}
    acao="Trocar unidade"
    onClick={() => {}}
  />
);

/**
 * Busca e notificações como botões de ícone de 30, como na barra do
 * Sismental. A contagem entra pelo `Badge` preenchido (Lote 1), que tem fundo
 * opaco e por isso não depende da superfície da barra.
 */
const AcoesDaBarra = (
  <>
    <BotaoDaBarra icone={IconeLupa} aria-label="Buscar no sistema" />
    <Badge value={3} severity="primary" pele="preenchida" size="sm">
      <BotaoDaBarra icone={IconeSino} aria-label="Notificações: 3 não lidas" />
    </Badge>
  </>
);

const Perfil = (
  <Avatar
    nome="Maria de Fátima Souza"
    descricao="Abrir menu de perfil"
    onClick={() => {}}
  />
);

const AcoesDaTela = (
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

/** Marcador de área de conteúdo. O conteúdo real pertence às páginas. */
function AreaDeExemplo({ titulo, altura = 320 }: { titulo: string; altura?: number }) {
  return (
    <>
      <h1
        style={{
          margin: '0 0 var(--citie-spacing-4)',
          fontFamily: 'var(--citie-font-display)',
          fontSize: 'var(--citie-font-size-title-lg)',
          fontWeight: 'var(--citie-font-weight-title)',
        }}
      >
        {titulo}
      </h1>
      <div
        style={{
          blockSize: altura,
          borderRadius: 'var(--citie-radius-lg)',
          border: '1px dashed var(--citie-border-strong)',
          background: 'var(--citie-background-subtle)',
        }}
      />
    </>
  );
}

/** Contêiner de tema do decorador: é filho do canvas, e é nele que o tema vale. */
function contêinerDeTema(canvasElement: HTMLElement) {
  return (
    canvasElement.querySelector<HTMLElement>('[data-theme]') ??
    canvasElement.closest<HTMLElement>('[data-theme]') ??
    canvasElement
  );
}

/** Lê um token no contêiner de tema do decorador. */
function token(canvasElement: HTMLElement, nome: string) {
  return getComputedStyle(contêinerDeTema(canvasElement)).getPropertyValue(nome).trim();
}

/** Resolve um token de cor para a serialização `rgb()` do navegador. */
function corDoToken(canvasElement: HTMLElement, nome: string) {
  const sonda = document.createElement('span');
  sonda.style.color = `var(${nome})`;
  contêinerDeTema(canvasElement).appendChild(sonda);
  const cor = getComputedStyle(sonda).color;
  sonda.remove();
  return cor;
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
          'Moldura persistente de toda tela autenticada dos sistemas internos Citiesoft, recomposta no Lote 6b sobre a composição do Sismental (`docs/figma-ui-kit.md`, "Composição de tela"). Os outros templates da biblioteca vivem dentro deste.',
          '',
          '**Regiões, medidas no Sismental**',
          '',
          '| Região | Slot | Anatomia |',
          '|---|---|---|',
          '| Barra · início | interno | 52px de altura; logo Citiesoft à esquerda e o botão de recolher a navegação no fim da coluna de 257 |',
          '| Barra · centro | `trilha`, `moduloAtual`, `busca` | `Breadcrumb` com o ícone de casa; no celular sobra o nome do módulo |',
          '| Barra · fim | `acoesDaBarra`, `perfil` | `BotaoDaBarra` de 30px (busca, notificações), divisor vertical, `Avatar` de 32 |',
          '| Navegação | `secoes`, `itemAtivo`, `contexto`, `onSair`, `rodapeDoMenu` | `Sidebar` fixa de 257 com o `SeletorDeContexto` em cartão no topo e "Sair" em vermelho ancorado no rodapé |',
          '| Ações da tela | `acoesDaTrilha` | linha acima do conteúdo (`Button`, `Menubar`) |',
          '| Conteúdo | `children`, `moldura` | o único `main`; `direto` sobre o fundo da página (listagem) ou `cartao` branco de raio 16 a 8px do fundo (formulário, administração) |',
          '| Rodapé | `rodape` | "Desenvolvido por Citiesoft @ 2026", a marca em `Link` |',
          '| Painel lateral direito | `painelLateral` + `rotuloDoPainelLateral` | detalhe, ajuda ou histórico; opcional |',
          '',
          '**Componentes do sistema usados**: `Sidebar` (variante `fixa`), `Breadcrumb`, `Button` e `Link` dentro do template; `Avatar`, `Badge` e `Menubar` preenchendo os slots nas stories.',
          '',
          '**Acessibilidade**: um único `main` por tela, alvo do skip link que a própria `Sidebar` publica. Navegação principal nomeada ("Menu principal") e trilha nomeada ("Trilha de navegação"), porque há mais de uma navegação na tela. O item ativo do menu carrega `aria-current="page"`, e item sem permissão não é renderizado. Nada disso é reimplementado aqui: pertence à `Sidebar`.',
          '',
          '**Colapso e drawer são estados diferentes.** O colapso para 72px é preferência de trabalho no desktop e só muda por clique no gatilho da barra, nunca por largura da viewport. Abaixo de 768px o menu vira drawer off-canvas, aberto pelo botão de menu da barra, com foco preso enquanto aberto, Escape para fechar e devolução do foco ao gatilho.',
          '',
          '**Marca**: SVGs oficiais de `public/marca/`. `fundoDaBarra="claro"` usa `LogoHorizontal3.svg`; `fundoDaBarra="escuro"` usa `LogoHorizontal2.svg` sobre o azul da marca.',
        ].join('\n'),
      },
    },
  },
  args: {
    moduloAtual: 'Solicitações',
    secoes: SECOES,
    itemAtivo: 'solicitacoes',
    trilha: TRILHA,
    contexto: Contexto,
    acoesDaBarra: AcoesDaBarra,
    perfil: Perfil,
    onSair: () => {},
    children: <AreaDeExemplo titulo="Área de conteúdo da tela" />,
  },
} satisfies Meta<typeof AppShell>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Stories: anatomia e os quatro breakpoints                            */
/* ------------------------------------------------------------------ */

export const Anatomia: Story = {
  name: 'Anatomia · 52 / 257 / 30 / 32',
  globals: { viewport: { value: 'desktop' } },
  parameters: {
    docs: {
      description: {
        story:
          'Medidas do Sismental por token: barra de 52, navegação de 257, botão de ícone de 30, avatar de 32, item ativo em accent e "Sair" em vermelho no rodapé da navegação.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    const barra = canvasElement.querySelector<HTMLElement>('.citie-app-shell__barra')!;
    await expect(Math.round(barra.getBoundingClientRect().height)).toBe(
      parseFloat(token(canvasElement, '--citie-altura-da-barra')),
    );
    await expect(Math.round(barra.getBoundingClientRect().height)).toBe(52);

    const navegacao = canvas.getByRole('navigation', { name: 'Menu principal' });
    await expect(Math.round(navegacao.getBoundingClientRect().width)).toBe(257);

    const busca = canvas.getByRole('button', { name: 'Buscar no sistema' });
    await expect(Math.round(busca.getBoundingClientRect().width)).toBe(30);
    await expect(Math.round(busca.getBoundingClientRect().height)).toBe(30);

    const avatar = canvas.getByRole('button', { name: 'Ver perfil de Maria de Fátima Souza' });
    await expect(Math.round(avatar.getBoundingClientRect().width)).toBe(32);
    await expect(Math.round(avatar.getBoundingClientRect().height)).toBe(32);

    // Seletor de contexto no topo da navegação, "Sair" no rodapé.
    const contexto = canvas.getByRole('button', { name: 'Trocar unidade: Secretaria de Saúde' });
    const sair = canvas.getByRole('button', { name: 'Sair' });
    await expect(navegacao.contains(contexto)).toBe(true);
    await expect(navegacao.contains(sair)).toBe(true);
    await expect(contexto.getBoundingClientRect().top).toBeLessThan(sair.getBoundingClientRect().top);
    await expect(getComputedStyle(sair).color).toBe(corDoToken(canvasElement, '--citie-danger-foreground'));

    // Trilha com casa na barra, e o rodapé com a marca em link.
    const trilha = canvas.getByRole('navigation', { name: 'Trilha de navegação' });
    await expect(barra.contains(trilha)).toBe(true);
    const marca = canvas.getByRole('link', { name: /Citiesoft/ });
    await expect(marca.closest('footer')).not.toBeNull();
    await expect(marca.closest('footer')).toHaveTextContent(/Desenvolvido por Citiesoft.*@ 2026/);
  },
};

export const MolduraEmCartao: Story = {
  name: 'Moldura · conteúdo em cartão de raio 16',
  globals: { viewport: { value: 'desktop' } },
  args: { moldura: 'cartao', moduloAtual: 'Pessoas', itemAtivo: 'pessoas' },
  parameters: {
    docs: {
      description: {
        story:
          'Formulário e administração vivem num cartão branco de raio 16 a 8px do fundo cinza da página (`--citie-margem-da-moldura`). Listagem simples usa `moldura="direto"`.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const main = canvas.getByRole('main');
    const estilo = getComputedStyle(main);
    await expect(estilo.borderRadius).toBe('16px');
    await expect(estilo.marginTop).toBe('8px');
    await expect(estilo.marginLeft).toBe('8px');
    await expect(estilo.backgroundColor).toBe(corDoToken(canvasElement, '--citie-background-surface'));
    // O cartão é uma superfície distinta do fundo da página.
    const fundo = getComputedStyle(canvasElement.querySelector('.citie-app-shell')!).backgroundColor;
    await expect(estilo.backgroundColor).not.toBe(fundo);
  },
};

export const DesktopLargo: Story = {
  name: '1920 · desktop largo com painel',
  globals: { viewport: { value: 'desktopLargo' } },
  args: {
    painelLateral: <AreaDeExemplo titulo="Painel de apoio" altura={200} />,
    rotuloDoPainelLateral: 'Detalhes da seleção',
    acoesDaTrilha: AcoesDaTela,
    children: <AreaDeExemplo titulo="Área de conteúdo da tela" />,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Largura máxima: navegação expandida em 257px, ações da tela acima do conteúdo, conteúdo e painel lateral direito lado a lado.',
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
          'Abaixo de 768px o menu sai do fluxo e vira drawer, acionado pelo botão da barra superior. Enquanto fechado ele fica invisível para leitor de tela e fora da ordem de foco. A trilha cede lugar ao nome do módulo.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Abrir menu principal' });

    // O drawer começa fechado, para não cobrir a documentação.
    await expect(gatilho).toHaveAttribute('aria-expanded', 'false');
    await expect(canvas.getByText('Solicitações', { selector: '.citie-app-shell__modulo' })).toBeVisible();
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
          'Navegação em 72px só com ícones, estado escolhido pelo usuário no gatilho da barra. O seletor de contexto some e "Sair" vira ícone com o nome acessível preservado. O template nunca colapsa sozinho por largura da viewport; abaixo de 768px o menu vira drawer, que é outro estado.',
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
    await expect(canvas.getByRole('button', { name: 'Sair' })).toBeInTheDocument();
    const navegacao = canvas.getByRole('navigation', { name: 'Menu principal' });
    await expect(Math.round(navegacao.getBoundingClientRect().width)).toBe(72);
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
