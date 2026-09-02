import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fireEvent, within } from 'storybook/test';
import { RangeSlider, Slider } from './Slider';

const meta = {
  title: 'Átomos/Entrada/Slider',
  component: Slider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          'Entrada numérica por arrasto. Origem: Figma CitieOne, página ❖ Slider (variantes Slide, Input, Range, Direction, Disabled). Cores e medidas seguem os tokens Citiesoft do vault, não o azul padrão do PrimeOne. Equivalente PrimeNG: `p-slider`.\n\n**Quando usar:** para valor aproximado dentro de uma faixa curta e conhecida, em que ver a posição no trilho ajuda mais do que digitar, como um percentual de meta ou um intervalo de filtro.\n\n**Quando não usar:** para valor que entra no processo e será auditado (valor em reais, quantidade de diárias, número de dias de afastamento). O arrasto erra por um pixel, o servidor grava 47 no lugar de 45 e o erro só aparece na prestação de contas; use `Input` numérico ou, se o trilho for mesmo desejado, ative `comEntrada` para o campo numérico ficar ao lado. Para faixa larga, de 0 a 10000: cada pixel do trilho passa a valer dezenas de unidades e chegar ao número desejado vira tentativa e erro, mesmo pelas setas do teclado. Para escolher entre poucas opções nomeadas (Baixa, Média, Alta): o slider obriga a memorizar que 2 significa Média, e quem usa a tela de forma esporádica não memoriza; use `RadioGroup` ou `SelectButton`. Para mostrar andamento sem permitir ajuste, use `ProgressBar`, porque o trilho com alça convida ao arrasto e sugere que o dado pode ser mudado ali. Intervalo de datas também não é caso de `RangeSlider`: use `DatePicker`, que fala em dia e mês.',
      },
    },
  },
  args: { label: 'Percentual de execução' },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  name: 'Direction · horizontal',
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const controle = canvas.getByRole('slider', { name: 'Percentual de execução' });

    await expect(controle).toHaveValue('50');

    // A navegação por seta é ação padrão do input[type=range] do navegador, que
    // o userEvent não reproduz. O que é nosso, e o que o teste cobre, é a
    // ligação do valor e o trilho preenchido acompanhando.
    fireEvent.change(controle, { target: { value: '75' } });
    await expect(controle).toHaveValue('75');
    await expect(canvas.getByText('75')).toBeVisible();

    /*
     * O marcador pintado mede 16px, anatomia do kit. O alvo de toque é outro
     * número: o `<input>` inteiro é o hit-box nativo do range, e o WCAG 2.5.8
     * pede 24px mínimo nele. Medir a caixa do próprio elemento, e não a do
     * marcador, é o que prova que o alvo real cresceu e não só a moldura.
     */
    await expect(controle.getBoundingClientRect().height).toBeGreaterThanOrEqual(24);
  },
};

export const Vertical: Story = {
  name: 'Direction · vertical',
  args: { direction: 'vertical' },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const controle = canvas.getByRole('slider', { name: 'Percentual de execução' });

    // No vertical o eixo de toque é a largura, perpendicular ao curso do valor.
    await expect(controle.getBoundingClientRect().width).toBeGreaterThanOrEqual(24);
  },
};

export const ComEntrada: Story = {
  name: 'Input · com campo numérico',
  args: { comEntrada: true },
  parameters: {
    docs: {
      description: {
        story: 'Para valor exato, o campo numérico entra ao lado e compartilha o mesmo estado.',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.getByRole('spinbutton', { name: 'Percentual de execução, valor exato' }),
    ).toBeVisible();
  },
};

export const Desabilitado: Story = {
  name: 'Estado · desabilitado',
  args: { disabled: true },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).getByRole('slider')).toBeDisabled();
  },
};

const reais = (valor: number) =>
  valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export const Formatado: Story = {
  name: 'Conteúdo · valor formatado',
  args: {
    label: 'Valor máximo da diária',
    min: 0,
    max: 5000,
    step: 50,
    defaultValue: 1250,
    formatar: reais,
  },
  parameters: {
    docs: {
      description: {
        story:
          'O valor formatado vai também para `aria-valuetext`, então o leitor de tela anuncia "R$ 1.250,00" em vez de "1250".',
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    // Comparar com o mesmo formatador: o pt-BR insere espaço não separável
    // depois de "R$", então a string literal não bate.
    await expect(canvas.getByRole('slider')).toHaveAttribute('aria-valuetext', reais(1250));
  },
};

export const Faixa: Story = {
  name: 'Range · duas pontas',
  parameters: {
    docs: {
      description: {
        story: 'As duas pontas são nomeadas, cada uma como controle próprio para o teclado.',
      },
    },
  },
  render: () => (
    <RangeSlider
      label="Faixa de valor da diária"
      rotuloInicio="Valor mínimo"
      rotuloFim="Valor máximo"
      min={0}
      max={5000}
      step={50}
      defaultValue={[500, 3000]}
      formatar={reais}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole('slider', { name: 'Valor mínimo' })).toBeVisible();
    await expect(canvas.getByRole('slider', { name: 'Valor máximo' })).toBeVisible();
  },
};
