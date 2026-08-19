import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { KpiFaixa } from './KpiFaixa';
import { KpiWidget } from './Widget';

const meta = {
  title: 'Organismos/Painel/KpiFaixa',
  component: KpiFaixa,
  tags: ['autodocs', 'organism', 'a11y', 'play-fn'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: [
          'Faixa de indicadores: de 3 a 8 KPIs como uma linha tipográfica única, dentro de um',
          'contêiner só, separados por divisor de 1px. É a forma que dá leitura de painel de fila',
          'ao topo de uma listagem, e é o padrão das seis listagens do protótipo TFD.',
          '',
          '**Quando usar esta e não a grade de `KpiWidget`:** a faixa serve os números de uma fila',
          'só, lidos de uma vez antes de mexer na listagem que vem logo abaixo. A grade serve o',
          'painel inicial, onde cada indicador é de um assunto diferente e pede espaço, meta e',
          'mini-gráfico. Números de assuntos distintos numa faixa sugerem uma comparação que não',
          'existe.',
          '',
          '**Semântica:** a faixa é uma lista de indicadores, então usa `ul`/`li` com `role="list"`',
          'e rótulo acessível vindo do `titulo`. O divisor nasce da borda da célula, ou seja, é',
          'decoração de CSS e nunca aparece na árvore de acessibilidade.',
          '',
          '**Responsividade:** a virada de linha para coluna acontece a 768px medidos na largura da',
          'própria faixa, e não da janela. Assim ela também empilha quando mora numa coluna estreita',
          'de painel, e o divisor vira horizontal.',
          '',
          '**Limite prático:** com 8 indicadores em 1366px cada célula fica com cerca de 160px. O',
          'piso de encolhimento é o número, que nunca quebra linha nem trunca; quem cede espaço é o',
          'rótulo, que trunca com reticências. Se os valores forem longos, como moeda com centavos,',
          'use no máximo 5 indicadores por faixa.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof KpiFaixa>;

export default meta;
type Story = StoryObj<typeof meta>;

const FILA = [
  { rotulo: 'Aguardando análise', valor: '128' },
  { rotulo: 'Em análise', valor: '64' },
  { rotulo: 'Devolvidas', valor: '19' },
  { rotulo: 'Aprovadas hoje', valor: '47' },
  { rotulo: 'Vencendo em 48h', valor: '8' },
];

export const FaixaDeFila: Story = {
  name: 'Faixa · fila de solicitações',
  args: {
    titulo: 'Resumo da fila de solicitações',
    children: FILA.map((indicador) => (
      <KpiWidget
        key={indicador.rotulo}
        rotulo={indicador.rotulo}
        valor={indicador.valor}
        periodo="Fila atual"
      />
    )),
  },
  render: (args) => (
    <div style={{ padding: 24 }}>
      <KpiFaixa {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const lista = canvas.getByRole('list', { name: 'Resumo da fila de solicitações' });
    await expect(within(lista).getAllByRole('listitem')).toHaveLength(5);
    await expect(canvas.getByText('128')).toBeVisible();
  },
};

export const FaixaComTituloVisivel: Story = {
  name: 'Faixa · com título visível',
  args: {
    titulo: 'Regulação',
    tituloVisivel: true,
    children: FILA.slice(0, 3).map((indicador) => (
      <KpiWidget
        key={indicador.rotulo}
        rotulo={indicador.rotulo}
        valor={indicador.valor}
        periodo="Fila atual"
      />
    )),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Quando a faixa não vem logo abaixo do título da página, o título dela aparece na tela e passa a ser a origem do rótulo acessível da lista.',
      },
    },
  },
  render: (args) => (
    <div style={{ padding: 24 }}>
      <KpiFaixa {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('list', { name: 'Regulação' })).toBeVisible();
  },
};

export const FaixaComOitoIndicadores: Story = {
  name: 'Faixa · oito indicadores',
  args: {
    titulo: 'Resumo da regulação',
    children: [
      ...FILA,
      { rotulo: 'Encaminhadas ao setor de passagens', valor: '23' },
      { rotulo: 'Com pendência documental', valor: '11' },
      { rotulo: 'Encerradas', valor: '312' },
    ].map((indicador) => (
      <KpiWidget
        key={indicador.rotulo}
        rotulo={indicador.rotulo}
        valor={indicador.valor}
        periodo="Fila atual"
      />
    )),
  },
  parameters: {
    docs: {
      description: {
        story:
          'O caso apertado. Cada célula fica com cerca de 160px, o número continua em uma linha só e o rótulo longo trunca com reticências, que é a ordem de prioridade correta: o operador varre a faixa pelos números.',
      },
    },
  },
  render: (args) => (
    <div style={{ padding: 24 }}>
      <KpiFaixa {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('listitem')).toHaveLength(8);

    // Quem cede espaço é o rótulo, e nunca o número.
    const rotulo = canvas.getByText('Encaminhadas ao setor de passagens');
    await expect(getComputedStyle(rotulo).textOverflow).toBe('ellipsis');

    const numero = canvas.getByText('312');
    await expect(getComputedStyle(numero).whiteSpace).toBe('nowrap');
  },
};

export const FaixaEmpilhada: Story = {
  name: 'Faixa · empilhada',
  args: {
    titulo: 'Resumo da fila de solicitações',
    children: FILA.slice(0, 4).map((indicador) => (
      <KpiWidget
        key={indicador.rotulo}
        rotulo={indicador.rotulo}
        valor={indicador.valor}
        periodo="Fila atual"
      />
    )),
  },
  parameters: {
    docs: {
      description: {
        story:
          'Abaixo de 768px de largura da faixa, os indicadores empilham e o divisor de 1px vira horizontal. A moldura continua sendo uma só, então a leitura de painel de fila se mantém.',
      },
    },
  },
  render: (args) => (
    <div style={{ padding: 24, width: 360 }}>
      <KpiFaixa {...args} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const itens = canvas.getAllByRole('listitem');
    await expect(itens).toHaveLength(4);
    // Empilhados: cada célula começa abaixo da anterior.
    const primeiro = itens[0].getBoundingClientRect();
    const segundo = itens[1].getBoundingClientRect();
    await expect(segundo.top).toBeGreaterThanOrEqual(primeiro.bottom - 1);
  },
};

export const FaixaComoFiltro: Story = {
  name: 'Faixa · indicadores que filtram',
  args: {
    titulo: 'Filtrar a fila por situação',
    children: null,
  },
  parameters: {
    docs: {
      description: {
        story: [
          'O uso mais comum no TFD: cada indicador da faixa aplica o recorte correspondente na',
          'listagem logo abaixo. Como são controles de alternância, cada um declara `aria-pressed`,',
          'e o anel de seleção reservado em transparente desde o repouso garante que marcar um',
          'filtro não desloque a faixa inteira.',
        ].join('\n'),
      },
    },
  },
  render: (args) => {
    const [filtro, setFiltro] = useState<string | null>(null);
    return (
      <div style={{ padding: 24 }}>
        <KpiFaixa titulo={args.titulo}>
          {FILA.map((indicador) => (
            <KpiWidget
              key={indicador.rotulo}
              rotulo={indicador.rotulo}
              valor={indicador.valor}
              periodo="Fila atual"
              ativo={filtro === indicador.rotulo}
              onFiltrar={() =>
                setFiltro((atual) => (atual === indicador.rotulo ? null : indicador.rotulo))
              }
            />
          ))}
        </KpiFaixa>
      </div>
    );
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const emAnalise = canvas.getByRole('button', { name: /Em análise/ });
    const devolvidas = canvas.getByRole('button', { name: /Devolvidas/ });

    await expect(emAnalise).toHaveAttribute('aria-pressed', 'false');
    await userEvent.click(emAnalise);
    await expect(emAnalise).toHaveAttribute('aria-pressed', 'true');

    // Escolha única: marcar outro filtro desmarca o anterior.
    await userEvent.click(devolvidas);
    await expect(emAnalise).toHaveAttribute('aria-pressed', 'false');
    await expect(devolvidas).toHaveAttribute('aria-pressed', 'true');
  },
};
