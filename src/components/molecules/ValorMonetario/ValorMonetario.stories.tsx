import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { ValorMonetario } from './ValorMonetario';

const meta = {
  title: 'Moléculas/Visualização/ValorMonetario',
  component: ValorMonetario,
  tags: ['autodocs', 'molecule', 'a11y', 'play-fn'],
  parameters: {
    docs: {
      description: {
        component: [
          'Célula de valor monetário. Fecha a lacuna nº 14 do mapa do protótipo TFD, onde dinheiro aparece em Passagens, Ajuda de Custo e na aba Financeiro, e cada tela reimplementa a formatação por conta própria.',
          '',
          '**Quando usar:** sempre que um valor em reais aparecer em coluna de tabela, em linha de resumo ou em ficha de detalhe. O componente entrega três coisas que vinham sendo improvisadas: `font-variant-numeric: tabular-nums`, para a coluna continuar alinhada quando o valor muda de largura de dígito; alinhamento à direita, para a comparação vertical acontecer pela casa decimal; e os estados de cancelamento e de reembolso descontado.',
          '',
          '**Formatação num lugar só.** O catálogo já formalizou o caso análogo de CPF com `mascararCPF`, dentro de `Organismos/Tabelas/Table`, justamente para a máscara parar de ser redeclarada em cada tela. Dinheiro tinha o mesmo problema: um helper local `reais` na story de Table, um `fmtBRL` por página no TFD. O helper `formatarReais`, exportado daqui, é a formatação oficial, e usa `Intl.NumberFormat` em pt-BR, nunca concatenação de string.',
          '',
          '**Acessibilidade.** O risco do valor cancelado é pista visual e não chega a quem usa leitor de tela, então o nome acessível diz "valor cancelado" por extenso. Pelo mesmo motivo o nome acessível fala "reais" em vez de depender da leitura de "R$", e diz "menos" quando o valor é negativo, já que o sinal costuma ser omitido na fala.',
          '',
          '**Quando não usar:**',
          '',
          '- **Para número que não é dinheiro** (contagem de processos, quantidade de diárias, percentual). Aqui o símbolo da moeda estaria mentindo sobre a natureza do dado. Formate no `render` da coluna de `Organismos/Tabelas/Table` com `alinhamento: "direita"`.',
          '- **Para digitar um valor.** Este componente só apresenta. A entrada é `Moléculas/Campos/Input`.',
          '- **Para o total de destaque de um painel.** Um número que abre a tela precisa de rótulo acima, escala de display e comparação com o período anterior, que é a anatomia de `Organismos/Painel/KpiWidget`.',
          '- **Para o valor ausente.** Célula sem valor não é `R$ 0,00`: zero é uma informação, ausência é outra. Use `SemRegistro`, exportado de `Organismos/Tabelas/Table`, com texto que declare a causa ("Sem base para calcular").',
          '- **Para dizer que o registro foi cancelado.** A prop `cancelado` marca o valor dentro da linha. O estado do processo no fluxo pertence a `Átomos/Marcadores/StatusIndicator`, que usa o glossário oficial de estados.',
        ].join('\n'),
      },
    },
  },
  args: { valor: 1284.5, descricao: 'Passagem de ida' },
} satisfies Meta<typeof ValorMonetario>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Padrao: Story = {
  name: 'Valor corrente',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('R$ 1.284,50')).toBeVisible();
    // O nome acessível fala a moeda por extenso, sem depender da leitura de "R$".
    await expect(canvas.getByText('Passagem de ida, 1.284,50 reais.')).toBeInTheDocument();

    const principal = canvasElement.querySelector('.citie-valor__principal')!;
    // `tabular-nums` é o que mantém a coluna alinhada quando o valor muda.
    await expect(getComputedStyle(principal).fontVariantNumeric).toContain('tabular-nums');
  },
};

export const Cancelado: Story = {
  name: 'Estado · cancelado',
  args: { cancelado: true },
  parameters: {
    docs: {
      description: {
        story:
          'Risco mais cor recuada na tela, e "valor cancelado" dito no nome acessível. O risco sozinho não informa quem não vê a tela.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const principal = canvasElement.querySelector('.citie-valor__principal')!;
    await expect(getComputedStyle(principal).textDecorationLine).toBe('line-through');
    await expect(
      canvas.getByText('Passagem de ida, 1.284,50 reais, valor cancelado.'),
    ).toBeInTheDocument();
  },
};

export const ComReembolso: Story = {
  name: 'Estado · reembolso descontado',
  args: { reembolso: 320 },
  parameters: {
    docs: {
      description: {
        story:
          'A segunda linha mostra o que já voltou aos cofres. Fica um degrau abaixo em tamanho porque é apoio do valor principal, nunca um segundo valor de mesmo peso.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('-R$ 320,00 reembolsado')).toBeVisible();
    await expect(
      canvas.getByText('Passagem de ida, 1.284,50 reais, com reembolso de 320,00 reais descontado.'),
    ).toBeInTheDocument();
  },
};

export const CanceladoComReembolso: Story = {
  name: 'Estado · cancelado com reembolso',
  args: { cancelado: true, reembolso: 1284.5 },
  parameters: {
    docs: {
      description: {
        story:
          'Passagem cancelada com devolução integral. Os dois estados convivem, e o nome acessível declara os dois na ordem em que aparecem.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByText(
        'Passagem de ida, 1.284,50 reais, valor cancelado, com reembolso de 1.284,50 reais descontado.',
      ),
    ).toBeInTheDocument();
  },
};

export const Zero: Story = {
  name: 'Borda · valor zero',
  args: { valor: 0, descricao: 'Ajuda de custo' },
  parameters: {
    docs: {
      description: {
        story:
          'Zero é informação: significa que o cálculo rodou e deu nada a pagar. Não confunda com ausência de valor, que pede `SemRegistro` com a causa escrita.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('R$ 0,00')).toBeVisible();
    await expect(canvas.getByText('Ajuda de custo, 0,00 reais.')).toBeInTheDocument();
  },
};

export const Negativo: Story = {
  name: 'Borda · valor negativo',
  args: { valor: -412.9, descricao: 'Saldo a devolver' },
  parameters: {
    docs: {
      description: {
        story:
          'Devolução ao erário. O nome acessível diz "menos" por extenso, porque o sinal costuma ser engolido na fala e uma devolução viraria cobrança.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText('Saldo a devolver, menos 412,90 reais.')).toBeInTheDocument();
  },
};

export const EmColuna: Story = {
  name: 'Uso · coluna de tabela',
  parameters: {
    docs: {
      description: {
        story:
          'Quatro linhas empilhadas mostram o que `tabular-nums` mais alinhamento à direita resolvem: a vírgula decimal cai na mesma vertical mesmo com valores de larguras diferentes.',
      },
    },
  },
  render: () => (
    <div style={{ display: 'grid', gap: 8, width: 260 }}>
      <ValorMonetario valor={12.9} descricao="Diária parcial" />
      <ValorMonetario valor={1284.5} descricao="Passagem de ida" />
      <ValorMonetario valor={98111.05} descricao="Total do mês" />
      <ValorMonetario valor={740} descricao="Passagem de volta" cancelado reembolso={740} />
    </div>
  ),
  play: async ({ canvasElement }) => {
    const valores = canvasElement.querySelectorAll('.citie-valor__principal');
    await expect(valores).toHaveLength(4);
    const direitas = [...valores].map((v) => Math.round(v.getBoundingClientRect().right));
    // Alinhamento à direita: todas as bordas direitas coincidem.
    await expect(new Set(direitas).size).toBe(1);
  },
};
