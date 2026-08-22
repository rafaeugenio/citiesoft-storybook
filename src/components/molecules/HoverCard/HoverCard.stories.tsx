import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, userEvent, waitFor, within } from 'storybook/test';
import { HoverCard, type SecaoHoverCard } from './HoverCard';
import { Link } from '../../atoms/Link/Link';
import { Button } from '../../atoms/Button/Button';
import { Dialog } from '../../organisms/Overlay/Overlay';

/** Dados no padrão das células do TFD: cadastro à esquerda, processo à direita. */
const secoesPaciente: SecaoHoverCard[] = [
  {
    itens: [
      { rotulo: 'CPF', valor: '605.922.293-51', mono: true },
      { rotulo: 'Cartão SUS', valor: '700 5077 5813 1234', mono: true },
      { rotulo: 'Município', valor: 'São Luís' },
      { rotulo: 'Telefone', valor: '(98) 98888-1234', mono: true },
    ],
  },
  {
    titulo: 'Solicitação',
    itens: [
      { rotulo: 'Processo', valor: '0004921/2025', mono: true },
      { rotulo: 'CID', valor: 'C50.9', mono: true },
      {
        rotulo: 'Observação',
        valor:
          'Paciente em tratamento oncológico contínuo, com acompanhante autorizado pela junta médica e passagens emitidas para o próximo ciclo de quimioterapia em Barbalha.',
        truncar: true,
      },
    ],
  },
];

const meta = {
  title: 'Moléculas/Overlay/HoverCard',
  component: HoverCard,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component:
          'Mini painel de dados ancorado ao ponteiro ou ao foco: pares de rótulo e valor, divisores entre seções e trechos longos truncados. Fecha a lacuna nº 2 do mapa do TFD (`docs/base-tfd.md`), onde cinco células de tabela diferentes entregam esse painel e o `Tooltip` do catálogo, que só aceita `string`, não alcança.\n\n**Quando usar o Tooltip e quando usar este.** O `Moléculas/Overlay/Tooltip` é texto corrido de até 2 linhas para esclarecer uma sigla, um ícone ou uma coluna abreviada. O HoverCard é painel de dados estruturado só de leitura: o cadastro por trás de um nome, o resumo por trás de um número de processo. Se o conteúdo pede link, botão ou campo, nenhum dos dois serve: conteúdo interativo é o `Moléculas/Overlay/Popover`, controlado por clique.\n\nO painel abre com atraso e fecha com uma folga menor, o que permite levar o ponteiro até dentro dele e copiar um valor. Por teclado abre no foco sem atraso, fecha no `Escape` e é anunciado via `aria-describedby`. Sobe para a top layer do navegador pela API nativa de `popover`, escapando do `overflow` da tabela e do backdrop de um `Dialog` modal, e vira para o outro lado quando não cabe. O painel é levado por portal para o `dialog[open]` ancestral, quando houver, ou para o contêiner de tema mais próximo: ele é conteúdo em fluxo, e o gatilho costuma estar dentro de um parágrafo ou de uma célula, onde conteúdo em fluxo seria marcação inválida. Com isso o gatilho pode ficar em qualquer lugar do texto, sem restrição de aninhamento para quem usa.\n\n**Quando não usar:** informação necessária para decidir ou preencher, porque painel de hover não existe em tela de toque nem na impressão; isso pertence à própria célula ou ao detalhe do processo. Não usar para confirmação de ação, que é o `Moléculas/Overlay/ConfirmPopup`. E não usar como atalho para adiar decisão de coluna: se todo operador abre o painel em toda linha, o dado escondido devia ser uma coluna da `Organismos/Table`.',
      },
    },
  },
  args: {
    titulo: 'Maria da Conceição Santos',
    secoes: secoesPaciente,
    children: <button>Gatilho</button>,
  },
} satisfies Meta<typeof HoverCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const PorTeclado: Story = {
  name: 'HoverCard · abre no foco, fecha no Escape',
  parameters: {
    docs: {
      description: {
        story:
          'Painel que só existe no ponteiro exclui quem navega por teclado, e isso reprova WCAG 2.1.1. Aqui o foco abre sem atraso, o `Escape` fecha de qualquer lugar e o conteúdo fica associado ao gatilho por `aria-describedby`.',
      },
    },
  },
  render: (args) => (
    <div style={{ padding: 48 }}>
      <HoverCard {...args}>
        <Link href="#processo">Maria da Conceição Santos</Link>
      </HoverCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('link', { name: 'Maria da Conceição Santos' });

    await userEvent.tab();
    await expect(gatilho).toHaveFocus();

    // No foco o painel abre na hora: quem chegou por Tab já decidiu.
    const painel = await canvas.findByRole('tooltip');
    await expect(painel).toBeVisible();
    await expect(gatilho).toHaveAttribute('aria-describedby', painel.id);
    // O conteúdo estruturado é anunciado junto do gatilho.
    await expect(gatilho).toHaveAccessibleDescription(/605\.922\.293-51/);

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('tooltip')).toBeNull());
    // Fechar não rouba o foco de quem estava navegando.
    await expect(gatilho).toHaveFocus();
  },
};

export const AtrasosDoPonteiro: Story = {
  name: 'HoverCard · atraso de abertura maior que o de fechamento',
  parameters: {
    docs: {
      description: {
        story:
          'Abrir instantâneo faz o painel piscar quando o ponteiro só está cruzando a célula; por isso a abertura espera (300ms por padrão, 120ms nesta story para o teste). O fechamento espera menos (150ms por padrão), o suficiente para atravessar a lacuna até o painel sem que ele desabe.',
      },
    },
  },
  render: (args) => (
    <div style={{ padding: 48 }}>
      <HoverCard {...args} atrasoAbertura={120} atrasoFechamento={80}>
        <button>0004921/2025</button>
      </HoverCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: '0004921/2025' });

    // Cruzou e saiu antes do atraso vencer: o painel nunca chega a abrir.
    await userEvent.hover(gatilho);
    await expect(canvas.queryByRole('tooltip')).toBeNull();
    await userEvent.unhover(gatilho);
    await new Promise((resolver) => setTimeout(resolver, 200));
    await expect(canvas.queryByRole('tooltip')).toBeNull();

    // Parou sobre a célula: o painel abre depois do atraso.
    await userEvent.hover(gatilho);
    await waitFor(() => expect(canvas.getByRole('tooltip')).toBeVisible());

    // Saiu do gatilho: a folga de fechamento segura o painel aberto por um
    // instante, que é a janela para atravessar até dentro dele.
    await userEvent.unhover(gatilho);
    await expect(canvas.getByRole('tooltip')).toBeVisible();
    await waitFor(() => expect(canvas.queryByRole('tooltip')).toBeNull());
  },
};

export const AtravessaAteOPainel: Story = {
  name: 'HoverCard · o ponteiro entra no painel e copia',
  parameters: {
    docs: {
      description: {
        story:
          'O painel cancela o próprio fechamento quando o ponteiro chega nele: dá para selecionar e copiar um número de processo, que é o que o `Tooltip` (com `pointer-events: none`) nunca permite. É o "passível de hover" da WCAG 1.4.13.',
      },
    },
  },
  render: (args) => (
    <div style={{ padding: 48 }}>
      <HoverCard {...args} atrasoAbertura={80} atrasoFechamento={120}>
        <button>Paciente</button>
      </HoverCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Paciente' });

    await userEvent.hover(gatilho);
    const painel = await canvas.findByRole('tooltip');

    // Sai do gatilho e entra no painel dentro da folga de fechamento.
    await userEvent.unhover(gatilho);
    await userEvent.hover(painel);
    await new Promise((resolver) => setTimeout(resolver, 300));
    await expect(canvas.getByRole('tooltip')).toBeVisible();

    // Só quando o ponteiro abandona o painel ele fecha.
    await userEvent.unhover(painel);
    await waitFor(() => expect(canvas.queryByRole('tooltip')).toBeNull());
  },
};

export const EscapaDoOverflow: Story = {
  name: 'HoverCard · escapa do overflow da tabela',
  parameters: {
    docs: {
      description: {
        story:
          'A `.citie-table-wrapper` corta o que passa da borda. O painel sobe para a top layer do navegador pela API de `popover`, um plano que nenhum `overflow` nem contexto de empilhamento do caminho alcança, e continua no lugar dele no DOM, herdando os tokens do tema.',
      },
    },
  },
  render: (args) => (
    <div
      data-testid="moldura-com-overflow"
      style={{
        overflow: 'hidden',
        height: 56,
        width: 360,
        border: '1px solid var(--citie-border-default)',
        borderRadius: 'var(--citie-radius-lg)',
        padding: 'var(--citie-spacing-3)',
        boxSizing: 'border-box',
      }}
    >
      <HoverCard {...args}>
        <button>Maria da Conceição Santos</button>
      </HoverCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const moldura = canvas.getByTestId('moldura-com-overflow');

    await userEvent.tab();
    const painel = await canvas.findByRole('tooltip');

    // Ocupa mais espaço do que caberia dentro da moldura cortada.
    const caixaPainel = painel.getBoundingClientRect();
    const caixaMoldura = moldura.getBoundingClientRect();
    await expect(caixaPainel.bottom).toBeGreaterThan(caixaMoldura.bottom);

    // E o trecho que passou da borda continua pintado e apontável, medido pela
    // prova de acerto do navegador. Contenção no DOM não provaria isto: sair da
    // árvore da moldura não impede recorte de ancestral, e é a top layer, onde
    // o `overflow: hidden` não alcança, que faz o painel escapar.
    const abaixoDaBorda = document.elementFromPoint(
      caixaPainel.left + caixaPainel.width / 2,
      caixaMoldura.bottom + (caixaPainel.bottom - caixaMoldura.bottom) / 2,
    );
    await expect(painel.contains(abaixoDaBorda)).toBe(true);
  },
};

export const ViraQuandoNaoCabe: Story = {
  name: 'HoverCard · vira para o outro lado na borda da janela',
  parameters: {
    docs: {
      description: {
        story:
          'O lado preferido é `bottom`, mas perto do rodapé da janela o painel mede o espaço e vira para cima sozinho, sem nunca sair da área visível.',
      },
    },
  },
  render: (args) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'flex-start',
        height: 'calc(100vh - 96px)',
      }}
    >
      <HoverCard {...args} posicao="bottom">
        <button>Última linha da tabela</button>
      </HoverCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const gatilho = canvas.getByRole('button', { name: 'Última linha da tabela' });

    await userEvent.tab();
    const painel = await canvas.findByRole('tooltip');

    // Sem espaço embaixo, o painel virou para cima do gatilho.
    await expect(painel.className).toContain('citie-hover-card--top');
    const caixaPainel = painel.getBoundingClientRect();
    const caixaGatilho = gatilho.getBoundingClientRect();
    await expect(caixaPainel.bottom).toBeLessThanOrEqual(caixaGatilho.top);
    // E continua inteiro dentro da janela.
    await expect(caixaPainel.top).toBeGreaterThanOrEqual(0);
  },
};

export const DentroDeDialogModal: Story = {
  name: 'HoverCard · dentro de Dialog modal',
  parameters: {
    docs: {
      description: {
        story:
          'O `Dialog` do catálogo usa `dialog` nativo em modo modal, que sobe para a top layer do navegador e pinta acima de qualquer `z-index` da árvore comum. Um painel preso à árvore comum ficaria atrás do backdrop, escurecido e fora do alcance do ponteiro. Por isso o painel também sobe para a top layer, pela API nativa de `popover` em modo `manual`: lá a ordem é de chegada, e quem abre por último pinta por cima. O portal sozinho falharia nas duas pontas, e a medição mostrou as duas: portalizado para fora do diálogo o painel fica atrás do backdrop, e portalizado para dentro dele, sem `popover`, é recortado pelo `overflow: auto` que a folha do navegador dá ao `dialog`.\n\nO gatilho desta story está dentro de um parágrafo de propósito, que é a forma real de uso ("Solicitante: fulano"). O painel é conteúdo em fluxo, então nascer ao lado do gatilho seria marcação inválida; o portal o leva para o `dialog[open]` ancestral, onde ele herda os tokens do tema e continua apontável, porque modal deixa inerte tudo o que está fora dele.\n\nAs verificações medem com `elementFromPoint`, sem confiar no aspecto: o ponto central do painel tem que devolver o próprio painel.',
      },
    },
  },
  render: (args) => {
    function DialogoDeProcesso() {
      const [aberto, setAberto] = useState(false);
      return (
        <div style={{ padding: 24 }}>
          <Button variant="primary" onClick={() => setAberto(true)}>
            Abrir processo
          </Button>
          <Dialog
            aberto={aberto}
            onClose={() => setAberto(false)}
            titulo="Processo 0004921/2025"
            subtitulo="Encaminhamento para tratamento fora do domicílio"
            rodape={
              <Button variant="secondary" onClick={() => setAberto(false)}>
                Fechar
              </Button>
            }
          >
            {/*
             * Parágrafo de propósito: é a forma real de uso, e é o aninhamento
             * que o painel precisa suportar sem gerar marcação inválida.
             */}
            <p style={{ margin: 0 }}>
              Solicitante:{' '}
              <HoverCard {...args} atrasoAbertura={80} atrasoFechamento={120}>
                <Link href="#processo">Maria da Conceição Santos</Link>
              </HoverCard>
            </p>
          </Dialog>
        </div>
      );
    }

    return <DialogoDeProcesso />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.click(canvas.getByRole('button', { name: 'Abrir processo' }));

    const dialogo = canvasElement.querySelector('dialog.citie-dialog') as HTMLDialogElement;
    await expect(dialogo.open).toBe(true);

    const gatilho = canvas.getByRole('link', { name: 'Maria da Conceição Santos' });
    await userEvent.hover(gatilho);
    const painel = await canvas.findByRole('tooltip');

    // O painel nasceu dentro do próprio diálogo, porque modal deixa inerte
    // tudo o que está do lado de fora, inclusive quem está na top layer.
    await expect(dialogo.contains(painel)).toBe(true);

    // E nunca dentro do parágrafo que envolve o gatilho: painel é conteúdo em
    // fluxo, e parágrafo só aceita texto. É o portal que garante isto, e é a
    // razão inteira de ele existir depois que a top layer resolveu a pintura.
    await expect(painel.closest('p')).toBeNull();
    await expect(gatilho.closest('p')).not.toBeNull();

    // Prova de que nada pinta por cima: o ponto central do painel devolve o
    // próprio painel na prova de acerto do navegador. Enquanto o painel estava
    // na árvore comum, este mesmo ponto devolvia o DIALOG, porque o backdrop
    // da top layer cobria tudo.
    const caixa = painel.getBoundingClientRect();
    const noCentro = document.elementFromPoint(
      caixa.left + caixa.width / 2,
      caixa.top + caixa.height / 2,
    );
    await expect(painel.contains(noCentro)).toBe(true);

    // E o painel não foi recortado na borda do diálogo: parte dele fica abaixo
    // do rodapé do modal, ainda apontável.
    const caixaDialogo = dialogo.getBoundingClientRect();
    await expect(caixa.bottom).toBeGreaterThan(caixaDialogo.bottom);

    // Centrado no gatilho: a medição da origem escreve no estilo do painel, e
    // escrever ali por fora do React já custou a posição uma vez.
    const caixaGatilho = gatilho.getBoundingClientRect();
    const centroDoPainel = (caixa.left + caixa.right) / 2;
    const centroDoGatilho = (caixaGatilho.left + caixaGatilho.right) / 2;
    await expect(Math.abs(centroDoPainel - centroDoGatilho)).toBeLessThan(1);

    // Dentro da janela, e não empurrado para fora dela pela origem do `fixed`:
    // o diálogo entra com `translate` animado, então enquanto a entrada roda
    // ele é bloco de contenção e vira a origem do painel.
    await expect(caixa.top).toBeGreaterThanOrEqual(0);
    await expect(caixa.bottom).toBeLessThanOrEqual(window.innerHeight);

    // E o conteúdo continua alcançável: o rótulo do CPF responde ao ponteiro.
    const cpf = within(painel).getByText('605.922.293-51');
    const caixaCpf = cpf.getBoundingClientRect();
    await expect(
      cpf.contains(
        document.elementFromPoint(
          caixaCpf.left + caixaCpf.width / 2,
          caixaCpf.top + caixaCpf.height / 2,
        ),
      ),
    ).toBe(true);

    // Escape fecha em camadas: some o painel, o diálogo continua aberto.
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(canvas.queryByRole('tooltip')).toBeNull());
    await expect(dialogo.open).toBe(true);
  },
};

export const EstruturaCompleta: Story = {
  name: 'HoverCard · seções, divisor, mono e truncamento',
  parameters: {
    docs: {
      description: {
        story:
          'A anatomia do painel: título do objeto, pares rótulo e valor em duas colunas, divisor entre seções, valores de código em Red Hat Mono com números tabulares, e trecho longo truncado em 3 linhas, porque painel de hover é amostra e o texto inteiro pertence ao detalhe.',
      },
    },
  },
  render: (args) => (
    <div style={{ padding: 48 }}>
      <HoverCard {...args} atrasoAbertura={80}>
        <button>Ver estrutura</button>
      </HoverCard>
    </div>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await userEvent.hover(canvas.getByRole('button', { name: 'Ver estrutura' }));
    const painel = await canvas.findByRole('tooltip');

    // Pares rótulo e valor de verdade, em lista de definição.
    await expect(painel.querySelectorAll('dt')).toHaveLength(7);
    await expect(painel.querySelectorAll('dd')).toHaveLength(7);

    // Divisor entre as duas seções, um só.
    const secoes = painel.querySelectorAll('.citie-hover-card__secao');
    await expect(secoes).toHaveLength(2);
    await expect(getComputedStyle(secoes[1]).borderTopWidth).toBe('1px');

    // Código em mono com números tabulares; trecho longo em 3 linhas.
    const processo = within(painel).getByText('0004921/2025');
    await expect(getComputedStyle(processo).fontVariantNumeric).toBe('tabular-nums');
    const observacao = within(painel).getByText(/tratamento oncológico contínuo/);
    await expect(getComputedStyle(observacao).webkitLineClamp).toBe('3');
  },
};
