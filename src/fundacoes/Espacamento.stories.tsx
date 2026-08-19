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
  title: 'Fundações/Espaçamento',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Toda distância do produto sai desta escala de 4. Nenhum componente escreve pixel.',
          '',
          '**Como escolher.** Comece pela tabela de contexto: você chega com uma situação de',
          'tela (respiro de card, gap entre botões, intervalo entre seções) e sai com o degrau',
          'certo. A escala em si serve depois, quando você já sabe o degrau e quer conferir o',
          'valor ou achar o vizinho acima.',
          '',
          '**A regra do degrau.** Distância interna de um elemento é sempre menor que a',
          'distância entre elementos, que por sua vez é menor que o intervalo entre seções.',
          'Um card com 24px de respiro interno dentro de um grid com 12px de gap faz o olho',
          'ler os cards como coisas separadas grudadas; o gap precisa acompanhar o respiro.',
          '',
          '**O valor mostrado é lido do CSS em tempo de execução**, com a barra desenhada na',
          'largura real do token. A barra carrega a informação: a diferença entre 12 e 16 se',
          'lê no comprimento antes de se ler no número.',
          '',
          '**Regra de ouro:** se a distância que você precisa não está na escala, arredonde',
          'para o degrau vizinho. Cada valor fora da escala que entrou neste catálogo virou',
          'depois um card com respiro diferente do card ao lado na mesma tela.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const ESCALA: TokenDocumentado[] = [
  {
    nome: 'spacing-1',
    uso: 'Costura entre partes do mesmo objeto: subtítulo colado no título de card, ícone de tendência colado ao número, gap interno de chip.',
    evitar: 'usar como gap entre dois componentes distintos. A 4px eles leem como um só.',
  },
  {
    nome: 'spacing-2',
    uso: 'Gap entre ícone e rótulo dentro de um controle, gap entre botões de uma barra de ferramentas, respiro vertical de item de lista e de linha de menu.',
  },
  {
    nome: 'spacing-3',
    uso: 'Respiro horizontal de campo e botão pequenos (32px de altura), respiro horizontal de célula em tabela compacta, gap entre botões de um rodapé de ação, gap do grid de cards do DataView.',
  },
  {
    nome: 'spacing-4',
    uso: 'Respiro horizontal de campo e botão normais (40px de altura), respiro horizontal de célula em tabela normal, respiro interno de card na densidade compacta, gap entre título e ação no cabeçalho de card.',
  },
  {
    nome: 'spacing-5',
    uso: 'Respiro horizontal de campo e botão grandes (48px de altura), recuo interno de aba, respiro de estado vazio e de área de upload.',
    evitar:
      'usar como respiro interno de card. Card confortável usa `spacing-6` e card compacto usa `spacing-4`. O degrau de 20px ficou reservado ao controle grande.',
  },
  {
    nome: 'spacing-6',
    uso: 'Respiro interno de card na densidade confortável, que é o padrão, e o mesmo respiro em Panel, Chart, Fieldset, corpo de Dialog e corpo de Drawer.',
  },
  {
    nome: 'spacing-8',
    uso: 'Intervalo entre seções de página, e folga mínima entre um overlay e a borda da janela em Dialog e ConfirmPopup.',
    evitar: 'usar dentro de um card. A 32px o conteúdo se solta da moldura que deveria contê-lo.',
  },
];

export const Escala: Story = {
  name: 'Escala',
  render: () => (
    <Bloco
      titulo="Escala de 4"
      descricao="Sete degraus, todos múltiplos de 4. A barra tem a largura real do token, então a distância entre dois degraus se lê no comprimento antes de se ler no número."
    >
      <TabelaDeTokens
        tokens={ESCALA}
        especie="espaco"
        tituloDaAmostra="Distância"
        legenda="Escala de espaçamento"
      />
      <AchadoAberto>
        A escala parava em <code>spacing-5: 20px</code>. Como o comentário do próprio{' '}
        <code>tokens.css</code> registra, não existindo token de respiro interno de card, cada
        card escolhia o próprio padding e eles divergiam entre telas: o respiro de 24px já era
        praticado em Card, Panel e Fieldset, só que como literal em cada arquivo. Os degraus{' '}
        <code>spacing-6</code> e <code>spacing-8</code> fecham isso. Repare que a escala pula o
        7: um degrau de 28px ficaria a 4px do vizinho de cada lado e nenhuma decisão de layout
        precisa dessa resolução.
      </AchadoAberto>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Os valores vêm do CSS, então a tabela mostra a escala real e não um texto fixo.
    await expect(canvas.getByText('4px')).toBeVisible();
    await expect(canvas.getByText('20px')).toBeVisible();
    await expect(canvas.getByText('32px')).toBeVisible();
    await expect(canvas.getByText(/--citie-spacing-8/)).toBeVisible();
  },
};

export const PorContexto: Story = {
  name: 'Por contexto de tela',
  parameters: {
    docs: {
      description: {
        story:
          'Entrada pela situação, para quem chega com uma tela na mão em vez de um token. Cada linha foi conferida contra o CSS do componente citado, e onde o código diverge da especificação a divergência está escrita na própria linha.',
      },
    },
  },
  render: () => (
    <Bloco
      titulo="Qual degrau para qual situação"
      descricao="A coluna Onde aparece nomeia o componente que hoje consome aquele valor, para você conferir o precedente antes de repetir."
    >
      <TabelaDeContexto
        legenda="Espaçamento por contexto de tela"
        colunaDoValor="Degrau"
        linhas={[
          {
            contexto: 'Intervalo entre seções de página',
            valor: 'spacing-8 (32px)',
            exemplo:
              'Margem entre os blocos desta própria página de fundação, e folga mínima entre Dialog ou ConfirmPopup e a borda da janela.',
          },
          {
            contexto: 'Gap entre cards de um grid',
            valor: 'spacing-3 (12px)',
            exemplo:
              'Grade do DataView. A especificação estrutural pede spacing-5 aqui, e o componente ficou em spacing-3.',
          },
          {
            contexto: 'Respiro interno de card padrão',
            valor: 'spacing-6 (24px)',
            exemplo:
              'Cabeçalho e corpo do Card na densidade confortável, que é a densidade padrão do componente.',
          },
          {
            contexto: 'Respiro interno de card de destaque',
            valor: 'spacing-6 (24px)',
            exemplo:
              'Panel, Chart, Fieldset, corpo de Dialog e corpo de Drawer. Mesmo degrau do card padrão, pelo motivo registrado no achado abaixo.',
          },
          {
            contexto: 'Respiro interno de card compacto',
            valor: 'spacing-4 (16px)',
            exemplo: 'Card na densidade compacta, cabeçalho e corpo.',
          },
          {
            contexto: 'Respiro de campo',
            valor: 'spacing-3 · spacing-4 · spacing-5',
            exemplo:
              'Padding horizontal do Field e do Button, um degrau por altura: 12px no pequeno de 32px, 16px no normal de 40px, 20px no grande de 48px.',
          },
          {
            contexto: 'Respiro de célula de tabela',
            valor: 'spacing-4 (16px) · spacing-3 (12px)',
            exemplo:
              'Padding horizontal da célula em densidade normal e em compacta. O padding vertical é zero de propósito: a altura da linha vem da altura do elemento, para a linha não crescer quando o conteúdo quebra.',
          },
          {
            contexto: 'Gap entre ícone e rótulo',
            valor: 'spacing-2 (8px)',
            exemplo:
              'Button, Checkbox e Radio, título de Card, Rating, Progress, Slider e Image. É o gap mais repetido do catálogo.',
          },
          {
            contexto: 'Gap entre botões de um grupo',
            valor: 'spacing-2 (8px) · spacing-3 (12px)',
            exemplo:
              'Área do Toolbar usa 8px, porque ali os botões formam um bloco. Rodapé de Card, rodapé de Dialog e barra de ação da tabela usam 12px, porque ali cada botão é uma decisão separada.',
          },
        ]}
      />
      <AchadoAberto>
        Duas linhas acima registram divergência entre a especificação estrutural e o código. A
        primeira: a especificação prevê <code>spacing-5</code> no card padrão e{' '}
        <code>spacing-6</code> só no card de destaque, e o Card implementou{' '}
        <code>spacing-6</code> na densidade confortável, apagando o degrau intermediário. A
        segunda: a especificação pede <code>spacing-5</code> de gap entre cards de um grid, e a
        grade do DataView está em <code>spacing-3</code>, que é gap menor que o respiro interno
        dos próprios cards que ela distribui.
      </AchadoAberto>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Respiro interno de card padrão')).toBeVisible();
    await expect(canvas.getByText('Gap entre botões de um grupo')).toBeVisible();
  },
};

export const NuncaEscolhaONumero: Story = {
  name: 'Regra · nunca escolha o número',
  parameters: {
    docs: {
      description: {
        story:
          'Dois cards lado a lado. O da esquerda tira todas as distâncias da escala; o da direita tem números escolhidos na hora, cada um a poucos pixels de um degrau existente. Isolado, o da direita passa na revisão. Colado ao vizinho na mesma tela, o desalinhamento aparece: o respiro interno, o gap do rodapé e a folga do subtítulo ficam todos fora de compasso.',
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
      <Bloco titulo="Com a escala" descricao="Respiro 24, gap de rodapé 12, folga do subtítulo 4.">
        <div
          style={{
            background: 'var(--citie-background-surface)',
            border: '1px solid var(--citie-border-default)',
            borderRadius: 'var(--citie-radius-2xl)',
            padding: 'var(--citie-spacing-6)',
            color: 'var(--citie-text-base)',
          }}
        >
          <h4
            style={{
              margin: 0,
              fontFamily: 'var(--citie-font-display)',
              fontSize: 'var(--citie-font-size-title-sm)',
              color: 'var(--citie-text-primary)',
            }}
          >
            Processo 2026/0481
          </h4>
          <p
            style={{
              margin: 'var(--citie-spacing-1) 0 0',
              fontSize: 'var(--citie-font-size-body-sm)',
              color: 'var(--citie-text-secondary)',
            }}
          >
            Encaminhado à regulação
          </p>
          <div
            style={{
              display: 'flex',
              gap: 'var(--citie-spacing-3)',
              marginBlockStart: 'var(--citie-spacing-6)',
            }}
          >
            <span style={{ fontSize: 'var(--citie-font-size-body-sm)' }}>Devolver</span>
            <span style={{ fontSize: 'var(--citie-font-size-body-sm)' }}>Aprovar</span>
          </div>
        </div>
      </Bloco>

      <Bloco
        titulo="Com número escolhido"
        descricao="Respiro 22, gap de rodapé 10, folga do subtítulo 5. Nenhum desses três está na escala."
      >
        <div
          style={{
            background: 'var(--citie-background-surface)',
            border: '1px solid var(--citie-border-default)',
            borderRadius: 'var(--citie-radius-2xl)',
            padding: '22px',
            color: 'var(--citie-text-base)',
          }}
        >
          <h4
            style={{
              margin: 0,
              fontFamily: 'var(--citie-font-display)',
              fontSize: 'var(--citie-font-size-title-sm)',
              color: 'var(--citie-text-primary)',
            }}
          >
            Processo 2026/0482
          </h4>
          <p
            style={{
              margin: '5px 0 0',
              fontSize: 'var(--citie-font-size-body-sm)',
              color: 'var(--citie-text-secondary)',
            }}
          >
            Encaminhado à regulação
          </p>
          <div style={{ display: 'flex', gap: '10px', marginBlockStart: '22px' }}>
            <span style={{ fontSize: 'var(--citie-font-size-body-sm)' }}>Devolver</span>
            <span style={{ fontSize: 'var(--citie-font-size-body-sm)' }}>Aprovar</span>
          </div>
        </div>
      </Bloco>
    </div>
  ),
};
