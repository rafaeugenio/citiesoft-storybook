import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';
import { expect, within } from 'storybook/test';
import {
  AchadoAberto,
  Bloco,
  TabelaDeContexto,
  TabelaDeTokens,
  type TokenDocumentado,
} from './_ui/TabelaDeTokens';

const meta = {
  title: 'Fundações/Tipografia',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Três famílias, duas escalas de tamanho e três pesos. Nenhum componente escreve',
          '`font-size` em pixel nem `font-weight` em número.',
          '',
          '**Como escolher.** Comece pela pergunta "que papel esse texto cumpre na tela".',
          'Título de card, rótulo de campo, dado de célula e valor de indicador são quatro',
          'papéis distintos, e cada um tem um degrau próprio. A tabela por contexto responde',
          'direto a essa pergunta, e é o caminho mais curto para quem chega com uma situação',
          'de tela na mão em vez de um nome de token.',
          '',
          '**Tamanho e peso andam juntos.** A divergência que originou estes tokens era de',
          'tamanho E de peso ao mesmo tempo: seis templates traziam quatro H1 diferentes',
          '(22/600, 24/600, 24/700 e um degrau responsivo de 20px que só três aplicavam).',
          'Por isso o peso também é token, e escolher o degrau de título significa escolher',
          'o par tamanho + peso, nunca só o tamanho.',
          '',
          '**O valor mostrado é lido do CSS em tempo de execução**, e não copiado para a',
          'tabela. Valor copiado envelhece em silêncio: alguém ajusta o token e a documentação',
          'passa a mentir sem que nada acuse.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

/* ------------------------------------------------------------------ */
/* Amostras locais.                                                    */
/*                                                                     */
/* O kit compartilhado não tem espécie de amostra tipográfica, e o      */
/* briefing fixa este arquivo como único alterável. As amostras abaixo  */
/* ficam aqui, ao lado da tabela com `especie="nenhuma"`, e renderizam  */
/* o texto no tamanho real do token, que é a única forma de julgar um   */
/* degrau de escala.                                                    */
/* ------------------------------------------------------------------ */

const AMOSTRA_BASE: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--citie-spacing-1)',
  paddingBlock: 'var(--citie-spacing-3)',
  borderBlockEnd: '1px solid var(--citie-border-default)',
};

const ETIQUETA: CSSProperties = {
  fontFamily: 'var(--citie-font-ui)',
  fontSize: 'var(--citie-font-size-caption)',
  fontWeight: 'var(--citie-font-weight-title)',
  letterSpacing: '0.06em',
  textTransform: 'uppercase',
  color: 'var(--citie-text-secondary)',
};

function LinhaDeAmostra({
  etiqueta,
  familia,
  tamanho,
  peso,
  children,
}: {
  etiqueta: string;
  familia: 'ui' | 'display' | 'mono';
  tamanho?: string;
  peso?: string;
  children: ReactNode;
}) {
  return (
    <div style={AMOSTRA_BASE}>
      <span style={ETIQUETA}>{etiqueta}</span>
      <span
        style={{
          fontFamily: `var(--citie-font-${familia})`,
          fontSize: tamanho ? `var(--citie-font-size-${tamanho})` : undefined,
          fontWeight: peso ? `var(--citie-font-weight-${peso})` : undefined,
          color: 'var(--citie-text-primary)',
          lineHeight: 1.3,
        }}
      >
        {children}
      </span>
    </div>
  );
}

function Pilha({ children }: { children: ReactNode }) {
  return <div style={{ display: 'grid', marginBlockEnd: 'var(--citie-spacing-5)' }}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Tokens.                                                             */
/* ------------------------------------------------------------------ */

const FAMILIAS: TokenDocumentado[] = [
  {
    nome: 'font-ui',
    uso: 'Tudo que a pessoa lê para operar o sistema: rótulo de campo, texto de ajuda, dado de célula, item de menu, texto de botão, mensagem. É a família do `body` e a mais consumida do catálogo, com 107 referências.',
    evitar: 'usar em título de card ou de diálogo. O contraste entre as duas famílias é o que faz a hierarquia se ler antes da leitura começar.',
  },
  {
    nome: 'font-display',
    uso: 'Hierarquia e números de destaque: título de card, título de diálogo, título de gráfico, valor de indicador. Aparece em 32 referências, sempre acompanhada de um degrau da escala de título.',
    evitar: 'usar em texto corrido. A Red Hat Display foi desenhada para tamanho grande, e em 13px ela perde a legibilidade que a Inter mantém.',
  },
  {
    nome: 'font-mono',
    uso: 'Nenhum consumidor no código. A intenção declarada é número tabular, código e identificador, e nesse papel ela está sendo contornada: o Terminal declara a própria família em `--citie-terminal-fonte`, e o Editor e a tabela de tokens escrevem a pilha monoespaçada literal.',
    evitar: 'adotar antes de a fonte ser carregada. Veja o achado abaixo.',
  },
];

const CORPO: TokenDocumentado[] = [
  {
    nome: 'font-size-caption',
    uso: 'Micro rótulo em maiúscula acima de um número, e rótulo de agrupamento de menu: rótulo de indicador, rótulo do donut de gráfico, cabeçalho de seção de menu e de sidebar. Vem quase sempre com `font-weight-title` e `text-transform: uppercase`.',
    evitar: 'usar em frase. Em 11px, texto de mais de três palavras cansa antes de informar.',
  },
  {
    nome: 'font-size-body-xs',
    uso: 'Cabeçalho de coluna de tabela e rótulo de eixo de gráfico, onde o texto acompanha o dado sem competir com ele.',
  },
  {
    nome: 'font-size-body-sm',
    uso: 'Metadado ao lado do conteúdo: texto de ajuda e mensagem de erro do campo, subtítulo de card, legenda de gráfico, período do indicador. É o segundo degrau mais consumido, com 126 referências.',
  },
  {
    nome: 'font-size-body-md',
    uso: 'Padrão de leitura do produto: corpo da página, rótulo de campo, valor digitado no campo, dado de célula de tabela, item de lista. Se você está em dúvida sobre um texto de leitura, é este.',
  },
  {
    nome: 'font-size-body-lg',
    uso: 'Campo de entrada em tamanho grande e texto de apoio de estado vazio: variante grande de AutoComplete, MultiSelect, CascadeSelect, campo de OTP, descrição do EmptyState.',
    evitar: 'usar como degrau de título. Um título de 16px sem a família display fica indistinguível do corpo e a hierarquia some.',
  },
];

const TITULO: TokenDocumentado[] = [
  {
    nome: 'font-size-title-sm',
    uso: 'Título de bloco que vive dentro de uma tela: título de card, título de diálogo, título de gráfico. É o degrau de título mais consumido, com 4 referências.',
  },
  {
    nome: 'font-size-title-md',
    uso: 'Título de seção da página, e degrau responsivo do H1 quando a largura aperta. Hoje tem 1 consumidor, o título do EmptyState.',
  },
  {
    nome: 'font-size-title-lg',
    uso: 'H1 de página, e número de indicador na variante compacta: valor do widget compacto, valor do KPI em faixa, valor central do donut.',
    evitar: 'confundir com o papel de H1. As 3 referências existentes são todas de número de destaque, e nenhuma delas é título de página.',
  },
  {
    nome: 'font-size-display',
    uso: 'Número que a tela existe para mostrar: valor principal do indicador de dashboard. Vem sempre com `font-display`, `font-weight-display` e `tabular-nums`.',
    evitar: 'usar em texto. É degrau de número de destaque e de abertura de página, com 1 consumidor hoje.',
  },
];

const PESOS: TokenDocumentado[] = [
  {
    nome: 'font-weight-action',
    uso: 'Elemento que a pessoa aciona ou que precisa se destacar dentro de uma linha de texto: rótulo de botão, item de menu selecionado, opção destacada na lista, valor monetário. Com 52 referências, é o peso mais consumido.',
  },
  {
    nome: 'font-weight-title',
    uso: 'Título de qualquer nível, cabeçalho de coluna de tabela e micro rótulo de indicador. É o peso dominante do produto para hierarquia.',
  },
  {
    nome: 'font-weight-display',
    uso: 'Número de destaque, e apenas ele: valor do indicador, valor central do donut, contador do Badge, marcador do Timeline.',
    evitar: 'usar para enfatizar uma palavra dentro de um parágrafo. Peso 700 aqui significa "este é o número principal da tela", e usar em outro lugar dilui o sinal.',
  },
];

/* ------------------------------------------------------------------ */
/* Stories.                                                            */
/* ------------------------------------------------------------------ */

export const Familias: Story = {
  name: 'Famílias',
  render: () => (
    <Bloco
      titulo="Famílias"
      descricao="Duas famílias dividem a tela por papel: a Red Hat Display carrega a hierarquia, a Inter carrega a operação. A terceira, monoespaçada, está declarada e sem uso."
    >
      <Pilha>
        <LinhaDeAmostra etiqueta="font-display · título e número de destaque" familia="display" tamanho="title-lg" peso="title">
          Processos aguardando regulação
        </LinhaDeAmostra>
        <LinhaDeAmostra etiqueta="font-ui · interface e corpo" familia="ui" tamanho="body-md">
          O processo 2026/0481 foi encaminhado à regulação em 14/08/2026.
        </LinhaDeAmostra>
        <LinhaDeAmostra etiqueta="font-mono · número tabular e código" familia="mono" tamanho="body-md">
          2026/0481 · CNS 704 8032 1195 0043
        </LinhaDeAmostra>
      </Pilha>

      <TabelaDeTokens tokens={FAMILIAS} especie="nenhuma" legenda="Tokens de família tipográfica" />

      <AchadoAberto>
        <code>--citie-font-mono</code> não tem nenhum consumidor: <code>grep</code> por{' '}
        <code>var(--citie-font-mono)</code> em <code>src</code> e <code>.storybook</code> devolve
        zero ocorrências. E a fonte que ele nomeia não chega ao navegador:{' '}
        <code>.storybook/preview-head.html</code> carrega apenas{' '}
        <code>Inter:wght@400;500;600</code> e <code>Red+Hat+Display:wght@500;600;700</code>, sem
        Red Hat Mono. Quem adotar o token hoje cai calado no <code>ui-monospace</code> do sistema,
        e o resultado muda entre macOS, Windows e Linux sem nada acusar. Enquanto isso o papel é
        cumprido por três declarações paralelas: <code>--citie-terminal-fonte</code> em{' '}
        <code>Terminal.css:11</code>, a pilha literal em <code>Editor.css:222</code> e outra em{' '}
        <code>_ui/TabelaDeTokens.css:48</code>. Correção: acrescentar{' '}
        <code>family=Red+Hat+Mono:wght@400;500</code> à URL do Google Fonts e apontar os três
        consumidores para o token.
      </AchadoAberto>

      <AchadoAberto>
        A Inter é carregada nos pesos 400, 500 e 600, e o catálogo pede 700 em Badge, Tabs, Tree,
        TreeSelect e Timeline. O peso que falta é sintetizado pelo navegador, que engorda os
        contornos por transformação em vez de usar o desenho da fonte. A correção é acrescentar{' '}
        <code>700</code> à lista de pesos da Inter na mesma URL.
      </AchadoAberto>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // O valor vem do CSS, então a linha da tabela mostra a pilha real de fallback.
    const tabela = within(canvas.getByRole('table', { name: 'Tokens de família tipográfica' }));
    await expect(tabela.getByText(/^'Red Hat Display',/)).toBeVisible();
    await expect(tabela.getByText(/^'Red Hat Mono',/)).toBeVisible();
    await expect(tabela.getByText(/^'Inter',/)).toBeVisible();
  },
};

export const EscalaDeCorpo: Story = {
  name: 'Escala de corpo',
  render: () => (
    <Bloco
      titulo="Escala de corpo"
      descricao="Cinco degraus em Inter, de 11px a 16px. A distância entre eles é curta de propósito: o que separa metadado de dado nesta escala é a combinação de tamanho com cor de texto, e não o tamanho sozinho."
    >
      <Pilha>
        <LinhaDeAmostra etiqueta="body-lg · campo grande e apoio de estado vazio" familia="ui" tamanho="body-lg">
          Nenhum processo encontrado para este filtro.
        </LinhaDeAmostra>
        <LinhaDeAmostra etiqueta="body-md · corpo, rótulo de campo, célula de tabela" familia="ui" tamanho="body-md">
          Maria Auxiliadora dos Santos Ferreira
        </LinhaDeAmostra>
        <LinhaDeAmostra etiqueta="body-sm · ajuda, subtítulo, legenda" familia="ui" tamanho="body-sm">
          Informe o CNS com 15 dígitos, sem pontuação.
        </LinhaDeAmostra>
        <LinhaDeAmostra etiqueta="body-xs · cabeçalho de coluna e eixo de gráfico" familia="ui" tamanho="body-xs" peso="title">
          MUNICÍPIO DE ORIGEM
        </LinhaDeAmostra>
        <LinhaDeAmostra etiqueta="caption · micro rótulo de indicador" familia="ui" tamanho="caption" peso="title">
          AGUARDANDO REGULAÇÃO
        </LinhaDeAmostra>
      </Pilha>

      <TabelaDeTokens tokens={CORPO} especie="nenhuma" legenda="Escala de corpo" />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Confere que os degraus exibidos são os lidos do CSS, e não texto fixo.
    await expect(canvas.getByText('11px')).toBeVisible();
    await expect(canvas.getByText('13px')).toBeVisible();
    await expect(canvas.getByText('16px')).toBeVisible();
  },
};

export const EscalaDeTitulo: Story = {
  name: 'Escala de título',
  render: () => (
    <Bloco
      titulo="Escala de título"
      descricao="Quatro degraus em Red Hat Display. Os valores são os que já predominavam no código, promovidos a token, e não uma escala nova imposta por cima do que existe."
    >
      <Pilha>
        <LinhaDeAmostra etiqueta="display · número principal do indicador" familia="display" tamanho="display" peso="display">
          1.482
        </LinhaDeAmostra>
        <LinhaDeAmostra etiqueta="title-lg · H1 de página e número compacto" familia="display" tamanho="title-lg" peso="title">
          Solicitações de TFD
        </LinhaDeAmostra>
        <LinhaDeAmostra etiqueta="title-md · título de seção" familia="display" tamanho="title-md" peso="title">
          Dados do paciente
        </LinhaDeAmostra>
        <LinhaDeAmostra etiqueta="title-sm · título de card, diálogo e gráfico" familia="display" tamanho="title-sm" peso="title">
          Encaminhamentos por município
        </LinhaDeAmostra>
      </Pilha>

      <TabelaDeTokens tokens={TITULO} especie="nenhuma" legenda="Escala de título" />

      <AchadoAberto>
        A escala de título está consumida pela metade. Somando os quatro degraus são 9 referências
        no catálogo inteiro, e nenhuma delas é título de página: <code>title-lg</code> aparece três
        vezes, sempre como número de destaque (<code>Widget.css:115</code>,{' '}
        <code>KpiFaixa.css:140</code>, <code>Chart.css:159</code>), e a única <code>h1</code> do
        repositório escreve <code>font-size: 32px</code> e <code>font-weight: 600</code> literais em{' '}
        <code>src/index.css</code>, que não corresponde a nenhum par de tokens da escala.
      </AchadoAberto>

      <AchadoAberto>
        Sobraram 15 <code>font-size</code> literais em 11 arquivos de componente (
        <code>grep -rn "font-size: [0-9]" src/components/*/*/*.css | grep -v var</code>), e mais 5
        fora de <code>components</code>, somando 20 em <code>src</code>. Doze deles têm token exato
        esperando (12px, 14px, 18px, 20px, 32px e cinco ocorrências de 11px). Os outros três estão
        fora da escala e precisam de decisão antes da troca: <code>Badge.css:114</code> com 10px,{' '}
        <code>Editor.css:198</code> com 17px e <code>Timeline.css:59</code> com 9px. Os pesos estão
        pior: 68 <code>font-weight</code> numéricos permanecem literais, incluindo o rótulo de campo
        em <code>Field.css:16</code>, que é um dos elementos mais repetidos do produto.
      </AchadoAberto>
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('18px')).toBeVisible();
    await expect(canvas.getByText('24px')).toBeVisible();
    await expect(canvas.getByText('32px')).toBeVisible();
  },
};

export const Pesos: Story = {
  name: 'Pesos',
  render: () => (
    <Bloco
      titulo="Pesos"
      descricao="Três pesos, três papéis. Peso é hierarquia: ele diz onde o olho pousa primeiro e em que ordem o resto vem depois. Engrossar uma palavra para chamar atenção dentro de um parágrafo gasta esse sinal sem construir hierarquia nenhuma, e a ênfase de conteúdo pertence à cor de texto e ao componente de marcador."
    >
      <Pilha>
        <LinhaDeAmostra etiqueta="font-weight-display · número de destaque" familia="display" tamanho="title-lg" peso="display">
          1.482 solicitações
        </LinhaDeAmostra>
        <LinhaDeAmostra etiqueta="font-weight-title · título e cabeçalho de coluna" familia="display" tamanho="title-lg" peso="title">
          1.482 solicitações
        </LinhaDeAmostra>
        <LinhaDeAmostra etiqueta="font-weight-action · rótulo de botão e item selecionado" familia="display" tamanho="title-lg" peso="action">
          1.482 solicitações
        </LinhaDeAmostra>
      </Pilha>

      <TabelaDeTokens tokens={PESOS} especie="nenhuma" legenda="Pesos tipográficos" />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('500')).toBeVisible();
    await expect(canvas.getByText('600')).toBeVisible();
    await expect(canvas.getByText('700')).toBeVisible();
  },
};

export const PorContexto: Story = {
  name: 'Por contexto de tela',
  parameters: {
    docs: {
      description: {
        story:
          'A entrada aqui é a situação de tela, e não o nome do token. Cada linha foi medida no CSS do componente citado, com arquivo e linha, para a recomendação poder ser conferida em vez de acreditada.',
      },
    },
  },
  render: () => (
    <Bloco
      titulo="Por contexto"
      descricao="Onze situações recorrentes, com o par tamanho + peso que o código já aplica."
    >
      <TabelaDeContexto
        legenda="Tipografia por contexto de tela"
        colunaDoValor="Valor"
        linhas={[
          {
            contexto: 'Título de página',
            valor: 'font-display · title-lg 24px · weight-title 600',
            exemplo:
              'Nenhum componente consome ainda. A única h1 do repositório escreve 32px e 600 literais em src/index.css, o que não corresponde a nenhum par da escala.',
          },
          {
            contexto: 'Título de seção',
            valor: 'font-display · title-md 20px · weight-title 600',
            exemplo: 'Título do EmptyState (EmptyState.css:45). Único consumidor do degrau.',
          },
          {
            contexto: 'Título de card',
            valor: 'font-display · title-sm 18px · weight-title 600',
            exemplo:
              'Card.css:40, título de diálogo em Overlay.css:98 e título de gráfico em Chart.css:27.',
          },
          {
            contexto: 'Rótulo de campo',
            valor: 'font-ui · body-md 14px · peso 500',
            exemplo:
              'Field.css:15. O peso está escrito como 500 literal na linha 16, no lugar de font-weight-action.',
          },
          {
            contexto: 'Dado de célula de tabela',
            valor: 'font-ui · body-md 14px · peso herdado',
            exemplo: 'Table.css:12, aplicado na tabela inteira e herdado por cada td.',
          },
          {
            contexto: 'Cabeçalho de coluna',
            valor: 'font-ui · body-xs 12px · weight-title 600',
            exemplo: 'Table.css:29. Menor que a célula de propósito, para o dado vencer o rótulo.',
          },
          {
            contexto: 'Texto de ajuda',
            valor: 'font-ui · body-sm 13px · text-secondary',
            exemplo:
              'Field.css:29, mesmo degrau usado pela mensagem de erro do campo em Field.css:33.',
          },
          {
            contexto: 'Valor de indicador',
            valor: 'font-display · display 32px · weight-display 700 · tabular-nums',
            exemplo:
              'Widget.css:103-108. Na variante compacta cai para title-lg 24px e weight-title (Widget.css:115), e no KPI em faixa para title-lg (KpiFaixa.css:140).',
          },
          {
            contexto: 'Rótulo de indicador',
            valor: 'font-ui · caption 11px · weight-title 600 · maiúscula',
            exemplo: 'Widget.css:91 e KpiFaixa.css:22, sempre acima do número.',
          },
          {
            contexto: 'Legenda de gráfico',
            valor: 'font-ui · body-sm 13px',
            exemplo:
              'Chart.css:119. O rótulo direto sobre a série usa body-xs com weight-action (Chart.css:70), e o rótulo do donut usa caption (Chart.css:168).',
          },
          {
            contexto: 'Eixo de gráfico',
            valor: 'font-ui · body-xs 12px · text-secondary',
            exemplo: 'Chart.css:62, no mesmo degrau do cabeçalho de coluna da tabela.',
          },
        ]}
      />
    </Bloco>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Cabeçalho de coluna')).toBeVisible();
    await expect(canvas.getByText(/Widget\.css:103-108/)).toBeVisible();
  },
};

const VALORES = ['R$ 1.184,00', 'R$ 11.941,10', 'R$ 890,74', 'R$ 4.118,19', 'R$ 71.180,00'];

function ColunaDeValores({ tabular }: { tabular: boolean }) {
  return (
    <ol
      style={{
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'grid',
        gap: 'var(--citie-spacing-2)',
        fontFamily: 'var(--citie-font-ui)',
        fontSize: 'var(--citie-font-size-body-md)',
        fontWeight: 'var(--citie-font-weight-action)',
        color: 'var(--citie-text-base)',
        textAlign: 'right',
        fontVariantNumeric: tabular ? 'tabular-nums' : 'normal',
      }}
    >
      {VALORES.map((valor) => (
        <li key={valor}>{valor}</li>
      ))}
    </ol>
  );
}

export const NumerosTabulares: Story = {
  name: 'Regra · número em coluna usa tabular-nums',
  parameters: {
    docs: {
      description: {
        story:
          'A mesma coluna, com e sem `font-variant-numeric: tabular-nums`. Na Inter os dígitos têm larguras diferentes por padrão, e o 1 é bem mais estreito que o 8. Sem o ajuste, a vírgula decimal muda de lugar a cada linha e a comparação vertical, que é a razão de a coluna existir, deixa de funcionar. O efeito piora quando o valor é atualizado em tela: o número inteiro escorrega lateralmente a cada troca.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 'var(--citie-spacing-5)', maxInlineSize: '520px' }}>
      <Bloco
        titulo="Com tabular-nums"
        descricao="Todo dígito ocupa a mesma largura, então a vírgula cai na mesma vertical em todas as linhas."
      >
        <ColunaDeValores tabular />
      </Bloco>

      <Bloco
        titulo="Sem tabular-nums"
        descricao="Larguras proporcionais. A coluna continua alinhada à direita, e mesmo assim as casas decimais desencontram."
      >
        <ColunaDeValores tabular={false} />
      </Bloco>

      <p
        style={{
          margin: 0,
          fontFamily: 'var(--citie-font-ui)',
          fontSize: 'var(--citie-font-size-body-sm)',
          color: 'var(--citie-text-secondary)',
        }}
      >
        Obrigatório em coluna de valor, número de indicador e identificador (processo, CNS,
        protocolo). Já aplicado em ValorMonetario, PrazoIndicador, Widget, MeterGroup, Progress,
        Slider e ColorPicker. Para valor em reais existe o componente ValorMonetario, que entrega o
        ajuste junto com o alinhamento à direita, e escrever a regra à mão só se justifica fora
        desse caso.
      </p>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const [comAjuste, semAjuste] = canvas.getAllByText('R$ 11.941,10');
    // A demonstração só prova algo se as duas colunas de fato divergirem no ajuste.
    await expect(getComputedStyle(comAjuste.parentElement!).fontVariantNumeric).toContain(
      'tabular-nums',
    );
    await expect(getComputedStyle(semAjuste.parentElement!).fontVariantNumeric).toBe('normal');
  },
};
