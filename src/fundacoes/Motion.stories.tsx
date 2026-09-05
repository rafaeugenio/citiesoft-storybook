import { useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Button } from '../components/atoms/Button/Button';
import {
  AchadoAberto,
  Bloco,
  TabelaDeContexto,
  TabelaDeTokens,
  type TokenDocumentado,
} from './_ui/TabelaDeTokens';

const meta = {
  title: 'Fundações/Motion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'A escala de motion é de intenção, e o autor escolhe pelo que o movimento significa na',
          'tela. `motion-rapido` quer dizer "resposta ao ponteiro". O número pode',
          'ser recalibrado num lugar só, e as 38 telas que consomem aquele degrau acompanham.',
          '',
          'Antes não existia token nenhum de tempo, então cada componente repetia `120ms ease-out`',
          'como literal ou inventava o próprio tempo, e a mesma tela abria um menu em 120ms e um',
          'acordeão em 300ms sem que ninguém tivesse decidido isso.',
          '',
          '**Quatro regras valem em todo o catálogo:**',
          '',
          '1. **Entrada é mais lenta que saída.** O que entra precisa ser percebido, e o que sai já',
          'foi decidido pelo usuário. É por isso que existem duas curvas separadas.',
          '2. **Nada anima posição em lista longa.** Tabela, árvore e lista de resultado mudam de',
          'conteúdo sem deslizar linha. Movimento de posição em lista de centenas de itens custa',
          'quadro e atrapalha a leitura de quem está conferindo dado.',
          '3. **Todo componente com transição respeita `prefers-reduced-motion: reduce`**, zerando a',
          'duração. Os 54 arquivos de estilo do catálogo que animam alguma coisa têm essa regra.',
          '4. **Movimento nunca é a única pista de mudança de estado.** Quem tem movimento reduzido',
          'ligado precisa receber a mesma informação por cor, ícone, texto ou posição final.',
          '',
          '**O valor mostrado é lido do CSS em tempo de execução**, e a amostra percorre a',
          'distância usando a duração ou a curva do próprio token, em laço.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

const DURACAO: TokenDocumentado[] = [
  {
    nome: 'motion-instantaneo',
    uso: 'Realimentação de pressão: o instante em que o controle é apertado e volta. Curto a ponto de a pessoa registrar que o clique chegou sem esperar por nada.',
    evitar:
      'usar para abrir camada. Em 80ms o menu aparece de uma vez, e o olho perde de onde ele veio.',
  },
  {
    nome: 'motion-rapido',
    uso: 'Hover e foco: mudança de cor, de borda, de sombra e de anel em botão, link, campo, linha de tabela, item de menu, card clicável. É o degrau mais consumido do catálogo.',
  },
  {
    nome: 'motion-padrao',
    uso: 'Abrir e fechar de camada média: acordeão, painel colapsável, popover, tooltip, aba que troca de conteúdo, barra de progresso que avança.',
  },
  {
    nome: 'motion-lento',
    uso: 'Camada alta que ocupa área grande da tela: entrada de diálogo, entrada de drawer, avanço de slide no carrossel. Área grande percorre distância grande, e o tempo maior evita o salto.',
    evitar:
      'usar em resposta a hover. Meio segundo de espera em cima de um botão faz a interface parecer travada.',
  },
  {
    nome: 'motion-ciclo-varredura',
    uso: 'Ciclo da varredura de carregamento do Skeleton. Fica fora da escada acima porque mede a duração de uma espera contínua, e os quatro degraus medem uma mudança de estado.',
    evitar:
      'usar em transição de estado. Uma mudança que leva 1400ms passa de resposta a espera, e a pessoa deixa de associar o movimento ao próprio clique.',
  },
];

const CURVA: TokenDocumentado[] = [
  {
    nome: 'easing-entrada',
    uso: 'Elemento que chega: diálogo, drawer, menu, tooltip, popover. Começa veloz e desacelera até parar, então o olho alcança o elemento antes de ele assentar.',
  },
  {
    nome: 'easing-saida',
    uso: 'Elemento que sai de cena. Acelera até desaparecer, porque a pessoa já decidiu fechar. Hoje nenhum arquivo do catálogo consome este token.',
    evitar:
      'usar em elemento que chega. A curva de saída termina em velocidade máxima, e um elemento que entra assim aparece de sopetão no fim do percurso.',
  },
  {
    nome: 'easing-padrao',
    uso: 'Curva de uso geral para transição de estado que começa e termina na tela: cor, borda, sombra, opacidade, altura de painel. É a escolha padrão quando o elemento não entra nem sai.',
  },
];

export const Duracoes: Story = {
  name: 'Durações',
  render: () => (
    <Bloco
      titulo="Durações"
      descricao="Quatro degraus de mudança de estado, cada um amarrado a um tipo de acontecimento na tela, mais o ciclo da espera contínua. Escolha pelo acontecimento, e o número vem junto."
    >
      <TabelaDeTokens
        tokens={DURACAO}
        especie="motion"
        tituloDaAmostra="Percurso"
        legenda="Tokens de duração"
      />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // O valor é lido do CSS, então a tabela mostra a duração real do tema ativo.
    await expect(canvas.getByText('80ms')).toBeVisible();
    await expect(canvas.getByText('140ms')).toBeVisible();
    await expect(canvas.getByText('220ms')).toBeVisible();
    await expect(canvas.getByText('320ms')).toBeVisible();
    await expect(canvas.getByText('1400ms')).toBeVisible();
  },
};

export const Curvas: Story = {
  name: 'Curvas',
  render: () => (
    <Bloco
      titulo="Curvas"
      descricao="A curva diz o que acontece dentro da duração. Nas amostras abaixo as três percorrem o mesmo tempo, e a diferença está em onde cada uma gasta esse tempo."
    >
      <TabelaDeTokens
        tokens={CURVA}
        especie="motion"
        tituloDaAmostra="Percurso"
        legenda="Tokens de curva"
      />
      <AchadoAberto>
        <code>--citie-easing-saida</code> foi criado e está com{' '}
        <strong>zero consumidores em componente</strong> (o único uso é a demonstração desta
        própria página), contra 10 arquivos de{' '}
        <code>easing-entrada</code> e 42 de <code>easing-padrao</code>. A consequência atinge a
        regra nº 1 desta página: se ninguém aplica a curva de saída, a promessa de que entrada e
        saída têm tempos diferentes vale só na entrada. Dialog e Drawer, por exemplo, animam a
        chegada com <code>easing-entrada</code> e somem sem transição nenhuma. Resolver isso pede
        decisão de quem cuida do motion: aplicar a curva no fechamento das camadas altas, ou
        remover o token e assumir que o catálogo trabalha com duas curvas.
      </AchadoAberto>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const estilo = getComputedStyle(canvasElement.ownerDocument.documentElement);
    // Entrada desacelera até parar, e saída acelera até sumir: o segundo par de
    // pontos de controle é o que separa as duas.
    await expect(estilo.getPropertyValue('--citie-easing-entrada').trim()).toBe(
      'cubic-bezier(0, 0, 0.2, 1)',
    );
    await expect(estilo.getPropertyValue('--citie-easing-saida').trim()).toBe(
      'cubic-bezier(0.4, 0, 1, 1)',
    );
    await expect(canvas.getByText(/--citie-easing-padrao/)).toBeVisible();
  },
};

function Comparativo() {
  const [rodada, setRodada] = useState(0);
  const [movido, setMovido] = useState(false);

  const disparar = () => {
    setRodada((n) => n + 1);
    setMovido(false);
    // O quadro seguinte garante que a transição parta da posição inicial.
    requestAnimationFrame(() => requestAnimationFrame(() => setMovido(true)));
  };

  // A primeira passagem roda sozinha: quem abre a story vê a comparação sem
  // precisar descobrir que existe um botão.
  useEffect(() => {
    const quadro = requestAnimationFrame(() => setMovido(true));
    return () => cancelAnimationFrame(quadro);
  }, []);

  const degraus = [
    { nome: 'motion-instantaneo', papel: 'Pressão do controle' },
    { nome: 'motion-rapido', papel: 'Hover e foco' },
    { nome: 'motion-padrao', papel: 'Acordeão e popover' },
    { nome: 'motion-lento', papel: 'Drawer e diálogo' },
  ];

  return (
    <div style={{ display: 'grid', gap: 'var(--citie-spacing-4)', maxInlineSize: '560px' }}>
      <style>{`
        .citie-doc-pista {
          position: relative;
          block-size: 24px;
          background: var(--citie-background-subtle);
          border-radius: var(--citie-radius-full);
          overflow: hidden;
        }
        .citie-doc-pista__marcador {
          position: absolute;
          inset-block: 4px;
          inline-size: 32px;
          border-radius: var(--citie-radius-full);
          background: var(--citie-brand-primary);
          /* A posição percorre a largura da pista, então a medida é do pai. */
          inset-inline-start: 0;
          transition-property: inset-inline-start;
          transition-timing-function: var(--citie-easing-padrao);
        }
        .citie-doc-pista__marcador--fim { inset-inline-start: calc(100% - 32px); }
        @media (prefers-reduced-motion: reduce) {
          .citie-doc-pista__marcador { transition: none; }
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--citie-spacing-3)' }}>
        <Button variant="secondary" onClick={disparar}>
          Disparar de novo
        </Button>
        <span
          style={{
            fontFamily: 'var(--citie-font-ui)',
            fontSize: 'var(--citie-font-size-body-sm)',
            color: 'var(--citie-text-secondary)',
          }}
        >
          Rodada {rodada}
        </span>
      </div>

      {degraus.map((degrau) => (
        <div key={degrau.nome} style={{ display: 'grid', gap: 'var(--citie-spacing-1)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontFamily: 'var(--citie-font-ui)',
              fontSize: 'var(--citie-font-size-body-xs)',
              color: 'var(--citie-text-secondary)',
            }}
          >
            <code style={{ color: 'var(--citie-brand-primary)' }}>--citie-{degrau.nome}</code>
            <span>{degrau.papel}</span>
          </div>
          <div className="citie-doc-pista">
            <span
              className={`citie-doc-pista__marcador${movido ? ' citie-doc-pista__marcador--fim' : ''}`}
              style={{ transitionDuration: `var(--citie-${degrau.nome})` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export const QuatroTemposLadoALado: Story = {
  name: 'Comparativo · os quatro tempos',
  parameters: {
    docs: {
      description: {
        story:
          'A mesma transição, disparada ao mesmo tempo nos quatro degraus, para você sentir a diferença lado a lado, sem precisar deduzi-la dos números. Use o botão para repetir. Com movimento reduzido ligado no sistema, os quatro marcadores saltam direto para a posição final, que é justamente o comportamento que o catálogo entrega.',
      },
    },
  },
  render: () => <Comparativo />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const repetir = canvas.getByRole('button', { name: 'Disparar de novo' });
    await expect(repetir).toBeVisible();
    await expect(canvas.getByText(/--citie-motion-lento/)).toBeVisible();
  },
};

export const PorContexto: Story = {
  name: 'Escolha por contexto',
  parameters: {
    docs: {
      description: {
        story:
          'Entre pela situação de tela. A coluna da direita indica onde o mesmo par já está aplicado no catálogo, para servir de referência de implementação.',
      },
    },
  },
  render: () => (
    <Bloco
      titulo="Da situação para o par duração + curva"
      descricao="Motion se escreve em par. A duração diz quanto tempo, e a curva diz como o tempo é gasto. Escolher uma e deixar a outra no padrão do navegador é o que produz o movimento que parece emperrado."
    >
      <TabelaDeContexto
        colunaDoValor="Duração + curva"
        legenda="Motion por contexto de tela"
        linhas={[
          {
            contexto: 'Botão pressionado',
            valor: 'instantaneo + padrao',
            exemplo: 'Badge e Select aplicam a duração no estado ativo',
          },
          {
            contexto: 'Hover de controle',
            valor: 'rapido + padrao',
            exemplo: 'Button, Link, Field, Card, Table, Tree, Menu e mais 31 arquivos',
          },
          {
            contexto: 'Foco por teclado',
            valor: 'rapido + padrao',
            exemplo: 'Anel de foco aparecendo sobre campo e botão',
          },
          {
            contexto: 'Acordeão abrindo',
            valor: 'padrao + padrao',
            exemplo: 'Panel, PanelMenu, Fieldset, Tabs',
          },
          {
            contexto: 'Popover ou tooltip',
            valor: 'padrao + entrada',
            exemplo: 'Tooltip, ConfirmPopup, ContextMenu, Menu, TieredMenu',
          },
          {
            contexto: 'Diálogo abrindo',
            valor: 'lento + entrada',
            exemplo: 'Dialog e ConfirmDialog, com deslocamento de 8px',
          },
          {
            contexto: 'Drawer abrindo',
            valor: 'lento + entrada',
            exemplo: 'Drawer nas quatro bordas da tela',
          },
          {
            contexto: 'Slide de carrossel',
            valor: 'lento + padrao',
            exemplo: 'Carousel, deslocando a trilha inteira',
          },
          {
            contexto: 'Linha de tabela entrando',
            valor: 'sem movimento',
            exemplo: 'Table e TreeTable trocam conteúdo sem animar posição',
          },
        ]}
      />
    </Bloco>
  ),
};

export const RegraDeEntradaESaida: Story = {
  name: 'Regra · entrada mais lenta que saída',
  parameters: {
    docs: {
      description: {
        story:
          'Passe o ponteiro sobre os dois painéis e depois tire. O da esquerda usa a curva de entrada para chegar, com o tempo de camada média, e desaparece na curva de saída, mais curta. O da direita usa o mesmo tempo nos dois sentidos, e o fechamento fica arrastado, porque a pessoa já decidiu sair e continua esperando a interface concordar.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--citie-spacing-5)', maxInlineSize: '560px' }}>
      <style>{`
        .citie-doc-gatilho {
          position: relative;
          display: inline-block;
          font-family: var(--citie-font-ui);
          font-size: var(--citie-font-size-body-md);
          color: var(--citie-text-base);
          background: var(--citie-background-surface);
          border: 1px solid var(--citie-border-default);
          border-radius: var(--citie-radius-md);
          padding: var(--citie-spacing-3) var(--citie-spacing-4);
        }
        .citie-doc-balao {
          position: absolute;
          inset-inline-start: 0;
          inset-block-start: calc(100% + var(--citie-spacing-2));
          inline-size: max-content;
          max-inline-size: 260px;
          background: var(--citie-background-surface);
          color: var(--citie-text-base);
          border-radius: var(--citie-radius-md);
          box-shadow: var(--citie-shadow-overlay);
          padding: var(--citie-spacing-3) var(--citie-spacing-4);
          font-size: var(--citie-font-size-body-sm);
          opacity: 0;
          translate: 0 -6px;
          pointer-events: none;
        }
        .citie-doc-gatilho--certo .citie-doc-balao {
          transition:
            opacity var(--citie-motion-rapido) var(--citie-easing-saida),
            translate var(--citie-motion-rapido) var(--citie-easing-saida);
        }
        .citie-doc-gatilho--certo:hover .citie-doc-balao,
        .citie-doc-gatilho--certo:focus-within .citie-doc-balao {
          opacity: 1;
          translate: 0;
          transition:
            opacity var(--citie-motion-padrao) var(--citie-easing-entrada),
            translate var(--citie-motion-padrao) var(--citie-easing-entrada);
        }
        .citie-doc-gatilho--errado .citie-doc-balao {
          transition:
            opacity var(--citie-motion-padrao) var(--citie-easing-entrada),
            translate var(--citie-motion-padrao) var(--citie-easing-entrada);
        }
        .citie-doc-gatilho--errado:hover .citie-doc-balao,
        .citie-doc-gatilho--errado:focus-within .citie-doc-balao {
          opacity: 1;
          translate: 0;
        }
        @media (prefers-reduced-motion: reduce) {
          .citie-doc-balao { transition: none; }
        }
      `}</style>

      <Bloco
        titulo="Tempos separados"
        descricao="Chega em 220ms com a curva de entrada e sai em 140ms com a curva de saída."
      >
        <span className="citie-doc-gatilho citie-doc-gatilho--certo" tabIndex={0}>
          Prazo do processo
          <span className="citie-doc-balao" role="note">
            Vence em 3 dias úteis, contados a partir do despacho.
          </span>
        </span>
      </Bloco>

      <Bloco
        titulo="Tempo único"
        descricao="Chega e sai em 220ms com a mesma curva. O fechamento fica devendo resposta."
      >
        <span className="citie-doc-gatilho citie-doc-gatilho--errado" tabIndex={0}>
          Prazo do processo
          <span className="citie-doc-balao" role="note">
            Vence em 3 dias úteis, contados a partir do despacho.
          </span>
        </span>
      </Bloco>
    </div>
  ),
};

export const MovimentoNaoBastaSozinho: Story = {
  name: 'Regra · movimento nunca é a única pista',
  parameters: {
    docs: {
      description: {
        story:
          'Os dois blocos marcam a mesma mudança de estado, e os dois balançam. O primeiro continua legível com movimento reduzido ligado, porque o estado também está dito em cor, ícone e texto. O segundo entrega o estado apenas no balanço, e fica idêntico a uma linha comum para quem desligou animação no sistema operacional.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--citie-spacing-5)', maxInlineSize: '560px' }}>
      <style>{`
        /*
         * O balanço é o movimento da demonstração. Ele não mexe em opacidade de
         * propósito: texto piscando até quase sumir reprova contraste em metade
         * dos quadros, e a página perderia a própria regra que está explicando.
         */
        .citie-doc-pulso {
          animation: citie-doc-balancar var(--citie-motion-lento) infinite alternate
            var(--citie-easing-padrao);
        }
        @keyframes citie-doc-balancar {
          to { translate: var(--citie-spacing-2) 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .citie-doc-pulso { animation: none; }
        }
      `}</style>

      <Bloco
        titulo="Com pista redundante"
        descricao="Cor, ícone e texto dizem o estado. O balanço apenas chama atenção para ele."
      >
        <p
          className="citie-doc-pulso"
          style={{
            margin: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 'var(--citie-spacing-2)',
            fontFamily: 'var(--citie-font-ui)',
            fontSize: 'var(--citie-font-size-body-sm)',
            color: 'var(--citie-danger-strong)',
            background: 'var(--citie-danger-background)',
            borderRadius: 'var(--citie-radius-md)',
            padding: 'var(--citie-spacing-2) var(--citie-spacing-3)',
          }}
        >
          <span aria-hidden="true">⚠</span> Prazo vencido em 12/08/2026
        </p>
      </Bloco>

      <Bloco
        titulo="Só com movimento"
        descricao="O estado vive inteiro no balanço. Com movimento reduzido, a linha fica idêntica a qualquer outra."
      >
        <p
          className="citie-doc-pulso"
          style={{
            margin: 0,
            fontFamily: 'var(--citie-font-ui)',
            fontSize: 'var(--citie-font-size-body-sm)',
            color: 'var(--citie-text-base)',
          }}
        >
          Prazo do processo 2026/0481
        </p>
      </Bloco>
    </div>
  ),
};
