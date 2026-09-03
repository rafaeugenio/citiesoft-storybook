import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import {
  AchadoAberto,
  Bloco,
  TabelaDeContexto,
  TabelaDeTokens,
  type TokenDocumentado,
} from './_ui/TabelaDeTokens';

const meta = {
  title: 'Fundações/Raio e dimensões',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          '**A regra do raio é de camada.** O contêiner externo tem raio maior que o interno.',
          'Um card de 16 com uma célula aninhada de 12 e um controle de 10 lê como profundidade.',
          'Os três com o mesmo raio leem como adesivo colado sobre a tela.',
          '',
          'Por isso a escolha do raio parte da pergunta "o que está por dentro deste elemento",',
          'e nunca de quanto arredondamento fica bonito. Um elemento que só existe dentro de um',
          'card desce pelo menos um degrau em relação a ele.',
          '',
          '**A escala para em 16px de propósito.** Acima disso o canto come área útil de tabela,',
          'e a densidade que um sistema de processo administrativo exige sofre. `radius-full`',
          'fica reservado à forma pílula, onde o arredondamento total é a própria identidade do',
          'objeto: avatar, chip de status, indicador de tendência, trilho de switch.',
          '',
          '**Dimensão é a outra metade desta página.** Altura de controle governa o alinhamento',
          'de uma linha de formulário, e alvo de toque governa se a pessoa consegue acertar o',
          'controle. A WCAG 2.2 exige 24 por 24 pixels CSS no critério 2.5.8, que é obrigação',
          'legal em sistema público, então os dois tokens de toque existem para essa conta',
          'ficar explícita no CSS em vez de ficar na cabeça de quem escreveu a tela.',
          '',
          '**O valor mostrado é lido do CSS em tempo de execução**, e não copiado para a tabela.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const RAIO: TokenDocumentado[] = [
  {
    nome: 'radius-sm',
    uso: 'Elemento mais interno da pilha: caixa de checkbox, chip de filtro, barra de gráfico, marcador de ordenação, extremidade de barra de progresso.',
  },
  {
    nome: 'radius-md',
    uso: 'Item aninhado dentro de uma superfície: item de menu, item de sidebar, linha de lista. Nos componentes ainda não migrados para o UI Kit, continua sendo o raio de campo e botão.',
    evitar:
      'usar em contêiner que envolve outros controles. Campo e moldura no mesmo raio anulam a leitura de dentro e fora.',
  },
  {
    nome: 'radius-lg',
    uso: 'O `radius` de 10px do UI Kit: controle, campo, card, badge, aba, tooltip e superfície flutuante ancorada num controle (menu, painel de sugestão, dock). Os componentes migram para ele por lote.',
  },
  {
    nome: 'radius-xl',
    uso: 'Camada intermediária nos componentes ainda não migrados: célula de widget, cabeçalho recuado de painel. Card, Panel, Fieldset e Dialog já saíram dele para `radius-lg`.',
    evitar:
      'usar em superfície de primeiro nível. O `radius` do kit para card, painel e diálogo é `radius-lg`.',
  },
  {
    nome: 'radius-2xl',
    uso: 'Moldura que envolve a tela: o Drawer lateral e o cartão de conteúdo do shell, os dois medidos em 16 no Sismental. É o teto da escala e o único degrau acima do `radius` do kit.',
    evitar:
      'usar em Card, Panel, Fieldset ou Dialog. Eles ficam em `radius-lg` para se lerem como conteúdo dentro da moldura.',
  },
  {
    nome: 'radius-full',
    uso: 'Forma pílula, onde o arredondamento total é a identidade do objeto: avatar, badge de contagem, chip de status, trilho e botão de switch, indicador de tendência, botão de fechar circular.',
  },
];

const DIMENSAO: TokenDocumentado[] = [
  {
    nome: 'control-height-mini',
    uso: 'Botão e campo dentro de linha de tabela e de badge de ação. É o Mini do UI Kit, 24px, e coincide com o piso de alvo de toque.',
    evitar: 'usar em formulário de cidadão. Mini é para densidade de operador, com mouse.',
  },
  {
    nome: 'control-height-small',
    uso: 'Altura de campo e botão em densidade compacta: barra de ferramentas de tabela, filtro embutido, ação dentro de linha.',
  },
  {
    nome: 'control-height-normal',
    uso: 'Altura padrão de campo e botão em formulário, 36px como no UI Kit. É a altura que alinha rótulo, campo e botão numa mesma linha.',
  },
  {
    nome: 'control-height-large',
    uso: 'Campo de destaque e botão de rodapé de diálogo, 40px. É o Large do UI Kit.',
  },
  {
    nome: 'control-height-xl',
    uso: 'Altura de campo e botão em tela de entrada e em formulário de cidadão: login, busca principal, código de verificação, campo com rótulo flutuante. É o Extra Large do UI Kit, 48px.',
  },
  {
    nome: 'touch-target-min',
    uso: 'Piso absoluto de alvo clicável, que é o mínimo de 24 por 24 pixels CSS da WCAG 2.5.8. Aplicado como `min-height` no rótulo de checkbox, radio e switch, e no indicador de carrossel.',
    evitar:
      'tratar 24px como meta. Ele é o piso legal, e o alvo confortável em contexto de cidadão continua sendo 44px.',
  },
  {
    nome: 'touch-target-comfortable',
    uso: 'Alvo recomendado para dedo, em tela de cidadão e em uso móvel: item de navegação da barra lateral, botão de fechar do Drawer, e botão que recebe o modificador de toque confortável.',
  },
  {
    nome: 'botao-fechar',
    uso: 'Botão de fechar do Dialog, 30px medido no kit e na barra superior do Sismental. Caixa quadrada com ícone de 16 no centro.',
    evitar: 'usar no Drawer, que é alvo de dedo e fica no confortável de 44.',
  },
  {
    nome: 'largura-drawer',
    uso: 'Largura do Drawer lateral na posição `right-md`, 591px medida no drawer de cadastro do Sismental.',
  },
  {
    nome: 'hub-altura',
    uso: 'Altura do card de hub (`Card variante="hub"`), 72px medida no hub de administração do Sismental.',
  },
  {
    nome: 'hub-caixa-de-icone',
    uso: 'Caixa de 36px com fundo accent que abriga o ícone do card de hub.',
  },
  {
    nome: 'hub-icone',
    uso: 'Ícone de 20px dentro da caixa do card de hub.',
  },
  {
    nome: 'hub-raio-da-caixa',
    uso: 'Raio de 8px da caixa do ícone do hub: um degrau abaixo do card de 10, para a caixa se ler como objeto dentro dele.',
    evitar: 'usar fora da caixa do hub. Os degraus da escala de raio continuam sendo 4, 6, 10, 12 e 16.',
  },
  {
    nome: 'linha-mini',
    uso: 'Entrelinha de 16px do texto mini (12/16 do kit), em comprimento: Tooltip e subtítulo do card de hub.',
  },
  {
    nome: 'toast-recuo-de-escala',
    uso: 'Recuo de escala por profundidade na pilha de toasts, 3% por degrau como no Sonner. O toast atrás do mais novo fica em 0,97 e o seguinte em 0,94.',
  },
];

export const Raio: Story = {
  name: 'Raio',
  render: () => (
    <Bloco
      titulo="Escala de raio"
      descricao="Seis degraus, lidos de dentro para fora. Escolha pelo que o elemento contém: quanto mais externo na pilha, maior o raio."
    >
      <TabelaDeTokens tokens={RAIO} especie="raio" tituloDaAmostra="Canto" legenda="Tokens de raio" />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Os valores vêm do CSS, então a tabela mostra a escala real e não um texto fixo.
    await expect(canvas.getByText('4px')).toBeVisible();
    await expect(canvas.getByText('16px')).toBeVisible();
    await expect(canvas.getByText('9999px')).toBeVisible();
  },
};

export const RaioPorCamada: Story = {
  name: 'Regra · o externo é maior que o interno',
  parameters: {
    docs: {
      description: {
        story:
          'A mesma pilha de três camadas, montada duas vezes. À esquerda o raio desce a cada nível (16, 12, 10), e o olho lê um card contendo uma célula contendo um controle. À direita os três estão em 16, e a pilha achata: as bordas ficam paralelas e as três caixas passam a parecer três adesivos do mesmo tamanho de canto sobrepostos.',
      },
    },
  },
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: 'var(--citie-spacing-6)',
        alignItems: 'start',
      }}
    >
      <Bloco titulo="Raio por camada" descricao="Card 16, célula aninhada 12, controle 10.">
        <PilhaDeCamadas externo="var(--citie-radius-2xl)" meio="var(--citie-radius-xl)" interno="var(--citie-radius-lg)" />
      </Bloco>

      <Bloco titulo="Raio único" descricao="Os três em 16, e a profundidade some.">
        <PilhaDeCamadas externo="var(--citie-radius-2xl)" meio="var(--citie-radius-2xl)" interno="var(--citie-radius-2xl)" />
      </Bloco>
    </div>
  ),
};

function PilhaDeCamadas({ externo, meio, interno }: { externo: string; meio: string; interno: string }) {
  return (
    <div
      style={{
        background: 'var(--citie-background-surface)',
        border: '1px solid var(--citie-border-default)',
        borderRadius: externo,
        padding: 'var(--citie-spacing-4)',
        color: 'var(--citie-text-base)',
      }}
    >
      <div
        style={{
          background: 'var(--citie-background-subtle)',
          border: '1px solid var(--citie-border-default)',
          borderRadius: meio,
          padding: 'var(--citie-spacing-4)',
          display: 'grid',
          gap: 'var(--citie-spacing-3)',
        }}
      >
        <span style={{ fontSize: 'var(--citie-font-size-body-sm)', color: 'var(--citie-text-secondary)' }}>
          Prazo de análise
        </span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            blockSize: 'var(--citie-control-height-normal)',
            paddingInline: 'var(--citie-spacing-4)',
            background: 'var(--citie-background-surface)',
            border: '1px solid var(--citie-form-field-border)',
            borderRadius: interno,
            fontSize: 'var(--citie-font-size-body-md)',
          }}
        >
          15 dias úteis
        </span>
      </div>
    </div>
  );
}

export const RaioPorContexto: Story = {
  name: 'Raio por contexto de tela',
  render: () => (
    <Bloco
      titulo="Qual raio para qual camada"
      descricao="Cada linha nomeia o componente que hoje consome aquele degrau, para você conferir o precedente antes de repetir."
    >
      <TabelaDeContexto
        legenda="Raio por contexto de tela"
        colunaDoValor="Degrau"
        linhas={[
          {
            contexto: 'Moldura que envolve a tela',
            valor: 'radius-2xl (16px)',
            exemplo: 'Drawer lateral e cartão de conteúdo do shell.',
          },
          {
            contexto: 'Superfície de primeiro nível',
            valor: 'radius-lg (10px)',
            exemplo:
              'Card, Panel, Fieldset, Dialog, Toast, Message e EmptyState com moldura. Widget e Chart migram no lote deles.',
          },
          {
            contexto: 'Camada aninhada nos componentes ainda não migrados',
            valor: 'radius-xl (12px)',
            exemplo: 'Célula de Widget, cabeçalho recuado do Panel antigo.',
          },
          {
            contexto: 'Superfície flutuante ancorada num controle',
            valor: 'radius-lg (10px)',
            exemplo:
              'Tooltip, Popover, HoverCard, ConfirmPopup, Menu, ContextMenu, TieredMenu, painel do AutoComplete, Dock, Upload, Editor.',
          },
          {
            contexto: 'Controle de formulário e de ação',
            valor: 'radius-lg (10px), destino do UI Kit',
            exemplo:
              'Field em todas as alturas, Button, Badge, aba e tooltip. Até cada lote migrar, esses componentes ainda consomem radius-md (6px).',
          },
          {
            contexto: 'Item aninhado numa superfície',
            valor: 'radius-md (6px)',
            exemplo:
              'Item de menu, item de sidebar, linha de Listbox, botão de paginação, segmento de InputOtp, Card dentro de Card, linha do Skeleton.',
          },
          {
            contexto: 'Elemento mais interno da pilha',
            valor: 'radius-sm (4px)',
            exemplo: 'Caixa de checkbox, marcador de ordenação da tabela, barra e legenda de Chart.',
          },
          {
            contexto: 'Forma pílula',
            valor: 'radius-full',
            exemplo: 'Avatar, badge de contagem, chip de status, trilho e botão de switch, indicador de tendência do Widget.',
          },
        ]}
      />
      <AchadoAberto>
        Card, Panel, Fieldset, Dialog e as superfícies flutuantes estão em <code>radius-lg</code>{' '}
        desde o Lote 3, que fechou a divergência de raio registrada antes em{' '}
        <code>tokens.css</code>. O que ainda diverge: Widget e Chart continuam em{' '}
        <code>radius-2xl</code> e Table e TreeTable em <code>radius-lg</code>, então numa tela de
        painel o widget fica com o canto 6px acima do card ao lado. Os quatro migram no Lote 5, e
        o destino de todos é o mesmo <code>radius-lg</code>.
      </AchadoAberto>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Controle de formulário e de ação')).toBeVisible();
    await expect(canvas.getByText('Forma pílula')).toBeVisible();
  },
};

export const Dimensoes: Story = {
  name: 'Altura de controle e alvo de toque',
  render: () => (
    <Bloco
      titulo="Dimensões"
      descricao="Altura de controle resolve alinhamento, e alvo de toque resolve acerto. São contas diferentes, e um controle pode passar na primeira e falhar na segunda."
    >
      <TabelaDeTokens tokens={DIMENSAO} especie="nenhuma" legenda="Tokens de dimensão" />
      <AchadoAberto>
        A WCAG 2.2 exige, no critério 2.5.8 Target Size (Minimum), que todo alvo de ponteiro meça
        ao menos 24 por 24 pixels CSS, e a exigência vale para o alvo clicável inteiro e não para
        o desenho visível. Dois pontos do catálogo ficam no limite dessa conta. Primeiro: a caixa
        de checkbox e de radio mede 18 por 18 pixels, e o trilho de switch mede 35 por 21. Os três
        só alcançam os 24px porque o rótulo em volta carrega <code>min-height</code> de{' '}
        <code>touch-target-min</code> e é clicável junto. Quando o rótulo é visualmente oculto,
        como no checkbox de selecionar a página inteira no cabeçalho da tabela, o alvo passa por
        margem estreita e a área que a pessoa enxerga continua sendo a caixa de 18px. Segundo: o
        botão da paginação mede 36 por 36 e o da variante ampliada mede 44 por 44, ambos escritos
        como literal, sem consumir <code>touch-target-comfortable</code>, que é justamente o token
        de 44px. Os 44px do Button também dependem do modificador{' '}
        <code>citie-button--touch-comfortable</code>, que é opcional, então um botão pequeno de
        32px em tela de cidadão passa no mínimo legal e fica abaixo do alvo recomendado sem que
        nada acuse.
      </AchadoAberto>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Os valores vêm do CSS, então a tabela mostra as dimensões reais.
    // A tabela recebe tokens de outros lotes (hub, drawer, botão de fechar),
    // então cada altura é conferida por presença, com contagem mínima.
    for (const altura of ['32px', '36px', '40px', '48px', '44px']) {
      await expect(canvas.getAllByText(altura).length).toBeGreaterThanOrEqual(1);
    }
    // 24px aparece ao menos duas vezes: altura Mini e piso de alvo de toque.
    await expect(canvas.getAllByText('24px').length).toBeGreaterThanOrEqual(2);
  },
};
