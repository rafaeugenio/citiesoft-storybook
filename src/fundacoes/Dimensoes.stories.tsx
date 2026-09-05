import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  AchadoAberto,
  Bloco,
  TabelaDeTokens,
  type TokenDocumentado,
} from './_ui/TabelaDeTokens';

/**
 * Página de dimensão que não cabe em escala.
 *
 * Altura de controle, alvo de toque e espaçamento têm escada própria e vivem
 * nas páginas de Raio e de Espaçamento. O que sobra é a medida de uma peça só,
 * nascida de uma captura do UI Kit ou do Sismental: a caixa de ícone do hub, a
 * largura do drawer, a barra superior do shell. Cada uma existe como token pelo
 * mesmo motivo: número medido uma vez e escrito em dois arquivos diverge, e a
 * divergência aparece meses depois como um alinhamento torto que ninguém sabe
 * explicar.
 */
const meta = {
  title: 'Fundações/Dimensões',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '**Medida de peça.** Altura de controle, alvo de toque,',
          'espaçamento e raio têm escada própria nas páginas de Raio e de Espaçamento. Aqui',
          'ficam as dimensões que pertencem a um componente só ou à moldura da tela, cada uma',
          'medida no UI Kit do Figma ou na composição do Sismental.',
          '',
          '**Por que virar token.** Um número medido uma vez e escrito em dois arquivos diverge.',
          'A largura máxima de célula chegou a ser 320px na Table e 360px na TreeTable, sem',
          'motivo declarado, e a largura da sidebar existia como literal em `Sidebar.css` enquanto',
          'o shell precisava do mesmo valor para deslocar o drawer.',
          '',
          '**Nenhuma delas muda com o tema.** São grandezas dimensionais, então o bloco',
          "`[data-theme='dark']` de `tokens.css` não as redeclara, e a amostra desta página fica",
          'vazia de propósito: o que documenta a medida é o valor lido do CSS, na coluna ao lado.',
          '',
          '**O valor mostrado é lido do CSS em tempo de execução.** Se o token deixar de existir,',
          'a linha passa a mostrar que ele não está definido.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const COMPONENTE: TokenDocumentado[] = [
  {
    nome: 'hub-altura',
    uso: 'Altura do card de hub (`Card variante="hub"`), 72px medida no hub de administração do Sismental. Cabe ícone, título de 14 e subtítulo de 12 numa linha só.',
  },
  {
    nome: 'hub-caixa-de-icone',
    uso: 'Caixa de 36px com fundo accent que abriga o ícone do card de hub. O raio dela está na escala de raio, como `hub-raio-da-caixa`.',
  },
  {
    nome: 'hub-icone',
    uso: 'Ícone de 20px no centro da caixa do hub. É o degrau de ícone de superfície, acima do ícone de linha de 16.',
  },
  {
    nome: 'botao-fechar',
    uso: 'Botão de fechar do Dialog, 30px medido no kit e na barra superior do Sismental. Caixa quadrada com ícone de 16 no centro, acima do piso de 24 da WCAG 2.5.8.',
    evitar: 'usar no Drawer. Ali o alvo é de dedo, e a medida é o confortável de 44.',
  },
  {
    nome: 'largura-drawer',
    uso: 'Largura do Drawer lateral na posição `right-md`, 591px medida no drawer de cadastro do Sismental. Cabe um formulário de duas colunas sem quebrar rótulo.',
  },
  {
    nome: 'icone-de-linha',
    uso: 'Ícone dentro de linha e de item: chevron de Tree e de TreeTable, seta de ordenação do cabeçalho, marcador de item de Listbox. 16px medido no kit.',
    evitar: 'subir para 20 dentro de célula. O ícone de 20 é o de superfície, e numa célula de 44 ele passa a competir com o dado.',
  },
  {
    nome: 'marcador-da-linha-do-tempo',
    uso: 'Diâmetro do círculo vazado do Timeline, 12px medido na evolução do prontuário do Sismental. O traço dele reaproveita `espessura-indicador`.',
  },
  {
    nome: 'largura-minima-do-card-de-grade',
    uso: 'Piso da coluna na grade do DataView, 280px. Com gap de 12, a largura de conteúdo do Sismental fecha em 3 colunas e só passa a 4 a partir de 1156px.',
    evitar: 'baixar para caber mais cards. Com 240 a mesma largura dava 4 colunas de 268, estreitas para o título de duas linhas.',
  },
  {
    nome: 'alert-dialog-caixa-de-icone',
    uso: 'Caixa de severidade do AlertDialog, 40px. Um degrau acima da caixa do hub, porque aqui o ícone carrega a severidade sozinho.',
  },
  {
    nome: 'alert-dialog-icone',
    uso: 'Ícone de 20px dentro da caixa de severidade do AlertDialog.',
  },
  {
    nome: 'largura-alert-dialog',
    uso: 'Largura do AlertDialog, 480px. Um degrau acima do ConfirmDialog de 400, porque a caixa de ícone ao lado do título pede mais respiro lateral.',
  },
  {
    nome: 'largura-toast',
    uso: 'Largura do Toast e da pilha que o abriga, 350px. Os dois precisam concordar entre si, e antes o número estava repetido como literal em dois seletores.',
  },
  {
    nome: 'toast-recuo-de-escala',
    uso: 'Recuo de escala por profundidade na pilha de toasts, 3% por degrau como no Sonner. O toast atrás do mais novo fica em 0,97 e o seguinte em 0,94.',
    evitar: 'subir o passo para a pilha ficar mais evidente. Acima de 3% o texto do toast de trás deixa de ser legível.',
  },
  {
    nome: 'espessura-indicador',
    uso: 'Traço de "você está aqui" na navegação: sublinhado da aba ativa e barra lateral da variante vertical. 2px, um valor só para o peso não divergir entre Tabs, Sidebar e afins.',
  },
];

const LINHA_DE_TABELA: TokenDocumentado[] = [
  {
    nome: 'altura-de-linha-confortavel',
    uso: 'Altura da linha de tabela em densidade padrão, 44px medida na célula do UI Kit. Fecha a conta do controle de 36 com 4 de respiro por lado.',
  },
  {
    nome: 'altura-de-linha-compacta',
    uso: 'Altura da linha em densidade compacta, 36px, a mesma do controle padrão. Um botão dentro dela desce para 32 pela regra da densidade.',
  },
  {
    nome: 'linha-da-celula',
    uso: 'Caixa de uma linha de texto dentro da célula, 20px, em comprimento. N linhas medem N × 20 exatos, e a base das linhas abaixo não escorrega.',
    evitar:
      'trocar por proporção. Com 1.4 sobre corpo de 14 a caixa mede 19,6px, e uma célula de duas linhas caiu em 41,39px contra 37,00px das vizinhas.',
  },
  {
    nome: 'largura-maxima-da-celula',
    uso: 'Teto de largura da célula de texto longo, 320px, depois do qual o conteúdo trunca. Estava duplicado como literal, com 320 na Table e 360 na TreeTable.',
  },
  {
    nome: 'largura-da-coluna-de-selecao',
    uso: 'Coluna fixa do checkbox de seleção da tabela, 48px. Cabe a caixa de 18 com o alvo de toque em volta.',
  },
  {
    nome: 'espessura-do-trilho',
    uso: 'Trilho vertical na borda de início da linha, 3px, que marca seleção e destaque por condição do dado.',
    evitar:
      'reaproveitar `espessura-indicador` aqui. O trilho da linha precisa se ler numa varredura vertical de dezenas de linhas, e 2px se perde nela.',
  },
  {
    nome: 'camada-cabecalho-fixo',
    uso: 'Camada de empilhamento do cabeçalho fixo de tabela, 1020. Estava como literal nos dois arquivos de tabela, sem escala declarada em lugar nenhum.',
  },
];

const SHELL: TokenDocumentado[] = [
  {
    nome: 'altura-da-barra',
    uso: 'Barra superior do shell, 52px medida na listagem de prontuários do Sismental. Cabem logo, trilha, busca, notificações em botão de 30 e avatar de 32.',
  },
  {
    nome: 'largura-da-sidebar',
    uso: 'Coluna de navegação fixa, 257px medida no Sismental. O shell usa o mesmo número para a coluna e para o deslocamento do drawer.',
  },
  {
    nome: 'avatar-da-barra',
    uso: 'Avatar do slot de perfil na barra superior, 32px medido no Sismental.',
    evitar:
      'esperar o mesmo degrau no átomo Avatar. Ele tem 28, 42 e 56, e a falta do 32 está registrada como lacuna do design system.',
  },
  {
    nome: 'margem-da-moldura',
    uso: 'Distância entre o cartão de conteúdo e o fundo da página, 8px, nas telas de formulário e de administração. É o que faz a moldura de raio 16 se ler como camada.',
  },
  {
    nome: 'margem-do-acesso',
    uso: 'Distância entre o cartão de acesso e a borda da tela, 10px. Um degrau acima da moldura comum, porque na tela de entrada o cartão ocupa a tela inteira.',
  },
  {
    nome: 'largura-da-navegacao-de-secoes',
    uso: 'Coluna de navegação de seções do formulário longo, 216px. O maior rótulo do Sismental cabe em uma linha, e a coluna soma ao gap de 32.',
  },
  {
    nome: 'largura-do-painel-de-marca',
    uso: 'Painel de marca do cartão de acesso, 38% da largura. Abaixo de 900px ele some e o formulário ocupa o cartão sozinho.',
    evitar: 'fixar em pixel. A proporção é o que mantém o painel equilibrado entre 900px e a tela larga de 1420.',
  },
];

export const Componente: Story = {
  name: 'Dimensões de componente',
  render: () => (
    <Bloco
      titulo="Dimensões de componente"
      descricao="Medida que pertence a uma peça só. Cada valor veio de uma captura do UI Kit ou do Sismental, e o comentário do token em tokens.css guarda onde ele foi medido."
    >
      <TabelaDeTokens tokens={COMPONENTE} especie="nenhuma" legenda="Dimensões de componente" />
      <AchadoAberto>
        O átomo <code>Avatar</code> tem degraus de 28, 42 e 56 e nenhum em 32, então o shell aplica
        a medida da barra pelo token <code>avatar-da-barra</code>, já que nenhum degrau do átomo
        fecha em 32. A lacuna fica registrada aqui: enquanto o degrau de 32 não existir no Avatar,
        qualquer outra tela que precise de um avatar dessa altura vai repetir a mesma exceção
        local, que é como o número volta a divergir.
      </AchadoAberto>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Cada linha prova que o token existe: a tabela escreve "(não definido)"
    // quando o nome documentado não encontra declaração no CSS.
    await expect(canvas.queryAllByText('(não definido)').length).toBe(0);
    // Os valores vêm do CSS, então a tabela mostra a medida real do kit.
    await expect(canvas.getByText('72px')).toBeVisible();
    await expect(canvas.getByText('591px')).toBeVisible();
    await expect(canvas.getByText('480px')).toBeVisible();
  },
};

export const LinhaDeTabela: Story = {
  name: 'Anatomia da linha de tabela',
  parameters: {
    docs: {
      description: {
        story:
          'Os sete valores que governam a linha de tabela, antes duplicados como literais entre Table.css e TreeTable.css. A duplicata já tinha divergido num deles, com a largura máxima de célula em 320px numa e 360px na outra.',
      },
    },
  },
  render: () => (
    <Bloco
      titulo="Linha de tabela"
      descricao="Altura, caixa de linha, tetos de largura e camada do cabeçalho fixo. A TreeTable herda quase tudo da Table, então os dois arquivos precisam ler o mesmo número."
    >
      <TabelaDeTokens tokens={LINHA_DE_TABELA} especie="nenhuma" legenda="Anatomia da linha de tabela" />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryAllByText('(não definido)').length).toBe(0);
    const estilo = getComputedStyle(canvasElement.ownerDocument.documentElement);
    // A caixa de linha fica em comprimento, e é isso que faz N linhas medirem
    // N × 20 inteiros. Em proporção o valor não teria unidade de pixel.
    await expect(estilo.getPropertyValue('--citie-linha-da-celula').trim()).toMatch(/px$/);
    // A confortável fica acima da compacta, e as duas acima do controle padrão
    // que mora dentro delas.
    const numero = (token: string) => Number.parseFloat(estilo.getPropertyValue(token));
    await expect(numero('--citie-altura-de-linha-confortavel')).toBeGreaterThan(
      numero('--citie-altura-de-linha-compacta'),
    );
    await expect(numero('--citie-altura-de-linha-compacta')).toBeGreaterThanOrEqual(
      numero('--citie-control-height-normal'),
    );
  },
};

export const Shell: Story = {
  name: 'Dimensões de shell',
  parameters: {
    docs: {
      description: {
        story:
          'A moldura que envolve a tela inteira: barra superior, coluna de navegação, margem do cartão de conteúdo e colunas do formulário longo. Todas medidas na composição do Sismental.',
      },
    },
  },
  render: () => (
    <Bloco
      titulo="Dimensões de shell"
      descricao="O shell é a única região que fica na tela o tempo inteiro, então as medidas dele governam o alinhamento de todas as telas ao mesmo tempo."
    >
      <TabelaDeTokens tokens={SHELL} especie="nenhuma" legenda="Dimensões de shell" />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.queryAllByText('(não definido)').length).toBe(0);
    await expect(canvas.getByText('52px')).toBeVisible();
    await expect(canvas.getByText('257px')).toBeVisible();
    // O painel de marca fica em proporção, para acompanhar a largura do cartão.
    await expect(canvas.getByText('38%')).toBeVisible();
  },
};
