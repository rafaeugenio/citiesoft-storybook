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
          'Um card de 16 com uma célula aninhada de 12 e um controle de 8 lê como profundidade.',
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
    uso: 'Controle de formulário e de ação: campo, botão, botão de paginação, item de menu. É o raio de tudo que a pessoa clica ou preenche.',
    evitar:
      'usar em contêiner que envolve outros controles. Campo e moldura no mesmo raio anulam a leitura de dentro e fora.',
  },
  {
    nome: 'radius-lg',
    uso: 'Superfície flutuante que se abre a partir de um controle: menu, menu de contexto, painel de sugestão, dock, área de upload, editor.',
  },
  {
    nome: 'radius-xl',
    uso: 'Camada intermediária dentro de um contêiner externo: card dentro de card, célula de widget, cabeçalho recuado de painel.',
    evitar:
      'usar como raio de card de primeiro nível. Esse é `radius-2xl`, e o card externo precisa ficar acima do que ele contém.',
  },
  {
    nome: 'radius-2xl',
    uso: 'Contêiner externo de primeiro nível: Card, Panel, Fieldset, Widget, Chart, Dialog e Drawer. É o teto da escala.',
  },
  {
    nome: 'radius-full',
    uso: 'Forma pílula, onde o arredondamento total é a identidade do objeto: avatar, badge de contagem, chip de status, trilho e botão de switch, indicador de tendência, botão de fechar circular.',
  },
];

const DIMENSAO: TokenDocumentado[] = [
  {
    nome: 'control-height-small',
    uso: 'Altura de campo e botão em densidade compacta: barra de ferramentas de tabela, filtro embutido, ação dentro de linha.',
  },
  {
    nome: 'control-height-normal',
    uso: 'Altura padrão de campo e botão em formulário. É a altura que alinha rótulo, campo e botão numa mesma linha.',
  },
  {
    nome: 'control-height-large',
    uso: 'Altura de campo e botão em tela de entrada e em formulário de cidadão: login, busca principal, código de verificação, campo com rótulo flutuante.',
  },
  {
    nome: 'touch-target-min',
    uso: 'Piso absoluto de alvo clicável, que é o mínimo de 24 por 24 pixels CSS da WCAG 2.5.8. Aplicado como `min-height` no rótulo de checkbox, radio e switch, e no indicador de carrossel.',
    evitar:
      'tratar 24px como meta. Ele é o piso legal, e o alvo confortável em contexto de cidadão continua sendo 44px.',
  },
  {
    nome: 'touch-target-comfortable',
    uso: 'Alvo recomendado para dedo, em tela de cidadão e em uso móvel: item de navegação da barra lateral, e botão que recebe o modificador de toque confortável.',
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
          'A mesma pilha de três camadas, montada duas vezes. À esquerda o raio desce a cada nível, e o olho lê um card contendo uma célula contendo um controle. À direita os três estão em 16, e a pilha achata: as bordas ficam paralelas e as três caixas passam a parecer três adesivos do mesmo tamanho de canto sobrepostos.',
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
      <Bloco titulo="Raio por camada" descricao="Card 16, célula aninhada 12, controle 8.">
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
            contexto: 'Contêiner externo de primeiro nível',
            valor: 'radius-2xl (16px)',
            exemplo: 'Card, Panel, Fieldset, Widget, Chart, Dialog e Drawer.',
          },
          {
            contexto: 'Camada aninhada dentro do contêiner',
            valor: 'radius-xl (12px)',
            exemplo: 'Card dentro de Card, cabeçalho recuado do Panel, célula de Widget.',
          },
          {
            contexto: 'Superfície flutuante ancorada num controle',
            valor: 'radius-lg (8px)',
            exemplo: 'Menu, ContextMenu, TieredMenu, painel do AutoComplete, Dock, Upload, Editor.',
          },
          {
            contexto: 'Controle de formulário e de ação',
            valor: 'radius-md (6px)',
            exemplo: 'Field em todas as alturas, Button, botão de paginação, segmento de InputOtp.',
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
        O comentário do <code>tokens.css</code> registra a divergência de Panel, Table e Fieldset
        em <code>lg</code> convivendo com Card e Widget em <code>xl</code> na mesma tela. O estado
        atual do código corrigiu parte disso: Panel e Fieldset foram para <code>radius-2xl</code>,
        cada um com o motivo escrito no próprio arquivo, e Card, Widget, Chart e Dialog já estão
        no mesmo degrau. Sobraram <code>.citie-table-wrapper</code> e{' '}
        <code>.citie-treetable-wrapper</code>, ambos em <code>radius-lg</code>. Uma tabela é
        superfície de primeiro nível como o card, então numa tela de listagem com card de resumo
        acima da tabela os dois cantos ficam a 8px de diferença. A correção é apontar os dois
        invólucros para <code>radius-2xl</code>, e o cuidado necessário é que o wrapper usa{' '}
        <code>overflow: auto</code>, então o raio maior corta mais canto da primeira e da última
        célula.
      </AchadoAberto>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Contêiner externo de primeiro nível')).toBeVisible();
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
    await expect(canvas.getByText('32px')).toBeVisible();
    await expect(canvas.getByText('40px')).toBeVisible();
    await expect(canvas.getByText('24px')).toBeVisible();
    await expect(canvas.getByText('44px')).toBeVisible();
  },
};
