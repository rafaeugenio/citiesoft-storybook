import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  AchadoAberto,
  Bloco,
  TabelaDeTokens,
  type TokenDocumentado,
} from './_ui/TabelaDeTokens';

const meta = {
  title: 'Fundações/Cores',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Toda cor do produto vem daqui. Nenhum componente escreve hexadecimal.',
          '',
          '**Como escolher.** Procure pela situação na coluna Uso. A cor aparece na',
          'resposta. O nome do token descreve o papel (`text-secondary`, `danger-emphasis`),',
          'nunca a aparência (`cinza-medio`, `vermelho`). É isso que permite trocar a cor no',
          'tema escuro sem trocar uma linha de componente.',
          '',
          '**O valor mostrado é lido do CSS em tempo de execução.** Nenhum número desta',
          'página foi copiado para a tabela. Valor copiado envelhece em silêncio: alguém ajusta o token e a documentação',
          'passa a mentir sem que nada acuse. Troque o tema no controle da barra superior e os',
          'valores mudam junto.',
          '',
          '**Regra de ouro:** se você precisa de uma cor que não está aqui, o token está',
          'faltando. Peça o token, não escreva o hexadecimal. Cada literal de cor que entrou',
          'no código deste catálogo virou depois um defeito de tema escuro ou de contraste.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const MARCA: TokenDocumentado[] = [
  {
    nome: 'brand-primary',
    uso: 'Ação primária da tela: preenchimento do botão principal, link, aba ativa, item de menu selecionado, anel de foco.',
    evitar: 'usar como cor de texto corrido. Para texto de link existe o átomo Link, que já aplica o token e o sublinhado.',
  },
  { nome: 'brand-hover', uso: 'Ponteiro sobre a ação primária. Também é a cor de link em repouso no tema escuro.' },
  { nome: 'brand-active', uso: 'Instante em que o botão primário está pressionado.' },
  {
    nome: 'brand-subtle',
    uso: 'Fundo de realce discreto em área de marca: barra de seleção em massa, aba ativa, dica de informação.',
    evitar: 'usar como fundo de página. O fundo de página é `background-default`.',
  },
  {
    nome: 'brand-contrast',
    uso: 'Rótulo por cima de qualquer preenchimento de marca. Existe para o texto acompanhar o tema quando o fundo inverte.',
  },
];

const TEXTO: TokenDocumentado[] = [
  {
    nome: 'text-primary',
    uso: 'Título de página e de seção, e valor de destaque num indicador. É a tinta mais escura, reservada ao que precisa vencer.',
    sobre: 'background-surface',
  },
  {
    nome: 'text-base',
    uso: 'Texto de leitura: parágrafo, dado de célula de tabela, conteúdo de card. É o padrão do corpo.',
    sobre: 'background-surface',
  },
  {
    nome: 'text-secondary',
    uso: 'Metadado que acompanha o dado sem competir com ele: rótulo de campo, cabeçalho de coluna, texto de ajuda, legenda, subtítulo.',
    evitar: 'usar em texto que o servidor precisa ler com atenção. Recuar a cor recua a prioridade.',
    sobre: 'background-surface',
  },
  {
    nome: 'text-inverse',
    uso: 'Texto sobre superfície escura ou colorida fora da família de marca.',
    sobre: 'text-primary',
  },
  {
    nome: 'text-placeholder',
    uso: 'Texto de exemplo dentro do campo vazio.',
    evitar: 'usar placeholder no lugar do rótulo. O texto some quando a pessoa digita, e o campo fica sem nome.',
    sobre: 'background-surface',
  },
  {
    nome: 'form-helper',
    uso: 'Texto de ajuda abaixo do campo, com a instrução de formato ou o limite de caracteres. Mesma tinta de `text-secondary`, com nome próprio para o campo poder mudar de ideia sem arrastar todo metadado junto.',
    sobre: 'background-surface',
  },
  {
    nome: 'danger-foreground',
    uso: 'Mensagem de validação abaixo do campo com erro. Tinta de leitura na matiz de perigo, separada de `danger-emphasis`, que é preenchimento.',
    sobre: 'background-surface',
  },
];

const SUPERFICIE: TokenDocumentado[] = [
  { nome: 'background-default', uso: 'Fundo da página, atrás dos cards. É o degrau mais recuado.' },
  { nome: 'background-surface', uso: 'Superfície que se ergue do fundo: card, painel, tabela, diálogo, menu.' },
  {
    nome: 'background-subtle',
    uso: 'Recuo dentro de uma superfície: cabeçalho de tabela, linha zebrada, trilho de controle segmentado, bloco de código.',
  },
];

const BORDA: TokenDocumentado[] = [
  { nome: 'border-default', uso: 'Divisor entre partes do mesmo bloco: linha de tabela, separador de lista, contorno de card.' },
  { nome: 'border-strong', uso: 'Fronteira que precisa se afirmar: base do cabeçalho de tabela, contorno de bloco aninhado.' },
  {
    nome: 'form-field-border',
    uso: 'Contorno do campo em repouso. Separado da borda comum porque a WCAG 1.4.11 exige 3:1 para elemento de interface, e divisor decorativo não tem essa exigência.',
  },
  {
    nome: 'form-field-border-hover',
    uso: 'Contorno do campo sob o ponteiro e do campo já preenchido. Degrau mais escuro da família no claro (4,94:1) e mais claro no escuro (5,37:1), para o campo ganhar fronteira ao ser apontado.',
    evitar:
      'apontar o hover do campo para `border-strong`. Aquele token mede 1,43:1 sobre o branco, e o campo apagaria a própria fronteira justo quando o ponteiro chega.',
  },
  { nome: 'border-danger', uso: 'Contorno do campo com erro de validação.' },
];

const ACCENT: TokenDocumentado[] = [
  {
    nome: 'accent',
    uso: 'Realce sólido sob o ponteiro: hover de aba, de linha de tabela, de item de menu e de item de sidebar. Também é o trilho das abas segmentadas e a zebra da tabela básica.',
    evitar: 'usar como fundo de mensagem informativa. Esse papel é de `info-background`, que carrega severidade; o accent é neutro de intenção.',
  },
  {
    nome: 'accent-foreground',
    uso: 'Rótulo que precisa se afirmar por cima do accent: item de sidebar ativo, aba ativa em trilho accent.',
    sobre: 'accent',
  },
  {
    nome: 'accent-forte',
    uso: 'Um degrau acima do accent: linha selecionada, item de menu ativo, chip de filtro aplicado. É o que separa "escolhido" de "apontado" quando os dois coincidem.',
    evitar:
      'usar como hover. O forte é estado que persiste; o ponteiro passa pelo accent. E o rótulo por cima precisa ser text-primary ou accent-foreground: brand-primary mede 3,95:1 no claro e 3,80:1 no escuro sobre ele.',
  },
  {
    nome: 'secondary',
    uso: 'Preenchimento do botão e do badge Secondary: a ação de apoio ao lado da primária, e o rótulo neutro de categoria.',
    evitar: 'usar como fundo de área. Para recuo dentro de superfície existe `background-subtle`, mesmo valor hoje, papel diferente.',
  },
  { nome: 'secondary-foreground', uso: 'Rótulo por cima de `secondary`.', sobre: 'secondary' },
  {
    nome: 'secondary-hover',
    uso: 'Ponteiro sobre o botão e o badge Secondary. Sobe um degrau na família de neutros, para o mesmo valor de `border-default`, e mantém o rótulo em 13,52:1 no claro e 11,35:1 no escuro.',
    evitar:
      'apontar a borda do controle para cá. O papel deste token é preenchimento; o contorno do Secondary continua em `border-default`.',
  },
  {
    nome: 'veu-sobre-selecao',
    uso: 'Ponteiro sobre a linha que já está selecionada. Véu translúcido na matiz da marca, que soma ao fundo de seleção e preserva o rótulo: 10,66:1 para text-primary sobre o composto claro, 9,48:1 no escuro.',
    evitar:
      'aplicar em linha comum. Fora da seleção o ponteiro pinta `accent` sólido, e um véu por cima do fundo da página quase some.',
  },
  {
    nome: 'popover',
    uso: 'Fundo do tooltip. Inverte a tinta da página, escuro no claro e claro no escuro, para a dica flutuar sem borda nem sombra pesada.',
    evitar: 'usar em menu, dropdown ou popover de confirmação. Esses continuam em `background-surface` com elevação; só o tooltip inverte.',
  },
  { nome: 'popover-foreground', uso: 'Texto do tooltip.', sobre: 'popover' },
];

const SIDEBAR: TokenDocumentado[] = [
  { nome: 'sidebar', uso: 'Fundo da barra lateral de navegação. Mesmo degrau do fundo da página, para a sidebar ler como parte da moldura da tela.' },
  { nome: 'sidebar-foreground', uso: 'Rótulo e ícone do item de sidebar em repouso.', sobre: 'sidebar' },
  { nome: 'sidebar-accent', uso: 'Fundo do item de sidebar sob o ponteiro e do item ativo. Aponta para `accent`.' },
  { nome: 'sidebar-accent-foreground', uso: 'Rótulo do item de sidebar ativo, por cima de `sidebar-accent`.', sobre: 'sidebar-accent' },
  { nome: 'sidebar-primary', uso: 'Preenchimento do botão primário que vive dentro da sidebar (nova solicitação, novo processo). Aponta para `brand-primary`.' },
  { nome: 'sidebar-primary-foreground', uso: 'Rótulo do botão primário da sidebar.', sobre: 'sidebar-primary' },
  { nome: 'sidebar-border', uso: 'Divisor entre a sidebar e o conteúdo, e entre grupos de itens. Decorativo, sem piso de contraste.' },
];

const ESTADO: TokenDocumentado[] = [
  {
    nome: 'state-hover-overlay',
    uso: 'Fundo da linha ou do item sob o ponteiro. Aponta para `accent`: realce sólido em tom de marca nos dois temas.',
    evitar: 'esperar que o hover some à zebra. Desde o Lote 0 ele é sólido e cobre a linha; a zebra volta quando o ponteiro sai.',
  },
  {
    nome: 'state-selected',
    uso: 'Fundo da linha ou do item escolhido pelo usuário. Aponta para `accent` por enquanto; o destino é `accent-forte`, e a troca acontece componente a componente, junto com o rótulo selecionado passando de brand-primary para text-primary.',
  },
  { nome: 'state-disabled-background', uso: 'Preenchimento do controle indisponível.' },
  {
    nome: 'state-disabled-text',
    uso: 'Rótulo do controle indisponível.',
    evitar: 'esconder a ação indisponível. Ela continua visível, e o motivo da indisponibilidade precisa estar dito em algum lugar.',
    sobre: 'state-disabled-background',
  },
  { nome: 'scrim', uso: 'Véu que escurece a página atrás de diálogo, drawer e bloqueio de área.' },
  {
    nome: 'veu-de-realce',
    uso: 'Propriedade registrada com `@property`, que carrega o realce de ponteiro para dentro da linha. O registro com tipo `<color>` é o que a torna interpolável, então o realce entra e sai por transição.',
    evitar:
      'usar como cor de fundo direta. O valor inicial é transparente, e quem pinta a linha é `state-hover-overlay`; este token existe para o realce somar ao fundo de estado que já está lá.',
  },
  {
    nome: 'loading-spinner',
    uso: 'Tinta do indicador de carregamento: giro do botão em espera, do campo que busca no servidor e do bloqueio de área. Acompanha a marca nos dois temas.',
  },
];

const FEEDBACK: TokenDocumentado[] = [
  { nome: 'success-emphasis', uso: 'Preenchimento do controle de confirmação e do indicador de estado concluído.' },
  { nome: 'success-strong', uso: 'Texto de sucesso sobre superfície clara. É tinta, não preenchimento.' },
  { nome: 'success-background', uso: 'Fundo da mensagem e do marcador de sucesso.' },
  { nome: 'danger-emphasis', uso: 'Preenchimento da ação destrutiva e do indicador de erro.' },
  { nome: 'danger-strong', uso: 'Texto de erro sobre superfície clara.' },
  { nome: 'danger-background', uso: 'Fundo da mensagem de erro e do diálogo destrutivo.' },
  { nome: 'warning-emphasis', uso: 'Preenchimento do aviso e do indicador de prazo próximo.' },
  { nome: 'warning-strong', uso: 'Texto de aviso sobre superfície clara.' },
  { nome: 'warning-background', uso: 'Fundo da mensagem de aviso.' },
  { nome: 'info-emphasis', uso: 'Preenchimento e ícone de informação neutra.' },
  { nome: 'info-text', uso: 'Texto de informação sobre superfície clara.' },
  { nome: 'info-background', uso: 'Fundo da mensagem informativa.' },
];

/**
 * A rampa de preenchimento das três severidades, em tabela separada da paleta
 * de feedback porque o critério de escolha é outro: aqui você escolhe o estado
 * do mesmo controle, e ali você escolhe a severidade da mensagem.
 */
const RAMPA_DE_FEEDBACK: TokenDocumentado[] = [
  { nome: 'success-hover', uso: 'Ponteiro sobre o controle de confirmação. No claro escurece (5,02:1 com rótulo branco), no escuro clareia (8,08:1 com rótulo escuro).' },
  { nome: 'success-active', uso: 'Instante em que o controle de confirmação está pressionado. 7,13:1 no claro, 10,57:1 no escuro.' },
  {
    nome: 'success-contrast',
    uso: 'Rótulo por cima de qualquer degrau da rampa de sucesso. Branco no claro, tinta escura no escuro.',
    evitar: 'apontar o rótulo para `text-inverse`. Este token acompanha a rampa, e a rampa inverte a direção entre os temas.',
    sobre: 'success-emphasis',
  },
  { nome: 'danger-hover', uso: 'Ponteiro sobre a ação destrutiva. Escurece nos dois temas, porque o rótulo é branco nos dois: 6,47:1.' },
  { nome: 'danger-active', uso: 'Ação destrutiva pressionada. 8,31:1 com o rótulo branco.' },
  { nome: 'danger-contrast', uso: 'Rótulo por cima da rampa de perigo. Branco nos dois temas.', sobre: 'danger-emphasis' },
  { nome: 'warning-hover', uso: 'Ponteiro sobre o controle de aviso. 5,02:1 no claro, 8,58:1 no escuro.' },
  { nome: 'warning-active', uso: 'Controle de aviso pressionado. 7,09:1 no claro, 12,78:1 no escuro.' },
  { nome: 'warning-contrast', uso: 'Rótulo por cima da rampa de aviso.', sobre: 'warning-emphasis' },
];

/**
 * Proporções de mistura, que a tabela mostra como valor puro porque a amostra
 * de cor só faz sentido depois de aplicada sobre o preenchimento de destino.
 */
const PROPORCAO: TokenDocumentado[] = [
  {
    nome: 'anel-do-botao',
    uso: 'Quanto do preenchimento sobra no anel de 1px do controle cheio, misturado com preto por `color-mix`. Serve a todas as famílias de cor a partir do próprio preenchimento, então o kit inteiro tem um valor só.',
    evitar: 'criar um token de anel por variante. O anel se deriva do preenchimento que o botão já carrega.',
  },
  {
    nome: 'aresta-preenchimento',
    uso: 'Força do reforço branco na aresta superior do controle preenchido, por dentro. Medido em 1,66:1 sobre a marca no claro e 1,61:1 no escuro, que é a faixa em que a aresta aparece na captura sem virar moldura.',
    evitar: 'subir o valor para a aresta "aparecer melhor". Acima dessa faixa o controle ganha um contorno que compete com a borda.',
  },
  {
    nome: 'aresta-tonal',
    uso: 'Quanto da tinta da severidade entra na borda de 1px da superfície tonal de Toast e Message. 30% no claro e 25% no escuro, medidos entre 1,50:1 e 1,95:1 nas quatro severidades.',
  },
  {
    nome: 'pressao-deslocamento',
    uso: 'Quanto o controle desce enquanto está pressionado, e volta ao soltar. 1px é o teto: acima disso o rótulo tremula na leitura.',
    evitar: 'aplicar em elemento que não responde a clique. O deslocamento é resposta de pressão, e num bloco estático ele lê como defeito de layout.',
  },
];

export const Marca: Story = {
  name: 'Marca',
  render: () => (
    <Bloco
      titulo="Marca"
      descricao="O azul Citiesoft e seus estados. Uma tela tem uma única ação primária, então este preenchimento aparece uma vez por tela."
    >
      <TabelaDeTokens tokens={MARCA} especie="cor" legenda="Tokens de marca" />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // O valor é lido do CSS no container de tema, então a tabela mostra o
    // hexadecimal do tema ativo: #1261e4 no claro, #4d8bfc no escuro.
    const tema = containerDeTema(canvasElement);
    const marca = getComputedStyle(tema).getPropertyValue('--citie-brand-primary').trim();
    await expect(marca).toMatch(/^#[0-9a-f]{6}$/);
    await expect(canvas.getByText(marca)).toBeVisible();
    await expect(canvas.getByText(/--citie-brand-primary/)).toBeVisible();
  },
};

export const Texto: Story = {
  name: 'Texto',
  render: () => (
    <Bloco
      titulo="Texto"
      descricao="Três tintas para três prioridades de leitura. A escolha entre elas é decisão de hierarquia: recuar a cor recua a prioridade do que está escrito."
    >
      <TabelaDeTokens tokens={TEXTO} especie="texto" tituloDaAmostra="Sobre a superfície" legenda="Tokens de texto" />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Uma amostra de texto por linha documentada: a contagem sai da própria
    // tabela, para uma linha nova não obrigar a corrigir um número solto aqui.
    await expect(canvas.getAllByText('Texto de exemplo').length).toBe(TEXTO.length);
  },
};

export const Superficies: Story = {
  name: 'Superfícies e fundos',
  render: () => (
    <Bloco
      titulo="Superfícies"
      descricao="Três degraus de profundidade. O fundo da página é o mais recuado, a superfície se ergue sobre ele, e o recuo interno volta a afundar dentro da superfície."
    >
      <TabelaDeTokens tokens={SUPERFICIE} especie="superficie" legenda="Tokens de superfície" />
    </Bloco>
  ),
};

export const Bordas: Story = {
  name: 'Bordas',
  render: () => (
    <Bloco
      titulo="Bordas"
      descricao="Borda de campo e borda decorativa têm exigências diferentes de contraste, e por isso são tokens diferentes."
    >
      <TabelaDeTokens tokens={BORDA} especie="borda" legenda="Tokens de borda" />
      <AchadoAberto>
        A borda de campo media <code>1,21:1</code> sobre o branco e reprovava o mínimo de 3:1
        da WCAG 1.4.11. Corrigida para <code>3,23:1</code> no claro e <code>3,26:1</code> no
        escuro. A correção subiu para o token global, onde vale para os 14 componentes que o
        consomem, com os dois que a descobriram incluídos.
      </AchadoAberto>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    // O tema vive no container do decorador, nunca na raiz do documento:
    // ler a raiz faria esta guarda passar sempre, mesmo no gate escuro.
    const tema = containerDeTema(canvasElement);
    const token = (nome: string) => getComputedStyle(tema).getPropertyValue(`--citie-${nome}`).trim();

    /*
     * Piso de 3:1 da WCAG 1.4.11 para a borda de repouso do campo contra a
     * superfície, nos dois temas. O achado acima registra o número medido em
     * `tokens.css`, mas nenhum teste recalculava esse contraste: um lote
     * futuro podia reintroduzir a borda decorativa (1,21:1) no lugar da
     * borda de campo e a suíte inteira continuaria verde. Esta guarda fecha
     * essa lacuna.
     */
    await expect(
      contraste(token('form-field-border'), token('background-surface')),
    ).toBeGreaterThanOrEqual(3);
  },
};

export const Estados: Story = {
  name: 'Estados de interação',
  render: () => (
    <Bloco
      titulo="Estados"
      descricao="Hover, seleção e indisponibilidade. Hover e seleção apontam para a família accent, então trocar o realce do produto inteiro é trocar dois tokens."
    >
      <TabelaDeTokens tokens={ESTADO} especie="cor" legenda="Tokens de estado" />
    </Bloco>
  ),
};

export const Accent: Story = {
  name: 'Accent, secundário e popover',
  parameters: {
    docs: {
      description: {
        story:
          'As vagas semânticas que o UI Kit Citiesoft introduziu e que não existiam aqui. Accent é o realce de intenção neutra (hover e trilho), secondary é a ação de apoio, popover é a superfície invertida do tooltip. Contraste medido no tema claro: text-primary sobre accent 14,88:1, text-secondary sobre accent 4,51:1, accent-foreground sobre accent 9,32:1, text-primary sobre accent-forte 11,81:1, secondary-foreground sobre secondary 14,94:1, popover-foreground sobre popover 16,29:1. No escuro: 13,55:1, 5,43:1, 9,87:1, 11,42:1, 14,37:1 e 16,91:1. O accent claro ficou em #eff5ff porque o #e4edfd do kit derruba text-secondary para 4,19:1. O accent escuro ficou na matiz de marca (#202838) porque o neutro 900 do kit é a própria zebra da tabela. A guarda desta story recalcula esses contrastes no tema em que a story roda.',
      },
    },
  },
  render: () => (
    <Bloco
      titulo="Accent, secundário e popover"
      descricao="Três papéis novos. O accent substitui o véu translúcido de hover por uma tinta sólida, e é por isso que hover e seleção agora apontam para ele."
    >
      <TabelaDeTokens tokens={ACCENT} especie="cor" legenda="Tokens de accent, secundário e popover" />
      <AchadoAberto>
        No tema claro, <code>accent</code>, <code>brand-subtle</code>, <code>info-background</code> e
        o antigo <code>state-selected</code> pintam a mesma tinta, <code>#eff5ff</code>. A distinção
        entre a linha em hover e a faixa de informação existe só no nome do token. Separar os
        quatro exige escurecer <code>text-secondary</code> para o accent poder descer ao{' '}
        <code>#e4edfd</code> do kit, ou dar cor própria a <code>info-background</code>. Decisão de
        DesignOps.
      </AchadoAberto>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/--citie-accent-forte/)).toBeVisible();
    await expect(canvas.getByText(/--citie-popover-foreground/)).toBeVisible();

    // O tema vive no container do decorador, e a raiz do documento nunca o
    // recebe. Ler o container é o que faz esta guarda rodar de verdade no
    // gate escuro.
    const tema = containerDeTema(canvasElement);
    const token = (nome: string) => getComputedStyle(tema).getPropertyValue(`--citie-${nome}`).trim();

    // Hover e seleção resolvem para o accent.
    await expect(token('state-hover-overlay')).toBe(token('accent'));
    await expect(token('state-selected')).toBe(token('accent'));

    // O accent precisa existir como realce: diferente da superfície e da zebra.
    // Sabotado para #ffffff no claro, a suíte inteira ficava verde.
    await expect(token('accent')).not.toBe(token('background-surface'));
    await expect(token('accent')).not.toBe(token('background-subtle'));
    await expect(token('accent')).not.toBe(token('background-default'));

    // Contraste recalculado no tema ativo. Os pisos são os do critério que
    // escolheu o valor: 4,5:1 para texto (WCAG 1.4.3) e 3:1 para o rótulo de
    // marca, que aqui é lido como componente de interface (WCAG 1.4.11).
    await expect(contraste(token('text-primary'), token('accent'))).toBeGreaterThanOrEqual(4.5);
    await expect(contraste(token('text-secondary'), token('accent'))).toBeGreaterThanOrEqual(4.5);
    await expect(contraste(token('brand-primary'), token('accent'))).toBeGreaterThanOrEqual(3);
    await expect(contraste(token('accent-foreground'), token('accent'))).toBeGreaterThanOrEqual(4.5);
    await expect(contraste(token('text-primary'), token('accent-forte'))).toBeGreaterThanOrEqual(4.5);
    await expect(contraste(token('secondary-foreground'), token('secondary'))).toBeGreaterThanOrEqual(4.5);
    await expect(contraste(token('popover-foreground'), token('popover'))).toBeGreaterThanOrEqual(4.5);

    // A tabela exibe o mesmo valor que o container computa, no tema que estiver ativo.
    const tabela = within(canvas.getByRole('table', { name: 'Tokens de accent, secundário e popover' }));
    await expect(tabela.getByText(token('accent'))).toBeVisible();
  },
};

/** Container do decorador de tema que envolve a story. */
function containerDeTema(canvasElement: HTMLElement): Element {
  return canvasElement.querySelector('[data-theme]') ?? canvasElement.closest('[data-theme]') ?? canvasElement;
}

/**
 * Contraste WCAG entre duas cores escritas como o token as escreve: `#rrggbb`
 * ou `rgb(r, g, b)`. Vive na story porque é guarda de fundação, e a fundação
 * é o único lugar onde o número precisa ser calculado em tempo de teste.
 */
function contraste(frente: string, fundo: string): number {
  const luminancia = (cor: string) => {
    const canais = paraRgb(cor).map((canal) => {
      const c = canal / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * canais[0] + 0.7152 * canais[1] + 0.0722 * canais[2];
  };
  const a = luminancia(frente);
  const b = luminancia(fundo);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

function paraRgb(cor: string): [number, number, number] {
  const hex = cor.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const n = parseInt(hex[1], 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  const rgb = cor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
  if (rgb) return [Number(rgb[1]), Number(rgb[2]), Number(rgb[3])];
  throw new Error(`Cor fora do formato esperado pela guarda: "${cor}"`);
}

export const Sidebar: Story = {
  name: 'Sidebar',
  parameters: {
    docs: {
      description: {
        story:
          'Sete vagas da barra lateral, traduzidas da família de neutros e de marca que já existia. Contraste medido no claro: sidebar-foreground sobre sidebar 10,57:1, sidebar-accent-foreground sobre sidebar-accent 9,32:1, sidebar-primary-foreground sobre sidebar-primary 5,45:1. No escuro: 12,31:1, 13,55:1 e 5,63:1.',
      },
    },
  },
  render: () => (
    <Bloco
      titulo="Sidebar"
      descricao="A barra lateral tem tokens próprios porque ela é a única região que fica na tela o tempo inteiro. Trocar o fundo dela sem mexer no fundo da página precisa ser possível."
    >
      <TabelaDeTokens tokens={SIDEBAR} especie="cor" legenda="Tokens de sidebar" />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText(/--citie-sidebar-border/)).toBeVisible();
    await expect(canvas.getAllByText(/--citie-sidebar/).length).toBe(7);

    const tema = containerDeTema(canvasElement);
    const token = (nome: string) => getComputedStyle(tema).getPropertyValue(`--citie-${nome}`).trim();
    // O item ativo da sidebar usa o accent do tema ativo, lido no container e
    // nunca na raiz; foi a herança do var() na raiz que pintou #84aefd sobre
    // #d6dce4 no AppShell escuro.
    await expect(token('sidebar-accent')).toBe(token('accent'));
    await expect(contraste(token('sidebar-foreground'), token('sidebar'))).toBeGreaterThanOrEqual(4.5);
    await expect(contraste(token('sidebar-accent-foreground'), token('sidebar-accent'))).toBeGreaterThanOrEqual(4.5);
    await expect(contraste(token('sidebar-primary-foreground'), token('sidebar-primary'))).toBeGreaterThanOrEqual(4.5);
  },
};

export const Feedback: Story = {
  name: 'Feedback',
  render: () => (
    <Bloco
      titulo="Feedback"
      descricao="Cada severidade tem três papéis distintos, e confundi-los é o erro mais comum. `emphasis` é preenchimento, `strong` é tinta de texto sobre superfície clara, e `background` é o fundo da mensagem."
    >
      <TabelaDeTokens tokens={FEEDBACK} especie="cor" legenda="Tokens de feedback" />
      <AchadoAberto>
        No tema claro, o repouso de <code>success-emphasis</code> mede <code>3,30:1</code> e o
        de <code>warning-emphasis</code> mede <code>3,19:1</code> com rótulo branco, abaixo dos
        4,5:1 que a WCAG AA exige. Os valores foram mantidos por decisão de não regredir a
        identidade visual, e a decisão de escurecer o repouso ou trocar o rótulo por tinta
        escura pertence ao dono da marca.
      </AchadoAberto>
    </Bloco>
  ),
};

export const RampaDeFeedback: Story = {
  name: 'Rampa de feedback',
  parameters: {
    docs: {
      description: {
        story:
          'Os estados do controle preenchido em cada severidade. A direção da rampa muda com o tema: no claro o estado escurece, e no escuro ele clareia, porque escurecer sobre #141414 aproximaria o controle do fundo até ele sumir. Success e warning trocam o rótulo por tinta escura no tema escuro, o que também conserta o contraste do repouso.',
      },
    },
  },
  render: () => (
    <Bloco
      titulo="Rampa de preenchimento"
      descricao="Hover, pressionado e rótulo, para as três severidades. A família `*-strong` fica fora desta tabela: ela é tinta de texto, e usada como fundo daria 1,87:1 no escuro."
    >
      <TabelaDeTokens tokens={RAMPA_DE_FEEDBACK} especie="cor" legenda="Rampa de preenchimento de feedback" />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tema = containerDeTema(canvasElement);
    const token = (nome: string) => getComputedStyle(tema).getPropertyValue(`--citie-${nome}`).trim();
    // O rótulo de cada rampa passa AA sobre os três degraus da própria família,
    // que é a conta que a decisão de arquitetura de tokens.css protege.
    for (const familia of ['success', 'danger', 'warning']) {
      for (const degrau of ['emphasis', 'hover', 'active']) {
        const medido = contraste(token(`${familia}-contrast`), token(`${familia}-${degrau}`));
        // O repouso de success e de warning no tema claro é o achado aberto do
        // DS, com 3,30:1 e 3,19:1, então o piso conferido aqui é o do indicador.
        await expect(medido).toBeGreaterThanOrEqual(degrau === 'emphasis' ? 3 : 4.5);
      }
    }
    await expect(canvas.getByText(/--citie-warning-contrast/)).toBeVisible();
  },
};

export const Proporcoes: Story = {
  name: 'Proporções de mistura',
  parameters: {
    docs: {
      description: {
        story:
          'Quatro valores que não são cor e mesmo assim governam cor: quanto de tinta entra num anel, numa aresta ou numa borda calculada por `color-mix`, mais o deslocamento de pressão. Cada um tem faixa perceptual medida no comentário do token, porque reforço de 1px não carrega informação e por isso fica fora do piso da WCAG.',
      },
    },
  },
  render: () => (
    <Bloco
      titulo="Proporções"
      descricao="A amostra fica vazia de propósito: uma proporção só ganha cor depois de misturada ao preenchimento de destino, que muda a cada variante."
    >
      <TabelaDeTokens tokens={PROPORCAO} especie="nenhuma" legenda="Proporções de mistura" />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Cada linha prova que o token existe: a tabela escreve "(não definido)"
    // quando o nome documentado não encontra declaração no CSS.
    await expect(canvas.queryAllByText('(não definido)').length).toBe(0);
    await expect(canvas.getByText(/--citie-aresta-tonal/)).toBeVisible();
  },
};

export const NuncaFacaAssim: Story = {
  name: 'Regra · nunca escreva a cor',
  parameters: {
    docs: {
      description: {
        story:
          'O mesmo componente, com token e com literal. Em tema claro os dois parecem iguais, e é justamente por isso que o literal passa despercebido na revisão. Troque para o tema escuro no controle da barra superior: o da direita não acompanha.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--citie-spacing-5)', maxInlineSize: '520px' }}>
      <Bloco titulo="Com token" descricao="Acompanha o tema, porque o valor é resolvido em tempo de execução.">
        <div
          style={{
            background: 'var(--citie-background-surface)',
            color: 'var(--citie-text-base)',
            border: '1px solid var(--citie-border-default)',
            borderRadius: 'var(--citie-radius-xl)',
            padding: 'var(--citie-spacing-5)',
          }}
        >
          Processo 2026/0481 encaminhado à regulação.
        </div>
      </Bloco>

      <Bloco titulo="Com literal" descricao="Congelado no tema claro. É assim que nasce um defeito que só aparece meses depois.">
        <div
          style={{
            background: '#ffffff',
            color: '#3c3c3c',
            border: '1px solid #e8eaed',
            borderRadius: '12px',
            padding: '20px',
          }}
        >
          Processo 2026/0481 encaminhado à regulação.
        </div>
      </Bloco>
    </div>
  ),
};
