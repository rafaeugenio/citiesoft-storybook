import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, within } from 'storybook/test';
import { Splitter } from './Splitter';

const meta = {
  title: 'Organismos/Layout/Splitter',
  component: Splitter,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: [
          'Divide a área em dois painéis redimensionáveis por uma barra. Origem: Figma CitieOne, página ❖ Splitter (variantes de Layout Horizontal, Vertical e Nested, mais a peça splitter-handle com Direction e Focus). O Nested do arquivo é um Splitter dentro de um painel, então aqui sai por composição. A barra é `separator` focalizável: arrasto pelo ponteiro, setas e PageUp/PageDown pelo passo, Home e End nos limites. Cores e medidas seguem os tokens Citiesoft do vault, não o azul padrão do PrimeOne. Equivalente PrimeNG: `p-splitter`.',
          '',
          '**O padrão do DS Citiesoft para dividir a tela é o grid fixo de colunas.** O Splitter é',
          'exceção, reservada ao caso em que o servidor precisa comparar dois conteúdos ao mesmo',
          'tempo e a proporção certa entre eles muda de processo para processo: detalhe do processo',
          'ao lado do histórico, formulário ao lado do documento digitalizado que está sendo',
          'conferido. Quando a proporção é sempre a mesma, o grid entrega o mesmo resultado sem',
          'gastar uma interação de arrasto.',
          '',
          '**Quando não usar:** tela usada de forma esporádica por quem não decora a interface (a',
          'barra parece decoração, o servidor nunca descobre que ela arrasta e trabalha a vida',
          'inteira na proporção inicial); painel lateral de navegação ou de filtros, onde o certo é',
          'o `Sidebar` ou o `FilterBar`; conteúdo secundário que aparece sob demanda e some depois,',
          'caso do `Drawer` e do `Dialog`; seções empilhadas que o usuário abre e fecha uma de cada',
          'vez, papel do `Accordion` ou do `Panel`; e tela abaixo de 1024px, porque o componente',
          'não quebra os painéis em pilha por conta própria e cada lado fica com metade de uma',
          'largura que já era estreita, truncando rótulo e valor.',
          '',
          'Limite real da implementação: a proporção vive no estado do componente e se perde ao',
          'recarregar a página. Se a divisão precisa ser lembrada entre sessões, guarde o valor',
          'devolvido por `onRedimensionar` na preferência do usuário.',
        ].join('\n'),
      },
    },
  },
} satisfies Meta<typeof Splitter>;

export default meta;
type Story = StoryObj<typeof meta>;

const DetalheProcesso = () => (
  <div>
    <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>Processo 2025/0481</h3>
    <dl style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '8px 16px', margin: 0 }}>
      <dt style={{ color: 'var(--citie-text-secondary)' }}>Paciente</dt>
      <dd style={{ margin: 0 }}>Maria de Fátima Souza</dd>
      <dt style={{ color: 'var(--citie-text-secondary)' }}>Tipo</dt>
      <dd style={{ margin: 0 }}>TFD intermunicipal</dd>
      <dt style={{ color: 'var(--citie-text-secondary)' }}>Origem</dt>
      <dd style={{ margin: 0 }}>Secretaria de Saúde de Imperatriz</dd>
      <dt style={{ color: 'var(--citie-text-secondary)' }}>Competência</dt>
      <dd style={{ margin: 0 }}>Agosto/2025</dd>
      <dt style={{ color: 'var(--citie-text-secondary)' }}>Diária prevista</dt>
      <dd style={{ margin: 0 }}>R$ 420,00</dd>
    </dl>
  </div>
);

const HistoricoProcesso = () => (
  <div>
    <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>Histórico</h3>
    <ol style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 10 }}>
      <li>
        Solicitação registrada pela Secretaria de Saúde de Imperatriz
        <div style={{ color: 'var(--citie-text-secondary)', fontSize: 13 }}>04/08/2025 · 09:12</div>
      </li>
      <li>
        Parecer técnico favorável da regulação estadual
        <div style={{ color: 'var(--citie-text-secondary)', fontSize: 13 }}>06/08/2025 · 15:40</div>
      </li>
      <li>
        Diária e passagem autorizadas para acompanhante
        <div style={{ color: 'var(--citie-text-secondary)', fontSize: 13 }}>08/08/2025 · 11:05</div>
      </li>
      <li>
        Aguardando confirmação de agendamento em São Luís
        <div style={{ color: 'var(--citie-text-secondary)', fontSize: 13 }}>11/08/2025 · 08:20</div>
      </li>
    </ol>
  </div>
);

export const Horizontal: Story = {
  name: 'Layout · horizontal',
  args: {
    layout: 'horizontal',
    proporcaoInicial: 55,
    inicio: { rotulo: 'Detalhe do processo', conteudo: <DetalheProcesso /> },
    fim: { rotulo: 'Histórico do processo', conteudo: <HistoricoProcesso /> },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Uso real do TFD: detalhe do processo à esquerda, histórico de tramitação à direita. O servidor alarga o lado que estiver lendo.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('separator', {
      name: 'Redimensionar Detalhe do processo e Histórico do processo',
    });

    await expect(barra).toHaveAttribute('aria-orientation', 'vertical');
    await expect(barra).toHaveAttribute('aria-valuenow', '55');

    await userEvent.tab();
    await userEvent.tab();
    await expect(barra).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    await expect(barra).toHaveAttribute('aria-valuenow', '60');

    await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
    await expect(barra).toHaveAttribute('aria-valuenow', '50');
  },
};

export const Vertical: Story = {
  name: 'Layout · vertical',
  args: {
    layout: 'vertical',
    altura: '360px',
    inicio: { rotulo: 'Detalhe do processo', conteudo: <DetalheProcesso /> },
    fim: { rotulo: 'Histórico do processo', conteudo: <HistoricoProcesso /> },
  },
  parameters: {
    docs: {
      description: {
        story: 'Empilhado, para tela estreita. As setas para cima e para baixo movem a barra.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('separator');

    await expect(barra).toHaveAttribute('aria-orientation', 'horizontal');

    barra.focus();
    await userEvent.keyboard('{ArrowDown}');
    await expect(barra).toHaveAttribute('aria-valuenow', '55');
  },
};

export const Aninhado: Story = {
  name: 'Layout · aninhado',
  args: {
    layout: 'horizontal',
    altura: '360px',
    proporcaoInicial: 40,
    inicio: { rotulo: 'Detalhe do processo', conteudo: <DetalheProcesso /> },
    fim: {
      rotulo: 'Acompanhamento',
      conteudo: (
        <Splitter
          layout="vertical"
          altura="100%"
          inicio={{ rotulo: 'Histórico do processo', conteudo: <HistoricoProcesso /> }}
          fim={{
            rotulo: 'Documentos anexados',
            conteudo: (
              <div>
                <h3 style={{ margin: '0 0 12px', fontSize: 16 }}>Documentos anexados</h3>
                <ul style={{ margin: 0, paddingInlineStart: 18, display: 'grid', gap: 6 }}>
                  <li>Laudo médico assinado</li>
                  <li>Comprovante de residência</li>
                  <li>Cartão SUS do acompanhante</li>
                </ul>
              </div>
            ),
          }}
        />
      ),
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'O Nested do Figma sai da composição: um Splitter vertical dentro do painel direito. Cada barra é um separator próprio, com o nome dos painéis que ela divide.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getAllByRole('separator')).toHaveLength(2);
    await expect(
      canvas.getByRole('separator', {
        name: 'Redimensionar Histórico do processo e Documentos anexados',
      }),
    ).toBeVisible();
  },
};

export const Limites: Story = {
  name: 'Comportamento · limites por painel',
  args: {
    layout: 'horizontal',
    proporcaoInicial: 50,
    passo: 10,
    inicio: {
      rotulo: 'Detalhe do processo',
      tamanhoMinimo: 30,
      conteudo: <DetalheProcesso />,
    },
    fim: {
      rotulo: 'Histórico do processo',
      tamanhoMinimo: 25,
      conteudo: <HistoricoProcesso />,
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Cada painel declara o mínimo que aceita ocupar. Home leva a barra ao mínimo do primeiro painel, End ao máximo, e nenhum dos dois lados some.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const barra = canvas.getByRole('separator');

    await expect(barra).toHaveAttribute('aria-valuemin', '30');
    await expect(barra).toHaveAttribute('aria-valuemax', '75');

    barra.focus();
    await userEvent.keyboard('{Home}');
    await expect(barra).toHaveAttribute('aria-valuenow', '30');

    await userEvent.keyboard('{End}');
    await expect(barra).toHaveAttribute('aria-valuenow', '75');

    // Passo de 10 a partir do máximo não ultrapassa o limite do painel da direita.
    await userEvent.keyboard('{ArrowRight}');
    await expect(barra).toHaveAttribute('aria-valuenow', '75');
  },
};

export const BarraEmFoco: Story = {
  name: 'Gutter · em foco',
  args: {
    layout: 'horizontal',
    inicio: { rotulo: 'Detalhe do processo', conteudo: <DetalheProcesso /> },
    fim: { rotulo: 'Histórico do processo', conteudo: <HistoricoProcesso /> },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Variante Focus=True da peça splitter-handle: a barra recebe anel de foco e a pega muda para o azul da marca, sinalizando que as setas agora redimensionam.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const barra = within(canvasElement).getByRole('separator');
    barra.focus();
    await expect(barra).toHaveFocus();
    await expect(barra).toHaveAttribute('tabindex', '0');
  },
};
