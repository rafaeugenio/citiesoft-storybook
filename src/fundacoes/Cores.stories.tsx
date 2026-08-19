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
          '**Como escolher.** Procure pela situação na coluna Uso, e não pela cor que você',
          'quer ver. O nome do token descreve o papel (`text-secondary`, `danger-emphasis`),',
          'nunca a aparência (`cinza-medio`, `vermelho`). É isso que permite trocar a cor no',
          'tema escuro sem trocar uma linha de componente.',
          '',
          '**O valor mostrado é lido do CSS em tempo de execução**, e não copiado para a',
          'tabela. Valor copiado envelhece em silêncio: alguém ajusta o token e a documentação',
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
  { nome: 'border-danger', uso: 'Contorno do campo com erro de validação.' },
];

const ESTADO: TokenDocumentado[] = [
  { nome: 'state-hover-overlay', uso: 'Véu que marca a linha ou o item sob o ponteiro. É translúcido para conviver com o zebrado por baixo.' },
  { nome: 'state-selected', uso: 'Fundo da linha ou do item escolhido pelo usuário. Estado que persiste, ao contrário do hover.' },
  { nome: 'state-disabled-background', uso: 'Preenchimento do controle indisponível.' },
  {
    nome: 'state-disabled-text',
    uso: 'Rótulo do controle indisponível.',
    evitar: 'esconder a ação indisponível. Ela continua visível, e o motivo da indisponibilidade precisa estar dito em algum lugar.',
    sobre: 'state-disabled-background',
  },
  { nome: 'scrim', uso: 'Véu que escurece a página atrás de diálogo, drawer e bloqueio de área.' },
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
    // O valor é lido do CSS, então a tabela mostra o hexadecimal real e não um texto fixo.
    await expect(canvas.getByText('#1261e4')).toBeVisible();
    await expect(canvas.getByText(/--citie-brand-primary/)).toBeVisible();
  },
};

export const Texto: Story = {
  name: 'Texto',
  render: () => (
    <Bloco
      titulo="Texto"
      descricao="Três tintas para três prioridades de leitura. A escolha entre elas é decisão de hierarquia, e não de estética: recuar a cor recua a prioridade do que está escrito."
    >
      <TabelaDeTokens tokens={TEXTO} especie="texto" tituloDaAmostra="Sobre a superfície" legenda="Tokens de texto" />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByText('Texto de exemplo').length).toBe(5);
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
        consomem, em vez de ficar como exceção local em dois deles.
      </AchadoAberto>
    </Bloco>
  ),
};

export const Estados: Story = {
  name: 'Estados de interação',
  render: () => (
    <Bloco
      titulo="Estados"
      descricao="Hover, seleção e indisponibilidade. O hover é véu translúcido de propósito, para conviver com o zebrado da tabela em vez de apagá-lo."
    >
      <TabelaDeTokens tokens={ESTADO} especie="cor" legenda="Tokens de estado" />
    </Bloco>
  ),
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
